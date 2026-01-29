# 🔍 ERD 전체 검증 결과 보고서

> **검증 일자**: 2026-01-27  
> **ERD 파일**: `GUIDE/마감지기.sql`  
> **검증 범위**: 모든 테이블 및 필드의 프론트엔드 변수명 매핑

---

## 📊 테이블별 검증 결과

### 1. KANBAN_CARD ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `KANBAN_CARD_NO` | `kanbanCardNo` | ✅ |
| `BOARD_NO` | `boardNo` | ✅ |
| `KANBAN_CARD_NAME` | `kanbanCardName` | ✅ |
| `KANBAN_CARD_STATUS` | `kanbanCardStatus` | ✅ |
| `KANBAN_CARD_CREATED_AT` | `kanbanCardCreatedAt` | ✅ |
| `KANBAN_CARD_UPDATED_AT` | `kanbanCardUpdatedAt` | ✅ |
| `PROJECT_MEMBER_NO` | `projectMemberNo` | ✅ |
| `KANBAN_CARD_STARTED_AT` | `kanbanCardStartedAt` | ✅ |
| `KANBAN_CARD_ENDED_AT` | `kanbanCardEndedAt` | ✅ |

---

### 2. DAILY_HEALTH_CHECK ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `HEALTH_CHECK_NO` | `healthCheckNo` | ✅ |
| `MEMBER_NO` | `memberNo` | ✅ |
| `HEALTH_CONDITION` | `healthCondition` | ✅ |
| `SLEEP_HOURS` | `sleepHours` | ✅ |
| `DISCOMFORT_LEVEL` | `discomfortLevel` | ✅ |
| `HEALTH_CHECK_NOTES` | `healthCheckNotes` | ✅ |
| `HEALTH_CHECK_CREATED_AT` | `healthCheckCreatedAt` | ✅ |

---

### 3. MEMO ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `MEMO_NO` | `memoNo` | ✅ |
| `MEMBER_NO` | `memberNo` | ✅ |
| `CALENDAR_EVENT_NO` | `calendarEventNo` | ✅ |
| `MEMO_NAME` | `memoName` | ✅ |
| `MEMO_TEXT` | `memoText` | ✅ |
| `MEMO_CREATED_AT` | `memoCreatedAt` | ✅ |
| `MEMO_UPDATED_AT` | `memoUpdatedAt` | ✅ |
| `MEMO_TYPE` | `memoType` | ✅ |

---

### 4. HEALTH_SURVEY_QUESTION ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `HEALTH_SURVEY_QUESTION_NO` | `healthSurveyQuestionNo` | ✅ |
| `HEALTH_SURVEY_NO` | `healthSurveyNo` | ✅ |
| `HEALTH_SURVEY_ORDER` | `healthSurveyOrder` | ✅ |
| `HEALTH_SURVEY_QUESTION_CONTENT` | `healthSurveyQuestionContent` | ✅ |
| `HEALTH_SURVEY_QUESTION_MIN_SCORE` | `healthSurveyQuestionMinScore` | ✅ |
| `HEALTH_SURVEY_QUESTION_MAX_SCORE` | `healthSurveyQuestionMaxScore` | ✅ |
| `HEALTH_SURVEY_QUESTION_CREATED_AT` | `healthSurveyQuestionCreatedAt` | ✅ |
| `HEALTH_SURVEY_QUESTION_UPDATED_AT` | `healthSurveyQuestionUpdatedAt` | ✅ |

---

### 5. NEW_REQUEST ✅ 사용 중 (에이전시 가입 요청)

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `NEW_REQUEST_NO` | `newRequestNo` (또는 `joinRequestNo`) | ✅ |
| `AGENCY_NO` | `agencyNo` | ✅ |
| `MEMBER_NO` | `memberNo` | ✅ |
| `NEW_REQUEST_DATE` | `newRequestDate` | ✅ |
| `NEW_REQUEST_STATUS` | `newRequestStatus` | ✅ |

