import styled from 'styled-components';

// 전체 로그인 페이지 루트 (1920px 데스크탑 기준)
export const LoginRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow-y: auto;
  padding: 32px;
`;

// 배경 패턴
export const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.05;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 35px,
      currentColor 35px,
      currentColor 36px
    );
  }
`;

// 로그인 컨테이너 (중앙 정렬, 최대 폭 설정)
export const LoginContainer = styled.div`
  width: 100% !important;
  max-width: 920px !important;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 10;
`;

// 로고 및 타이틀 영역
export const LogoTitleSection = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

// 로고 아이콘 래퍼
export const LogoIconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: var(--primary);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  margin-bottom: 24px;
`;

// 메인 타이틀
export const MainTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

// 서브 타이틀
export const SubTitle = styled.p`
  color: var(--muted-foreground);
  margin: 0;
`;

// 로그인 카드
export const LoginCard = styled.div`
  width: 100% !important;
  padding: 48px;
  box-sizing: border-box;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  background-color: var(--card);
`;

// 폼 영역
export const FormSection = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

// 입력 필드 그룹
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

// 라벨
export const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

// 입력 필드 래퍼 (아이콘 포함)
export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

// 입력 필드
export const InputField = styled.input`
  width: 100% !important;
  padding: 12px 16px 12px 44px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--foreground);
  font-size: 14px;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    ring: 2px;
    ring-color: var(--primary);
    border-color: transparent;
  }

  &::placeholder {
    color: var(--muted-foreground);
  }
`;

// 아이콘 (입력 필드 내부)
export const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--muted-foreground);
`;

// 체크박스 및 링크 영역
export const CheckboxLinkGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
`;

// 체크박스 라벨
export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--muted-foreground);
`;

// 링크 버튼
export const LinkButton = styled.button`
  color: var(--primary);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`;

// 구분선
export const Divider = styled.div`
  position: relative;
  margin: 8px 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    border-top: 1px solid var(--border);
  }
`;

// 구분선 텍스트
export const DividerText = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  font-size: 14px;
  padding: 0 16px;
  background-color: var(--card);
  color: var(--muted-foreground);
`;

// 데모 계정 버튼 그룹
export const DemoAccountGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

// 데모 계정 버튼
export const DemoAccountButton = styled.button`
  width: 100% !important;
  padding: 12px;
  border: 2px solid ${props => props.$borderColor || 'var(--border)'};
  border-radius: 8px;
  background-color: ${props => props.$bgColor || 'transparent'};
  color: var(--foreground);
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  box-sizing: border-box;

  &:hover {
    background-color: ${props => props.$hoverBgColor || 'var(--muted)'};
    border-color: ${props => props.$hoverBorderColor || props.$borderColor || 'var(--border)'};
  }
`;

// 데모 계정 버튼 텍스트 영역
export const DemoAccountTextArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

// 데모 계정 이메일
export const DemoAccountEmail = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
`;

// 푸터
export const Footer = styled.p`
  text-align: center;
  font-size: 14px;
  color: var(--muted-foreground);
  margin-top: 16px;
`;
