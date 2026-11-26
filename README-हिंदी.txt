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
### APK signing जाँच — एक ही फोन पर update अभी रोकें
- Build #10 के installed APK certificate SHA-256: `B8:78:72:16:08:3B:BF:60:9C:50:A4:03:F3:0A:9B:2D:93:A8:1D:63:BC:CC:CE:16:9E:C4:E1:C2:86:A8:C7:23`।
- Build #13 certificate SHA-256: `4A:BF:51:06:47:A1:AD:DE:96:94:24:6A:0D:58:B6:5C:C8:FF:08:D6:F1:D9:87:C0:05:19:CB:A7:F9:59:D3:A4`।
- दोनों fingerprints अलग हैं। ये APK अलग-अलग temporary Android Debug signing keys से बने थे। इसलिए Build #10 के ऊपर Build #13 या नई signing key वाला APK update नहीं होगा।
- पुरानी debug private key GitHub Actions के हर नए runner में दोबारा बनी; APK से private key वापस नहीं निकाली जा सकती। नया permanent release key पुरानी app के ऊपर update करने के लिए पर्याप्त नहीं है।
- सुरक्षित रास्ता: पुरानी app में उपलब्ध **बैकअप बनाएं** विकल्प से JSON backup लें; फिर नई permanent key और अलग package ID वाली migration app बनाएँ, उसे पुरानी app के साथ install करके backup import और Supabase ranking test करें। पुरानी app को तभी हटाएँ जब नई app और backup की पुष्टि हो जाए।
- नया signing keystore GitHub Actions secrets में सुरक्षित रखना होगा; keystore/password/alias को public repository में commit नहीं करना है। जब तक signing secrets उपलब्ध न हों, signed APK build नहीं चलाना है।

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