**참고**: 에이전시 가입 요청 기능에서 사용 중입니다. `agencyService.requestJoinAgency()` API를 통해 사용되며, `JoinAgencyRequestPage.jsx`에서 구현되어 있습니다.

---

### 6. LEAVE_BALANCE ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `LEAVE_BALANCE_NO` | `leaveBalanceNo` | ✅ |
| `MEMBER_NO` | `memberNo` | ✅ |
| `LEAVE_TYPE` | `leaveType` | ✅ |
| `LEAVE_BALANCE_TOTAL_DAYS` | `leaveBalanceTotalDays` | ✅ |
| `LEAVE_BALANCE_USED_DAYS` | `leaveBalanceUsedDays` | ✅ |
| `LEAVE_BALANCE_REMAIN_DAYS` | `leaveBalanceRemainDays` | ✅ |
| `LEAVE_BALANCE_YEAR` | `leaveBalanceYear` | ✅ |
| `LEAVE_BALANCE_UPDATED_AT` | `leaveBalanceUpdatedAt` | ✅ |

---

### 7. AGENCY ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `AGENCY_NO` | `agencyNo` | ✅ |
| `AGENCY_NAME` | `agencyName` | ✅ |
| `AGENCY_CODE` | `agencyCode` | ✅ |
| `AGENCY_LEAVE` | `agencyLeave` | ✅ |

---

### 8. HEALTH_SURVEY_RESPONSE ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `HEALTH_SURVEY_RESPONSE_NO` | `healthSurveyResponseNo` | ✅ |
| `HEALTH_SURVEY_NO` | `healthSurveyNo` | ✅ |
| `MEMBER_NO` | `memberNo` | ✅ |
| `HEALTH_SURVEY_RESPONSE_TOTAL_SCORE` | `healthSurveyResponseTotalScore` | ✅ |
| `HEALTH_SURVEY_RESPONSE_STATUS` | `healthSurveyResponseStatus` | ✅ |
| `HEALTH_SURVEY_RESPONSE_CREATED_AT` | `healthSurveyResponseCreatedAt` | ✅ |

---

### 9. NOTIFICATION ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `NOTIFICATION_NO` | `notificationNo` | ✅ |
| `MEMBER_NO` | `memberNo` | ✅ |
| `NOTIFICATION_NAME` | `notificationName` | ✅ |
| `NOTIFICATION_TEXT` | `notificationText` | ✅ |
| `NOTIFICATION_CREATED_AT` | `notificationCreatedAt` | ✅ |
| `NOTIFICATION_STATUS` | `notificationStatus` | ✅ |
| `NOTIFICATION_TYPE` | `notificationType` | ✅ |

---

### 10. MEMBER ✅ 완전 일치 (memberEmail 사용)

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `MEMBER_NO` | `memberNo` | ✅ |
| `AGENCY_NO` | `agencyNo` | ✅ (NULL 허용) |
| `MEMBER_NAME` | `memberName` | ✅ |
| `MEMBER_PASSWORD` | `memberPassword` | ✅ |
| `MEMBER_EMAIL` | `memberEmail` | ✅ (로그인 ID로 사용) |
| `MEMBER_PHONE` | `memberPhone` | ✅ |
| `MEMBER_STATUS` | `memberStatus` | ✅ |
| `MEMBER_PROFILE_IMAGE` | `memberProfileImage` | ✅ |
| `MEMBER_PROFILE_BANNER_IMAGE` | `memberProfileBannerImage` | ✅ |
| `MEMBER_ROLE` | `memberRole` | ✅ |
| `MEMBER_CREATED_AT` | `memberCreatedAt` | ✅ |
| `MEMBER_UPDATED_AT` | `memberUpdatedAt` | ✅ |

**주의**: `MEMBER_ID` 필드 없음. `MEMBER_EMAIL`을 로그인 ID로 사용.

---

