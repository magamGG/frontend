// API 기본 설정
export const API_BASE_URL = 'http://localhost:8888';
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
  },

  // 출석/근태 API
  ATTENDANCE: {
    CHECK_IN: `/api/attendance/check-in`, // POST: 출근 체크
    HISTORY: (memberNo, startDate, endDate) => 
      `/api/attendance/history?memberNo=${memberNo}&startDate=${startDate}&endDate=${endDate}`, // GET: 출석 이력 조회
  },

  // 연차/휴가 API
  LEAVE: {
    REQUEST: `/api/leave/request`, // POST: 연차 신청
    LIST: (memberNo, year) => `/api/leave/list?memberNo=${memberNo}&year=${year}`, // GET: 연차 목록 조회
    BALANCE: (memberNo) => `/api/leave/balance/${memberNo}`, // GET: 연차 잔액 조회
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
  },

  // 건강 관리 API
  HEALTH: {
    SURVEY: `/api/health/survey`, // POST: 건강 설문 응답 제출
    DAILY_CHECK: `/api/health/daily-check`, // POST: 일일 건강 체크 등록
  },

  // 에이전시 API
  AGENCY: {
    JOIN_REQUEST: `/api/agency/join-request`, // POST: 에이전시 가입 요청
  },
};

export default {
  API_BASE_URL,
  API_TIMEOUT,
  API_ENDPOINTS,
};
