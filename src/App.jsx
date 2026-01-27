import { useState } from 'react';
import { Toaster } from 'sonner';
import { FullPageLayout } from '@/components/layout/FullPageLayout';
import { LoginPage } from '@/pages/Login';
import { SignupPage } from '@/pages/Signup';
import { ForgotPasswordPage } from '@/pages/ForgotPassword';
import { JoinAgencyRequestPage } from '@/pages/JoinAgencyRequest';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ProjectProvider } from '@/contexts/ProjectContext';

// Import artist pages
import { ArtistDashboardPage } from '@/pages/artist/ArtistDashboard';
import { ArtistProjectsPage } from '@/pages/artist/ArtistProjects';
import { ArtistCalendarPage } from '@/pages/artist/ArtistCalendar';
import { ArtistWorkationPage } from '@/pages/artist/ArtistWorkation';
import { ArtistTeamPage } from '@/pages/artist/ArtistTeam';
import { ArtistHealthPage } from '@/pages/artist/ArtistHealth';
import { AttendancePage } from '@/pages/Attendance';

// Import admin pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboard';
import { AdminProjectsPage } from '@/pages/admin/AdminProjects';
import { AdminCalendarPage } from '@/pages/admin/AdminCalendar';
import { AdminTeamPage } from '@/pages/admin/AdminTeam';
import { AdminHealthPage } from '@/pages/admin/AdminHealth';
import { AdminPersonalHealthPage } from '@/pages/admin/AdminPersonalHealth';
import { AdminAbsenteePage } from '@/pages/admin/AdminAbsentee';
import { AdminMyPage } from '@/pages/admin/AdminMyPage';
import { AdminWorkcationPage } from '@/pages/admin/AdminWorkcation';

// Import agency pages
import { AgencyDashboardPage } from '@/pages/agency/AgencyDashboard';
import { AgencyProjectsPage } from '@/pages/agency/AgencyProjects';
import { AgencyTeamPage } from '@/pages/agency/AgencyTeam';
import { AgencyApprovalsPage } from '@/pages/agency/AgencyApprovals';
import { AgencyWorkcationPage } from '@/pages/agency/AgencyWorkcation';
import { AgencyMyPage } from '@/pages/agency/AgencyMyPage';
import { AgencyHealthPage } from '@/pages/agency/AgencyHealth';
import { AgencyAssignmentPage } from '@/pages/agency/AgencyAssignment';
import { AgencyLeaveSettingsPage } from '@/pages/agency/AgencyLeaveSettings';

/**
 * @typedef {'login' | 'signup' | 'forgot-password' | 'dashboard' | 'join-request'} AuthView
 * @typedef {'individual' | 'manager' | 'agency' | 'all' | null} UserRole
 */

