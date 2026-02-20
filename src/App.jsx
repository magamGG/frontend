import { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { FullPageLayout } from '@/components/layout/FullPageLayout';
import { LoginPage } from '@/pages/Login';
import { SignupPage } from '@/pages/Signup';
import { ForgotPasswordPage } from '@/pages/ForgotPassword';
import { JoinAgencyRequestPage } from '@/pages/JoinAgencyRequest';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ProjectProvider } from '@/contexts/ProjectContext';
import useAuthStore from '@/store/authStore';
import { AiChatBot } from '@/components/common/AiChatBot';

// Lazy load artist pages
const ArtistDashboardPage = lazy(() => import('@/pages/artist/ArtistDashboard').then(m => ({ default: m.ArtistDashboardPage })));
const ArtistProjectsPage = lazy(() => import('@/pages/artist/ArtistProjects').then(m => ({ default: m.ArtistProjectsPage })));
const ArtistCalendarPage = lazy(() => import('@/pages/artist/ArtistCalendar').then(m => ({ default: m.ArtistCalendarPage })));
const ArtistWorkationPage = lazy(() => import('@/pages/artist/ArtistWorkation').then(m => ({ default: m.ArtistWorkationPage })));
const ArtistTeamPage = lazy(() => import('@/pages/artist/ArtistTeam').then(m => ({ default: m.ArtistTeamPage })));
const ArtistHealthPage = lazy(() => import('@/pages/artist/ArtistHealth').then(m => ({ default: m.ArtistHealthPage })));

// Lazy load admin pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboardPage })));
const AdminProjectsPage = lazy(() => import('@/pages/admin/AdminProjects').then(m => ({ default: m.AdminProjectsPage })));
const AdminCalendarPage = lazy(() => import('@/pages/admin/AdminCalendar').then(m => ({ default: m.AdminCalendarPage })));
const AdminTeamPage = lazy(() => import('@/pages/admin/AdminTeam').then(m => ({ default: m.AdminTeamPage })));
const AdminHealthPage = lazy(() => import('@/pages/admin/AdminHealth').then(m => ({ default: m.AdminHealthPage })));
const AdminPersonalHealthPage = lazy(() => import('@/pages/admin/AdminPersonalHealth').then(m => ({ default: m.AdminPersonalHealthPage })));
const AdminMyPage = lazy(() => import('@/pages/admin/AdminMyPage').then(m => ({ default: m.AdminMyPage })));
const AdminWorkcationPage = lazy(() => import('@/pages/admin/AdminWorkcation').then(m => ({ default: m.AdminWorkcationPage })));

// Lazy load agency pages
const AgencyDashboardPage = lazy(() => import('@/pages/agency/AgencyDashboard').then(m => ({ default: m.AgencyDashboardPage })));
const AgencyProjectsPage = lazy(() => import('@/pages/agency/AgencyProjects').then(m => ({ default: m.AgencyProjectsPage })));
const AgencyTeamPage = lazy(() => import('@/pages/agency/AgencyTeam').then(m => ({ default: m.AgencyTeamPage })));
const AgencyApprovalsPage = lazy(() => import('@/pages/agency/AgencyApprovals').then(m => ({ default: m.AgencyApprovalsPage })));
const AgencyWorkcationPage = lazy(() => import('@/pages/agency/AgencyWorkcation').then(m => ({ default: m.AgencyWorkcationPage })));
const AgencyMyPage = lazy(() => import('@/pages/agency/AgencyMyPage').then(m => ({ default: m.AgencyMyPage })));
const AgencyHealthPage = lazy(() => import('@/pages/agency/AgencyHealth').then(m => ({ default: m.AgencyHealthPage })));
const AgencyAssignmentPage = lazy(() => import('@/pages/agency/AgencyAssignment').then(m => ({ default: m.AgencyAssignmentPage })));
const AgencyLeaveSettingsPage = lazy(() => import('@/pages/agency/AgencyLeaveSettings').then(m => ({ default: m.AgencyLeaveSettingsPage })));

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600">페이지 로딩 중...</p>
    </div>
  </div>
);

/**
 * @typedef {'login' | 'signup' | 'forgot-password' | 'dashboard' | 'join-request'} AuthView
 * @typedef {'individual' | 'manager' | 'agency' | 'all' | null} UserRole
 */

