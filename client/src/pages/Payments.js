import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CreditCard, Plus, Edit, Trash2, DollarSign, Calendar, Users, TrendingUp } from 'lucide-react';
import axios from 'axios';

const PaymentsContainer = styled.div`
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

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  
  &.primary {
    background: #007bff;
    color: white;
    
    &:hover {
      background: #0056b3;
    }
  }
  
  &.success {
    background: #28a745;
    color: white;
    
    &:hover {
      background: #1e7e34;
    }
  }
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

const PaymentsTable = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #dee2e6;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
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

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  
  &.pending {
    background: #fff3cd;
    color: #856404;
  }
  
  &.paid {
    background: #d4edda;
    color: #155724;
  }
  
  &.cancelled {
    background: #f8d7da;
    color: #721c24;
  }
`;

const ActionsCell = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: #666;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &.edit {
    border-color: #007bff;
    color: #007bff;
    
    &:hover {
      background: #e3f2fd;
    }
  }
  
  &.delete {
    border-color: #dc3545;
    color: #dc3545;
    
    &:hover {
      background: #f8d7da;
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const FilterSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  align-items: end;
`;

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    teacher_id: '',
    status: ''
  });
  const [formData, setFormData] = useState({
    teacher_id: '',
    amount: '',
    payment_date: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: 'pending',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [teachersRes] = await Promise.all([
        axios.get('/api/teachers')
      ]);
      setTeachers(teachersRes.data);
    } catch (error) {
      console.error('Veriler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      let url = '/api/payments';
      const params = new URLSearchParams();
      
      if (filters.year && filters.month) {
        url = `/api/payments/month/${filters.year}/${filters.month}`;
      }
      if (filters.teacher_id) {
        url = `/api/payments/teacher/${filters.teacher_id}`;
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      setPayments(response.data);
    } catch (error) {
      console.error('Ödemeler yüklenemedi:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPayment) {
        await axios.put(`/api/payments/${editingPayment.id}`, formData);
      } else {
        await axios.post('/api/payments', formData);
      }
      fetchPayments();
      setShowModal(false);
      setEditingPayment(null);
      resetForm();
    } catch (error) {
      console.error('Ödeme kaydedilemedi:', error);
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      teacher_id: payment.teacher_id,
      amount: payment.amount,
      payment_date: payment.payment_date,
      month: payment.month,
      year: payment.year,
      status: payment.status,
      notes: payment.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu ödemeyi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/payments/${id}`);
        fetchPayments();
      } catch (error) {
        console.error('Ödeme silinemedi:', error);
      }
    }
  };

  const handleGenerateMonthly = async () => {
    if (window.confirm(`${filters.month}/${filters.year} için aylık rapor oluşturmak istediğinizden emin misiniz?`)) {
      try {
        await axios.post('/api/payments/generate-monthly', {
          year: filters.year,
          month: filters.month
        });
        fetchPayments();
        alert('Aylık rapor başarıyla oluşturuldu!');
      } catch (error) {
        console.error('Aylık rapor oluşturulamadı:', error);
        alert('Aylık rapor oluşturulamadı!');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      teacher_id: '',
      amount: '',
      payment_date: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      status: 'pending',
      notes: ''
    });
  };

  const openModal = () => {
    setEditingPayment(null);
    resetForm();
    setShowModal(true);
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Bilinmiyor';
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Bekliyor';
      case 'paid': return 'Ödendi';
      case 'cancelled': return 'İptal';
      default: return status;
    }
  };

  const totalAmount = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  if (loading) {
    return (
      <PaymentsContainer>
        <div className="loading">Yükleniyor...</div>
      </PaymentsContainer>
    );
  }

  return (
    <PaymentsContainer>
      <Header>
        <Title>Ödemeler</Title>
        <ActionButtons>
          <Button className="success" onClick={handleGenerateMonthly}>
            <TrendingUp size={20} />
            Aylık Rapor Oluştur
          </Button>
          <Button className="primary" onClick={openModal}>
            <Plus size={20} />
            Yeni Ödeme
          </Button>
        </ActionButtons>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#007bff">
            <CreditCard size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{payments.length}</StatValue>
            <StatLabel>Toplam Ödeme</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#28a745">
            <DollarSign size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>₺{totalAmount.toFixed(2)}</StatValue>
            <StatLabel>Toplam Tutar</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#17a2b8">
            <Calendar size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>₺{paidAmount.toFixed(2)}</StatValue>
            <StatLabel>Ödenen Tutar</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#ffc107">
            <Users size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>₺{pendingAmount.toFixed(2)}</StatValue>
            <StatLabel>Bekleyen Tutar</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <FilterSection>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Filtreler</h3>
        <FilterRow>
          <FormGroup>
            <Label>Yıl</Label>
            <Select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
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
              onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
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
              onChange={(e) => setFilters({ ...filters, teacher_id: e.target.value })}
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
            <Label>Durum</Label>
            <Select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Tüm Durumlar</option>
              <option value="pending">Bekliyor</option>
              <option value="paid">Ödendi</option>
              <option value="cancelled">İptal</option>
            </Select>
          </FormGroup>
        </FilterRow>
      </FilterSection>

      <PaymentsTable>
        <TableHeader>
          <div>Öğretmen</div>
          <div>Tutar</div>
          <div>Ödeme Tarihi</div>
          <div>Ay/Yıl</div>
          <div>Durum</div>
          <div>Notlar</div>
          <div>İşlemler</div>
        </TableHeader>
        
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              <Users size={16} />
              {getTeacherName(payment.teacher_id)}
            </TableCell>
            <TableCell>
              <DollarSign size={16} />
              ₺{payment.amount}
            </TableCell>
            <TableCell>
              <Calendar size={16} />
              {new Date(payment.payment_date).toLocaleDateString('tr-TR')}
            </TableCell>
            <TableCell>
              {payment.month}/{payment.year}
            </TableCell>
            <TableCell>
              <StatusBadge className={payment.status}>
                {getStatusText(payment.status)}
              </StatusBadge>
            </TableCell>
            <TableCell>
              {payment.notes || '-'}
            </TableCell>
            <ActionsCell>
              <ActionButton className="edit" onClick={() => handleEdit(payment)}>
                <Edit size={14} />
                Düzenle
              </ActionButton>
              <ActionButton className="delete" onClick={() => handleDelete(payment.id)}>
                <Trash2 size={14} />
                Sil
              </ActionButton>
            </ActionsCell>
          </TableRow>
        ))}
      </PaymentsTable>

      {showModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingPayment ? 'Ödeme Düzenle' : 'Yeni Ödeme'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Öğretmen</Label>
                <Select
                  value={formData.teacher_id}
                  onChange={(e) => setFormData({ ...formData, teacher_id: parseInt(e.target.value) })}
                  required
                >
                  <option value="">Öğretmen seçin</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <FormGroup>
                  <Label>Tutar (₺)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Ödeme Tarihi</Label>
                  <Input
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                    required
                  />
                </FormGroup>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <FormGroup>
                  <Label>Ay</Label>
                  <Select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                    required
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
                  <Label>Yıl</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Durum</Label>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="pending">Bekliyor</option>
                    <option value="paid">Ödendi</option>
                    <option value="cancelled">İptal</option>
                  </Select>
                </FormGroup>
              </div>

              <FormGroup>
                <Label>Notlar</Label>
                <TextArea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </FormGroup>

              <ModalActions>
                <Button type="button" className="secondary" onClick={() => setShowModal(false)}>
                  İptal
                </Button>
                <Button type="submit" className="primary">
                  {editingPayment ? 'Güncelle' : 'Oluştur'}
                </Button>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}
    </PaymentsContainer>
  );
};

export default Payments;