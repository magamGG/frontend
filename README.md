# 🚀 MagamGG — Frontend

> React·Vite 기반 엔터테인먼트 에이전시 협업 웹 클라이언트 — 작가·담당자·에이전시 역할별 대시보드, 프로젝트·근태·건강·채팅·포트폴리오를 한 화면에서

## 📘 개요 (Overview)

본 디렉터리는 **MagamGG** 서비스의 **SPA(Single Page Application) 프론트엔드**입니다.

- **웹툰·웹소설 작가 및 어시스트**, **담당자(매니저)**, **에이전시 관리자** 등 `MEMBER_ROLE`에 따라 `App.jsx`에서 **서로 다른 섹션(메뉴) 구성**을 로드합니다.
- **JWT·Refresh 토큰** 기반 세션 복원(`authStore`), **Google / Naver / Kakao** OAuth 콜백 처리, **에이전시 미소속 시 소속 요청(`JoinAgencyRequestPage`)** 흐름이 구현되어 있습니다.
- **프로젝트·캘린더·칸반·댓글**, **근태·휴가 신청 모달**, **실시간 채팅(WebSocket)**, **알림**, **건강·포트폴리오** 등은 백엔드 REST/WebSocket API와 연동합니다.
- 개발 서버에서는 `vite.config.js`의 **`/api` → `http://localhost:8888` 프록시**로 API를 호출할 수 있습니다. 이미지·업로드 URL은 `src/api/config.js`의 `VITE_API_BASE_URL`(미설정 시 동일 호스트 8888)을 기준으로 조합합니다.

## 🧱 기술 스택 (Tech Stack)

| 구분 | 사용 기술 |
|------|------------|
| **Language** | JavaScript (JSX) |
| **Runtime** | Node.js (개발·빌드용) |
| **Framework** | React 18 |
| **Build / Dev** | Vite 6, `@vitejs/plugin-react` |
| **Styling** | Tailwind CSS 4 (`@tailwindcss/vite`), Emotion, styled-components |
| **UI** | Radix UI, MUI Icons (`@mui/icons-material`), Lucide React 등 |
| **State** | Zustand (`authStore`, `chatStore`, `themeStore` 등) |
| **HTTP** | Axios (`src/api/axios.js`, `services.js`) |
| **Routing / Layout** | 단일 `App.jsx` 내 뷰 전환 + `FullPageLayout` 섹션 네비게이션 |
| **Realtime** | SockJS, `@stomp/stompjs` |
| **Maps** | `@vis.gl/react-google-maps` |
| **DnD** | react-dnd |
| **Charts / UX** | recharts, motion, react-hook-form, sonner 등 |
| **Tools** | npm 또는 pnpm, Git |

## 🛠️ 설치 및 실행 (Installation & Run)

### 1. 프로젝트 클론

```bash
git clone <저장소-URL>
cd <프로젝트루트>/frontend
```

### 2. 사전 요구 사항

| 항목 | 설명 |
|------|------|
| Node.js | **18.x 이상 LTS** 권장 (`package.json`의 `peerDependencies`와 호환) |
| 패키지 매니저 | **npm** 또는 **pnpm** (`package.json`에 `pnpm.overrides` 있음) |
| 백엔드 | Spring Boot API가 **`http://localhost:8888`** 에서 동작할 것(로그인·업로드 URL) |
| 브라우저 | Chrome, Edge, Firefox 등 최신 브라우저 |

### 3. 의존성 설치

```bash
npm install
# 또는
pnpm install
```

### 4. npm 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | Vite 개발 서버 (`vite`) |
| `npm run build` | 프로덕션 빌드 (`vite build` → `dist/`) |

빌드 후 로컬에서 결과물만 확인할 때:

```bash
npx vite preview
```

### 5. 환경 변수

프로젝트 루트(`frontend/`)에 `.env` 또는 `.env.local`을 두고 API 주소를 지정합니다.

```env
VITE_API_BASE_URL=http://localhost:8888
```

