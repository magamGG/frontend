import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AgencyApprovalsRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  background-color: var(--background);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AgencyApprovalsBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 32px 32px 96px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 헤더 영역
export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
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

// 통계 그리드 (데스크탑: 3열)
export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const StatisticsCard = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: #ffffff;
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

// 카테고리 필터 카드
export const CategoryFilterCard = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

export const CategoryFilterLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
`;

export const CategoryButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

// 메인 콘텐츠 그리드 (데스크탑: 2열)
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 승인 대기 섹션
export const PendingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 처리 내역 섹션
export const ProcessedSection = styled.div`
  background-color: var(--muted);
  opacity: 0.5;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 섹션 헤더
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const SectionBadge = styled.div`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  ${props => props.variant === 'outline' ? `
    border: 1px solid var(--border);
    background-color: transparent;
  ` : `
    background-color: white;
    border: 1px solid var(--border);
  `}
`;

// 요청 카드
export const RequestCard = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid var(--border);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const RequestCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const RequestCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const RequestCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.875rem;
  color: var(--muted-foreground);
`;

export const RequestCardInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--muted-foreground);
`;

export const RequestCardActions = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
`;

// 처리된 요청 카드
export const ProcessedRequestCard = styled.div`
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${props => props.$isApproved ? `
    background-color: #f0fdf4;
    border: 1px solid #86efac;
  ` : `
    background-color: #fef2f2;
    border: 1px solid #fca5a5;
  `}
`;

export const ProcessedRequestHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const ProcessedRequestInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--muted-foreground);
`;

export const ProcessedRequestFooter = styled.div`
  font-size: 0.75rem;
  color: var(--muted-foreground);
  padding-top: 8px;
  border-top: 1px solid var(--border);
`;

// 반려 사유 박스
export const RejectionReasonBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-top: 8px;
  padding: 8px;
  background-color: #fee2e2;
  border-radius: 4px;
  border: 1px solid #fecaca;
`;

// 빈 상태
export const EmptyStateCard = styled.div`
  padding: 32px;
  text-align: center;
  color: var(--muted-foreground);
`;

export const EmptyStateIcon = styled.div`
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
`;

export const EmptyStateText = styled.p`
  font-size: 0.875rem;
  margin: 0;
`;
