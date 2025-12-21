# 💊 haapp - İlaç ve Su Hatırlatma Uygulaması

React Native ile geliştirilmiş, yaşlılar ve düzenli ilaç kullananlar için tasarlanmış ilaç ve su içme hatırlatma uygulaması.

## ✨ Özellikler

### 💊 İlaç Yönetimi
- ✅ İlaç ekleme, düzenleme ve silme
- ✅ Günlük tekrarlanan bildirimler
- ✅ İlaç içildi onayı ("İçtim" butonu)
- ✅ Günlük ilaç takibi

### 💧 Su İçme Hatırlatıcısı
- ✅ Su içme hatırlatmaları ekleme/düzenleme/silme
- ✅ Günlük su miktarı takibi (litre cinsinden)
- ✅ Hızlı ekleme butonları (250ml, 500ml, 750ml)
- ✅ Bildirim desteği

### 📊 Günlük Takip
- ✅ İçilen ilaçlar listesi
- ✅ Bekleyen ilaçlar listesi
- ✅ Su içme kayıtları (saat ve miktar)
- ✅ Günlük toplam su miktarı
- ✅ İstatistikler ve özet bilgiler

### 🔔 Bildirimler
- ✅ Sesli bildirim desteği
- ✅ Yerel bildirimler (internet gerektirmez)
- ✅ Bildirimden "içtim" onayı
- ✅ iOS ve Android desteği

### 📱 Kullanıcı Arayüzü
- ✅ Modern tab navigasyon (İlaçlar, Su, Günlük)
- ✅ Kullanıcı dostu arayüz
- ✅ Erişilebilirlik özellikleri
- ✅ Yerel veri saklama (internet gerektirmez)

## 🚀 Kurulum

### Gereksinimler

- Node.js (v20 veya üzeri)
- npm veya yarn
- Expo CLI
- iOS Simulator (Mac için) veya Android Emulator

### Adımlar

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Uygulamayı başlatın:
```bash
npm start
```

3. iOS için:
```bash
npm run ios
```

4. Android için:
```bash
npm run android
```

## 📱 Kullanım

### İlaçlar Sekmesi
- **İlaç Ekleme:** Sağ alttaki "+" butonuna tıklayarak yeni ilaç ekleyin
- **İlaç Düzenleme:** İlaç kartındaki ✏️ butonuna tıklayın
- **İlaç Silme:** İlaç kartındaki 🗑️ butonuna tıklayın
- **İçtim Onayı:** İlaç kartındaki ✓ butonuna tıklayarak ilacı içildi olarak işaretleyin

### Su Sekmesi
- **Hatırlatma Ekleme:** Sağ alttaki "+" butonuna tıklayarak su içme hatırlatması ekleyin
- **Hızlı Ekleme:** 250ml, 500ml veya 750ml butonlarına tıklayarak hızlıca su içme kaydı oluşturun
- **Günlük Toplam:** Ekranın üst kısmında bugün içilen toplam su miktarını görün

### Günlük Takip Sekmesi
- **İstatistikler:** Bugün içilen ilaç sayısı, bekleyen ilaç sayısı ve toplam su miktarı
- **İçilen İlaçlar:** Bugün içilen tüm ilaçların listesi ve içilme saatleri
- **Bekleyen İlaçlar:** Henüz içilmemiş ilaçların listesi
- **Su Kayıtları:** Bugün içilen su miktarları ve saatleri

## 🛠️ Teknik Detaylar

### Kullanılan Teknolojiler

- **React Native** - Cross-platform mobil uygulama framework
- **Expo** - React Native geliştirme platformu
- **React Navigation** - Tab navigasyon için
- **expo-notifications** - Yerel bildirim yönetimi
- **@react-native-async-storage/async-storage** - Yerel veri saklama
- **@react-native-community/datetimepicker** - Zaman seçici
- **TypeScript** - Tip güvenliği

### Veri Yapısı

#### İlaç (Medication)
```json
{
  "id": "string",
  "name": "string",
  "dosage": "string",
  "time": "HH:mm",
  "days": "everyday",
  "notificationId": "string"
}
```

