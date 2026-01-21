import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AttendanceRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AttendanceBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;

// 페이지 헤더 영역
export const PageHeader = styled.div`
  margin-bottom: 24px;
`;

export const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const PageDescription = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 통계 카드 그리드 (데스크탑: 3열)
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

// 메인 콘텐츠 그리드 (데스크탑: 2열, 모바일: 1열)
export const MainContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 섹션 컨테이너
export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// 섹션 헤더
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

// 빈 상태 컨테이너
export const EmptyStateContainer = styled.div`
  padding: 64px 32px;
  text-align: center;
  color: var(--muted-foreground);
`;

export const EmptyStateIcon = styled.div`
  margin: 0 auto 12px;
  opacity: 0.5;
`;

export const EmptyStateText = styled.p`
  font-size: 14px;
  margin: 0;
`;

// 신청 카드 리스트
export const RequestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 신청 카드 (대기 중)
export const PendingRequestCard = styled.div`
  padding: 20px;
  background-color: white;
  border: 2px solid var(--border);
  border-radius: 12px;
`;

// 신청 카드 (처리됨 - 승인)
export const ApprovedRequestCard = styled.div`
  padding: 16px;
  background-color: color-mix(in srgb, #10b981 10%, transparent);
  border: 1px solid color-mix(in srgb, #10b981 20%, transparent);
  border-radius: 12px;
`;

// 신청 카드 (처리됨 - 반려)
export const RejectedRequestCard = styled.div`
  padding: 16px;
  background-color: color-mix(in srgb, #ef4444 10%, transparent);
  border: 1px solid color-mix(in srgb, #ef4444 20%, transparent);
  border-radius: 12px;
`;

// 신청 카드 헤더
export const RequestCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const RequestCardContent = styled.div`
  flex: 1;
`;

export const RequestCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const ArtistName = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

// 신청 정보 리스트
export const RequestInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: var(--muted-foreground);
`;

export const RequestInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 액션 버튼 영역
export const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
`;

// 처리 내역 스크롤 영역
export const ProcessedHistoryScroll = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 800px;
  overflow-y: auto;
  padding-right: 8px;
`;

// 반려 사유 표시 영역
export const RejectionReasonBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-top: 8px;
  padding: 8px;
  background-color: color-mix(in srgb, #ef4444 10%, transparent);
  border: 1px solid color-mix(in srgb, #ef4444 20%, transparent);
  border-radius: 8px;
`;

export const RejectionReasonText = styled.span`
  font-size: 12px;
  color: #991b1b;
`;

// 처리일 표시
export const ProcessedDateText = styled.div`
  font-size: 12px;
  color: var(--muted-foreground);
  padding-top: 8px;
  border-top: 1px solid var(--border);
`;

// 모달 내부 컨테이너
export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const RequestPreviewBox = styled.div`
  padding: 16px;
  background-color: var(--muted);
  border-radius: 8px;
`;

export const RequestPreviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const RequestPreviewTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const RequestPreviewInfo = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 4px 0;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 8px;
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  background-color: var(--background);
  color: var(--foreground);
  resize: none;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--ring);
    box-shadow: 0 0 0 2px var(--ring);
  }

  &::placeholder {
    color: var(--muted-foreground);
  }
`;

export const FormHelperText = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 4px 0 0 0;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 16px;
`;