미설정 시 `src/api/config.js`에서 기본값 `http://localhost:8888`이 사용됩니다.

### 6. 개발 서버 실행

```bash
npm run dev
```

- 브라우저: Vite 기본 **`http://localhost:5173`** (실제 포트는 터미널 출력 기준).
- **`/api` 요청**은 `vite.config.js`에 따라 백엔드 **`http://localhost:8888`**으로 프록시됩니다.

#### IntelliJ IDEA / WebStorm에서 실행

- **File → Open** → `frontend` 폴더 선택
- 우측 상단 **Add Configuration** → **npm** → `Command: run`, `Scripts: dev` 저장 후 실행(▶)

#### VS Code에서 실행

- 터미널에서 `npm run dev` 또는 **npm 스크립트** 패널에서 `dev` 실행

### 7. 프로덕션 빌드

```bash
npm run build
```

결과물은 `dist/`에 생성됩니다. 배포 시 Nginx 등에서 `/api`를 백엔드로 넘기거나, `VITE_API_BASE_URL`로 API 서버를 직접 지정합니다.

### 8. 동작 전제

- 백엔드(Spring Boot)가 **8888** 포트에서 기동되어 있어야 로그인·API·이미지 URL이 정상 동작합니다.

## 📂 프로젝트 구조 (Directory Structure)

```text
frontend/
├── public/
├── src/
│   ├── api/                    # axios, config.js, services.js (API 메서드)
│   ├── app/                    # 일부 진입용 페이지
│   ├── components/
│   │   ├── common/             # 공통 UI (캘린더, AiChatBot 등)
│   │   ├── layout/             # Header, FullPageLayout, FullPageLayout.styled
│   │   └── modals/             # 채팅, 근태, 팀 프로필 등 모달
│   ├── contexts/               # ProjectContext 등
│   ├── hooks/
│   ├── pages/
│   │   ├── artist/             # 작가(아티스트) 화면
│   │   ├── admin/              # 담당자(매니저) 화면
│   │   ├── agency/             # 에이전시 화면
│   │   ├── Login/, Signup/, ForgotPassword/
│   │   ├── JoinAgencyRequest/
│   │   ├── MyPage/, ProjectDetail/ …
│   │   └── …
│   ├── store/                  # Zustand 스토어
│   ├── styles/
│   ├── utils/
│   ├── App.jsx                 # 인증 뷰, OAuth 콜백, 역할별 sections 정의
│   └── main.jsx
├── vite.config.js              # @ → src, /api 프록시
├── package.json
└── README.md
```

### 주요 엔트리·설정 파일

| 파일 | 역할 |
|------|------|
| `src/main.jsx` | React 루트 마운트 |
| `src/App.jsx` | 인증 뷰 전환, OAuth, 역할별 `sections`, `ChatModal`·`AiChatBot` |
| `src/api/axios.js` | Axios 인스턴스·인터셉터 |
| `src/api/config.js` | `VITE_API_BASE_URL`, 썸네일·프로필·채팅 첨부 URL 헬퍼 |
| `src/api/services.js` | 백엔드 API 호출 모음 |
| `vite.config.js` | `@` → `src`, `server.proxy['/api']` |

## 🌟 주요 기능 (Key Features)

### 🔐 인증·온보딩 (공통)

- ✅ 이메일 기반 **로그인 / 회원가입 / 비밀번호 찾기** 화면 (`Login`, `Signup`, `ForgotPassword`)
- ✅ **JWT** 저장 및 **Refresh 토큰**으로 세션 복원 (`initializeAuth`)
- ✅ **Google / Naver / Kakao** OAuth 리다이렉트 콜백 처리 (`/auth/{provider}/callback` 등)
- ✅ **에이전시 소속 요청** — 작가·어시스트 등이 소속이 없을 때 `JoinAgencyRequestPage` 표시
- ✅ 전역 **채팅 모달**(`ChatModal`), **AI 챗봇**(`AiChatBot`) 플로팅 UI

### 🎨 작가·어시스트 (`userRole === 'individual'`)

