# 🎯 Figma 디자인 구현 프롬프트 예시

> **사용 시나리오**: Figma 디자인 스크린샷을 첨부하고, Cursor AI에게 디자인을 코드로 구현하도록 요청할 때 사용하는 프롬프트 템플릿

---

## 📝 프롬프트 예시

```
나는 10년차 풀스택 개발자로서, Figma로 디자인한 프로젝트를 React로 구현하고 있습니다. 
현재 프로젝트에는 이미 많은 컴포넌트와 스타일 시스템이 구축되어 있어서, 새로운 디자인을 
구현할 때 기존 컴포넌트와 스타일을 최대한 재사용하여 일관성을 유지해야 합니다.

아래에 첨부한 스크린샷은 Figma에서 디자인한 새로운 페이지/컴포넌트입니다. 
이 디자인을 구현할 때 다음 사항을 반드시 준수해주세요:

## 1. 프로젝트 구조 및 아키텍처

- 모든 컴포넌트는 `src/components/` 또는 `src/pages/` 디렉토리에 위치해야 합니다
- 로직과 스타일은 반드시 분리: `[ComponentName].jsx` (로직) + `[ComponentName].styled.js` (스타일)
- 페이지 컴포넌트는 `src/pages/[PageName]/` 구조를 따릅니다
- 공통 컴포넌트는 `src/components/common/` 또는 `src/components/layout/`에 위치합니다

## 2. 기존 컴포넌트 재사용 우선

다음 컴포넌트들이 이미 프로젝트에 존재하므로, 가능한 한 재사용해주세요:

### Layout 컴포넌트
- `FullPageLayout`: 풀페이지 섹션 기반 레이아웃 (하단 Dock 네비게이션 포함)
  - 위치: `src/components/layout/FullPageLayout/`
  - 섹션별 전환 애니메이션, 헤더 자동 숨김/표시 기능 포함
  
- `Header`: 상단 고정 헤더
  - 위치: `src/components/layout/Header/`
  - 로고, 현재 페이지 제목, 알림, 프로필 버튼 포함
  - 반투명 배경 (backdrop-filter) 적용

- `MainLayout`: 사이드바 + 메인 콘텐츠 레이아웃
  - 위치: `src/components/layout/MainLayout/`

### Common 컴포넌트
- `Modal`: 범용 모달 컴포넌트
  - 위치: `src/components/common/Modal/`
  - Props: `isOpen`, `onClose`, `title`, `maxWidth`, `showCloseButton`
  - 모든 모달 UI에 사용 가능

### UI 라이브러리 컴포넌트
- `Button`: 버튼 컴포넌트
  - 위치: `src/app/components/ui/button.jsx`
  - Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
  - Sizes: `default`, `sm`, `lg`, `icon`
  - 모든 버튼에 사용

- `Card`: 카드 컴포넌트
  - 위치: `src/app/components/ui/card.jsx`
  - Sub-components: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction`
  - 카드 형태의 컨테이너에 사용

- `Input`: 입력 필드 컴포넌트
  - 위치: `src/app/components/ui/input.jsx`
  - 모든 입력 필드에 사용

## 3. 스타일 시스템 준수

### 색상
- **절대 하드코딩 금지**: 모든 색상은 CSS 변수 또는 테마 객체를 사용해야 합니다
- CSS 변수 사용: `var(--primary)`, `var(--background)`, `var(--foreground)`, `var(--border)` 등
- 테마 객체 사용: `theme.colors.primary[600]`, `theme.colors.gray[500]` 등
- 상태 색상: `var(--status-serialization)`, `var(--status-deadline)` 등

### 간격 (Spacing)
- `theme.spacing` 값 사용: `theme.spacing[4]` (16px), `theme.spacing[6]` (24px) 등
- 또는 4px 배수로 설정: `1rem` (16px), `1.5rem` (24px) 등
- 일관된 패딩/마진 패턴 유지

### 타이포그래피
- 폰트 크기: `theme.fonts.size.xl` (20px), `theme.fonts.size.lg` (18px) 등
- 폰트 굵기: `theme.fonts.weight.medium` (500), `theme.fonts.weight.semibold` (600) 등
- 제목 스타일 일관성 유지

### Border Radius
- `var(--radius)` (0.75rem) 또는 `theme.borderRadius.lg` (8px) 등 사용
- 카드: `var(--radius)` 또는 `8px`
- 버튼: `8px`

### 그림자
- 카드: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- 모달: `0 25px 50px -12px rgba(0, 0, 0, 0.25)`

## 4. 디자인 분석 및 구현 요청

첨부한 스크린샷을 분석하여:

1. **기존 컴포넌트 매핑**
   - 디자인에 사용된 각 요소가 기존 컴포넌트로 구현 가능한지 확인
   - 버튼, 카드, 입력 필드, 모달 등은 반드시 기존 컴포넌트 사용