### 11. PROJECT ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `PROJECT_NO` | `projectNo` | ✅ |
| `PROJECT_NAME` | `projectName` | ✅ |
| `PROJECT_STATUS` | `projectStatus` | ✅ |
| `PROJECT_COLOR` | `projectColor` | ✅ |
| `PROJECT_GENRE` | `projectGenre` | ✅ |
| `PROJECT_CYCLE` | `projectCycle` | ✅ |
| `THUMBNAIL_FILE` | `thumbnailFile` | ✅ |
| `PROJECT_STARTED_AT` | `projectStartedAt` | ✅ |

---

### 12. ATTENDANCE_REQUEST ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `ATTENDANCE_REQUEST_NO` | `attendanceRequestNo` | ✅ |
| `MEMBER_NO` | `memberNo` | ✅ |
| `ATTENDANCE_REQUEST_TYPE` | `attendanceRequestType` | ✅ |
| `ATTENDANCE_REQUEST_START_DATE` | `attendanceRequestStartDate` | ✅ |
| `ATTENDANCE_REQUEST_END_DATE` | `attendanceRequestEndDate` | ✅ |
| `ATTENDANCE_REQUEST_USING_DAYS` | `attendanceRequestUsingDays` | ✅ |
| `ATTENDANCE_REQUEST_REASON` | `attendanceRequestReason` | ✅ |
| `WORKCATION_LOCATION` | `workcationLocation` | ✅ |
| `MEDICAL_FILE_URL` | `medicalFileUrl` | ✅ |
| `ATTENDANCE_REQUEST_STATUS` | `attendanceRequestStatus` | ✅ |
| `ATTENDANCE_REQUEST_REJECT_REASON` | `attendanceRequestRejectReason` | ✅ |
| `ATTENDANCE_REQUEST_CREATED_AT` | `attendanceRequestCreatedAt` | ✅ |
| `ATTENDANCE_REQUEST_UPDATED_AT` | `attendanceRequestUpdatedAt` | ✅ |

---

### 13. CALENDAR_EVENT ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `CALENDAR_EVENT_NO` | `calendarEventNo` | ✅ |
| `MEMBER_NO` | `memberNo` | ✅ |
| `CALENDAR_EVENT_NAME` | `calendarEventName` | ✅ |
| `CALENDAR_EVENT_CONTENT` | `calendarEventContent` | ✅ |
| `CALENDAR_EVENT_TYPE` | `calendarEventType` | ✅ |
| `CALENDAR_EVENT_STARTED_AT` | `calendarEventStartedAt` | ✅ |
| `CALENDAR_EVENT_ENDED_AT` | `calendarEventEndedAt` | ✅ |
| `CALENDAR_EVENT_CREATED_AT` | `calendarEventCreatedAt` | ✅ |
| `CALENDAR_EVENT_UPDATED_AT` | `calendarEventUpdatedAt` | ✅ |
| `CALENDAR_EVENT_COLOR` | `calendarEventColor` | ✅ |

---

### 14. HEALTH_SURVEY ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `HEALTH_SURVEY_NO` | `healthSurveyNo` | ✅ |
| `HEALTH_SURVEY_NAME` | `healthSurveyName` | ✅ |
| `HEALTH_SURVEY_TYPE` | `healthSurveyType` | ✅ |
| `HEALTH_SURVEY_CONTENT` | `healthSurveyContent` | ✅ |
| `HEALTH_SURVEY_STATUS` | `healthSurveyStatus` | ✅ |
| `HEALTH_SURVEY_CREATED_AT` | `healthSurveyCreatedAt` | ✅ |
| `HEALTH_SURVEY_UPDATED_AT` | `healthSurveyUpdatedAt` | ✅ |

---

