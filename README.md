# Müzik Okulu Yönetim Sistemi

Bu proje, müzik okulları için özel olarak tasarlanmış kapsamlı bir ders takip ve ödeme yönetim sistemidir.

## Özellikler

### 🏫 Derslik Yönetimi
- 3 sınıf desteği (2 enstrüman + 1 resim sınıfı)
- Derslik kapasitesi ve tip yönetimi
- Resim dersi sadece resim sınıfında, enstrüman dersleri sadece enstrüman sınıflarında

### 👨‍🏫 Öğretmen Yönetimi
- Öğretmen bilgileri ve iletişim detayları
- Saatlik ücret takibi
- Çalışabileceği enstrümanlar listesi
- Resim dersi verebilme yetkisi
- Aylık kazanç hesaplama

### 👨‍🎓 Öğrenci Yönetimi
- Öğrenci kayıt ve bilgi yönetimi
- Veli bilgileri takibi
- Aktif ders sayısı ve türleri
- Yaş hesaplama

### 📚 Ders Yönetimi
- Öğrenci-öğretmen-derslik atama
- Enstrüman ve resim dersi desteği
- Ders süresi ve ücret belirleme
- Derslik uyumluluk kontrolü

### 📅 Program Yönetimi
- Haftalık ders programı
- Takvim ve liste görünümü
- Çakışma kontrolü
- Tekrarlı ders desteği

### 💰 Ödeme Takibi
- Öğretmen ödemeleri
- Aylık kazanç hesaplama
- Ödeme durumu takibi
- Otomatik rapor oluşturma

### 📊 Raporlama
- Aylık kazanç grafikleri
- Öğretmen performans raporları
- Ders dağılım analizi
- Ödeme durumu raporları

## Teknolojiler

### Backend
- Node.js
- Express.js
- PostgreSQL
- RESTful API

### Frontend
- React 18
- React Router
- Styled Components
- Axios
- Lucide React (İkonlar)

## Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- PostgreSQL (v12 veya üzeri)
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd music-school-management
```

2. **Bağımlılıkları yükleyin**
```bash
npm run install-all
```

3. **Veritabanını kurun**
```bash
# PostgreSQL'de yeni veritabanı oluşturun
createdb music_school

# Veritabanı şemasını yükleyin
psql -d music_school -f server/database/init.sql
```

4. **Çevre değişkenlerini ayarlayın**
```bash
# server/.env dosyasını düzenleyin
DB_HOST=localhost
DB_PORT=5432
DB_NAME=music_school
DB_USER=postgres
DB_PASSWORD=your_password
```

5. **Uygulamayı başlatın**
```bash
# Geliştirme modunda çalıştır
npm run dev

# Veya ayrı ayrı
npm run server  # Backend (port 5000)
npm run client  # Frontend (port 3000)
```

## Kullanım

1. **Ana Sayfa**: Genel istatistikler ve son aktiviteler
2. **Derslikler**: Sınıf yönetimi ve düzenleme
3. **Öğretmenler**: Öğretmen kayıt ve ücret takibi
4. **Öğrenciler**: Öğrenci kayıt ve ders atama
5. **Dersler**: Ders oluşturma ve yönetimi
6. **Program**: Haftalık ders programı
7. **Ödemeler**: Ödeme takibi ve raporlama
8. **Raporlar**: Detaylı analiz ve grafikler

## API Endpoints

### Derslikler
- `GET /api/classrooms` - Tüm derslikleri listele
- `POST /api/classrooms` - Yeni derslik oluştur
- `PUT /api/classrooms/:id` - Derslik güncelle
- `DELETE /api/classrooms/:id` - Derslik sil

### Öğretmenler
- `GET /api/teachers` - Tüm öğretmenleri listele
- `POST /api/teachers` - Yeni öğretmen oluştur
- `PUT /api/teachers/:id` - Öğretmen güncelle
- `GET /api/teachers/:id/earnings/:year/:month` - Aylık kazanç

### Öğrenciler
- `GET /api/students` - Tüm öğrencileri listele
- `POST /api/students` - Yeni öğrenci oluştur
- `PUT /api/students/:id` - Öğrenci güncelle
- `GET /api/students/:id/lessons` - Öğrenci dersleri

### Dersler
- `GET /api/lessons` - Tüm dersleri listele
- `POST /api/lessons` - Yeni ders oluştur
- `PUT /api/lessons/:id` - Ders güncelle
- `DELETE /api/lessons/:id` - Ders sil

### Program
- `GET /api/schedule` - Tüm programı listele
- `POST /api/schedule` - Yeni program oluştur
- `PUT /api/schedule/:id` - Program güncelle
- `DELETE /api/schedule/:id` - Program sil

### Ödemeler
- `GET /api/payments` - Tüm ödemeleri listele
- `POST /api/payments` - Yeni ödeme oluştur
- `PUT /api/payments/:id` - Ödeme güncelle
- `DELETE /api/payments/:id` - Ödeme sil
- `POST /api/payments/generate-monthly` - Aylık rapor oluştur

## Veritabanı Şeması

### Temel Tablolar
- `classrooms` - Derslik bilgileri
- `teachers` - Öğretmen bilgileri
- `students` - Öğrenci bilgileri
- `lessons` - Ders bilgileri
- `schedule` - Ders programı
- `payments` - Ödeme kayıtları
- `payment_details` - Ödeme detayları

## Lisans

MIT License

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Destek

Herhangi bir sorun veya öneri için issue oluşturun.