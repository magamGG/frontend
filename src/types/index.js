// Common Types for Webtoon Management System
// Type definitions are provided as JSDoc comments for JavaScript files

/**
 * @typedef {Object} User
 * @property {number} memberNo
 * @property {string} memberName
 * @property {'웹툰 작가' | '에이전시 관리자' | '담당자'} memberRole
 * @property {string} [memberProfileImage]
 * @property {string} memberEmail
 */

/**
 * @typedef {Object} Project
 * @property {number} projectNo - DB 필드: PROJECT_NO
 * @property {string} projectName - DB 필드: PROJECT_NAME
 * @property {string} projectColor - DB 필드: PROJECT_COLOR
 * @property {'연재' | '휴재' | '완결'} projectStatus - DB 필드: PROJECT_STATUS
 * @property {string} [projectGenre] - DB 필드: PROJECT_GENRE
 * @property {number} [projectCycle] - DB 필드: PROJECT_CYCLE
 * @property {string} [thumbnailFile] - DB 필드: THUMBNAIL_FILE
 * @property {string} [projectStartedAt] - DB 필드: PROJECT_STARTED_AT
 * @property {'naver' | 'kakao' | 'both'} [platform] - 계산 필드 (DB에 없음)
 * @property {string} [serializationDay] - 계산 필드 (DB에 없음)
 * @property {TeamMember[]} [teamMembers] - JOIN 결과
 * @property {string} [nextDeadline] - 계산 필드
 * @property {number} [episodeCount] - 계산 필드
 */

/**
 * @typedef {Object} TeamMember
 * @property {number} memberNo
 * @property {string} memberName
 * @property {'story' | 'line' | 'coloring' | 'background'} role
 * @property {string} [memberProfileImage]
 */

/**
 * @typedef {Object} Task
 * @property {number} kanbanCardNo - DB 필드: KANBAN_CARD_NO
 * @property {number} [boardNo] - DB 필드: BOARD_NO
 * @property {string} kanbanCardName - DB 필드: KANBAN_CARD_NAME
 * @property {'Y' | 'N'} [kanbanCardStatus] - DB 필드: KANBAN_CARD_STATUS (완료/미완료 체크)
 * @property {string} [kanbanCardCreatedAt] - DB 필드: KANBAN_CARD_CREATED_AT
 * @property {string} [kanbanCardUpdatedAt] - DB 필드: KANBAN_CARD_UPDATED_AT
 * @property {number} [projectMemberNo] - DB 필드: PROJECT_MEMBER_NO
 * @property {string} [kanbanCardStartedAt] - DB 필드: KANBAN_CARD_STARTED_AT
 * @property {string} [kanbanCardEndedAt] - DB 필드: KANBAN_CARD_ENDED_AT
 * @property {number} [projectNo] - JOIN 결과
 * @property {string} [projectName] - JOIN 결과
 * @property {number} [progress] - 계산 필드
 * @property {boolean} [completed] - 계산 필드
 * @property {'high' | 'medium' | 'low'} [priority] - 계산 필드
 */

/**
 * @typedef {Object} LeaveRequest
 * @property {number} attendanceRequestNo - DB 필드: ATTENDANCE_REQUEST_NO
 * @property {number} memberNo - DB 필드: MEMBER_NO
 * @property {string} [memberName] - JOIN 결과 (DB에 없음)
 * @property {number} [projectNo] - JOIN 결과 (DB에 없음)
 * @property {string} [projectName] - JOIN 결과 (DB에 없음)
 * @property {string} attendanceRequestStartDate - DB 필드: ATTENDANCE_REQUEST_START_DATE (DATETIME)
 * @property {string} attendanceRequestEndDate - DB 필드: ATTENDANCE_REQUEST_END_DATE (DATETIME)
 * @property {number} attendanceRequestUsingDays - DB 필드: ATTENDANCE_REQUEST_USING_DAYS
 * @property {'연차' | '병가' | '워케이션' | '재택' | '휴재' | '반차' | '반반차'} attendanceRequestType - DB 필드: ATTENDANCE_REQUEST_TYPE
 * @property {string} [attendanceRequestReason] - DB 필드: ATTENDANCE_REQUEST_REASON
 * @property {string} [workcationLocation] - DB 필드: WORKCATION_LOCATION (워케이션 신청 시에만)
 * @property {string} medicalFileUrl - DB 필드: MEDICAL_FILE_URL (NOT NULL, 빈 문자열 가능)
 * @property {'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'} attendanceRequestStatus - DB 필드: ATTENDANCE_REQUEST_STATUS
 * @property {string} [attendanceRequestRejectReason] - DB 필드: ATTENDANCE_REQUEST_REJECT_REASON (거절 사유)
 * @property {number} [affectedEpisodes] - 계산 필드 (DB에 없음)
 * @property {string} attendanceRequestCreatedAt - DB 필드: ATTENDANCE_REQUEST_CREATED_AT
 * @property {string} [attendanceRequestUpdatedAt] - DB 필드: ATTENDANCE_REQUEST_UPDATED_AT
 */

