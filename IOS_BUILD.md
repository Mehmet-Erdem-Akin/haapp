# 🍎 iOS Build Rehberi

## ✅ Yapılan Yapılandırmalar

1. ✅ `app.json` - iOS buildNumber eklendi
2. ✅ `eas.json` - iOS production profili eklendi
3. ✅ Bundle Identifier: `com.haapp.medication`
4. ✅ Build Number: `1`

## 🚀 iOS Build Adımları

### 1. Expo Hesabına Giriş

```bash
eas login
```

Eğer hesabınız yoksa: https://expo.dev adresinden ücretsiz hesap oluşturun.

### 2. iOS Build Başlat

**Preview (Test) Build:**
```bash
eas build --platform ios --profile preview
```

**Production (App Store) Build:**
```bash
eas build --platform ios --profile production
```

### 3. Apple Developer Hesabı

iOS build için Apple Developer hesabı gerekebilir:
- **Ücretsiz Hesap:** Preview build'ler için yeterli (sınırlı)
- **Ücretli Hesap ($99/yıl):** Production build ve App Store için gerekli
- Hesap: https://developer.apple.com

**İlk Build'de:**
- EAS Build otomatik olarak sertifikaları yönetir
- Apple Developer hesabı bilgileriniz istenecek
- Sertifika oluşturma onayı istenecek

### 4. Build Süreci

- Build işlemi Expo'nun bulut sunucularında gerçekleşir
- Süre: Yaklaşık 15-30 dakika
- Terminal'de build URL'si görünecek
- Build tamamlandığında email ile bilgilendirileceksiniz

### 5. IPA İndirme

**Yöntem 1: Expo Dashboard**
1. https://expo.dev adresine giriş yapın
2. Projenizi seçin
3. "Builds" sekmesine gidin
4. Tamamlanan iOS build'i bulun
5. "Download" butonuna tıklayın

**Yöntem 2: Terminal**
```bash
# Build listesini görüntüle
eas build:list

# Belirli build'i indir
eas build:download [BUILD_ID]
```

### 6. TestFlight'a Yükleme (Önerilen)

```bash
eas submit --platform ios
```

Bu komut:
- Build'i App Store Connect'e yükler
- TestFlight'a ekler
- Test kullanıcılarına dağıtım yapabilirsiniz

### 7. Doğrudan Cihaza Yükleme

1. IPA dosyasını indirin
2. Xcode ile yükleyin:
   - Xcode'u açın
   - Window > Devices and Simulators
   - Cihazınızı seçin
   - "+" butonuna tıklayın
   - IPA dosyasını seçin

3. Cihazda güvenilir yapın:
   - Ayarlar > Genel > VPN ve Cihaz Yönetimi
   - Developer App'i seçin
   - "Güven" butonuna tıklayın

## 📋 Build Profilleri

### Preview
- IPA formatında
- Test için uygundur
- App Store'a yüklenmez
- Ücretsiz Apple Developer hesabı ile çalışabilir

### Production
- App Store için hazır
- Optimize edilmiş
- Ücretli Apple Developer hesabı gerekli ($99/yıl)

## 🔧 Yapılandırma Detayları

### app.json iOS Ayarları
```json
{
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": "com.haapp.medication",
    "buildNumber": "1",
    "infoPlist": {
      "UIBackgroundModes": [
        "remote-notification"
      ]
    }
  }
}
```

### eas.json iOS Profilleri
```json
{
  "preview": {
    "ios": {
      "simulator": false
    }
  },
  "production": {
    "ios": {
      "simulator": false
    }
  }
}
```

## ⚠️ Önemli Notlar

1. **Build Number:** Her yeni build'de `app.json`'daki `ios.buildNumber` değerini artırın
2. **Version:** `app.json`'daki `version` değerini güncelleyin
3. **Sertifikalar:** EAS Build otomatik olarak yönetir, manuel işlem gerekmez
4. **TestFlight:** Production build'i TestFlight'a yüklemek için `eas submit` kullanın

## 🐛 Sorun Giderme

### Build Hataları
```bash
# Build loglarını görüntüle
eas build:list
eas build:view [BUILD_ID]
```

### Sertifika Sorunları
```bash
# Sertifikaları yeniden oluştur
eas credentials
```

### Cache Temizleme
```bash
eas build --clear-cache --platform ios
```

## 📚 Daha Fazla Bilgi

- [EAS Build iOS Dokümantasyonu](https://docs.expo.dev/build-reference/ios-builds/)
- [Apple Developer](https://developer.apple.com)
- [TestFlight Rehberi](https://developer.apple.com/testflight/)



