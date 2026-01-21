import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const SidebarContainer = styled.div`
  width: 256px;
  background-color: var(--sidebar);
  border-right: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const LogoSection = styled.div`
  padding: 24px;
  border-bottom: 1px solid var(--sidebar-border);
`;

export const LogoTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  color: var(--sidebar-foreground);
  margin: 0;
`;

export const LogoSubtitle = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 4px 0 0 0;
`;

export const Navigation = styled.nav`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.2s;
  text-decoration: none;
  color: var(--sidebar-foreground);

  ${({ $isActive }) =>
    $isActive
      ? `
    background-color: var(--sidebar-primary);
    color: var(--sidebar-primary-foreground);
    font-weight: 500;
  `
      : `
    &:hover {
      background-color: var(--sidebar-accent);
      color: var(--sidebar-accent-foreground);
    }
  `}
`;

export const NavIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UserSection = styled.div`
  padding: 16px;
  border-top: 1px solid var(--sidebar-border);
`;

export const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--sidebar-accent);
  border-radius: 8px;
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--sidebar-primary);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UserInitial = styled.span`
  color: var(--sidebar-primary-foreground);
  font-weight: 600;
`;

export const UserInfo = styled.div`
  flex: 1;
`;

export const UserName = styled.p`
  font-weight: 500;
  color: var(--sidebar-foreground);
  margin: 0;
`;

export const UserRole = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;
