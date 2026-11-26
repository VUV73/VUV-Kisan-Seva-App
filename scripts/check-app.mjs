import { readFileSync } from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const html = readFileSync("index.html", "utf8");
const navMatch = html.match(/<nav class="bottomnav"[^>]*>([\s\S]*?)<\/nav>/i);
assert.ok(navMatch, "Bottom navigation must exist");
const navLinks = [...navMatch[1].matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)];
assert.equal(navLinks.length, 3, "Bottom navigation must have exactly three items");
const labels = navLinks.map(([, body]) => body.replace(/<[^>]+>/g, "").trim());
assert.deepEqual(labels, ["सभी सेवाएँ", "सूचनाएँ", "मेरा खाता"], "Navigation labels/order must remain fixed");

const heroMatch = html.match(/<div class="hero"[\s\S]*?<img\b([^>]*)>/i);
assert.ok(heroMatch, "Agriculture hero image must exist");
assert.match(heroMatch[1], /alt="[^"]*(?:खेत|कृषि|फसल|ट्रैक्टर)[^"]*"/i, "Hero must describe an agriculture/nature image");
assert.doesNotMatch(heroMatch[1], /app-icon-photo|father|पिताजी|पापा/i, "Father's portrait must not be used in the hero");

assert.match(html, /const questions=\[/, "Quiz question bank must exist");
const questionsStart = html.indexOf("const questions=[");
const questionsEnd = html.indexOf("];", questionsStart);
assert.ok(questionsEnd > questionsStart, "Quiz question bank must close");
const questionBank = html.slice(questionsStart, questionsEnd + 2);
assert.equal((questionBank.match(/\{q:/g) || []).length, 60, "Quiz bank must contain exactly 60 questions");
assert.match(html, /DAILY_QUESTION_LIMIT=30/, "Daily quiz limit must remain 30");

for (const key of ["vuvFarmer", "vuvScore", "vuvAnswered", "vuvQuizProgressDate", "vuvQuizDailyCount", "vuvQuizHistory"]) {
  assert.ok(html.includes(JSON.stringify(key)), \`Backup must include \${key}\`);
}
for (const phone of ["8726088430", "7388799010"]) assert.ok(html.includes(phone), \`Contact \${phone} must remain\`);
assert.ok(html.includes("maps.app.goo.gl/f8Lxuis63DY5kjyr7"), "Shop map link must remain");

const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
assert.ok(scripts.length, "App JavaScript must exist");
for (const [, source] of scripts) new vm.Script(source, { filename: "index.html:inline-script" });

console.log("VUV app checks passed: 3 navigation items, agriculture hero, 60 quiz questions, 30/day, backup keys, contacts, map link, JavaScript syntax.");
