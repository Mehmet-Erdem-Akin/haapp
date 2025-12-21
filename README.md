# 💊 haapp - İlaç Hatırlatma Uygulaması

React Native ile geliştirilmiş, yaşlılar ve düzenli ilaç kullananlar için tasarlanmış ilaç hatırlatma uygulaması.

## Özellikler

- ✅ İlaç ekleme, düzenleme ve silme
- ✅ Günlük tekrarlanan bildirimler
- ✅ Sesli bildirim desteği
- ✅ Yerel veri saklama (internet gerektirmez)
- ✅ iOS ve Android desteği
- ✅ Kullanıcı dostu arayüz

## Kurulum

### Gereksinimler

- Node.js (v16 veya üzeri)
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

## Teknik Detaylar

### Kullanılan Teknolojiler

- **React Native** - Cross-platform mobil uygulama framework
- **Expo** - React Native geliştirme platformu
- **expo-notifications** - Yerel bildirim yönetimi
- **@react-native-async-storage/async-storage** - Yerel veri saklama
- **@react-native-community/datetimepicker** - Zaman seçici
- **TypeScript** - Tip güvenliği

### Veri Yapısı

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

### Bildirim Sistemi

- Uygulama her ilaç için günlük tekrarlanan bildirimler oluşturur
- Bildirimler cihazın yerel bildirim sistemi üzerinden çalışır
- İnternet bağlantısı gerektirmez
- iOS ve Android için optimize edilmiştir

## Önemli Notlar

- **iOS İzinleri**: İlk açılışta bildirim izni istenir. İzin verilmezse bildirimler çalışmaz.
- **Android Doze Mode**: Android cihazlarda pil tasarrufu modu bildirimleri geciktirebilir. Uygulama "Exact Alarm" izinlerini kullanır.
- **Veri Kaybı**: Veriler sadece cihazda saklanır. Uygulama silinirse veriler kaybolur.

## Lisans

Bu proje özel kullanım içindir.

