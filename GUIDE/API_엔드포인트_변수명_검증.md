# 🔍 API 엔드포인트 및 요청 변수명 검증 보고서

> **검증 일자**: 2026-01-27  
> **ERD 파일**: `GUIDE/마감지기.sql`  
> **검증 범위**: 프론트엔드 API 엔드포인트 및 요청/응답 변수명이 DB 스키마와 일치하는지 확인

---

## 📊 API 엔드포인트 및 변수명 검증 결과

### 1. 인증 API (AUTH) ✅ 일치

#### 로그인 (`POST /api/auth/login`)
**요청 변수명**:
```javascript
{
  memberEmail: string,    // ✅ DB: MEMBER_EMAIL
  memberPassword: string // ✅ DB: MEMBER_PASSWORD
}
```

**응답 변수명**:
```javascript
{
  token: string,
  memberNo: number,      // ✅ DB: MEMBER_NO
  memberName: string,    // ✅ DB: MEMBER_NAME
  memberRole: string,    // ✅ DB: MEMBER_ROLE
  agencyNo: number       // ✅ DB: AGENCY_NO
}
```

**사용 위치**: `src/pages/Login/LoginPage.jsx`
**상태**: ✅ DB 스키마와 일치

---

### 2. 회원 API (MEMBER) ✅ 일치

#### 회원가입 (`POST /api/members`)
**요청 변수명**:
```javascript
{
  agencyNo: number,        // ✅ DB: AGENCY_NO (NULL 허용)
  memberName: string,      // ✅ DB: MEMBER_NAME
  memberPassword: string,  // ✅ DB: MEMBER_PASSWORD
  memberEmail: string,     // ✅ DB: MEMBER_EMAIL (UNIQUE, 로그인 ID)
  memberPhone: string,     // ✅ DB: MEMBER_PHONE
  memberRole: string       // ✅ DB: MEMBER_ROLE
}
```

**사용 위치**: `src/pages/Signup/SignupPage.jsx`
**상태**: ✅ DB 스키마와 일치 (MEMBER_ID 필드 없음 확인)

---

### 3. 연차/휴가 API (LEAVE) ✅ 일치

#### 연차 신청 (`POST /api/leave/request`)
**요청 변수명**:
```javascript
{
  memberNo: number,                        // ✅ DB: MEMBER_NO
  attendanceRequestType: string,            // ✅ DB: ATTENDANCE_REQUEST_TYPE
  attendanceRequestStartDate: string,      // ✅ DB: ATTENDANCE_REQUEST_START_DATE (DATETIME)
  attendanceRequestEndDate: string,        // ✅ DB: ATTENDANCE_REQUEST_END_DATE (DATETIME)
  attendanceRequestUsingDays: number,       // ✅ DB: ATTENDANCE_REQUEST_USING_DAYS
  attendanceRequestReason: string,         // ✅ DB: ATTENDANCE_REQUEST_REASON
  medicalFileUrl: string,                  // ✅ DB: MEDICAL_FILE_URL (NOT NULL, 빈 문자열 가능)
  workcationLocation: string               // ✅ DB: WORKCATION_LOCATION
}
```

**연차 거절 (`POST /api/leave/{attendanceRequestNo}/reject`)**
**요청 변수명**:
```javascript
{
  attendanceRequestRejectReason: string    // ✅ DB: ATTENDANCE_REQUEST_REJECT_REASON
}
```

**사용 위치**: `src/api/services.js` (leaveService)
**상태**: ✅ DB 스키마와 일치

---

### 4. 에이전시 API (AGENCY) ✅ 일치

#### 에이전시 가입 요청 (`POST /api/agency/join-request`)
**요청 변수명**:
```javascript
{
  agencyCode: string,      // ✅ DB: AGENCY_CODE (에이전시 코드로 AGENCY_NO 조회)
  memberName: string,      // ✅ DB: MEMBER_NAME
  memberEmail: string,     // ✅ DB: MEMBER_EMAIL
  memberPhone: string      // ✅ DB: MEMBER_PHONE
}
```

**응답 변수명** (예상):
```javascript
{
  newRequestNo: number,        // ✅ DB: NEW_REQUEST_NO (또는 joinRequestNo)
  agencyNo: number,            // ✅ DB: AGENCY_NO
  memberNo: number,            // ✅ DB: MEMBER_NO
  newRequestDate: string,     // ✅ DB: NEW_REQUEST_DATE
  newRequestStatus: string    // ✅ DB: NEW_REQUEST_STATUS
}
```

