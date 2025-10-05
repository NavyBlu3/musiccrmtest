import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit, Trash2, BookOpen, Phone, Mail, Calendar } from 'lucide-react';
import axios from 'axios';

const StudentsContainer = styled.div`
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

const StudentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StudentCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StudentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const StudentAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
`;

const StudentInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
`;

const StudentEmail = styled.p`
  margin: 5px 0 0 0;
  color: #666;
  font-size: 0.9rem;
`;

const StudentDetails = styled.div`
  margin-bottom: 15px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
  gap: 8px;
`;

const DetailIcon = styled.div`
  color: #666;
  width: 16px;
`;

const DetailValue = styled.span`
  color: #333;
`;

const LessonsInfo = styled.div`
  background: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
`;

const LessonsTitle = styled.h4`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 0.9rem;
`;

const LessonsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const LessonTag = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
`;

const StudentActions = styled.div`
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

const FilterSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 15px;
  align-items: end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ClearButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: #545b62;
  }
`;

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    lesson_type: '',
    age_range: ''
  });
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    birth_date: '',
    parent_name: '',
    parent_phone: '',
    address: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, filters]);

  const filterStudents = () => {
    let filtered = [...students];

    // Arama filtresi
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(student => 
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchLower) ||
        student.email?.toLowerCase().includes(searchLower) ||
        student.phone?.includes(searchLower)
      );
    }

    // Ders tipi filtresi
    if (filters.lesson_type) {
      filtered = filtered.filter(student => 
        student.lesson_types?.includes(filters.lesson_type) ||
        student.instruments?.includes(filters.lesson_type)
      );
    }

    // Yaş aralığı filtresi
    if (filters.age_range) {
      const [minAge, maxAge] = filters.age_range.split('-').map(Number);
      filtered = filtered.filter(student => {
        const age = calculateAge(student.birth_date);
        if (age === 'Belirtilmemiş') return false;
        return age >= minAge && age <= maxAge;
      });
    }

    setFilteredStudents(filtered);
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Öğrenciler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await axios.put(`/api/students/${editingStudent.id}`, formData);
      } else {
        await axios.post('/api/students', formData);
      }
      fetchStudents();
      setShowModal(false);
      setEditingStudent(null);
      resetForm();
    } catch (error) {
      console.error('Öğrenci kaydedilemedi:', error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email || '',
      phone: student.phone || '',
      birth_date: student.birth_date || '',
      parent_name: student.parent_name || '',
      parent_phone: student.parent_phone || '',
      address: student.address || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.put(`/api/students/${id}`, { is_active: false });
        fetchStudents();
      } catch (error) {
        console.error('Öğrenci silinemedi:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      birth_date: '',
      parent_name: '',
      parent_phone: '',
      address: ''
    });
  };

  const openModal = () => {
    setEditingStudent(null);
    resetForm();
    setShowModal(true);
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Belirtilmemiş';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <StudentsContainer>
        <div className="loading">Yükleniyor...</div>
      </StudentsContainer>
    );
  }

  return (
    <StudentsContainer>
      <Header>
        <Title>Öğrenciler</Title>
        <AddButton onClick={openModal}>
          <Plus size={20} />
          Yeni Öğrenci
        </AddButton>
      </Header>

      <FilterSection>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Filtreler</h3>
        <FilterRow>
          <FilterGroup>
            <FilterLabel>Arama</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Ad, soyad, e-posta veya telefon ile ara..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Ders Tipi</FilterLabel>
            <FilterSelect
              value={filters.lesson_type}
              onChange={(e) => setFilters({ ...filters, lesson_type: e.target.value })}
            >
              <option value="">Tüm Dersler</option>
              <option value="gitar">Gitar</option>
              <option value="keman">Keman</option>
              <option value="piyano">Piyano</option>
              <option value="bağlama">Bağlama</option>
              <option value="flüt">Flüt</option>
              <option value="davul">Davul</option>
              <option value="art">Resim</option>
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Yaş Aralığı</FilterLabel>
            <FilterSelect
              value={filters.age_range}
              onChange={(e) => setFilters({ ...filters, age_range: e.target.value })}
            >
              <option value="">Tüm Yaşlar</option>
              <option value="5-10">5-10 yaş</option>
              <option value="11-15">11-15 yaş</option>
              <option value="16-20">16-20 yaş</option>
              <option value="21-30">21-30 yaş</option>
              <option value="31-50">31-50 yaş</option>
              <option value="51-100">51+ yaş</option>
            </FilterSelect>
          </FilterGroup>
          <ClearButton onClick={() => setFilters({ search: '', lesson_type: '', age_range: '' })}>
            Temizle
          </ClearButton>
        </FilterRow>
      </FilterSection>

      <StudentsGrid>
        {filteredStudents.map((student) => (
          <StudentCard key={student.id}>
            <StudentHeader>
              <StudentAvatar>
                {student.first_name[0]}{student.last_name[0]}
              </StudentAvatar>
              <StudentInfo>
                <StudentName>{student.first_name} {student.last_name}</StudentName>
                <StudentEmail>{student.email || 'E-posta belirtilmemiş'}</StudentEmail>
              </StudentInfo>
            </StudentHeader>
            
            <StudentDetails>
              <DetailRow>
                <DetailIcon><Phone size={16} /></DetailIcon>
                <DetailValue>{student.phone || 'Telefon belirtilmemiş'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailIcon><Calendar size={16} /></DetailIcon>
                <DetailValue>Yaş: {calculateAge(student.birth_date)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailIcon><BookOpen size={16} /></DetailIcon>
                <DetailValue>Aktif Dersler: {student.active_lessons || 0}</DetailValue>
              </DetailRow>
              {student.parent_name && (
                <DetailRow>
                  <DetailIcon>👨‍👩‍👧‍👦</DetailIcon>
                  <DetailValue>Veli: {student.parent_name}</DetailValue>
                </DetailRow>
              )}
            </StudentDetails>

            {(student.lesson_types || student.instruments) && (
              <LessonsInfo>
                <LessonsTitle>Dersler:</LessonsTitle>
                <LessonsList>
                  {student.lesson_types && student.lesson_types.split(', ').map((type, index) => (
                    <LessonTag key={index}>{type}</LessonTag>
                  ))}
                  {student.instruments && student.instruments.split(', ').map((instrument, index) => (
                    <LessonTag key={index}>{instrument}</LessonTag>
                  ))}
                </LessonsList>
              </LessonsInfo>
            )}

            <StudentActions>
              <ActionButton className="edit" onClick={() => handleEdit(student)}>
                <Edit size={16} />
                Düzenle
              </ActionButton>
              <ActionButton className="delete" onClick={() => handleDelete(student.id)}>
                <Trash2 size={16} />
                Sil
              </ActionButton>
            </StudentActions>
          </StudentCard>
        ))}
      </StudentsGrid>

      {showModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingStudent ? 'Öğrenci Düzenle' : 'Yeni Öğrenci'}
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
                <Label>Doğum Tarihi</Label>
                <Input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                />
              </FormGroup>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <FormGroup>
                  <Label>Veli Adı</Label>
                  <Input
                    type="text"
                    value={formData.parent_name}
                    onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Veli Telefonu</Label>
                  <Input
                    type="tel"
                    value={formData.parent_phone}
                    onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                  />
                </FormGroup>
              </div>

              <FormGroup>
                <Label>Adres</Label>
                <TextArea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </FormGroup>

              <ModalActions>
                <Button type="button" className="secondary" onClick={() => setShowModal(false)}>
                  İptal
                </Button>
                <Button type="submit" className="primary">
                  {editingStudent ? 'Güncelle' : 'Oluştur'}
                </Button>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}
    </StudentsContainer>
  );
};

export default Students;