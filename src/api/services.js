import api from './axios';
import { API_ENDPOINTS } from './config';

// 인증 서비스
export const authService = {
  // 로그인
  login: (credentials) => {
    return api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },
  
  // 로그아웃
  logout: () => {
    return api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
  
  // 토큰 갱신
  refreshToken: () => {
    return api.post(API_ENDPOINTS.AUTH.REFRESH);
  },
  
  // 비밀번호 찾기 (이메일 전송)
  forgotPassword: (email) => {
    return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },
  
  // 인증 코드 확인
  verifyCode: (email, code) => {
    return api.post(API_ENDPOINTS.AUTH.VERIFY_CODE, { email, code });
  },
  
  // 비밀번호 재설정
  resetPassword: (email, code, newPassword) => {
    return api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { email, code, newPassword });
  },
};

// 회원 서비스
export const memberService = {
  // 회원가입
  register: (memberData) => {
    return api.post(API_ENDPOINTS.MEMBERS.BASE, memberData);
  },
  
  // 회원 목록 조회
  getMembers: () => {
    return api.get(API_ENDPOINTS.MEMBERS.BASE);
  },
  
  // 회원 검색
  searchMembers: (keyword) => {
    return api.get(API_ENDPOINTS.MEMBERS.SEARCH(keyword));
  },
  
  // 회원 단건 조회
  getMember: (userId) => {
    return api.get(API_ENDPOINTS.MEMBERS.DETAIL(userId));
  },
  
  // 현재 로그인한 회원 정보 조회
  getCurrentMember: () => {
    return api.get(API_ENDPOINTS.MEMBERS.CURRENT);
  },
  
  // 회원 정보 수정
  updateMember: (userId, memberData) => {
    return api.put(API_ENDPOINTS.MEMBERS.DETAIL(userId), memberData);
  },
  
  // 현재 로그인한 회원 프로필 수정
  updateProfile: (memberData) => {
    return api.put(API_ENDPOINTS.MEMBERS.UPDATE_PROFILE, memberData);
  },
  
  // 회원 삭제
  deleteMember: (userId) => {
    return api.delete(API_ENDPOINTS.MEMBERS.DETAIL(userId));
  },
};

