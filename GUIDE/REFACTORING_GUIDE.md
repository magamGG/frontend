# 🏗️ Project Refactoring Guidelines: [마감지기 (Deadline Keeper)]

> **최신 업데이트**: 2026-01-26  
> - API 구조 확장 및 네이밍 컨벤션 정리 완료
> - 도메인 이름 통일 (ADMIN → MANAGER)
> - 비즈니스 로직 작성 프롬프트 가이드와 연동 완료

이 문서는 Figma/Anima로 자동 생성된 Raw Code(TS/TSX)를 **프로덕션 레벨의 React 아키텍처**로 리팩토링하기 위한 절대적인 가이드라인입니다.
모든 AI 에이전트 및 개발자는 아래 규칙을 준수하여 코드를 변환해야 합니다.

---

## 1. 🎯 프로젝트 개요 & 목표
* **프로젝트명:** 마감지기 (웹툰/웹소설 에이전시 HR SaaS)
* **목표:**
    1.  자동 생성된 스파게티 코드를 **유지보수 가능한 모듈형 구조**로 변환.
    2.  모바일/태블릿 기준으로 생성된 디자인을 **1920px 데스크탑 풀 스크린 UI**로 재구성.
    3.  **Logic(.jsx)과 Style(.styled.js)**의 철저한 분리.
* **입력 상태:** Figma AI로 생성된 정리되지 않은 `.tsx`, `.ts` 파일들 (구조 없음).
* **출력 목표:** 아래 정의된 디렉토리 구조에 맞춘 Clean Code (`.jsx` 기준).

---

## 2. 📂 목표 디렉토리 구조 (Target Architecture)
모든 파일은 반드시 이 구조 안에서 생성/이동되어야 합니다.

```text
├── src/
│   ├── api/                  # Axios 설정 및 API 함수 (.js)
│   ├── components/
│   │   ├── common/           # 재사용 가능한 UI (Button, Modal, Input 등)
│   │   │   ├── [ComponentName]/
│   │   │   │   ├── [ComponentName].jsx
│   │   │   │   ├── [ComponentName].styled.js
│   │   │   │   └── index.js
│   │   ├── layout/           # Global Layout (Header, Sidebar, Footer)
│   │   │   ├── [LayoutName]/
│   │   │   │   ├── [LayoutName].jsx
│   │   │   │   ├── [LayoutName].styled.js
│   │   │   │   └── index.js
│   │   ├── modals/           # Modal 컴포넌트들
│   │   │   ├── [ModalName]/
│   │   │   │   ├── [ModalName].jsx
│   │   │   │   ├── [ModalName].styled.js
│   │   │   │   └── index.js
│   │   └── ProtectedRoute/   # 인증 가드
│   │       ├── ProtectedRoute.jsx
│   │       └── index.js
│   ├── hooks/                # Custom Hooks (useInput, useModal 등) (.js)
│   ├── pages/                # 페이지 단위 컴포넌트 (Logic/Style 분리 필수)
│   │   ├── [PageName]/       # 예: DashboardPage, AuthorListPage
│   │   │   ├── [PageName].jsx        # 로직 및 마크업
│   │   │   ├── [PageName].styled.js  # 스타일 정의
│   │   │   └── index.js              # Export
│   ├── store/                # Zustand Store (authStore, authorStore 등) (.js)
│   ├── styles/               # Global Styles (Theme, Mixins) (.js)
│   ├── contexts/             # React Context (.jsx)
│   ├── types/                # TypeScript 타입 정의 (.js로 변환 또는 제거)
│   ├── data/                 # Mock 데이터 (.js)
│   ├── App.jsx               # 라우팅 설정
│   └── main.jsx              # Entry Point
```

**중요**: 
- 모든 `.tsx` 파일은 `.jsx`로 변환
- 모든 `.ts` 파일은 `.js`로 변환 (타입 정의는 JSDoc 주석으로 대체)
- UI 컴포넌트 라이브러리(`components/ui`)는 외부 라이브러리이므로 변환 제외 가능

---

## 3. 🛠️ 기술 스택 및 코딩 컨벤션
3.1 Tech Stack
Framework: React (Vite)

Styling: Styled Components

State Management: Zustand

Network: Axios

3.2 Naming Convention
Domain Context: '웹툰/웹소설 에이전시' 용어 사용. (e.g., Frame123 (X) -> AuthorContractCard (O))

Components: PascalCase (e.g., WorkStatusTable)

Styled Components: PascalCase (e.g., Container, TitleText)

Functions/Variables: camelCase (e.g., handleSearch, authorList)

**변수명 네이밍 규칙**:
- 모든 변수명은 camelCase 사용 (예: `employeeList`, `searchQueryInput`, `isLoading`)
- 배열/리스트 변수는 복수형 또는 List 접미사 사용 (예: `employeeList`, `projectList`, `leaveLogList`)
- 불린 변수는 is/has/can/should 접두사 사용 (예: `isLoading`, `hasPermission`, `canEdit`)
- 함수명은 동사로 시작 (예: `handleSubmit`, `getEmployeeList`, `calculateRiskStats`)
- API 관련 함수는 서비스 객체 내에서 명확한 동사 사용 (예: `get`, `create`, `update`, `delete`)
- 이벤트 핸들러는 `handle` 접두사 사용 (예: `handleClick`, `handleSubmit`)
- 데이터 가져오기 함수는 `get` 또는 `fetch` 접두사 사용 (예: `getUserData`, `fetchProjectList`)
- 계산/변환 함수는 `calculate`, `convert`, `transform` 등 사용 (예: `calculateUsageRate`, `convertToDate`)