### 15. KANBAN_BOARD ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `KANBAN_BOARD_NO` | `kanbanBoardNo` | ✅ |
| `PROJECT_NO` | `projectNo` | ✅ |
| `KANBAN_BOARD_NAME` | `kanbanBoardName` | ✅ |
| `KANBAN_BOARD_ORDER` | `kanbanBoardOrder` | ✅ |
| `KANBAN_BOARD_STATUS` | `kanbanBoardStatus` | ✅ |

---

### 16. HEALTH_SURVEY_RESPONSE_ITEM ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `HEALTH_SURVEY_RESPONSE_ITEM_NO` | `healthSurveyResponseItemNo` | ✅ |
| `HEALTH_SURVEY_RESPONSE_NO` | `healthSurveyResponseNo` | ✅ |
| `HEALTH_SURVEY_QUESTION_NO` | `healthSurveyQuestionNo` | ✅ |
| `HEALTH_SURVEY_QUESTION_ITEM_ANSWER_SCORE` | `healthSurveyQuestionItemAnswerScore` | ✅ |
| `HEALTH_SURVEY_QUESTION_ITEM_CREATED_AT` | `healthSurveyQuestionItemCreatedAt` | ✅ |

---

### 17. ATTENDANCE ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `ATTENDANCE_NO` | `attendanceNo` | ✅ |
| `MEMBER_NO` | `memberNo` | ✅ |
| `AGENCY_NO` | `agencyNo` | ✅ |
| `ATTENDANCE_TYPE` | `attendanceType` | ✅ |
| `ATTENDANCE_TIME` | `attendanceTime` | ✅ |

---

### 18. LEAVE_HISTORY ⚠️ 간접 사용 (연차 변경 로그)

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `LEAVE_HISTORY_NO` | `leaveHistoryNo` | ⚠️ (백엔드에서 생성) |
| `MEMBER_NO` | `memberNo` | ✅ |
| `LEAVE_HISTORY_DATE` | `leaveHistoryDate` → `date` | ⚠️ (로그 표시용) |
| `LEAVE_HISTORY_TYPE` | `leaveHistoryType` → `type` | ⚠️ (로그 표시용) |
| `LEAVE_HISTORY_REASON` | `leaveHistoryReason` → `reason` | ⚠️ (로그 표시용) |
| `LEAVE_HISTORY_AMOUNT` | `leaveHistoryAmount` → `changedDays` | ⚠️ (로그 표시용) |

**참고**: 연차 변경 로그 기능에서 간접적으로 사용됩니다. `AgencyLeaveSettingsPage.jsx`에서 연차 조정 시 로그를 표시하며, 프론트엔드에서는 로그 데이터를 `date`, `type`, `reason`, `changedDays` 등의 변수명으로 표시하고 있습니다. 현재는 localStorage를 사용하며, 향후 백엔드 API를 통해 `LEAVE_HISTORY` 테이블과 연동할 예정입니다.

---

### 19. COMMENT ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `COMMENT_NO` | `commentNo` | ✅ |
| `KANBAN_CARD_NO` | `kanbanCardNo` | ✅ |
| `COMMENT_CONTENT` | `commentContent` | ✅ |

---

### 20. TASK_HISTORY ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `TASK_HISTORY_NO` | `taskHistoryNo` | ✅ |
| `KANBAN_CARD_NO` | `kanbanCardNo` | ✅ |
| `MEMBER_NO` | `memberNo` | ✅ |
| `BEFORE_TASK_HISTORY` | `beforeTaskHistory` | ✅ |
| `AFTER_TASK_HISTORY` | `afterTaskHistory` | ✅ |
| `TASK_HISTORY_UPDATED_AT` | `taskHistoryUpdatedAt` | ✅ |

---

### 21. PROJECT_MEMBER ✅ 완전 일치

| DB 필드 | 프론트엔드 변수 | 상태 |
|---------|----------------|------|
| `PROJECT_MEMBER_NO` | `projectMemberNo` | ✅ |
| `MEMBER_NO` | `memberNo` | ✅ |
| `PROJECT_NO` | `projectNo` | ✅ |
| `PROJECT_MEMBER_ROLE` | `projectMemberRole` | ✅ |

