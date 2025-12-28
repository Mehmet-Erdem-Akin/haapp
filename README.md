# haapp - Sağlık Takip Uygulaması

Modern ve kullanıcı dostu bir React Native sağlık takip uygulaması. İlaç hatırlatmaları, su takibi, günlük rutinler ve döngü takibi gibi birçok özelliği bir araya getiren kapsamlı bir super app.

## 📸 Ekran Görüntüleri

### Ana Ekranlar

<div align="center">

<img src="https://github.com/Mehmet-Erdem-Akin/haapp/blob/readme_update/src/images/screenshot-01.jpeg?raw=true" alt="İlaçlar Ekranı" width="250" />
<img src="https://github.com/Mehmet-Erdem-Akin/haapp/blob/readme_update/src/images/screenshot-02.jpeg?raw=true" alt="Su Takibi Ekranı" width="250" />
<img src="https://github.com/Mehmet-Erdem-Akin/haapp/blob/readme_update/src/images/screenshot-03.jpeg?raw=true" alt="Günlük Takip Ekranı" width="250" />

</div>

### Yeni Modüller

<div align="center">

<img src="https://github.com/Mehmet-Erdem-Akin/haapp/blob/readme_update/src/images/screenshot-04.jpeg?raw=true" alt="Rutinler Ekranı" width="250" />
<img src="https://github.com/Mehmet-Erdem-Akin/haapp/blob/readme_update/src/images/screenshot-05.jpeg?raw=true" alt="Döngü Ekranı" width="250" />
<img src="https://github.com/Mehmet-Erdem-Akin/haapp/blob/readme_update/src/images/screenshot-06.jpeg?raw=true" alt="Rutin Ekleme Ekranı" width="250" />

</div>

### Detay Ekranları

<div align="center">

<img src="https://github.com/Mehmet-Erdem-Akin/haapp/blob/readme_update/src/images/screenshot-07.jpeg?raw=true" alt="İlaç Detayları" width="250" />
<img src="https://github.com/Mehmet-Erdem-Akin/haapp/blob/readme_update/src/images/screenshot-08.jpeg?raw=true" alt="Su İstatistikleri" width="250" />
<img src="https://github.com/Mehmet-Erdem-Akin/haapp/blob/readme_update/src/images/screenshot-09.jpeg?raw=true" alt="Döngü Ayarları" width="250" />

</div>

<div align="center">

<img src="https://github.com/Mehmet-Erdem-Akin/haapp/blob/readme_update/src/images/screenshot-10.jpeg?raw=true" alt="Aylık Hedefler" width="250" />
<img src="https://github.com/Mehmet-Erdem-Akin/haapp/blob/readme_update/src/images/screenshot-11.jpeg?raw=true" alt="Rutin Detayları" width="250" />

</div>

## 🚀 Özellikler

### 💊 İlaç Takibi
- Günlük, haftalık, özel günlerde veya belirli aralıklarla ilaç hatırlatmaları
- Sabah/akşam gibi çoklu saat desteği
- Bitiş tarihi belirleme
- Günlük ilerleme takibi ve haftalık grafikler
- Push notification desteği
- İlaç alma durumu takibi (alındı, bekliyor, kaçırıldı)

### 💧 Su Takibi
- Özelleştirilebilir günlük su hedefi
- Çoklu su içme hatırlatmaları
- Günlük su tüketim takibi
- Haftalık istatistikler ve grafikler
- Push notification desteği
- Hızlı su ekleme butonları

### ✅ Günlük Rutinler
- Dinamik görev listesi oluşturma
- Alt görev (sub-task) desteği
- Tekrarlama seçenekleri:
  - Her gün
  - Hafta içi
  - Hafta sonu
  - Haftalık
  - Özel günler
- Rutin tamamlama takibi
- Günlük ilerleme yüzdesi
- Alt görevleri tek tek işaretleme

### 📅 Döngü & Aylık Hedefler
- **Genel Aylık Hedefler**: Ay sonuna kadar tamamlanacak hedefler belirleme
- **Regl Döngüsü Takibi** (Opsiyonel):
  - Son adet tarihi kaydı
  - Döngü uzunluğu ve adet süresi takibi
  - Sonraki adet tarihi tahmini
  - Belirti kayıtları (ruh hali, ağrı seviyesi, fiziksel belirtiler)

### 📊 Günlük Özet
- Günlük ilaç durumu (alındı, bekliyor, kaçırıldı)
- Günlük su tüketimi
- Tüm aktivitelerin tek ekranda görüntülenmesi
- Veri dışa aktarma özelliği