export default function App() {
  const [authView, setAuthView] = useState('login');
  const [userRole, setUserRole] = useState(null);
  const [hasAgency, setHasAgency] = useState(true); // Track if user has agency affiliation

  /**
   * @param {string} memberRole - 백엔드에서 받은 실제 MEMBER_ROLE 값 (예: "웹툰 작가", "담당자", "에이전시 관리자")
   * @param {number|null} agencyNo - AGENCY_NO 값 (null일 수 있음)
   */
  const handleLogin = (memberRole, agencyNo) => {
    // memberRole이 없으면 기본값 처리
    if (!memberRole) {
      console.error('memberRole이 없습니다.');
      return;
    }
    
    // 아티스트/담당자 역할 목록
    const artistAndManagerRoles = [
      '웹툰 작가',
      '웹소설 작가',
      '어시스트 - 채색',
      '어시스트 - 조명',
      '어시스트 - 배경',
      '어시스트 - 선화',
      '어시스트- 기타',
      '담당자'
    ];
    
    // 프론트엔드에서 사용할 역할 타입 매핑
    let roleType = null;
    let hasAgency = agencyNo !== null && agencyNo !== undefined;
    
    if (memberRole === '에이전시 관리자') {
      // 에이전시 관리자는 항상 대시보드로 이동
      roleType = 'agency';
      setAuthView('dashboard');
    } else if (artistAndManagerRoles.includes(memberRole)) {
      // 아티스트/담당자 역할인 경우
      if (!hasAgency) {
        // AGENCY_NO가 NULL인 경우 비소속 에이전시 가입 요청 페이지로 이동
        roleType = memberRole === '담당자' ? 'manager' : 'individual';
        setAuthView('join-request');
      } else {
        // AGENCY_NO가 NULL이 아닌 경우 담당자/아티스트 대시보드로 이동
        roleType = memberRole === '담당자' ? 'manager' : 'individual';
        setAuthView('dashboard');
      }
    } else {
      // 알 수 없는 역할인 경우 기본값으로 처리
      roleType = 'individual';
      setAuthView('dashboard');
    }
    
    setUserRole(roleType);
    setHasAgency(hasAgency);
  };

  const handleSignup = () => {
    // 회원가입 완료 후 로그인 페이지로 리다이렉션
    setAuthView('login');
  };

  const handleLogout = () => {
    setUserRole(null);
    setHasAgency(true);
    setAuthView('login');
  };

  const handleShowSignup = () => {
    setAuthView('signup');
  };

  const handleShowForgotPassword = () => {
    setAuthView('forgot-password');
  };

  const handleBackToLogin = () => {
    setAuthView('login');
  };

  const handleJoinRequestSuccess = () => {
    // After successful join request, go to dashboard
    setHasAgency(true);
    setAuthView('dashboard');
  };

  // Define sections based on user role
  const sections = userRole === 'individual' 
    ? [
        // Individual (Artist) focused pages
        {
          id: 'dashboard',
          title: '대시보드',
          content: <ArtistDashboardPage />,
        },
        {
          id: 'projects',
          title: '프로젝트 관리',
          content: <ArtistProjectsPage />,
        },
        {
          id: 'calendar',
          title: '일정',
          content: (props) => <ArtistCalendarPage {...props} />,
        },
        {
          id: 'health',
          title: '건강관리',
          content: <ArtistHealthPage />,
        },
      ]
    : userRole === 'manager'
    ? [
        // Manager (Admin) focused pages
        {
          id: 'dashboard',
          title: '대시보드',
          content: <AdminDashboardPage />,
        },
        {
          id: 'projects',
          title: '프로젝트 관리',
          content: <AdminProjectsPage />,
        },
        {
          id: 'calendar',
          title: '캘린더',
          content: <AdminCalendarPage />,
        },
        {
          id: 'team',
          title: '직원 관리',
          content: <AdminTeamPage />,
        },
        {
          id: 'workcation',
          title: '원격 관리',
          content: <AgencyWorkcationPage />,
        },
        {
          id: 'personal-health',
          title: '건강 검사',
          content: <AdminPersonalHealthPage />,
        },
        {
          id: 'health',
          title: '작가 건강관리',
          content: <AdminHealthPage />,
        },
        {
          id: 'attendance',
          title: '근태 관리',
          content: <AttendancePage />,
        },
      ]
    : userRole === 'agency'
    ? [
        // Agency focused pages
        {
          id: 'dashboard',
          title: '대시보드',
          content: <AgencyDashboardPage />,
        },
        {
          id: 'projects',
          title: '전체 프로젝트',
          content: <AgencyProjectsPage />,
        },
        {
          id: 'team',
          title: '전체 직원',
          content: <AgencyTeamPage />,
        },
        {
          id: 'approvals',
          title: '요청 관리',
          content: <AgencyApprovalsPage />,
        },
        {
          id: 'health',
          title: '건강관리',
          content: <AgencyHealthPage />,
        },
        {
          id: 'workcation',
          title: '원격 관리',
          content: <AgencyWorkcationPage />,
        },
        {
          id: 'assignment',
          title: '할당 관리',
          content: <AgencyAssignmentPage />,
        },
        {
          id: 'leave-settings',
          title: '연차 설정',
          content: <AgencyLeaveSettingsPage />,
        },
      ]
    : [
        // All pages - for development/preview
        {
          id: 'individual-dashboard',
          title: '개인 대시보드',
          content: <ArtistDashboardPage />,
        },
        {
          id: 'individual-projects',
          title: '내 작품',
          content: <ArtistProjectsPage />,
        },
        {
          id: 'individual-calendar',
          title: '작가 일정',
          content: (props) => <ArtistCalendarPage {...props} />,
        },
        {
          id: 'manager-dashboard',
          title: '담당자 대시보드',
          content: <AdminDashboardPage />,
        },
        {
          id: 'manager-projects',
          title: '프로젝트 관리',
          content: <AdminProjectsPage />,
        },
        {
          id: 'manager-calendar',
          title: '담당자 캘린더',
          content: <AdminCalendarPage />,
        },
        {
          id: 'manager-team',
          title: '직원 관리',
          content: <AdminTeamPage />,
        },
        {
          id: 'manager-attendance',
          title: '근태 관리',
          content: <AttendancePage />,
        },
        {
          id: 'agency-dashboard',
          title: '에이전시 대시보드',
          content: <AgencyDashboardPage />,
        },
        {
          id: 'agency-projects',
          title: '에이전시 프로젝트',
          content: <AgencyProjectsPage />,
        },
        {
          id: 'agency-team',
          title: '전체 직원',
          content: <AgencyTeamPage />,
        },
        {
          id: 'agency-approvals',
          title: '승인 관리',
          content: <AgencyApprovalsPage />,
        },
        {
          id: 'health',
          title: '전사 건강',
          content: <AdminHealthPage />,
        },
        {
          id: 'workcation',
          title: '원격 관리',
          content: <AgencyWorkcationPage />,
        },
        {
          id: 'manager-my-page',
          title: '내 정보',
          content: (props) => (
            <AdminMyPage 
              onClose={() => props?.onNavigateToSection?.(0)} 
              onLogout={handleLogout}
            />
          ),
        },
        {
          id: 'agency-my-page',
          title: '내 정보',
          content: (props) => (
            <AgencyMyPage 
              onClose={() => props?.onNavigateToSection?.(0)} 
              onLogout={handleLogout}
            />
          ),
        },
      ];

  return (
    <DndProvider backend={HTML5Backend}>
      <ProjectProvider>
        <Toaster position="top-right" />
        
        {authView === 'login' && (
          <LoginPage 
            onLogin={handleLogin} 
            onShowSignup={handleShowSignup}
            onShowForgotPassword={handleShowForgotPassword}
          />
        )}

        {authView === 'signup' && (
          <SignupPage onSignup={handleSignup} onBackToLogin={handleBackToLogin} />
        )}

        {authView === 'forgot-password' && (
          <ForgotPasswordPage onBackToLogin={handleBackToLogin} />
        )}

        {authView === 'join-request' && (
          <JoinAgencyRequestPage 
            onBack={handleBackToLogin}
            onSuccess={handleJoinRequestSuccess}
          />
        )}

        {authView === 'dashboard' && (
          <FullPageLayout sections={sections} onLogout={handleLogout} userRole={userRole} />
        )}
      </ProjectProvider>
    </DndProvider>
  );
}