#### Su Hatırlatması (WaterReminder)
```json
{
  "id": "string",
  "time": "HH:mm",
  "amount": 250,
  "notificationId": "string"
}
```

#### Günlük Kayıt (DailyRecord)
```json
{
  "date": "YYYY-MM-DD",
  "medications": [
    {
      "medicationId": "string",
      "medicationName": "string",
      "time": "HH:mm",
      "taken": true,
      "takenAt": "ISO timestamp"
    }
  ],
  "water": [
    {
      "time": "HH:mm",
      "amount": 250,
      "totalAmount": 500
    }
  ]
}
```

### Bildirim Sistemi

- Uygulama her ilaç ve su hatırlatması için günlük tekrarlanan bildirimler oluşturur
- Bildirimler cihazın yerel bildirim sistemi üzerinden çalışır
- İnternet bağlantısı gerektirmez
- iOS ve Android için optimize edilmiştir

### Proje Yapısı

```
haapp/
├── src/
│   ├── components/          # UI bileşenleri
│   │   ├── MedicationItem.tsx
│   │   ├── WaterReminderItem.tsx
│   │   └── AppProviders.tsx
│   ├── context/             # Context API state yönetimi
│   │   ├── MedicationContext.tsx
│   │   ├── WaterContext.tsx
│   │   └── DailyContext.tsx
│   ├── navigation/           # Navigasyon yapısı
│   │   └── TabNavigator.tsx
│   ├── screens/              # Ekranlar
│   │   ├── MedicationsScreen.tsx
│   │   ├── WaterScreen.tsx
│   │   ├── DailyScreen.tsx
│   │   ├── AddMedicationScreen.tsx
│   │   └── AddWaterReminderScreen.tsx
│   ├── services/             # Servisler
│   │   ├── storage.ts
│   │   ├── notifications.ts
│   │   ├── waterStorage.ts
│   │   ├── waterNotifications.ts
│   │   └── dailyStorage.ts
│   └── types/                # TypeScript tipleri
│       ├── medication.ts
│       ├── water.ts
│       └── daily.ts
├── App.tsx                   # Ana uygulama bileşeni
├── app.json                  # Expo yapılandırması
└── package.json              # Bağımlılıklar
```

## 📦 Build ve Dağıtım

Detaylı build rehberi için `BUILD_GUIDE.md` dosyasına bakın.

### Hızlı Build

**Android APK:**
```bash
npm run build:android
```

**iOS:**
```bash
npm run build:ios
```

## ⚠️ Önemli Notlar

### iOS İzinleri
- İlk açılışta bildirim izni istenir. İzin verilmezse bildirimler çalışmaz.

### Android Doze Mode
- Android cihazlarda pil tasarrufu modu bildirimleri geciktirebilir. Uygulama "Exact Alarm" izinlerini kullanır.

### Veri Kaybı
- Veriler sadece cihazda saklanır. Uygulama silinirse veriler kaybolur.
- Cloud senkronizasyonu yoktur (gelecekte eklenebilir).

### Bildirimler
- Bildirimler yerel olarak çalışır, internet gerektirmez
- Cihaz kapalıyken veya uygulama arka plandayken de çalışır
- Bildirim sesi cihazın varsayılan bildirim sesidir

## 🔧 Geliştirme

### Scripts

- `npm start` - Expo geliştirme sunucusunu başlatır
- `npm run android` - Android emülatörde çalıştırır
- `npm run ios` - iOS simülatörde çalıştırır
- `npm run web` - Web tarayıcıda çalıştırır

### Cache Temizleme

```bash
rm -rf node_modules/.cache .expo .metro
npx expo start --clear
```

## 📝 Lisans

Bu proje özel kullanım içindir.

## 🤝 Katkıda Bulunma

Bu proje kişisel bir projedir. Sorularınız veya önerileriniz için issue açabilirsiniz.

## 📞 Destek

Sorun yaşarsanız:
1. Cache'i temizleyin
2. `node_modules` klasörünü silip yeniden yükleyin
3. Expo Go uygulamasını güncelleyin
4. Cihazı yeniden başlatın

---

**Not:** Bu uygulama tıbbi tavsiye vermez. İlaç kullanımı için mutlaka doktorunuza danışın.