4. ⚡ 리팩토링 핵심 규칙 (Refactoring Rules)
Rule 1: 로직과 스타일의 물리적 분리
Figma 코드는 보통 한 파일에 스타일과 로직이 섞여 있습니다. 이를 반드시 분리하십시오.

[PageName].jsx: JSX 마크업, 상태 관리(Hooks), 이벤트 핸들러만 포함.

[PageName].styled.js: 모든 CSS 및 Styled Components 정의 포함.

Rule 2: 데스크탑 강제 확장 (Force Desktop UX)
원본 코드가 모바일(375px) 기준이라도, 결과물은 1920px 데스크탑 기준이어야 합니다.

Layout Strategy: width: 100%, max-width: 1600px, margin: 0 auto.

Stack to Grid: 세로로 쌓인(Stack) 카드나 리스트는 가로형 Grid 또는 Flex-row로 변경.

Example: 모바일에서 세로로 긴 작가 목록 -> 데스크탑에서 grid-template-columns: repeat(4, 1fr)

Rule 3: 공통 컴포넌트 추출 (Abstraction)
페이지 내에 하드코딩된 UI 요소 중 재사용 가능한 것은 src/components/common으로 추출하거나, 이미 존재한다고 가정하고 import하여 사용하십시오.

버튼, 인풋 박스, 모달, 배지(Badge) 등.

Rule 4: 상태 관리 (Zustand & Mapping)
하드코딩된 데이터는 제거하고 배열(map) 처리.

데이터 소스는 // TODO: Zustand store mapping 주석으로 표시.

Rule 5: API 호출 구조 (Axios & Services)
모든 API 호출은 `src/api/services.js`의 서비스 객체를 통해 수행해야 합니다.

**API 서비스 사용 규칙**:
- 직접 `axios` 또는 `fetch` 호출 금지
- `src/api/services.js`에 도메인별 서비스 객체 정의 (예: `authService`, `leaveService`, `projectService`, `managerService`)
- 각 서비스는 RESTful 메서드에 맞는 함수 제공 (get, create, update, delete)
- API 엔드포인트는 `src/api/config.js`의 `API_ENDPOINTS`에 정의
- 도메인 이름은 비즈니스 로직 작성 프롬프트 가이드의 도메인 분류 규칙 준수 (MANAGER, ATTENDANCE, MEMBER, AGENCY, HEALTH, PROJECT, CALENDAR)
- 에러 처리는 axios 인터셉터에서 통일 처리
- 로딩 상태는 각 페이지/컴포넌트에서 관리 (`isLoading` 상태 사용)

**API 서비스 예시**:
```javascript
// ❌ 잘못된 방법
const response = await axios.post('/api/leave/request', leaveData);

// ✅ 올바른 방법
import { leaveService } from '@/api';
const response = await leaveService.requestLeave(leaveData);
```

**도메인별 서비스 목록 (2026-01-26 최신화)**:
- `authService`: 인증 관련 (로그인, 로그아웃, 비밀번호 찾기 등)
- `memberService`: 회원 관련 (회원가입, 프로필 수정 등)
- `boardService`: 게시판 관련
- `attendanceService`: 출석/근태 관련 (출근, 퇴근, 이력 조회 등)
- `leaveService`: 연차/휴가 관련 (신청, 승인, 조정, 통계 등)
- `projectService`: 프로젝트 관련 (생성, 수정, 칸반 보드 등)
- `teamService`: 팀 관련 (멤버 조회, 통계 등)
- `healthService`: 건강 관리 관련 (설문, 검진 등)
- `workcationService`: 워케이션 관련 (신청, 승인 등)
- `agencyService`: 에이전시 관련 (가입 요청, 승인 등)
- `managerService`: 담당자 관련 (대시보드, 통계 등) - **변경: adminService → managerService**
- `calendarService`: 캘린더 관련 (일정 생성/수정/삭제, 메모 등) - **추가: 2026-01-26**

**변수명 통일 규칙**:
- API 응답 데이터: `responseData`, `apiResponse` 등 명확한 이름 사용
- 로컬 상태 변수: `employeeList` (배열), `selectedEmployee` (단일 객체), `isLoading` (불린)
- 폼 데이터: `formData`, `inputData` 또는 구체적 이름 (`loginFormData`, `leaveRequestData`)
- 필터링된 데이터: `filteredEmployeeList`, `filteredProjectList` 등
- 계산된 값: `usageRate`, `totalCount`, `averageValue` 등

## 5. 📝 작업 프로세스 (Agent Workflow)
에이전트는 다음 순서로 작업을 수행해야 합니다.

### 5.1 파일 변환 프로세스

**Step 1: Analyze (분석)**
- 입력된 파일의 의도와 UI 요소를 파악합니다.
- TypeScript 타입 사용 현황 확인
- Tailwind CSS 클래스 사용 현황 확인
- Import 의존성 확인

**Step 2: Mapping (매핑)**
- '목표 디렉토리 구조'에서 이 파일이 위치할 경로를 결정합니다.
- 컴포넌트 카테고리 분류 (common, layout, modals 등)

