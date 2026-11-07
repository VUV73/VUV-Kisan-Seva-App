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