`App.jsx` 기준 섹션: **대시보드**, **프로젝트 관리**, **캘린더**, **건강관리**, **포트폴리오**

- ✅ **대시보드** (`ArtistDashboardPage`)
- ✅ **프로젝트** — 목록·상세·칸반·댓글 등 (`ArtistProjectsPage`, 관련 모달/컨텍스트)
- ✅ **캘린더** — 일정·메모 연동 (`ArtistCalendarPage`)
- ✅ **건강관리** (`ArtistHealthPage`)
- ✅ **포트폴리오** (`ArtistPortfolioPage`)
- ✅ **마이페이지** — 헤더 프로필에서 `MyPage` 오버레이

### 👔 담당자(매니저) (`userRole === 'manager'`)

섹션: **대시보드**, **프로젝트 관리**, **캘린더**, **직원 관리**, **원격 관리**, **건강 검사**, **작가 건강관리**

- ✅ **대시보드** (`AdminDashboardPage`)
- ✅ **프로젝트·캘린더·팀** (`AdminProjectsPage`, `AdminCalendarPage`, `AdminTeamPage`)
- ✅ **원격 관리(워케이션)** (`AgencyWorkcationPage` 공용)
- ✅ **담당자 건강 검사** (`AdminPersonalHealthPage`), **작가 건강관리** (`AdminHealthPage`)
- ✅ **마이페이지** (`AdminMyPage`)
- ✅ **근태·휴가 신청** — 헤더에서 `LeaveRequestModal`

### 🏢 에이전시 (`userRole === 'agency'`)

- ✅ **대시보드** (`AgencyDashboardPage`)
- ✅ **전체 프로젝트** — `memberRole === '에이전시 관리자'`일 때만 메뉴 노출 (`AgencyProjectsPage`)
- ✅ **전체 직원**, **요청 관리(승인)** (`AgencyTeamPage`, `AgencyApprovalsPage`)
- ✅ **건강관리**, **원격 관리**, **할당 관리**, **연차 설정** (`AgencyHealthPage`, `AgencyWorkcationPage`, `AgencyAssignmentPage`, `AgencyLeaveSettingsPage`)
- ✅ **마이페이지** (`AgencyMyPage`)

### 💬 실시간·부가

- ✅ **WebSocket/STOMP** 기반 채팅 (`websocketService.js`, `chatStore`)
- ✅ **알림** 훅·헤더 연동 (`useNotificationSource.js` 등)

## 📸 화면 미리보기 (Preview)

스크린샷은 `frontend/public/preview/` 또는 `frontend/assets/`에 두고 경로만 맞추면 됩니다.

### 인증·온보딩

| 화면 | 설명 | 이미지 |
|------|------|--------|
| 로그인 | 이메일 로그인 | ![로그인](./assets/login.png) |
| 회원가입 | 회원 등록 | ![회원가입](./assets/signup.png) |
| 소속 요청 | 에이전시 가입 요청 | ![소속 요청](./assets/join-agency.png) |

### 작가

| 화면 | 설명 | 이미지 |
|------|------|--------|
| 대시보드 | 작가 홈 | ![작가 대시보드](./assets/artist-dashboard.png) |
| 프로젝트 | 프로젝트 목록·상세 | ![프로젝트](./assets/artist-projects.png) |
| 포트폴리오 | 포트폴리오 편집 | ![포트폴리오](./assets/artist-portfolio.png) |

### 에이전시·담당자

| 화면 | 설명 | 이미지 |
|------|------|--------|
| 에이전시 대시보드 | 운영 현황 | ![에이전시](./assets/agency-dashboard.png) |
| 요청 관리 | 승인·대기 | ![요청 관리](./assets/agency-approvals.png) |

## 💡 학습 포인트 (Learning Points)