**Step 3: Convert TypeScript (타입스크립트 변환)**
- `.tsx` → `.jsx` 변환
- `.ts` → `.js` 변환
- TypeScript 타입 제거:
  - `interface` → JSDoc 주석 또는 제거
  - `type` → JSDoc 주석 또는 제거
  - `: Type` → 제거
  - `as Type` → 제거
  - `<>` 제네릭 → 제거

**Step 4: Separate (분리)**
- 코드를 Logic(.jsx)과 Style(.styled.js)로 분리합니다.
- Tailwind CSS 클래스를 styled-components로 변환
- 공통 스타일은 `styles/mixins.js` 활용

**Step 5: Transform (변환)**
- 모바일 레이아웃 → 데스크탑 레이아웃으로 CSS 수정
- 무의미한 네이밍 → 도메인 네이밍으로 수정
- 하드코딩 → Map/Loop 구조로 변경
- Import 경로 수정 (`@/app/...` → `@/components/...` 등)

**Step 6: Output (출력)**
- 리팩토링된 코드를 새 디렉토리 구조에 생성
- 원본 파일은 삭제 (변환 완료 확인 후)

### 5.2 TypeScript → JavaScript 변환 예시

**Before (.tsx)**:
```tsx
interface Props {
  title: string;
  count: number;
}

export function Component({ title, count }: Props) {
  const [state, setState] = useState<string>('');
  return <div>{title}: {count}</div>;
}
```

**After (.jsx)**:
```jsx
/**
 * @param {Object} props
 * @param {string} props.title
 * @param {number} props.count
 */
export function Component({ title, count }) {
  const [state, setState] = useState('');
  return <div>{title}: {count}</div>;
}
```


---

### 🤖 AI 에이전트 실행 프롬프트 (Cursor Composer / Chat 용)

위의 마크다운 파일을 생성하신 후, AI에게 아래와 같이 명령하세요.

**[명령 프롬프트]**

