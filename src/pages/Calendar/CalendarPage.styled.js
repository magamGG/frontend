import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const CalendarRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const CalendarBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;

// 메인 레이아웃 그리드 (데스크탑: 2fr 1fr, 모바일: 1fr)
export const CalendarLayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  min-height: calc(100vh - 180px);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 캘린더 카드 컨테이너
export const CalendarCard = styled.div`
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

// 캘린더 헤더
export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-shrink: 0;
`;

export const CalendarHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const CalendarMonthTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const CalendarHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// 캘린더 그리드 컨테이너
export const CalendarGridContainer = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

// 요일 헤더 그리드
export const DaysOfWeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 8px;
  flex-shrink: 0;
`;

export const DayOfWeekHeader = styled.div`
  text-align: center;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted-foreground);
`;

// 날짜 그리드
export const DatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-template-rows: repeat(5, minmax(0, 1fr));
  gap: 8px;
  flex: 1;
`;

// 날짜 셀
export const DateCell = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid ${props => (props.$isToday ? 'var(--primary)' : 'var(--border)')};
  border-radius: 8px;
  padding: 8px;
  background-color: ${props => (props.$isToday ? 'color-mix(in srgb, var(--primary) 5%, transparent)' : 'transparent')};
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &:hover {
    background-color: color-mix(in srgb, var(--muted) 50%, transparent);
  }
`;

export const DateNumber = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => (props.$isToday ? 'var(--primary)' : 'var(--foreground)')};
  margin-bottom: 4px;
  flex-shrink: 0;
`;

export const DateEventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  overflow: hidden;
`;

export const DateEventItem = styled.div`
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${props => `${props.$color}20`};
  color: ${props => props.$color};
`;

export const DateMoreEvents = styled.div`
  font-size: 12px;
  color: var(--muted-foreground);
  padding: 0 4px;
`;

// 다가오는 일정 사이드바
export const UpcomingEventsSidebar = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const UpcomingEventsCard = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const UpcomingEventsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 16px 0;
`;

export const UpcomingEventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
`;

export const UpcomingEventItem = styled.div`
  padding: 12px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: color-mix(in srgb, var(--muted) 50%, transparent);
  }
`;

export const UpcomingEventContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const UpcomingEventColorBar = styled.div`
  width: 4px;
  height: 100%;
  border-radius: 2px;
  margin-right: 8px;
  flex-shrink: 0;
  background-color: ${props => props.$color};
`;

export const UpcomingEventDetails = styled.div`
  flex: 1;
`;

export const UpcomingEventTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin: 0 0 4px 0;
`;

export const UpcomingEventDate = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const UpcomingEventProject = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 4px 0 0 0;
`;

export const EmptyUpcomingEvents = styled.div`
  text-align: center;
  color: var(--muted-foreground);
  font-size: 14px;
  padding: 64px 32px;
`;

// 모달 폼 스타일
export const ModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FormTitleInput = styled.input`
  width: 100%;
  padding: 12px 0;
  font-size: 18px;
  border-bottom: 2px solid var(--border);
  background-color: transparent;
  color: var(--foreground);
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-bottom-color: var(--primary);
  }

  &::placeholder {
    color: var(--muted-foreground);
  }
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  background-color: var(--background);
  color: var(--foreground);
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--ring);
    box-shadow: 0 0 0 2px var(--ring);
  }
`;

export const ColorPickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ColorPickerLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

export const ColorPickerGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ColorPickerButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${props => (props.$isSelected ? 'var(--foreground)' : 'var(--border)')};
  background-color: ${props => props.$color};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }

  ${props =>
    props.$isSelected &&
    `
    transform: scale(1.1);
    box-shadow: 0 0 0 2px var(--ring);
  `}
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

export const ModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
`;

// 일정 상세 모달 스타일
export const EventDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const EventDetailCard = styled.div`
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => `${props.$color}10`};
  border-left: 4px solid ${props => props.$color};
`;

export const EventDetailTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const EventDetailInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
`;

export const EventDetailText = styled.p`
  color: var(--muted-foreground);
  margin: 0;
`;

export const EventDetailActions = styled.div`
  display: flex;
  gap: 8px;
`;
