import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${props => props.theme.fonts.family.base};
    font-size: ${props => props.theme.fonts.size.base};
    font-weight: ${props => props.theme.fonts.weight.normal};
    line-height: ${props => props.theme.fonts.lineHeight.normal};
    color: ${props => props.theme.colors.text.primary};
    background-color: ${props => props.theme.colors.background.main};
    min-height: 100vh;
  }

  /* 스크롤바 스타일링 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.gray[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.gray[300]};
    border-radius: ${props => props.theme.borderRadius.full};
    
    &:hover {
      background: ${props => props.theme.colors.gray[400]};
    }
  }

  /* 링크 기본 스타일 */
  a {
    color: inherit;
    text-decoration: none;
    transition: ${props => props.theme.transitions.fast};
  }

  /* 버튼 기본 스타일 */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    transition: ${props => props.theme.transitions.fast};
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* 입력 필드 기본 스타일 */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
  }

  /* 리스트 기본 스타일 */
  ul, ol {
    list-style: none;
  }

  /* 이미지 기본 스타일 */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* 접근성 - 화면 리더 전용 텍스트 */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Focus 스타일 */
  *:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }

  /* Selection 스타일 */
  ::selection {
    background-color: ${props => props.theme.colors.primary[100]};
    color: ${props => props.theme.colors.primary[900]};
  }
`;

export default GlobalStyle;