```text
@REFACTORING_GUIDE.md 파일을 숙지해줘.

지금부터 내가 주는 파일들(또는 현재 프로젝트의 .tsx/.ts 파일들)을 위 가이드라인에 맞춰 리팩토링해줘.

**현재 상황**:
- 페이지 파일들은 이미 `src/pages`로 변환 완료되었지만, 원본 `src/app/pages`의 .tsx 파일들이 남아있음
- 컴포넌트 파일들(`src/app/components`)은 아직 변환되지 않음
- App.tsx, main.tsx 등 핵심 파일들도 변환 필요

**우선순위**:
1. 🔴 높음: App.tsx, main.tsx, ProjectContext.tsx, FullPageLayout.tsx, Header.tsx 변환
2. 🟡 중간: Layout 컴포넌트들, Modal 컴포넌트들 변환
3. 🟢 낮음: 기타 컴포넌트들 변환
4. 정리: `src/app/pages` 폴더의 원본 .tsx 파일들 삭제

**변환 규칙**:
1. `.tsx` → `.jsx`, `.ts` → `.js` 변환
2. TypeScript 타입 제거 (JSDoc 주석으로 대체 가능)
3. Tailwind CSS → styled-components 변환
4. Logic(.jsx)과 Style(.styled.js) 분리
5. 디렉토리 구조에 맞게 이동
6. Import 경로 수정


---

## 6. 📊 리팩토링 진행 상황 (Refactoring Progress)

### 6.1 진행 상태 표기법
- ✅ **완료**: `.jsx` + `.styled.js` 분리 완료, `src/pages/[PageName]` 구조로 이동 완료
- 🔄 **진행 중**: 현재 작업 중
- ⏳ **대기**: 아직 시작하지 않음
- ❌ **오류**: 리팩토링 중 오류 발생

### 6.2 전체 페이지 목록 및 진행 상황

#### 📁 인증 페이지 (Auth Pages) - 5개
| 페이지명 | 원본 경로 | 목표 경로 | 상태 | 비고 |
|---------|---------|---------|------|------|
| DashboardPage | `src/app/pages/DashboardPage.tsx` | `src/pages/Dashboard/` | ✅ 완료 | - |
| LoginPage | `src/app/pages/LoginPage.tsx` | `src/pages/Login/` | ✅ 완료 | - |
| SignupPage | `src/app/pages/SignupPage.tsx` | `src/pages/Signup/` | ✅ 완료 | - |
| ForgotPasswordPage | `src/app/pages/ForgotPasswordPage.tsx` | `src/pages/ForgotPassword/` | ✅ 완료 | - |
| JoinAgencyRequestPage | `src/app/pages/JoinAgencyRequestPage.tsx` | `src/pages/JoinAgencyRequest/` | ✅ 완료 | - |

#### 📁 메인 페이지 (Main Pages) - 8개
| 페이지명 | 원본 경로 | 목표 경로 | 상태 | 비고 |
|---------|---------|---------|------|------|
| AttendancePage | `src/app/pages/AttendancePage.tsx` | `src/pages/Attendance/` | ✅ 완료 | - |
| CalendarPage | `src/app/pages/CalendarPage.tsx` | `src/pages/Calendar/` | ✅ 완료 | - |
| HealthPage | `src/app/pages/HealthPage.tsx` | `src/pages/Health/` | ✅ 완료 | - |
| MyPage | `src/app/pages/MyPage.tsx` | `src/pages/MyPage/` | ✅ 완료 | - |
| ProjectsPage | `src/app/pages/ProjectsPage.tsx` | `src/pages/Projects/` | ✅ 완료 | - |
| TeamPage | `src/app/pages/TeamPage.tsx` | `src/pages/Team/` | ✅ 완료 | - |
| WorkcationPage | `src/app/pages/WorkcationPage.tsx` | `src/pages/Workcation/` | ✅ 완료 | - |
| AbsenteeManagementPage | `src/app/pages/AbsenteeManagementPage.tsx` | `src/pages/AbsenteeManagement/` | ✅ 완료 | - |

#### 📁 Artist 페이지 (Artist Pages) - 6개
| 페이지명 | 원본 경로 | 목표 경로 | 상태 | 비고 |
|---------|---------|---------|------|------|
| ArtistDashboardPage | `src/app/pages/artist/ArtistDashboardPage.tsx` | `src/pages/artist/ArtistDashboard/` | ✅ 완료 | - |
| ArtistProjectsPage | `src/app/pages/artist/ArtistProjectsPage.tsx` | `src/pages/artist/ArtistProjects/` | ✅ 완료 | - |
| ArtistCalendarPage | `src/app/pages/artist/ArtistCalendarPage.tsx` | `src/pages/artist/ArtistCalendar/` | ✅ 완료 | - |
| ArtistWorkationPage | `src/app/pages/artist/ArtistWorkationPage.tsx` | `src/pages/artist/ArtistWorkation/` | ✅ 완료 | - |
| ArtistTeamPage | `src/app/pages/artist/ArtistTeamPage.tsx` | `src/pages/artist/ArtistTeam/` | ✅ 완료 | - |
| ArtistHealthPage | `src/app/pages/artist/ArtistHealthPage.tsx` | `src/pages/artist/ArtistHealth/` | ✅ 완료 | - |

#### 📁 Admin 페이지 (Admin Pages) - 9개
| 페이지명 | 원본 경로 | 목표 경로 | 상태 | 비고 |
|---------|---------|---------|------|------|
| AdminDashboardPage | `src/app/pages/admin/AdminDashboardPage.tsx` | `src/pages/admin/AdminDashboard/` | ✅ 완료 | - |
| AdminProjectsPage | `src/app/pages/admin/AdminProjectsPage.tsx` | `src/pages/admin/AdminProjects/` | ✅ 완료 | - |
| AdminCalendarPage | `src/app/pages/admin/AdminCalendarPage.tsx` | `src/pages/admin/AdminCalendar/` | ✅ 완료 | - |
| AdminTeamPage | `src/app/pages/admin/AdminTeamPage.tsx` | `src/pages/admin/AdminTeam/` | ✅ 완료 | - |
| AdminHealthPage | `src/app/pages/admin/AdminHealthPage.tsx` | `src/pages/admin/AdminHealth/` | ✅ 완료 | - |
| AdminPersonalHealthPage | `src/app/pages/admin/AdminPersonalHealthPage.tsx` | `src/pages/admin/AdminPersonalHealth/` | ✅ 완료 | - |
| AdminAbsenteePage | `src/app/pages/admin/AdminAbsenteePage.tsx` | `src/pages/admin/AdminAbsentee/` | ✅ 완료 | AbsenteeManagementPage re-export |
| AdminMyPage | `src/app/pages/admin/AdminMyPage.tsx` | `src/pages/admin/AdminMyPage/` | ✅ 완료 | - |
| AdminWorkcationPage | `src/app/pages/admin/AdminWorkcationPage.tsx` | `src/pages/admin/AdminWorkcation/` | ✅ 완료 | WorkcationPage re-export |

#### 📁 Agency 페이지 (Agency Pages) - 11개
| 페이지명 | 원본 경로 | 목표 경로 | 상태 | 비고 |
|---------|---------|---------|------|------|
| AgencyDashboardPage | `src/app/pages/agency/AgencyDashboardPage.tsx` | `src/pages/agency/AgencyDashboard/` | ✅ 완료 | - |
| AgencyProjectsPage | `src/app/pages/agency/AgencyProjectsPage.tsx` | `src/pages/agency/AgencyProjects/` | ✅ 완료 | - |
| AgencyTeamPage | `src/app/pages/agency/AgencyTeamPage.tsx` | `src/pages/agency/AgencyTeam/` | ✅ 완료 | - |
| AgencyApprovalsPage | `src/app/pages/agency/AgencyApprovalsPage.tsx` | `src/pages/agency/AgencyApprovals/` | ✅ 완료 | - |
| AgencyWorkcationPage | `src/app/pages/agency/AgencyWorkcationPage.tsx` | `src/pages/agency/AgencyWorkcation/` | ✅ 완료 | - |
| AgencyMyPage | `src/app/pages/agency/AgencyMyPage.tsx` | `src/pages/agency/AgencyMyPage/` | ✅ 완료 | - |
| AgencyHealthPage | `src/app/pages/agency/AgencyHealthPage.tsx` | `src/pages/agency/AgencyHealth/` | ✅ 완료 | - |
| AgencyAssignmentPage | `src/app/pages/agency/AgencyAssignmentPage.tsx` | `src/pages/agency/AgencyAssignment/` | ✅ 완료 | - |
| AgencyProjectDetailPage | `src/app/pages/agency/AgencyProjectDetailPage.tsx` | `src/pages/agency/AgencyProjectDetail/` | ✅ 완료 | - |
| AgencyJoinRequestsPage | `src/app/pages/agency/AgencyJoinRequestsPage.tsx` | `src/pages/agency/AgencyJoinRequests/` | ✅ 완료 | - |
| AgencyLeaveSettingsPage | - | `src/pages/agency/AgencyLeaveSettings/` | ✅ 완료 | 신규 생성, 연차 관리 페이지 (차트 기능 포함) |

#### 📁 Health 하위 페이지 (Health Sub Pages) - 7개
| 페이지명 | 원본 경로 | 목표 경로 | 상태 | 비고 |
|---------|---------|---------|------|------|
| MentalHealthDetailPage | `src/app/pages/health/MentalHealthDetailPage.tsx` | `src/pages/MentalHealthDetail/` | ✅ 완료 | - |
| MonitoringDetailPage | `src/app/pages/health/MonitoringDetailPage.tsx` | `src/pages/MonitoringDetail/` | ✅ 완료 | - |
| PhysicalHealthDetailPage | `src/app/pages/health/PhysicalHealthDetailPage.tsx` | `src/pages/PhysicalHealthDetail/` | ✅ 완료 | - |
| RiskAnalysisPage | `src/app/pages/health/RiskAnalysisPage.tsx` | `src/pages/RiskAnalysis/` | ✅ 완료 | - |
| SurveyListManagementPage | `src/app/pages/health/SurveyListManagementPage.tsx` | `src/pages/SurveyListManagement/` | ✅ 완료 | - |
| SurveyManagementPage | `src/app/pages/health/SurveyManagementPage.tsx` | `src/pages/SurveyManagement/` | ✅ 완료 | - |
| UnscreenedDetailPage | `src/app/pages/health/UnscreenedDetailPage.tsx` | `src/pages/UnscreenedDetail/` | ✅ 완료 | - |

#### 📁 기타 페이지 (Other Pages) - 1개
| 페이지명 | 원본 경로 | 목표 경로 | 상태 | 비고 |
|---------|---------|---------|------|------|
| MasterStyleGuidePage | `src/app/pages/MasterStyleGuidePage.tsx` | `src/pages/MasterStyleGuide/` | ✅ 완료 | 스타일 가이드, 우선순위 낮음 |

### 6.3 진행률 통계
- **전체 페이지 수**: 47개 (신규 1개 추가: AgencyLeaveSettingsPage)
- **완료**: 47개 (100%) - `src/pages` 폴더에 변환 완료
- **원본 파일 남아있음**: 47개 - `src/app/pages` 폴더에 .tsx 파일 존재 (삭제 필요)
- **진행 중**: 0개 (0%)
- **대기**: 0개 (0%)
- **오류**: 0개 (0%)

**페이지 분류**:
- 인증 페이지: 5개
- 메인 페이지: 8개
- Artist 페이지: 6개
- Admin 페이지: 9개
- Agency 페이지: 11개
- Health 하위 페이지: 7개
- 기타 페이지: 1개

### 6.3.1 최근 수정 사항
- **2026-01-13**: 
  - `MyPage.jsx`에서 TypeScript 문법(`interface`, 타입 어노테이션) 제거 완료
    - `interface MyPageProps` → JSDoc 주석으로 변환
    - 함수 파라미터 타입 어노테이션 제거
    - 타입 단언(`as HTMLInputElement`) 제거
    - 빌드 오류 해결 완료
  - 핵심 파일들 상태 확인 완료:
    - `App.jsx`, `main.jsx`, `ProjectContext.jsx`, `FullPageLayout.jsx`는 이미 `.jsx`로 변환 완료
    - TypeScript 문법 사용 없음 (JSDoc 주석만 사용)
- **2026-01-13 (연차 기능 추가)**:
  - `AgencyLeaveSettingsPage` 신규 생성 완료
    - 가이드라인 준수: Logic(.jsx)과 Style(.styled.js) 분리 완료
    - Tailwind CSS 클래스 제거 및 styled-components 변환 완료
    - 데스크탑 레이아웃 적용 (max-width: 1200px)
    - `src/pages/agency/AgencyLeaveSettings/` 구조로 생성
    - 직원별 연차 설정 및 관리 기능 구현
    - localStorage를 통한 연차 데이터 저장
  - `LeaveRequestModal` 기능 개선
    - 연차 선택 시 남은 연차 표시 기능 추가
    - 연차 신청 시 사용한 연차 자동 업데이트 기능 추가
    - `useAuthStore`를 통한 현재 사용자 정보 연동
    - 신청 일수 초과 시 경고 메시지 표시
  - `App.jsx` 업데이트
    - `AgencyLeaveSettingsPage` import 추가
    - 에이전시 섹션에 "연차 설정" 메뉴 추가 (id: 'leave-settings')
- **2026-01-23 (연차 관리 페이지 생성 및 개선)**:
  - `AgencyLeaveSettingsPage` 신규 생성 및 기능 확장 완료
    - **기본 기능**:
      - Logic(.jsx)과 Style(.styled.js) 분리 완료
      - Tailwind CSS 클래스 제거 및 styled-components 변환 완료
      - 데스크탑 레이아웃 적용 (max-width: 1600px)
      - `src/pages/agency/AgencyLeaveSettings/` 구조로 생성
      - localStorage를 통한 연차 데이터 저장
    - **차트 기능 추가**:
      - 연차 소진 분포도 차트 추가 (Grouped Scatter Plot, Recharts 사용)
      - 위험군(0~30%)/적정군(30~80%)/완료군(80~100%) 구분
      - 구간별 배경색 표시 (빨강/초록/노랑)
      - Y축 정수 표시 (0, 1, 2, 3...)
      - 차트 포인트 크기 조정 (r=14, 호버 시 r=18)
      - 차트 포인트 클릭 시 해당 구간 직원 리스트 모달 표시
      - 평균선 표시 (ReferenceLine)
      - 커스텀 툴팁 구현
    - **UI 컴포넌트 추가**:
      - Season Info 카드 추가 (현재 분기 정보, 연말까지 남은 개월 수)
      - 통계 요약 카드 추가 (번아웃 위험군, 이탈 위험군, 평균 사용률, 표준 편차)
      - 휴가 독려 알림 버튼 추가 (번아웃 위험군 카드에 위치)
      - 기본 연차 설정 모달 추가 (페이지 헤더 버튼으로 열림)
      - 직원 리스트 모달 추가 (차트 포인트 클릭 시)
    - **기능 개선**:
      - 페이지 제목 변경: "연차 설정" → "연차 관리"
      - 직원 연차 조정 기능 (포상/징계/경력 인정)
      - 변경 로그 테이블 추가
      - 연차 조정 모달 개선 (사유별 조정 일수 제한)
    - **기술 스택**:
      - Recharts (ComposedChart, Scatter, ReferenceArea, ReferenceLine)
      - styled-components (모든 스타일 분리)
      - useMemo를 통한 차트 데이터 계산 최적화
      - 위험군 분류 로직 구현 (categorizeRiskGroup 함수)

### 6.4 아직 변환되지 않은 파일 목록

#### 📁 컴포넌트 파일 (Components) - 변환 필요
| 파일명 | 원본 경로 | 목표 경로 | 상태 | 우선순위 |
|--------|---------|---------|------|---------|
| App.tsx | `src/app/App.tsx` | `src/App.jsx` | ✅ 완료 | - |
| main.tsx | `src/main.tsx` | `src/main.jsx` | ✅ 완료 | - |
| FullPageLayout.tsx | `src/app/components/layout/FullPageLayout.tsx` | `src/components/layout/FullPageLayout/` | ✅ 완료 | - |
| Header.tsx | `src/app/components/layout/Header.tsx` | `src/components/layout/Header/` | ⏳ 대기 | 🔴 높음 |
| Sidebar.tsx | `src/app/components/layout/Sidebar.tsx` | `src/components/layout/Sidebar/` | ⏳ 대기 | 🟡 중간 |
| MainLayout.tsx | `src/app/components/layout/MainLayout.tsx` | `src/components/layout/MainLayout/` | ⏳ 대기 | 🟡 중간 |
| MiniSidebar.tsx | `src/app/components/layout/MiniSidebar.tsx` | `src/components/layout/MiniSidebar/` | ⏳ 대기 | 🟡 중간 |
| TopBar.tsx | `src/app/components/layout/TopBar.tsx` | `src/components/layout/TopBar/` | ⏳ 대기 | 🟡 중간 |
| Modal.tsx | `src/app/components/Modal.tsx` | `src/components/common/Modal/` | ⏳ 대기 | 🟡 중간 |
| AddTaskModal.tsx | `src/app/components/AddTaskModal.tsx` | `src/components/modals/AddTaskModal/` | ⏳ 대기 | 🟡 중간 |
| AttendanceListModal.tsx | `src/app/components/modals/AttendanceListModal.tsx` | `src/components/modals/AttendanceListModal/` | ⏳ 대기 | 🟡 중간 |
| HealthCheckModal.tsx | `src/app/components/modals/HealthCheckModal.tsx` | `src/components/modals/HealthCheckModal/` | ⏳ 대기 | 🟡 중간 |
| LeaveRequestModal.tsx | `src/app/components/modals/LeaveRequestModal.tsx` | `src/components/modals/LeaveRequestModal/` | ✅ 완료 | 연차 표시 기능 추가 |
| ProjectListModal.tsx | `src/app/components/modals/ProjectListModal.tsx` | `src/components/modals/ProjectListModal/` | ⏳ 대기 | 🟡 중간 |
| UniversalHiatusModal.tsx | `src/app/components/modals/UniversalHiatusModal.tsx` | `src/components/modals/UniversalHiatusModal/` | ⏳ 대기 | 🟡 중간 |
| ImageWithFallback.tsx | `src/app/components/figma/ImageWithFallback.tsx` | `src/components/common/ImageWithFallback/` | ⏳ 대기 | 🟢 낮음 |

#### 📁 기타 파일 (Other Files) - 변환 필요
| 파일명 | 원본 경로 | 목표 경로 | 상태 | 우선순위 |
|--------|---------|---------|------|---------|
| ProjectContext.tsx | `src/app/contexts/ProjectContext.tsx` | `src/contexts/ProjectContext.jsx` | ✅ 완료 | - |
| index.ts (types) | `src/app/types/index.ts` | `src/types/index.js` 또는 제거 | ⏳ 대기 | 🟡 중간 |
| mockData.ts | `src/app/data/mockData.ts` | `src/data/mockData.js` | ⏳ 대기 | 🟡 중간 |

#### 📁 UI 컴포넌트 라이브러리 (UI Components) - 선택적
| 상태 | 설명 |
|------|------|
| ⚪ 제외 | `src/app/components/ui/*` 폴더의 파일들은 shadcn/ui 같은 외부 라이브러리이므로 변환 제외 가능 |
| | 필요시에만 개별 변환 |

#### 📁 원본 페이지 파일 정리 필요
| 상태 | 설명 |
|------|------|
| ⚠️ 삭제 필요 | `src/app/pages/**/*.tsx` 파일들은 모두 `src/pages/**/*.jsx`로 변환 완료되었으므로 원본 삭제 필요 |
| | App.tsx의 import 경로도 모두 `@/pages/`로 수정 필요 |

**App.jsx import 경로 상태**:
- ✅ 모든 import 경로가 올바르게 수정됨
- ✅ `@/pages/...` 경로 사용 중
- ✅ `@/components/...` 경로 사용 중
- ✅ `@/contexts/...` 경로 사용 중
- ✅ `AgencyLeaveSettingsPage` import 추가 완료

### 6.5 다음 작업 우선순위
1. **🔴 높음 (즉시 처리)**:
   - `Header.tsx` → styled-components 변환
   - `src/app/pages` 폴더의 모든 원본 .tsx 파일 삭제

2. **🟡 중간 (다음 단계)**:
   - Layout 컴포넌트들 (Sidebar, MainLayout, MiniSidebar, TopBar)
   - Modal 컴포넌트들 (Modal, AddTaskModal, 각종 Modals)
   - `types/index.ts` → `types/index.js` 또는 제거
   - `data/mockData.ts` → `data/mockData.js`

3. **🟢 낮음 (나중에)**:
   - ImageWithFallback 등 기타 컴포넌트
   - UI 라이브러리 컴포넌트 (필요시에만)

**✅ 완료된 작업**:
- `App.tsx` → `App.jsx` 변환 및 import 경로 수정 완료
- `main.tsx` → `main.jsx` 변환 완료
- `ProjectContext.tsx` → `ProjectContext.jsx` 변환 완료
- `FullPageLayout.tsx` → styled-components 변환 완료
- `LeaveRequestModal` 연차 기능 개선 완료
- `AgencyLeaveSettingsPage` 신규 생성 및 연차 관리 페이지로 확장 완료
  - 차트 기능 포함 (분포도 차트, 위험군 구분, 통계 요약)
  - 모달 기능 (기본 연차 설정, 직원 리스트)
  - 연차 조정 기능 (포상/징계/경력 인정)
  - 변경 로그 기능

### 6.6 변환 작업 프로세스 (Conversion Workflow)

#### Step 1: 파일 변환
1. `.tsx` → `.jsx` 변환
   - TypeScript 타입 제거 (`: Type` → 제거)
   - `interface` → JSDoc 주석 또는 제거
   - `type` → JSDoc 주석 또는 제거
   - `as Type` → 제거

2. `.ts` → `.js` 변환
   - 타입 정의 파일은 JSDoc 주석으로 변환하거나 제거
   - 유틸리티 함수는 타입만 제거

#### Step 2: 스타일 분리
1. Tailwind CSS 클래스 제거
2. styled-components로 변환
3. `[ComponentName].styled.js` 파일 생성
4. 공통 스타일은 `styles/mixins.js` 활용

#### Step 3: 디렉토리 구조 변경
1. `src/app/components/[ComponentName].tsx` 
   → `src/components/[Category]/[ComponentName]/[ComponentName].jsx`
2. `src/app/pages/[PageName].tsx`
   → `src/pages/[PageName]/[PageName].jsx` (이미 완료)
3. `src/app/contexts/[ContextName].tsx`
   → `src/contexts/[ContextName].jsx`

#### Step 4: Import 경로 수정
1. 모든 import 경로를 새 구조에 맞게 수정
2. `@/app/...` → `@/components/...` 또는 `@/pages/...`
3. 상대 경로도 절대 경로로 변경 가능

#### Step 5: 원본 파일 정리
1. 변환 완료된 원본 `.tsx` 파일 삭제
2. Git 커밋 전 확인

### 6.7 완료 상태 업데이트 방법
리팩토링이 완료되면 위 표의 **상태** 컬럼을 다음과 같이 업데이트하세요:
- `⏳ 대기` → `✅ 완료`
- 작업 중이면 `🔄 진행 중`으로 표시
- 오류 발생 시 `❌ 오류`로 표시하고 **비고**에 상세 내용 기록

### 6.8 변환 체크리스트
각 파일 변환 시 다음 사항을 확인하세요:
- [ ] `.tsx` → `.jsx` 또는 `.ts` → `.js` 변환 완료
- [ ] TypeScript 타입 제거 완료
- [ ] Tailwind CSS 클래스 제거 및 styled-components 변환 완료
- [ ] Logic과 Style 파일 분리 완료 (`[Name].jsx` + `[Name].styled.js`)
- [ ] 디렉토리 구조 변경 완료
- [ ] Import 경로 수정 완료
- [ ] 원본 파일 삭제 완료

**마지막 업데이트**: 2026-01-26 (API 구조 확장, 네이밍 컨벤션 정리, 도메인 이름 통일, CALENDAR API 추가, 주요 페이지 API 서비스 적용 완료)

### 6.9 API 구조 및 네이밍 컨벤션 (2026-01-26 추가, 2026-01-26 업데이트)

#### API 서비스 구조
- **위치**: `src/api/services.js`
- **도메인별 서비스**: `authService`, `memberService`, `boardService`, `attendanceService`, `leaveService`, `projectService`, `teamService`, `healthService`, `workcationService`, `agencyService`, `managerService`, `calendarService` (총 12개)
- **엔드포인트 정의**: `src/api/config.js`의 `API_ENDPOINTS` 객체
- **도메인 매핑**: 비즈니스 로직 작성 프롬프트 가이드의 도메인 분류 규칙 준수
  - `CALENDAR`: 캘린더 관련 로직 (일정 추가/수정/삭제, 메모 등) - **추가: calendarService**
  - `ATTENDANCE`: 근태 관련 로직 (출근/퇴근, 휴가 신청/승인, 워케이션 등)
  - `MEMBER`: 회원 관련 로직
  - `AGENCY`: 에이전시 관련 로직
  - `MANAGER`: 담당자 관련 로직 (담당자 배정, 프로젝트 관리 등) - **변경: ADMIN → MANAGER**
  - `HEALTH`: 건강 관리 관련 로직
  - `PROJECT`: 프로젝트 관련 로직

#### 네이밍 통일 사항
- ✅ 배열/리스트 변수: `employeeList`, `projectList`, `leaveLogList` (복수형 또는 List 접미사)
- ✅ 단일 객체 변수: `selectedEmployee`, `currentUser`, `companyPolicy` (단수형)
- ✅ 불린 변수: `isLoading`, `isModalOpen`, `hasPermission` (is/has 접두사)
- ✅ 검색/필터 변수: `searchQueryInput`, `filteredEmployeeList` (명확한 용도 표시)
- ✅ 함수명: `handleSubmit`, `getEmployeeList`, `calculateUsageRate` (동사로 시작)
- ✅ 이벤트 핸들러: `handleOpenModal`, `handleSavePolicy` (handle 접두사)
- ✅ API 호출: `leaveService.requestLeave()`, `authService.login()` (서비스 객체 사용)

#### 주요 변경 사항

**변수명 통일 (2026-01-26)**:
- `employees` → `employeeList` (배열 변수명 통일)
- `selectedEmployee` → `selectedEmployeeData` (명확한 의미)
- `searchQuery` → `searchQueryInput` (입력값임을 명시)
- `selectedBin` → `selectedBinData` (데이터 객체임을 명시)
- `leaveLogs` → `leaveLogList` (배열 변수명 통일)
- `filteredEmployees` → `filteredEmployeeList` (필터링된 배열임을 명시)

**도메인 이름 통일 (2026-01-26)**:
- `ADMIN` → `MANAGER` (비즈니스 로직 작성 프롬프트 가이드의 도메인 분류 규칙 준수)
- `adminService` → `managerService` (서비스 객체 이름 변경)
- API 엔드포인트: `/api/admin` → `/api/manager` (백엔드 API 경로 변경)
- 주석: "관리자" → "담당자(관리자)" (용어 통일)
- **참고**: 비즈니스 로직 작성 프롬프트 가이드(`GUIDE/비즈니스-로직-작성-프롬프트-가이드.md`)의 도메인 분류 규칙에 따라 MANAGER 도메인 사용

**API 구조 개선 (2026-01-26)**:
- TEAM API 활성화 (주석 해제)
- CALENDAR API 추가 (calendarService 생성) - **추가: 2026-01-26**
- 모든 도메인별 서비스 객체 생성 완료 (12개 서비스)
- RESTful API 구조 준수
- 도메인 이름이 비즈니스 로직 가이드와 일치하도록 통일

**페이지별 API 서비스 적용 (2026-01-26)**:
- `SignupPage`: `memberService.register()` 사용, 변수명 통일 (`formData` → `signupFormData`, `customSpecialization` → `customSpecializationInput`)
- `ForgotPasswordPage`: `authService.forgotPassword()`, `verifyCode()`, `resetPassword()` 사용, 변수명 통일 (`email` → `emailInput`, `verificationCode` → `verificationCodeInput`, `newPassword` → `newPasswordInput`, `confirmPassword` → `confirmPasswordInput`)
- `JoinAgencyRequestPage`: `agencyService.requestJoinAgency()` 사용, 변수명 통일 (`agencyCode` → `agencyCodeInput`)
- 모든 페이지에 로딩 상태(`isLoading`) 및 에러 처리 추가

**비즈니스 로직 가이드 연동**:
- API 도메인 구조는 `GUIDE/비즈니스-로직-작성-프롬프트-가이드.md`의 도메인 분류 규칙을 준수
- 도메인: CALENDAR, ATTENDANCE, MEMBER, AGENCY, MANAGER, HEALTH, PROJECT
- LogicID 형식: `BL-{도메인}-{순번}` (예: `BL-MANAGER-001`, `BL-ATTENDANCE-001`)
