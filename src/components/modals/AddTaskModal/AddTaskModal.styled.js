import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  padding: 16px;
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: 672px;
  padding: 24px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  background-color: var(--card);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: var(--foreground);
  margin: 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

export const RequiredMark = styled.span`
  color: var(--destructive);
`;

export const Select = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: 6px;
  border: 2px solid var(--border);
  background-color: var(--background);
  color: var(--foreground);
  font-size: 14px;

  &:focus {
    outline: none;
    ring: 2px;
    ring-color: var(--ring);
  }
`;

export const InfoBox = styled.div`
  padding: 12px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: 8px;
  border: 1px solid var(--border);
`;

export const InfoTitle = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0 0 4px 0;
  font-weight: 600;
`;

export const InfoList = styled.ul`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const InfoListItem = styled.li`
  margin: 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
`;
