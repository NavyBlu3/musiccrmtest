import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit, Trash2, BookOpen, Music, Palette, Users, GraduationCap } from 'lucide-react';
import axios from 'axios';

const LessonsContainer = styled.div`
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

const LessonsTable = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #dee2e6;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
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

const LessonTypeIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.type === 'art' ? '#ff6b6b' : '#4ecdc4'};
  color: white;
  font-size: 0.8rem;
`;

const InstrumentTag = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
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
  max-width: 700px;
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

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    teacher_id: '',
    classroom_id: '',
    lesson_type: 'instrument',
    instrument: '',
    duration_minutes: 60,
    hourly_rate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lessonsRes, teachersRes, studentsRes, classroomsRes] = await Promise.all([
        axios.get('/api/lessons'),
        axios.get('/api/teachers'),
        axios.get('/api/students'),
        axios.get('/api/classrooms')
      ]);

      setLessons(lessonsRes.data);
      setTeachers(teachersRes.data);
      setStudents(studentsRes.data);
      setClassrooms(classroomsRes.data);
    } catch (error) {
      console.error('Veriler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLesson) {
        await axios.put(`/api/lessons/${editingLesson.id}`, formData);
      } else {
        await axios.post('/api/lessons', formData);
      }
      fetchData();
      setShowModal(false);
      setEditingLesson(null);
      resetForm();
    } catch (error) {
      console.error('Ders kaydedilemedi:', error);
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      student_id: lesson.student_id,
      teacher_id: lesson.teacher_id,
      classroom_id: lesson.classroom_id,
      lesson_type: lesson.lesson_type,
      instrument: lesson.instrument || '',
      duration_minutes: lesson.duration_minutes,
      hourly_rate: lesson.hourly_rate
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/lessons/${id}`);
        fetchData();
      } catch (error) {
        console.error('Ders silinemedi:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      teacher_id: '',
      classroom_id: '',
      lesson_type: 'instrument',
      instrument: '',
      duration_minutes: 60,
      hourly_rate: ''
    });
  };

  const openModal = () => {
    setEditingLesson(null);
    resetForm();
    setShowModal(true);
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Bilinmiyor';
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : 'Bilinmiyor';
  };

  const getClassroomName = (classroomId) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    return classroom ? classroom.name : 'Bilinmiyor';
  };

  const getFilteredTeachers = () => {
    if (formData.lesson_type === 'art') {
      return teachers.filter(t => t.can_teach_art);
    }
    return teachers;
  };

  const getFilteredClassrooms = () => {
    if (formData.lesson_type === 'art') {
      return classrooms.filter(c => c.type === 'art');
    } else {
      return classrooms.filter(c => c.type === 'instrument');
    }
  };

  if (loading) {
    return (
      <LessonsContainer>
        <div className="loading">Yükleniyor...</div>
      </LessonsContainer>
    );
  }

  return (
    <LessonsContainer>
      <Header>
        <Title>Dersler</Title>
        <AddButton onClick={openModal}>
          <Plus size={20} />
          Yeni Ders
        </AddButton>
      </Header>

      <LessonsTable>
        <TableHeader>
          <div>Öğrenci</div>
          <div>Öğretmen</div>
          <div>Derslik</div>
          <div>Tip</div>
          <div>Enstrüman</div>
          <div>Süre</div>
          <div>Ücret</div>
          <div>İşlemler</div>
        </TableHeader>
        
        {lessons.map((lesson) => (
          <TableRow key={lesson.id}>
            <TableCell>
              <Users size={16} />
              {getStudentName(lesson.student_id)}
            </TableCell>
            <TableCell>
              <BookOpen size={16} />
              {getTeacherName(lesson.teacher_id)}
            </TableCell>
            <TableCell>
              <GraduationCap size={16} />
              {getClassroomName(lesson.classroom_id)}
            </TableCell>
            <TableCell>
              <LessonTypeIcon type={lesson.lesson_type}>
                {lesson.lesson_type === 'art' ? <Palette size={12} /> : <Music size={12} />}
              </LessonTypeIcon>
              {lesson.lesson_type === 'art' ? 'Resim' : 'Enstrüman'}
            </TableCell>
            <TableCell>
              {lesson.instrument && (
                <InstrumentTag>{lesson.instrument}</InstrumentTag>
              )}
            </TableCell>
            <TableCell>{lesson.duration_minutes} dk</TableCell>
            <TableCell>₺{lesson.hourly_rate}</TableCell>
            <ActionsCell>
              <ActionButton className="edit" onClick={() => handleEdit(lesson)}>
                <Edit size={14} />
                Düzenle
              </ActionButton>
              <ActionButton className="delete" onClick={() => handleDelete(lesson.id)}>
                <Trash2 size={14} />
                Sil
              </ActionButton>
            </ActionsCell>
          </TableRow>
        ))}
      </LessonsTable>

      {showModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingLesson ? 'Ders Düzenle' : 'Yeni Ders'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <FormGroup>
                  <Label>Öğrenci</Label>
                  <Select
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: parseInt(e.target.value) })}
                    required
                  >
                    <option value="">Öğrenci seçin</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.first_name} {student.last_name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Öğretmen</Label>
                  <Select
                    value={formData.teacher_id}
                    onChange={(e) => setFormData({ ...formData, teacher_id: parseInt(e.target.value) })}
                    required
                  >
                    <option value="">Öğretmen seçin</option>
                    {getFilteredTeachers().map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.first_name} {teacher.last_name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <FormGroup>
                  <Label>Derslik</Label>
                  <Select
                    value={formData.classroom_id}
                    onChange={(e) => setFormData({ ...formData, classroom_id: parseInt(e.target.value) })}
                    required
                  >
                    <option value="">Derslik seçin</option>
                    {getFilteredClassrooms().map(classroom => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Ders Tipi</Label>
                  <Select
                    value={formData.lesson_type}
                    onChange={(e) => setFormData({ ...formData, lesson_type: e.target.value, teacher_id: '', classroom_id: '' })}
                    required
                  >
                    <option value="instrument">Enstrüman</option>
                    <option value="art">Resim</option>
                  </Select>
                </FormGroup>
              </div>

              {formData.lesson_type === 'instrument' && (
                <FormGroup>
                  <Label>Enstrüman</Label>
                  <Select
                    value={formData.instrument}
                    onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
                  >
                    <option value="">Enstrüman seçin</option>
                    <option value="gitar">Gitar</option>
                    <option value="keman">Keman</option>
                    <option value="piyano">Piyano</option>
                    <option value="bağlama">Bağlama</option>
                    <option value="flüt">Flüt</option>
                    <option value="davul">Davul</option>
                  </Select>
                </FormGroup>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <FormGroup>
                  <Label>Süre (dakika)</Label>
                  <Input
                    type="number"
                    min="30"
                    step="15"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    required
                  />
                </FormGroup>
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
              </div>

              <ModalActions>
                <Button type="button" className="secondary" onClick={() => setShowModal(false)}>
                  İptal
                </Button>
                <Button type="submit" className="primary">
                  {editingLesson ? 'Güncelle' : 'Oluştur'}
                </Button>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}
    </LessonsContainer>
  );
};

export default Lessons;