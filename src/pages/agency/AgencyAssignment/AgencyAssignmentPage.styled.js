import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AgencyAssignmentRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background-color: var(--background);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AgencyAssignmentBody = styled.div`
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
  gap: 8px;
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

// 검색 바 컨테이너
export const SearchBarContainer = styled.div`
  position: relative;
  margin-bottom: 8px;
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

// 담당자 그리드 (데스크탑: 3열)
export const ManagersGrid = styled.div`
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

// 담당자 카드
export const ManagerCard = styled.div`
  background-color: #ffffff;
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: var(--primary);
    opacity: 0.9;
  }
`;

export const ManagerCardContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ManagerCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const ManagerAvatar = styled.div`
  width: 48px;
  height: 48px;
  background-color: var(--primary);
  opacity: 0.2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ManagerInfo = styled.div`
  flex: 1;
`;

export const ManagerName = styled.h3`
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 4px 0;
`;

export const ManagerPosition = styled.p`
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin: 0;
`;

export const ManagerBadge = styled.div`
  background-color: var(--primary);
  color: var(--primary-foreground);
  font-size: 1.125rem;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 600;
`;

export const ManagerDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ManagerDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--muted-foreground);
`;

// 빈 상태
export const EmptyStateCard = styled.div`
  padding: 48px;
  text-align: center;
`;

export const EmptyStateIcon = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
`;

export const EmptyStateText = styled.p`
  color: var(--muted-foreground);
  margin: 0;
`;

// 모달 콘텐츠
export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  max-height: 60vh;
`;

// 담당 작가 섹션
export const AssignedSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const AssignedSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AssignedSectionTitle = styled.h3`
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const AssignedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AssignedItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: rgba(128, 128, 128, 0.1);
  border-radius: 8px;
`;

export const AssignedItemInfo = styled.div`
  flex: 1;
`;

export const AssignedItemName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const AssignedItemDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.75rem;
  color: var(--muted-foreground);
`;

export const UnassignButton = styled.button`
  color: #dc2626;
  transition: all 0.2s;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 4px 8px;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    color: #b91c1c;
    background-color: #fef2f2;
  }
`;

// 미배정 작가 섹션
export const UnassignedSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const UnassignedSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const UnassignedSectionTitle = styled.h3`
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const UnassignedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const UnassignedItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: rgba(239, 246, 255, 0.5);
  border-radius: 8px;
  border: 1px solid #bfdbfe;
`;

export const AssignButton = styled.button`
  color: var(--primary);
  transition: all 0.2s;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 4px 8px;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background-color: rgba(var(--primary-rgb), 0.1);
  }
`;

// 빈 상태 박스
export const EmptyStateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: var(--muted);
  opacity: 0.1;
  border-radius: 8px;
  gap: 8px;
`;
