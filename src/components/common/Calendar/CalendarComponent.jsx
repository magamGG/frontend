import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import { ChevronLeft, ChevronRight, Plus, AlignLeft, Palette, Save, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  CalendarRoot,
  CalendarBody,
  CalendarLayoutGrid,
  CalendarCard,
  CalendarHeader,
  CalendarHeaderLeft,
  CalendarMonthTitle,
  CalendarHeaderRight,
  AttendanceLegend,
  LegendItem,
  LegendColorBox,
  LegendLabel,
  CalendarGridContainer,
  DaysOfWeekGrid,
  DayOfWeekHeader,
  DatesGrid,
  DateCell,
  DateNumberWrapper,
  DateNumber,
  AttendanceBadge,
  DateEventsArea,
  EventBar,
  DateMemo,
  UpcomingEventsSidebar,
  UpcomingEventsCard,
  UpcomingEventsTitle,
  WorkEventsSection,
  SectionHeader,
  SectionDot,
  SectionTitle,
  SectionCount,
  UpcomingEventsList,
  UpcomingEventItem,
  UpcomingEventContent,
  UpcomingEventColorBar,
  UpcomingEventDetails,
  UpcomingEventTitle,
  UpcomingEventDate,
  UpcomingEventDuration,
  EmptyState,
  Divider,
  MemoSection,
  MemoItem,
  MemoContent,
  MemoIcon,
  MemoDetails,
  MemoText,
  MemoDate,
  ModalForm,
  FormTitleInput,
  FormRow,
  FormLabel,
  FormSelect,
  ColorPickerContainer,
  ColorPickerLabel,
  ColorPickerGrid,
  ColorPickerButton,
  FormTextarea,
  FormDateInput,
  ModalActions,
  WarningBox,
  WarningContent,
  WarningTitle,
  WarningDescription,
  EventDetailContainer,
  EventDetailCard,
  EventDetailTitle,
  EventDetailInfo,
  EventDetailText,
  ModalDateHeader,
  ModalDateTitle,
  FilterCard,
  FilterRow,
  FilterField,
  FilterLabel,
  FilterSelect,
  CalendarLeftColumn,
  CalendarButtonGroup,
  CategorySelect,
  EventsListContainer,
  EventsSectionLabel,
  MemoActionsContainer,
  MemoActionsLeft,
  MemoActionsRight,
  MemoDeleteButton,
  UpcomingEventsContent,
  IconWithMargin,
  GroupedEventBar,
} from './CalendarComponent.styled';

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

// 작업 단계 정의
const WORK_STAGES = [
  { value: 'storyboard', label: '콘티', color: '#FCD34D' },
  { value: 'sketch', label: '스케치', color: '#FB923C' },
  { value: 'lineart', label: '선화', color: '#60A5FA' },
  { value: 'coloring', label: '채색', color: '#F472B6' },
  { value: 'background', label: '배경', color: '#4ADE80' },
  { value: 'effects', label: '후보정', color: '#A78BFA' },
  { value: 'review', label: '검수', color: '#F87171' },
];

// 색상 프리셋
const COLOR_PRESETS = [
  { color: '#EF4444', name: '빨강' },
  { color: '#F59E0B', name: '주황' },
  { color: '#10B981', name: '초록' },
  { color: '#3B82F6', name: '파랑' },
  { color: '#6E8FB3', name: '스틸블루' },
  { color: '#8B5CF6', name: '보라' },
  { color: '#EC4899', name: '핑크' },
  { color: '#6B7280', name: '회색' },
];

// 보기 월 초기값: 미지정 시 오늘 날짜 기준 월, "2026년 1월" 형태 문자열이면 해당 월
function parseInitialViewDate(currentMonthStr) {
  const match = String(currentMonthStr || '').match(/(\d{4})년\s*(\d{1,2})월/);
  if (match) {
    return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, 1);
  }
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
}

// 해당 월의 1일 요일 (0=일..6=토), 해당 월 일수, 이전 달 일수
function getMonthInfo(year, month) {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const prevLast = new Date(year, month - 1, 0);
  return {
    firstDayOfWeek: first.getDay(),
    daysInMonth: last.getDate(),
    daysInPrevMonth: prevLast.getDate(),
  };
}

// 그리드용 셀 배열 생성 (이전달 말 + 당월 + 다음달 초)
function buildCalendarCells(year, month) {
  const { firstDayOfWeek, daysInMonth, daysInPrevMonth } = getMonthInfo(year, month);
  const cells = [];
  const prevStart = daysInPrevMonth - firstDayOfWeek + 1;
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push({ type: 'prev', day: prevStart + i, year, month: month - 1 || 12, yearForPrev: month === 1 ? year - 1 : year, monthForPrev: month === 1 ? 12 : month - 1 });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ type: 'current', day: d, year, month });
  }
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
  const nextCount = totalCells - firstDayOfWeek - daysInMonth;
  for (let i = 0; i < nextCount; i++) {
    cells.push({ type: 'next', day: i + 1, year, month: month + 1 > 12 ? 1 : month + 1, yearForNext: month === 12 ? year + 1 : year, monthForNext: month === 12 ? 1 : month + 1 });
  }
  return cells;
}

