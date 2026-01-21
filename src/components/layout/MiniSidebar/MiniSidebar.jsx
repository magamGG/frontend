import { Home, Briefcase, Calendar, Users, Palmtree, Heart, Plane } from 'lucide-react';
import {
  SidebarContainer,
  Logo,
  NavigationItems,
  NavButton,
  Tooltip,
  TooltipArrow,
  ActiveIndicator,
  SectionIndicators,
  Indicator,
} from './MiniSidebar.styled';

const menuItems = [
  { icon: Home, label: '대시보드', id: 'dashboard' },
  { icon: Briefcase, label: '프로젝트', id: 'projects' },
  { icon: Calendar, label: '캘린더', id: 'calendar' },
  { icon: Users, label: '팀', id: 'team' },
  { icon: Palmtree, label: '워케이션', id: 'workation' },
  { icon: Heart, label: '건강', id: 'health' },
  { icon: Plane, label: '휴가관리', id: 'vacation' },
];

/**
 * @param {Object} props
 * @param {number} props.activeSection
 * @param {(index: number) => void} props.onNavigate
 */
export function MiniSidebar({ activeSection, onNavigate }) {
  return (
    <SidebarContainer>
      {/* Logo */}
      <Logo>
        <span>🥝</span>
      </Logo>

      {/* Navigation Items */}
      <NavigationItems>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === index;
          
          return (
            <NavButton
              key={item.id}
              onClick={() => onNavigate(index)}
              $isActive={isActive}
              title={item.label}
            >
              <Icon style={{ width: '20px', height: '20px' }} />
              
              {/* Tooltip */}
              <Tooltip>
                {item.label}
                <TooltipArrow />
              </Tooltip>

              {/* Active Indicator */}
              {isActive && <ActiveIndicator />}
            </NavButton>
          );
        })}
      </NavigationItems>

      {/* Section Indicators */}
      <SectionIndicators>
        {menuItems.map((_, index) => (
          <Indicator
            key={index}
            $isActive={activeSection === index}
          />
        ))}
      </SectionIndicators>
    </SidebarContainer>
  );
}
