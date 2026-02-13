import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AgencyJoinRequestsRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: var(--background);
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AgencyJoinRequestsBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px 32px 96px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

// 헤더 영역
export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

export const HeaderIcon = styled.div`
  flex-shrink: 0;
`;

export const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: var(--foreground);
  margin: 0 0 4px 0;
`;

export const HeaderSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--muted-foreground);
  margin: 0;
`;

// 통계 그리드 (데스크탑: 3열)
export const StatisticsGrid = styled.div`
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

export const StatisticsCard = styled.div`
  padding: 24px;
`;

export const StatisticsCardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StatisticsIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => {
    switch (props.$color) {
      case 'yellow':
        return 'background-color: #fef3c7;';
      case 'green':
        return 'background-color: #d1fae5;';
      case 'blue':
        return 'background-color: #dbeafe;';
      default:
        return 'background-color: #f3f4f6;';
    }
  }}
`;

export const StatisticsLabel = styled.p`
  font-size: 0.875rem;
  color: var(--muted-foreground);
  margin: 0 0 4px 0;
`;

export const StatisticsValue = styled.p`
  font-size: 1.875rem;
  font-weight: bold;
  color: var(--foreground);
  margin: 0;
`;

// 대기 중인 요청 섹션
export const PendingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 8px;
`;

export const PendingSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const PendingSectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const PendingBadge = styled.div`
  background-color: #fef3c7;
  color: #92400e;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const PendingRequestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const RequestCard = styled.div`
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

export const RequestCardContent = styled.div`
  padding: 24px;
  display: flex;
  flex-col: column;
  gap: 16px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

export const RequestAvatar = styled.div`
  width: 48px;
  height: 48px;
  background-color: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const RequestInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const RequestNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const RequestName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const RequestDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  font-size: 0.875rem;
  color: var(--muted-foreground);
  margin-bottom: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const RequestDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RequestMessage = styled.p`
  margin-top: 12px;
  font-size: 0.875rem;
  color: var(--foreground);
  background-color: var(--muted);
  opacity: 0.3;
  padding: 12px;
  border-radius: 8px;
`;

export const RequestActions = styled.div`
  display: flex;
  gap: 8px;

  @media (min-width: 768px) {
    flex-direction: column;
    width: auto;
  }
`;

// 처리 완료 섹션
export const ProcessedSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ProcessedSectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const ProcessedRequestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ProcessedRequestCard = styled.div`
  padding: 24px;
  opacity: 0.75;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

// 빈 상태
export const EmptyStateCard = styled.div`
  padding: 48px;
  text-align: center;
`;

export const EmptyStateIcon = styled.div`
  width: 64px;
  height: 64px;
  background-color: var(--muted);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const EmptyStateText = styled.p`
  color: var(--muted-foreground);
  margin: 0;
`;

// 상세 모달 콘텐츠
export const DetailModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StatusSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--muted);
  opacity: 0.3;
  border-radius: 8px;
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const InfoSectionTitle = styled.h4`
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
  display: flex;
  align-items: center;
`;

export const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background-color: var(--muted);
  opacity: 0.3;
  border-radius: 8px;
`;

export const InfoLabel = styled.span`
  color: var(--muted-foreground);
`;

export const InfoValue = styled.span`
  font-weight: 500;
  color: var(--foreground);
`;

export const MessageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MessageContent = styled.div`
  padding: 16px;
  background-color: var(--muted);
  opacity: 0.3;
  border-radius: 8px;
`;
