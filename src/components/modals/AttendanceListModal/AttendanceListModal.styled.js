import styled from 'styled-components';

export const SearchContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: rgba(31, 35, 40, 0.4);
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
  background-color: #FAFAFA;
  border-radius: 8px;
  border: 1px solid #DADDE1;
  transition: all 0.2s;

  &:hover {
    border-color: #6E8FB3;
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
  color: #1F2328;
`;

export const AttendanceDate = styled.p`
  font-size: 14px;
  color: rgba(31, 35, 40, 0.6);
  margin: 0;
`;

export const StatsContainer = styled.div`
  background-color: #FAFAFA;
  border: 1px solid #DADDE1;
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
  color: #1F2328;
  margin: 0;
`;

export const StatLabel = styled.p`
  font-size: 12px;
  color: rgba(31, 35, 40, 0.6);
  margin: 0;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 32px 0;
  color: rgba(31, 35, 40, 0.6);
`;
