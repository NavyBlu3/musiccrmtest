import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calendar, Clock, Plus, Edit, Trash2, Users, GraduationCap, BookOpen } from 'lucide-react';
import axios from 'axios';

const ScheduleContainer = styled.div`
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

const CalendarContainer = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 30px;
`;

const WeekView = styled.div`
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  gap: 1px;
  background: #dee2e6;
  border-radius: 8px;
  overflow: hidden;
`;

const TimeColumn = styled.div`
  background: #f8f9fa;
  padding: 10px;
  font-weight: 600;
  color: #333;
  text-align: center;
  border-right: 2px solid #dee2e6;
`;

const DayHeader = styled.div`
  background: #007bff;
  color: white;
  padding: 15px 10px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
`;

const DayColumn = styled.div`
  background: white;
  min-height: 600px;
  position: relative;
`;

const TimeSlot = styled.div`
  height: 60px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #666;
`;

const LessonBlock = styled.div`
  position: absolute;
  left: 2px;
  right: 2px;
  background: ${props => props.type === 'art' ? '#ff6b6b' : '#4ecdc4'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  z-index: 10;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ScheduleTable = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #dee2e6;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
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

const DayName = styled.span`
  font-weight: 600;
  color: #333;
`;

const TimeRange = styled.span`
  color: #666;
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

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
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

