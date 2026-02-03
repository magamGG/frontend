// API 기본 설정
// 개발 환경에서는 프록시를 사용하므로 빈 문자열 (상대 경로)
// 프로덕션 환경에서는 전체 URL 사용
export const API_BASE_URL = import.meta.env.PROD 
  ? 'http://localhost:8888'  // 프로덕션 환경 URL (실제 배포 시 변경 필요)
  : '';  // 개발 환경에서는 프록시 사용 (상대 경로)
export const API_TIMEOUT = 10000;

/** DB THUMBNAIL_FILE을 이미지 URL로 변환 (업로드 경로: /uploads/) */
export function getProjectThumbnailUrl(thumbnailFile) {
  if (!thumbnailFile) return null;
  if (thumbnailFile.startsWith('http://') || thumbnailFile.startsWith('https://')) return thumbnailFile;
  const base = API_BASE_URL || 'http://localhost:8888';
  const path = thumbnailFile.startsWith('/uploads') ? thumbnailFile : `/uploads/${thumbnailFile.replace(/^\//, '')}`;
  return `${base}${path}`;
}

/** 회원 프로필 이미지 URL 변환 */
export function getMemberProfileUrl(profileImage) {
  if (!profileImage) return null;
  if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) return profileImage;
  const base = API_BASE_URL || 'http://localhost:8888';
  const path = profileImage.startsWith('/uploads') ? profileImage : `/uploads/${profileImage.replace(/^\//, '')}`;
  return `${base}${path}`;
}

/** 회원 프로필 없을 때 placeholder */
export const MEMBER_AVATAR_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"%3E%3Ccircle fill="%23e5e7eb" cx="24" cy="24" r="24"/%3E%3Cpath fill="%239ca3af" d="M24 24c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm0 4c-5.3 0-16 2.7-16 8v4h32v-4c0-5.3-10.7-8-16-8z"/%3E%3C/svg%3E';

