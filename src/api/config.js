// API 기본 설정
export const API_BASE_URL = 'http://localhost:8888';
export const API_TIMEOUT = 10000;

// API 엔드포인트
export const API_ENDPOINTS = {
  // 인증 API
  AUTH: {
    LOGIN: `/api/auth/login`,
    LOGOUT: `/api/auth/logout`,
    REFRESH: `/api/auth/refresh`,
    FORGOT_PASSWORD: `/api/auth/forgot-password`,
    RESET_PASSWORD: `/api/auth/reset-password`,
    VERIFY_CODE: `/api/auth/verify-code`,
  },
  
  // 회원 API
  MEMBERS: {
    BASE: `/api/members`,
    DETAIL: (memberNo) => `/api/members/${memberNo}`,
    SEARCH: (keyword) => `/api/members?keyword=${keyword}`,
    CURRENT: `/api/members/me`,
    UPDATE_PROFILE: `/api/members/me`,
  },
  
  // 게시판 API
  BOARD: {
    BASE: '/api/board',
    DETAIL: (boardId) => `/api/board/${boardId}`,
    LIST: (page = 0, size = 10, sort = 'createDate,desc') => 
      `/api/board?page=${page}&size=${size}&sort=${sort}`,
  },

  // 출석/근태 API
  ATTENDANCE: {
    BASE: `/api/attendance`,
    CHECK_IN: `/api/attendance/check-in`,
    CHECK_OUT: `/api/attendance/check-out`,
    STATUS: `/api/attendance/status`,
    HISTORY: (memberNo, startDate, endDate) => 
      `/api/attendance/history?memberNo=${memberNo}&startDate=${startDate}&endDate=${endDate}`,
    MONTHLY: (memberNo, year, month) => 
      `/api/attendance/monthly?memberNo=${memberNo}&year=${year}&month=${month}`,
  },

  // 연차/휴가 API
  LEAVE: {
    BASE: `/api/leave`,
    REQUEST: `/api/leave/request`,
    APPROVE: (attendanceRequestNo) => `/api/leave/${attendanceRequestNo}/approve`,
    REJECT: (attendanceRequestNo) => `/api/leave/${attendanceRequestNo}/reject`,
    CANCEL: (attendanceRequestNo) => `/api/leave/${attendanceRequestNo}/cancel`,
    DETAIL: (attendanceRequestNo) => `/api/leave/${attendanceRequestNo}`,
    LIST: (memberNo, year) => `/api/leave/list?memberNo=${memberNo}&year=${year}`,
    BALANCE: (memberNo) => `/api/leave/balance/${memberNo}`,
    SETTINGS: `/api/leave/settings`,
    EMPLOYEE_SETTINGS: (memberNo) => `/api/leave/settings/employee/${memberNo}`,
    ADJUST: (memberNo) => `/api/leave/adjust/${memberNo}`,
    STATISTICS: `/api/leave/statistics`,
    ENCOURAGE_NOTIFICATION: `/api/leave/encourage-notification`,
  },

  // 프로젝트 API
  PROJECTS: {
    BASE: `/api/projects`,
    DETAIL: (projectNo) => `/api/projects/${projectNo}`,
    LIST: (page = 0, size = 10) => `/api/projects?page=${page}&size=${size}`,
    CREATE: `/api/projects`,
    UPDATE: (projectNo) => `/api/projects/${projectNo}`,
    DELETE: (projectNo) => `/api/projects/${projectNo}`,
    ASSIGN: (projectNo) => `/api/projects/${projectNo}/assign`,
    FEEDBACK: (projectNo) => `/api/projects/${projectNo}/feedback`,
    KANBAN: (projectNo) => `/api/projects/${projectNo}/kanban`,
  },

  // 팀 API
  TEAM: {
    BASE: `/api/team`,
    MEMBERS: `/api/team/members`,
    MEMBER_DETAIL: (memberNo) => `/api/team/members/${memberNo}`,
    STATISTICS: `/api/team/statistics`,
  },

  // 건강 관리 API
  HEALTH: {
    BASE: `/api/health`,
    SURVEY: `/api/health/survey`,
    SURVEY_DETAIL: (healthSurveyNo) => `/api/health/survey/${healthSurveyNo}`,
    SURVEY_LIST: `/api/health/survey/list`,
    MENTAL: `/api/health/mental`,
    PHYSICAL: `/api/health/physical`,
    MONITORING: `/api/health/monitoring`,
    RISK_ANALYSIS: `/api/health/risk-analysis`,
    UNSCREENED: `/api/health/unscreened`,
  },

  // 워케이션 API
  WORKCATION: {
    BASE: `/api/workcation`,
    REQUEST: `/api/workcation/request`,
    APPROVE: (attendanceRequestNo) => `/api/workcation/${attendanceRequestNo}/approve`,
    REJECT: (attendanceRequestNo) => `/api/workcation/${attendanceRequestNo}/reject`,
    LIST: `/api/workcation/list`,
  },

  // 에이전시 API
  AGENCY: {
    BASE: `/api/agency`,
    JOIN_REQUEST: `/api/agency/join-request`,
    JOIN_REQUESTS: `/api/agency/join-requests`,
    APPROVE_JOIN: (joinRequestNo) => `/api/agency/join-requests/${joinRequestNo}/approve`,
    REJECT_JOIN: (joinRequestNo) => `/api/agency/join-requests/${joinRequestNo}/reject`,
    ASSIGNMENTS: `/api/agency/assignments`,
    APPROVALS: `/api/agency/approvals`,
  },

  // 담당자(관리자) API
  MANAGER: {
    BASE: `/api/manager`,
    DASHBOARD: `/api/manager/dashboard`,
    STATISTICS: `/api/manager/statistics`,
  },

  // 캘린더 API
  CALENDAR: {
    BASE: `/api/calendar`,
    EVENTS: `/api/calendar/events`,
    EVENT_DETAIL: (calendarEventNo) => `/api/calendar/events/${calendarEventNo}`,
    CREATE_EVENT: `/api/calendar/events`,
    UPDATE_EVENT: (calendarEventNo) => `/api/calendar/events/${calendarEventNo}`,
    DELETE_EVENT: (calendarEventNo) => `/api/calendar/events/${calendarEventNo}`,
    EVENTS_BY_DATE: (year, month, day) => `/api/calendar/events?year=${year}&month=${month}&day=${day}`,
    EVENTS_BY_MONTH: (year, month) => `/api/calendar/events?year=${year}&month=${month}`,
    MEMO: (date) => `/api/calendar/memo/${date}`,
    UPDATE_MEMO: (date) => `/api/calendar/memo/${date}`,
  },
};

export default {
  API_BASE_URL,
  API_TIMEOUT,
  API_ENDPOINTS,
};
