import React from 'react';
import styled from 'styled-components';
import { Menu, Bell, User } from 'lucide-react';

const HeaderContainer = styled.header`
  background: white;
  padding: 15px 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  font-weight: 600;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const NotificationButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  position: relative;
  
  &:hover {
    color: #333;
  }
`;

const UserButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: #333;
  }
`;

const UserName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
`;

const Header = ({ onToggleSidebar }) => {
  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onToggleSidebar}>
          <Menu size={24} />
        </MenuButton>
        <Title>Müzik Okulu Yönetim Sistemi</Title>
      </LeftSection>
      <RightSection>
        <NotificationButton>
          <Bell size={20} />
        </NotificationButton>
        <UserButton>
          <User size={20} />
          <UserName>Admin</UserName>
        </UserButton>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;