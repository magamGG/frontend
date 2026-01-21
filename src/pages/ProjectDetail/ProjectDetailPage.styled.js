import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const ProjectDetailRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const ProjectDetailBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 상단 헤더
export const ProjectDetailHeader = styled.div`
  margin-bottom: 24px;
`;

export const ProjectDetailHeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const ProjectDetailHeaderRight = styled.div`
  display: flex;
  gap: 8px;
`;

// 프로젝트 정보 카드
export const ProjectInfoCard = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const ProjectInfoContent = styled.div`
  display: flex;
  gap: 24px;
`;

export const ProjectThumbnailContainer = styled.div`
  flex-shrink: 0;
  position: relative;
  cursor: ${props => (props.isEditMode ? 'pointer' : 'default')};
`;

export const ProjectThumbnailOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;

  ${ProjectThumbnailContainer}:hover & {
    opacity: 1;
  }
`;

export const ProjectInfoDetails = styled.div`
  flex: 1;
`;

export const ProjectTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 12px 0;
`;

export const ProjectTitleInput = styled.input`
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 12px 0;
  width: 100%;
  padding: 4px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background-color: var(--background);
`;

export const ProjectArtistName = styled.p`
  font-size: 18px;
  color: var(--muted-foreground);
  margin: 0 0 12px 0;
`;

export const ProjectArtistNameInput = styled.input`
  font-size: 18px;
  color: var(--muted-foreground);
  margin: 0 0 12px 0;
  padding: 4px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background-color: var(--background);
`;

export const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

export const ProjectActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ProjectColorPicker = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProjectColorPickerLabel = styled.label`
  font-size: 12px;
  color: var(--muted-foreground);
`;

export const ProjectColorPickerGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const ProjectColorButton = styled.button`
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.$color};
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  ${props =>
    props.$isSelected &&
    `
    &::before {
      content: '';
      position: absolute;
      inset: -4px;
      border: 2px solid var(--foreground);
      border-radius: 50%;
    }
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 8px;
      height: 8px;
      background-color: white;
      border-radius: 50%;
      margin: auto;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
  `}
`;

// 메인 컨텐츠 영역
export const ProjectDetailMainContent = styled.div`
  display: flex;
  gap: 24px;
`;

// 칸반 보드 영역
export const KanbanSection = styled.div`
  flex: 1;
  min-width: 0;
`;

export const KanbanCard = styled.div`
  padding: 24px;
  height: calc(100vh - 320px);
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const KanbanHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-shrink: 0;
`;

export const KanbanTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
`;

export const KanbanBoardsContainer = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 16px;
  flex: 1;
  min-height: 0;
`;

// 드롭 가능한 보드
export const DroppableBoardContainer = styled.div`
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: 8px;
  padding: 16px;
  min-width: 280px;
  max-width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  ${props =>
    props.isOver &&
    `
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  `}
`;

export const DroppableBoardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-shrink: 0;
`;

export const DroppableBoardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
`;

export const DroppableBoardCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  overflow-y: auto;
  flex: 1;
  padding-right: 4px;
`;

// 드래그 가능한 카드
export const DraggableCardContainer = styled.div`
  background-color: white;
  border-left: 4px solid ${props => props.$borderColor || 'var(--border)'};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: move;
  transition: all 0.2s;
  opacity: ${props => (props.isDragging ? 0.5 : 1)};

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

export const DraggableCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

export const DraggableCardTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
  flex: 1;
  word-break: break-word;
  margin: 0;
`;

export const DraggableCardActions = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`;

export const DraggableCardDescription = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0 0 8px 0;
`;

export const DraggableCardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--muted-foreground);
`;

export const DraggableCardAssignee = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6e8fb3;
  margin-top: 8px;
  background-color: rgba(110, 143, 179, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
`;

// 주간 일정 영역
export const WeeklyScheduleSection = styled.div`
  width: 320px;
  flex-shrink: 0;
`;

export const WeeklyScheduleCard = styled.div`
  padding: 24px;
  height: calc(100vh - 320px);
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const WeeklyScheduleTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 16px 0;
`;

export const WeeklyScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
`;

export const WeeklyScheduleItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid ${props => (props.$isToday ? 'var(--primary)' : props.$borderColor || 'transparent')};
  background-color: ${props => (props.$isToday ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'color-mix(in srgb, var(--muted) 20%, transparent)')};
`;

export const WeeklyScheduleItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const WeeklyScheduleDay = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
`;

export const WeeklyScheduleDate = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
`;

export const WeeklyScheduleEvents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const WeeklyScheduleEvent = styled.p`
  font-size: 12px;
  color: var(--foreground);
  margin: 0;
`;

export const WeeklyScheduleEmpty = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  font-style: italic;
  margin: 0;
`;
