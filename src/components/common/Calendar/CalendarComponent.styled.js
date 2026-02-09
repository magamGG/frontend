import styled from 'styled-components';
import { Button } from '@/app/components/ui/button';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const CalendarRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 2rem 2rem 6rem;
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
  gap: 1.5rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 필터 카드 (담당자 캘린더용)
export const FilterCard = styled.div`
  padding: 1rem;
  background-color: var(--card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  margin-bottom: 1rem;
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const FilterField = styled.div`
  flex: 1;
`;

export const FilterLabel = styled.label`
  font-size: 0.75rem;
  font-weight: var(--font-weight-medium);
  color: var(--muted-foreground);
  display: block;
  margin-bottom: 0.25rem;
`;

export const FilterSelect = styled.select`
  width: 100%;
  height: 2.25rem;
  padding: 0 0.75rem;
  border-radius: 0.375rem;
  border: 2px solid var(--border);
  background-color: var(--background);
  color: var(--foreground);
  font-size: 0.75rem;
  outline: none;
  transition: var(--transition-base, all 0.2s);

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 20%, transparent);
  }
`;

// 캘린더 카드 컨테이너
export const CalendarCard = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  background-color: var(--card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

// 캘린더 헤더
export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-shrink: 0;
`;

export const CalendarHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const CalendarMonthTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
  margin: 0;
`;

export const CalendarHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

// 근태 범례
export const AttendanceLegend = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: var(--radius);
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LegendColorBox = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid ${props => props.$borderColor || 'transparent'};
  background-color: ${props => props.$backgroundColor || 'transparent'};
`;

export const LegendLabel = styled.span`
  font-size: 0.75rem;
  color: var(--muted-foreground);
`;

// 캘린더 그리드 컨테이너
export const CalendarGridContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// 요일 헤더 그리드
export const DaysOfWeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-shrink: 0;
`;

export const DayOfWeekHeader = styled.div`
  text-align: center;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
  color: var(--muted-foreground);
`;

// 날짜 그리드
export const DatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-auto-rows: min-content;
  gap: 1px;
  background-color: var(--border);
  border: 1px solid var(--border);
`;

// 날짜 셀
export const DateCell = styled.div`
  width: 100%;
  min-height: 7.5rem;
  height: auto;
  padding: 0.5rem;
  background-color: ${props => {
    // 다른 달 날짜도 하얀색 배경
    if (props.$isOtherMonth) return 'var(--card)';
    
    // 휴무나 워케이션이 있으면 우선 표시 - 진하고 예쁜 색상으로
    if (props.$attendanceType === 'workation') {
      // 워케이션: 진한 보라색
      if (props.$isToday) return 'color-mix(in srgb, var(--status-workation) 40%, var(--card))';
      return 'color-mix(in srgb, var(--status-workation) 28%, var(--card))';
    }
    if (props.$attendanceType === 'break') {
      // 휴가: 진한 회색
      if (props.$isToday) return 'color-mix(in srgb, var(--status-hiatus) 40%, var(--card))';
      return 'color-mix(in srgb, var(--status-hiatus) 28%, var(--card))';
    }
    // 일반 오늘 날짜
    if (props.$isToday) return 'color-mix(in srgb, var(--status-completed) 20%, var(--card))';
    return 'var(--card)';
  }};
  border: ${props => props.$isToday ? '2px solid var(--status-completed)' : 'none'};
  transition: var(--transition-base, all 0.2s);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;

  &:hover {
    background-color: ${props => {
      // 다른 달 날짜도 hover 시 하얀색 배경 유지
      if (props.$isOtherMonth) return 'color-mix(in srgb, var(--muted) 30%, var(--card))';
      
      // 휴무나 워케이션이 있으면 우선 표시 - 진하고 예쁜 색상으로
      if (props.$attendanceType === 'workation') {
        // 워케이션: 진한 보라색
        if (props.$isToday) return 'color-mix(in srgb, var(--status-workation) 50%, var(--card))';
        return 'color-mix(in srgb, var(--status-workation) 38%, var(--card))';
      }
      if (props.$attendanceType === 'break') {
        // 휴가: 진한 회색
        if (props.$isToday) return 'color-mix(in srgb, var(--status-hiatus) 50%, var(--card))';
        return 'color-mix(in srgb, var(--status-hiatus) 38%, var(--card))';
      }
      // 일반 오늘 날짜
      if (props.$isToday) return 'color-mix(in srgb, var(--status-completed) 30%, var(--card))';
      return 'color-mix(in srgb, var(--muted) 50%, transparent)';
    }};
  }
`;

export const DateNumberWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  flex-shrink: 0;
  gap: 0.25rem;
`;

export const DateNumber = styled.div`
  font-size: 1rem;
  font-weight: ${props => (props.$isToday ? '700' : 'var(--font-weight-medium)')};
  color: ${props => {
    // 다른 달 날짜는 흐릿하게 표시 (회색)
    if (props.$isOtherMonth) {
      if (props.$isSunday) return 'color-mix(in srgb, var(--destructive) 40%, transparent)';
      return 'color-mix(in srgb, var(--muted-foreground) 40%, transparent)';
    }
    if (props.$isSunday && !props.$isToday) return 'var(--destructive)';
    if (props.$isToday) return 'var(--primary)';
    return 'var(--foreground)';
  }};
  flex-shrink: 0;