export function CalendarComponent({
  // Props
  /** 초기 표시 월. 미지정 시 오늘 날짜 기준 월 ("2026년 1월" 형태로 지정 가능) */
  currentMonth,
  events = [],
  attendanceData = [],
  dayNotes = [],
  filterCategory = 'all',
  onFilterCategoryChange,
  showArtistFilter = false,
  artists = [],
  selectedArtist = 'all',
  onArtistChange,
  showProjectFilter = false,
  projects = [],
  selectedProject = '',
  onProjectChange,
  /** 작가 캘린더: 프로젝트별 필터 (펼치면 프로젝트 목록, 선택 시 해당 업무만 표시) */
  useProjectFilter = false,
  projectListForFilter = [],
  selectedProjectFilter = '',
  onProjectFilterChange,
  onEventAdd,
  onEventDelete,
  onNoteSave,
  onNoteDelete,
  openAttendanceModal,
  onCloseAttendanceModal,
  LeaveRequestModalComponent,
  /** 보기 월 변경 시 호출 (아티스트 캘린더에서 월별 칸반 카드 로드용) */
  onViewMonthChange,
  /** 마감임박 업무 (ENDED_AT >= 오늘). 있으면 사이드바에 이 목록 사용 */
  deadlineEvents = [],
  /** true이면 작품 관련 섹션을 마감임박 업무로만 사용 (빈 경우 "마감 임박 업무가 없습니다" 표시) */
  useDeadlineSection = false,
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(openAttendanceModal || false);
  const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false);
  const [showDeleteMemoConfirm, setShowDeleteMemoConfirm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCellYear, setSelectedCellYear] = useState(null);
  const [selectedCellMonth, setSelectedCellMonth] = useState(null);
  const [isGroupedEventsModalOpen, setIsGroupedEventsModalOpen] = useState(false);
  const [groupedEventsData, setGroupedEventsData] = useState(null);

  // 보기 연/월 (이전/다음 버튼으로 변경)
  const [viewDate, setViewDate] = useState(() => parseInitialViewDate(currentMonth));
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth() + 1;
  const currentMonthTitle = `${viewYear}년 ${viewMonth}월`;

  useEffect(() => {
    onViewMonthChange?.(viewYear, viewMonth);
  }, [viewYear, viewMonth, onViewMonthChange]);

  const today = new Date();
  const currentDay = today.getDate();
  const currentYear = today.getFullYear();
  const currentMonthNum = today.getMonth() + 1;

  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: '',
    endDate: '',
    category: 'work',
    project: '내 웹툰',
    color: 'var(--accent)',
    description: '',
    workType: 'serialization',
    workStage: '',
  });
  const [currentNote, setCurrentNote] = useState('');

  // openAttendanceModal prop 변경 감지
  useEffect(() => {
    if (openAttendanceModal) {
      setIsAttendanceModalOpen(true);
    }
  }, [openAttendanceModal]);

  // 작업 단계로 색상 가져오기
  const getWorkStageColor = (stage) => {
    if (!stage) return null;
    const stageInfo = WORK_STAGES.find((s) => s.value === stage);
    return stageInfo ? stageInfo.color : null;
  };

  // 작업 단계로 라벨 가져오기
  const getWorkStageLabel = (stage) => {
    if (!stage) return '';
    const stageInfo = WORK_STAGES.find((s) => s.value === stage);
    return stageInfo ? stageInfo.label : '';
  };

  // 웹툰 제목 자르기 (4글자 초과 시)
  const truncateProjectName = (name) => {
    if (!name) return '';
    if (name.length > 4) {
      return name.substring(0, 4) + '...';
    }
    return name;
  };

  // 특정 날짜에 근태가 있는지 확인 (year, month: 보는 달 기준)
  const getAttendanceForDate = (day, year, month) => {
    if (!attendanceData || attendanceData.length === 0) return null;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    for (const attendance of attendanceData) {
      // status가 있으면 확인, 없으면 승인된 것으로 간주 (관리자 캘린더 데이터)
      const status = String(attendance.status || 'approved').toLowerCase();
      if (status !== 'approved') continue;

      // YYYY-MM-DD 형식의 문자열 비교 (타임존 방지)
      const start = attendance.startDate ? attendance.startDate.slice(0, 10) : '';
      const end = attendance.endDate ? attendance.endDate.slice(0, 10) : '';

      if (dateStr >= start && dateStr <= end) {
        return attendance.type;
      }
    }
    return null;
  };

  // 필터링된 일정 (프로젝트 필터 우선, 없으면 개인/작품 필터)
  const filteredEvents = events.filter((event) => {
    if (useProjectFilter) {
      if (!selectedProjectFilter) return true;
      const proj = projectListForFilter.find((p) => String(p.projectNo) === String(selectedProjectFilter));
      if (!proj) return true;
      return event.projectNo != null && Number(event.projectNo) === Number(selectedProjectFilter)
        || (event.project != null && event.project === proj.projectName);
    }
    if (filterCategory === 'all') return true;
    return event.category === filterCategory;
  });

  const displayMonth = selectedCellMonth ?? viewMonth;
  const displayYear = selectedCellYear ?? viewYear;

  // 선택된 날짜의 일정들 (해당 날짜가 기간에 포함되면 표시 — 시작일이 아니어도 포함)
  const selectedDateEvents = selectedDate
    ? filteredEvents.filter((e) => {
      const start = e.startDate ?? e.date;
      const end = e.endDate ?? e.date;
      return start != null && end != null && selectedDate >= start && selectedDate <= end;
    })
    : [];

  // 다가오는 일정 (오늘 기준 이후, 정렬됨)
  const upcomingEvents = filteredEvents
    .filter((e) => e.date >= currentDay)
    .sort((a, b) => a.date - b.date)
    .slice(0, 5);

  const handleDateClick = (cellOrDay) => {
    const cell = typeof cellOrDay === 'number'
      ? { type: 'current', day: cellOrDay, yearForPrev: viewYear, monthForPrev: viewMonth, yearForNext: viewYear, monthForNext: viewMonth }
      : cellOrDay;
    // 이전 달/다음 달(블러) 셀 클릭 시 꺽쇠처럼 해당 달로만 이동, 모달은 열지 않음
    if (cell.type === 'prev' || cell.type === 'next') {
      const y = cell.type === 'prev' ? (cell.yearForPrev ?? viewYear) : (cell.yearForNext ?? viewYear);
      const m = cell.type === 'prev' ? (cell.monthForPrev ?? (viewMonth - 1 || 12)) : (cell.monthForNext ?? (viewMonth === 12 ? 1 : viewMonth + 1));
      setViewDate(new Date(y, m - 1, 1));
      return;
    }
    const day = cell.day;
    const y = viewYear;
    const m = viewMonth;
    setSelectedDate(day);
    setSelectedCellYear(y);
    setSelectedCellMonth(m);
    const dayNote = dayNotes.find((n) => n.date === day);
    setCurrentNote(dayNote?.note || '');
    setIsDayDetailModalOpen(true);
  };

  const handleSaveNote = () => {
    if (selectedDate === null) return;

    const existingNoteIndex = dayNotes.findIndex((n) => n.date === selectedDate);
    if (currentNote.trim()) {
      if (existingNoteIndex >= 0) {
        onNoteSave && onNoteSave(selectedDate, currentNote);
      } else {
        onNoteSave && onNoteSave(selectedDate, currentNote);
      }
      toast.success('메모가 저장되었습니다.');
    } else {
      if (existingNoteIndex >= 0) {
        onNoteDelete && onNoteDelete(selectedDate);
        toast.success('메모가 삭제되었습니다.');
      }
    }
  };

  const handleAddEvent = () => {
    const event = {
      id: Date.now().toString(),
      date: parseInt(newEvent.startDate.split('-')[2]) || 1,
      title: newEvent.title,
      workType: newEvent.workType,
      category: newEvent.category,
      project: newEvent.category === 'work' ? newEvent.project : undefined,
      description: newEvent.description,
      color: newEvent.color,
      workStage: newEvent.workStage,
      startDate: newEvent.startDate ? parseInt(newEvent.startDate.split('-')[2]) : undefined,
      endDate: newEvent.endDate ? parseInt(newEvent.endDate.split('-')[2]) : undefined,
    };
    onEventAdd && onEventAdd(event);
    setIsAddModalOpen(false);
    setNewEvent({
      title: '',
      startDate: '',
      endDate: '',
      category: 'work',
      project: '내 웹툰',
      color: 'var(--accent)',
      description: '',
      workType: 'serialization',
      workStage: '',
    });
    toast.success('캘린더가 추가되었습니다.');
  };

  const handleDeleteEvent = (eventId) => {
    onEventDelete && onEventDelete(eventId);
    setSelectedDate(null);
    toast.success('캘린더가 삭제되었습니다.');
  };

  // 메모 클릭 핸들러 - 날짜 클릭과 동일하게 동작
  const handleMemoClick = (date) => {
    setSelectedDate(date);
    setSelectedCellYear(viewYear);
    setSelectedCellMonth(viewMonth);
    const dayNote = dayNotes.find((n) => n.date === date);
    setCurrentNote(dayNote?.note || '');
    setIsDayDetailModalOpen(true);
  };

  // 메모 삭제 확인 핸들러
  const handleDeleteMemoClick = () => {
    if (selectedDate === null) return;
    setShowDeleteMemoConfirm(true);
  };

  // 메모 삭제 실행 핸들러
  const handleDeleteMemoConfirm = () => {
    if (selectedDate === null) return;

    onNoteDelete && onNoteDelete(selectedDate);
    setCurrentNote('');
    toast.success('메모가 삭제되었습니다.');
    setIsDayDetailModalOpen(false);
    setSelectedDate(null);
    setShowDeleteMemoConfirm(false);
  };

  // 그룹화된 일정 클릭 핸들러
  const handleGroupedEventsClick = (groupedData) => {
    setGroupedEventsData(groupedData);
    setIsGroupedEventsModalOpen(true);
  };

  return (
    <CalendarRoot>
      <CalendarBody>
        <CalendarLayoutGrid>
          {/* Left Column - Calendar (2/3) */}
          <CalendarLeftColumn>
            {/* 필터 영역 (담당자 캘린더용) */}
            {showArtistFilter && (
              <FilterCard>
                <FilterRow>
                  <FilterField>
                    <FilterLabel>작가 선택</FilterLabel>
                    <FilterSelect
                      value={selectedArtist}
                      onChange={(e) => {
                        onArtistChange && onArtistChange(e.target.value);
                      }}
                    >
                      <option value="all">전체 작가</option>
                      {artists.map((artist) => (
                        <option key={artist.id} value={artist.id}>
                          {artist.name}
                        </option>
                      ))}
                    </FilterSelect>
                  </FilterField>

                  {showProjectFilter && (
                    <FilterField>
                      <FilterLabel>웹툰 선택</FilterLabel>
                      <FilterSelect value={selectedProject} onChange={(e) => onProjectChange && onProjectChange(e.target.value)}>
                        <option value="">전체 작품</option>
                        {projects.map((project) => (
                          <option key={project} value={project}>
                            {project}
                          </option>
                        ))}
                      </FilterSelect>
                    </FilterField>
                  )}
                </FilterRow>
              </FilterCard>
            )}

            {/* 캘린더 카드 */}
            <CalendarCard>
              <CalendarHeader>
                <CalendarHeaderLeft>
                  <CalendarMonthTitle>{currentMonthTitle}</CalendarMonthTitle>
                  <CalendarButtonGroup>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                      aria-label="이전 달"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                      aria-label="다음 달"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CalendarButtonGroup>
                </CalendarHeaderLeft>

                <CalendarHeaderRight>
                  <AttendanceLegend>
                    <LegendItem>
                      <LegendColorBox $backgroundColor="color-mix(in srgb, #9333ea 28%, transparent)" $borderColor="color-mix(in srgb, #9333ea 50%, transparent)" />
                      <LegendLabel>워케이션</LegendLabel>
                    </LegendItem>
                    <LegendItem>
                      <LegendColorBox $backgroundColor="color-mix(in srgb, #f97316 28%, transparent)" $borderColor="color-mix(in srgb, #f97316 50%, transparent)" />
                      <LegendLabel>재택근무</LegendLabel>
                    </LegendItem>
                    <LegendItem>
                      <LegendColorBox $backgroundColor="color-mix(in srgb, #6b7280 28%, transparent)" $borderColor="color-mix(in srgb, #6b7280 50%, transparent)" />
                      <LegendLabel>휴가</LegendLabel>
                    </LegendItem>
                  </AttendanceLegend>

                  {useProjectFilter ? (
                    <CategorySelect
                      value={selectedProjectFilter}
                      onChange={(e) => onProjectFilterChange && onProjectFilterChange(e.target.value)}
                      title="프로젝트별로 일정 필터"
                    >
                      <option value="">전체</option>
                      {projectListForFilter.map((p) => (
                        <option key={p.projectNo} value={p.projectNo}>
                          {p.projectName || `프로젝트 ${p.projectNo}`}
                        </option>
                      ))}
                    </CategorySelect>
                  ) : (
                    <CategorySelect
                      value={filterCategory}
                      onChange={(e) => onFilterCategoryChange && onFilterCategoryChange(e.target.value)}
                    >
                      <option value="all">전체</option>
                      <option value="personal">개인 일정</option>
                      <option value="work">작품 일정</option>
                    </CategorySelect>
                  )}
                </CalendarHeaderRight>
              </CalendarHeader>

              <CalendarGridContainer>
                {/* Days of week */}
                <DaysOfWeekGrid>
                  {daysOfWeek.map((day) => (
                    <DayOfWeekHeader key={day}>{day}</DayOfWeekHeader>
                  ))}
                </DaysOfWeekGrid>

                {/* Calendar dates grid - 해당 월 기준 이전달 말 + 당월 + 다음달 초 */}
                <DatesGrid>
                  {buildCalendarCells(viewYear, viewMonth).map((cell, idx) => {
                    const isOtherMonth = cell.type !== 'current';
                    const cellYear = cell.type === 'current' ? viewYear : cell.type === 'prev' ? (cell.yearForPrev ?? viewYear) : (cell.yearForNext ?? viewYear);
                    const cellMonth = cell.type === 'current' ? viewMonth : cell.type === 'prev' ? (cell.monthForPrev ?? (viewMonth === 1 ? 12 : viewMonth - 1)) : (cell.monthForNext ?? (viewMonth === 12 ? 1 : viewMonth + 1));
                    const dayOfWeek = new Date(cellYear, cellMonth - 1, cell.day).getDay();
                    const isSunday = dayOfWeek === 0;
                    const isToday = !isOtherMonth && viewYear === currentYear && viewMonth === currentMonthNum && cell.day === currentDay;
                    const attendanceType = getAttendanceForDate(cell.day, cellYear, cellMonth);
                    const dayEvents = cell.type === 'current'
                      ? filteredEvents.filter((e) => {
                        const start = e.startDate ?? e.date;
                        const end = e.endDate ?? e.date;
                        return start != null && end != null && cell.day >= start && cell.day <= end;
                      })
                      : [];
                    const dayNote = cell.type === 'current' ? dayNotes.find((n) => n.date === cell.day) : null;

                    return (
                      <DateCell
                        key={`${cell.type}-${cell.day}-${idx}`}
                        onClick={() => handleDateClick(cell)}
                        $isToday={isToday}
                        $attendanceType={attendanceType}
                        $isSunday={isSunday}
                        $isOtherMonth={isOtherMonth}
                      >
                        <DateNumberWrapper>
                          <DateNumber $isToday={isToday} $isSunday={isSunday} $isOtherMonth={isOtherMonth}>{cell.day}</DateNumber>
                        </DateNumberWrapper>

                        {cell.type === 'current' && (
                          <>
                            <DateEventsArea>
                              {(() => {
                                const viewMonthDays = getMonthInfo(viewYear, viewMonth).daysInMonth;

                                // 이 날짜에 표시할 막대들을 수집
                                const barsToRender = [];

                                dayEvents.forEach(event => {
                                  // 워케이션, 재택근무, 휴가는 막대 대신 칸 채우기로 표시하므로 막대 렌더링에서 제외
                                  if (event.category === 'leave') return;

                                  const startDay = event.startDate ?? event.date;
                                  const endDay = event.endDate ?? event.date;

                                  // 이 셀에서 막대를 시작해야 하는지 판단
                                  // 1. 실제 시작일이거나
                                  // 2. 일요일(주의 첫날)이면서 이전부터 진행 중인 일정
                                  const isStarting = startDay === cell.day ||
                                    (dayOfWeek === 0 && startDay < cell.day && endDay >= cell.day);

                                  if (isStarting) {
                                    const daysUntilSaturday = 6 - dayOfWeek;
                                    const lastDayOfWeek = cell.day + daysUntilSaturday;

                                    // 이번 주 토요일까지, 또는 일정 종료일까지 중 더 빠른 날까지 표시
                                    const displayEndDay = Math.min(endDay, lastDayOfWeek, viewMonthDays);
                                    const daySpan = displayEndDay - cell.day + 1;
                                    const barWidth = daySpan > 1 ? `calc(${daySpan * 100}% + ${(daySpan - 1) * 2}px)` : '100%';

                                    barsToRender.push({
                                      event,
                                      daySpan,
                                      barWidth,
                                      startDay,
                                      endDay
                                    });
                                  }
                                });

                                // 행(row) 배정: 겹치는 막대는 다른 행에 배치
                                const rows = [];
                                barsToRender.forEach(bar => {
                                  const { startDay, endDay } = bar;

                                  // 이 막대와 겹치지 않는 행 찾기
                                  let rowIndex = 0;
                                  while (rows[rowIndex]) {
                                    const hasOverlap = rows[rowIndex].some(existingBar => {
                                      // 현재 주에서의 표시 범위로 겹침 체크
                                      const daysUntilSaturday = 6 - dayOfWeek;
                                      const lastDayOfWeek = cell.day + daysUntilSaturday;
                                      const thisEnd = Math.min(endDay, lastDayOfWeek, viewMonthDays);
                                      const existingEnd = Math.min(existingBar.endDay, lastDayOfWeek, viewMonthDays);

                                      return cell.day <= existingEnd && cell.day <= thisEnd;
                                    });

                                    if (!hasOverlap) break;
                                    rowIndex++;
                                  }

                                  if (!rows[rowIndex]) rows[rowIndex] = [];
                                  rows[rowIndex].push(bar);
                                  bar.row = rowIndex;
                                });

                                // 렌더링
                                return barsToRender.map((bar, idx) => {
                                  const { event, barWidth, daySpan, row } = bar;
                                  const displayColor = getWorkStageColor(event.workStage) || event.color || 'var(--accent)';
                                  const displayTitle = event.title || '업무';

                                  return (
                                    <EventBar
                                      key={`${event.id ?? idx}-${cell.day}`}
                                      $color={displayColor}
                                      $width={barWidth}
                                      $isMultiDay={daySpan > 1}
                                      $topOffset={row}
                                    >
                                      {displayTitle}
                                    </EventBar>
                                  );
                                });
                              })()}
                            </DateEventsArea>

                            {dayNote && (
                              <DateMemo
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDateClick(cell);
                                }}
                              >
                                📝 {dayNote.note}
                              </DateMemo>
                            )}
                          </>
                        )}
                      </DateCell>
                    );
                  })}
                </DatesGrid>
              </CalendarGridContainer>
            </CalendarCard>
          </CalendarLeftColumn>

          {/* Right Column - Upcoming Events (1/3) */}
          <UpcomingEventsSidebar>
            <UpcomingEventsCard>
              <UpcomingEventsTitle>마감임박 업무</UpcomingEventsTitle>
              <UpcomingEventsContent>
                {/* 마감임박 업무 (deadlineEvents 있으면 API 데이터, 없으면 기존 월 내 일정) */}
                <WorkEventsSection>
                  <SectionHeader>
                    <SectionDot $color="var(--primary)" />
                    <SectionTitle>작품 관련</SectionTitle>
                    <SectionCount>{useDeadlineSection ? '마감일 순' : '최근 3개'}</SectionCount>
                  </SectionHeader>
                  <UpcomingEventsList>
                    {(useDeadlineSection ? deadlineEvents.slice(0, 10) : upcomingEvents.filter((e) => e.category === 'work').slice(0, 3))
                      .map((event, idx) => {
                        const isDeadline = useDeadlineSection;
                        const displayColor = isDeadline ? (event.color || 'var(--accent)') : (getWorkStageColor(event.workStage) || event.color || 'var(--accent)');
                        const endDateStr = isDeadline ? event.endDate : null;
                        const endParts = endDateStr ? endDateStr.split('-').map(Number) : null;
                        const startDateStr = isDeadline ? event.startDate : null;
                        const startParts = startDateStr ? startDateStr.split('-').map(Number) : null;
                        const displayMonth = endParts ? endParts[1] : viewMonth;
                        const displayDay = endParts ? endParts[2] : event.date;
                        const dateRangeLabel = isDeadline && startParts && endParts
                          ? (startParts[1] === endParts[1] && startParts[2] === endParts[2]
                            ? `${endParts[1]}월 ${endParts[2]}일`
                            : `${startParts[1]}월 ${startParts[2]}일 ~ ${endParts[1]}월 ${endParts[2]}일`)
                          : null;
                        const handleClick = () => {
                          if (isDeadline && endParts) {
                            const [y, m, d] = endParts;
                            setViewDate(new Date(y, m - 1, d));
                            setSelectedDate(d);
                            setSelectedCellYear(y);
                            setSelectedCellMonth(m);
                            const dayNote = dayNotes.find((n) => n.date === d);
                            setCurrentNote(dayNote?.note || '');
                            setIsDayDetailModalOpen(true);
                          } else {
                            handleDateClick(event.date);
                          }
                        };
                        return (
                          <UpcomingEventItem key={isDeadline ? (event.id ?? idx) : idx} onClick={handleClick}>
                            <UpcomingEventContent>
                              <UpcomingEventColorBar $color={displayColor} />
                              <UpcomingEventDetails>
                                <UpcomingEventTitle>
                                  {event.title || '업무'}
                                </UpcomingEventTitle>
                                <UpcomingEventDate>
                                  {isDeadline && dateRangeLabel ? dateRangeLabel : `${displayMonth}월 ${displayDay}일`}
                                </UpcomingEventDate>
                                {!isDeadline && event.startDate != null && event.endDate != null && event.startDate !== event.endDate && (
                                  <UpcomingEventDuration>
                                    ({event.endDate - event.startDate + 1}일 작업)
                                  </UpcomingEventDuration>
                                )}
                              </UpcomingEventDetails>
                            </UpcomingEventContent>
                          </UpcomingEventItem>
                        );
                      })}

                    {!useDeadlineSection && upcomingEvents.filter((e) => e.category === 'work').length === 0 && (
                      <EmptyState>예정된 작품 일정이 없습니다</EmptyState>
                    )}
                    {useDeadlineSection && deadlineEvents.length === 0 && (
                      <EmptyState>마감 임박 업무가 없습니다</EmptyState>
                    )}
                  </UpcomingEventsList>
                </WorkEventsSection>

                <Divider />

                {/* 메모 */}
                <MemoSection>
                  <SectionHeader>
                    <SectionDot $color="var(--accent)" />
                    <SectionTitle>메모</SectionTitle>
                    <SectionCount>최근 3개</SectionCount>
                  </SectionHeader>
                  <UpcomingEventsList>
                    {dayNotes
                      .map((note) => ({
                        ...note,
                        daysFromToday: Math.abs(note.date - currentDay),
                      }))
                      .sort((a, b) => {
                        if (a.daysFromToday !== b.daysFromToday) {
                          return a.daysFromToday - b.daysFromToday;
                        }
                        return b.date - a.date;
                      })
                      .slice(0, 3)
                      .map((note, idx) => (
                        <MemoItem key={idx} onClick={() => handleMemoClick(note.date)}>
                          <MemoContent>
                            <MemoIcon>📝</MemoIcon>
                            <MemoDetails>
                              <MemoText>{note.note}</MemoText>
                              <MemoDate>{viewMonth}월 {note.date}일</MemoDate>
                            </MemoDetails>
                          </MemoContent>
                        </MemoItem>
                      ))}

                    {dayNotes.length === 0 && <EmptyState>저장된 메모가 없습니다</EmptyState>}
                  </UpcomingEventsList>
                </MemoSection>
              </UpcomingEventsContent>
            </UpcomingEventsCard>
          </UpcomingEventsSidebar>
        </CalendarLayoutGrid>
      </CalendarBody>

      {/* 캘린더 추가 모달 */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="캘린더 추가" maxWidth="xl">
        <ModalForm>
          <FormTitleInput
            type="text"
            placeholder="제목 추가"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />

          <FormRow>
            <FormLabel>시작 날짜</FormLabel>
            <FormDateInput
              type="date"
              value={newEvent.startDate}
              onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
            />
          </FormRow>

          <FormRow>
            <FormLabel>종료 날짜</FormLabel>
            <FormDateInput
              type="date"
              value={newEvent.endDate}
              onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
            />
          </FormRow>

          <FormRow>
            <FormLabel>유형</FormLabel>
            <FormSelect
              value={newEvent.workType}
              onChange={(e) => setNewEvent({ ...newEvent, workType: e.target.value })}
            >
              <option value="serialization">연재</option>
              <option value="break">휴가</option>
            </FormSelect>
          </FormRow>

          <FormRow>
            <FormLabel>작업 단계</FormLabel>
            <FormSelect
              value={newEvent.workStage}
              onChange={(e) => setNewEvent({ ...newEvent, workStage: e.target.value })}
            >
              <option value="">선택 안 함</option>
              {WORK_STAGES.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </FormSelect>
          </FormRow>

          <FormRow>
            <FormLabel>카테고리</FormLabel>
            <FormSelect
              value={newEvent.category}
              onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
            >
              <option value="personal">개인 일정</option>
              <option value="work">작품 일정</option>
            </FormSelect>
          </FormRow>

          {newEvent.category === 'work' && (
            <FormRow>
              <FormLabel>작품</FormLabel>
              <FormSelect
                value={newEvent.project}
                onChange={(e) => setNewEvent({ ...newEvent, project: e.target.value })}
              >
                <option value="내 웹툰">내 웹툰</option>
                <option value="신작">신작</option>
              </FormSelect>
            </FormRow>
          )}

          <FormRow>
            <ColorPickerContainer>
              <ColorPickerLabel>
                <Palette className="w-4 h-4" />
                색상
              </ColorPickerLabel>
              <ColorPickerGrid>
                {COLOR_PRESETS.map((preset) => (
                  <ColorPickerButton
                    key={preset.color}
                    type="button"
                    onClick={() => setNewEvent({ ...newEvent, color: preset.color })}
                    $color={preset.color}
                    $isSelected={newEvent.color === preset.color}
                    title={preset.name}
                  />
                ))}
              </ColorPickerGrid>
            </ColorPickerContainer>
          </FormRow>

          <FormRow>
            <ColorPickerLabel>
              <AlignLeft className="w-4 h-4" />
              설명
            </ColorPickerLabel>
            <FormTextarea
              placeholder="설명 추가"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              rows={3}
            />
          </FormRow>

          <ModalActions>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddEvent}>저장</Button>
          </ModalActions>
        </ModalForm>
      </Modal>

      {/* 날짜 클릭 시 캘린더 및 메모 모달 */}
      <Modal
        isOpen={isDayDetailModalOpen}
        onClose={() => setIsDayDetailModalOpen(false)}
        title={
          selectedDate !== null ? (
            <ModalDateHeader>
              <ModalDateTitle>{displayMonth}월 {selectedDate}일</ModalDateTitle>

            </ModalDateHeader>
          ) : ''
        }
        maxWidth="lg"
      >
        {selectedDate !== null && (
          <EventDetailContainer>
            {selectedDateEvents.length > 0 && (
              <div>
                <EventsSectionLabel>일정</EventsSectionLabel>
                <EventsListContainer>
                  {selectedDateEvents.map((event, idx) => (
                    <EventDetailCard key={idx} $color={event.color || 'var(--accent)'}>
                      <EventDetailTitle>{event.title}</EventDetailTitle>
                      <EventDetailInfo>
                        <EventDetailText>
                          <strong>유형:</strong>{' '}
                          {event.workType === 'serialization' ? (
                            <Badge className="text-xs" variant="destructive">연재</Badge>
                          ) : event.workType === 'hiatus' ? (
                            <Badge className="text-xs" variant="secondary">휴재</Badge>
                          ) : event.workType === 'break' ? (
                            <Badge className="text-xs" variant="default">휴가</Badge>
                          ) : event.workType === '워케이션' ? (
                            <Badge className="text-xs" style={{ backgroundColor: '#9333ea', color: 'white' }}>워케이션</Badge>
                          ) : event.workType === '재택근무' ? (
                            <Badge className="text-xs" style={{ backgroundColor: '#f97316', color: 'white' }}>재택근무</Badge>
                          ) : event.workType === '휴가' ? (
                            <Badge className="text-xs" variant="default">휴가</Badge>
                          ) : event.projectStatus === '연재' ? (
                            <Badge className="text-xs" variant="destructive">연재</Badge>
                          ) : event.projectStatus === '휴재' ? (
                            <Badge className="text-xs" variant="secondary">휴재</Badge>
                          ) : event.projectStatus === '워케이션' ? (
                            <Badge className="text-xs" style={{ backgroundColor: '#9333ea', color: 'white' }}>워케이션</Badge>
                          ) : event.projectStatus === '재택근무' ? (
                            <Badge className="text-xs" style={{ backgroundColor: '#f97316', color: 'white' }}>재택근무</Badge>
                          ) : ''}
                        </EventDetailText>
                        {event.project && (
                          <EventDetailText>
                            <strong>작품:</strong> {event.project}
                          </EventDetailText>
                        )}
                        {event.assigneeName && (
                          <EventDetailText>
                            <strong>담당자:</strong> {event.assigneeName}
                          </EventDetailText>
                        )}
                        {event.description && (
                          <EventDetailText>
                            <strong>설명:</strong> {event.description}
                          </EventDetailText>
                        )}
                      </EventDetailInfo>
                    </EventDetailCard>
                  ))}
                </EventsListContainer>
              </div>
            )}

            <FormRow>
              <FormLabel>메모</FormLabel>
              <FormTextarea
                placeholder="메모를 입력하세요"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                rows={4}
              />
            </FormRow>

            <MemoActionsContainer>
              <MemoActionsLeft>
                {dayNotes.find((n) => n.date === selectedDate) && (
                  <MemoDeleteButton onClick={handleDeleteMemoClick}>
                    <IconWithMargin>
                      <Trash2 className="w-4 h-4" />
                    </IconWithMargin>
                    삭제
                  </MemoDeleteButton>
                )}
              </MemoActionsLeft>
              <MemoActionsRight>
                <Button variant="outline" onClick={() => setIsDayDetailModalOpen(false)}>
                  취소
                </Button>
                <Button
                  onClick={() => {
                    handleSaveNote();
                    setIsDayDetailModalOpen(false);
                  }}
                >
                  <IconWithMargin>
                    <Save className="w-4 h-4" />
                  </IconWithMargin>
                  저장
                </Button>
              </MemoActionsRight>
            </MemoActionsContainer>
          </EventDetailContainer>
        )}
      </Modal>

      {/* 근태 신청 모달 */}
      {LeaveRequestModalComponent && (
        <LeaveRequestModalComponent open={isAttendanceModalOpen} onOpenChange={setIsAttendanceModalOpen} />
      )}

      {/* 메모 삭제 확인 모달 */}
      <Modal isOpen={showDeleteMemoConfirm} onClose={() => { setShowDeleteMemoConfirm(false); }} title="메모 삭제 확인" maxWidth="sm">
        <WarningBox>
          <WarningContent>
            <AlertCircle className="w-5 h-5 text-destructive" />
            <div>
              <WarningTitle>정말 메모를 삭제하시겠습니까?</WarningTitle>
              <WarningDescription>삭제한 메모는 복구할 수 없습니다.</WarningDescription>
            </div>
          </WarningContent>
        </WarningBox>
        <ModalActions>
          <Button
            variant="outline"
            onClick={() => { setShowDeleteMemoConfirm(false); }}
          >
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteMemoConfirm}
          >
            삭제
          </Button>
        </ModalActions>
      </Modal>

      {/* 그룹화된 일정 목록 모달 */}
      <Modal
        isOpen={isGroupedEventsModalOpen}
        onClose={() => {
          setIsGroupedEventsModalOpen(false);
          setGroupedEventsData(null);
        }}
        title={
          groupedEventsData
            ? `${groupedEventsData.label || `${groupedEventsData.duration}일 일정`} - ${viewMonth}월 ${groupedEventsData.day}일`
            : '일정 목록'
        }
        maxWidth="lg"
      >
        {groupedEventsData && (
          <EventDetailContainer>
            <EventsSectionLabel>
              총 {groupedEventsData.events.length}개의 일정
            </EventsSectionLabel>
            <EventsListContainer>
              {groupedEventsData.events.map((event, idx) => {
                const displayColor = getWorkStageColor(event.workStage) || event.color || 'var(--accent)';
                const displayTitle = event.title || '업무';

                return (
                  <EventDetailCard key={idx} $color={displayColor}>
                    <EventDetailTitle>{displayTitle}</EventDetailTitle>
                    <EventDetailInfo>
                      <EventDetailText>
                        <strong>유형:</strong>{' '}
                        {event.workType === 'serialization' ? (
                          <Badge className="text-xs" variant="destructive">연재</Badge>
                        ) : event.workType === 'hiatus' ? (
                          <Badge className="text-xs" variant="secondary">휴재</Badge>
                        ) : event.workType === 'break' ? (
                          <Badge className="text-xs" variant="default">휴가</Badge>
                        ) : event.workType === 'workation' ? (
                          <Badge className="text-xs" style={{ backgroundColor: '#9333ea', color: 'white' }}>워케이션</Badge>
                        ) : event.workType === 'remote' ? (
                          <Badge className="text-xs" style={{ backgroundColor: '#f97316', color: 'white' }}>재택근무</Badge>
                        ) : event.projectStatus === '연재' ? (
                          <Badge className="text-xs" variant="destructive">연재</Badge>
                        ) : event.projectStatus === '휴재' ? (
                          <Badge className="text-xs" variant="secondary">휴재</Badge>
                        ) : event.projectStatus === '워케이션' ? (
                          <Badge className="text-xs" style={{ backgroundColor: '#9333ea', color: 'white' }}>워케이션</Badge>
                        ) : event.projectStatus === '재택근무' ? (
                          <Badge className="text-xs" style={{ backgroundColor: '#f97316', color: 'white' }}>재택근무</Badge>
                        ) : ''}
                      </EventDetailText>
                      {event.project && (
                        <EventDetailText>
                          <strong>작품:</strong> {event.project}
                        </EventDetailText>
                      )}
                      {event.startDate && event.endDate && (
                        <EventDetailText>
                          <strong>기간:</strong> {viewMonth}월 {event.startDate}일
                          {event.startDate !== event.endDate ? ` ~ ${viewMonth}월 ${event.endDate}일 (${event.endDate - event.startDate + 1}일)` : ''}
                        </EventDetailText>
                      )}
                      {event.assigneeName && (
                        <EventDetailText>
                          <strong>담당자:</strong> {event.assigneeName}
                        </EventDetailText>
                      )}
                      {event.description && (
                        <EventDetailText>
                          <strong>설명:</strong> {event.description}
                        </EventDetailText>
                      )}
                    </EventDetailInfo>
                  </EventDetailCard>
                );
              })}
            </EventsListContainer>
            <ModalActions>
              <Button
                variant="outline"
                onClick={() => {
                  setIsGroupedEventsModalOpen(false);
                  setGroupedEventsData(null);
                }}
              >
                닫기
              </Button>
            </ModalActions>
          </EventDetailContainer>
        )}
      </Modal>
    </CalendarRoot>
  );
}
