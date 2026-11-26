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

### साझा किसान Top 10 रैंकिंग
यह सुविधा केवल फोन के localStorage से संभव नहीं है। सभी किसानों के अंकों को एक ही सुरक्षित डेटाबेस में भेजना और वहाँ से पढ़ना होगा। इसके लिए Supabase backend जोड़ा जाना है। डेटाबेस में केवल किसान का दिखने वाला नाम, गाँव, अवधि और अंक रखे जाएँ; मोबाइल नंबर और खेत का क्षेत्रफल कभी सार्वजनिक न हों। अंकों की हेराफेरी रोकने के लिए सर्वर-साइड सत्यापन और सीमित write access जरूरी है। Supabase परियोजना इस repository से अलग user account में बनेगी; कोई database password या service-role key इस repository में commit नहीं करनी है।

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