`;

export const AttendanceBadge = styled.span`
  font-size: 0.625rem;
  font-weight: var(--font-weight-medium);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background-color: ${props => {
    if (props.$attendanceType === 'workation') {
      // 오늘 날짜와 겹칠 경우 더 진하게
      if (props.$isToday) return 'color-mix(in srgb, var(--status-workation) 60%, transparent)';
      return 'color-mix(in srgb, var(--status-workation) 40%, transparent)';
    }
    if (props.$attendanceType === 'break') {
      // 오늘 날짜와 겹칠 경우 더 진하게
      if (props.$isToday) return 'color-mix(in srgb, var(--status-hiatus) 70%, transparent)';
      return 'color-mix(in srgb, var(--status-hiatus) 50%, transparent)';
    }
    return 'transparent';
  }};
  color: ${props => {
    if (props.$attendanceType === 'workation') {
      return 'var(--status-workation)';
    }
    if (props.$attendanceType === 'break') {
      return 'var(--status-hiatus)';
    }
    return 'var(--foreground)';
  }};
  border: 1px solid ${props => {
    if (props.$attendanceType === 'workation') {
      return 'color-mix(in srgb, var(--status-workation) 60%, transparent)';
    }
    if (props.$attendanceType === 'break') {
      return 'color-mix(in srgb, var(--status-hiatus) 60%, transparent)';
    }
    return 'transparent';
  }};
  white-space: nowrap;
  flex-shrink: 0;
`;

// 일정 표시 영역
export const DateEventsArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 0.25rem;
  min-height: 0;
  overflow: visible;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
  overflow: visible;
  position: relative;
  margin-bottom: 1.75rem;
`;

// 일정 바 (여러 날짜에 걸친 작업) — $topOffset(행 인덱스)만큼 margin-top으로 겹침 방지
export const EventBar = styled.div`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: var(--font-weight-medium);
  color: var(--primary-foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${props => props.$color || 'var(--accent)'};
  width: ${props => props.$width || '100%'};
  position: relative;
  z-index: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  height: 1.5rem;
  margin-top: ${props => (props.$topOffset != null && props.$topOffset > 0 ? `calc(${props.$topOffset} * (1.5rem + 2px))` : '0')};
  cursor: ${props => (props.$isGrouped ? 'pointer' : 'default')};
  
  &:hover {
    ${props => props.$isGrouped && `
      opacity: 0.9;
      transform: translateY(-1px);
    `}
  }
`;

// 그룹화된 일정 바
export const GroupedEventBar = styled.div`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: var(--font-weight-medium);
  color: var(--primary-foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${props => props.$color || 'var(--accent)'};
  width: ${props => props.$width || '100%'};
  position: relative;
  z-index: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  height: 1.5rem;
  margin-top: ${props => (props.$topOffset != null && props.$topOffset > 0 ? `calc(${props.$topOffset} * (1.5rem + 2px))` : '0')};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

// 메모 표시
export const DateMemo = styled.div`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: color-mix(in srgb, var(--accent) 15%, var(--card));
  color: var(--foreground);
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
  cursor: pointer;
  margin-top: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: var(--transition-base, all 0.2s);
  flex-shrink: 0;

  &:hover {
    background-color: color-mix(in srgb, var(--accent) 25%, var(--card));
  }
`;

// 다가오는 일정 사이드바
export const UpcomingEventsSidebar = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const UpcomingEventsCard = styled.div`
  padding: 1.25rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

export const UpcomingEventsTitle = styled.h3`
  font-size: 1rem;
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
  margin: 0 0 1rem 0;
`;

// 작품 관련 일정 섹션
export const WorkEventsSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  flex-shrink: 0;
`;

export const SectionDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${props => props.$color || 'var(--primary)'};
`;

export const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
  margin: 0;
`;

export const SectionCount = styled.span`
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin-left: auto;
`;

export const UpcomingEventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.25rem;
`;

export const UpcomingEventItem = styled.div`
  padding: 0.75rem;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition-base, all 0.2s);
  flex-shrink: 0;

  &:hover {
    background-color: color-mix(in srgb, var(--muted) 50%, transparent);
  }
`;

export const UpcomingEventContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const UpcomingEventColorBar = styled.div`
  width: 0.25rem;
  min-height: 2.5rem;
  border-radius: 0.125rem;
  flex-shrink: 0;
  background-color: ${props => props.$color || 'var(--accent)'};
`;

export const UpcomingEventDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

