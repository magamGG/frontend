import { css } from 'styled-components';

// Flexbox 레이아웃
export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const flexBetween = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

export const flexColumnCenter = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// 텍스트 처리
export const truncate = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const lineClamp = (lines) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// 버튼 스타일
export const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.medium};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: ${props => props.theme.transitions.fast};
  cursor: pointer;
  border: none;
  outline: none;
  white-space: nowrap;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const buttonPrimary = css`
  ${buttonBase}
  background: linear-gradient(135deg, ${props => props.theme.colors.primary[500]}, ${props => props.theme.colors.primary[600]});
  color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows.sm};
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, ${props => props.theme.colors.primary[600]}, ${props => props.theme.colors.primary[700]});
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const buttonSecondary = css`
  ${buttonBase}
  background: ${props => props.theme.colors.gray[100]};
  color: ${props => props.theme.colors.text.primary};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.gray[200]};
  }
`;

export const buttonOutline = css`
  ${buttonBase}
  background: transparent;
  color: ${props => props.theme.colors.primary[600]};
  border: 1px solid ${props => props.theme.colors.primary[600]};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[50]};
  }
`;

export const buttonGhost = css`
  ${buttonBase}
  background: transparent;
  color: ${props => props.theme.colors.text.secondary};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.text.primary};
  }
`;

// 입력 필드 스타일
export const inputBase = css`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.text.primary};
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.border.main};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: ${props => props.theme.transitions.fast};
  
  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }
  
  &:focus {
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

// 카드 스타일
export const card = css`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.border.main};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[6]};
  box-shadow: ${props => props.theme.shadows.sm};
`;

export const cardHover = css`
  ${card}
  transition: ${props => props.theme.transitions.base};
  cursor: pointer;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    transform: translateY(-2px);
    border-color: ${props => props.theme.colors.primary[200]};
  }
`;

// 애니메이션
export const fadeIn = css`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  animation: fadeIn ${props => props.theme.transitions.base};
`;

export const slideUp = css`
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  animation: slideUp ${props => props.theme.transitions.base};
`;

export const slideDown = css`
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  animation: slideDown ${props => props.theme.transitions.base};
`;

// 레이아웃
export const container = css`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: 0 ${props => props.theme.spacing[6]};
  }
`;

// 스켈레톤 로딩
export const skeletonLoading = css`
  @keyframes shimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }
  
  background: linear-gradient(
    to right,
    ${props => props.theme.colors.gray[200]} 0%,
    ${props => props.theme.colors.gray[100]} 20%,
    ${props => props.theme.colors.gray[200]} 40%,
    ${props => props.theme.colors.gray[200]} 100%
  );
  background-size: 800px 104px;
  animation: shimmer 1.5s infinite linear;
`;

// 반응형 미디어 쿼리 헬퍼
export const media = {
  xs: (styles) => css`
    @media (min-width: ${props => props.theme.breakpoints.xs}) {
      ${styles}
    }
  `,
  sm: (styles) => css`
    @media (min-width: ${props => props.theme.breakpoints.sm}) {
      ${styles}
    }
  `,
  md: (styles) => css`
    @media (min-width: ${props => props.theme.breakpoints.md}) {
      ${styles}
    }
  `,
  lg: (styles) => css`
    @media (min-width: ${props => props.theme.breakpoints.lg}) {
      ${styles}
    }
  `,
  xl: (styles) => css`
    @media (min-width: ${props => props.theme.breakpoints.xl}) {
      ${styles}
    }
  `,
};
