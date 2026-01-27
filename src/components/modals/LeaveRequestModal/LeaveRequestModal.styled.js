import styled from 'styled-components';

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const ModalContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export const TabButton = styled.button`
  padding: 10px 24px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;

  ${({ $isActive }) =>
    $isActive
      ? `
    background-color: var(--primary);
    color: var(--primary-foreground);
  `
      : `
    background-color: var(--muted);
    color: var(--muted-foreground);

    &:hover {
      background-color: var(--border);
    }
  `}
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

export const DaysInfo = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const DropdownButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background-color: var(--card);
  color: var(--foreground);
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: var(--muted-foreground);
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  z-index: 50;
  width: 100%;
  margin-top: 4px;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-height: 240px;
  overflow: auto;
`;

export const DropdownItem = styled.button`
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  transition: all 0.2s;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--foreground);

  ${({ $isSelected }) =>
    $isSelected
      ? `
    background-color: var(--primary);
    color: var(--primary-foreground);
  `
      : `
    &:hover {
      background-color: var(--muted);
    }
  `}
`;

export const FileUploadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FileUploadHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: var(--muted);
  border: 1px solid var(--border);
  border-radius: 6px;
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: var(--muted-foreground);
`;

export const InfoBullet = styled.span`
  color: var(--muted-foreground);
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
`;
