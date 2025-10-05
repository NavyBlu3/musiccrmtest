import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Users, GraduationCap, BookOpen, CreditCard, Calendar, TrendingUp } from 'lucide-react';
import axios from 'axios';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || '#007bff'};
  color: white;
  font-size: 1.5rem;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.h3`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #333;
`;

const StatLabel = styled.p`
  margin: 5px 0 0 0;
  color: #666;
  font-size: 0.9rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.2rem;
`;

const RecentActivity = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: #666;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.p`
  margin: 0;
  color: #333;
  font-size: 0.9rem;
`;

const ActivityTime = styled.span`
  color: #666;
  font-size: 0.8rem;
`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    teachers: 0,
    students: 0,
    lessons: 0,
    payments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [teachersRes, studentsRes, lessonsRes, paymentsRes] = await Promise.all([
        axios.get('/api/teachers'),
        axios.get('/api/students'),
        axios.get('/api/lessons'),
        axios.get('/api/payments')
      ]);

      setStats({
        teachers: teachersRes.data.length,
        students: studentsRes.data.length,
        lessons: lessonsRes.data.length,
        payments: paymentsRes.data.length
      });
    } catch (error) {
      console.error('Dashboard verileri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div className="loading">Yükleniyor...</div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Ana Sayfa</h2>
      
      <StatsGrid>
        <StatCard>
          <StatIcon color="#007bff">
            <Users size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.teachers}</StatValue>
            <StatLabel>Öğretmen</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#28a745">
            <GraduationCap size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.students}</StatValue>
            <StatLabel>Öğrenci</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#ffc107">
            <BookOpen size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.lessons}</StatValue>
            <StatLabel>Aktif Ders</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#dc3545">
            <CreditCard size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.payments}</StatValue>
            <StatLabel>Ödeme Kaydı</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Bu Ayki Ödemeler</ChartTitle>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
            Grafik yakında eklenecek
          </div>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Ders Dağılımı</ChartTitle>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
            Grafik yakında eklenecek
          </div>
        </ChartCard>
      </ChartsGrid>

      <RecentActivity>
        <ChartTitle>Son Aktiviteler</ChartTitle>
        <ActivityItem>
          <ActivityIcon>
            <Users size={16} />
          </ActivityIcon>
          <ActivityContent>
            <ActivityText>Yeni öğretmen eklendi: Ahmet Yılmaz</ActivityText>
            <ActivityTime>2 saat önce</ActivityTime>
          </ActivityContent>
        </ActivityItem>
        <ActivityItem>
          <ActivityIcon>
            <GraduationCap size={16} />
          </ActivityIcon>
          <ActivityContent>
            <ActivityText>Yeni öğrenci kaydı: Ali Veli</ActivityText>
            <ActivityTime>4 saat önce</ActivityTime>
          </ActivityContent>
        </ActivityItem>
        <ActivityItem>
          <ActivityIcon>
            <BookOpen size={16} />
          </ActivityIcon>
          <ActivityContent>
            <ActivityText>Yeni ders atandı: Gitar dersi</ActivityText>
            <ActivityTime>6 saat önce</ActivityTime>
          </ActivityContent>
        </ActivityItem>
        <ActivityItem>
          <ActivityIcon>
            <CreditCard size={16} />
          </ActivityIcon>
          <ActivityContent>
            <ActivityText>Ödeme kaydedildi: ₺1,500</ActivityText>
            <ActivityTime>1 gün önce</ActivityTime>
          </ActivityContent>
        </ActivityItem>
      </RecentActivity>
    </DashboardContainer>
  );
};

export default Dashboard;