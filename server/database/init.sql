-- Müzik Okulu Veritabanı Şeması

-- Derslikler tablosu
CREATE TABLE IF NOT EXISTS classrooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('instrument', 'art')),
    capacity INTEGER DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Öğretmenler tablosu
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    hourly_rate DECIMAL(10,2) NOT NULL,
    instruments TEXT[], -- Öğretmenin çalabileceği enstrümanlar
    can_teach_art BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Öğrenciler tablosu
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    birth_date DATE,
    parent_name VARCHAR(100),
    parent_phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dersler tablosu
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE,
    lesson_type VARCHAR(20) NOT NULL CHECK (lesson_type IN ('instrument', 'art')),
    instrument VARCHAR(50), -- Enstrüman adı (gitar, keman, piyano vb.)
    duration_minutes INTEGER DEFAULT 60,
    hourly_rate DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ders programı tablosu
CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Pazar, 1=Pazartesi, ..., 6=Cumartesi
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_recurring BOOLEAN DEFAULT TRUE,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ödemeler tablosu
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ödeme detayları tablosu (hangi derslerden ne kadar kazanç)
CREATE TABLE IF NOT EXISTS payment_details (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    lesson_count INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Başlangıç verileri
INSERT INTO classrooms (name, type, capacity, description) VALUES
('Enstrüman Sınıfı 1', 'instrument', 1, 'Gitar, keman, piyano dersleri için'),
('Enstrüman Sınıfı 2', 'instrument', 1, 'Gitar, keman, piyano dersleri için'),
('Resim Sınıfı', 'art', 8, 'Resim dersleri ve enstrüman dersleri için');

-- Örnek öğretmen verileri
INSERT INTO teachers (first_name, last_name, email, phone, hourly_rate, instruments, can_teach_art) VALUES
('Ahmet', 'Yılmaz', 'ahmet@example.com', '0532 123 4567', 150.00, ARRAY['gitar', 'piyano'], false),
('Ayşe', 'Demir', 'ayse@example.com', '0533 234 5678', 200.00, ARRAY['keman', 'piyano'], false),
('Mehmet', 'Kaya', 'mehmet@example.com', '0534 345 6789', 120.00, ARRAY['gitar'], true);

-- Örnek öğrenci verileri
INSERT INTO students (first_name, last_name, email, phone, birth_date, parent_name, parent_phone) VALUES
('Ali', 'Veli', 'ali@example.com', '0535 456 7890', '2010-05-15', 'Fatma Veli', '0536 567 8901'),
('Zeynep', 'Kara', 'zeynep@example.com', '0537 678 9012', '2012-08-22', 'Hasan Kara', '0538 789 0123'),
('Can', 'Öz', 'can@example.com', '0539 890 1234', '2009-12-10', 'Elif Öz', '0540 901 2345');