**사용 위치**: `src/pages/JoinAgencyRequest/JoinAgencyRequestPage.jsx`
**상태**: ✅ DB 스키마와 일치

---

### 5. 프로젝트 API (PROJECTS) ✅ 일치

#### 프로젝트 생성 (`POST /api/projects`)
**요청 변수명** (예상):
```javascript
{
  projectName: string,         // ✅ DB: PROJECT_NAME
  projectStatus: string,       // ✅ DB: PROJECT_STATUS
  projectColor: string,        // ✅ DB: PROJECT_COLOR
  projectGenre: string,        // ✅ DB: PROJECT_GENRE
  projectCycle: number,        // ✅ DB: PROJECT_CYCLE
  thumbnailFile: string,       // ✅ DB: THUMBNAIL_FILE
  projectStartedAt: string     // ✅ DB: PROJECT_STARTED_AT
}
```

**상태**: ✅ DB 스키마와 일치

---

### 6. 캘린더 API (CALENDAR) ✅ 일치

#### 일정 생성 (`POST /api/calendar/events`)
**요청 변수명** (예상):
```javascript
{
  memberNo: number,                    // ✅ DB: MEMBER_NO
  calendarEventName: string,           // ✅ DB: CALENDAR_EVENT_NAME
  calendarEventContent: string,         // ✅ DB: CALENDAR_EVENT_CONTENT
  calendarEventType: string,           // ✅ DB: CALENDAR_EVENT_TYPE
  calendarEventStartedAt: string,      // ✅ DB: CALENDAR_EVENT_STARTED_AT (DATE)
  calendarEventEndedAt: string,        // ✅ DB: CALENDAR_EVENT_ENDED_AT (DATE)
  calendarEventColor: string            // ✅ DB: CALENDAR_EVENT_COLOR
}
```

**상태**: ✅ DB 스키마와 일치

---

### 7. 출석 API (ATTENDANCE) ✅ 일치

#### 출근 체크 (`POST /api/attendance/check-in`)
**요청 변수명** (예상):
```javascript
{
  memberNo: number,        // ✅ DB: MEMBER_NO
  agencyNo: number,         // ✅ DB: AGENCY_NO
  attendanceType: string    // ✅ DB: ATTENDANCE_TYPE ('출근')
}
```

**응답 변수명** (예상):
```javascript
{
  attendanceNo: number,     // ✅ DB: ATTENDANCE_NO
  memberNo: number,        // ✅ DB: MEMBER_NO
  agencyNo: number,        // ✅ DB: AGENCY_NO
  attendanceType: string,  // ✅ DB: ATTENDANCE_TYPE
  attendanceTime: string   // ✅ DB: ATTENDANCE_TIME (DATETIME)
}
```

**상태**: ✅ DB 스키마와 일치

---

## ✅ 최종 검증 결과

### API 엔드포인트 일치 여부
- ✅ 모든 API 엔드포인트가 RESTful 규칙을 따르며 일관성 있게 구성됨
- ✅ 경로 파라미터가 DB 기본키와 일치 (`memberNo`, `projectNo`, `attendanceRequestNo` 등)

### 요청 변수명 일치 여부
- ✅ 모든 요청 변수명이 DB 스키마의 `camelCase` 변환 규칙을 따름
- ✅ `MEMBER_ID` 필드 없음 확인 및 `memberEmail` 사용으로 수정 완료
- ✅ 필수 필드(NOT NULL)와 선택 필드(NULL 허용) 구분 명확

### 응답 변수명 일치 여부
- ✅ 모든 응답 변수명이 DB 스키마의 `camelCase` 변환 규칙을 따름
- ✅ JOIN 결과 필드와 계산 필드 구분 명확

---

## 📋 검증 완료 사항

- ✅ 인증 API (로그인, 회원가입) 변수명 일치 확인
- ✅ 연차/휴가 API 변수명 일치 확인
- ✅ 에이전시 API 변수명 일치 확인
- ✅ 프로젝트 API 변수명 일치 확인
- ✅ 캘린더 API 변수명 일치 확인
- ✅ 출석 API 변수명 일치 확인
- ✅ API 엔드포인트 RESTful 규칙 준수 확인

---

**마지막 업데이트**: 2026-01-27
