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
    DETAIL: (userId) => `/api/members/${userId}`,
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
    HISTORY: (userId, startDate, endDate) => 
      `/api/attendance/history?userId=${userId}&startDate=${startDate}&endDate=${endDate}`,
    MONTHLY: (userId, year, month) => 
      `/api/attendance/monthly?userId=${userId}&year=${year}&month=${month}`,
  },

  // 연차/휴가 API
  LEAVE: {
    BASE: `/api/leave`,
    REQUEST: `/api/leave/request`,
    APPROVE: (leaveId) => `/api/leave/${leaveId}/approve`,
    REJECT: (leaveId) => `/api/leave/${leaveId}/reject`,
    CANCEL: (leaveId) => `/api/leave/${leaveId}/cancel`,
    DETAIL: (leaveId) => `/api/leave/${leaveId}`,
    LIST: (userId, year) => `/api/leave/list?userId=${userId}&year=${year}`,
    BALANCE: (userId) => `/api/leave/balance/${userId}`,
    SETTINGS: `/api/leave/settings`,
    EMPLOYEE_SETTINGS: (employeeId) => `/api/leave/settings/employee/${employeeId}`,
    ADJUST: (employeeId) => `/api/leave/adjust/${employeeId}`,
    STATISTICS: `/api/leave/statistics`,
    ENCOURAGE_NOTIFICATION: `/api/leave/encourage-notification`,
  },

  // 프로젝트 API
  PROJECTS: {
    BASE: `/api/projects`,
    DETAIL: (projectId) => `/api/projects/${projectId}`,
    LIST: (page = 0, size = 10) => `/api/projects?page=${page}&size=${size}`,
    CREATE: `/api/projects`,
    UPDATE: (projectId) => `/api/projects/${projectId}`,
    DELETE: (projectId) => `/api/projects/${projectId}`,
    ASSIGN: (projectId) => `/api/projects/${projectId}/assign`,
    FEEDBACK: (projectId) => `/api/projects/${projectId}/feedback`,
    KANBAN: (projectId) => `/api/projects/${projectId}/kanban`,
  },

  // 팀 API
  TEAM: {
    BASE: `/api/team`,
    MEMBERS: `/api/team/members`,
    MEMBER_DETAIL: (memberId) => `/api/team/members/${memberId}`,
    STATISTICS: `/api/team/statistics`,
  },

  // 건강 관리 API
  HEALTH: {
    BASE: `/api/health`,
    SURVEY: `/api/health/survey`,
    SURVEY_DETAIL: (surveyId) => `/api/health/survey/${surveyId}`,
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
    APPROVE: (workcationId) => `/api/workcation/${workcationId}/approve`,
    REJECT: (workcationId) => `/api/workcation/${workcationId}/reject`,
    LIST: `/api/workcation/list`,
  },

  // 에이전시 API
  AGENCY: {
    BASE: `/api/agency`,
    JOIN_REQUEST: `/api/agency/join-request`,
    JOIN_REQUESTS: `/api/agency/join-requests`,
    APPROVE_JOIN: (requestId) => `/api/agency/join-requests/${requestId}/approve`,
    REJECT_JOIN: (requestId) => `/api/agency/join-requests/${requestId}/reject`,
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
    EVENT_DETAIL: (eventId) => `/api/calendar/events/${eventId}`,
    CREATE_EVENT: `/api/calendar/events`,
    UPDATE_EVENT: (eventId) => `/api/calendar/events/${eventId}`,
    DELETE_EVENT: (eventId) => `/api/calendar/events/${eventId}`,
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