// 게시판 서비스
export const boardService = {
  // 게시글 작성
  createBoard: (formData) => {
    return api.post(API_ENDPOINTS.BOARD.BASE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 게시글 목록 조회 (페이징)
  getBoards: (page = 0, size = 10, sort = 'createDate,desc') => {
    return api.get(API_ENDPOINTS.BOARD.LIST(page, size, sort));
  },
  
  // 게시글 단건 조회
  getBoard: (boardId) => {
    return api.get(API_ENDPOINTS.BOARD.DETAIL(boardId));
  },
  
  // 게시글 수정
  updateBoard: (boardId, formData) => {
    return api.patch(API_ENDPOINTS.BOARD.DETAIL(boardId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 게시글 삭제
  deleteBoard: (boardId) => {
    return api.delete(API_ENDPOINTS.BOARD.DETAIL(boardId));
  },
};

// 출석/근태 서비스
export const attendanceService = {
  // 출근 체크
  checkIn: (attendanceData) => {
    return api.post(API_ENDPOINTS.ATTENDANCE.CHECK_IN, attendanceData);
  },
  
  // 퇴근 체크
  checkOut: () => {
    return api.post(API_ENDPOINTS.ATTENDANCE.CHECK_OUT);
  },
  
  // 현재 출석 상태 조회
  getStatus: () => {
    return api.get(API_ENDPOINTS.ATTENDANCE.STATUS);
  },
  
  // 출석 이력 조회
  getHistory: (userId, startDate, endDate) => {
    return api.get(API_ENDPOINTS.ATTENDANCE.HISTORY(userId, startDate, endDate));
  },
  
  // 월별 출석 조회
  getMonthlyAttendance: (userId, year, month) => {
    return api.get(API_ENDPOINTS.ATTENDANCE.MONTHLY(userId, year, month));
  },
};

// 연차/휴가 서비스
export const leaveService = {
  // 연차 신청
  requestLeave: (leaveRequestData) => {
    return api.post(API_ENDPOINTS.LEAVE.REQUEST, leaveRequestData);
  },
  
  // 연차 승인
  approveLeave: (leaveId) => {
    return api.post(API_ENDPOINTS.LEAVE.APPROVE(leaveId));
  },
  
  // 연차 거절
  rejectLeave: (leaveId, reason) => {
    return api.post(API_ENDPOINTS.LEAVE.REJECT(leaveId), { reason });
  },
  
  // 연차 취소
  cancelLeave: (leaveId) => {
    return api.post(API_ENDPOINTS.LEAVE.CANCEL(leaveId));
  },
  
  // 연차 상세 조회
  getLeaveDetail: (leaveId) => {
    return api.get(API_ENDPOINTS.LEAVE.DETAIL(leaveId));
  },
  
  // 연차 목록 조회
  getLeaveList: (userId, year) => {
    return api.get(API_ENDPOINTS.LEAVE.LIST(userId, year));
  },
  
  // 연차 잔액 조회
  getLeaveBalance: (userId) => {
    return api.get(API_ENDPOINTS.LEAVE.BALANCE(userId));
  },
  
  // 연차 설정 조회/수정
  getLeaveSettings: () => {
    return api.get(API_ENDPOINTS.LEAVE.SETTINGS);
  },
  
  updateLeaveSettings: (settingsData) => {
    return api.put(API_ENDPOINTS.LEAVE.SETTINGS, settingsData);
  },
  
  // 직원별 연차 설정 조회/수정
  getEmployeeLeaveSettings: (employeeId) => {
    return api.get(API_ENDPOINTS.LEAVE.EMPLOYEE_SETTINGS(employeeId));
  },
  
  updateEmployeeLeaveSettings: (employeeId, settingsData) => {
    return api.put(API_ENDPOINTS.LEAVE.EMPLOYEE_SETTINGS(employeeId), settingsData);
  },
  
  // 연차 조정
  adjustLeave: (employeeId, adjustmentData) => {
    return api.post(API_ENDPOINTS.LEAVE.ADJUST(employeeId), adjustmentData);
  },
  
  // 연차 통계 조회
  getLeaveStatistics: () => {
    return api.get(API_ENDPOINTS.LEAVE.STATISTICS);
  },
  
  // 휴가 독려 알림 전송
  sendEncouragementNotification: (employeeIds) => {
    return api.post(API_ENDPOINTS.LEAVE.ENCOURAGE_NOTIFICATION, { employeeIds });
  },
};

// 프로젝트 서비스
export const projectService = {
  // 프로젝트 목록 조회
  getProjects: (page = 0, size = 10) => {
    return api.get(API_ENDPOINTS.PROJECTS.LIST(page, size));
  },
  
  // 프로젝트 상세 조회
  getProjectDetail: (projectId) => {
    return api.get(API_ENDPOINTS.PROJECTS.DETAIL(projectId));
  },
  
  // 프로젝트 생성
  createProject: (projectData) => {
    return api.post(API_ENDPOINTS.PROJECTS.CREATE, projectData);
  },
  
  // 프로젝트 수정
  updateProject: (projectId, projectData) => {
    return api.put(API_ENDPOINTS.PROJECTS.UPDATE(projectId), projectData);
  },
  
  // 프로젝트 삭제
  deleteProject: (projectId) => {
    return api.delete(API_ENDPOINTS.PROJECTS.DELETE(projectId));
  },
  
  // 프로젝트 할당
  assignProject: (projectId, assignmentData) => {
    return api.post(API_ENDPOINTS.PROJECTS.ASSIGN(projectId), assignmentData);
  },
  
  // 프로젝트 피드백 작성
  createFeedback: (projectId, feedbackData) => {
    return api.post(API_ENDPOINTS.PROJECTS.FEEDBACK(projectId), feedbackData);
  },
  
  // 칸반 보드 조회/수정
  getKanbanBoard: (projectId) => {
    return api.get(API_ENDPOINTS.PROJECTS.KANBAN(projectId));
  },
  
  updateKanbanBoard: (projectId, kanbanData) => {
    return api.put(API_ENDPOINTS.PROJECTS.KANBAN(projectId), kanbanData);
  },
};

// 팀 서비스
export const teamService = {
  // 팀 멤버 목록 조회
  getTeamMembers: () => {
    return api.get(API_ENDPOINTS.TEAM.MEMBERS);
  },
  
  // 팀 멤버 상세 조회
  getTeamMemberDetail: (memberId) => {
    return api.get(API_ENDPOINTS.TEAM.MEMBER_DETAIL(memberId));
  },
  
  // 팀 통계 조회
  getTeamStatistics: () => {
    return api.get(API_ENDPOINTS.TEAM.STATISTICS);
  },
};

// 건강 관리 서비스
export const healthService = {
  // 건강 설문 작성
  createSurvey: (surveyData) => {
    return api.post(API_ENDPOINTS.HEALTH.SURVEY, surveyData);
  },
  
  // 건강 설문 상세 조회
  getSurveyDetail: (surveyId) => {
    return api.get(API_ENDPOINTS.HEALTH.SURVEY_DETAIL(surveyId));
  },
  
  // 건강 설문 목록 조회
  getSurveyList: () => {
    return api.get(API_ENDPOINTS.HEALTH.SURVEY_LIST);
  },
  
  // 정신 건강 조회
  getMentalHealth: () => {
    return api.get(API_ENDPOINTS.HEALTH.MENTAL);
  },
  
  // 신체 건강 조회
  getPhysicalHealth: () => {
    return api.get(API_ENDPOINTS.HEALTH.PHYSICAL);
  },
  
  // 모니터링 조회
  getMonitoring: () => {
    return api.get(API_ENDPOINTS.HEALTH.MONITORING);
  },
  
  // 위험 분석 조회
  getRiskAnalysis: () => {
    return api.get(API_ENDPOINTS.HEALTH.RISK_ANALYSIS);
  },
  
  // 미검진자 조회
  getUnscreened: () => {
    return api.get(API_ENDPOINTS.HEALTH.UNSCREENED);
  },
};

// 워케이션 서비스
export const workcationService = {
  // 워케이션 신청
  requestWorkcation: (workcationData) => {
    return api.post(API_ENDPOINTS.WORKCATION.REQUEST, workcationData);
  },
  
  // 워케이션 승인
  approveWorkcation: (workcationId) => {
    return api.post(API_ENDPOINTS.WORKCATION.APPROVE(workcationId));
  },
  
  // 워케이션 거절
  rejectWorkcation: (workcationId, reason) => {
    return api.post(API_ENDPOINTS.WORKCATION.REJECT(workcationId), { reason });
  },
  
  // 워케이션 목록 조회
  getWorkcationList: () => {
    return api.get(API_ENDPOINTS.WORKCATION.LIST);
  },
};

// 에이전시 서비스
export const agencyService = {
  // 에이전시 가입 요청
  requestJoinAgency: (requestData) => {
    return api.post(API_ENDPOINTS.AGENCY.JOIN_REQUEST, requestData);
  },
  
  // 에이전시 가입 요청 목록 조회
  getJoinRequests: () => {
    return api.get(API_ENDPOINTS.AGENCY.JOIN_REQUESTS);
  },
  
  // 에이전시 가입 승인
  approveJoinRequest: (requestId) => {
    return api.post(API_ENDPOINTS.AGENCY.APPROVE_JOIN(requestId));
  },
  
  // 에이전시 가입 거절
  rejectJoinRequest: (requestId, reason) => {
    return api.post(API_ENDPOINTS.AGENCY.REJECT_JOIN(requestId), { reason });
  },
  
  // 할당 관리 조회
  getAssignments: () => {
    return api.get(API_ENDPOINTS.AGENCY.ASSIGNMENTS);
  },
  
  // 승인 관리 조회
  getApprovals: () => {
    return api.get(API_ENDPOINTS.AGENCY.APPROVALS);
  },
};

// 담당자(관리자) 서비스
export const managerService = {
  // 담당자 대시보드 조회
  getDashboard: () => {
    return api.get(API_ENDPOINTS.MANAGER.DASHBOARD);
  },
  
  // 담당자 통계 조회
  getStatistics: () => {
    return api.get(API_ENDPOINTS.MANAGER.STATISTICS);
  },
};

// 캘린더 서비스
export const calendarService = {
  // 일정 목록 조회
  getEvents: (year, month) => {
    if (year && month) {
      return api.get(API_ENDPOINTS.CALENDAR.EVENTS_BY_MONTH(year, month));
    }
    return api.get(API_ENDPOINTS.CALENDAR.EVENTS);
  },
  
  // 특정 날짜의 일정 조회
  getEventsByDate: (year, month, day) => {
    return api.get(API_ENDPOINTS.CALENDAR.EVENTS_BY_DATE(year, month, day));
  },
  
  // 일정 상세 조회
  getEventDetail: (eventId) => {
    return api.get(API_ENDPOINTS.CALENDAR.EVENT_DETAIL(eventId));
  },
  
  // 일정 생성
  createEvent: (eventData) => {
    return api.post(API_ENDPOINTS.CALENDAR.CREATE_EVENT, eventData);
  },
  
  // 일정 수정
  updateEvent: (eventId, eventData) => {
    return api.put(API_ENDPOINTS.CALENDAR.UPDATE_EVENT(eventId), eventData);
  },
  
  // 일정 삭제
  deleteEvent: (eventId) => {
    return api.delete(API_ENDPOINTS.CALENDAR.DELETE_EVENT(eventId));
  },
  
  // 메모 조회
  getMemo: (date) => {
    return api.get(API_ENDPOINTS.CALENDAR.MEMO(date));
  },
  
  // 메모 저장/수정
  updateMemo: (date, memoData) => {
    return api.put(API_ENDPOINTS.CALENDAR.UPDATE_MEMO(date), memoData);
  },
};

export default {
  authService,
  memberService,
  boardService,
  attendanceService,
  leaveService,
  projectService,
  teamService,
  healthService,
  workcationService,
  agencyService,
  managerService,
  calendarService,
};