## 🛠 Teknolojiler

- **React Native** - Cross-platform mobil uygulama geliştirme
- **Expo** - Geliştirme ve build araçları
- **TypeScript** - Tip güvenliği
- **NativeWind** - Tailwind CSS benzeri styling
- **AsyncStorage** - Yerel veri saklama
- **Expo Notifications** - Push notification desteği
- **React Navigation** - Navigasyon yönetimi
- **Context API** - Global state yönetimi

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# iOS için pods yükle (sadece macOS)
cd ios && pod install && cd ..

# Geliştirme sunucusunu başlat
npm start

# iOS simülatörde çalıştır
npm run ios

# Android emülatörde çalıştır
npm run android
```

## 📱 Build

### Android
```bash
# Preview build
npm run build:android

# Production build
npm run build:android:prod
```

### iOS
```bash
# Preview build
npm run build:ios

# Production build
npm run build:ios:prod
```

## 📂 Proje Yapısı

```
src/
├── components/        # Reusable componentler
│   ├── v2/           # V2 componentleri (CircularProgress, Charts, etc.)
│   └── ...
├── context/          # Context API providers
│   ├── MedicationContext.tsx
│   ├── WaterContext.tsx
│   ├── DailyContext.tsx
│   ├── RoutineContext.tsx
│   └── CycleContext.tsx
├── navigation/       # Navigation yapılandırması
│   └── TabNavigator.tsx
├── screens/          # Ekranlar
│   ├── MedicationsScreen.tsx
│   ├── WaterScreen.tsx
│   ├── DailyScreen.tsx
│   ├── RoutinesScreen.tsx
│   ├── CycleScreen.tsx
│   └── ...
├── services/         # Business logic ve storage
│   ├── storage.ts
│   ├── waterStorage.ts
│   ├── routineStorage.ts
│   ├── cycleStorage.ts
│   ├── notifications.ts
│   ├── waterNotifications.ts
│   └── ...
└── types/            # TypeScript type tanımları
    ├── medication.ts
    ├── water.ts
    ├── routine.ts
    ├── cycle.ts
    └── daily.ts
```

## 🎯 Kullanım

### İlaç Ekleme
1. İlaçlar sekmesine gidin
2. Sağ üstteki + butonuna tıklayın
3. İlaç bilgilerini girin (isim, dozaj, saat)
4. Tekrarlama tipini seçin (günlük, haftalık, özel, vb.)
5. Bitiş tarihi belirleyin (opsiyonel)
6. Kaydet

### Su Hatırlatması Ekleme
1. Su sekmesine gidin
2. Sağ üstteki + butonuna tıklayın
3. Su miktarı ve saat bilgisini girin
4. Toplu hatırlatma oluşturabilirsiniz (başlangıç-bitiş saati ve aralık)
5. Kaydet

### Rutin Oluşturma
1. Rutinler sekmesine gidin
2. Sağ üstteki + butonuna tıklayın
3. Rutin başlığı, açıklama ve saat bilgisini girin
4. Tekrarlama tipini seçin
5. Alt görevler ekleyin (opsiyonel)
6. Kaydet

### Aylık Hedef Ekleme
1. Döngü sekmesine gidin
2. "Bu Ayın Hedefleri" bölümünde + butonuna tıklayın
3. Hedef başlığı, açıklama ve hedef sayıyı girin
4. Kaydet

### Regl Döngüsü Takibi
1. Döngü sekmesine gidin
2. Mod tipini "Regl Döngüsü Takibi" olarak değiştirin
3. İlk kurulum için "Regl Döngüsü Bilgilerini Ayarla" butonuna tıklayın
4. Son adet tarihi, döngü uzunluğu ve adet süresini girin
5. Kaydet

## 🔔 Bildirimler

Uygulama şu modüller için push notification desteği sunar:
- ✅ İlaç hatırlatmaları
- ✅ Su içme hatırlatmaları
- ⚠️ Günlük rutin hatırlatmaları (planlanmış, henüz aktif değil)
- ⚠️ Döngü hatırlatmaları (planlanmış, henüz aktif değil)

## 📝 Notlar

- Tüm veriler cihazda saklanır (local storage)
- Verileri dışa aktarabilirsiniz (JSON formatında)
- Bildirimler için gerekli izinler uygulama açılışında istenir
- Android'de bildirim kanalları otomatik oluşturulur

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen önce bir issue açın veya mevcut issue'lara göz atın.

## 📄 Lisans

Bu proje private bir projedir.
