# VUV किसान सेवा — सुधारा हुआ Android प्रोजेक्ट

इस पैकेज में वही पहले से तैयार पिताजी की फोटो वाला VUV लोगो रखा गया है।

## इसमें किए गए सुधार
- लोगो `assets/vuv-logo.png` में जोड़ा गया; होम स्क्रीन और APK launcher icon दोनों के लिए।
- होम स्क्रीन पर केवल सेवा टाइलें दिखती हैं; सेवा चुनने पर उसका अलग पेज खुलता है।
- मोबाइल Back बटन सेवा से पिछली स्क्रीन पर लौटता है; होम पर ऐप बंद करता है।
- किसान अपने खाते में अपनी अलग फोटो चुन सकता है; फोटो और विवरण उसी फोन में सेव होते हैं।
- APK workflow अब logo asset कॉपी करता है और Back-button JavaScript को bundle करता है।

## GitHub में अपलोड
इस ZIP को extract करके इसकी सभी फाइलें अपने `VUV73/VUV-Kisan-Seva-App` repository की `main` branch में upload करें और existing files replace करें। `.github/workflows/build-apk.yml` भी replace होना चाहिए। फिर GitHub Actions में `Build VUV Kisan Seva APK` चलाएँ।

## सुरक्षित साझा रैंकिंग और APK अपडेट — जरूरी अगला चरण

### साझा किसान Top 10 रैंकिंग — backend तैयार, Auth का एक विकल्प चालू करना बाकी
- Supabase प्रोजेक्ट `VUV-Kisan-Seva` भारत (Mumbai) region में बनाया गया है।
- निजी `vuv_private` schema में किसान की सार्वजनिक पहचान (नाम/गाँव), स्कोर और प्रश्न-उत्तर रिकॉर्ड अलग रखे गए हैं। मोबाइल नंबर और खेत का क्षेत्रफल सर्वर पर नहीं भेजे जाते।
- सार्वजनिक Top 10 views केवल नाम, गाँव और अंक दिखाते हैं; daily, weekly और monthly रैंकिंग अलग हैं।
- `vuv-quiz-submit` Edge Function सक्रिय है। सर्वर उत्तर की जाँच करता है, प्रति दिन अधिकतम 30 प्रश्न और हर प्रश्न का एक ही प्रयास लागू करता है। क्लाइंट सीधे अंक लिख नहीं सकता।
- RLS और Security Advisor जाँच पूरी: अभी कोई security lint नहीं मिला।
- Anonymous Sign-Ins चालू करने का निर्देश उपयोगकर्ता को दिया गया है और उपयोगकर्ता ने चालू कर देने की पुष्टि की है। अगली APK जाँच में वास्तविक anonymous session और quiz submission सत्यापित करना बाकी है। [Auth Providers खोलें](https://supabase.com/dashboard/project/efgxnvvmtipqfibhsbri/auth/providers)।
- नया APK build/फोन पर परीक्षण बाकी है। पुराना APK update करने से पहले signing-key की समस्या और किसान डेटा का backup ध्यान में रखें। ऐप में बैकअप बनाएं/वापस लाएँ विकल्प मौजूद है; अनइंस्टॉल करने से पहले बैकअप फ़ाइल बनाकर सुरक्षित रखें।

किसी भी database password या service-role key को repository, ऐप या ChatGPT में न रखें। ऐप में केवल publishable key है; यह public client key है और सभी writes server-side function से नियंत्रित हैं।
### पुराने APK पर सुरक्षित अपडेट
Workflow अब स्थायी release signing के बिना APK जारी नहीं करेगा। GitHub repository के Settings → Secrets and variables → Actions में ये चार **Repository secrets** बनाने होंगे:
- VUV_KEYSTORE_BASE64 — release keystore की Base64 सामग्री
- VUV_KEYSTORE_PASSWORD — keystore password
- VUV_KEY_ALIAS — key alias
- VUV_KEY_PASSWORD — key password

ये मान केवल GitHub Secrets में डालें; WhatsApp, ChatGPT चैट, README या source code में कभी न लिखें। पहले से इंस्टॉल APK की signing certificate से मेल खाती private key के बिना नया APK पुराने ऐप के ऊपर अपडेट नहीं हो सकता। इसलिए मौजूदा installed APK की signing certificate जाँचे बिना कोई नई key बनाकर पुराने ऐप पर update करने की कोशिश न करें। अगर पुरानी private key उपलब्ध नहीं है, तो पहले app के अंदर backup बनाकर अलग migration योजना बनानी होगी; किसान का data सुरक्षित किए बिना uninstall न करें।

### मौजूदा सीमाएँ
- अभी shared Top 10 live नहीं है; क्विज़ की रिपोर्ट इस फोन पर निजी है।
- सरकारी सूचनाएँ आधिकारिक वेबसाइटों के लिंक हैं, automatic live feed नहीं।
- Notification tab अभी सूचनाओं के पेज पर जाता है; Android push notification सेवा अभी सक्रिय नहीं है।
- APK build manual रखा गया है और permanent signing secrets के बिना release नहीं बनेगा।
