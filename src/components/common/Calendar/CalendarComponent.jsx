import { useState, useEffect } from 'react';
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

export function CalendarComponent({
  // Props
  currentMonth = '2026년 1월',
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
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(openAttendanceModal || false);
  const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false);
  const [showDeleteMemoConfirm, setShowDeleteMemoConfirm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isGroupedEventsModalOpen, setIsGroupedEventsModalOpen] = useState(false);
  const [groupedEventsData, setGroupedEventsData] = useState(null);
  
  // 실제 오늘 날짜 계산
  const currentDay = new Date().getDate();
  
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

  // 특정 날짜에 근태가 있는지 확인하는 함수
  const getAttendanceForDate = (day) => {
    if (!attendanceData || attendanceData.length === 0) return null;
    const dateStr = `2026-01-${day.toString().padStart(2, '0')}`;

    for (const attendance of attendanceData) {
      if (attendance.status !== 'approved') continue;

      const start = new Date(attendance.startDate);
      const end = new Date(attendance.endDate);
      const current = new Date(dateStr);

      if (current >= start && current <= end) {
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

  // 선택된 날짜의 일정들
  const selectedDateEvents = selectedDate ? filteredEvents.filter((e) => e.date === selectedDate) : [];

  // 다가오는 일정 (오늘 기준 이후, 정렬됨)
  const upcomingEvents = filteredEvents
    .filter((e) => e.date >= currentDay)
    .sort((a, b) => a.date - b.date)
    .slice(0, 5);

  const handleDateClick = (day) => {
    setSelectedDate(day);
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
                  <CalendarMonthTitle>{currentMonth}</CalendarMonthTitle>
                  <CalendarButtonGroup>
                    <Button variant="outline" size="icon">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CalendarButtonGroup>
                </CalendarHeaderLeft>

                <CalendarHeaderRight>
                  <AttendanceLegend>
                    <LegendItem>
                      <LegendColorBox $backgroundColor="color-mix(in srgb, var(--status-workation) 28%, transparent)" $borderColor="color-mix(in srgb, var(--status-workation) 50%, transparent)" />
                      <LegendLabel>워케이션</LegendLabel>
                    </LegendItem>
                    <LegendItem>
                      <LegendColorBox $backgroundColor="color-mix(in srgb, var(--status-hiatus) 28%, transparent)" $borderColor="color-mix(in srgb, var(--status-hiatus) 50%, transparent)" />
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

                {/* Calendar dates grid */}
                <DatesGrid>
                  {/* 이전 달 날짜 (흐릿하게) */}
                  {[28, 29, 30, 31].map((day) => {
                    // 1일이 목요일(4)이므로, 이전 달 31일은 수요일(3)
                    // 28일: 일요일(0), 29일: 월요일(1), 30일: 화요일(2), 31일: 수요일(3)
                    const dayOfWeek = (day - 28 + 7) % 7;
                    const isSunday = dayOfWeek === 0;
                    
                    return (
                      <DateCell
                        key={`prev-${day}`}
                        onClick={() => handleDateClick(day)}
                        $isToday={false}
                        $attendanceType={null}
                        $isSunday={isSunday}
                        $isOtherMonth={true}
                      >
                        <DateNumberWrapper>
                          <DateNumber $isToday={false} $isSunday={isSunday} $isOtherMonth={true}>{day}</DateNumber>
                        </DateNumberWrapper>
                      </DateCell>
                    );
                  })}

                  {/* 현재 달 Days */}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === currentDay;
                    const dayEvents = filteredEvents.filter((e) => e.date === day);
                    const attendanceType = getAttendanceForDate(day);
                    const dayNote = dayNotes.find((n) => n.date === day);

                    // 요일 계산 (1일이 목요일이므로 day + 3를 7로 나눈 나머지)
                    // 1일=목(4), 2일=금(5), 3일=토(6), 4일=일(0), 5일=월(1), 6일=화(2), 7일=수(3)
                    const dayOfWeek = (day + 3) % 7;
                    const isSunday = dayOfWeek === 0;

                    return (
                      <DateCell
                        key={day}
                        onClick={() => handleDateClick(day)}
                        $isToday={isToday}
                        $attendanceType={attendanceType}
                        $isSunday={isSunday}
                        $isOtherMonth={false}
                      >
                        <DateNumberWrapper>
                          <DateNumber $isToday={isToday} $isSunday={isSunday} $isOtherMonth={false}>{day}</DateNumber>
                        </DateNumberWrapper>

                        <DateEventsArea>
                          {/* 일정을 길이별로 그룹화하여 표시 */}
                          {(() => {
                            // 일정을 분류
                            const eventsByDay = [];
                            const eventsByDuration = {};

                            dayEvents.forEach((event, idx) => {
                              const isMultiDay = event.startDate && event.endDate && event.startDate !== event.endDate;
                              const isStarting = !event.startDate || event.startDate === day;

                              // 시작하는 일정만 표시
                              if (isStarting) {
                                const daysUntilSaturday = 6 - dayOfWeek;
                                const lastDayOfWeek = day + daysUntilSaturday;
                                const displayEndDate = isMultiDay ? Math.min(event.endDate, lastDayOfWeek, 31) : day;
                                const daySpan = displayEndDate - day + 1;

                                if (daySpan === 1) {
                                  // 당일 일정
                                  eventsByDay.push({ ...event, daySpan, idx });
                                } else {
                                  // 며칠짜리 일정을 길이별로 그룹화
                                  if (!eventsByDuration[daySpan]) {
                                    eventsByDuration[daySpan] = [];
                                  }
                                  eventsByDuration[daySpan].push({ ...event, daySpan, idx });
                                }
                              }
                            });

                            const result = [];
                            let currentTopOffset = 0;

                            // 며칠짜리 일정들을 길이별로 그룹화하여 표시
                            Object.keys(eventsByDuration)
                              .sort((a, b) => parseInt(a) - parseInt(b))
                              .forEach((duration) => {
                                const events = eventsByDuration[duration];
                                if (events.length > 1) {
                                  // 같은 길이의 일정이 2개 이상이면 그룹화
                                  const avgColor = events.reduce((acc, e) => {
                                    const color = getWorkStageColor(e.workStage) || e.color || 'var(--accent)';
                                    return acc;
                                  }, 'var(--accent)');
                                  const firstEvent = events[0];
                                  const displayColor = getWorkStageColor(firstEvent.workStage) || firstEvent.color || 'var(--accent)';
                                  // 실제 일정의 길이
                                  const actualDuration = parseInt(duration);
                                  // 실제 일정의 끝 날짜
                                  const actualEndDate = firstEvent.endDate || (day + actualDuration - 1);
                                  // 주의 끝 날짜 계산
                                  const daysUntilSaturday = 6 - dayOfWeek;
                                  const lastDayOfWeek = day + daysUntilSaturday;
                                  // 표시할 끝 날짜는 주의 끝, 월의 끝, 실제 일정의 끝 중 최소값
                                  const displayEndDate = actualDuration > 1 ? Math.min(actualEndDate, lastDayOfWeek, 31) : day;
                                  const displayDaySpan = displayEndDate - day + 1;
                                  // 며칠짜리 일정은 해당 일수만큼 날짜에 걸쳐 표시 (각 날짜 셀의 100% + gap)
                                  const barWidth = displayDaySpan > 1 ? `calc(${displayDaySpan * 100}% + ${(displayDaySpan - 1) * 2}px)` : '100%';

                                  result.push(
                                    <GroupedEventBar
                                      key={`grouped-${duration}-${day}`}
                                      $color={displayColor}
                                      $width={barWidth}
                                      $isMultiDay={displayDaySpan > 1}
                                      $topOffset={currentTopOffset}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleGroupedEventsClick({
                                          day,
                                          duration: parseInt(duration),
                                          events,
                                        });
                                      }}
                                    >
                                      {events.length}개의 일정...
                                    </GroupedEventBar>
                                  );
                                  // 다음 일정을 위해 top offset 증가 (일정 높이 + gap)
                                  currentTopOffset += 1.5 + 2; // height(1.5rem) + gap(2px)
                                } else {
                                  // 단일 일정은 개별 표시
                                  const event = events[0];
                                  const displayColor = getWorkStageColor(event.workStage) || event.color || 'var(--accent)';
                                  const stageLabel = getWorkStageLabel(event.workStage);
                                  // 실제 일정의 길이
                                  const actualDuration = event.actualDuration || event.daySpan || 1;
                                  // 실제 일정의 끝 날짜
                                  const actualEndDate = event.endDate || (day + actualDuration - 1);
                                  // 주의 끝 날짜 계산
                                  const daysUntilSaturday = 6 - dayOfWeek;
                                  const lastDayOfWeek = day + daysUntilSaturday;
                                  // 표시할 끝 날짜는 주의 끝, 월의 끝, 실제 일정의 끝 중 최소값
                                  const displayEndDate = actualDuration > 1 ? Math.min(actualEndDate, lastDayOfWeek, 31) : day;
                                  const displayDaySpan = displayEndDate - day + 1;
                                  // 며칠짜리 일정은 해당 일수만큼 날짜에 걸쳐 표시 (각 날짜 셀의 100% + gap)
                                  const barWidth = displayDaySpan > 1 ? `calc(${displayDaySpan * 100}% + ${(displayDaySpan - 1) * 2}px)` : '100%';

                                  let displayTitle = event.title;
                                  if (event.category === 'work' && event.project) {
                                    const truncatedProject = truncateProjectName(event.project);
                                    const episodePart = event.episode ? ` ${event.episode}` : '';
                                    const stagePart = stageLabel ? ` ${stageLabel}` : '';
                                    displayTitle = `${truncatedProject}${episodePart}${stagePart}`;
                                  }

                                  result.push(
                                    <EventBar
                                      key={`${event.id || event.idx}-${day}`}
                                      $color={displayColor}
                                      $width={barWidth}
                                      $isMultiDay={displayDaySpan > 1}
                                      $topOffset={currentTopOffset}
                                    >
                                      {displayTitle}
                                    </EventBar>
                                  );
                                  // 다음 일정을 위해 top offset 증가
                                  currentTopOffset += 1.5 + 2; // height(1.5rem) + gap(2px)
                                }
                              });

                            // 당일 일정들을 그룹화
                            if (eventsByDay.length > 1) {
                              const firstEvent = eventsByDay[0];
                              const displayColor = getWorkStageColor(firstEvent.workStage) || firstEvent.color || 'var(--accent)';
                              result.push(
                                <GroupedEventBar
                                  key={`grouped-day-${day}`}
                                  $color={displayColor}
                                  $width="100%"
                                  $isMultiDay={false}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleGroupedEventsClick({
                                      day,
                                      duration: 1,
                                      events: eventsByDay,
                                      label: '당일일정',
                                    });
                                  }}
                                >
                                  {eventsByDay.length}개의 일정...
                                </GroupedEventBar>
                              );
                            } else if (eventsByDay.length === 1) {
                              // 단일 당일 일정
                              const event = eventsByDay[0];
                              const displayColor = getWorkStageColor(event.workStage) || event.color || 'var(--accent)';
                              const stageLabel = getWorkStageLabel(event.workStage);

                              let displayTitle = event.title;
                              if (event.category === 'work' && event.project) {
                                const truncatedProject = truncateProjectName(event.project);
                                const episodePart = event.episode ? ` ${event.episode}` : '';
                                const stagePart = stageLabel ? ` ${stageLabel}` : '';
                                displayTitle = `${truncatedProject}${episodePart}${stagePart}`;
                              }

                              result.push(
                                <EventBar
                                  key={`${event.id || event.idx}-${day}`}
                                  $color={displayColor}
                                  $width="100%"
                                  $isMultiDay={false}
                                >
                                  {displayTitle}
                                </EventBar>
                              );
                            }

                            return result;
                          })()}
                        </DateEventsArea>

                        {/* 메모 표시 - 항상 맨 밑에 고정 */}
                        {dayNote && (
                          <DateMemo
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMemoClick(day);
                            }}
                          >
                            📝 {dayNote.note}
                          </DateMemo>
                        )}
                      </DateCell>
                    );
                  })}

                  {/* 다음 달 날짜 (흐릿하게) */}
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                    // 31일이 목요일(4)이므로, 다음 달 1일은 금요일(5)
                    // 1일: 금요일(5), 2일: 토요일(6), 3일: 일요일(0), 4일: 월요일(1), ...
                    const dayOfWeek = (31 + day + 3) % 7;
                    const isSunday = dayOfWeek === 0;
                    
                    return (
                      <DateCell
                        key={`next-${day}`}
                        onClick={() => handleDateClick(day)}
                        $isToday={false}
                        $attendanceType={null}
                        $isSunday={isSunday}
                        $isOtherMonth={true}
                      >
                        <DateNumberWrapper>
                          <DateNumber $isToday={false} $isSunday={isSunday} $isOtherMonth={true}>{day}</DateNumber>
                        </DateNumberWrapper>
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
              <UpcomingEventsTitle>다가오는 캘린더</UpcomingEventsTitle>
              <UpcomingEventsContent>
                {/* 작품 관련 일정 */}
                <WorkEventsSection>
                  <SectionHeader>
                    <SectionDot $color="var(--primary)" />
                    <SectionTitle>작품 관련</SectionTitle>
                    <SectionCount>최근 3개</SectionCount>
                  </SectionHeader>
                  <UpcomingEventsList>
                    {upcomingEvents
                      .filter((e) => e.category === 'work')
                      .slice(0, 3)
                      .map((event, idx) => {
                        const displayColor = getWorkStageColor(event.workStage) || event.color || 'var(--accent)';
                        const stageLabel = getWorkStageLabel(event.workStage);
                        const truncatedProject = event.project ? truncateProjectName(event.project) : '';

                        return (
                          <UpcomingEventItem key={idx} onClick={() => handleDateClick(event.date)}>
                            <UpcomingEventContent>
                              <UpcomingEventColorBar $color={displayColor} />
                              <UpcomingEventDetails>
                                <UpcomingEventTitle>
                                  {truncatedProject} {event.episode} {stageLabel}
                                </UpcomingEventTitle>
                                <UpcomingEventDate>1월 {event.date}일</UpcomingEventDate>
                                {event.startDate && event.endDate && event.startDate !== event.endDate && (
                                  <UpcomingEventDuration>
                                    ({event.endDate - event.startDate + 1}일 작업)
                                  </UpcomingEventDuration>
                                )}
                              </UpcomingEventDetails>
                            </UpcomingEventContent>
                          </UpcomingEventItem>
                        );
                      })}

                    {upcomingEvents.filter((e) => e.category === 'work').length === 0 && (
                      <EmptyState>예정된 작품 일정이 없습니다</EmptyState>
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
                              <MemoDate>1월 {note.date}일</MemoDate>
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
              <option value="other">기타</option>
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
              <ModalDateTitle>1월 {selectedDate}일</ModalDateTitle>
              {getAttendanceForDate(selectedDate) && (
                <AttendanceBadge 
                  $attendanceType={getAttendanceForDate(selectedDate)} 
                  $isToday={selectedDate === currentDay}
                >
                  {getAttendanceForDate(selectedDate) === 'workation' ? '워케이션' : '휴가'}
                </AttendanceBadge>
              )}
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
                          <Badge
                            className="text-xs"
                            variant={
                              event.workType === 'serialization'
                                ? 'destructive'
                                : event.workType === 'break'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {event.workType === 'serialization'
                              ? '연재'
                              : event.workType === 'break'
                              ? '휴가'
                              : '기타'}
                          </Badge>
                        </EventDetailText>
                        {event.project && (
                          <EventDetailText>
                            <strong>작품:</strong> {event.project}
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
            ? `${groupedEventsData.label || `${groupedEventsData.duration}일 일정`} - 1월 ${groupedEventsData.day}일`
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
                const stageLabel = getWorkStageLabel(event.workStage);
                let displayTitle = event.title;
                if (event.category === 'work' && event.project) {
                  const truncatedProject = truncateProjectName(event.project);
                  const episodePart = event.episode ? ` ${event.episode}` : '';
                  const stagePart = stageLabel ? ` ${stageLabel}` : '';
                  displayTitle = `${truncatedProject}${episodePart}${stagePart}`;
                }

                return (
                  <EventDetailCard key={idx} $color={displayColor}>
                    <EventDetailTitle>{displayTitle}</EventDetailTitle>
                    <EventDetailInfo>
                      <EventDetailText>
                        <strong>유형:</strong>{' '}
                        <Badge
                          className="text-xs"
                          variant={
                            event.workType === 'serialization'
                              ? 'destructive'
                              : event.workType === 'break'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {event.workType === 'serialization'
                            ? '연재'
                            : event.workType === 'break'
                            ? '휴가'
                            : '기타'}
                        </Badge>
                      </EventDetailText>
                      {event.project && (
                        <EventDetailText>
                          <strong>작품:</strong> {event.project}
                        </EventDetailText>
                      )}
                      {event.startDate && event.endDate && (
                        <EventDetailText>
                          <strong>기간:</strong> 1월 {event.startDate}일
                          {event.startDate !== event.endDate ? ` ~ 1월 ${event.endDate}일 (${event.endDate - event.startDate + 1}일)` : ''}
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