/**
 * @typedef {Object} HealthData
 * @property {number} healthCheckNo - DB 필드: HEALTH_CHECK_NO
 * @property {number} memberNo - DB 필드: MEMBER_NO
 * @property {string} [healthCondition] - DB 필드: HEALTH_CONDITION
 * @property {number} [sleepHours] - DB 필드: SLEEP_HOURS
 * @property {number} [discomfortLevel] - DB 필드: DISCOMFORT_LEVEL
 * @property {string} [healthCheckNotes] - DB 필드: HEALTH_CHECK_NOTES
 * @property {string} [healthCheckCreatedAt] - DB 필드: HEALTH_CHECK_CREATED_AT
 * @property {number} [motivation] - 계산 필드 (DB에 없음)
 */

/**
 * @typedef {Object} WorkSession
 * @property {number} attendanceNo - DB 필드: ATTENDANCE_NO
 * @property {number} memberNo - DB 필드: MEMBER_NO
 * @property {number} agencyNo - DB 필드: AGENCY_NO
 * @property {'출근' | '퇴근'} attendanceType - DB 필드: ATTENDANCE_TYPE
 * @property {string} attendanceTime - DB 필드: ATTENDANCE_TIME (DATETIME)
 * @property {string} [checkInTime] - 계산 필드 (attendanceType === '출근'일 때)
 * @property {string} [checkOutTime] - 계산 필드 (attendanceType === '퇴근'일 때)
 * @property {string} [workcationLocation] - JOIN 결과 (ATTENDANCE_REQUEST에서)
 * @property {number} [workHours] - 계산 필드 (DB에 없음)
 * @property {boolean} [isWorkcation] - 계산 필드 (DB에 없음)
 * @property {Object} [dailyReport] - 계산 필드 (DB에 없음)
 * @property {number} dailyReport.progress
 * @property {string[]} dailyReport.tasksCompleted
 * @property {string} dailyReport.planForTomorrow
 */

/**
 * @typedef {Object} CalendarEvent
 * @property {number} calendarEventNo - DB 필드: CALENDAR_EVENT_NO
 * @property {number} memberNo - DB 필드: MEMBER_NO
 * @property {string} [calendarEventName] - DB 필드: CALENDAR_EVENT_NAME
 * @property {string} [calendarEventContent] - DB 필드: CALENDAR_EVENT_CONTENT
 * @property {string} [calendarEventType] - DB 필드: CALENDAR_EVENT_TYPE
 * @property {string} calendarEventStartedAt - DB 필드: CALENDAR_EVENT_STARTED_AT (DATE)
 * @property {string} calendarEventEndedAt - DB 필드: CALENDAR_EVENT_ENDED_AT (DATE)
 * @property {string} calendarEventCreatedAt - DB 필드: CALENDAR_EVENT_CREATED_AT
 * @property {string} [calendarEventUpdatedAt] - DB 필드: CALENDAR_EVENT_UPDATED_AT
 * @property {string} [calendarEventColor] - DB 필드: CALENDAR_EVENT_COLOR
 * @property {number} [projectNo] - JOIN 결과 (DB에 없음)
 * @property {string} [projectName] - JOIN 결과 (DB에 없음)
 */

/**
 * @typedef {Object} WorkcationMember
 * @property {number} attendanceRequestNo
 * @property {number} memberNo
 * @property {string} memberName
 * @property {string} memberProfileImage
 * @property {'story' | 'line' | 'coloring' | 'background' | 'assist'} memberRole
 * @property {string} [customRole]
 * @property {string} workcationLocation
 * @property {string} attendanceRequestStartDate
 * @property {string} attendanceRequestEndDate
 * @property {number[]} projectNos
 * @property {string[]} projectNames
 * @property {Object[]} tasks
 * @property {number} tasks[].kanbanCardNo
 * @property {string} tasks[].kanbanCardName
 * @property {string} tasks[].projectName
 * @property {string} tasks[].kanbanCardEndedAt
 * @property {number} tasks[].progress
 * @property {'high' | 'medium' | 'low'} tasks[].priority
 * @property {Object} [dailyReport]
 * @property {string} dailyReport.lastUpdated
 * @property {number} dailyReport.progress
 * @property {string[]} dailyReport.tasksCompleted
 * @property {string} dailyReport.planForTomorrow
 * @property {string} [dailyReport.notes]
 * @property {Object} contact
 * @property {string} [contact.memberPhone]
 * @property {string} contact.memberEmail
 */
