import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const MonitoringDetailRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  background-color: #DADDE1;
  padding: 24px;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const MonitoringDetailBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 헤더 영역
export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const BackButton = styled.button`
  height: 32px;
  width: 32px;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1F2328;
  margin: 0;
`;

// 정신/신체 토글
export const DetailTabWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  padding: 2px;
  background-color: #e8eaed;
`;

export const DetailTabButton = styled.button`
  padding: 6px 14px;
  font-size: 0.8125rem;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#1f2328' : '#6E8FB3'};
  box-shadow: ${props => props.$active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'};
  transition: all 0.2s ease;

  &:hover {
    color: #1f2328;
  }
`;

// 통계 그리드 (데스크탑: 4열)
export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 32px;
  margin-bottom: 8px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const StatisticsCard = styled.div`
  padding: 16px;
  background-color: white;
  border: ${props => props.$hasBorder ? '1px solid #e2e8f0' : 'none'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  min-height: 80px;
`;

export const StatisticsIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${props => {
    switch (props.$color) {
      case 'red':
        return '#dc2626';
      case 'orange':
        return '#ea580c';
      default:
        return '#6E8FB3';
    }
  }};
`;

export const StatisticsLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => {
    switch (props.$color) {
      case 'red':
        return '#dc2626';
      case 'orange':
        return '#ea580c';
      case 'green':
        return '#5a6067';
      default:
        return '#6E8FB3';
    }
  }};
  line-height: 1.2;
  margin-bottom: 8px;
  text-align: left;
  width: 100%;
`;

export const StatisticsValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => {
    switch (props.$color) {
      case 'red':
        return '#dc2626';
      case 'orange':
        return '#ea580c';
      case 'green':
        return '#16a34a';
      default:
        return '#1F2328';
    }
  }};
  line-height: 1.2;
  text-align: left;
  width: 100%;
`;

// 필터 카드
export const FilterCard = styled.div`
  padding: 16px;
  background-color: white;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

export const FilterSearchContainer = styled.div`
  flex: 1;
  position: relative;
`;

export const FilterSearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  pointer-events: none;
`;

export const FilterButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const FilterButton = styled.button`
  height: 36px;
  font-size: 0.875rem;
  padding: 0 16px;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  background-color: ${props => props.$variant === 'default' ? '#3F4A5A' : '#e8eaed'};
  color: ${props => props.$variant === 'default' ? 'white' : '#1f2328'};
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background-color: ${props => props.$variant === 'default' ? '#3F4A5A' : '#d4d8dc'};
  }
`;

// 데이터 테이블 카드
export const DataTableCard = styled.div`
  padding: 20px;
  background-color: white;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
`;

export const TableHead = styled.thead`
  border-bottom: 1px solid #DADDE1;
`;

export const TableHeaderRow = styled.tr``;

export const TableHeaderCell = styled.th`
  text-align: ${props => props.$align || 'left'};
  font-size: 0.75rem;
  font-weight: 500;
  color: #6E8FB3;
  padding-bottom: 12px;
  padding-right: 16px;
  padding-left: 16px;

  &:first-child {
    padding-left: 0;
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid #DADDE1;
  transition: background-color 0.2s;

  &:hover {
    background-color: #FAFAFA;
  }
`;

export const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 0.875rem;
  color: ${props => props.$fontWeight === 'medium' ? '#1F2328' : '#6E8FB3'};
  font-weight: ${props => props.$fontWeight === 'medium' ? '500' : 'normal'};
  text-align: ${props => props.$align || 'left'};

  &:first-child {
    padding-left: 0;
  }
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 4px;
`;

// 빈 상태
export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
`;