- **React 18 + Vite**로 SPA를 구성하고, `lazy`/`Suspense`로 역할별 페이지 청크 분할
- **Zustand**로 인증·채팅 등 전역 상태를 관리하고, 새로고침 시 토큰 갱신 흐름 이해
- **Axios** 인터셉터·`services.js` 패턴으로 API 계층 일원화
- **역할(`userRole`)에 따른 `sections` 배열 분기** — 단일 앱에서 멀티 테넌트형 UX 구현
- **OAuth 콜백** — `postMessage`, `history.replaceState`로 토큰 수신 후 라우팅 정리
- **SockJS + STOMP** 클라이언트 구독·발행 패턴
- **Vite 프록시**로 CORS 없이 로컬 API 연동

## 🔮 개선사항 및 향후 계획 (Improvements & Future Plans)

### 1. 라우팅 명시화 (React Router)

**현재**: `authView` 상태와 `sections` 인덱스로 화면 전환 — URL과 1:1이 아닌 경우가 있음.  
**계획**: `react-router-dom`으로 `/dashboard`, `/projects` 등 경로를 고정해 새로고침·공유 URL 대응.

### 2. E2E·시각적 회귀 테스트

**계획**: Playwright 또는 Cypress로 로그인·핵심 시나리오 자동화.

### 3. 국제화(i18n)

**계획**: `react-i18next` 등으로 메시지 분리(필요 시).

### 4. 접근성(a11y)

**계획**: 키보드 포커스, ARIA 레이블, 대비 검증.

## 🔐 사용자 역할 (User Roles) — 프론트 관점

| `userRole` | 대상 | 비고 |
|------------|------|------|
| `individual` | 웹툰·웹소설 작가, 어시스트 등 | `MEMBER_ROLE` 문자열로 세부 구분 |
| `manager` | 담당자 | `담당자` 역할 |
| `agency` | 에이전시 | `에이전시 관리자` 등 |
| (개발용) `null` | `App.jsx` 하단 **전체 미리보기** 섹션 | 개발·데모용 긴 메뉴 |

백엔드 `MEMBER_ROLE`·`AGENCY_NO`와의 매핑은 `App.jsx`의 `handleLogin` / OAuth 콜백 로직을 참고하세요.

## 🚧 개발 환경 요구사항

| 항목 | 버전·비고 |
|------|------------|
| Node.js | **18+** LTS 권장 |
| 패키지 매니저 | npm 또는 pnpm |
| 브라우저 | Chrome, Edge 등 최신 브라우저 |
| 연동 | 백엔드 `http://localhost:8888` 가동 |

## ❓ 트러블슈팅 (Troubleshooting)

| 증상 | 확인 사항 |
|------|------------|
| API 401 / 로그인 안 됨 | 백엔드 기동 여부, `VITE_API_BASE_URL`이 실제 API 주소와 일치하는지 |
| CORS 오류 | 개발 시에는 `vite` 프록시로 `/api`를 쓰거나, 백엔드 `CorsConfig`에서 프론트 origin 허용 |
| 이미지·업로드 깨짐 | `config.js`의 `getProjectThumbnailUrl` 등이 가리키는 **베이스 URL**(8888)과 백엔드 `file.upload-dir` 일치 |
| WebSocket 연결 실패 | 백엔드 WebSocket 엔드포인트·SockJS URL, 방화벽/프록시에서 WS 허용 |
| `pnpm install` 충돌 | `package.json`의 `pnpm.overrides` 참고, 또는 npm으로 통일 |


## 팀원 소개 (협업 시 추가)

| 이름 | 포지션 | Contact |
| --- | --- | --- |
| (이름) | FE | (이메일) |
| (이름) | FE | (이메일) |

## 🤝 기여하기 (Contributing)

1. Fork 후 브랜치 생성 (`feature/기능명`)
2. `.cursorrules` 및 `docs/COLLABORATION_GUIDE_FRONTEND.md` 준수
3. Commit 후 Push, Pull Request

## 📄 라이선스 (License)

프로젝트 정책에 따릅니다.

---

**마지막 업데이트**: 2026-03-25  
**모듈**: MagamGG Frontend  
**버전**: `0.0.1` (`package.json`의 `version`)
