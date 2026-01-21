import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
  overflow-y: auto;
`;

export const ModalCard = styled.div`
  width: 100%;
  background-color: white;
  margin: 32px 0;
  border-radius: 8px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  ${({ $maxWidth }) => {
    const maxWidthMap = {
      sm: '448px',
      md: '512px',
      lg: '576px',
      xl: '640px',
      '2xl': '672px',
      '3xl': '768px',
      '4xl': '896px',
      '5xl': '1024px',
      '6xl': '1152px',
    };
    return `max-width: ${maxWidthMap[$maxWidth] || maxWidthMap.md};`;
  }}
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border);
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: var(--foreground);
  margin: 0;
`;

export const ModalBody = styled.div`
  padding: 16px;
`;
