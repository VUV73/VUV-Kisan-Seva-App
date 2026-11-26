
const byId=id=>document.getElementById(id);
const weatherText={0:"साफ आसमान",1:"मुख्यतः साफ",2:"आंशिक बादल",3:"बादल",45:"कोहरा",48:"घना कोहरा",51:"हल्की बूंदाबांदी",53:"बूंदाबांदी",55:"तेज बूंदाबांदी",61:"हल्की बारिश",63:"मध्यम बारिश",65:"तेज बारिश",80:"हल्की बौछार",81:"मध्यम बौछार",82:"तेज बौछार",95:"गरज-चमक के साथ बारिश",96:"ओलों के साथ गरज-चमक",99:"तेज ओलों के साथ गरज-चमक"};
const weatherLabel=code=>weatherText[code]||"स्थिति उपलब्ध नहीं";
const dayHindi=iso=>new Date(iso+"T12:00:00").toLocaleDateString("hi-IN",{weekday:"short",day:"numeric",month:"short"});
async function loadWeather(){
 const status=byId("weatherStatus");status.textContent="मौसम का ताज़ा डेटा लोड हो रहा है…";
 try{
  const url="https://api.open-meteo.com/v1/forecast?latitude=26.40&longitude=82.70&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&forecast_days=3&timezone=Asia%2FKolkata";
  const res=await fetch(url,{cache:"no-store"});if(!res.ok)throw new Error("weather");const data=await res.json(),c=data.current,d=data.daily;
  byId("wTemp").textContent=Math.round(c.temperature_2m)+"°C";byId("wFeels").textContent=Math.round(c.apparent_temperature)+"°C";byId("wHumidity").textContent=c.relative_humidity_2m+"%";byId("wWind").textContent=Math.round(c.wind_speed_10m)+" km/h";
  byId("wCondition").textContent=weatherLabel(c.weather_code);byId("wRain").textContent=(d.precipitation_probability_max?.[0]??"—")+"% (अनुमान)";
  byId("wUpdated").textContent="अंतिम अपडेट: "+new Date().toLocaleString("hi-IN");
  byId("weatherForecast").innerHTML=d.time.map((date,i)=>'<div class="tile"><b>'+dayHindi(date)+'</b><p>'+weatherLabel(d.weather_code[i])+'</p><p>अधिकतम '+Math.round(d.temperature_2m_max[i])+'°C · न्यूनतम '+Math.round(d.temperature_2m_min[i])+'°C</p><p>बारिश '+(d.precipitation_probability_max?.[i]??"—")+'% · '+(d.precipitation_sum?.[i]??0)+' mm</p></div>').join("");
  status.textContent="लाइव मौसम डेटा अपडेट हो गया।";
 }catch(e){status.textContent="अभी मौसम डेटा नहीं मिल पाया। इंटरनेट जाँचकर फिर प्रयास करें।";byId("wCondition").textContent="मौसम डेटा उपलब्ध नहीं";byId("weatherForecast").innerHTML='<div class="tile">IMD की आधिकारिक चेतावनी देखें या बाद में फिर प्रयास करें।</div>';}
}
function openMandi(){const crop=byId("commodity").value,dist=byId("mandiDistrict").value;window.open("https://agmarknet.gov.in/","_blank","noopener");byId("mandiHint").textContent="सरकारी पोर्टल खुल गया है। वहाँ फसल में "+crop+" और जिले में "+dist+" चुनकर भाव देखें। कीमत की पुष्टि मंडी और तारीख देखकर करें।";}
const questions=[
{q:"गेहूँ की बुवाई के लिए कौन-सा बीज चुनना चाहिए?",o:["टूटा बीज","प्रमाणित और स्वस्थ बीज","सड़ा बीज"],a:1},
{q:"चना की फसल के लिए कैसी जल-निकासी जरूरी है?",o:["अच्छी जल-निकासी","लगातार जलभराव","कोई जरूरत नहीं"],a:0},
{q:"मिट्टी की जाँच से क्या पता चलता है?",o:["खाद की जरूरत","मोबाइल नेटवर्क","मंडी का समय"],a:0},
{q:"कीटनाशक छिड़कते समय क्या पहनना चाहिए?",o:["नंगे हाथ","दस्ताने और मास्क","कुछ नहीं"],a:1},
{q:"खरपतवार फसल से किसके लिए प्रतिस्पर्धा करते हैं?",o:["पानी और पोषक तत्व","मोबाइल चार्ज","मंडी भाव"],a:0},
{q:"बीज उपचार का मुख्य उद्देश्य क्या है?",o:["बीजजनित रोगों का जोखिम घटाना","अंकुरण रोकना","बीज सड़ाना"],a:0},
{q:"खेत में लगातार पानी भरने से किस फसल को नुकसान हो सकता है?",o:["चना","कमल","सिंघाड़ा"],a:0},
{q:"पौधों में नाइट्रोजन की कमी से सामान्यतः क्या दिखता है?",o:["पुरानी पत्तियाँ पीली होना","फल नीला होना","जड़ चमकना"],a:0},
{q:"फसल में दवा डालने से पहले क्या करना चाहिए?",o:["रोग/कीट की पहचान","मात्रा दोगुनी करना","दूसरी फसल की दवा डालना"],a:0},
{q:"मृदा स्वास्थ्य कार्ड किससे संबंधित है?",o:["मिट्टी के पोषक तत्व","मौसम का तापमान","ट्रैक्टर का बीमा"],a:0},
{q:"सरसों की अच्छी बढ़वार के लिए क्या जरूरी है?",o:["संतुलित पोषण","हमेशा जलभराव","बिना जरूरत दवा"],a:0},
{q:"आलू की बुवाई के लिए कैसा बीज-कंद चुनना चाहिए?",o:["स्वस्थ और रोगमुक्त","सड़ा हुआ","कटा-फटा"],a:0},
{q:"पौधों को पानी कब देना बेहतर है?",o:["फसल की जरूरत और मिट्टी की नमी देखकर","हर घंटे","कभी नहीं"],a:0},
{q:"फसल अवशेष जलाने से क्या नुकसान हो सकता है?",o:["मिट्टी और हवा को नुकसान","मिट्टी में सोना बनना","बारिश बढ़ना"],a:0},
{q:"जैव उर्वरक का उपयोग कैसे करना चाहिए?",o:["निर्देशानुसार और सही फसल में","किसी भी मात्रा में","कीटनाशक समझकर"],a:0},
{q:"पौधों में फास्फोरस किसमें मदद करता है?",o:["जड़ विकास में","मोबाइल नेटवर्क में","खेत की मेड़ रंगने में"],a:0},
{q:"फसल की नियमित निगरानी क्यों जरूरी है?",o:["समस्या जल्दी पहचानने के लिए","खेत का आकार बदलने के लिए","बीज का रंग बदलने के लिए"],a:0},
{q:"मधुमक्खियाँ खेती में किस काम आती हैं?",o:["परागण में मदद","मिट्टी जोतना","सिंचाई करना"],a:0},
{q:"छिड़काव के समय हवा तेज हो तो क्या करना चाहिए?",o:["छिड़काव टालें","हवा की ओर दवा छिड़कें","मात्रा बढ़ाएँ"],a:0},
{q:"फसल चक्र अपनाने का एक लाभ क्या है?",o:["मिट्टी की सेहत बनाए रखने में मदद","हर रोग खत्म होने की गारंटी","सिंचाई की जरूरत शून्य"],a:0},
{q:"धान की रोपाई के लिए पौध कैसी होनी चाहिए?",o:["स्वस्थ और उपयुक्त अवस्था की","सूखी और मरी हुई","कीट से भरी"],a:0},
{q:"कृषि यंत्र चलाते समय क्या जरूरी है?",o:["सुरक्षा निर्देशों का पालन","ढीले कपड़े मशीन में रखना","चलती मशीन साफ करना"],a:0},
{q:"खाद की सही मात्रा किस आधार पर तय करें?",o:["मिट्टी जाँच और फसल की जरूरत","पड़ोसी की मात्रा की नकल","अनुमान से दोगुनी"],a:0},
{q:"बीज को बोने से पहले क्या देखना चाहिए?",o:["अंकुरण क्षमता और गुणवत्ता","पैकेट का रंग","दुकान की दूरी"],a:0},
{q:"खेत में जलभराव रोकने का उपाय क्या है?",o:["उचित जल-निकासी नाली","सभी नालियाँ बंद करना","और पानी भरना"],a:0},
{q:"पौधों में पोटाश किसमें सहायक है?",o:["पौधे की मजबूती और गुणवत्ता","बीज का वजन शून्य करना","मिट्टी को पत्थर बनाना"],a:0},
{q:"कीटनाशक का खाली पैकेट क्या करना चाहिए?",o:["लेबल निर्देशानुसार सुरक्षित निपटान","बच्चों को देना","पानी के स्रोत में फेंकना"],a:0},
{q:"किसान को सरकारी योजना की जानकारी कहाँ से पक्की करनी चाहिए?",o:["आधिकारिक सरकारी पोर्टल","अफवाह","अनजान संदेश"],a:0},
{q:"फसल में रोग का लक्षण दिखे तो क्या करें?",o:["सही पहचान कर विशेषज्ञ से सलाह","हर दवा एक साथ डालें","सिंचाई बंद कर दें"],a:0},
{q:"मटर और चना जैसी दलहनी फसलें किस प्रक्रिया से मिट्टी में नाइट्रोजन बढ़ाने में मदद करती हैं?",o:["जड़ों की गांठों में सहजीवी जीवाणु","पत्तियों पर धूल","फल का रंग"],a:0}
];
const now=new Date(),dateKey=now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate(),dayNo=Math.floor((new Date(now.getFullYear(),now.getMonth(),now.getDate())-new Date(now.getFullYear(),0,0))/86400000);
let dailyQuizCount=0;try{if(localStorage.getItem("vuvQuizProgressDate")!==dateKey){localStorage.setItem("vuvQuizProgressDate",dateKey);localStorage.setItem("vuvQuizDailyCount","0");}dailyQuizCount=Number(localStorage.getItem("vuvQuizDailyCount")||0)}catch(e){}
let currentQuestion=questions[(dayNo+dailyQuizCount)%questions.length];
function renderQuiz(){
 currentQuestion=questions[(dayNo+dailyQuizCount)%questions.length];
 byId("question").textContent=dailyQuizCount>=questions.length?"आज के सभी 30 प्रश्न पूरे हो गए! कल फिर नए प्रश्न मिलेंगे।":currentQuestion.q;
 const box=byId("options");box.innerHTML="";
 if(dailyQuizCount<questions.length){currentQuestion.o.forEach((opt,i)=>{const b=document.createElement("button");b.className="quiz-option";b.textContent=opt;b.addEventListener("click",()=>answerQuiz(i));box.appendChild(b)});}
 updateScore();
}
function answerQuiz(i){
 if(dailyQuizCount>=questions.length)return;
 const buttons=byId("options").querySelectorAll("button");buttons.forEach(b=>b.disabled=true);
 let score=Number(localStorage.getItem("vuvScore")||0),answered=Number(localStorage.getItem("vuvAnswered")||0);
 if(i===currentQuestion.a){score+=10;byId("quizMsg").textContent="सही जवाब! आपको 10 अंक मिले।"}else byId("quizMsg").textContent="सही उत्तर: "+currentQuestion.o[currentQuestion.a];
 try{localStorage.setItem("vuvScore",String(score));localStorage.setItem("vuvAnswered",String(answered+1));dailyQuizCount+=1;localStorage.setItem("vuvQuizDailyCount",String(dailyQuizCount));}catch(e){byId("quizMsg").textContent="फोन में अंक सुरक्षित नहीं हो पाए।"}
 renderQuiz();
}
function updateScore(){try{byId("score").textContent=localStorage.getItem("vuvScore")||"0";byId("answered").textContent=localStorage.getItem("vuvAnswered")||"0"}catch(e){}}
const VUV_BACKUP_KEYS=["vuvFarmer","vuvScore","vuvAnswered","vuvQuizProgressDate","vuvQuizDailyCount"];
function exportBackup(){
 try{
  const data={app:"VUV Kisan Seva",version:1,createdAt:new Date().toISOString(),data:{}};
  VUV_BACKUP_KEYS.forEach(k=>{const v=localStorage.getItem(k);if(v!==null)data.data[k]=v;});
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="VUV-Kisan-Seva-Backup-"+new Date().toISOString().slice(0,10)+".json";
  document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  byId("backupMsg").textContent="बैकअप फ़ाइल बन गई। इसे फोन में सुरक्षित रखें।";
 }catch(e){byId("backupMsg").textContent="बैकअप नहीं बन पाया। फोन में खाली जगह जाँचें।";}
}
function importBackup(event){
 const file=event.target.files&&event.target.files[0];if(!file)return;
 const msg=byId("backupMsg");
 if(file.size>1048576){msg.textContent="यह बैकअप फ़ाइल बहुत बड़ी है या मान्य नहीं है।";event.target.value="";return;}
 const reader=new FileReader();
 reader.onload=()=>{
  try{
   const backup=JSON.parse(String(reader.result||""));
   if(backup.app!=="VUV Kisan Seva"||backup.version!==1||!backup.data||typeof backup.data!=="object")throw new Error("invalid");
   const incoming={};
   VUV_BACKUP_KEYS.forEach(k=>{if(Object.prototype.hasOwnProperty.call(backup.data,k)){if(typeof backup.data[k]!=="string")throw new Error("invalid");incoming[k]=backup.data[k];}});
   if(!Object.keys(incoming).length)throw new Error("empty");
   if(incoming.vuvFarmer){const p=JSON.parse(incoming.vuvFarmer);if(!p||typeof p!=="object"||typeof p.name!=="string"||typeof p.village!=="string")throw new Error("invalid");}
   ["vuvScore","vuvAnswered","vuvQuizDailyCount"].forEach(k=>{if(incoming[k]!==undefined&&(!/^\d+$/.test(incoming[k])||Number(incoming[k])>100000000))throw new Error("invalid");});
   if(!confirm("बैकअप की जानकारी इस फोन की मौजूदा प्रोफाइल और क्विज़ के अंकों की जगह लेगी। क्या आप आगे बढ़ना चाहते हैं?")){msg.textContent="बैकअप वापस लाना रद्द किया गया।";return;}
   const previous={};VUV_BACKUP_KEYS.forEach(k=>previous[k]=localStorage.getItem(k));
   try{Object.keys(incoming).forEach(k=>localStorage.setItem(k,incoming[k]));}
   catch(err){VUV_BACKUP_KEYS.forEach(k=>{if(previous[k]===null)localStorage.removeItem(k);else localStorage.setItem(k,previous[k]);});throw err;}
   loadFarmer();updateScore();renderQuiz();msg.textContent="बैकअप सफलतापूर्वक वापस आ गया।";
  }catch(e){msg.textContent="बैकअप फ़ाइल सही नहीं है या उसे पढ़ा नहीं जा सका।";}
  finally{event.target.value="";}
 };
 reader.onerror=()=>{msg.textContent="फ़ाइल पढ़ने में समस्या हुई।";event.target.value="";};
 reader.readAsText(file);
}
let selectedFarmerPhoto="";
function saveFarmer(){
 const p={name:byId("farmerName").value.trim(),village:byId("farmerVillage").value.trim(),area:byId("farmerArea").value,unit:byId("farmerUnit").value,photo:selectedFarmerPhoto};
 if(!p.name||!p.village||!p.area||Number(p.area)<=0){byId("profileMsg").textContent="कृपया नाम, गाँव और सही क्षेत्रफल भरें।";return}
 try{localStorage.setItem("vuvFarmer",JSON.stringify(p));byId("profileMsg").textContent="आपकी जानकारी और फोटो इसी फोन में सुरक्षित हो गई।"}catch(e){byId("profileMsg").textContent="फोटो बड़ी होने से सेव नहीं हुई। छोटी फोटो चुनकर फिर कोशिश करें।"}
}
function clearFarmer(){try{localStorage.removeItem("vuvFarmer")}catch(e){}["farmerName","farmerVillage","farmerArea"].forEach(id=>byId(id).value="");selectedFarmerPhoto="";byId("farmerPhotoPreview").src="";byId("profileMsg").textContent="प्रोफाइल हटा दी गई।"}
function loadFarmer(){try{const p=JSON.parse(localStorage.getItem("vuvFarmer")||"null");if(p){byId("farmerName").value=p.name||"";byId("farmerVillage").value=p.village||"";byId("farmerArea").value=p.area||"";byId("farmerUnit").value=p.unit||"बीघा";selectedFarmerPhoto=p.photo||"";if(selectedFarmerPhoto)byId("farmerPhotoPreview").src=selectedFarmerPhoto}}catch(e){}}
byId("farmerPhoto").addEventListener("change",e=>{const file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith("image/")){byId("profileMsg").textContent="कृपया फोटो फ़ाइल चुनें।";return;}const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{const canvas=document.createElement("canvas"),max=420,scale=Math.min(1,max/Math.max(img.width,img.height));canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);selectedFarmerPhoto=canvas.toDataURL("image/jpeg",0.72);byId("farmerPhotoPreview").src=selectedFarmerPhoto;byId("profileMsg").textContent="फोटो चुन ली गई है। अब जानकारी सुरक्षित करें।"};img.src=reader.result};reader.readAsDataURL(file);});
function setActiveNav(id){
 const target=(id==="profile")?2:(id==="news")?1:0;
 document.querySelectorAll(".bottomnav a").forEach((a,i)=>a.classList.toggle("active",i===target));
}
function showScreen(id,push=true){
 const valid=["home","weather","mandi","crops","fertilizer","schemes","protection","news","quiz","profile","contact"];
 if(!valid.includes(id))id="home";
 document.querySelectorAll("main > .section").forEach(s=>s.classList.toggle("active",s.id===id));
 document.body.dataset.screen=id;setActiveNav(id);window.scrollTo({top:0,behavior:"auto"});
 if(push){history.pushState({screen:id},"", "#"+id);}
}
window.addEventListener("popstate",e=>showScreen(e.state?.screen||"home",false));
// Service cards and navigation links open one page at a time.
document.querySelectorAll(".service").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showScreen(a.getAttribute("href").slice(1));}));
document.querySelectorAll(".bottomnav a").forEach((a,i)=>a.addEventListener("click",e=>{e.preventDefault();showScreen(["home","news","profile"][i]);}));
if(!history.state?.screen)history.replaceState({screen:"home"},"","#home");
document.body.dataset.screen=history.state?.screen||"home";
renderQuiz();loadFarmer();loadWeather();