export default function App() {
  // Notion OAuth 팝업 콜백 감지: 팝업으로 열렸고 code 파라미터가 있으면 부모에 전달 후 닫기
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code && window.opener) {
      window.opener.postMessage({ type: 'notion-callback', code, state: params.get('state') }, '*');
      setTimeout(() => window.close(), 300);
    }
  }, []);

  const [authView, setAuthView] = useState('login');
  const [userRole, setUserRole] = useState(null);
  const [hasAgency, setHasAgency] = useState(true); // Track if user has agency affiliation
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 (새로고침 시 깜빡임 방지)

  // Zustand store에서 저장된 인증 정보 가져오기
  const { user, token, isAuthenticated, logout: storeLogout, initializeAuth } = useAuthStore();

  // 세션 복구 (JWT refresh 토큰 연동: 토큰 있으면 세션 유지, 비소속이면 join-request로)
  // 페이지 로드 시 인증 상태 복원
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // 1. 먼저 Refresh Token으로 Access Token 복원 시도
        const restored = await initializeAuth();
        
        // 2. 복원 성공 후 또는 이미 token이 있는 경우 사용자 정보 확인
        const currentUser = useAuthStore.getState().user;
        const currentToken = useAuthStore.getState().token;
        const currentIsAuthenticated = useAuthStore.getState().isAuthenticated;
        
        if ((restored || (currentToken && currentUser && currentIsAuthenticated)) && currentUser) {
          // 인증 상태 복원 성공 → 역할에 따라 화면 설정
          const memberRole = currentUser.memberRole;
          const agencyNo = currentUser.agencyNo;
          const hasAgencyVal = agencyNo != null && agencyNo !== '' && agencyNo !== 0;

          // 어시스트 역할 포함한 상세한 역할 분류
          const artistAndManagerRoles = [
            '웹툰 작가',
            '웹소설 작가',
            '어시스트 - 채색',
            '어시스트 - 조명',
            '어시스트 - 배경',
            '어시스트 - 선화',
            '어시스트 - 기타',
            '담당자',
          ];
          const isArtistOrManager = artistAndManagerRoles.includes(memberRole) || (memberRole?.startsWith?.('어시스트'));

          let roleType = null;
          if (memberRole === '에이전시 관리자') {
            roleType = 'agency';
            setAuthView('dashboard');
          } else if (isArtistOrManager) {
            roleType = memberRole === '담당자' ? 'manager' : 'individual';
            setAuthView(hasAgencyVal ? 'dashboard' : 'join-request');
          } else {
            roleType = 'individual';
            setAuthView('dashboard');
          }
          
          setUserRole(roleType);
          setHasAgency(hasAgencyVal);
        } else {
          // 복원 실패 또는 토큰 없음 → 로그인 화면
          setAuthView('login');
          setUserRole(null);
          setHasAgency(false);
        }
      } catch (error) {
        console.error('세션 복원 실패:', error);
        setAuthView('login');
        setUserRole(null);
        setHasAgency(false);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, [initializeAuth]);

  /**
   * @param {string} memberRole - 백엔드에서 받은 실제 MEMBER_ROLE 값 (예: "웹툰 작가", "담당자", "에이전시 관리자")
   * @param {number|null|undefined} agencyNo - AGENCY_NO 값 (null/undefined/0이면 비소속)
   */
  const handleLogin = (memberRole, agencyNo) => {
    if (!memberRole) {
      console.error('memberRole이 없습니다.');
      return;
    }

    const artistAndManagerRoles = [
      '웹툰 작가',
      '웹소설 작가',
      '어시스트 - 채색',
      '어시스트 - 조명',
      '어시스트 - 배경',
      '어시스트 - 선화',
      '어시스트 - 기타',
      '담당자',
    ];
    const isArtistOrManager = artistAndManagerRoles.includes(memberRole) || (memberRole?.startsWith?.('어시스트'));

    const hasAgencyVal = agencyNo != null && agencyNo !== '' && agencyNo !== 0;

    let roleType = null;
    if (memberRole === '에이전시 관리자') {
      roleType = 'agency';
      setAuthView('dashboard');
    } else if (isArtistOrManager) {
      roleType = memberRole === '담당자' ? 'manager' : 'individual';
      setAuthView(hasAgencyVal ? 'dashboard' : 'join-request');
    } else {
      roleType = 'individual';
      setAuthView('dashboard');
    }

    setUserRole(roleType);
    setHasAgency(hasAgencyVal);
  };

  const handleSignup = () => {
    // 회원가입 완료 후 로그인 페이지로 리다이렉션
    setAuthView('login');
  };

  const handleLogout = () => {
    // Zustand store에서 로그아웃 (localStorage 클리어)
    storeLogout();

    // 로컬 상태 초기화
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

  const handleJoinRequestAck = () => {
    // 요청 완료 화면에서 "완료" 클릭 시: 대시보드로 가지 않고 로그인 화면으로만 이동.
    // 에이전시가 new_request를 승인한 뒤, 사용자가 다시 로그인할 때 agencyNo가 있으므로 그때 대시보드로 이동.
    setAuthView('login');
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
          content: (props) => <AdminDashboardPage {...props} />,
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
      ]
      : userRole === 'agency'
        ? [
          // Agency focused pages
          {
            id: 'dashboard',
            title: '대시보드',
            content: <AgencyDashboardPage />,
          },
          // 전체 프로젝트(에이전시 모든 프로젝트 조회) — MEMBER_ROLE이 에이전시 관리자일 때만 메뉴 노출
          ...(user?.memberRole === '에이전시 관리자'
            ? [{ id: 'projects', title: '전체 프로젝트', content: <AgencyProjectsPage /> }]
            : []),
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

  // 로딩 중일 때 로딩 화면 표시 (깜빡임 방지)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <ProjectProvider>
        <Toaster
          position="top-right"
          duration={1000}
          closeButton={false}
          className="toast-custom"
        />

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
            onSuccess={handleJoinRequestAck}
          />
        )}

        {authView === 'dashboard' && (
          <>
            <Suspense fallback={<PageLoadingFallback />}>
              <FullPageLayout sections={sections} onLogout={handleLogout} userRole={userRole} />
            </Suspense>
            <AiChatBot />
          </>
        )}
      </ProjectProvider>
    </DndProvider>
  );
}
