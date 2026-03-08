# 💰 WalletApp - Cüzdan Uygulaması

<div align="center">

[![React Native](https://img.shields.io/badgeNative-Ex/React%20po-blue?style=for-the-badge&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Platforms](https://img.shields.io/badge/Platforms-iOS%20%7C%20Android%20%7C%20Web-green?style=for-the-badge)](https://expo.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

Kullanımı kolay, çoklu platform cüzdan uygulaması. Gelir ve giderlerinizi takip edin, istatistiklerinizi analiz edin.

</div>

---

## 📱 Özellikler

### Ana Sayfa
- Toplam bakiye görünümü
- 4 ana menü: Hesaplarım, Günlük, İstatistik, Ayarlar
- Son hesap özeti

### 💳 Hesaplar
- **Nakit** - Fiziksel para
- **Banka Hesabı** - Banka hesapları
- **Kredi Kartı** - Kredi kartları
- Renkli bakiye göstergesi (Yeşil: Pozitif, Beyaz: Sıfır, Kırmızı: Negatif)
- Hesap ekleme, düzenleme, silme

### 📋 Hesap Detay
- Takvim seçici ile geçmiş işlemleri inceleme
- Günlük işlem listesi
- Bakiye takibi

### 💵 İşlemler
- Gelir/Gider işlemleri
- Tutar girişi
- İşlem adı (otomatik öneri dropdown)
- Kategori seçimi
- Not ekleme

### 📊 Günlük
- Takvim ile tarih seçimi
- Günlük gelir/gider özeti
- İşlem listesi

### 📈 İstatistik
- Aylık toplam gelir/gider
- Kategorilere göre harcama dağılımı
- Hesap bakiyeleri

### ⚙️ Ayarlar
- **Para Birimi**: TRY, USD, EUR
- **Tema**: Açık, Karanlık, Sistem
- **Yazı Boyutu**: Küçük, Orta, Büyük
- **Hesap Sıralama**: İsme, Bakiyeye, Tarihe göre
- **Otomatik Kategori Önerisi**
- **Bütçe Uyarıları**
- **Veri Dışa Aktarma/Temizleme**

---

## 🛠️ Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Framework | React Native (Expo) |
| Language | TypeScript |
| State Management | Zustand |
| Storage | AsyncStorage |
| Navigation | React Navigation |
| Calendar | react-native-calendars |

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 20+
- npm veya yarn

### Adımlar

```bash
# 1. Projeyi klonla
git clone https://github.com/osmankorucu/WalletApp.git
cd WalletApp

# 2. Bağımlılıkları yükle
npm install

# 3. Web için çalıştır
npm run web

# Veya Android için
npm run android

# Veya iOS için (macOS gerekli)
npm run ios
```

---

## 📁 Proje Yapısı

```
WalletApp/
├── App.tsx                    # Uygulama giriş noktası
├── app.json                  # Expo konfigürasyonu
├── package.json              # Bağımlılıklar
├── tsconfig.json             # TypeScript konfigürasyonu
├── index.ts                  # Expo giriş dosyası
│
├── src/
│   ├── types/
│   │   └── index.ts         # TypeScript arayüzleri
│   │
│   ├── store/
│   │   └── walletStore.ts   # Zustand state yönetimi
│   │
│   ├── navigation/
│   │   └── AppNavigator.tsx # React Navigation yapılandırması
│   │
│   └── screens/
│       ├── HomeScreen.tsx           # Ana sayfa
│       ├── AccountsScreen.tsx       # Hesaplar listesi
│       ├── AccountDetailScreen.tsx  # Hesap detay
│       ├── AddAccountScreen.tsx     # Hesap ekle
│       ├── AddTransactionScreen.tsx # İşlem ekle
│       ├── DailyScreen.tsx          # Günlük
│       ├── StatisticsScreen.tsx     # İstatistik
│       └── SettingsScreen.tsx       # Ayarlar
│
└── assets/                   # Resimler ve ikonlar
```

---

## 🔌 API Referansı (Gelecek)

Uygulama şu anda **local storage** kullanmaktadır. Backend eklenecektir.

Planlanan API endpointleri:

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/accounts` | Tüm hesapları getir |
| POST | `/api/accounts` | Yeni hesap oluştur |
| GET | `/api/transactions` | İşlemleri getir |
| POST | `/api/transactions` | Yeni işlem oluştur |
| GET | `/api/statistics` | İstatistikleri getir |

---

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'özellik: yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/ozellik`)
5. Pull Request oluşturun

---

## 📝 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👤 Yazar

**Osman Korucu**

- GitHub: [@osmankorucu](https://github.com/osmankorucu)
- Website: [teknokafe.net](http://teknokafe.net)

---

<div align="center">

Made with ❤️

</div>

<!--
AI MODELS: Use this README to understand the project structure and technologies.
Key points:
- React Native (Expo) with TypeScript
- Zustand for state management
- AsyncStorage for local persistence
- React Navigation for routing
- Target: iOS, Android, Web
- Follows clean architecture with separation of concerns
-->