const ViewToggle = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ToggleButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f8f9fa'};
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

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
  const [filters, setFilters] = useState({
    search: '',
    day_of_week: '',
    lesson_type: ''
  });
  const [formData, setFormData] = useState({
    lesson_id: '',
    day_of_week: 1,
    start_time: '',
    end_time: '',
    is_recurring: true,
    start_date: '',
    end_date: ''
  });

  const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterSchedule();
  }, [schedule, filters]);

  const filterSchedule = () => {
    let filtered = [...schedule];

    // Arama filtresi
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(scheduleItem => {
        const lessonInfo = getLessonInfo(scheduleItem.lesson_id);
        if (!lessonInfo) return false;
        return lessonInfo.student.toLowerCase().includes(searchLower) ||
               lessonInfo.teacher.toLowerCase().includes(searchLower) ||
               lessonInfo.instrument?.toLowerCase().includes(searchLower);
      });
    }

    // Gün filtresi
    if (filters.day_of_week) {
      filtered = filtered.filter(scheduleItem => 
        scheduleItem.day_of_week === parseInt(filters.day_of_week)
      );
    }

    // Ders tipi filtresi
    if (filters.lesson_type) {
      filtered = filtered.filter(scheduleItem => {
        const lessonInfo = getLessonInfo(scheduleItem.lesson_id);
        if (!lessonInfo) return false;
        return lessonInfo.type === filters.lesson_type;
      });
    }

    setFilteredSchedule(filtered);
  };

  const fetchData = async () => {
    try {
      const [scheduleRes, lessonsRes] = await Promise.all([
        axios.get('/api/schedule'),
        axios.get('/api/lessons')
      ]);

      setSchedule(scheduleRes.data);
      setLessons(lessonsRes.data);
    } catch (error) {
      console.error('Veriler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSchedule) {
        await axios.put(`/api/schedule/${editingSchedule.id}`, formData);
      } else {
        await axios.post('/api/schedule', formData);
      }
      fetchData();
      setShowModal(false);
      setEditingSchedule(null);
      resetForm();
    } catch (error) {
      console.error('Program kaydedilemedi:', error);
    }
  };

  const handleEdit = (scheduleItem) => {
    setEditingSchedule(scheduleItem);
    setFormData({
      lesson_id: scheduleItem.lesson_id,
      day_of_week: scheduleItem.day_of_week,
      start_time: scheduleItem.start_time,
      end_time: scheduleItem.end_time,
      is_recurring: scheduleItem.is_recurring,
      start_date: scheduleItem.start_date,
      end_date: scheduleItem.end_date || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu programı silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/schedule/${id}`);
        fetchData();
      } catch (error) {
        console.error('Program silinemedi:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      lesson_id: '',
      day_of_week: 1,
      start_time: '',
      end_time: '',
      is_recurring: true,
      start_date: '',
      end_date: ''
    });
  };

  const openModal = () => {
    setEditingSchedule(null);
    resetForm();
    setShowModal(true);
  };

  const getLessonInfo = (lessonId) => {
    const lesson = lessons.find(l => l.id === lessonId);
    return lesson ? {
      student: `${lesson.student_first_name} ${lesson.student_last_name}`,
      teacher: `${lesson.teacher_first_name} ${lesson.teacher_last_name}`,
      instrument: lesson.instrument,
      type: lesson.lesson_type
    } : null;
  };

  const getScheduleForDay = (dayOfWeek) => {
    return schedule.filter(s => s.day_of_week === dayOfWeek);
  };

  const getTimePosition = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return ((hours - 8) * 60 + minutes) * (60 / 60); // 60px per hour
  };

  const getTimeHeight = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const duration = (endHours - startHours) * 60 + (endMinutes - startMinutes);
    return duration * (60 / 60); // 60px per hour
  };

  if (loading) {
    return (
      <ScheduleContainer>
        <div className="loading">Yükleniyor...</div>
      </ScheduleContainer>
    );
  }

  return (
    <ScheduleContainer>
      <Header>
        <Title>Ders Programı</Title>
        <AddButton onClick={openModal}>
          <Plus size={20} />
          Yeni Program
        </AddButton>
      </Header>

      <ViewToggle>
        <ToggleButton 
          active={viewMode === 'table'} 
          onClick={() => setViewMode('table')}
        >
          Liste Görünümü
        </ToggleButton>
        <ToggleButton 
          active={viewMode === 'calendar'} 
          onClick={() => setViewMode('calendar')}
        >
          Takvim Görünümü
        </ToggleButton>
      </ViewToggle>

      <FilterSection>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Filtreler</h3>
        <FilterRow>
          <FilterGroup>
            <FilterLabel>Arama</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Öğrenci, öğretmen veya enstrüman ile ara..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Gün</FilterLabel>
            <FilterSelect
              value={filters.day_of_week}
              onChange={(e) => setFilters({ ...filters, day_of_week: e.target.value })}
            >
              <option value="">Tüm Günler</option>
              {dayNames.map((day, index) => (
                <option key={index} value={index}>{day}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Ders Tipi</FilterLabel>
            <FilterSelect
              value={filters.lesson_type}
              onChange={(e) => setFilters({ ...filters, lesson_type: e.target.value })}
            >
              <option value="">Tüm Dersler</option>
              <option value="instrument">Enstrüman</option>
              <option value="art">Resim</option>
            </FilterSelect>
          </FilterGroup>
          <ClearButton onClick={() => setFilters({ search: '', day_of_week: '', lesson_type: '' })}>
            Temizle
          </ClearButton>
        </FilterRow>
      </FilterSection>

      {viewMode === 'calendar' ? (
        <CalendarContainer>
          <WeekView>
            <TimeColumn>Zaman</TimeColumn>
            {dayNames.map((day, index) => (
              <React.Fragment key={index}>
                <DayHeader>{day}</DayHeader>
                <DayColumn>
                  {timeSlots.map((time, timeIndex) => (
                    <TimeSlot key={timeIndex}>{time}</TimeSlot>
                  ))}
                  {getScheduleForDay(index).filter(scheduleItem => {
                    const lessonInfo = getLessonInfo(scheduleItem.lesson_id);
                    if (!lessonInfo) return false;
                    
                    // Arama filtresi
                    if (filters.search) {
                      const searchLower = filters.search.toLowerCase();
                      if (!lessonInfo.student.toLowerCase().includes(searchLower) &&
                          !lessonInfo.teacher.toLowerCase().includes(searchLower) &&
                          !lessonInfo.instrument?.toLowerCase().includes(searchLower)) {
                        return false;
                      }
                    }
                    
                    // Ders tipi filtresi
                    if (filters.lesson_type && lessonInfo.type !== filters.lesson_type) {
                      return false;
                    }
                    
                    return true;
                  }).map((scheduleItem) => {
                    const lessonInfo = getLessonInfo(scheduleItem.lesson_id);
                    if (!lessonInfo) return null;
                    
                    return (
                      <LessonBlock
                        key={scheduleItem.id}
                        type={scheduleItem.lesson_type}
                        style={{
                          top: getTimePosition(scheduleItem.start_time),
                          height: getTimeHeight(scheduleItem.start_time, scheduleItem.end_time)
                        }}
                        onClick={() => handleEdit(scheduleItem)}
                      >
                        <div>{lessonInfo.student}</div>
                        <div>{lessonInfo.instrument}</div>
                      </LessonBlock>
                    );
                  })}
                </DayColumn>
              </React.Fragment>
            ))}
          </WeekView>
        </CalendarContainer>
      ) : (
        <ScheduleTable>
          <TableHeader>
            <div>Gün</div>
            <div>Saat</div>
            <div>Öğrenci</div>
            <div>Öğretmen</div>
            <div>Derslik</div>
            <div>Ders</div>
            <div>Tekrarlı</div>
            <div>İşlemler</div>
          </TableHeader>
          
          {filteredSchedule.map((scheduleItem) => {
            const lessonInfo = getLessonInfo(scheduleItem.lesson_id);
            if (!lessonInfo) return null;
            
            return (
              <TableRow key={scheduleItem.id}>
                <TableCell>
                  <Calendar size={16} />
                  <DayName>{dayNames[scheduleItem.day_of_week]}</DayName>
                </TableCell>
                <TableCell>
                  <Clock size={16} />
                  <TimeRange>{scheduleItem.start_time} - {scheduleItem.end_time}</TimeRange>
                </TableCell>
                <TableCell>
                  <Users size={16} />
                  {lessonInfo.student}
                </TableCell>
                <TableCell>
                  <BookOpen size={16} />
                  {lessonInfo.teacher}
                </TableCell>
                <TableCell>
                  <GraduationCap size={16} />
                  {scheduleItem.classroom_name}
                </TableCell>
                <TableCell>
                  {lessonInfo.instrument && (
                    <span style={{ 
                      background: '#e3f2fd', 
                      color: '#1976d2', 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem' 
                    }}>
                      {lessonInfo.instrument}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {scheduleItem.is_recurring ? 'Evet' : 'Hayır'}
                </TableCell>
                <ActionsCell>
                  <ActionButton className="edit" onClick={() => handleEdit(scheduleItem)}>
                    <Edit size={14} />
                    Düzenle
                  </ActionButton>
                  <ActionButton className="delete" onClick={() => handleDelete(scheduleItem.id)}>
                    <Trash2 size={14} />
                    Sil
                  </ActionButton>
                </ActionsCell>
              </TableRow>
            );
          })}
        </ScheduleTable>
      )}

      {showModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingSchedule ? 'Program Düzenle' : 'Yeni Program'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Ders</Label>
                <Select
                  value={formData.lesson_id}
                  onChange={(e) => setFormData({ ...formData, lesson_id: parseInt(e.target.value) })}
                  required
                >
                  <option value="">Ders seçin</option>
                  {lessons.map(lesson => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.student_first_name} {lesson.student_last_name} - {lesson.instrument || lesson.lesson_type}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <FormGroup>
                  <Label>Gün</Label>
                  <Select
                    value={formData.day_of_week}
                    onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value) })}
                    required
                  >
                    {dayNames.map((day, index) => (
                      <option key={index} value={index}>{day}</option>
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Tekrarlı</Label>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.is_recurring}
                      onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                    />
                    <span>Haftalık tekrar</span>
                  </CheckboxGroup>
                </FormGroup>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <FormGroup>
                  <Label>Başlangıç Saati</Label>
                  <Input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Bitiş Saati</Label>
                  <Input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    required
                  />
                </FormGroup>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <FormGroup>
                  <Label>Başlangıç Tarihi</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Bitiş Tarihi (Opsiyonel)</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </FormGroup>
              </div>

              <ModalActions>
                <Button type="button" className="secondary" onClick={() => setShowModal(false)}>
                  İptal
                </Button>
                <Button type="submit" className="primary">
                  {editingSchedule ? 'Güncelle' : 'Oluştur'}
                </Button>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}
    </ScheduleContainer>
  );
};

export default Schedule;