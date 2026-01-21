import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const ArtistCalendarRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const ArtistCalendarBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;

// 메인 레이아웃 그리드 (데스크탑: 2fr 1fr, 모바일: 1fr)
export const ArtistCalendarLayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  min-height: calc(100vh - 180px);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 캘린더 카드 컨테이너
export const ArtistCalendarCard = styled.div`
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

// 캘린더 헤더
export const ArtistCalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-shrink: 0;
`;

export const ArtistCalendarHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ArtistCalendarMonthTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const ArtistCalendarHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// 근태 범례
export const AttendanceLegend = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: 8px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LegendColorBox = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid ${props => props.$borderColor || 'transparent'};
  background-color: ${props => props.$backgroundColor || 'transparent'};
`;

export const LegendLabel = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
`;

// 캘린더 그리드 컨테이너
export const ArtistCalendarGridContainer = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

// 요일 헤더 그리드
export const ArtistDaysOfWeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 8px;
  flex-shrink: 0;
`;

export const ArtistDayOfWeekHeader = styled.div`
  text-align: center;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted-foreground);
`;

// 날짜 그리드
export const ArtistDatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-template-rows: repeat(5, minmax(0, 1fr));
  border-left: 1px solid var(--border);
  border-top: 1px solid var(--border);
  flex: 1;
`;

// 날짜 셀
export const ArtistDateCell = styled.div`
  width: 100%;
  height: 100%;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 8px;
  background-color: ${props => {
    if (props.$isToday) return 'color-mix(in srgb, var(--primary) 5%, transparent)';
    if (props.$attendanceType === 'workation') return 'rgba(168, 85, 247, 0.15)';
    if (props.$attendanceType === 'break') return 'rgba(156, 163, 175, 0.25)';
    return 'transparent';
  }};
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;

  &:hover {
    background-color: ${props => {
      if (props.$attendanceType === 'workation') return 'rgba(168, 85, 247, 0.25)';
      if (props.$attendanceType === 'break') return 'rgba(156, 163, 175, 0.35)';
      return 'color-mix(in srgb, var(--muted) 50%, transparent)';
    }};
  }
`;

export const ArtistDateNumber = styled.div`
  font-size: 14px;
  font-weight: ${props => (props.$isToday ? '700' : '500')};
  color: ${props => (props.$isToday ? 'var(--primary)' : 'var(--foreground)')};
  margin-bottom: 4px;
  flex-shrink: 0;
`;

// 일정 표시 영역
export const ArtistDateEventsArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  overflow: visible;
  position: relative;
`;

// 일정 바 (여러 날짜에 걸친 작업)
export const ArtistEventBar = styled.div`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${props => props.$color || '#6E8FB3'};
  width: ${props => props.$width || '100%'};
  position: ${props => (props.$isMultiDay ? 'absolute' : 'relative')};
  left: ${props => (props.$isMultiDay ? '0' : 'auto')};
  top: ${props => (props.$isMultiDay ? `${props.$topOffset || 0}px` : 'auto')};
  z-index: ${props => (props.$isMultiDay ? 10 : 1)};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

// 더보기 텍스트
export const ArtistDateMoreEvents = styled.div`
  font-size: 12px;
  color: var(--muted-foreground);
  padding: 0 4px;
`;

// 메모 표시
export const ArtistDateMemo = styled.div`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
  cursor: pointer;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s;

  &:hover {
    background-color: #fde68a;
  }
`;

// 다가오는 일정 사이드바
export const ArtistUpcomingEventsSidebar = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ArtistUpcomingEventsCard = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const ArtistUpcomingEventsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 16px 0;
`;

// 작품 관련 일정 섹션
export const ArtistWorkEventsSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const ArtistSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-shrink: 0;
`;

export const ArtistSectionDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$color || 'var(--primary)'};
`;

export const ArtistSectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const ArtistSectionCount = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
  margin-left: auto;
`;

export const ArtistUpcomingEventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
`;

export const ArtistUpcomingEventItem = styled.div`
  padding: 12px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background-color: color-mix(in srgb, var(--muted) 50%, transparent);
  }
`;

export const ArtistUpcomingEventContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const ArtistUpcomingEventColorBar = styled.div`
  width: 4px;
  min-height: 40px;
  border-radius: 2px;
  flex-shrink: 0;
  background-color: ${props => props.$color || '#6E8FB3'};
`;

export const ArtistUpcomingEventDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ArtistUpcomingEventTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ArtistUpcomingEventDate = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const ArtistUpcomingEventDuration = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 4px 0 0 0;
`;

export const ArtistEmptyState = styled.div`
  text-align: center;
  color: var(--muted-foreground);
  font-size: 12px;
  padding: 32px 16px;
  background-color: color-mix(in srgb, var(--muted) 20%, transparent);
  border-radius: 8px;
`;

// 구분선
export const ArtistDivider = styled.div`
  border-top: 1px solid var(--border);
  margin: 16px 0;
  flex-shrink: 0;
`;

// 메모 섹션
export const ArtistMemoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const ArtistMemoItem = styled.div`
  padding: 12px;
  background-color: #fef3c7;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #fcd34d;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background-color: #fde68a;
  }
`;

export const ArtistMemoContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const ArtistMemoIcon = styled.div`
  font-size: 16px;
  flex-shrink: 0;
`;

export const ArtistMemoDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ArtistMemoText = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #92400e;
  margin: 0 0 4px 0;
  word-break: break-word;
`;

export const ArtistMemoDate = styled.p`
  font-size: 12px;
  color: #78350f;
  margin: 0;
`;

// 모달 폼 스타일 (CalendarPage와 동일)
export const ArtistModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ArtistFormTitleInput = styled.input`
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

export const ArtistFormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ArtistFormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

export const ArtistFormSelect = styled.select`
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

export const ArtistColorPickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ArtistColorPickerLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

export const ArtistColorPickerGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ArtistColorPickerButton = styled.button`
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

export const ArtistFormTextarea = styled.textarea`
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

export const ArtistModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
`;

// 일정 상세 모달 스타일
export const ArtistEventDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ArtistEventDetailCard = styled.div`
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => `${props.$color}10`};
  border-left: 4px solid ${props => props.$color};
`;

export const ArtistEventDetailTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const ArtistEventDetailInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
`;

export const ArtistEventDetailText = styled.p`
  color: var(--muted-foreground);
  margin: 0;
`;

export const ArtistEventDetailActions = styled.div`
  display: flex;
  gap: 8px;
`;
