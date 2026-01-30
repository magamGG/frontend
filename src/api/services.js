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

  getMembersByAgency: (agencyNo) => {
    return api.get(API_ENDPOINTS.MEMBERS.BY_AGENCY(agencyNo));
  },

  getMemberDetails: (memberNo) => {
    return api.get(API_ENDPOINTS.MEMBERS.DETAILS(memberNo));
  },

  getManagersByAgency: (agencyNo) => {
    return api.get(API_ENDPOINTS.MEMBERS.MANAGERS(agencyNo));
  },

  getArtistsByAgency: (agencyNo) => {
    return api.get(API_ENDPOINTS.MEMBERS.ARTISTS(agencyNo));
  },

  getArtistsByManager: (managerNo) => {
    return api.get(API_ENDPOINTS.MEMBERS.ARTISTS_BY_MANAGER(managerNo));
  },

  assignArtistToManager: (artistNo, managerNo) => {
    return api.post(API_ENDPOINTS.MEMBERS.ASSIGN(artistNo, managerNo));
  },

  unassignArtistFromManager: (artistNo) => {
    return api.delete(API_ENDPOINTS.MEMBERS.UNASSIGN(artistNo));
  },

  deleteMember: (memberNo) => {
    return api.delete(API_ENDPOINTS.MEMBERS.DELETE(memberNo));
  },

  removeFromAgency: (memberNo) => {
    return api.put(API_ENDPOINTS.MEMBERS.REMOVE_FROM_AGENCY(memberNo));
  },
};

// 출석/근태 서비스
export const attendanceService = {
  // 출근 체크
  checkIn: (attendanceData) => {
    return api.post(API_ENDPOINTS.ATTENDANCE.CHECK_IN, attendanceData);
  },

  startAttendance: (healthCheckData) => {
    return api.post(API_ENDPOINTS.ATTENDANCE.START, healthCheckData);
  },

  endAttendance: () => {
    return api.post(API_ENDPOINTS.ATTENDANCE.END);
  },

  getTodayStatus: () => {
    return api.get(API_ENDPOINTS.ATTENDANCE.TODAY_STATUS);
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
  
  // 내 근태 신청 목록 조회
  getMyRequests: () => {
    return api.get(API_ENDPOINTS.LEAVE.MY_REQUESTS);
  },
  
  // 에이전시 소속 근태 신청 목록 조회
  getAgencyRequests: (agencyNo) => {
    return api.get(API_ENDPOINTS.LEAVE.AGENCY_REQUESTS(agencyNo));
  },
  
  // 에이전시 소속 대기 중인 근태 신청 목록 조회
  getAgencyPendingRequests: (agencyNo) => {
    return api.get(API_ENDPOINTS.LEAVE.AGENCY_PENDING(agencyNo));
  },

  getCurrentStatus: () => {
    return api.get(API_ENDPOINTS.LEAVE.CURRENT_STATUS);
  },

  approveAttendanceRequest: (attendanceRequestNo) => {
    return api.post(API_ENDPOINTS.LEAVE.APPROVE(attendanceRequestNo));
  },

  rejectAttendanceRequest: (attendanceRequestNo, rejectReason) => {
    return api.post(API_ENDPOINTS.LEAVE.REJECT(attendanceRequestNo), { rejectReason });
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
  
  // 알림 읽음 처리
  markAsRead: (notificationNo) => {
    return api.put(API_ENDPOINTS.NOTIFICATION.READ(notificationNo));
  },
  
  // 모든 알림 읽음 처리
  markAllAsRead: () => {
    return api.put(API_ENDPOINTS.NOTIFICATION.READ_ALL);
  },
  
  // 알림 삭제
  deleteNotification: (notificationNo) => {
    return api.delete(API_ENDPOINTS.NOTIFICATION.DELETE(notificationNo));
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
  
  // 에이전시 가입 요청 승인
  approveJoinRequest: (newRequestNo) => {
    return api.post(API_ENDPOINTS.AGENCY.APPROVE_JOIN_REQUEST(newRequestNo));
  },
  
  // 에이전시 가입 요청 거절
  rejectJoinRequest: (newRequestNo, rejectionReason) => {
    return api.post(API_ENDPOINTS.AGENCY.REJECT_JOIN_REQUEST(newRequestNo), { rejectionReason });
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
