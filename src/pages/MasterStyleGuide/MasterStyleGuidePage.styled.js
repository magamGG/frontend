import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const MasterStyleGuideRoot = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #DADDE1;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const MasterStyleGuideBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px 32px 96px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 헤더 영역
export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1F2328;
  margin: 0;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const HeaderSubtitle = styled.span`
  font-size: 0.875rem;
  color: #6B7280;
`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 9999px;
  background-color: #E5E7EB;
`;

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #3F4A5A;
`;

export const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1F2328;
`;

// 일정 카드 그리드 (데스크탑: 2열)
export const ScheduleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ScheduleCard = styled.div`
  padding: 24px;
  border-radius: 16px;
  background-color: #FFFFFF;
`;

export const ScheduleHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const ScheduleLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6B7280;
  margin: 0;
`;

export const ScheduleTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1F2328;
  margin: 4px 0 0 0;
`;

export const ScheduleIcon = styled.div`
  color: ${props => props.$color || '#6B7280'};
`;

export const ScheduleContent = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

export const ScheduleDays = styled.span`
  font-size: 2.25rem;
  font-weight: bold;
  color: ${props => props.$color || '#1F2328'};
`;

export const ScheduleDate = styled.span`
  font-size: 0.875rem;
  color: #6B7280;
`;

// 상태 그리드 (데스크탑: 2열)
export const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const StatusCard = styled.div`
  padding: 24px;
  border-radius: 16px;
  background-color: #FFFFFF;
`;

export const StatusCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const StatusCardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: bold;
  color: #1F2328;
  margin: 0;
`;

export const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 4px;
  background-color: ${props => props.$color || '#6B7280'};
  color: #FFFFFF;
  font-size: 0.875rem;
`;

export const StatusProgress = styled.div`
  margin-bottom: 16px;
`;

export const StatusItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StatusItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  background-color: #F9FAFB;
`;

export const StatusItemLabel = styled.span`
  font-size: 0.875rem;
  color: #1F2328;
`;

export const StatusItemBadge = styled.span`
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid ${props => props.$color || '#9CA3AF'};
  color: ${props => props.$color || '#9CA3AF'};
`;

// 위험 카드
export const RiskCard = styled(StatusCard)``;

export const RiskCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const RiskCardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: bold;
  color: #1F2328;
  margin: 0;
`;

export const RiskCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RiskItem = styled.div`
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => {
    switch (props.$variant) {
      case 'high':
        return '#FEE2E2';
      case 'medium':
        return '#FED7AA';
      default:
        return '#F9FAFB';
    }
  }};
`;

export const RiskItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const RiskItemTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => {
    switch (props.$variant) {
      case 'high':
        return '#991B1B';
      case 'medium':
        return '#92400E';
      default:
        return '#1F2328';
    }
  }};
`;

export const RiskItemBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${props => {
    switch (props.$color) {
      case 'red':
        return '#DC2626';
      case 'orange':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  }};
  color: #FFFFFF;
  font-size: 0.75rem;
`;

export const RiskItemDescription = styled.p`
  font-size: 0.75rem;
  color: ${props => {
    switch (props.$variant) {
      case 'high':
        return '#7F1D1D';
      case 'medium':
        return '#78350F';
      default:
        return '#6B7280';
    }
  }};
  margin: 0;
`;

// 설문 카드
export const SurveyCard = styled(StatusCard)``;

export const SurveyCardHeader = styled(RiskCardHeader)``;

export const SurveyCardTitle = styled(RiskCardTitle)``;

export const SurveyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SurveyButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  height: auto;
  padding: 12px;
  border: 1px solid #DADDE1;
  border-radius: 8px;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #F9FAFB;
  }
`;

export const SurveyButtonContent = styled.div`
  text-align: left;
`;

export const SurveyButtonTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1F2328;
  margin: 0 0 4px 0;
`;

export const SurveyButtonSubtitle = styled.p`
  font-size: 0.75rem;
  color: #6B7280;
  margin: 0;
`;

// 모니터링 그리드 (데스크탑: 2열)
export const MonitoringGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const MonitoringCard = styled(StatusCard)``;

export const MonitoringCardHeader = styled(RiskCardHeader)``;

export const MonitoringCardTitle = styled(RiskCardTitle)``;

export const MonitoringTable = styled.table`
  width: 100%;
`;

export const MonitoringTableHead = styled.thead``;

export const MonitoringTableHeaderRow = styled.tr`
  border-bottom: 2px solid #E5E7EB;
`;

export const MonitoringTableHeaderCell = styled.th`
  text-align: ${props => props.$align || 'left'};
  padding: 12px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6B7280;
`;

export const MonitoringTableBody = styled.tbody``;

export const MonitoringTableRow = styled.tr`
  border-bottom: 1px solid #F3F4F6;
`;

export const MonitoringTableCell = styled.td`
  padding: 12px 8px;
  font-size: 0.875rem;
  color: ${props => props.$fontWeight === 'medium' ? '#1F2328' : '#6B7280'};
  font-weight: ${props => props.$fontWeight === 'medium' ? '500' : 'normal'};
  text-align: ${props => props.$align || 'left'};
`;

export const ScoreCell = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.$color || '#1F2328'};
`;

// 미검진 인원 카드
export const NonParticipantsCard = styled(StatusCard)``;

export const NonParticipantsHeader = styled.div`
  margin-bottom: 16px;
`;

export const NonParticipantsTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: bold;
  color: #1F2328;
  margin: 0 0 4px 0;
`;

export const NonParticipantsDescription = styled.p`
  font-size: 0.75rem;
  color: #6B7280;
  margin: 0;
`;

export const NonParticipantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const NonParticipantItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #F9FAFB;
  }
`;

export const NonParticipantAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: #E5E7EB;
`;

export const NonParticipantInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NonParticipantName = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1F2328;
  margin: 0 0 4px 0;
`;

export const NonParticipantTeam = styled.p`
  font-size: 0.75rem;
  color: #6B7280;
  margin: 0;
`;

// 플로팅 액션 버튼
export const FloatingActions = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 9999px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
`;

export const FloatingActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;
