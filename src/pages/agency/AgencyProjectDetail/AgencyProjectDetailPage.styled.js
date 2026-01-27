import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AgencyProjectDetailRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  background-color: var(--background);
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AgencyProjectDetailBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px 32px 96px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 뒤로가기 버튼 컨테이너
export const BackButtonContainer = styled.div`
  margin-bottom: 8px;
`;

// 프로젝트 헤더 카드
export const ProjectHeaderCard = styled.div`
  background-color: var(--card);
  color: var(--card-foreground);
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 24px;
  margin-bottom: 8px;
`;

export const ProjectHeaderContent = styled.div`
  display: flex;
  gap: 24px;
`;

export const ProjectThumbnail = styled.div`
  flex-shrink: 0;
`;

export const ProjectInfo = styled.div`
  flex: 1;
`;

export const ProjectTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: var(--foreground);
  margin: 0 0 12px 0;
`;

export const ProjectArtist = styled.p`
  font-size: 1.125rem;
  color: var(--muted-foreground);
  margin: 0 0 12px 0;
`;

export const ProjectBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

export const ProjectTeamSection = styled.div`
  margin-top: 16px;
`;

export const ProjectTeamHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 프로젝트 관리 섹션
export const ProjectManagementSection = styled.div`
  background-color: var(--card);
  color: var(--card-foreground);
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 24px;
`;

export const ProjectManagementTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--foreground);
  margin: 0;
`;

export const KanbanBoardsContainer = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 16px;
  
  /* 스크롤바 스타일링 */
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--border);
    border-radius: 4px;
    
    &:hover {
      background-color: var(--muted-foreground);
    }
  }
`;

// 읽기 전용 보드
export const ReadOnlyBoard = styled.div`
  background-color: rgba(232, 234, 237, 0.3);
  border-radius: 8px;
  padding: 16px;
  min-width: 280px;
  max-width: 280px;
  flex-shrink: 0;
`;

export const ReadOnlyBoardTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const ReadOnlyBoardTitle = styled.h3`
  font-weight: bold;
  color: var(--foreground);
  margin: 0;
`;

export const ReadOnlyBoardCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* 스크롤바 스타일링 */
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--border);
    border-radius: 3px;
    
    &:hover {
      background-color: var(--muted-foreground);
    }
  }
`;

// 읽기 전용 카드
export const ReadOnlyCard = styled.div`
  background-color: white;
  border-left: 4px solid var(--primary);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const ReadOnlyCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

export const ReadOnlyCardHeaderContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

export const ReadOnlyCardTitle = styled.h4`
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--foreground);
  flex: 1;
  word-break: break-word;
  margin: 0;
`;

export const ReadOnlyCardDescription = styled.p`
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin: 0 0 8px 0;
`;

export const ReadOnlyCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ReadOnlyCardFooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ReadOnlyCardDate = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--muted-foreground);
`;

export const ReadOnlyCardDateInner = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--muted-foreground);
`;

export const ReadOnlyCardAssignee = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
`;

export const ReadOnlyCardComments = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--muted-foreground);
`;

// 주간 캘린더 섹션
export const WeeklyScheduleSection = styled.div`
  background-color: var(--card);
  color: var(--card-foreground);
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 24px;
`;

// 그리드 레이아웃 컨테이너
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
`;

export const ContentGridLeft = styled.div`
  grid-column: span 2;
`;

export const ContentGridRight = styled.div`
  grid-column: span 1;
`;

export const WeeklyScheduleDateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const WeeklyScheduleEmptyText = styled.p`
  font-size: 0.75rem;
  color: var(--muted-foreground);
  font-style: italic;
  margin: 0;
`;

export const WeeklyScheduleTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--foreground);
  margin: 0;
`;

export const WeeklyScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const WeeklyScheduleItem = styled.div`
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
  }
`;

export const WeeklyScheduleDate = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
`;

export const WeeklyScheduleDay = styled.span`
  font-size: 0.75rem;
  color: var(--muted-foreground);
`;

export const WeeklyScheduleEvents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const WeeklyScheduleEvent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