2. **색상 팔레트 추출**
   - Figma 디자인의 색상을 CSS 변수 또는 테마 값으로 변환
   - 하드코딩된 색상 값 사용 금지

3. **간격 및 레이아웃**
   - 간격 값은 `theme.spacing` 또는 4px 배수로 설정
   - 레이아웃은 Grid 또는 Flex 사용
   - 데스크탑 기준 (1920px)으로 설계, `max-width: 1600px`, `margin: 0 auto` 패턴 사용

4. **타이포그래피**
   - 폰트 크기와 굵기를 테마 값으로 변환
   - 제목(h1-h4) 스타일 일관성 유지

5. **컴포넌트 구조**
   - 재사용 가능한 부분은 별도 컴포넌트로 추출
   - 페이지별로 `[PageName].jsx`와 `[PageName].styled.js` 분리

## 5. 구현 시 주의사항

### 반드시 해야 할 것
- ✅ 기존 컴포넌트 재사용 우선
- ✅ CSS 변수(`var(--*)`) 또는 테마 객체 사용
- ✅ `theme.spacing`, `theme.fonts.size` 등 테마 값 사용
- ✅ 로직(`.jsx`)과 스타일(`.styled.js`) 분리
- ✅ 컴포넌트는 PascalCase, 함수/변수는 camelCase 네이밍
- ✅ styled-components 사용 (Tailwind 클래스 직접 사용 금지)

### 하지 말아야 할 것
- ❌ 기존 컴포넌트를 무시하고 새로 만들기
- ❌ 하드코딩된 색상 값 사용 (#3F4A5A 같은 직접 값)
- ❌ 일관성 없는 간격 값 사용 (임의의 픽셀 값)
- ❌ 로직과 스타일을 한 파일에 섞기
- ❌ Tailwind 클래스를 styled-components와 혼용

## 6. 참고 파일

구현 시 다음 파일들을 참고하세요:
- `GUIDE/FIGMA_DESIGN_SYNC_GUIDE.md`: 상세한 가이드라인
- `GUIDE/REFACTORING_GUIDE.md`: 프로젝트 리팩토링 가이드
- `src/styles/theme.js`: 테마 설정 (색상, 폰트, 간격 등)
- `src/styles/theme.css`: CSS 변수 정의
- `src/components/layout/Header/Header.styled.js`: 헤더 스타일 예시
- `src/components/common/Modal/Modal.styled.js`: 모달 스타일 예시

## 7. 구현 요청

위의 가이드라인을 준수하여 첨부한 스크린샷의 디자인을 구현해주세요. 
구현 시 다음을 포함해주세요:

1. **컴포넌트 파일**: `[ComponentName].jsx` (로직 및 마크업)
2. **스타일 파일**: `[ComponentName].styled.js` (styled-components)
3. **Export 파일**: `index.js` (필요시)

구현 과정에서 기존 컴포넌트를 재사용한 부분과 새로 만든 부분을 명확히 구분해주세요.
또한 Figma 디자인과의 차이점이 있다면 그 이유를 설명해주세요.

---

**참고**: 이 프롬프트는 `GUIDE/FIGMA_DESIGN_SYNC_GUIDE.md`의 내용을 기반으로 작성되었습니다.
```

---

## 📋 사용 방법

1. **스크린샷 준비**
   - Figma에서 구현할 디자인의 스크린샷을 캡처
   - 가능하면 전체 페이지 + 주요 컴포넌트별 상세 스크린샷

2. **프롬프트 복사 및 수정**
   - 위 프롬프트를 복사
   - 필요시 프로젝트 특성에 맞게 수정
   - 스크린샷 첨부

3. **Cursor AI에게 요청**
   - 프롬프트와 스크린샷을 함께 전송
   - 구현 결과 검토 및 피드백

---

## 🎨 프롬프트 커스터마이징 팁

### 특정 컴포넌트에 집중할 때
프롬프트에 다음을 추가:
```
이번 구현에서는 특히 [컴포넌트명]에 집중해주세요.
기존 [관련 컴포넌트명]의 스타일과 구조를 참고하여 일관성을 유지해주세요.
```

### 색상/스타일 변경이 필요한 경우
프롬프트에 다음을 추가:
```
Figma 디자인에서 [색상명]이 [기존 값]과 다르게 [새로운 값]으로 표시되어 있습니다.
이 경우 기존 테마 값을 업데이트할지, 아니면 컴포넌트별로 오버라이드할지 판단해주세요.
```

### 애니메이션이 필요한 경우
프롬프트에 다음을 추가:
```
이 디자인에는 [애니메이션 설명] 애니메이션이 필요합니다.
기존 프로젝트에서 사용하는 framer-motion 패턴을 따르되, 
애니메이션 속도는 theme.transitions 값을 참고해주세요.
```

---

**마지막 업데이트**: 2026-01-26
