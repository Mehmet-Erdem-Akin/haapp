# 📱 haapp - Build Rehberi

Bu rehber, haapp uygulamasını Android APK ve iOS için build almak için gerekli adımları içerir.

## 🚀 Hızlı Başlangıç

### 1. EAS CLI Kurulumu

```bash
npm install -g eas-cli
```

### 2. Expo Hesabı ile Giriş

```bash
eas login
```

Eğer Expo hesabınız yoksa, [expo.dev](https://expo.dev) adresinden ücretsiz hesap oluşturabilirsiniz.

### 3. EAS Build Yapılandırması

Proje zaten `eas.json` dosyası ile yapılandırılmıştır. Gerekirse düzenleyebilirsiniz.

---

## 🤖 Android APK Build

### Adım 1: Build Başlat

```bash
eas build --platform android --profile preview
```

veya production için:

```bash
eas build --platform android --profile production
```

### Adım 2: Build İşlemi

- Build işlemi Expo'nun bulut sunucularında gerçekleşir (yaklaşık 10-20 dakika)
- Terminal'de build URL'si görünecek
- Build tamamlandığında email ile bilgilendirileceksiniz

### Adım 3: APK İndirme

1. [expo.dev](https://expo.dev) adresine giriş yapın
2. Projenizi seçin
3. "Builds" sekmesine gidin
4. Tamamlanan build'i bulun ve "Download" butonuna tıklayın

### Adım 4: Telefona Yükleme

**Yöntem 1: Doğrudan İndirme**
- APK dosyasını telefonunuza indirin
- Dosya yöneticisinden APK'yı açın
- "Bilinmeyen kaynaklardan yükleme" iznini verin
- Yüklemeyi tamamlayın

**Yöntem 2: QR Kod ile**
- Build sayfasındaki QR kodu telefonunuzla tarayın
- APK'yı doğrudan indirin

---

## 🍎 iOS Build

### Ön Gereksinimler

1. **Apple Developer Hesabı** (yıllık $99)
   - [developer.apple.com](https://developer.apple.com) adresinden kayıt olun

2. **Sertifikalar**
   - EAS Build otomatik olarak sertifikaları yönetir
   - İlk build'de sizden onay isteyecektir

### Adım 1: Build Başlat

```bash
eas build --platform ios --profile preview
```

veya App Store için:

```bash
eas build --platform ios --profile production
```

### Adım 2: Build İşlemi

- Build işlemi Expo'nun bulut sunucularında gerçekleşir (yaklaşık 15-30 dakika)
- iOS build Android'den daha uzun sürer

### Adım 3: IPA İndirme ve Yükleme

**TestFlight (Önerilen):**
```bash
eas submit --platform ios
```

Bu komut:
- Build'i App Store Connect'e yükler
- TestFlight'a ekler
- Test kullanıcılarına dağıtım yapabilirsiniz

**Doğrudan Yükleme:**
1. [expo.dev](https://expo.dev) adresinden IPA'yı indirin
2. Xcode veya Apple Configurator ile cihaza yükleyin
3. Cihazda "Ayarlar > Genel > VPN ve Cihaz Yönetimi" bölümünden güvenilir yapın

---

## 📋 Build Profilleri

### Preview (Test)
- APK/IPA formatında
- Test için uygundur
- App Store'a yüklenmez

### Production (Yayın)
- App Store / Play Store için hazır
- Optimize edilmiş
- Yayın için uygundur

---

## 🔧 Yerel Build (Gelişmiş)

### Android APK (Yerel)

```bash
# Android Studio ve Java JDK kurulu olmalı
npx expo prebuild
cd android
./gradlew assembleRelease
```

APK dosyası: `android/app/build/outputs/apk/release/app-release.apk`

### iOS (Yerel)

```bash
# Xcode kurulu olmalı (sadece macOS)
npx expo prebuild
cd ios
xcodebuild -workspace haapp.xcworkspace -scheme haapp -configuration Release
```

---

## ⚙️ Yapılandırma

### app.json Ayarları

- `version`: Uygulama versiyonu (örn: "1.0.0")
- `android.versionCode`: Android build numarası (her build'de artırın)
- `ios.buildNumber`: iOS build numarası (her build'de artırın)

### Icon ve Splash Screen

Şu an varsayılan iconlar kullanılıyor. Özel icon eklemek için:

1. `assets/icon.png` (1024x1024) oluşturun
2. `assets/splash.png` (2048x2048) oluşturun
3. `app.json`'da path'leri güncelleyin

---

## 🐛 Sorun Giderme

### Build Hataları

```bash
# Build loglarını görüntüle
eas build:list
eas build:view [BUILD_ID]
```

### Cache Temizleme

```bash
eas build --clear-cache
```

### Yerel Test

Build almadan önce yerel olarak test edin:

```bash
npm start
```

---

## 📚 Daha Fazla Bilgi

- [EAS Build Dokümantasyonu](https://docs.expo.dev/build/introduction/)
- [Expo Build Rehberi](https://docs.expo.dev/distribution/building-standalone-apps/)
- [Android APK Dağıtımı](https://docs.expo.dev/build-reference/apk/)
- [iOS IPA Dağıtımı](https://docs.expo.dev/build-reference/ios-builds/)

---

## 💡 İpuçları

1. **İlk build daha uzun sürer** - Sonraki build'ler cache sayesinde daha hızlı olur
2. **TestFlight kullanın** - iOS için en kolay test yöntemi
3. **Version numaralarını artırın** - Her yeni build'de version code/number'ı artırın
4. **Build loglarını kontrol edin** - Hata durumunda logları inceleyin

---

**Sorularınız için:** [Expo Community](https://forums.expo.dev/) veya [Discord](https://chat.expo.dev/)

