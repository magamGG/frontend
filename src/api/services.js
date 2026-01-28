import api from './axios';
import { API_ENDPOINTS } from './config';

// 인증 서비스
export const authService = {
  // 로그인
  login: (credentials) => {
    return api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },
};

// 회원 서비스
export const memberService = {
  // 회원가입
  register: (memberData) => {
    return api.post(API_ENDPOINTS.MEMBERS.BASE, memberData);
  },
  
  // 현재 로그인한 회원 정보 조회
  getCurrentMember: () => {
    return api.get(API_ENDPOINTS.MEMBERS.CURRENT);
  },
};

// 출석/근태 서비스
export const attendanceService = {
  // 출근 체크
  checkIn: (attendanceData) => {
    return api.post(API_ENDPOINTS.ATTENDANCE.CHECK_IN, attendanceData);
  },
  
  // 출석 이력 조회
  getHistory: (memberNo, startDate, endDate) => {
    return api.get(API_ENDPOINTS.ATTENDANCE.HISTORY(memberNo, startDate, endDate));
  },
};

// 연차/휴가 서비스
export const leaveService = {
  // 연차 신청
  requestLeave: (leaveRequestData) => {
    return api.post(API_ENDPOINTS.LEAVE.REQUEST, leaveRequestData);
  },
  
  // 연차 목록 조회
  getLeaveList: (memberNo, year) => {
    return api.get(API_ENDPOINTS.LEAVE.LIST(memberNo, year));
  },
  
  // 연차 잔액 조회
  getLeaveBalance: (memberNo) => {
    return api.get(API_ENDPOINTS.LEAVE.BALANCE(memberNo));
  },
};

// 프로젝트 서비스
export const projectService = {
  // 프로젝트 생성
  createProject: (projectData) => {
    return api.post(API_ENDPOINTS.PROJECTS.CREATE, projectData);
  },
  
  // 프로젝트 목록 조회
  getProjects: (page = 0, size = 10) => {
    return api.get(API_ENDPOINTS.PROJECTS.LIST(page, size));
  },
  
  // 칸반 보드 조회
  getKanbanBoard: (projectNo) => {
    return api.get(API_ENDPOINTS.PROJECTS.KANBAN(projectNo));
  },
};

// 캘린더 서비스
export const calendarService = {
  // 일정 생성
  createEvent: (eventData) => {
    return api.post(API_ENDPOINTS.CALENDAR.CREATE_EVENT, eventData);
  },
  
  // 월별 일정 조회
  getEventsByMonth: (year, month) => {
    return api.get(API_ENDPOINTS.CALENDAR.EVENTS_BY_MONTH(year, month));
  },
};

// 알림 서비스
export const notificationService = {
  // 알림 목록 조회
  getNotifications: () => {
    return api.get(API_ENDPOINTS.NOTIFICATION.LIST);
  },
};

// 건강 관리 서비스
export const healthService = {
  // 건강 설문 응답 제출
  createSurvey: (surveyData) => {
    return api.post(API_ENDPOINTS.HEALTH.SURVEY, surveyData);
  },
  
  // 일일 건강 체크 등록
  createDailyCheck: (dailyCheckData) => {
    return api.post(API_ENDPOINTS.HEALTH.DAILY_CHECK, dailyCheckData);
  },
};

// 에이전시 서비스
export const agencyService = {
  // 에이전시 가입 요청
  requestJoinAgency: (requestData) => {
    return api.post(API_ENDPOINTS.AGENCY.JOIN_REQUEST, requestData);
  },
  
  // 에이전시 가입 요청 목록 조회
  getJoinRequests: (agencyNo) => {
    return api.get(API_ENDPOINTS.AGENCY.JOIN_REQUESTS(agencyNo));
  },
};

export default {
  authService,
  memberService,
  attendanceService,
  leaveService,
  projectService,
  calendarService,
  notificationService,
  healthService,
  agencyService,
};