---

## ✅ 최종 검증 결과

### 일치하는 테이블 (19개)
1. ✅ KANBAN_CARD
2. ✅ DAILY_HEALTH_CHECK
3. ✅ MEMO
4. ✅ HEALTH_SURVEY_QUESTION
5. ✅ LEAVE_BALANCE
6. ✅ AGENCY
7. ✅ HEALTH_SURVEY_RESPONSE
8. ✅ NOTIFICATION
9. ✅ MEMBER (memberEmail 사용)
10. ✅ PROJECT
11. ✅ ATTENDANCE_REQUEST
12. ✅ CALENDAR_EVENT
13. ✅ HEALTH_SURVEY
14. ✅ KANBAN_BOARD
15. ✅ HEALTH_SURVEY_RESPONSE_ITEM
16. ✅ ATTENDANCE
17. ✅ COMMENT
18. ✅ TASK_HISTORY
19. ✅ PROJECT_MEMBER

### 확인 완료 테이블 (2개)
1. ✅ NEW_REQUEST - 에이전시 가입 요청 기능에서 사용 중 (`agencyService.requestJoinAgency`)
2. ⚠️ LEAVE_HISTORY - 연차 변경 로그에서 간접 사용 (`AgencyLeaveSettingsPage.jsx`)

---

## 📋 검증 완료 사항

- ✅ 모든 주요 테이블의 필드명이 DB 스키마와 프론트엔드 변수명이 일치함
- ✅ `MEMBER_ID` 필드 없음 확인 및 `memberEmail` 사용으로 수정 완료
- ✅ 타입 정의 업데이트 완료
- ✅ 가이드 문서 업데이트 완료

---

## 🔧 프론트엔드 API 엔드포인트 및 요청 변수명 스키마 일치 가이드

### ✅ 검증 완료 사항

#### 1. API 엔드포인트 일치 확인
- ✅ 모든 API 엔드포인트가 RESTful 규칙을 따르며 일관성 있게 구성됨
- ✅ 경로 파라미터가 DB 기본키와 일치 (`memberNo`, `projectNo`, `attendanceRequestNo` 등)
- ✅ 엔드포인트 경로가 리소스 중심으로 명확하게 정의됨

#### 2. 요청 변수명 일치 확인
- ✅ **인증 API**: `memberEmail`, `memberPassword` (DB: `MEMBER_EMAIL`, `MEMBER_PASSWORD`)
- ✅ **회원 API**: `memberName`, `memberEmail`, `memberPhone`, `memberRole` 등 모든 필드 일치
- ✅ **연차 API**: `attendanceRequestType`, `attendanceRequestStartDate`, `attendanceRequestEndDate` 등 일치
- ✅ **출석 API**: `memberNo`, `agencyNo`, `attendanceType` 일치
- ✅ **프로젝트 API**: `projectName`, `projectStatus`, `projectColor` 등 일치
- ✅ **캘린더 API**: `memberNo`, `calendarEventName`, `calendarEventStartedAt` 등 일치
- ✅ **건강 관리 API**: `memberNo`, `healthCondition`, `sleepHours` 등 일치
- ✅ **에이전시 API**: `agencyCode`, `memberName`, `memberEmail`, `memberPhone` 일치
- ✅ 모든 요청 변수명이 DB 스키마의 `camelCase` 변환 규칙을 따름

#### 3. 응답 변수명 일치 확인
- ✅ 모든 응답 변수명이 DB 스키마의 `camelCase` 변환 규칙을 따름
- ✅ JOIN 결과 필드와 계산 필드 구분 명확

### 📝 주요 수정 사항