/** 썸네일 없을 때 사용할 placeholder (회색 박스 SVG) */
export const PROJECT_THUMBNAIL_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="128" viewBox="0 0 96 128"%3E%3Crect fill="%23e5e7eb" width="96" height="128"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="12"%3E%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EC%97%86%EC%9D%8C%3C/text%3E%3C/svg%3E';

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
    BY_AGENCY: (agencyNo) => `/api/members/agency/${agencyNo}`,
    DETAILS: (memberNo) => `/api/members/${memberNo}/details`,
    MANAGERS: (agencyNo) => `/api/members/agency/${agencyNo}/managers`,
    ARTISTS: (agencyNo) => `/api/members/agency/${agencyNo}/artists`,
    ARTISTS_BY_MANAGER: (managerNo) => `/api/members/manager/${managerNo}/artists`,
    WORKING_ARTISTS: (managerNo) => `/api/members/manager/${managerNo}/working-artists`,
    ASSIGN: (artistNo, managerNo) => `/api/members/${artistNo}/assign/${managerNo}`,
    UNASSIGN: (artistNo) => `/api/members/${artistNo}/assign`,
    DELETE: (memberNo) => `/api/members/${memberNo}`,
    REMOVE_FROM_AGENCY: (memberNo) => `/api/members/${memberNo}/remove-from-agency`,
    MY_PAGE: (memberNo) => `/api/members/${memberNo}`,
    UPDATE_PROFILE: (memberNo) => `/api/members/${memberNo}`,
    UPLOAD_PROFILE_IMAGE: (memberNo) => `/api/members/${memberNo}/profile-image`,
    UPLOAD_BACKGROUND_IMAGE: (memberNo) => `/api/members/${memberNo}/background-image`,
    EMPLOYEE_STATISTICS: (agencyNo) => `/api/members/agency/${agencyNo}/statistics`,
  },

  // 출석/근태 API
  ATTENDANCE: {
    CHECK_IN: `/api/attendance/check-in`, // POST: 출근 체크
    START: `/api/attendance/start`, // POST: 출근 시작 (건강 체크 + 출근 기록)
    END: `/api/attendance/end`, // POST: 출근 종료 (퇴근 기록)
    TODAY_STATUS: `/api/attendance/today-status`, // GET: 오늘 출근 상태 조회
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
    MANAGER_WEEKLY: `/api/leave/manager/weekly`, // GET: 담당자 대시보드 금주 근태 예정
    CURRENT_STATUS: `/api/leave/current-status`, // GET: 현재 적용 중인 근태 상태 조회
    APPROVE: (attendanceRequestNo) => `/api/leave/${attendanceRequestNo}/approve`, // POST: 근태 신청 승인
    REJECT: (attendanceRequestNo) => `/api/leave/${attendanceRequestNo}/reject`, // POST: 근태 신청 반려
    CANCEL: (attendanceRequestNo) => `/api/leave/${attendanceRequestNo}/cancel`, // POST: 근태 신청 취소
    UPDATE: (attendanceRequestNo) => `/api/leave/${attendanceRequestNo}`, // PUT: 근태 신청 수정
    DOWNLOAD_FILE: (fileName) => `/api/leave/file/${fileName}`, // GET: 근태 신청 첨부 파일 다운로드
  },

  // 프로젝트 API
  PROJECTS: {
    CREATE: `/api/projects`, // POST: 프로젝트 생성
    UPLOAD_THUMBNAIL: `/api/projects/upload-thumbnail`, // POST: 썸네일 업로드 (파일 저장 후 파일명 반환)
    LIST: (page = 0, size = 10) => `/api/projects?page=${page}&size=${size}`, // GET: 프로젝트 목록 조회
    DETAIL: (projectNo) => `/api/projects/${projectNo}`, // GET: 프로젝트 단건 조회
    UPDATE: (projectNo) => `/api/projects/${projectNo}`, // PUT: 프로젝트 수정
    DELETE: (projectNo) => `/api/projects/${projectNo}`, // DELETE: 프로젝트 삭제
    MEMBERS: (projectNo) => `/api/projects/${projectNo}/members`, // GET: 프로젝트 멤버 목록, POST: 팀원 추가
    ADDABLE_MEMBERS: (projectNo) => `/api/projects/${projectNo}/addable-members`, // GET: 추가 가능 팀원 (담당자/작가 제외, 미소속)
    KANBAN: (projectNo) => `/api/projects/${projectNo}/kanban`, // GET: 칸반 보드 조회
    MANAGED: `/api/projects/managed`, // GET: 담당자 대시보드 담당 프로젝트 현황
    KANBAN_BOARDS: (projectNo) => `/api/projects/${projectNo}/kanban-board`, // POST: 칸반 보드 추가
    KANBAN_BOARD_UPDATE: (projectNo, boardId) => `/api/projects/${projectNo}/kanban-board/${boardId}`, // PUT: 칸반 보드 상태 수정
    KANBAN_CARD: (projectNo) => `/api/projects/${projectNo}/kanban-card`, // POST: 칸반 카드 추가
    KANBAN_CARD_UPDATE: (projectNo, cardId) => `/api/projects/${projectNo}/kanban-card/${cardId}`, // PUT: 칸반 카드 수정
    KANBAN_CARD_COMMENTS: (projectNo, cardId) => `/api/projects/${projectNo}/kanban-card/${cardId}/comments`, // GET: 목록, POST: 추가
    KANBAN_CARD_COMMENT_UPDATE: (projectNo, cardId, commentId) => `/api/projects/${projectNo}/kanban-card/${cardId}/comments/${commentId}`, // PUT: 코멘트 수정
  },

  // 캘린더 API
  CALENDAR: {
    CREATE_EVENT: `/api/calendar/events`, // POST: 일정 생성
    EVENTS_BY_MONTH: (year, month) => `/api/calendar/events?year=${year}&month=${month}`, // GET: 월별 일정 조회
    UPCOMING_EVENTS: (limit = 10) => `/api/calendar/events/upcoming?limit=${limit}`, // GET: 다가오는 일정 (작가 대시보드용)
    DEADLINE_COUNTS: `/api/calendar/deadline-counts`, // GET: 담당자 대시보드 마감 임박 현황
    DEADLINE_COUNTS_BY_AGENCY: (agencyNo) => `/api/calendar/deadline-counts/agency/${agencyNo}`, // GET: 에이전시 대시보드 마감 임박 현황
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
    DASHBOARD_METRICS: (agencyNo) => `/api/agency/${agencyNo}/dashboard-metrics`, // GET: 에이전시 대시보드 메트릭
    COMPLIANCE_TREND: (agencyNo) => `/api/agency/${agencyNo}/compliance-trend`, // GET: 평균 마감 준수율 추이
    ARTIST_DISTRIBUTION: (agencyNo) => `/api/agency/${agencyNo}/artist-distribution`, // GET: 작품별 아티스트 분포
    ATTENDANCE_DISTRIBUTION: (agencyNo) => `/api/agency/${agencyNo}/attendance-distribution`, // GET: 금일 출석 현황
    HEALTH_DISTRIBUTION: (agencyNo) => `/api/agency/${agencyNo}/health-distribution`, // GET: 건강 인원 분포
  },
};

export default {
  API_BASE_URL,
  API_TIMEOUT,
  API_ENDPOINTS,
};
