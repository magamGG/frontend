import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const MentalHealthDetailRoot = styled.div`
  min-height: 100vh;
  background-color: #DADDE1;
  padding: 32px;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const MentalHealthDetailBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

// 헤더 영역
export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const BackButton = styled.button`
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333333;
  margin: 0;
`;

export const FilterSelect = styled.select`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background-color: white;
  font-size: 0.875rem;
  color: #333333;
  outline: none;
  cursor: pointer;

  &:focus {
    ring: 2px;
    ring-color: #6E8FB3;
  }
`;

// 요약 카드 그리드 (데스크탑: 3열)
export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-bottom: 8px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const SummaryLabel = styled.p`
  font-size: 0.875rem;
  color: #666666;
  margin: 0 0 8px 0;
`;

export const SummaryValue = styled.p`
  font-size: 2.25rem;
  font-weight: bold;
  color: #333333;
  margin: 0 0 16px 0;
`;

export const ProgressBar = styled.div`
  position: relative;
  height: 12px;
  background-color: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  position: absolute;
  inset: 0;
  left: 0;
  border-radius: 9999px;
  width: ${props => props.$width}%;
  background: linear-gradient(90deg, #8E44AD 0%, #A569BD 100%);
`;

export const ProgressText = styled.p`
  font-size: 0.75rem;
  color: #666666;
  margin: 8px 0 0 0;
`;

export const DeadlineBadge = styled.div`
  display: inline-block;
  padding: 4px 12px;
  background-color: #fef2f2;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 9999px;
`;

// 위험군 차트 카드
export const RiskChartCard = styled(SummaryCard)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const RiskChartContainer = styled.div`
  width: 128px;
  height: 128px;
  flex-shrink: 0;
`;

export const RiskLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RiskLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RiskLegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.$color};
`;

export const RiskLegendLabel = styled.span`
  font-size: 0.875rem;
  color: #666666;
  flex: 1;
`;

export const RiskLegendValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #333333;
`;

// 데이터 테이블 카드
export const DataTableCard = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const TableTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #333333;
  margin: 0;
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 256px;
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  pointer-events: none;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
`;

export const TableHead = styled.thead`
  border-bottom: 1px solid #e5e7eb;
`;

export const TableHeaderCell = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #666666;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }
`;

export const TableCell = styled.td`
  padding: 16px;
  font-size: 0.875rem;
  color: ${props => props.$fontWeight === 'medium' ? '#333333' : '#666666'};
  font-weight: ${props => props.$fontWeight === 'medium' ? '500' : 'normal'};
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const RiskBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;
