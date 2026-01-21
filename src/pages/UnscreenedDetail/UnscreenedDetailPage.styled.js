import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const UnscreenedDetailRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  background-color: #DADDE1;
  padding: 24px;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const UnscreenedDetailBody = styled.div`
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

export const BulkAlarmButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #dc2626;
  color: white;
  height: 36px;
  padding: 0 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b91c1c;
  }
`;

// 통계 그리드 (데스크탑: 3열)
export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 8px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const StatisticsCard = styled.div`
  padding: 16px;
  background-color: white;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

export const StatisticsLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => {
    switch (props.$color) {
      case 'red':
        return '#dc2626';
      case 'purple':
        return '#9333ea';
      case 'blue':
        return '#2563eb';
      default:
        return '#6E8FB3';
    }
  }};
  margin-bottom: 4px;
`;

export const StatisticsValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => {
    switch (props.$color) {
      case 'red':
        return '#dc2626';
      case 'purple':
        return '#9333ea';
      case 'blue':
        return '#2563eb';
      default:
        return '#1F2328';
    }
  }};
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
  font-size: 0.75rem;
  padding: 0 12px;
  border-radius: 4px;
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid var(--border);
  background-color: ${props => props.variant === 'default' ? 'var(--primary)' : 'transparent'};
  color: ${props => props.variant === 'default' ? 'var(--primary-foreground)' : 'var(--foreground)'};

  &:hover {
    opacity: 0.8;
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

export const TypeBadge = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 4px;
`;

export const DelayBadge = styled.span`
  display: inline-block;
  background-color: #fef2f2;
  color: #dc2626;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 4px;
`;

export const AlarmButton = styled.button`
  height: 28px;
  padding: 0 12px;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b91c1c;
  }
`;

// 빈 상태
export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
`;
