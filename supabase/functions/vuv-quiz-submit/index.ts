import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const answerKey = [
  1,0,0,1,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0
];

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function indiaDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "केवल POST अनुरोध मान्य है।" }, 405);

  try {
    const url = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (!url || !anonKey || !serviceKey) return json({ error: "सर्वर कॉन्फ़िगरेशन उपलब्ध नहीं है।" }, 500);

    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token || token === authHeader) return json({ error: "कृपया ऐप में सुरक्षित सत्र शुरू करें।" }, 401);

    const authClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: authData, error: authError } = await authClient.auth.getUser(token);
    const user = authData?.user;
    if (authError || !user || user.is_anonymous !== true) {
      return json({ error: "किसान सत्र की पुष्टि नहीं हो सकी।" }, 401);
    }

    const body = await req.json();
    const questionId = body?.question_id;
    const selectedIndex = body?.selected_option_index;
    const displayName = typeof body?.display_name === "string" ? body.display_name.trim() : "";
    const village = typeof body?.village === "string" ? body.village.trim() : "";

    if (!Number.isInteger(questionId) || questionId < 0 || questionId >= answerKey.length ||
        !Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex > 2 ||
        displayName.length < 1 || displayName.length > 60 ||
        village.length < 1 || village.length > 80) {
      return json({ error: "प्रश्न या किसान की जानकारी सही नहीं है।" }, 400);
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await admin.rpc("vuv_submit_quiz_answer", {
      p_user_id: user.id,
      p_display_name: displayName,
      p_village: village,
      p_quiz_date: indiaDate(),
      p_question_id: questionId,
      p_is_correct: selectedIndex === answerKey[questionId],
    });
    if (error) {
      console.error("quiz submission failed", error.message);
      return json({ error: "अंक सुरक्षित नहीं हो पाए। कृपया फिर प्रयास करें।" }, 500);
    }

    const result = Array.isArray(data) ? data[0] : data;
    if (!result?.accepted && !result?.already_answered) {
      return json({ accepted: false, limit_reached: true, daily_points: result?.daily_points ?? 0, daily_attempts: result?.daily_attempts ?? 0 });
    }
    return json({
      accepted: result.accepted,
      already_answered: result.already_answered,
      correct: selectedIndex === answerKey[questionId],
      daily_points: result.daily_points,
      daily_attempts: result.daily_attempts,
    });
  } catch (error) {
    console.error("unexpected quiz function error", error);
    return json({ error: "अभी अनुरोध पूरा नहीं हो पाया। कृपया दोबारा प्रयास करें।" }, 500);
  }
});