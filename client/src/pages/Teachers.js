import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit, Trash2, Users, DollarSign, Music, Palette } from 'lucide-react';
import axios from 'axios';

const TeachersContainer = styled.div`
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

const AddButton = styled.button`
  background: #007bff;
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
    background: #0056b3;
  }
`;

const TeachersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const TeacherCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const TeacherHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const TeacherAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
`;

const TeacherInfo = styled.div`
  flex: 1;
`;

const TeacherName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
`;

const TeacherEmail = styled.p`
  margin: 5px 0 0 0;
  color: #666;
  font-size: 0.9rem;
`;

const TeacherDetails = styled.div`
  margin-bottom: 15px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const DetailLabel = styled.span`
  color: #666;
`;

const DetailValue = styled.span`
  color: #333;
  font-weight: 500;
`;

const InstrumentsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 15px;
`;

const InstrumentTag = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TeacherActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
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

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

const InstrumentsInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
`;

const InstrumentChip = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: 4px;
`;

const AddInstrumentInput = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  
  &.primary {
    background: #007bff;
    color: white;
    
    &:hover {
      background: #0056b3;
    }
  }
  
  &.secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #545b62;
    }
  }
`;

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    hourly_rate: '',
    instruments: [],
    can_teach_art: false
  });
  const [newInstrument, setNewInstrument] = useState('');

  const availableInstruments = ['gitar', 'keman', 'piyano', 'bağlama', 'flüt', 'davul'];

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Öğretmenler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await axios.put(`/api/teachers/${editingTeacher.id}`, formData);
      } else {
        await axios.post('/api/teachers', formData);
      }
      fetchTeachers();
      setShowModal(false);
      setEditingTeacher(null);
      resetForm();
    } catch (error) {
      console.error('Öğretmen kaydedilemedi:', error);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      email: teacher.email || '',
      phone: teacher.phone || '',
      hourly_rate: teacher.hourly_rate,
      instruments: teacher.instruments || [],
      can_teach_art: teacher.can_teach_art
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu öğretmeni silmek istediğinizden emin misiniz?')) {
      try {
        await axios.put(`/api/teachers/${id}`, { is_active: false });
        fetchTeachers();
      } catch (error) {
        console.error('Öğretmen silinemedi:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      hourly_rate: '',
      instruments: [],
      can_teach_art: false
    });
    setNewInstrument('');
  };

  const openModal = () => {
    setEditingTeacher(null);
    resetForm();
    setShowModal(true);
  };

  const addInstrument = () => {
    if (newInstrument && !formData.instruments.includes(newInstrument)) {
      setFormData({
        ...formData,
        instruments: [...formData.instruments, newInstrument]
      });
      setNewInstrument('');
    }
  };

  const removeInstrument = (instrument) => {
    setFormData({
      ...formData,
      instruments: formData.instruments.filter(i => i !== instrument)
    });
  };

  if (loading) {
    return (
      <TeachersContainer>
        <div className="loading">Yükleniyor...</div>
      </TeachersContainer>
    );
  }

  return (
    <TeachersContainer>
      <Header>
        <Title>Öğretmenler</Title>
        <AddButton onClick={openModal}>
          <Plus size={20} />
          Yeni Öğretmen
        </AddButton>
      </Header>

      <TeachersGrid>
        {teachers.map((teacher) => (
          <TeacherCard key={teacher.id}>
            <TeacherHeader>
              <TeacherAvatar>
                {teacher.first_name[0]}{teacher.last_name[0]}
              </TeacherAvatar>
              <TeacherInfo>
                <TeacherName>{teacher.first_name} {teacher.last_name}</TeacherName>
                <TeacherEmail>{teacher.email}</TeacherEmail>
              </TeacherInfo>
            </TeacherHeader>
            
            <TeacherDetails>
              <DetailRow>
                <DetailLabel>Telefon:</DetailLabel>
                <DetailValue>{teacher.phone || 'Belirtilmemiş'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Saatlik Ücret:</DetailLabel>
                <DetailValue>₺{teacher.hourly_rate}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Aktif Dersler:</DetailLabel>
                <DetailValue>{teacher.active_lessons || 0}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Toplam Kazanç:</DetailLabel>
                <DetailValue>₺{teacher.total_earnings || 0}</DetailValue>
              </DetailRow>
            </TeacherDetails>

            <InstrumentsList>
              {teacher.instruments && teacher.instruments.map((instrument, index) => (
                <InstrumentTag key={index}>
                  {instrument === 'gitar' ? <Music size={12} /> : 
                   instrument === 'resim' ? <Palette size={12} /> : 
                   <Music size={12} />}
                  {instrument}
                </InstrumentTag>
              ))}
              {teacher.can_teach_art && (
                <InstrumentTag>
                  <Palette size={12} />
                  Resim
                </InstrumentTag>
              )}
            </InstrumentsList>

            <TeacherActions>
              <ActionButton className="edit" onClick={() => handleEdit(teacher)}>
                <Edit size={16} />
                Düzenle
              </ActionButton>
              <ActionButton className="delete" onClick={() => handleDelete(teacher.id)}>
                <Trash2 size={16} />
                Sil
              </ActionButton>
            </TeacherActions>
          </TeacherCard>
        ))}
      </TeachersGrid>

      {showModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingTeacher ? 'Öğretmen Düzenle' : 'Yeni Öğretmen'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <FormGroup>
                  <Label>Ad</Label>
                  <Input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Soyad</Label>
                  <Input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                  />
                </FormGroup>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <FormGroup>
                  <Label>E-posta</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Telefon</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </FormGroup>
              </div>

              <FormGroup>
                <Label>Saatlik Ücret (₺)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.hourly_rate}
                  onChange={(e) => setFormData({ ...formData, hourly_rate: parseFloat(e.target.value) })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Enstrümanlar</Label>
                <InstrumentsInput>
                  {formData.instruments.map((instrument, index) => (
                    <InstrumentChip key={index}>
                      {instrument}
                      <RemoveButton onClick={() => removeInstrument(instrument)}>×</RemoveButton>
                    </InstrumentChip>
                  ))}
                </InstrumentsInput>
                <AddInstrumentInput>
                  <Select
                    value={newInstrument}
                    onChange={(e) => setNewInstrument(e.target.value)}
                  >
                    <option value="">Enstrüman seçin</option>
                    {availableInstruments.map(instrument => (
                      <option key={instrument} value={instrument}>{instrument}</option>
                    ))}
                  </Select>
                  <Button type="button" onClick={addInstrument}>
                    Ekle
                  </Button>
                </AddInstrumentInput>
              </FormGroup>

              <FormGroup>
                <CheckboxGroup>
                  <Checkbox
                    type="checkbox"
                    id="can_teach_art"
                    checked={formData.can_teach_art}
                    onChange={(e) => setFormData({ ...formData, can_teach_art: e.target.checked })}
                  />
                  <Label htmlFor="can_teach_art">Resim dersi verebilir</Label>
                </CheckboxGroup>
              </FormGroup>

              <ModalActions>
                <Button type="button" className="secondary" onClick={() => setShowModal(false)}>
                  İptal
                </Button>
                <Button type="submit" className="primary">
                  {editingTeacher ? 'Güncelle' : 'Oluştur'}
                </Button>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}
    </TeachersContainer>
  );
};

export default Teachers;