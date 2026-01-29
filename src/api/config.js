// API 기본 설정
// 개발 환경에서는 프록시를 사용하므로 빈 문자열 (상대 경로)
// 프로덕션 환경에서는 전체 URL 사용
export const API_BASE_URL = import.meta.env.PROD 
  ? 'http://localhost:8888'  // 프로덕션 환경 URL (실제 배포 시 변경 필요)
  : '';  // 개발 환경에서는 프록시 사용 (상대 경로)
export const API_TIMEOUT = 10000;

// API 엔드포인트 (가이드 문서 기준)
export const API_ENDPOINTS = {
  // 인증 API
  AUTH: {
    LOGIN: `/api/auth/login`,
  },
  
  // 회원 API
  MEMBERS: {
    BASE: `/api/members`, // POST: 회원가입
    CURRENT: `/api/members/me`, // GET: 현재 회원 정보 조회
    MY_PAGE: (memberNo) => `/api/members/${memberNo}`, // GET: 마이페이지 정보 조회
    UPDATE_PROFILE: (memberNo) => `/api/members/${memberNo}`, // PUT: 프로필 정보 수정
    UPLOAD_PROFILE_IMAGE: (memberNo) => `/api/members/${memberNo}/profile-image`, // POST: 프로필 이미지 업로드
    UPLOAD_BACKGROUND_IMAGE: (memberNo) => `/api/members/${memberNo}/background-image`, // POST: 배경 이미지 업로드
    EMPLOYEE_STATISTICS: (agencyNo) => `/api/members/agency/${agencyNo}/statistics`, // GET: 직원 통계 조회
    DELETE_MEMBER: (memberNo) => `/api/members/${memberNo}`, // DELETE: 회원 탈퇴
  },

  // 출석/근태 API
  ATTENDANCE: {
    CHECK_IN: `/api/attendance/check-in`, // POST: 출근 체크
    HISTORY: (memberNo, startDate, endDate) => 
      `/api/attendance/history?memberNo=${memberNo}&startDate=${startDate}&endDate=${endDate}`, // GET: 출석 이력 조회
    STATISTICS: (memberNo, year, month) => 
      `/api/attendance/statistics/${memberNo}?year=${year}&month=${month}`, // GET: 근태 통계 조회
  },

  // 연차/휴가 API
  LEAVE: {
    REQUEST: `/api/leave/request`, // POST: 연차 신청
    LIST: (memberNo, year) => `/api/leave/list?memberNo=${memberNo}&year=${year}`, // GET: 연차 목록 조회
    BALANCE: (memberNo) => `/api/leave/balance/${memberNo}`, // GET: 연차 잔액 조회
    MY_REQUESTS: `/api/leave/my-requests`, // GET: 내 근태 신청 목록 조회
    AGENCY_REQUESTS: (agencyNo) => `/api/leave/agency/${agencyNo}`, // GET: 에이전시 소속 근태 신청 목록
    AGENCY_PENDING: (agencyNo) => `/api/leave/agency/${agencyNo}/pending`, // GET: 에이전시 소속 대기 중 근태 신청
  },

  // 프로젝트 API
  PROJECTS: {
    CREATE: `/api/projects`, // POST: 프로젝트 생성
    LIST: (page = 0, size = 10) => `/api/projects?page=${page}&size=${size}`, // GET: 프로젝트 목록 조회
    KANBAN: (projectNo) => `/api/projects/${projectNo}/kanban`, // GET: 칸반 보드 조회
  },

  // 캘린더 API
  CALENDAR: {
    CREATE_EVENT: `/api/calendar/events`, // POST: 일정 생성
    EVENTS_BY_MONTH: (year, month) => `/api/calendar/events?year=${year}&month=${month}`, // GET: 월별 일정 조회
  },

  // 알림 API
  NOTIFICATION: {
    LIST: `/api/notifications`, // GET: 알림 목록 조회
    READ: (notificationNo) => `/api/notifications/${notificationNo}/read`, // PUT: 알림 읽음 처리
    READ_ALL: `/api/notifications/read-all`, // PUT: 모든 알림 읽음 처리
    DELETE: (notificationNo) => `/api/notifications/${notificationNo}`, // DELETE: 알림 삭제
  },

  // 건강 관리 API
  HEALTH: {
    SURVEY: `/api/health/survey`, // POST: 건강 설문 응답 제출
    DAILY_CHECK: `/api/health/daily-check`, // POST: 일일 건강 체크 등록
  },

  // 에이전시 API
  AGENCY: {
    JOIN_REQUEST: `/api/agency/join-request`, // POST: 에이전시 가입 요청
    JOIN_REQUESTS: (agencyNo) => `/api/agency/${agencyNo}/join-requests`, // GET: 에이전시 가입 요청 목록 조회
    APPROVE_JOIN_REQUEST: (newRequestNo) => `/api/agency/join-requests/${newRequestNo}/approve`, // POST: 가입 요청 승인
    REJECT_JOIN_REQUEST: (newRequestNo) => `/api/agency/join-requests/${newRequestNo}/reject`, // POST: 가입 요청 거절
  },
};

export default {
  API_BASE_URL,
  API_TIMEOUT,
  API_ENDPOINTS,
};
