import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit, Trash2, GraduationCap, Palette } from 'lucide-react';
import axios from 'axios';

const ClassroomsContainer = styled.div`
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

const ClassroomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ClassroomCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ClassroomHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const ClassroomIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.type === 'art' ? '#ff6b6b' : '#4ecdc4'};
  color: white;
  font-size: 1.5rem;
`;

const ClassroomInfo = styled.div`
  flex: 1;
`;

const ClassroomName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
`;

const ClassroomType = styled.span`
  background: ${props => props.type === 'art' ? '#ff6b6b' : '#4ecdc4'};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ClassroomDescription = styled.p`
  color: #666;
  margin: 10px 0;
  font-size: 0.9rem;
`;

const ClassroomCapacity = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const ClassroomActions = styled.div`
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
  max-width: 500px;
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

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'instrument',
    capacity: 1,
    description: ''
  });

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('/api/classrooms');
      setClassrooms(response.data);
    } catch (error) {
      console.error('Derslikler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClassroom) {
        await axios.put(`/api/classrooms/${editingClassroom.id}`, formData);
      } else {
        await axios.post('/api/classrooms', formData);
      }
      fetchClassrooms();
      setShowModal(false);
      setEditingClassroom(null);
      setFormData({ name: '', type: 'instrument', capacity: 1, description: '' });
    } catch (error) {
      console.error('Derslik kaydedilemedi:', error);
    }
  };

  const handleEdit = (classroom) => {
    setEditingClassroom(classroom);
    setFormData({
      name: classroom.name,
      type: classroom.type,
      capacity: classroom.capacity,
      description: classroom.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu dersliği silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/classrooms/${id}`);
        fetchClassrooms();
      } catch (error) {
        console.error('Derslik silinemedi:', error);
      }
    }
  };

  const openModal = () => {
    setEditingClassroom(null);
    setFormData({ name: '', type: 'instrument', capacity: 1, description: '' });
    setShowModal(true);
  };

  if (loading) {
    return (
      <ClassroomsContainer>
        <div className="loading">Yükleniyor...</div>
      </ClassroomsContainer>
    );
  }

  return (
    <ClassroomsContainer>
      <Header>
        <Title>Derslikler</Title>
        <AddButton onClick={openModal}>
          <Plus size={20} />
          Yeni Derslik
        </AddButton>
      </Header>

      <ClassroomsGrid>
        {classrooms.map((classroom) => (
          <ClassroomCard key={classroom.id}>
            <ClassroomHeader>
              <ClassroomIcon type={classroom.type}>
                {classroom.type === 'art' ? <Palette size={24} /> : <GraduationCap size={24} />}
              </ClassroomIcon>
              <ClassroomInfo>
                <ClassroomName>{classroom.name}</ClassroomName>
                <ClassroomType type={classroom.type}>
                  {classroom.type === 'art' ? 'Resim Sınıfı' : 'Enstrüman Sınıfı'}
                </ClassroomType>
              </ClassroomInfo>
            </ClassroomHeader>
            <ClassroomDescription>{classroom.description}</ClassroomDescription>
            <ClassroomCapacity>Kapasite: {classroom.capacity} kişi</ClassroomCapacity>
            <ClassroomActions>
              <ActionButton className="edit" onClick={() => handleEdit(classroom)}>
                <Edit size={16} />
                Düzenle
              </ActionButton>
              <ActionButton className="delete" onClick={() => handleDelete(classroom.id)}>
                <Trash2 size={16} />
                Sil
              </ActionButton>
            </ClassroomActions>
          </ClassroomCard>
        ))}
      </ClassroomsGrid>

      {showModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingClassroom ? 'Derslik Düzenle' : 'Yeni Derslik'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Derslik Adı</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Derslik Tipi</Label>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="instrument">Enstrüman Sınıfı</option>
                  <option value="art">Resim Sınıfı</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Kapasite</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Açıklama</Label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </FormGroup>
              <ModalActions>
                <Button type="button" className="secondary" onClick={() => setShowModal(false)}>
                  İptal
                </Button>
                <Button type="submit" className="primary">
                  {editingClassroom ? 'Güncelle' : 'Oluştur'}
                </Button>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}
    </ClassroomsContainer>
  );
};

export default Classrooms;