export const UpcomingEventTitle = styled.p`
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UpcomingEventDate = styled.p`
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin: 0;
`;

export const UpcomingEventDuration = styled.p`
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin: 0.25rem 0 0 0;
`;

export const EmptyState = styled.div`
  text-align: center;
  color: var(--muted-foreground);
  font-size: 0.75rem;
  padding: 2rem 1rem;
  background-color: color-mix(in srgb, var(--muted) 20%, transparent);
  border-radius: var(--radius);
`;

// 구분선
export const Divider = styled.div`
  border-top: 1px solid var(--border);
  margin: 1rem 0;
  flex-shrink: 0;
`;

// 메모 섹션
export const MemoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const MemoItem = styled.div`
  padding: 0.75rem;
  background-color: color-mix(in srgb, var(--accent) 15%, var(--card));
  border-radius: var(--radius);
  cursor: pointer;
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
  transition: var(--transition-base, all 0.2s);
  flex-shrink: 0;

  &:hover {
    background-color: color-mix(in srgb, var(--accent) 25%, var(--card));
  }
`;

export const MemoContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const MemoIcon = styled.div`
  font-size: 1rem;
  flex-shrink: 0;
`;

export const MemoDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

export const MemoText = styled.p`
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
  margin: 0 0 0.25rem 0;
  word-break: break-word;
`;

export const MemoDate = styled.p`
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin: 0;
`;

// 모달 폼 스타일
export const ModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const FormTitleInput = styled.input`
  width: 100%;
  padding: 0.75rem 0;
  font-size: 1.125rem;
  border-bottom: 2px solid var(--border);
  background-color: transparent;
  color: var(--foreground);
  outline: none;
  transition: var(--transition-base, all 0.2s);

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
  gap: 0.25rem;
`;

export const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.875rem;
  background-color: var(--background);
  color: var(--foreground);
  outline: none;
  transition: var(--transition-base, all 0.2s);

  &:focus {
    border-color: var(--ring);
    box-shadow: 0 0 0 2px var(--ring);
  }
`;

export const ColorPickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ColorPickerLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
`;

export const ColorPickerGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ColorPickerButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid ${props => (props.$isSelected ? 'var(--foreground)' : 'var(--border)')};
  background-color: ${props => props.$color};
  transition: var(--transition-base, all 0.2s);
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
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.875rem;
  background-color: var(--background);
  color: var(--foreground);
  resize: none;
  outline: none;
  transition: var(--transition-base, all 0.2s);

  &:focus {
    border-color: var(--ring);
    box-shadow: 0 0 0 2px var(--ring);
  }

  &::placeholder {
    color: var(--muted-foreground);
  }
`;

export const FormDateInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.875rem;
  background-color: var(--background);
  color: var(--foreground);
  outline: none;
  transition: var(--transition-base, all 0.2s);

  &:focus {
    border-color: var(--ring);
    box-shadow: 0 0 0 2px var(--ring);
  }
`;

export const ModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 0.5rem;
`;

// 경고 박스
export const WarningBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background-color: color-mix(in srgb, var(--accent) 20%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
  border-radius: var(--radius);
`;

export const WarningContent = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const WarningTitle = styled.p`
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
  margin: 0 0 0.25rem 0;
`;

export const WarningDescription = styled.p`
  font-size: 0.875rem;
  color: var(--muted-foreground);
  margin: 0;
`;

// 일정 상세 모달 스타일
export const EventDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const EventDetailCard = styled.div`
  padding: 1rem;
  border-radius: var(--radius);
  background-color: ${props => `${props.$color}10`};
  border-left: 0.25rem solid ${props => props.$color};
`;

export const EventDetailTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
  margin: 0 0 0.5rem 0;
`;

export const EventDetailInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

export const EventDetailText = styled.p`
  color: var(--muted-foreground);
  margin: 0;
`;

export const ModalDateHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;
  margin-top: -0.5rem;
`;

export const ModalDateTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
  margin: 0;
`;

// 인라인 스타일 대체용 styled 컴포넌트
export const CalendarLeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CalendarButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const CategorySelect = styled.select`
  height: 2.25rem;
  padding: 0 0.75rem;
  border-radius: 0.375rem;
  border: 2px solid var(--border);
  background-color: var(--background);
  color: var(--foreground);
  font-size: 0.75rem;
  min-width: 6.875rem;
  outline: none;
  transition: var(--transition-base, all 0.2s);

  &:focus {
    border-color: var(--primary);
  }
`;

export const EventsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const EventsSectionLabel = styled(FormLabel)`
  margin-bottom: 0.5rem;
  display: block;
`;

export const MemoActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 0.5rem;
`;

export const MemoActionsLeft = styled.div`
  display: flex;
  align-items: center;
`;

export const MemoActionsRight = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const MemoDeleteButton = styled(Button)`
  color: var(--destructive);
  border: 1px solid var(--destructive);
  background-color: color-mix(in srgb, var(--destructive) 10%, transparent);

  &:hover {
    background-color: color-mix(in srgb, var(--destructive) 20%, transparent);
    color: var(--destructive);
  }
`;

export const IconWithMargin = styled.span`
  margin-right: 0.5rem;
`;

export const UpcomingEventsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-height: 0;
`;
