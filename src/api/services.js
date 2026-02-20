import api from './axios';
import { API_ENDPOINTS } from './config';
import chatPerformanceMonitor from '@/utils/chatPerformanceMonitor';

// 인증 서비스
export const authService = {
  // 로그인
  login: (credentials) => {
    return api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },
  
  // 비밀번호 찾기 (인증 코드 전송)
  forgotPassword: (email) => {
    return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },
  
  // 인증 코드 검증
  verifyCode: (email, code) => {
    return api.post(API_ENDPOINTS.AUTH.VERIFY_RESET_CODE, { email, code });
  },
  
  // 비밀번호 재설정
  resetPassword: (email, code, newPassword) => {
    return api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { email, code, newPassword });
  },
  
  // 토큰 갱신 (하위 호환성 - Request Body 방식)
  refresh: (refreshToken) => {
    return api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },
  
  // 토큰 재발급 (쿠키 기반 - 권장)
  reissue: () => {
    return api.post(API_ENDPOINTS.AUTH.REISSUE);
  },
  
  // 로그아웃 (쿠키 기반이므로 body 없이 요청)
  logout: () => {
    return api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
  
  // OAuth 인증 URL 조회 (범용)
  getOAuthAuthorizationUrl: async (provider) => {
    const response = await api.get(API_ENDPOINTS.AUTH.OAUTH_AUTHORIZATION_URL(provider));
    return response.authorizationUrl;
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

  /** 담당자 회원 번호(memberNo)로 배정된 작가만 조회 (ARTIST_ASSIGNMENT) */
  getArtistsByManagerMemberNo: (memberNo) => {
    return api.get(API_ENDPOINTS.MEMBERS.ARTISTS_BY_MANAGER_MEMBER(memberNo));
  },

  /** 로그인 회원의 배정 작가 목록 (MANAGER·ARTIST_ASSIGNMENT, 담당자만 해당) */
  getMyAssignedArtists: () => {
    return api.get(API_ENDPOINTS.MEMBERS.MY_ASSIGNED_ARTISTS);
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

  // 관리자 캘린더 조회
  getAdminCalendar: (agencyNo, year, month) => {
    return api.get(API_ENDPOINTS.ATTENDANCE.ADMIN_CALENDAR(agencyNo, year, month));
  },
};

// 메모 서비스 (개인 메모 - 아티스트 대시보드)
export const memoService = {
  getList: () => api.get(API_ENDPOINTS.MEMO.LIST),
  getCalendarList: () => api.get(API_ENDPOINTS.MEMO.CALENDAR),
  create: (data) => api.post(API_ENDPOINTS.MEMO.CREATE, {
    memoName: data.memoName || data.title || (data.memoType === '캘린더' ? '캘린더 메모' : '새 메모'),
    memoText: data.memoText ?? data.content ?? '',
    memoType: data.memoType || '개인',
    calendarMemoDate: data.calendarMemoDate || undefined,
  }),
  update: (memoNo, data) => api.put(API_ENDPOINTS.MEMO.UPDATE(memoNo), { memoName: data.memoName ?? data.title, memoText: data.memoText ?? data.content }),
  delete: (memoNo) => api.delete(API_ENDPOINTS.MEMO.DELETE(memoNo)),
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
    // memberNo를 숫자로 변환하여 전달 (문자열 전달로 인한 400 에러 방지)
    const numericMemberNo = Number(memberNo);
    if (isNaN(numericMemberNo)) {
      return Promise.reject(new Error('회원번호는 숫자여야 합니다.'));
    }
    return api.get(API_ENDPOINTS.LEAVE.BALANCE(numericMemberNo));
  },

  // 내 근태 신청 목록 조회
  getMyRequests: () => {
    return api.get(API_ENDPOINTS.LEAVE.MY_REQUESTS);
  },

  // 담당자 대시보드 신청 현황 - 담당 작가 근태 신청 목록 조회
  getManagerRequests: () => {
    return api.get(API_ENDPOINTS.LEAVE.MANAGER_REQUESTS);
  },

  // 에이전시 소속 근태 신청 목록 조회
  getAgencyRequests: (agencyNo) => {
    return api.get(API_ENDPOINTS.LEAVE.AGENCY_REQUESTS(agencyNo));
  },

  // 에이전시 소속 대기 중인 근태 신청 목록 조회
  getAgencyPendingRequests: (agencyNo) => {
    return api.get(API_ENDPOINTS.LEAVE.AGENCY_PENDING(agencyNo));
  },

  // 에이전시 소속 회원 연차 잔액 목록 조회 (연차 관리 페이지 직원 리스트용)
  getAgencyLeaveBalances: (agencyNo) => {
    return api.get(API_ENDPOINTS.LEAVE.AGENCY_BALANCES(agencyNo));
  },

  // 에이전시 소속 연차 변경 이력 조회 (변경 로그용)
  getLeaveHistoryByAgency: (agencyNo) => {
    return api.get(API_ENDPOINTS.LEAVE.AGENCY_HISTORY(agencyNo));
  },

  // 회원 연차 조정 (LeaveBalance 갱신 + LeaveHistory 생성)
  adjustLeaveBalance: (body) => {
    return api.post(API_ENDPOINTS.LEAVE.ADJUST_BALANCE, body);
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

  // 프로젝트에서 팀원 삭제 (PROJECT_MEMBER에서 삭제)
  deleteProjectMember: (projectNo, projectMemberNo) => {
    return api.delete(API_ENDPOINTS.PROJECTS.MEMBER_DELETE(projectNo, projectMemberNo));
  },

  // 프로젝트에 추가 가능한 팀원 목록 (담당자/작가 제외, 프로젝트 미소속)
  getAddableMembers: (projectNo) => {
    return api.get(API_ENDPOINTS.PROJECTS.ADDABLE_MEMBERS(projectNo));
  },

  // 담당자 배치 가능 담당자 목록 (프로젝트 작가들이 ARTIST_ASSIGNMENT로 연결된 담당자만)
  getAssignableManagers: (projectNo) => {
    return api.get(API_ENDPOINTS.PROJECTS.ASSIGNABLE_MANAGERS(projectNo));
  },

  // 담당자 배치 (PROJECT_MEMBER role 담당자 및 KANBAN_CARD 담당자 업데이트)
  assignManagerToProject: (projectNo, managerNo) => {
    return api.put(API_ENDPOINTS.PROJECTS.ASSIGN_MANAGER(projectNo), { managerNo });
  },

  // 프로젝트 목록 조회 (로그인 회원 소속 프로젝트)
  getProjects: (page = 0, size = 10) => {
    return api.get(API_ENDPOINTS.PROJECTS.LIST(page, size));
  },
  // 에이전시 소속 전체 프로젝트 조회 (에이전시 관리자만)
  getProjectsByAgency: (agencyNo) => {
    return api.get(API_ENDPOINTS.PROJECTS.LIST_BY_AGENCY(agencyNo));
  },

  // 칸반 보드 조회
  getKanbanBoard: (projectNo) => {
    return api.get(API_ENDPOINTS.PROJECTS.KANBAN(projectNo));
  },

  // 담당자 대시보드 담당 프로젝트 현황 (마감 기한 대비 진행률 → 정상/주의)
  getManagedProjects: () => {
    return api.get(API_ENDPOINTS.PROJECTS.MANAGED);
  },

  // 담당자 대시보드 마감 임박 현황 (주기 기준: 오늘~4일 후별 다음 연재일 건수)
  getDeadlineCounts: () => {
    return api.get(API_ENDPOINTS.PROJECTS.DEADLINE_COUNTS);
  },

  // 로그인 회원이 소속된 프로젝트 수 (PROJECT_MEMBER 기준)
  getMyProjectCount: () => {
    return api.get(API_ENDPOINTS.PROJECTS.MY_COUNT);
  },

  // 회원에게 배정된 칸반 카드(작업) 수 (워케이션 카드 등 "작업 N개" 표시용, 미완료 N만)
  getTaskCountByMember: (memberNo) => {
    return api.get(API_ENDPOINTS.PROJECTS.TASK_COUNT_BY_MEMBER(memberNo));
  },

  // 회원 완료 작업 수 (KANBAN_CARD_STATUS='Y', 워케이션 상단 "완료된 작업" 통계용)
  getCompletedTaskCountByMember: (memberNo) => {
    return api.get(API_ENDPOINTS.PROJECTS.COMPLETED_TASK_COUNT_BY_MEMBER(memberNo));
  },

  // 회원 작업 수 - STATUS가 'D'가 아닌 것만 (카드 "작업 N개" 표시용)
  getActiveTaskCountByMember: (memberNo) => {
    return api.get(API_ENDPOINTS.PROJECTS.ACTIVE_TASK_COUNT_BY_MEMBER(memberNo));
  },

  // 작가 대시보드 피드백 - 소속 프로젝트 칸반 카드에 달린 최신 코멘트 목록 (DB 연동)
  getMyProjectFeedback: (limit = 50) => {
    return api.get(API_ENDPOINTS.PROJECTS.FEEDBACK(limit));
  },

  // 아티스트 대시보드 오늘 할 일 - 담당 배정 + 마감일 오늘 + 미완료(N) 칸반 카드만
  getMyTodayTasks: () => {
    return api.get(API_ENDPOINTS.PROJECTS.TODAY_TASKS);
  },

  // 아티스트 캘린더: 담당자 배정 칸반 카드 월별 (KANBAN_CARD_STARTED_AT/ENDED_AT, PROJECT_COLOR)
  getMyCalendarCards: (year, month) => {
    return api.get(API_ENDPOINTS.PROJECTS.MY_CALENDAR_CARDS(year, month));
  },

  // 담당자/에이전시 캘린더: 소속 프로젝트 모든 칸반 카드 월별
  getMyProjectsCalendarCards: (year, month) => {
    return api.get(API_ENDPOINTS.PROJECTS.MY_PROJECTS_CALENDAR_CARDS(year, month));
  },

  // 마감임박 업무: KANBAN_CARD_ENDED_AT >= 오늘, 이전 날짜 제외
  getMyDeadlineCards: () => {
    return api.get(API_ENDPOINTS.PROJECTS.MY_DEADLINE_CARDS);
  },

  // 회원별 칸반 카드 통계 (진행중/완료 작업 개수) - 워케이션 등 원격 관리용
  getKanbanStatsForMember: (memberNo) => {
    return api.get(API_ENDPOINTS.PROJECTS.KANBAN_STATS(memberNo));
  },

  // 아티스트 대시보드 다음 연재 프로젝트 - PROJECT_MEMBER 소속 + PROJECT_STARTED_AT, PROJECT_CYCLE로 계산한 다음 연재일
  getNextSerialProjects: (limit = 10) => {
    return api.get(API_ENDPOINTS.PROJECTS.NEXT_SERIAL(limit));
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

  // Notion OAuth 설정 조회 (clientId, redirectUri)
  getNotionConfig: () => {
    return api.get(API_ENDPOINTS.PROJECTS.NOTION_CONFIG);
  },

  // Notion OAuth code → token 교환
  notionCallback: (projectNo, code) => {
    return api.post(API_ENDPOINTS.PROJECTS.NOTION_CALLBACK(projectNo), { code });
  },

  // Notion 연동 상태 조회
  getNotionStatus: (projectNo) => {
    return api.get(API_ENDPOINTS.PROJECTS.NOTION_STATUS(projectNo));
  },

  // Notion Database ID 저장
  setNotionDatabase: (projectNo, databaseId) => {
    return api.put(API_ENDPOINTS.PROJECTS.NOTION_DATABASE(projectNo), { databaseId });
  },

  // Notion 연동 해제
  disconnectNotion: (projectNo) => {
    return api.delete(API_ENDPOINTS.PROJECTS.NOTION_DISCONNECT(projectNo));
  },

  // Notion 수동 동기화
  syncNotion: (projectNo) => {
    return api.post(API_ENDPOINTS.PROJECTS.NOTION_SYNC(projectNo));
  },
};

// 캘린더 서비스
export const calendarService = {
  // 담당자 대시보드 마감 임박 현황 (오늘~4일 후별 건수)
  getDeadlineCounts: () => {
    return api.get(API_ENDPOINTS.CALENDAR.DEADLINE_COUNTS);
  },

  // 에이전시 대시보드 마감 임박 현황 (오늘~4일 후별 건수)
  getDeadlineCountsByAgency: (agencyNo) => {
    return api.get(API_ENDPOINTS.CALENDAR.DEADLINE_COUNTS_BY_AGENCY(agencyNo));
  },
};

// 공휴일 서비스
export const holidayService = {
  getHolidaysByYear: async (year) => {
    // axios interceptor가 이미 response.data를 반환하므로 그대로 사용
    const response = await api.get(API_ENDPOINTS.HOLIDAYS.GET_BY_YEAR(year));
    return response; // response.data가 아니라 response 자체 반환
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

  
  // 회원의 대기 중인 가입 요청 조회
  getMyPendingJoinRequest: () => {
    return api.get(API_ENDPOINTS.AGENCY.MY_JOIN_REQUEST);
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

  // 검진 모니터링 상세 목록 (정신/신체 타입별)
  getHealthMonitoringDetail: (agencyNo, type) => {
    return api.get(API_ENDPOINTS.AGENCY.HEALTH_MONITORING_DETAIL(agencyNo, type || 'mental'));
  },

  // 에이전시 건강 검진 일정 (HEALTH_SURVEY 생성일·주기 기반 다음 검진 예정일)
  getAgencyHealthSchedule: (agencyNo) => {
    return api.get(API_ENDPOINTS.AGENCY.HEALTH_SCHEDULE(agencyNo));
  },

  // 에이전시 건강 검진 설정 수정 (period, cycle)
  updateAgencyHealthSchedule: (agencyNo, body) => {
    return api.put(API_ENDPOINTS.AGENCY.HEALTH_SCHEDULE(agencyNo), body);
  },

  // 에이전시 미검진 인원 목록 (정신/신체 중 하나라도 미검진이면 포함)
  getAgencyUnscreenedList: (agencyNo) => {
    return api.get(API_ENDPOINTS.AGENCY.UNSCREENED_LIST(agencyNo));
  },

  // 미검진 인원 1명에게 검진 알림 발송
  sendUnscreenedNotification: (agencyNo, memberNo) => {
    return api.post(API_ENDPOINTS.AGENCY.UNSCREENED_NOTIFY(agencyNo, memberNo));
  },

  // 7일 이상 지연 미검진 인원에게 검진 알림 일괄 발송
  sendUnscreenedBulkNotification: (agencyNo) => {
    return api.post(API_ENDPOINTS.AGENCY.UNSCREENED_NOTIFY_BULK(agencyNo));
  },

  // 에이전시 마감 임박 현황 (담당자 관리 프로젝트 업무, 오늘~4일 후 5개 집계)
  getDeadlineCounts: (agencyNo) => {
    return api.get(API_ENDPOINTS.AGENCY.DEADLINE_COUNTS(agencyNo));
  },

  // 에이전시 상세 조회 (agencyLeave 등)
  getAgency: (agencyNo) => {
    return api.get(API_ENDPOINTS.AGENCY.GET(agencyNo));
  },

  // 에이전시 기본 연차(agency_leave) 수정
  updateAgencyLeave: (agencyNo, body) => {
    return api.put(API_ENDPOINTS.AGENCY.LEAVE(agencyNo), body);
  },
};

// 담당자(manager) 서비스 — X-Member-No로 담당자 식별, 배정 작가(ARTIST_ASSIGNMENT)만 대상
export const managerService = {
  getHealthDistribution: () => api.get(API_ENDPOINTS.MANAGER.HEALTH_DISTRIBUTION),
  getHealthSchedule: () => api.get(API_ENDPOINTS.MANAGER.HEALTH_SCHEDULE),
  getUnscreenedList: () => api.get(API_ENDPOINTS.MANAGER.UNSCREENED_LIST),
  getHealthMonitoringDetail: (type) => api.get(API_ENDPOINTS.MANAGER.HEALTH_MONITORING_DETAIL(type || 'mental')),
};

// 채팅 서비스 (최적화된 버전)
export const chatService = {
  // API 요청 캐시 (메모리 기반)
  _cache: new Map(),
  _requestCache: new Map(), // 진행 중인 요청 캐시
  
  // 캐시 키 생성
  _getCacheKey: (method, ...params) => `${method}_${params.join('_')}`,
  
  // 캐시된 데이터 확인 (TTL 적용)
  _getCachedData: (key, ttl = 30000) => { // 기본 30초 TTL
    const cached = chatService._cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < ttl) {
      return cached.data;
    }
    return null;
  },
  
  // 캐시에 데이터 저장
  _setCachedData: (key, data) => {
    chatService._cache.set(key, {
      data,
      timestamp: Date.now()
    });
  },
  
  // 중복 요청 방지 래퍼
  _withRequestDeduplication: async (key, apiCall) => {
    // 이미 같은 요청이 진행 중이면 기다림
    if (chatService._requestCache.has(key)) {
      return chatService._requestCache.get(key);
    }
    
    // 새 요청 시작
    const promise = apiCall().finally(() => {
      chatService._requestCache.delete(key);
    });
    
    chatService._requestCache.set(key, promise);
    return promise;
  },

  // 내 채팅방 목록 조회 (캐싱 적용)
  getChatRooms: (memberNo) => {
    const cacheKey = chatService._getCacheKey('getChatRooms', memberNo);
    const cached = chatService._getCachedData(cacheKey, 60000); // 1분 캐시
    
    if (cached) {
      return Promise.resolve(cached);
    }
    
    return chatService._withRequestDeduplication(cacheKey, () =>
      api.get(API_ENDPOINTS.CHAT.ROOMS(memberNo))
        .then(response => {
          chatService._setCachedData(cacheKey, response);
          return response;
        })
        .catch(error => {
          console.error('❌ [API] getChatRooms 실패:', error);
          throw error;
        })
    );
  },

  // 에이전시별 채팅방 목록 조회 (캐싱 비활성화 - 실시간 DB 조회)
  getChatRoomsByAgency: (agencyNo, type = 'all') => {
    const url = API_ENDPOINTS.CHAT.ROOMS_BY_AGENCY(agencyNo, type);
    const callId = chatPerformanceMonitor.startApiCall('getChatRoomsByAgency', { agencyNo, type });
    
    // 캐시 사용하지 않고 항상 DB에서 최신 데이터 조회
    return api.get(url)
      .then(response => {
        chatPerformanceMonitor.endApiCall(callId, true);
        
        // 응답 데이터 검증 및 정규화
        if (response.data && Array.isArray(response.data)) {
          // unreadCount가 없는 경우 0으로 초기화
          response.data = response.data.map(room => ({
            ...room,
            unreadCount: room.unreadCount || 0
          }));
        }
        
        return response;
      })
      .catch(error => {
        chatPerformanceMonitor.endApiCall(callId, false, error);
        console.error('❌ [API] getChatRoomsByAgency 실패:', error);
        // 에러 시 빈 배열 반환하여 UI 깨짐 방지
        return { data: [] };
      });
  },

  // 채팅방 입장 (멤버 등록) - 캐싱 불필요, 에러 처리 강화
  joinChatRoom: (chatRoomNo) => {
    if (!chatRoomNo) {
      return Promise.reject(new Error('채팅방 번호가 필요합니다.'));
    }
    
    return api.post(API_ENDPOINTS.CHAT.JOIN_ROOM(chatRoomNo))
      .catch(error => {
        console.error('❌ [API] joinChatRoom 실패:', error);
        // 이미 참여 중인 경우는 에러로 처리하지 않음
        if (error.response?.status === 409) {
          return { data: { message: '이미 참여 중인 채팅방입니다.' } };
        }
        throw error;
      });
  },

  // 특정 채팅방의 메시지 목록 조회 (캐싱 적용)
  getChatMessages: (chatRoomNo, page = 0, size = 20) => {
    if (!chatRoomNo) {
      return Promise.reject(new Error('채팅방 번호가 필요합니다.'));
    }
    
    const cacheKey = chatService._getCacheKey('getChatMessages', chatRoomNo, page, size);
    const cached = chatService._getCachedData(cacheKey, 10000); // 10초 캐시 (메시지는 자주 변경됨)
    
    if (cached) {
      return Promise.resolve(cached);
    }
    
    const callId = chatPerformanceMonitor.startApiCall('getChatMessages', { chatRoomNo, page, size });
    
    return chatService._withRequestDeduplication(cacheKey, () =>
      api.get(`${API_ENDPOINTS.CHAT.MESSAGES(chatRoomNo)}?page=${page}&size=${size}`)
        .then(response => {
          chatPerformanceMonitor.endApiCall(callId, true);
          
          // 메시지 데이터 정규화
          if (response.data) {
            let messages = Array.isArray(response.data) ? response.data : 
                          response.data.content ? response.data.content : [];
            
            // 메시지 데이터 검증 및 기본값 설정
            messages = messages.map(msg => ({
              ...msg,
              chatNo: msg.chatNo || `temp_${Date.now()}_${Math.random()}`,
              senderName: msg.senderName || '알 수 없음',
              chatMessage: msg.chatMessage || '',
              createdAt: msg.createdAt || msg.chatMessageCreatedAt || new Date().toISOString()
            }));
            
            if (Array.isArray(response.data)) {
              response.data = messages;
            } else if (response.data.content) {
              response.data.content = messages;
            }
          }
          
          chatService._setCachedData(cacheKey, response);
          return response;
        })
        .catch(error => {
          chatPerformanceMonitor.endApiCall(callId, false, error);
          console.error('❌ [API] getChatMessages 실패:', error);
          // 에러 시 빈 배열 반환
          return { data: [] };
        })
    );
  },

  // 마지막으로 읽은 메시지 업데이트 (캐시 무효화 적용)
  updateLastReadMessage: (chatRoomNo, lastChatNo) => {
    if (!chatRoomNo || !lastChatNo) {
      return Promise.reject(new Error('채팅방 번호와 메시지 번호가 필요합니다.'));
    }
    
    return api.put(`/api/chat/rooms/${chatRoomNo}/read?lastChatNo=${lastChatNo}`)
      .then(response => {
        // 관련 캐시 무효화
        const keysToInvalidate = [];
        for (const key of chatService._cache.keys()) {
          if (key.includes('getChatRoomsByAgency') || key.includes(`getChatMessages_${chatRoomNo}`)) {
            keysToInvalidate.push(key);
          }
        }
        keysToInvalidate.forEach(key => chatService._cache.delete(key));
        
        return response;
      })
      .catch(error => {
        console.error('❌ [API] updateLastReadMessage 실패:', error);
        throw error;
      });
  },

  // 특정 채팅방의 읽지 않은 메시지 개수 조회 (캐싱 적용)
  getUnreadCount: (chatRoomNo) => {
    if (!chatRoomNo) {
      return Promise.reject(new Error('채팅방 번호가 필요합니다.'));
    }
    
    const cacheKey = chatService._getCacheKey('getUnreadCount', chatRoomNo);
    const cached = chatService._getCachedData(cacheKey, 5000); // 5초 캐시
    
    if (cached) {
      return Promise.resolve(cached);
    }
    
    return chatService._withRequestDeduplication(cacheKey, () =>
      api.get(`/api/chat/rooms/${chatRoomNo}/unread-count`)
        .then(response => {
          chatService._setCachedData(cacheKey, response);
          return response;
        })
        .catch(error => {
          console.error('❌ [API] getUnreadCount 실패:', error);
          // 에러 시 0 반환
          return { data: 0 };
        })
    );
  },

  // 채팅방 참여자 목록 조회
  getChatRoomMembers: (chatRoomNo) => {
    if (!chatRoomNo) {
      return Promise.reject(new Error('채팅방 번호가 필요합니다.'));
    }
    
    return api.get(`/api/chat/rooms/${chatRoomNo}/members`)
      .then(response => {
        return response;
      })
      .catch(error => {
        console.error('❌ [API] getChatRoomMembers 실패:', error);
        return { data: [] };
      });
  },

  // 채팅방 자동 생성 및 참여자 초대
  ensureChatRooms: () => {
    return api.post('/api/chat/ensure-rooms')
      .then(response => {
        // 채팅방 목록 캐시 무효화
        chatService.invalidateCache('getChatRoomsByAgency');
        return response;
      })
      .catch(error => {
        console.error('❌ [API] ensureChatRooms 실패:', error);
        throw error;
      });
  },

  // 캐시 정리 함수
  clearCache: () => {
    chatService._cache.clear();
    chatService._requestCache.clear();
  },

  // 특정 패턴의 캐시만 무효화
  invalidateCache: (pattern) => {
    const keysToDelete = [];
    for (const key of chatService._cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => chatService._cache.delete(key));
  },

  // 관리자 기능: 누락된 채팅방 생성
  createMissingProjectChatRooms: () => {
    return api.post('/api/chat/admin/create-missing-project-rooms');
  },

  createMissingAgencyChatRooms: () => {
    return api.post('/api/chat/admin/create-missing-agency-rooms');
  },

  createAllMissingChatRooms: () => {
    return api.post('/api/chat/admin/create-all-missing-rooms');
  },

  // 사용자의 마지막 읽은 메시지 번호 조회
  getLastReadChatNo: (chatRoomNo) => {
    const cacheKey = chatService._getCacheKey('getLastReadChatNo', chatRoomNo);
    const cached = chatService._getCachedData(cacheKey, 5000); // 5초 캐시
    
    if (cached) {
      return Promise.resolve(cached);
    }
    
    return chatService._withRequestDeduplication(cacheKey, () =>
      api.get(`/api/chat/rooms/${chatRoomNo}/last-read`)
        .then(response => {
          chatService._setCachedData(cacheKey, response);
          return response;
        })
        .catch(error => {
          console.error('❌ [API] 마지막 읽은 메시지 조회 실패:', error);
          throw error;
        })
    );
  },

  // 채팅 파일 업로드
  uploadFile: (formData) => {
    const chatRoomNo = formData.get('chatRoomNo');
    const memberNo = formData.get('memberNo');
    
    // FormData에서 memberNo 제거 (헤더로 보낼 것이므로)
    formData.delete('memberNo');
    
    return api.post(`/api/chat/rooms/${chatRoomNo}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Member-No': memberNo,
      },
    })
    .then(response => {
      // 파일 업로드 성공 시 관련 캐시 무효화
      chatService.invalidateCache('getChatMessages');
      return response;
    })
    .catch(error => {
      console.error('❌ [API] 파일 업로드 실패:', error);
      throw error;
    });
  },
};

// AI 챗봇 서비스 (OpenAI 응답 대기를 위해 타임아웃 60초, tone: 말투 선택 시 쿼리로 전달)
const AI_TIMEOUT = 60000;
const aiConfig = (tone) => ({
  timeout: AI_TIMEOUT,
  ...(tone && tone !== 'standard' ? { params: { tone } } : {}),
});
export const aiService = {
  getArtistHealthFeedback: (tone) => api.get(API_ENDPOINTS.AI.ARTIST_HEALTH_FEEDBACK, aiConfig(tone)),
  getManagerHealthSummary: (tone) => api.get(API_ENDPOINTS.AI.MANAGER_HEALTH_SUMMARY, aiConfig(tone)),
  getAgencyHealthOverview: (tone) => api.get(API_ENDPOINTS.AI.AGENCY_HEALTH_OVERVIEW, aiConfig(tone)),
  getAgencyRiskSummary: (tone) => api.get(API_ENDPOINTS.AI.AGENCY_RISK_SUMMARY, aiConfig(tone)),
  getAgencyLeaveOverlapAlert: (tone) => api.get(API_ENDPOINTS.AI.AGENCY_LEAVE_OVERLAP_ALERT, aiConfig(tone)),
  getAgencyArtistAssignmentBalance: (tone) => api.get(API_ENDPOINTS.AI.AGENCY_ARTIST_ASSIGNMENT_BALANCE, aiConfig(tone)),
  getAgencyRejectedThenReappliedAlert: (tone) => api.get(API_ENDPOINTS.AI.AGENCY_REJECTED_THEN_REAPPLIED_ALERT, aiConfig(tone)),
  getArtistLeaveRecommendation: (tone) => api.get(API_ENDPOINTS.AI.ARTIST_LEAVE_RECOMMENDATION, aiConfig(tone)),
  getManagerLeaveRecommendation: (tone) => api.get(API_ENDPOINTS.AI.MANAGER_LEAVE_RECOMMENDATION, aiConfig(tone)),
  getArtistWorkloadSummary: (tone) => api.get(API_ENDPOINTS.AI.ARTIST_WORKLOAD_SUMMARY, aiConfig(tone)),
  getArtistProjectPriorityAdvice: (tone) => api.get(API_ENDPOINTS.AI.ARTIST_PROJECT_PRIORITY_ADVICE, aiConfig(tone)),
  getArtistWorkationRecommendation: (tone) => api.get(API_ENDPOINTS.AI.ARTIST_WORKATION_RECOMMENDATION, aiConfig(tone)),
  getManagerArtistWorkloadBalance: (tone) => api.get(API_ENDPOINTS.AI.MANAGER_ARTIST_WORKLOAD_BALANCE, aiConfig(tone)),
  getManagerMyHealthFeedback: (tone) => api.get(API_ENDPOINTS.AI.MANAGER_MY_HEALTH_FEEDBACK, aiConfig(tone)),
  getManagerWorkationRecommendation: (tone) => api.get(API_ENDPOINTS.AI.MANAGER_WORKATION_RECOMMENDATION, aiConfig(tone)),
  getManagerNudgeMessageRecommendation: (tone) => api.get(API_ENDPOINTS.AI.MANAGER_NUDGE_MESSAGE_RECOMMENDATION, aiConfig(tone)),
  getManagerArtistDailyHealthSummary: (tone) => api.get(API_ENDPOINTS.AI.MANAGER_ARTIST_DAILY_HEALTH_SUMMARY, aiConfig(tone)),
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
  managerService,
  chatService,
  holidayService,
  aiService,
};
