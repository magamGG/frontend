import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Briefcase, Calendar, Users, Palmtree, Heart, Plane, Bell, User, ClipboardCheck, Activity, UserCog, HeartPulse, FileText } from 'lucide-react';
import { Header } from '../Header';
import { MyPage } from '@/pages/MyPage';
import { AdminMyPage } from '@/pages/admin/AdminMyPage';
import { AgencyMyPage } from '@/pages/agency/AgencyMyPage';
import { LeaveRequestModal } from '@/components/modals/LeaveRequestModal';
import {
  LayoutContainer,
  SectionsContainer,
  ScrollContainer,
  SectionContent,
  DockNavigation,
  DockContainer,
  DockButton,
  Tooltip,
  TooltipContent,
  TooltipArrow,
  IconContainer,
  ActiveIndicator,
} from './FullPageLayout.styled';

/**
 * @typedef {Object} Section
 * @property {string} id
 * @property {string} title
 * @property {import('react').ReactNode | ((props?: any) => import('react').ReactNode)} content
 */

/**
 * @typedef {Object} FullPageLayoutProps
 * @property {Section[]} sections
 * @property {() => void} onLogout
 * @property {'individual' | 'manager' | 'agency' | null} [userRole]
 */

// 페이지별 아이콘 매핑
const getIconForSection = (sectionId, index) => {
  // 담당자 건강관리 아이콘 구분
  if (sectionId === 'personal-health') return HeartPulse; // 담당자가 직접 하는 검사
  
  // 에이전시 페이지 아이콘 매핑
  if (sectionId === 'dashboard' || sectionId === 'agency-dashboard') return Home;
  if (sectionId === 'projects' || sectionId === 'agency-projects') return Briefcase;
  if (sectionId === 'team' || sectionId === 'agency-team') return Users;
  if (sectionId === 'approvals' || sectionId === 'agency-approvals') return ClipboardCheck;
  if (sectionId === 'assignment') return UserCog;
  if (sectionId === 'health' || sectionId.includes('health')) return Activity; // 작가 건강관리
  if (sectionId === 'workcation') return Palmtree;
  if (sectionId.includes('my-page')) return User;
  
  // 담당자 페이지 아이콘 매핑
  if (sectionId === 'manager-dashboard') return Home;
  if (sectionId === 'manager-projects') return Briefcase;
  if (sectionId === 'manager-calendar') return Calendar;
  if (sectionId === 'manager-team') return Users;
  
  // 작가 페이지 아이콘 매핑
  if (sectionId === 'individual-dashboard') return Home;
  if (sectionId === 'individual-projects') return Briefcase;
  if (sectionId === 'individual-calendar') return Calendar;
  if (sectionId === 'portfolio') return FileText;
  if (sectionId.includes('vacation')) return Plane;
  
  // 기본 아이콘 (이전 방식)
  const defaultIcons = [Home, Briefcase, Calendar, Users, Palmtree, Bell, Heart, Plane, User];
  return defaultIcons[index] || Home;
};

/**
 * @param {FullPageLayoutProps} props
 */
export function FullPageLayout({ sections, onLogout, userRole }) {
  const [activeSection, setActiveSection] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [showMyPage, setShowMyPage] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  // Navigate to section
  const navigateToSection = (index) => {
    if (index < 0 || index >= sections.length) return;
    setActiveSection(index);
  };

  // Handle profile click
  const handleProfileClick = () => {
    setShowMyPage(true);
  };

  // Handle close my page
  const handleCloseMyPage = () => {
    setShowMyPage(false);
  };

  // Handle attendance modal
  const handleAttendanceClick = () => {
    // 모달만 열기 (페이지 이동 없음)
    setIsAttendanceModalOpen(true);
  };

  // Handle scroll to show/hide header
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const newShowHeader = scrollTop < 50;
      setShowHeader(newShowHeader);
    };

    // Add scroll listener
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  // Reset scroll and show header when changing sections
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = 0;
      setShowHeader(true);
    }
  }, [activeSection]);

  return (
    <LayoutContainer>
      {/* Header */}
      <Header 
        currentPage={sections[activeSection].title} 
        onProfileClick={handleProfileClick}
        onNavigateToSection={navigateToSection}
        sections={sections}
        onAttendanceClick={handleAttendanceClick}
        userRole={userRole}
      />

      {/* Full Page Sections Container */}
      <SectionsContainer>
        <ScrollContainer ref={scrollContainerRef}>
          <AnimatePresence mode="wait">
            <SectionContent
              as={motion.div}
              key={activeSection}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
            >
              {typeof sections[activeSection].content === 'function' 
                ? sections[activeSection].content({ 
                    openAttendanceModal: isAttendanceModalOpen,
                    onCloseAttendanceModal: () => setIsAttendanceModalOpen(false),
                    onNavigateToSection: navigateToSection
                  })
                : sections[activeSection].content
              }
            </SectionContent>
          </AnimatePresence>
        </ScrollContainer>
      </SectionsContainer>

      {/* Dock Navigation - Bottom */}
      <DockNavigation>
        <DockContainer
          as={motion.div}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        >
          {sections.map((section, index) => {
            const Icon = getIconForSection(section.id, index);
            const isActive = activeSection === index;
            
            return (
              <DockButton
                key={section.id}
                as={motion.button}
                onClick={() => navigateToSection(index)}
                title={section.title}
                whileHover={{ y: -8, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Tooltip - appears above icon on hover */}
                <Tooltip
                  as={motion.div}
                  initial={false}
                  whileHover={{ y: -4 }}
                >
                  <TooltipContent>
                    {section.title}
                  </TooltipContent>
                  <TooltipArrow />
                </Tooltip>

                {/* Icon Container */}
                <IconContainer
                  as={motion.div}
                  $isActive={isActive}
                  animate={{ 
                    scale: isActive ? 1.15 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {Icon && <Icon style={{ width: isActive ? '24px' : '20px', height: isActive ? '24px' : '20px' }} />}
                </IconContainer>

                {/* Active Indicator */}
                {isActive && (
                  <ActiveIndicator
                    as={motion.div}
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </DockButton>
            );
          })}
        </DockContainer>
      </DockNavigation>

      {/* My Page Overlay */}
      <AnimatePresence>
        {showMyPage && userRole === 'manager' && (
          <AdminMyPage onClose={handleCloseMyPage} onLogout={onLogout} />
        )}
        {showMyPage && userRole === 'agency' && (
          <AgencyMyPage onClose={handleCloseMyPage} onLogout={onLogout} />
        )}
        {showMyPage && (userRole === 'individual' || !userRole) && (
          <MyPage onClose={handleCloseMyPage} onLogout={onLogout} />
        )}
      </AnimatePresence>

      {/* Attendance Request Modal */}
      <LeaveRequestModal 
        open={isAttendanceModalOpen} 
        onOpenChange={setIsAttendanceModalOpen} 
      />
    </LayoutContainer>
  );
}
