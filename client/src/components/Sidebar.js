import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Home, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  BarChart3,
  X
} from 'lucide-react';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
  
  @media (min-width: 769px) {
    transform: translateX(0);
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Nav = styled.nav`
  padding: 20px 0;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.8)'};
  text-decoration: none;
  transition: all 0.3s ease;
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border-left: ${props => props.active ? '3px solid #fff' : '3px solid transparent'};
  
  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const NavIcon = styled.span`
  margin-right: 12px;
  font-size: 1.2rem;
`;

const NavText = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
`;

const Sidebar = ({ isOpen, onClose, currentPage, onPageChange }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, text: 'Ana Sayfa', key: 'dashboard' },
    { path: '/classrooms', icon: GraduationCap, text: 'Derslikler', key: 'classrooms' },
    { path: '/teachers', icon: Users, text: 'Öğretmenler', key: 'teachers' },
    { path: '/students', icon: BookOpen, text: 'Öğrenciler', key: 'students' },
    { path: '/lessons', icon: BookOpen, text: 'Dersler', key: 'lessons' },
    { path: '/schedule', icon: Calendar, text: 'Program', key: 'schedule' },
    { path: '/payments', icon: CreditCard, text: 'Ödemeler', key: 'payments' },
    { path: '/reports', icon: BarChart3, text: 'Raporlar', key: 'reports' }
  ];

  const handleNavClick = (key) => {
    onPageChange(key);
    onClose();
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader>
        <Logo>Müzik Okulu</Logo>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>
      </SidebarHeader>
      <Nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavItem
              key={item.key}
              to={item.path}
              active={isActive ? 1 : 0}
              onClick={() => handleNavClick(item.key)}
            >
              <NavIcon>
                <Icon size={20} />
              </NavIcon>
              <NavText>{item.text}</NavText>
            </NavItem>
          );
        })}
      </Nav>
    </SidebarContainer>
  );
};

export default Sidebar;