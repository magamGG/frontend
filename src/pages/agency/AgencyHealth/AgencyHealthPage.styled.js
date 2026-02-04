import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AgencyHealthRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  background-color: var(--background);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
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

// 헤더 영역
export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  margin-bottom: 8px;
`;

export const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: var(--foreground);
  margin: 0;
`;

export const HeaderSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--muted-foreground);
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
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
  color: var(--muted-foreground);
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

export const CheckupItem = styled.div`
  padding: 20px;
  background: linear-gradient(to bottom right, ${props => {
    if (props.$bgColor === 'from-purple-50 to-purple-100/50') return '#F3E8FF, rgba(243, 232, 255, 0.5)';
    if (props.$bgColor === 'from-blue-50 to-blue-100/50') return '#DBEAFE, rgba(219, 234, 254, 0.5)';
    return '#F9FAFB, rgba(249, 250, 251, 0.5)';
  }});
  border-radius: 12px;
  border: 1px solid ${props => {
    if (props.$borderColor === 'border-purple-200') return '#E9D5FF';
    if (props.$borderColor === 'border-blue-200') return '#BFDBFE';
    return '#E5E7EB';
  }};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const CheckupItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const CheckupItemInfo = styled.div`
  flex: 1;
`;

export const CheckupItemLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$color || '#6E8FB3'};
  margin-bottom: 4px;
`;

export const CheckupItemDate = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1f2328;
`;

export const CheckupItemBadge = styled.div`
  background-color: ${props => props.$bgColor || '#6E8FB3'};
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
`;

export const CheckupItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6E8FB3;
`;

export const CheckupItemMetaIcon = styled.div`
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CheckupItemMetaText = styled.span`
  font-size: 12px;
  color: #6E8FB3;
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
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const DeepCheckupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 20px;
  margin: -20px -20px 16px -20px;
  border-radius: 12px 12px 0 0;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

export const DeepCheckupTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

export const DeepCheckupStatus = styled.div`
  margin-bottom: 12px;
`;

export const DeepCheckupProgressBar = styled.div`
  width: 100%;
  background-color: var(--border);
  border-radius: 9999px;
  height: 6px;
  overflow: hidden;
`;

export const DeepCheckupProgress = styled.div`
  height: 6px;
  border-radius: 9999px;
  transition: all 0.3s;
  ${props => {
    const color = props.$color === 'purple' ? 'var(--status-workation)' : 'var(--chart-2)';
    return `
      background-color: ${color};
      width: ${props.$width}%;
    `;
  }}
`;

export const DeepCheckupProgressText = styled.div`
  font-size: 0.75rem;
  color: #6E8FB3;
  margin-top: 4px;
`;

// 완료 버튼
export const CompletedButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  margin-bottom: 12px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #F0FDF4;
    border-color: #86EFAC;
  }
`;

export const CompletedButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CompletedButtonLabel = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

// 대기 섹션
export const PendingSection = styled.div`
  margin-top: 12px;
`;

export const PendingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const PendingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const PendingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background-color: #FFF7ED;
  border-radius: 8px;
  font-size: 12px;
`;

export const PendingItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PendingItemName = styled.span`
  font-weight: 500;
  color: #1f2328;
`;

export const PendingItemBadge = styled.div`
  background-color: #F97316;
  color: white;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
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

export const MonitoringTabWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
`;

export const MonitoringTabButton = styled.button`
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  background-color: ${props => props.$active ? '#6E8FB3' : 'white'};
  color: ${props => props.$active ? 'white' : '#5a6067'};
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
  &:first-of-type {
    border-right: 1px solid var(--border);
  }
  &:hover:not(:disabled) {
    background-color: ${props => props.$active ? '#5a7a9e' : '#f1f5f9'};
  }
`;

export const MonitoringChartContainer = styled.div`
  flex-shrink: 0;
`;

export const MonitoringFooter = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
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
  background-color: var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UnscreenedName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
`;
