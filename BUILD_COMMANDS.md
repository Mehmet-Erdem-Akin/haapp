# 🚀 Build Komutları

## Ön Hazırlık

1. **Expo hesabına giriş yapın:**
```bash
eas login
```

Eğer Expo hesabınız yoksa: https://expo.dev adresinden ücretsiz hesap oluşturun.

## Android APK Build

```bash
# Preview (Test) APK
eas build --platform android --profile preview

# Production APK
eas build --platform android --profile production
```

Build işlemi yaklaşık 10-20 dakika sürer. Build tamamlandığında:
- Email ile bilgilendirileceksiniz
- https://expo.dev adresinden APK'yı indirebilirsiniz
- Build sayfasında QR kod ile doğrudan telefona indirebilirsiniz

## iOS Build

```bash
# Preview (Test) IPA
eas build --platform ios --profile preview

# Production IPA (App Store için)
eas build --platform ios --profile production
```

**Not:** iOS build için Apple Developer hesabı gerekebilir (yıllık $99).

Build işlemi yaklaşık 15-30 dakika sürer.

## Her İki Platform İçin

```bash
# Hem Android hem iOS build
eas build --platform all --profile preview
```

## Build Durumunu Kontrol Etme

```bash
# Tüm build'leri listele
eas build:list

# Belirli bir build'in detaylarını görüntüle
eas build:view [BUILD_ID]
```

## Build İndirme

1. https://expo.dev adresine giriş yapın
2. Projenizi seçin
3. "Builds" sekmesine gidin
4. Tamamlanan build'i bulun ve "Download" butonuna tıklayın

## Hızlı Başlangıç

```bash
# 1. Giriş yap
eas login

# 2. Android APK build başlat
eas build --platform android --profile preview

# 3. iOS build başlat (opsiyonel)
eas build --platform ios --profile preview
```


