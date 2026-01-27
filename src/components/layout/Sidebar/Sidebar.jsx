import { useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Calendar, 
  Users, 
  Plane, 
  Heart,
  UserX
} from 'lucide-react';
import {
  SidebarContainer,
  LogoSection,
  LogoTitle,
  LogoSubtitle,
  Navigation,
  NavLink,
  NavIcon,
  UserSection,
  UserCard,
  UserAvatar,
  UserInitial,
  UserInfo,
  UserName,
  UserRole,
} from './Sidebar.styled';

const menuItems = [
  { icon: LayoutDashboard, label: '대시보드', path: '/' },
  { icon: FolderKanban, label: '프로젝트 관리', path: '/projects' },
  { icon: Calendar, label: '캘린더', path: '/calendar' },
  { icon: Users, label: '팀 관리', path: '/team' },
  { icon: Plane, label: '워케이션', path: '/workcation' },
  { icon: Heart, label: '건강 관리', path: '/health' },
  { icon: UserX, label: '미출근 관리', path: '/absentee' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <SidebarContainer>
      {/* Logo */}
      <LogoSection>
        <LogoTitle>웹툰 스튜디오</LogoTitle>
        <LogoSubtitle>작가 관리 시스템</LogoSubtitle>
      </LogoSection>

      {/* Navigation */}
      <Navigation>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              $isActive={isActive}
            >
              <NavIcon>
                <Icon style={{ width: '20px', height: '20px' }} />
              </NavIcon>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </Navigation>

      {/* User Info */}
      <UserSection>
        <UserCard>
          <UserAvatar>
            <UserInitial>김</UserInitial>
          </UserAvatar>
          <UserInfo>
            <UserName>김작가</UserName>
            <UserRole>작가</UserRole>
          </UserInfo>
        </UserCard>
      </UserSection>
    </SidebarContainer>
  );
}
