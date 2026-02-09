import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AdminHealthRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: #DADDE1;
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AdminHealthBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 다음 검진 예정일 카드
export const NextCheckupCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const NextCheckupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const NextCheckupTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

export const NextCheckupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const CheckupItem = styled.div`
  padding: 16px;
  background: linear-gradient(to bottom right, ${props => {
    if (props.$bgColor === 'from-purple-50 to-purple-100/50') return '#F3E8FF, rgba(243, 232, 255, 0.5)';
    if (props.$bgColor === 'from-blue-50 to-blue-100/50') return '#DBEAFE, rgba(219, 234, 254, 0.5)';
    return '#F9FAFB, rgba(249, 250, 251, 0.5)';
  }});
  border-radius: 8px;
  border: 1px solid ${props => {
    if (props.$borderColor === 'border-purple-200') return '#E9D5FF';
    if (props.$borderColor === 'border-blue-200') return '#BFDBFE';
    return '#E5E7EB';
  }};
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

// 심층 검진 검사 그리드
export const DeepCheckupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

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

export const DeepCheckupCardHeader = styled.div`
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

export const DeepCheckupCardTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

export const DeepCheckupCardIcon = styled.div`
  color: ${props => props.$color || '#6E8FB3'};
`;

// 진행 상황 섹션
export const ProgressSection = styled.div`
  margin-bottom: 16px;
`;

export const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const ProgressLabel = styled.span`
  font-size: 14px;
  color: #6E8FB3;
`;

export const ProgressValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #1f2328;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #DADDE1;
  border-radius: 9999px;
  margin-bottom: 4px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  width: ${props => props.$width || 0}%;
  background-color: ${props => props.$bgColor || '#6E8FB3'};
  border-radius: 9999px;
  transition: width 0.3s;
`;

export const ProgressMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #6E8FB3;
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

// 통계 그리드 (2x2)
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 위험 카드
export const RiskCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const RiskCardHeader = styled.div`
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

export const RiskCardTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

export const RiskCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

export const RiskBox = styled.div`
  padding: 12px;
  background-color: #fafafa;
  border-radius: 8px;
`;

export const RiskBoxHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const RiskBoxBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: ${props => props.$bgColor || '#F3F4F6'};
  color: ${props => props.$color || '#6B7280'};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

export const RiskBoxValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.$color || '#1f2328'};
  margin-bottom: 4px;
`;

export const RiskBoxLabel = styled.div`
  font-size: 10px;
  color: #6E8FB3;
  margin-bottom: 4px;
`;

export const RiskBoxDetails = styled.div`
  font-size: 12px;
  color: #6E8FB3;
`;

export const RiskBoxDetailRow = styled.div`
  margin-bottom: 2px;
`;

export const RiskBoxFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #DADDE1;
  font-size: 11px;
`;

// 인원 분포 카드
export const DistributionCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const DistributionCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const DistributionCardTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

export const DistributionCardSubtitle = styled.span`
  font-size: 12px;
  color: #6E8FB3;
`;

export const DistributionChart = styled.div`
  height: 200px;
  margin-bottom: 16px;
`;

export const DistributionLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const DistributionLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DistributionLegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
`;

export const DistributionLegendLabel = styled.span`
  font-size: 12px;
  color: #6E8FB3;
`;

export const DistributionLegendValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #1f2328;
`;

// 검진 모니터링 도넛 카드용 (정신/신체 탭 + 도넛 + 범례)
export const MonitoringTabWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid var(--border, #e2e8f0);
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
    border-right: 1px solid var(--border, #e2e8f0);
  }
  &:hover:not(:disabled) {
    background-color: ${props => props.$active ? '#5a7a9e' : '#f1f5f9'};
  }
`;

export const MonitoringChartContainer = styled.div`
  flex-shrink: 0;
`;

export const HealthLegendContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const HealthLegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HealthLegendColor = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background-color: ${props => props.$color};
  margin-right: 6px;
`;

export const HealthLegendLabel = styled.span`
  font-size: 0.75rem;
  color: #6E8FB3;
  flex: 1;
`;

export const HealthLegendValue = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #1f2328;
`;

export const MonitoringFooter = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
`;

// 검진 모니터링 카드
export const MonitoringCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const MonitoringCardHeader = styled.div`
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

export const MonitoringTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const MonitoringTableHeader = styled.tr`
  border-bottom: 1px solid #DADDE1;
  
  th {
    text-align: left;
    font-size: 10px;
    font-weight: 500;
    color: #6E8FB3;
    padding-bottom: 8px;
    padding-right: 8px;
    
    &:first-child {
      padding-left: 0;
    }
    
    &:last-child {
      text-align: right;
      padding-left: 8px;
      padding-right: 0;
    }
  }
`;

export const MonitoringTableRow = styled.tr`
  border-bottom: 1px solid #DADDE1;
`;

export const MonitoringTableCell = styled.td`
  padding: 10px 8px 10px 0;
  font-size: 14px;
  color: #1f2328;
  
  &:first-child {
    padding-left: 0;
  }
  
  &:last-child {
    padding-right: 0;
    text-align: right;
    font-size: 12px;
    color: #6E8FB3;
  }
  
  &:nth-child(2) {
    font-size: 12px;
    color: #6E8FB3;
  }
`;

// 미검진 인원 카드
export const UnscreenedCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const UnscreenedCardHeader = styled.div`
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

export const UnscreenedCardTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1f2328;
  margin: 0 0 4px 0;
`;

export const UnscreenedCardSubtitle = styled.p`
  font-size: 12px;
  color: #6E8FB3;
  margin: 0;
`;

export const UnscreenedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const UnscreenedListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fafafa;
  }
`;

export const UnscreenedListItemAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const UnscreenedListItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const UnscreenedListItemName = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #1f2328;
  margin: 0 0 2px 0;
`;

export const UnscreenedListItemTeam = styled.p`
  font-size: 12px;
  color: #6B7280;
  margin: 0;
`;

export const UnscreenedListItemBadge = styled.div`
  background-color: #DC2626;
  color: white;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 9999px;
  flex-shrink: 0;
`;