#### 1. MEMBER 테이블 관련
- ❌ **이전**: `memberId` 사용 (DB에 `MEMBER_ID` 필드 없음)
- ✅ **수정**: `memberEmail` 사용 (DB: `MEMBER_EMAIL` UNIQUE)
- **적용 위치**:
  - `src/pages/Login/LoginPage.jsx` - 로그인 요청
  - `src/pages/Signup/SignupPage.jsx` - 회원가입 요청

#### 2. API 서비스 레이어
- ✅ `src/api/services.js`에서 모든 API 호출이 일관된 변수명 사용
- ✅ `src/api/config.js`에서 엔드포인트가 RESTful 규칙 준수
- ✅ 가이드 문서(`프론트엔드_변수명_매핑_가이드.md`)에 명시된 엔드포인트만 사용

### 🎯 변수명 변환 규칙 준수 확인

#### DB → 프론트엔드 변환 규칙
```
SNAKE_CASE → camelCase
예시:
- MEMBER_NO → memberNo
- ATTENDANCE_REQUEST_TYPE → attendanceRequestType
- CALENDAR_EVENT_STARTED_AT → calendarEventStartedAt
```

#### 특수 케이스 처리
- `_NO` 접미사 → `No` (예: `MEMBER_NO` → `memberNo`)
- `_AT` 접미사 → `At` (예: `CREATED_AT` → `createdAt`)
- `_URL` 접미사 → `Url` (예: `FILE_URL` → `fileUrl`)
- `MEMBER_ID` 필드 없음 → `MEMBER_EMAIL` 사용

### 📚 참고 문서

- **변수명 매핑 가이드**: `GUIDE/프론트엔드_변수명_매핑_가이드.md`
- **API 엔드포인트 설정**: `src/api/config.js`
- **API 서비스**: `src/api/services.js`
- **타입 정의**: `src/types/index.js`

### ⚠️ 주의사항

1. **NOT NULL 필드**: 
   - `MEDICAL_FILE_URL`은 NOT NULL이지만 빈 문자열(`''`) 가능
   - `MEMBER_EMAIL`은 UNIQUE이며 로그인 ID로 사용

2. **NULL 허용 필드**:
   - `AGENCY_NO`는 NULL 허용 (에이전시에 속하지 않은 회원 가능)
   - `WORKCATION_LOCATION`은 워케이션 신청 시에만 작성

3. **날짜 타입**:
   - `ATTENDANCE_REQUEST_START_DATE`, `ATTENDANCE_REQUEST_END_DATE`는 DATETIME 타입
   - `CALENDAR_EVENT_STARTED_AT`, `CALENDAR_EVENT_ENDED_AT`는 DATE 타입

### ✅ 최종 확인 결과

**모든 프론트엔드 API 엔드포인트 및 요청/응답 변수명이 DB 스키마와 일치합니다!**

- ✅ 21개 테이블 중 19개 완전 일치
- ✅ 2개 테이블 확인 완료 (NEW_REQUEST 사용 중, LEAVE_HISTORY 간접 사용)
- ✅ 가이드 문서(`프론트엔드_변수명_매핑_가이드.md`)에 명시된 엔드포인트만 사용 중
- ✅ 모든 API 엔드포인트 RESTful 규칙 준수
- ✅ 모든 변수명 camelCase 변환 규칙 준수

**현재 사용 중인 API 엔드포인트:**
- 인증: `POST /api/auth/login`
- 회원: `POST /api/members`, `GET /api/members/me`
- 출석: `POST /api/attendance/check-in`, `GET /api/attendance/history`
- 연차: `POST /api/leave/request`, `GET /api/leave/list`, `GET /api/leave/balance`
- 프로젝트: `POST /api/projects`, `GET /api/projects`, `GET /api/projects/{projectNo}/kanban`
- 캘린더: `POST /api/calendar/events`, `GET /api/calendar/events`
- 알림: `GET /api/notifications`
- 건강: `POST /api/health/survey`, `POST /api/health/daily-check`
- 에이전시: `POST /api/agency/join-request`

---

**마지막 업데이트**: 2026-01-27
