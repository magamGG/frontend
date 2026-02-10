import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (Admin 건강관리와 동일)
export const UnscreenedDetailRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: #DADDE1;
  overflow-y: auto;
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
  height: 36px;
  width: 36px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5a6067;
  transition: color 0.2s;

  &:hover {
    color: #1f2328;
  }
`;

export const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

export const BulkAlarmButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #EF4444;
  color: white;
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;

  &:hover {
    background-color: #DC2626;
  }
`;

// 통계 그리드 (데스크탑: 3열, Admin 건강관리 카드와 동일 톤)
export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const StatisticsCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StatisticsLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #6E8FB3;
  margin: 0;
`;

export const StatisticsValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => {
    switch (props.$color) {
      case 'red':
        return '#EF4444';
      case 'purple':
        return '#9333EA';
      case 'blue':
        return '#2563EB';
      default:
        return '#1f2328';
    }
  }};
`;

// 필터 카드 (Admin 건강관리 카드와 동일)
export const FilterCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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
  font-size: 14px;
  font-weight: 500;
  padding: 0 16px;
  border-radius: 8px;
  transition: background-color 0.15s, color 0.15s;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  background-color: ${props => props.$variant === 'default' ? '#6E8FB3' : 'white'};
  color: ${props => props.$variant === 'default' ? 'white' : '#5a6067'};

  &:hover {
    background-color: ${props => props.$variant === 'default' ? '#5a7a9e' : '#f1f5f9'};
  }
`;

// 데이터 테이블 카드 (Admin 건강관리 카드와 동일)
export const DataTableCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  border-bottom: 1px solid #e2e8f0;
`;

export const TableHeaderRow = styled.tr``;

export const TableHeaderCell = styled.th`
  text-align: ${props => props.$align || 'left'};
  font-size: 12px;
  font-weight: 500;
  color: #6E8FB3;
  padding: 10px 16px 10px 0;

  &:first-child {
    padding-left: 0;
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

export const TableCell = styled.td`
  padding: 12px 16px 12px 0;
  font-size: 14px;
  color: ${props => props.$fontWeight === 'medium' ? '#1f2328' : '#5a6067'};
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
  border-radius: 6px;
  font-weight: 500;
`;

export const DelayBadge = styled.span`
  display: inline-block;
  background-color: #EF4444;
  color: white;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 500;
`;

export const AlarmButton = styled.button`
  height: 28px;
  padding: 0 12px;
  background-color: #EF4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: #DC2626;
  }
`;

// 빈 상태
export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
  font-size: 14px;
  color: #6E8FB3;
`;
