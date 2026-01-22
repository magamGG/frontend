import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AgencyHealthRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  background-color: #DADDE1;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AgencyHealthBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 16px;
  padding-bottom: 96px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 검진 예정일 그리드 (데스크탑: 2열)
export const CheckupDateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const CheckupDateCard = styled.div`
  padding: 16px;
  background-color: white;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
`;

export const CheckupDateHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const CheckupDateInfo = styled.div`
  flex: 1;
`;

export const CheckupDateLabel = styled.div`
  font-size: 0.75rem;
  color: #9CA3AF;
  margin-bottom: 4px;
`;

export const CheckupDateValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--foreground);
  margin-bottom: 4px;
`;

export const CheckupDateMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--accent);
`;

// 심층 검사 그리드 (데스크탑: 2열)
export const DeepCheckupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const DeepCheckupCard = styled.div`
  padding: 16px;
  background-color: white;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

export const DeepCheckupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const DeepCheckupTitle = styled.h2`
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--foreground);
  margin: 0;
`;

export const DeepCheckupStatus = styled.div`
  margin-bottom: 12px;
`;

export const DeepCheckupProgressBar = styled.div`
  width: 100%;
  background-color: #E5E7EB;
  border-radius: 9999px;
  height: 6px;
  overflow: hidden;
`;

export const DeepCheckupProgress = styled.div`
  height: 6px;
  border-radius: 9999px;
  transition: all 0.3s;
  ${props => {
    const color = props.$color === 'purple' ? '#9333EA' : '#3B82F6';
    return `
      background-color: ${color};
      width: ${props.$width}%;
    `;
  }}
`;

export const DeepCheckupProgressText = styled.div`
  font-size: 0.75rem;
  color: #9CA3AF;
  margin-top: 4px;
`;

// 점수 분포
export const ScoreDistribution = styled.div`
  margin-top: 12px;
`;

export const ScoreDistributionTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 8px;
`;

export const PieChartContainer = styled.div`
  flex-shrink: 0;
`;

export const LegendContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LegendColor = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background-color: ${props => props.$color};
  margin-right: 6px;
`;

export const LegendLabel = styled.span`
  font-size: 0.75rem;
  color: var(--accent);
  flex: 1;
`;

export const LegendValue = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--foreground);
`;

// 모니터링 그리드 (데스크탑: 2열)
export const MonitoringGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const MonitoringCard = styled.div`
  padding: 16px;
  background-color: white;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

export const MonitoringHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const MonitoringChartContainer = styled.div`
  flex-shrink: 0;
`;

export const MonitoringFooter = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #E5E7EB;
  text-align: center;
`;

// 미검진 인원 카드
export const UnscreenedCard = styled.div`
  padding: 16px;
  background-color: white;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

export const UnscreenedHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const UnscreenedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const UnscreenedItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 8px;
`;

export const UnscreenedAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UnscreenedName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
`;
