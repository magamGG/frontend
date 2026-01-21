import styled from 'styled-components';

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background-color: var(--background);
  color: var(--foreground);
  font-size: 14px;
`;

export const DateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

export const InfoBox = styled.div`
  padding: 16px;
  background-color: color-mix(in srgb, var(--muted) 50%, transparent);
  border-radius: 8px;
  border: 1px solid var(--border);
`;

export const InfoText = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 16px;
`;
