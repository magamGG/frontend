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

  getWorkingArtistsByManager: (managerNo) => {
    return api.get(API_ENDPOINTS.MEMBERS.WORKING_ARTISTS(managerNo));
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

  getMyPageInfo: (memberNo) => {
    return api.get(API_ENDPOINTS.MEMBERS.MY_PAGE(memberNo));
  },

  updateProfile: (memberNo, memberData) => {
    return api.put(API_ENDPOINTS.MEMBERS.UPDATE_PROFILE(memberNo), memberData);
  },

  uploadProfileImage: (memberNo, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(API_ENDPOINTS.MEMBERS.UPLOAD_PROFILE_IMAGE(memberNo), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadBackgroundImage: (memberNo, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(API_ENDPOINTS.MEMBERS.UPLOAD_BACKGROUND_IMAGE(memberNo), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getEmployeeStatistics: (agencyNo) => {
    return api.get(API_ENDPOINTS.MEMBERS.EMPLOYEE_STATISTICS(agencyNo));
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
  
  // 근태 통계 조회
  getStatistics: (memberNo, year, month) => {
    return api.get(API_ENDPOINTS.ATTENDANCE.STATISTICS(memberNo, year, month));
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

  cancelAttendanceRequest: (attendanceRequestNo) => {
    return api.post(API_ENDPOINTS.LEAVE.CANCEL(attendanceRequestNo));
  },

  updateAttendanceRequest: (attendanceRequestNo, requestData) => {
    return api.put(API_ENDPOINTS.LEAVE.UPDATE(attendanceRequestNo), requestData);
  },

  getWeeklyAttendanceByManager: () => {
    return api.get(API_ENDPOINTS.LEAVE.MANAGER_WEEKLY);
  },

  // 근태 신청 첨부 파일 다운로드
  downloadFile: async (fileName) => {
    const response = await api.get(API_ENDPOINTS.LEAVE.DOWNLOAD_FILE(fileName), {
      responseType: 'blob', // Blob으로 응답 받기
    });
    return response;
  },
};

// 프로젝트 서비스
export const projectService = {
  // 썸네일 업로드 (파일 저장 후 파일명 반환)
  uploadThumbnail: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(API_ENDPOINTS.PROJECTS.UPLOAD_THUMBNAIL, formData);
  },

  // 프로젝트 생성
  createProject: (projectData) => {
    return api.post(API_ENDPOINTS.PROJECTS.CREATE, projectData);
  },

  // 프로젝트 단건 조회
  getProject: (projectNo) => {
    return api.get(API_ENDPOINTS.PROJECTS.DETAIL(projectNo));
  },

  // 프로젝트 수정
  updateProject: (projectNo, projectData) => {
    return api.put(API_ENDPOINTS.PROJECTS.UPDATE(projectNo), projectData);
  },

  // 프로젝트 삭제
  deleteProject: (projectNo) => {
    return api.delete(API_ENDPOINTS.PROJECTS.DELETE(projectNo));
  },

  // 프로젝트 멤버 목록 조회
  getProjectMembers: (projectNo) => {
    return api.get(API_ENDPOINTS.PROJECTS.MEMBERS(projectNo));
  },

  // 프로젝트에 팀원 추가 (DB PROJECT_MEMBER에 어시스트로 등록)
  addProjectMembers: (projectNo, memberNos) => {
    return api.post(API_ENDPOINTS.PROJECTS.MEMBERS(projectNo), { memberNos });
  },

  // 프로젝트에 추가 가능한 팀원 목록 (담당자/작가 제외, 프로젝트 미소속)
  getAddableMembers: (projectNo) => {
    return api.get(API_ENDPOINTS.PROJECTS.ADDABLE_MEMBERS(projectNo));
  },
  
  // 프로젝트 목록 조회
  getProjects: (page = 0, size = 10) => {
    return api.get(API_ENDPOINTS.PROJECTS.LIST(page, size));
  },
  
  // 칸반 보드 조회
  getKanbanBoard: (projectNo) => {
    return api.get(API_ENDPOINTS.PROJECTS.KANBAN(projectNo));
  },

  // 담당자 대시보드 담당 프로젝트 현황 (마감 기한 대비 진행률 → 정상/주의)
  getManagedProjects: () => {
    return api.get(API_ENDPOINTS.PROJECTS.MANAGED);
  },

  // 작가 대시보드 피드백 - 소속 프로젝트 칸반 카드에 달린 최신 코멘트 목록 (DB 연동)
  getMyProjectFeedback: (limit = 50) => {
    return api.get(API_ENDPOINTS.PROJECTS.FEEDBACK(limit));
  },

  // 칸반 보드 추가 (KANBAN_BOARD INSERT)
  createKanbanBoard: (projectNo, title) => {
    return api.post(API_ENDPOINTS.PROJECTS.KANBAN_BOARDS(projectNo), { title });
  },

  // 칸반 보드 상태 수정 (KANBAN_BOARD_STATUS N으로 숨김)
  updateKanbanBoardStatus: (projectNo, boardId, status) => {
    return api.put(API_ENDPOINTS.PROJECTS.KANBAN_BOARD_UPDATE(projectNo, boardId), { status });
  },

  // 칸반 카드 추가 (KANBAN_CARD INSERT)
  createKanbanCard: (projectNo, payload) => {
    return api.post(API_ENDPOINTS.PROJECTS.KANBAN_CARD(projectNo), payload);
  },

  // 칸반 카드 수정 (KANBAN_CARD UPDATE)
  updateKanbanCard: (projectNo, cardId, payload) => {
    return api.put(API_ENDPOINTS.PROJECTS.KANBAN_CARD_UPDATE(projectNo, cardId), payload);
  },

  // 칸반 카드 코멘트 목록 조회 (COMMENT - KANBAN_CARD_NO 기준)
  getComments: (projectNo, cardId) => {
    return api.get(API_ENDPOINTS.PROJECTS.KANBAN_CARD_COMMENTS(projectNo, cardId));
  },

  // 칸반 카드 코멘트 추가 (COMMENT INSERT)
  createComment: (projectNo, cardId, content) => {
    return api.post(API_ENDPOINTS.PROJECTS.KANBAN_CARD_COMMENTS(projectNo, cardId), { content });
  },

  // 칸반 카드 코멘트 수정 (COMMENT UPDATE) - { content } 또는 { status: 'block' } (블록)
  updateComment: (projectNo, cardId, commentId, payload) => {
    return api.put(API_ENDPOINTS.PROJECTS.KANBAN_CARD_COMMENT_UPDATE(projectNo, cardId, commentId), payload);
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
  
  // 다가오는 일정 조회 (작가 대시보드 "다음 연재 프로젝트"용)
  getUpcomingEvents: (limit = 10) => {
    return api.get(API_ENDPOINTS.CALENDAR.UPCOMING_EVENTS(limit));
  },

  // 담당자 대시보드 마감 임박 현황 (오늘~4일 후별 건수)
  getDeadlineCounts: () => {
    return api.get(API_ENDPOINTS.CALENDAR.DEADLINE_COUNTS);
  },

  // 에이전시 대시보드 마감 임박 현황 (오늘~4일 후별 건수)
  getDeadlineCountsByAgency: (agencyNo) => {
    return api.get(API_ENDPOINTS.CALENDAR.DEADLINE_COUNTS_BY_AGENCY(agencyNo));
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

  // 에이전시 대시보드 메트릭 (평균 마감 준수율, 활동 작가, 진행 프로젝트)
  getDashboardMetrics: (agencyNo) => {
    return api.get(API_ENDPOINTS.AGENCY.DASHBOARD_METRICS(agencyNo));
  },

  // 평균 마감 준수율 추이 (월별 + 전월 대비)
  getComplianceTrend: (agencyNo) => {
    return api.get(API_ENDPOINTS.AGENCY.COMPLIANCE_TREND(agencyNo));
  },

  // 작품별 아티스트 분포도
  getArtistDistribution: (agencyNo) => {
    return api.get(API_ENDPOINTS.AGENCY.ARTIST_DISTRIBUTION(agencyNo));
  },

  // 금일 출석 현황
  getAttendanceDistribution: (agencyNo) => {
    return api.get(API_ENDPOINTS.AGENCY.ATTENDANCE_DISTRIBUTION(agencyNo));
  },

  // 건강 인원 분포
  getHealthDistribution: (agencyNo) => {
    return api.get(API_ENDPOINTS.AGENCY.HEALTH_DISTRIBUTION(agencyNo));
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
