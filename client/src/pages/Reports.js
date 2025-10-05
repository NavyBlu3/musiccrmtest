import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download } from 'lucide-react';
import axios from 'axios';

const ReportsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  margin: 0;
  color: #333;
`;

const DownloadButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  
  &:hover {
    background: #1e7e34;
  }
`;

const FilterSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  align-items: end;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  background: #007bff;
  color: white;
  
  &:hover {
    background: #0056b3;
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ReportCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 25px;
`;

const ReportHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const ReportIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || '#007bff'};
  color: white;
  font-size: 1.2rem;
`;

const ReportTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
`;

const ReportContent = styled.div`
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-style: italic;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || '#007bff'};
  color: white;
  font-size: 1.2rem;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
`;

const StatLabel = styled.p`
  margin: 5px 0 0 0;
  color: #666;
  font-size: 0.9rem;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #dee2e6;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
  align-items: center;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
`;

const Reports = () => {
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    teacher_id: ''
  });
  const [teachers, setTeachers] = useState([]);
  const [reports, setReports] = useState({
    monthlyEarnings: [],
    teacherStats: [],
    lessonStats: [],
    paymentStats: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
    generateReports();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Öğretmenler yüklenemedi:', error);
    }
  };

  const generateReports = async () => {
    setLoading(true);
    try {
      // Burada gerçek rapor verilerini API'den çekebilirsiniz
      // Şimdilik örnek veriler gösteriyoruz
      setReports({
        monthlyEarnings: [
          { month: 'Ocak', amount: 15000 },
          { month: 'Şubat', amount: 18000 },
          { month: 'Mart', amount: 22000 },
          { month: 'Nisan', amount: 19000 },
          { month: 'Mayıs', amount: 25000 },
          { month: 'Haziran', amount: 21000 }
        ],
        teacherStats: [
          { name: 'Ahmet Yılmaz', lessons: 45, earnings: 6750 },
          { name: 'Ayşe Demir', lessons: 38, earnings: 7600 },
          { name: 'Mehmet Kaya', lessons: 42, earnings: 5040 }
        ],
        lessonStats: [
          { type: 'Gitar', count: 25 },
          { type: 'Piyano', count: 18 },
          { type: 'Keman', count: 15 },
          { type: 'Resim', count: 12 }
        ],
        paymentStats: [
          { status: 'Ödendi', count: 15, amount: 22500 },
          { status: 'Bekliyor', count: 8, amount: 12000 },
          { status: 'İptal', count: 2, amount: 3000 }
        ]
      });
    } catch (error) {
      console.error('Raporlar oluşturulamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleGenerateReports = () => {
    generateReports();
  };

  const handleDownloadReport = (reportType) => {
    // Burada rapor indirme işlemi yapılabilir
    alert(`${reportType} raporu indiriliyor...`);
  };

  if (loading) {
    return (
      <ReportsContainer>
        <div className="loading">Raporlar oluşturuluyor...</div>
      </ReportsContainer>
    );
  }

  return (
    <ReportsContainer>
      <Header>
        <Title>Raporlar</Title>
        <DownloadButton onClick={() => handleDownloadReport('Tüm Raporlar')}>
          <Download size={20} />
          Raporları İndir
        </DownloadButton>
      </Header>

      <FilterSection>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Rapor Filtreleri</h3>
        <FilterRow>
          <FormGroup>
            <Label>Yıl</Label>
            <Select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Ay</Label>
            <Select
              value={filters.month}
              onChange={(e) => handleFilterChange('month', parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                                  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
                return <option key={month} value={month}>{monthNames[i]}</option>;
              })}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Öğretmen</Label>
            <Select
              value={filters.teacher_id}
              onChange={(e) => handleFilterChange('teacher_id', e.target.value)}
            >
              <option value="">Tüm Öğretmenler</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.last_name}
                </option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Button onClick={handleGenerateReports}>
              Raporları Oluştur
            </Button>
          </FormGroup>
        </FilterRow>
      </FilterSection>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#007bff">
            <DollarSign size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>₺{reports.monthlyEarnings.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</StatValue>
            <StatLabel>Toplam Kazanç</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#28a745">
            <Users size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{reports.teacherStats.reduce((sum, item) => sum + item.lessons, 0)}</StatValue>
            <StatLabel>Toplam Ders</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#ffc107">
            <BarChart3 size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{reports.lessonStats.length}</StatValue>
            <StatLabel>Ders Türü</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#17a2b8">
            <Calendar size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{reports.paymentStats.reduce((sum, item) => sum + item.count, 0)}</StatValue>
            <StatLabel>Toplam Ödeme</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ReportsGrid>
        <ReportCard>
          <ReportHeader>
            <ReportIcon color="#007bff">
              <TrendingUp size={24} />
            </ReportIcon>
            <ReportTitle>Aylık Kazanç Grafiği</ReportTitle>
          </ReportHeader>
          <ReportContent>
            <div style={{ textAlign: 'center' }}>
              <p>Grafik yakında eklenecek</p>
              <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>
                {reports.monthlyEarnings.map(item => `${item.month}: ₺${item.amount.toLocaleString()}`).join(', ')}
              </p>
            </div>
          </ReportContent>
        </ReportCard>

        <ReportCard>
          <ReportHeader>
            <ReportIcon color="#28a745">
              <Users size={24} />
            </ReportIcon>
            <ReportTitle>Öğretmen Performansı</ReportTitle>
          </ReportHeader>
          <ReportContent>
            <div style={{ textAlign: 'center' }}>
              <p>Grafik yakında eklenecek</p>
              <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>
                {reports.teacherStats.map(item => `${item.name}: ${item.lessons} ders`).join(', ')}
              </p>
            </div>
          </ReportContent>
        </ReportCard>

        <ReportCard>
          <ReportHeader>
            <ReportIcon color="#ffc107">
              <BarChart3 size={24} />
            </ReportIcon>
            <ReportTitle>Ders Dağılımı</ReportTitle>
          </ReportHeader>
          <ReportContent>
            <div style={{ textAlign: 'center' }}>
              <p>Grafik yakında eklenecek</p>
              <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>
                {reports.lessonStats.map(item => `${item.type}: ${item.count}`).join(', ')}
              </p>
            </div>
          </ReportContent>
        </ReportCard>

        <ReportCard>
          <ReportHeader>
            <ReportIcon color="#dc3545">
              <DollarSign size={24} />
            </ReportIcon>
            <ReportTitle>Ödeme Durumu</ReportTitle>
          </ReportHeader>
          <ReportContent>
            <div style={{ textAlign: 'center' }}>
              <p>Grafik yakında eklenecek</p>
              <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>
                {reports.paymentStats.map(item => `${item.status}: ${item.count} (₺${item.amount.toLocaleString()})`).join(', ')}
              </p>
            </div>
          </ReportContent>
        </ReportCard>
      </ReportsGrid>

      <TableContainer>
        <h3 style={{ padding: '20px', margin: 0, color: '#333' }}>Öğretmen Detay Raporu</h3>
        <TableHeader>
          <div>Öğretmen</div>
          <div>Ders Sayısı</div>
          <div>Kazanç</div>
          <div>Ortalama/Ders</div>
        </TableHeader>
        
        {reports.teacherStats.map((teacher, index) => (
          <TableRow key={index}>
            <TableCell>
              <Users size={16} />
              {teacher.name}
            </TableCell>
            <TableCell>
              <BarChart3 size={16} />
              {teacher.lessons}
            </TableCell>
            <TableCell>
              <DollarSign size={16} />
              ₺{teacher.earnings.toLocaleString()}
            </TableCell>
            <TableCell>
              <TrendingUp size={16} />
              ₺{Math.round(teacher.earnings / teacher.lessons).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableContainer>
    </ReportsContainer>
  );
};

export default Reports;