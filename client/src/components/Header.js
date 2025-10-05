import React, { useState } from 'react';
import styled from 'styled-components';
import { Menu, User } from 'lucide-react';

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

const LoginButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:hover {
    background: #0056b3;
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

const UserDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div`
  position: absolute;
  right: 0;
  background: white;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  border-radius: 5px;
  z-index: 1000;
  display: ${props => props.show ? 'block' : 'none'};
`;

const DropdownItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  color: #333;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:first-child {
    border-radius: 5px 5px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 5px 5px;
  }
`;

const Header = ({ onToggleSidebar }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleLogin = () => {
    // Basit giriş simülasyonu
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowUserDropdown(false);
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onToggleSidebar}>
          <Menu size={24} />
        </MenuButton>
        <Title>Bariton Müzik Yönetim Otomasyonu</Title>
      </LeftSection>
      <RightSection>
        {!isLoggedIn ? (
          <LoginButton onClick={handleLogin}>
            Giriş Yap
          </LoginButton>
        ) : (
          <UserDropdown>
            <UserButton onClick={() => setShowUserDropdown(!showUserDropdown)}>
              <User size={20} />
              <UserName>Fatih</UserName>
            </UserButton>
            <DropdownContent show={showUserDropdown}>
              <DropdownItem onClick={() => setShowUserDropdown(false)}>
                Profil
              </DropdownItem>
              <DropdownItem onClick={() => setShowUserDropdown(false)}>
                Ayarlar
              </DropdownItem>
              <DropdownItem onClick={handleLogout}>
                Çıkış Yap
              </DropdownItem>
            </DropdownContent>
          </UserDropdown>
        )}
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;
