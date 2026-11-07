VUV किसान सेवा — अंतिम अपडेट पैकेज

इस पैकेज में:
1. index.html — नया हिंदी ऐप इंटरफेस और सेवाएँ
2. assets/vuv-logo.png — पिता जी की फोटो वाला VUV लोगो (होम स्क्रीन और Android ऐप आइकन)
3. back-handler.js — Android Back बटन का व्यवहार
4. .github/workflows/build-apk.yml — GitHub Actions से मुफ्त Debug APK बनाने की प्रक्रिया

इस अपडेट में:
- बसखारी, अंबेडकर नगर का लाइव मौसम (Open-Meteo)
- सरकारी मंडी भाव पोर्टल का लिंक (AGMARKNET); कीमतें बिना सत्यापन के नहीं दिखाई जातीं
- सरकारी योजनाओं और कृषि सूचनाओं के आधिकारिक लिंक
- गेहूँ, सरसों, चना, मटर, आलू, धान और गन्ना सलाह
- उर्वरक जानकारी, रोग/कीट से बचाव
- 30-दिवसीय कृषि क्विज़; अंक केवल उसी फोन में सेव
- किसान प्रोफाइल स्थानीय फोन में; OTP/मोबाइल अनिवार्य नहीं
- दुकान का सही Google Maps लिंक और दोनों संपर्क नंबर
- नया VUV लोगो और Android launcher icon
- Android Back बटन पर पिछले पेज पर लौटने का प्रयास

महत्वपूर्ण सीमाएँ:
- साझा Top 10 रैंकिंग के लिए सुरक्षित सर्वर/डेटाबेस चाहिए; यह इस संस्करण में चालू नहीं है।
- लाइव मंडी भाव ऐप के अंदर नहीं दिखाए जाते; सरकारी पोर्टल से जाँचने का लिंक दिया गया है।
- सरकारी सूचनाएँ संबंधित विभाग के आधिकारिक पोर्टल पर खुलती हैं।

GitHub में एक बार bulk upload:
1. ZIP को Extract करें।
2. निकली हुई फाइलों को अपने VUV73/VUV-Kisan-Seva-App repository के root में रखें, पुराने index.html और .github/workflows/build-apk.yml को replace करें।
3. GitHub पर Commit changes करें।
4. Actions → Build VUV Android APK → Run workflow चुनें।
5. Build सफल होने पर VUV-Kisan-Seva-APK artifact डाउनलोड करें।

यह Debug APK है; Play Store पर प्रकाशित करने के लिए अलग signing/release प्रक्रिया चाहिए।
