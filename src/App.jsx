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
   * @param {UserRole} role
   * @param {boolean} [affiliated=true]
   */
  const handleLogin = (role, affiliated = true) => {
    setUserRole(role);
    setHasAgency(affiliated);
    
    if (!affiliated && (role === 'individual' || role === 'manager')) {
      // If no agency affiliation, go to join request page
      setAuthView('join-request');
    } else {
      setAuthView('dashboard');
    }
  };

  const handleSignup = () => {
    // After successful signup, redirect to dashboard
    setUserRole('individual'); // Default role for signup
    setHasAgency(true);
    setAuthView('dashboard');
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
          title: '캘린더',
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
          title: '작가 캘린더',
          content: (props) => <ArtistCalendarPage {...props} />,
        },
        {
          id: 'manager-dashboard',
          title: '담당자 대시보드',
          content: (props) => <AdminDashboardPage {...props} />,
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
