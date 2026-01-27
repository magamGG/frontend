# 🎨 Figma 디자인 동기화 가이드

> **목적**: Figma 디자인과 현재 코드 간의 차이를 최소화하고, 기존 컴포넌트와 스타일을 최대한 재사용하여 일관성 있는 UI를 유지하기 위한 가이드

---

## 📋 목차

1. [프로젝트 구조 파악](#1-프로젝트-구조-파악)
2. [재사용 가능한 컴포넌트 목록](#2-재사용-가능한-컴포넌트-목록)
3. [스타일 시스템 및 테마](#3-스타일-시스템-및-테마)
4. [디자인 일관성 체크리스트](#4-디자인-일관성-체크리스트)
5. [Figma 디자인 분석 방법](#5-figma-디자인-분석-방법)

---

## 1. 프로젝트 구조 파악

### 1.1 디렉토리 구조

```
src/
├── components/
│   ├── common/          # 재사용 가능한 공통 컴포넌트
│   │   └── Modal/       # 모달 컴포넌트
│   ├── layout/          # 레이아웃 컴포넌트
│   │   ├── Header/      # 헤더 (고정 상단)
│   │   ├── FullPageLayout/  # 풀페이지 레이아웃
│   │   ├── MainLayout/  # 메인 레이아웃
│   │   ├── Sidebar/     # 사이드바
│   │   └── TopBar/      # 상단 바
│   └── modals/          # 모달 컴포넌트들
│       ├── LeaveRequestModal/
│       ├── HealthCheckModal/
│       └── ...
├── pages/               # 페이지 컴포넌트
│   ├── Dashboard/
│   ├── Projects/
│   └── ...
├── styles/              # 전역 스타일
│   ├── theme.js         # 테마 설정 (색상, 폰트, 간격 등)
│   ├── theme.css        # CSS 변수 정의
│   └── GlobalStyle.js   # 전역 스타일
└── app/components/ui/   # UI 라이브러리 컴포넌트
    ├── button.jsx
    ├── card.jsx
    ├── input.jsx
    └── ...
```

### 1.2 파일 구조 패턴

모든 컴포넌트는 다음 패턴을 따릅니다:

```
[ComponentName]/
├── [ComponentName].jsx      # 로직 및 마크업
├── [ComponentName].styled.js # 스타일 정의 (styled-components)
└── index.js                  # Export
```

**중요**: 로직과 스타일은 반드시 분리되어야 합니다.

---

## 2. 재사용 가능한 컴포넌트 목록

### 2.1 Layout 컴포넌트

#### `FullPageLayout`
- **위치**: `src/components/layout/FullPageLayout/`
- **용도**: 풀페이지 섹션 기반 레이아웃 (하단 Dock 네비게이션 포함)
- **특징**: 
  - 섹션별 전환 애니메이션
  - 하단 Dock 네비게이션
  - 헤더 자동 숨김/표시
- **재사용 시나리오**: 여러 섹션을 가진 풀페이지 레이아웃이 필요한 경우

#### `Header`
- **위치**: `src/components/layout/Header/`
- **용도**: 상단 고정 헤더
- **특징**:
  - 로고, 현재 페이지 제목, 알림, 프로필 버튼
  - 반투명 배경 (backdrop-filter)
  - 스크롤 시 자동 숨김/표시
- **재사용 시나리오**: 모든 페이지에서 공통으로 사용

#### `MainLayout`
- **위치**: `src/components/layout/MainLayout/`
- **용도**: 사이드바 + 메인 콘텐츠 레이아웃
- **재사용 시나리오**: 사이드바가 필요한 페이지

### 2.2 Common 컴포넌트

#### `Modal`
- **위치**: `src/components/common/Modal/`
- **용도**: 범용 모달 컴포넌트
- **Props**:
  - `isOpen`: 모달 열림/닫힘 상태
  - `onClose`: 닫기 핸들러
  - `title`: 모달 제목 (선택)
  - `maxWidth`: 모달 최대 너비 ('sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl')
  - `showCloseButton`: 닫기 버튼 표시 여부
- **재사용 시나리오**: 모든 모달 UI에 사용

### 2.3 UI 라이브러리 컴포넌트

#### `Button`
- **위치**: `src/app/components/ui/button.jsx`
- **Variants**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- **Sizes**: `default`, `sm`, `lg`, `icon`
- **재사용 시나리오**: 모든 버튼에 사용

#### `Card`
- **위치**: `src/app/components/ui/card.jsx`
- **Sub-components**: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction`
- **재사용 시나리오**: 카드 형태의 컨테이너가 필요한 경우

#### `Input`
- **위치**: `src/app/components/ui/input.jsx`
- **재사용 시나리오**: 모든 입력 필드에 사용

### 2.4 Modal 컴포넌트들

다음 모달들은 특정 기능을 위한 것이지만, 스타일과 구조를 참고하여 재사용할 수 있습니다:

- `LeaveRequestModal`: 연차 요청 모달
- `HealthCheckModal`: 건강 검사 모달
- `AttendanceListModal`: 출석 목록 모달
- `ProjectListModal`: 프로젝트 목록 모달
- `AddTaskModal`: 작업 추가 모달

---

## 3. 스타일 시스템 및 테마

### 3.1 테마 파일

#### `src/styles/theme.js`
- **색상 팔레트**: Primary, Gray, Success, Warning, Danger, Info
- **폰트**: 크기, 굵기, 줄 간격
- **간격 (Spacing)**: 0 ~ 24 (4px 단위)
- **Border Radius**: none ~ full
- **그림자 (Shadows)**: sm ~ 2xl
- **Breakpoints**: xs ~ 2xl
- **Z-index**: dropdown ~ tooltip

#### `src/styles/theme.css`
- **CSS 변수**: `--primary`, `--background`, `--foreground`, `--border` 등
- **상태 색상**: `--status-serialization`, `--status-deadline`, `--status-workation` 등
- **사용법**: `var(--primary)`, `var(--background)` 등으로 참조

### 3.2 스타일링 패턴

#### Styled Components 사용
```javascript
import styled from 'styled-components';

export const Container = styled.div`
  padding: ${props => props.theme.spacing[4]};
  background-color: var(--card);
  border-radius: var(--radius);
`;
```

#### CSS 변수 사용
```javascript
// theme.css에서 정의된 변수 사용
color: var(--foreground);
background-color: var(--card);
border: 1px solid var(--border);
```

#### 테마 객체 사용
```javascript
import theme from '@/styles/theme';

// theme.js의 값 사용
padding: theme.spacing[4];
color: theme.colors.primary[600];
font-size: theme.fonts.size.lg;
```

### 3.3 공통 스타일 패턴

#### 카드 스타일
- 배경: `var(--card)` 또는 `#FAFAFA`
- 테두리: `1px solid var(--border)`
- 그림자: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- Border Radius: `var(--radius)` (0.75rem)

#### 버튼 스타일
- Primary: `background-color: #3F4A5A`, `color: white`
- Hover: `background-color: #6E8FB3`
- Border Radius: `8px`
- Transition: `all 0.2s`

#### 모달 스타일
- Overlay: `rgba(0, 0, 0, 0.5)`
- Card: `background-color: white`, `border-radius: 8px`
- 그림자: `0 25px 50px -12px rgba(0, 0, 0, 0.25)`

---

## 4. 디자인 일관성 체크리스트

Figma 디자인을 코드로 구현할 때 다음 항목들을 확인하세요:

### 4.1 색상
- [ ] Figma의 색상이 `theme.js` 또는 `theme.css`의 변수와 일치하는가?
- [ ] 상태 색상 (연재중, 마감임박, 휴재 등)이 올바르게 매핑되었는가?
- [ ] 텍스트 색상이 `var(--foreground)`, `var(--muted-foreground)` 등을 사용하는가?

### 4.2 간격 (Spacing)
- [ ] 간격이 `theme.spacing` 값 또는 4px 배수로 설정되었는가?
- [ ] 일관된 패딩/마진 패턴을 사용하는가?

### 4.3 타이포그래피
- [ ] 폰트 크기가 `theme.fonts.size` 값과 일치하는가?
- [ ] 폰트 굵기가 `theme.fonts.weight` 값과 일치하는가?
- [ ] 제목(h1-h4) 스타일이 일관된가?

### 4.4 컴포넌트 재사용
- [ ] 기존 `Button` 컴포넌트를 사용할 수 있는가?
- [ ] 기존 `Card` 컴포넌트를 사용할 수 있는가?
- [ ] 기존 `Modal` 컴포넌트를 사용할 수 있는가?
- [ ] 새로운 컴포넌트를 만들기 전에 기존 컴포넌트를 확장할 수 있는가?

### 4.5 레이아웃
- [ ] 데스크탑 기준 (1920px)으로 설계되었는가?
- [ ] `max-width: 1600px`, `margin: 0 auto` 패턴을 사용하는가?
- [ ] Grid/Flex 레이아웃이 적절히 사용되었는가?

### 4.6 애니메이션
- [ ] 기존 애니메이션 패턴(framer-motion)을 따르는가?
- [ ] Transition 시간이 `theme.transitions` 값과 일치하는가?

---

## 5. Figma 디자인 분석 방법

### 5.1 디자인 요소 추출 체크리스트

Figma 디자인을 분석할 때 다음 정보를 수집하세요:

#### 색상
- [ ] 배경색 (Background)
- [ ] 텍스트 색상 (Primary, Secondary, Muted)
- [ ] 버튼 색상 (Primary, Secondary, Destructive)
- [ ] 테두리 색상 (Border)
- [ ] 상태 색상 (Success, Warning, Error)

#### 간격
- [ ] 컨테이너 패딩
- [ ] 요소 간 간격 (Gap)
- [ ] 섹션 간 마진

#### 타이포그래피
- [ ] 제목 크기 및 굵기
- [ ] 본문 텍스트 크기
- [ ] 라벨 텍스트 크기

#### 컴포넌트
- [ ] 사용된 버튼 스타일 및 크기
- [ ] 카드/컨테이너 스타일
- [ ] 입력 필드 스타일
- [ ] 모달/팝오버 스타일

#### 레이아웃
- [ ] 그리드 컬럼 수
- [ ] Flex 방향 및 정렬
- [ ] 반응형 브레이크포인트

### 5.2 기존 컴포넌트 매핑

Figma 디자인에서 발견한 요소를 기존 컴포넌트와 매핑:

| Figma 요소 | 기존 컴포넌트 | 위치 |
|-----------|-------------|------|
| 버튼 | `Button` | `src/app/components/ui/button.jsx` |
| 카드 | `Card` | `src/app/components/ui/card.jsx` |
| 입력 필드 | `Input` | `src/app/components/ui/input.jsx` |
| 모달 | `Modal` | `src/components/common/Modal/` |
| 헤더 | `Header` | `src/components/layout/Header/` |
| 풀페이지 레이아웃 | `FullPageLayout` | `src/components/layout/FullPageLayout/` |

### 5.3 스타일 변환 가이드

Figma 값 → 코드 값 변환:

#### 색상
- Figma Hex 값 → `theme.css`의 CSS 변수 또는 `theme.js`의 색상 객체
- 예: `#3F4A5A` → `var(--primary)` 또는 `theme.colors.primary[600]`

#### 간격
- Figma 픽셀 값 → `theme.spacing` 값 (4px 배수로 반올림)
- 예: `16px` → `theme.spacing[4]` 또는 `1rem`

#### 폰트 크기
- Figma 픽셀 값 → `theme.fonts.size` 값
- 예: `20px` → `theme.fonts.size.xl` 또는 `1.25rem`

#### Border Radius
- Figma 픽셀 값 → `theme.borderRadius` 값
- 예: `12px` → `theme.borderRadius.xl` 또는 `var(--radius)`

---

## 6. 작업 프로세스

### 6.1 Figma 디자인 분석 단계

1. **스크린샷 캡처**
   - 전체 페이지 스크린샷
   - 주요 컴포넌트별 상세 스크린샷
   - 색상, 간격, 폰트 정보가 보이는 스크린샷

2. **디자인 요소 추출**
   - 색상 팔레트 정리
   - 간격 값 정리
   - 타이포그래피 스펙 정리
   - 컴포넌트 목록 정리

3. **기존 코드 비교**
   - 재사용 가능한 컴포넌트 식별
   - 스타일 차이점 파악
   - 수정이 필요한 부분 식별

### 6.2 구현 단계

1. **컴포넌트 재사용 우선**
   - 기존 컴포넌트를 최대한 활용
   - Props를 통해 스타일 커스터마이징

2. **스타일 조정**
   - `theme.js` 또는 `theme.css` 값 사용
   - 필요한 경우 컴포넌트별 스타일 오버라이드

3. **새 컴포넌트 생성 (필요시)**
   - 기존 컴포넌트로 해결 불가능한 경우에만 생성
   - 기존 패턴을 따르도록 구현

4. **일관성 검증**
   - 체크리스트를 통해 일관성 확인
   - 다른 페이지와 비교하여 통일성 확인

---

## 7. 참고 자료

- **리팩토링 가이드**: `GUIDE/REFACTORING_GUIDE.md`
- **코딩 컨벤션**: `guidelines/Guidelines.md`
- **테마 파일**: `src/styles/theme.js`, `src/styles/theme.css`
- **스타일 가이드 페이지**: `src/pages/MasterStyleGuide/MasterStyleGuidePage.jsx` (개발 중)

---

## 8. 주의사항

### 8.1 하지 말아야 할 것

- ❌ 기존 컴포넌트를 무시하고 새로 만들기
- ❌ 하드코딩된 색상 값 사용 (CSS 변수나 테마 값 사용)
- ❌ 일관성 없는 간격 값 사용
- ❌ 로직과 스타일을 한 파일에 섞기

### 8.2 반드시 해야 할 것

- ✅ 기존 컴포넌트 재사용 우선
- ✅ CSS 변수(`var(--*)`) 또는 테마 객체 사용
- ✅ `theme.spacing`, `theme.fonts.size` 등 테마 값 사용
- ✅ 로직(`.jsx`)과 스타일(`.styled.js`) 분리
- ✅ 컴포넌트는 PascalCase, 함수/변수는 camelCase 네이밍

---

**마지막 업데이트**: 2026-01-26
