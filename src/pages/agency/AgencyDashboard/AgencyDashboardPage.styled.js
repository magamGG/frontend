import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AgencyDashboardRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: #DADDE1;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AgencyDashboardBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 메트릭 카드 그리드
export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div`
  padding: 20px;
  background-color: ${props => props.$bgColor || 'white'};
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const MetricCardContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const MetricLabel = styled.p`
  font-size: 14px;
  color: #5a6067;
  margin: 0 0 8px 0;
`;

export const MetricValue = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #1f2328;
  margin: 0 0 4px 0;
`;

export const MetricChange = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$color || 'var(--accent)'};
  margin: 0;
`;

export const MetricIcon = styled.div`
  padding: 12px;
  background-color: ${props => props.$bgColor || '#F3F4F6'};
  border-radius: 8px;
  color: ${props => props.$color || 'var(--accent)'};
`;

// 차트 그리드
export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartCard = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const ChartCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const ChartCardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ChartCardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2328;
  margin: 0;
`;

export const ChartContainer = styled.div`
  margin-bottom: 16px;
`;

export const ChartAlert = styled.div`
  padding: 12px;
  background-color: ${props => props.$bgColor || '#F9FAFB'};
  border: 1px solid ${props => props.$borderColor || '#E5E7EB'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ChartAlertIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ChartAlertText = styled.p`
  font-size: 14px;
  color: ${props => props.$color || 'var(--foreground)'};
  margin: 0;
`;

// 파이 차트 섹션
export const PieChartSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const PieChartContainer = styled.div`
  flex: 1;
`;

export const PieChartLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PieChartLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PieChartLegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
`;

export const PieChartLegendLabel = styled.span`
  font-size: 14px;
  color: #5a6067;
`;

export const PieChartLegendValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1f2328;
  margin-left: auto;
`;

export const PieChartFooter = styled.div`
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PieChartFooterLabel = styled.span`
  font-size: 14px;
  color: #5a6067;
`;

export const PieChartFooterValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #1f2328;
`;

// 경고 박스
export const WarningBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: color-mix(in srgb, #fbbf24 20%, transparent);
  border: 1px solid color-mix(in srgb, #fbbf24 40%, transparent);
  border-radius: 8px;
`;

export const WarningContent = styled.div`
  flex: 1;
`;

export const WarningTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin: 0 0 4px 0;
`;

export const WarningDescription = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 8px;
  justify-content: flex-end;
`;
