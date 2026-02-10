import styled from 'styled-components';

export const SearchContainer = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 98%;
  margin: 0 auto;
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--muted-foreground);
  opacity: 0.6;
`;

export const AttendanceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
`;

export const AttendanceItem = styled.div`
  padding: 16px;
  background-color: var(--card);
  border-radius: 8px;
  border: 1px solid var(--border);
  transition: all 0.2s;

  &:hover {
    border-color: var(--accent);
  }
`;

export const AttendanceHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const AttendanceNameGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AttendanceName = styled.span`
  font-weight: 500;
  color: var(--foreground);
`;

export const AttendanceDate = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const StatsContainer = styled.div`
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  flex-shrink: 0;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  text-align: center;
`;

export const StatItem = styled.div``;

export const StatValue = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: var(--foreground);
  margin: 0;
`;

export const StatLabel = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 32px 0;
  color: var(--muted-foreground);
`;
