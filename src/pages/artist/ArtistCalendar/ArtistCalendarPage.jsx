import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import { ChevronLeft, ChevronRight, Plus, AlignLeft, Palette, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { LeaveRequestModal } from '@/components/modals/LeaveRequestModal';
import {
  ArtistCalendarRoot,
  ArtistCalendarBody,
  ArtistCalendarLayoutGrid,
  ArtistCalendarCard,
  ArtistCalendarHeader,
  ArtistCalendarHeaderLeft,
  ArtistCalendarMonthTitle,
  ArtistCalendarHeaderRight,
  AttendanceLegend,
  LegendItem,
  LegendColorBox,
  LegendLabel,
  ArtistCalendarGridContainer,
  ArtistDaysOfWeekGrid,
  ArtistDayOfWeekHeader,
  ArtistDatesGrid,
  ArtistDateCell,
  ArtistDateNumber,
  ArtistDateEventsArea,
  ArtistEventBar,
  ArtistDateMoreEvents,
  ArtistDateMemo,
  ArtistUpcomingEventsSidebar,
  ArtistUpcomingEventsCard,
  ArtistUpcomingEventsTitle,
  ArtistWorkEventsSection,
  ArtistSectionHeader,
  ArtistSectionDot,
  ArtistSectionTitle,
  ArtistSectionCount,
  ArtistUpcomingEventsList,
  ArtistUpcomingEventItem,
  ArtistUpcomingEventContent,
  ArtistUpcomingEventColorBar,
  ArtistUpcomingEventDetails,
  ArtistUpcomingEventTitle,
  ArtistUpcomingEventDate,
  ArtistUpcomingEventDuration,
  ArtistEmptyState,
  ArtistDivider,
  ArtistMemoSection,
  ArtistMemoItem,
  ArtistMemoContent,
  ArtistMemoIcon,
  ArtistMemoDetails,
  ArtistMemoText,
  ArtistMemoDate,
  ArtistModalForm,
  ArtistFormTitleInput,
  ArtistFormRow,
  ArtistFormLabel,
  ArtistFormSelect,
  ArtistColorPickerContainer,
  ArtistColorPickerLabel,
  ArtistColorPickerGrid,
  ArtistColorPickerButton,
  ArtistFormTextarea,
  ArtistModalActions,
  ArtistEventDetailContainer,
  ArtistEventDetailCard,
  ArtistEventDetailTitle,
  ArtistEventDetailInfo,
  ArtistEventDetailText,
  ArtistEventDetailActions,
} from './ArtistCalendarPage.styled';

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
const currentMonth = '2026년 1월';

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

// TODO: Zustand store mapping - 작가 일정 데이터
const initialEvents = [
  { id: '1', date: 5, title: 'EP.42 마감', workType: 'serialization', workStage: 'review', category: 'work', project: '나의 히어로', episode: 'EP.42', description: '최종 검수 및 업로드', color: '#EF4444', startDate: 5, endDate: 5 },
  { id: '2', date: 6, title: 'EP.43 콘티', workType: 'serialization', workStage: 'storyboard', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 6, endDate: 7 },
  { id: '3', date: 7, title: 'EP.43 콘티', workType: 'serialization', workStage: 'storyboard', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 6, endDate: 7 },
  { id: '4', date: 8, title: 'EP.43 스케치', workType: 'serialization', workStage: 'sketch', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 8, endDate: 8 },
  { id: '5', date: 14, title: 'EP.43 선화', workType: 'serialization', workStage: 'lineart', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 14, endDate: 15 },
  { id: '6', date: 15, title: 'EP.43 선화', workType: 'serialization', workStage: 'lineart', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 14, endDate: 15 },
  { id: '7', date: 16, title: 'EP.43 채색', workType: 'serialization', workStage: 'coloring', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 16, endDate: 18 },
  { id: '8', date: 17, title: 'EP.43 채색', workType: 'serialization', workStage: 'coloring', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 16, endDate: 18 },
  { id: '9', date: 18, title: 'EP.43 ', workType: 'serialization', workStage: 'coloring', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 16, endDate: 18 },
  { id: '10', date: 19, title: 'EP.43 배경', workType: 'serialization', workStage: 'background', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 19, endDate: 19 },
  { id: '11', date: 21, title: '신작 콘티', workType: 'serialization', workStage: 'storyboard', category: 'work', project: '별빛 아래서', episode: 'EP.01', description: '신작 기획', color: '#8B5CF6', startDate: 21, endDate: 22 },
  { id: '12', date: 22, title: '신작 콘티', workType: 'serialization', workStage: 'storyboard', category: 'work', project: '별빛 아래서', episode: 'EP.01', description: '신작 기획', color: '#8B5CF6', startDate: 21, endDate: 22 },
  { id: '15', date: 21, title: 'EP.45 스케치', workType: 'serialization', workStage: 'sketch', category: 'work', project: '나의 히어로', episode: 'EP.45', description: '스케치 작업', color: '#F59E0B', startDate: 21, endDate: 21 },
  { id: '16', date: 21, title: '팀 미팅', workType: 'other', workStage: '', category: 'personal', project: '', episode: '', description: '주간 팀 미팅', color: '#3B82F6', startDate: 21, endDate: 21 },
  { id: '17', date: 21, title: 'EP.46 기획', workType: 'serialization', workStage: 'storyboard', category: 'work', project: '나의 히어로', episode: 'EP.46', description: '에피소드 기획', color: '#10B981', startDate: 21, endDate: 21 },
  { id: '13', date: 24, title: 'EP.44 후보정', workType: 'serialization', workStage: 'effects', category: 'work', project: '나의 히어로', episode: 'EP.44', color: '#F59E0B', startDate: 24, endDate: 25 },
  { id: '14', date: 25, title: 'EP.44 후보정', workType: 'serialization', workStage: 'effects', category: 'work', project: '나의 히어로', episode: 'EP.44', color: '#F59E0B', startDate: 24, endDate: 25 },
];

// TODO: Zustand store mapping - 근태 데이터
const initialAttendanceData = [
  { id: 1, type: 'workation', typeName: '워케이션', startDate: '2026-01-05', endDate: '2026-01-07', days: 3, reason: '제주도 워케이션', status: 'approved', requestDate: '2025-12-20' },
  { id: 2, type: 'break', typeName: '휴재', startDate: '2026-01-10', endDate: '2026-01-12', days: 3, reason: '개인 사유', status: 'approved', requestDate: '2026-01-05' },
  { id: 3, type: 'break', typeName: '휴재', startDate: '2026-01-20', endDate: '2026-01-20', days: 1, reason: '건강 문제', status: 'approved', requestDate: '2026-01-19' },
  { id: 4, type: 'workation', typeName: '워케이션', startDate: '2026-01-25', endDate: '2026-01-27', days: 3, reason: '강릉 워케이션', status: 'approved', requestDate: '2026-01-10' },
];

// TODO: Zustand store mapping - 메모 데이터
const initialDayNotes = [
  { date: 5, note: '마감일 점검 필요' },
  { date: 15, note: '휴식 필요' },
];

export function ArtistCalendarPage({ openAttendanceModal, onCloseAttendanceModal } = {}) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(openAttendanceModal || false);
  const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMemoDetailModalOpen, setIsMemoDetailModalOpen] = useState(false);
  const [isMultipleEventsModalOpen, setIsMultipleEventsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateForMultipleEvents, setSelectedDateForMultipleEvents] = useState(null);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedMemoDate, setSelectedMemoDate] = useState(null);
  const [editingMemoContent, setEditingMemoContent] = useState('');
  
  // 실제 오늘 날짜 계산
  const currentDay = new Date().getDate();
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: '',
    endDate: '',
    category: 'work',
    project: '내 웹툰',
    color: '#6E8FB3',
    description: '',
    workType: 'serialization',
    workStage: '',
  });
  const [dayNotes, setDayNotes] = useState(initialDayNotes);
  const [currentNote, setCurrentNote] = useState('');
  const [attendanceData, setAttendanceData] = useState(initialAttendanceData);
  const [allEvents, setAllEvents] = useState(initialEvents);
  const [projectsData, setProjectsData] = useState([]);

  // openAttendanceModal prop 변경 감지
  useEffect(() => {
    if (openAttendanceModal) {
      setIsAttendanceModalOpen(true);
    }
  }, [openAttendanceModal]);

  // 작품 데이터를 로드하고 일정에 반영
  useEffect(() => {
    const stored = localStorage.getItem('projectsData');
    if (stored) {
      const data = JSON.parse(stored);
      setProjectsData(data);
    }
  }, []);

  // 작품 데이터 변경 감지 및 일정 반영
  useEffect(() => {
    const intervalId = setInterval(() => {
      const stored = localStorage.getItem('projectsData');
      if (stored) {
        const data = JSON.parse(stored);
        if (JSON.stringify(data) !== JSON.stringify(projectsData)) {
          setProjectsData(data);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [projectsData]);

  // 근태 데이터 로드
  useEffect(() => {
    const stored = localStorage.getItem('attendanceData');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.length > 0) {
        setAttendanceData(data);
      }
    }
  }, []);

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
    if (name.length > 4) {
      return name.substring(0, 4) + '...';
    }
    return name;
  };

  // 특정 날짜에 근태가 있는지 확인하는 함수
  const getAttendanceForDate = (day) => {
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

  // 필터링된 일정
  const filteredEvents = allEvents.filter((event) => {
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
        const updated = [...dayNotes];
        updated[existingNoteIndex] = { date: selectedDate, note: currentNote };
        setDayNotes(updated);
      } else {
        setDayNotes([...dayNotes, { date: selectedDate, note: currentNote }]);
      }
      toast.success('메모가 저장되었습니다.');
    } else {
      if (existingNoteIndex >= 0) {
        setDayNotes(dayNotes.filter((n) => n.date !== selectedDate));
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
    setAllEvents([...allEvents, event]);
    setIsAddModalOpen(false);
    setNewEvent({
      title: '',
      startDate: '',
      endDate: '',
      category: 'work',
      project: '내 웹툰',
      color: '#6E8FB3',
      description: '',
      workType: 'serialization',
      workStage: '',
    });
    toast.success('캘린더가 추가되었습니다.');
  };

  const handleEditEvent = () => {
    if (!editingEvent) return;

    const updatedEvents = allEvents.map((e) => (e.id === editingEvent.id ? editingEvent : e));
    setAllEvents(updatedEvents);
    setIsEditModalOpen(false);
    setEditingEvent(null);
    toast.success('캘린더가 수정되었습니다.');
  };

  const handleDeleteEvent = (eventId) => {
    setAllEvents(allEvents.filter((e) => e.id !== eventId));
    setSelectedDate(null);
    toast.success('캘린더가 삭제되었습니다.');
  };

  // 메모 클릭 핸들러
  const handleMemoClick = (date) => {
    const dayNote = dayNotes.find((n) => n.date === date);
    if (dayNote) {
      setSelectedMemoDate(date);
      setEditingMemoContent(dayNote.note);
      setIsMemoDetailModalOpen(true);
    }
  };

  // 메모 수정 저장
  const handleSaveMemoEdit = () => {
    if (selectedMemoDate === null) return;

    const existingNoteIndex = dayNotes.findIndex((n) => n.date === selectedMemoDate);
    if (editingMemoContent.trim()) {
      if (existingNoteIndex >= 0) {
        const updated = [...dayNotes];
        updated[existingNoteIndex] = { date: selectedMemoDate, note: editingMemoContent };
        setDayNotes(updated);
      } else {
        setDayNotes([...dayNotes, { date: selectedMemoDate, note: editingMemoContent }]);
      }
      toast.success('메모가 수정되었습니다.');
    }
    setIsMemoDetailModalOpen(false);
    setSelectedMemoDate(null);
    setEditingMemoContent('');
  };

  // 메모 삭제
  const handleDeleteMemo = () => {
    if (selectedMemoDate === null) return;

    setDayNotes(dayNotes.filter((n) => n.date !== selectedMemoDate));
    toast.success('메모가 삭제되었습니다.');
    setIsMemoDetailModalOpen(false);
    setSelectedMemoDate(null);
    setEditingMemoContent('');
  };

  return (
    <ArtistCalendarRoot>
      <ArtistCalendarBody>
        <ArtistCalendarLayoutGrid>
          {/* Left Column - Calendar (2/3) */}
          <ArtistCalendarCard>
            <ArtistCalendarHeader>
              <ArtistCalendarHeaderLeft>
                <ArtistCalendarMonthTitle>{currentMonth}</ArtistCalendarMonthTitle>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </ArtistCalendarHeaderLeft>

              <ArtistCalendarHeaderRight>
                <AttendanceLegend>
                  <LegendItem>
                    <LegendColorBox $backgroundColor="rgba(168, 85, 247, 0.15)" $borderColor="rgba(168, 85, 247, 0.3)" />
                    <LegendLabel>워케이션</LegendLabel>
                  </LegendItem>
                  <LegendItem>
                    <LegendColorBox $backgroundColor="rgba(156, 163, 175, 0.25)" $borderColor="rgba(156, 163, 175, 0.4)" />
                    <LegendLabel>휴재</LegendLabel>
                  </LegendItem>
                </AttendanceLegend>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{
                    height: '36px',
                    padding: '0 12px',
                    borderRadius: '6px',
                    border: '2px solid var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    fontSize: '12px',
                    minWidth: '110px',
                    outline: 'none',
                  }}
                >
                  <option value="all">전체</option>
                  <option value="personal">개인 일정</option>
                  <option value="work">작품 일정</option>
                </select>
              </ArtistCalendarHeaderRight>
            </ArtistCalendarHeader>

            <ArtistCalendarGridContainer>
              {/* Days of week */}
              <ArtistDaysOfWeekGrid>
                {daysOfWeek.map((day) => (
                  <ArtistDayOfWeekHeader key={day}>{day}</ArtistDayOfWeekHeader>
                ))}
              </ArtistDaysOfWeekGrid>

              {/* Calendar dates grid */}
              <ArtistDatesGrid>
                {/* Empty cells before first day */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Days */}
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === currentDay;
                  const dayEvents = filteredEvents.filter((e) => e.date === day);
                  const attendanceType = getAttendanceForDate(day);
                  const dayNote = dayNotes.find((n) => n.date === day);

                  // 요일 계산 (1일이 수요일이므로 day + 2를 7로 나눈 나머지)
                  const dayOfWeek = (day + 2) % 7;

                  // 해당 날짜에 시작하는 작업 또는 주의 시작(일요일)에 이어지는 작업 필터링
                  const startingEvents = dayEvents.filter((e) => {
                    if (!e.startDate || e.startDate === day) return true;
                    if (dayOfWeek === 0 && e.startDate < day && e.endDate && e.endDate >= day) return true;
                    return false;
                  });

                  // 진행 중인 작업 (시작일도 아니고 일요일도 아닌 날)
                  const ongoingEvents = dayEvents.filter((e) => {
                    if (!e.startDate || e.startDate === day) return false;
                    if (dayOfWeek === 0 && e.startDate < day && e.endDate && e.endDate >= day) return false;
                    return true;
                  });

                  return (
                    <ArtistDateCell
                      key={day}
                      onClick={() => handleDateClick(day)}
                      $isToday={isToday}
                      $attendanceType={attendanceType}
                    >
                      <ArtistDateNumber $isToday={isToday}>{day}</ArtistDateNumber>

                      <ArtistDateEventsArea>
                        {/* 3개 이상이면 라벨만 표시, 3개 미만이면 개별 일정 표시 */}
                        {dayEvents.length >= 3 ? (
                          <ArtistDateMoreEvents
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDateForMultipleEvents(day);
                              setIsMultipleEventsModalOpen(true);
                            }}
                          >
                            총 {dayEvents.length}개의 작업...
                          </ArtistDateMoreEvents>
                        ) : (
                          <>
                            {/* 시작하는 작업만 표시 */}
                            {startingEvents.slice(0, 2).map((event, idx) => {
                              const displayColor = getWorkStageColor(event.workStage) || event.color || '#6E8FB3';
                              const stageLabel = getWorkStageLabel(event.workStage);

                              const isMultiDay = event.startDate && event.endDate && event.startDate !== event.endDate;

                              const daysUntilSaturday = 6 - dayOfWeek;
                              const lastDayOfWeek = day + daysUntilSaturday;

                              const displayEndDate = isMultiDay ? Math.min(event.endDate, lastDayOfWeek, 31) : day;
                              const daySpan = displayEndDate - day + 1;

                              const barWidth = daySpan > 1 ? `calc(${daySpan * 100}% + ${(daySpan - 1) * 2}px)` : '100%';

                              let displayTitle = event.title;
                              if (event.category === 'work' && event.project) {
                                const truncatedProject = truncateProjectName(event.project);
                                const episodePart = event.episode ? ` ${event.episode}` : '';
                                const stagePart = stageLabel ? ` ${stageLabel}` : '';
                                displayTitle = `${truncatedProject}${episodePart}${stagePart}`;
                              }

                              return (
                                <ArtistEventBar
                                  key={idx}
                                  $color={displayColor}
                                  $width={barWidth}
                                  $isMultiDay={daySpan > 1}
                                  $topOffset={idx * 28}
                                >
                                  {displayTitle}
                                </ArtistEventBar>
                              );
                            })}

                            {/* 진행 중인 작업은 공간만 차지 */}
                            {ongoingEvents.slice(0, 2).map((_, idx) => (
                              <div key={`ongoing-${idx}`} style={{ height: '28px', visibility: 'hidden' }}>
                                &nbsp;
                              </div>
                            ))}
                          </>
                        )}
                      </ArtistDateEventsArea>

                      {/* 메모 표시 */}
                      {dayNote && (
                        <ArtistDateMemo
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMemoClick(day);
                          }}
                        >
                          📝 {dayNote.note}
                        </ArtistDateMemo>
                      )}
                    </ArtistDateCell>
                  );
                })}

                {/* Empty cells after last day */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`empty-end-${i}`} />
                ))}
              </ArtistDatesGrid>
            </ArtistCalendarGridContainer>
          </ArtistCalendarCard>

          {/* Right Column - Upcoming Events (1/3) */}
          <ArtistUpcomingEventsSidebar>
            <ArtistUpcomingEventsCard>
              <ArtistUpcomingEventsTitle>다가오는 캘린더</ArtistUpcomingEventsTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minHeight: 0 }}>
                {/* 작품 관련 일정 */}
                <ArtistWorkEventsSection>
                  <ArtistSectionHeader>
                    <ArtistSectionDot $color="var(--primary)" />
                    <ArtistSectionTitle>작품 관련</ArtistSectionTitle>
                    <ArtistSectionCount>최근 3개</ArtistSectionCount>
                  </ArtistSectionHeader>
                  <ArtistUpcomingEventsList>
                    {upcomingEvents
                      .filter((e) => e.category === 'work')
                      .slice(0, 3)
                      .map((event, idx) => {
                        const displayColor = getWorkStageColor(event.workStage) || event.color || '#6E8FB3';
                        const stageLabel = getWorkStageLabel(event.workStage);
                        const truncatedProject = event.project ? truncateProjectName(event.project) : '';

                        return (
                          <ArtistUpcomingEventItem key={idx} onClick={() => handleDateClick(event.date)}>
                            <ArtistUpcomingEventContent>
                              <ArtistUpcomingEventColorBar $color={displayColor} />
                              <ArtistUpcomingEventDetails>
                                <ArtistUpcomingEventTitle>
                                  {truncatedProject} {event.episode} {stageLabel}
                                </ArtistUpcomingEventTitle>
                                <ArtistUpcomingEventDate>1월 {event.date}일</ArtistUpcomingEventDate>
                                {event.startDate && event.endDate && event.startDate !== event.endDate && (
                                  <ArtistUpcomingEventDuration>
                                    ({event.endDate - event.startDate + 1}일 작업)
                                  </ArtistUpcomingEventDuration>
                                )}
                              </ArtistUpcomingEventDetails>
                            </ArtistUpcomingEventContent>
                          </ArtistUpcomingEventItem>
                        );
                      })}

                    {upcomingEvents.filter((e) => e.category === 'work').length === 0 && (
                      <ArtistEmptyState>예정된 작품 일정이 없습니다</ArtistEmptyState>
                    )}
                  </ArtistUpcomingEventsList>
                </ArtistWorkEventsSection>

                <ArtistDivider />

                {/* 메모 */}
                <ArtistMemoSection>
                  <ArtistSectionHeader>
                    <ArtistSectionDot $color="#eab308" />
                    <ArtistSectionTitle>메모</ArtistSectionTitle>
                    <ArtistSectionCount>최근 3개</ArtistSectionCount>
                  </ArtistSectionHeader>
                  <ArtistUpcomingEventsList>
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
                        <ArtistMemoItem key={idx} onClick={() => handleMemoClick(note.date)}>
                          <ArtistMemoContent>
                            <ArtistMemoIcon>📝</ArtistMemoIcon>
                            <ArtistMemoDetails>
                              <ArtistMemoText>{note.note}</ArtistMemoText>
                              <ArtistMemoDate>1월 {note.date}일</ArtistMemoDate>
                            </ArtistMemoDetails>
                          </ArtistMemoContent>
                        </ArtistMemoItem>
                      ))}

                    {dayNotes.length === 0 && <ArtistEmptyState>저장된 메모가 없습니다</ArtistEmptyState>}
                  </ArtistUpcomingEventsList>
                </ArtistMemoSection>
              </div>
            </ArtistUpcomingEventsCard>
          </ArtistUpcomingEventsSidebar>
        </ArtistCalendarLayoutGrid>
      </ArtistCalendarBody>

      {/* 캘린더 추가 모달 */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="캘린더 추가" maxWidth="xl">
        <ArtistModalForm>
          <ArtistFormTitleInput
            type="text"
            placeholder="제목 추가"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />

          <ArtistFormRow>
            <ArtistFormLabel>시작 날짜</ArtistFormLabel>
            <input
              type="date"
              value={newEvent.startDate}
              onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                outline: 'none',
              }}
            />
          </ArtistFormRow>

          <ArtistFormRow>
            <ArtistFormLabel>종료 날짜</ArtistFormLabel>
            <input
              type="date"
              value={newEvent.endDate}
              onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                outline: 'none',
              }}
            />
          </ArtistFormRow>

          <ArtistFormRow>
            <ArtistFormLabel>유형</ArtistFormLabel>
            <ArtistFormSelect
              value={newEvent.workType}
              onChange={(e) => setNewEvent({ ...newEvent, workType: e.target.value })}
            >
              <option value="serialization">연재</option>
              <option value="break">휴재</option>
              <option value="other">기타</option>
            </ArtistFormSelect>
          </ArtistFormRow>

          <ArtistFormRow>
            <ArtistFormLabel>작업 단계</ArtistFormLabel>
            <ArtistFormSelect
              value={newEvent.workStage}
              onChange={(e) => setNewEvent({ ...newEvent, workStage: e.target.value })}
            >
              <option value="">선택 안 함</option>
              {WORK_STAGES.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </ArtistFormSelect>
          </ArtistFormRow>

          <ArtistFormRow>
            <ArtistFormLabel>카테고리</ArtistFormLabel>
            <ArtistFormSelect
              value={newEvent.category}
              onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
            >
              <option value="personal">개인 일정</option>
              <option value="work">작품 일정</option>
            </ArtistFormSelect>
          </ArtistFormRow>

          {newEvent.category === 'work' && (
            <ArtistFormRow>
              <ArtistFormLabel>작품</ArtistFormLabel>
              <ArtistFormSelect
                value={newEvent.project}
                onChange={(e) => setNewEvent({ ...newEvent, project: e.target.value })}
              >
                <option value="내 웹툰">내 웹툰</option>
                <option value="신작">신작</option>
              </ArtistFormSelect>
            </ArtistFormRow>
          )}

          <ArtistFormRow>
            <ArtistColorPickerContainer>
              <ArtistColorPickerLabel>
                <Palette className="w-4 h-4" />
                색상
              </ArtistColorPickerLabel>
              <ArtistColorPickerGrid>
                {COLOR_PRESETS.map((preset) => (
                  <ArtistColorPickerButton
                    key={preset.color}
                    type="button"
                    onClick={() => setNewEvent({ ...newEvent, color: preset.color })}
                    $color={preset.color}
                    $isSelected={newEvent.color === preset.color}
                    title={preset.name}
                  />
                ))}
              </ArtistColorPickerGrid>
            </ArtistColorPickerContainer>
          </ArtistFormRow>

          <ArtistFormRow>
            <ArtistColorPickerLabel>
              <AlignLeft className="w-4 h-4" />
              설명
            </ArtistColorPickerLabel>
            <ArtistFormTextarea
              placeholder="설명 추가"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              rows={3}
            />
          </ArtistFormRow>

          <ArtistModalActions>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddEvent}>저장</Button>
          </ArtistModalActions>
        </ArtistModalForm>
      </Modal>

      {/* 캘린더 수정 모달 */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="캘린더 수정" maxWidth="xl">
        {editingEvent && (
          <ArtistModalForm>
            <ArtistFormTitleInput
              type="text"
              placeholder="제목 추가"
              value={editingEvent.title}
              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
            />

            <ArtistFormRow>
              <ArtistFormLabel>유형</ArtistFormLabel>
              <ArtistFormSelect
                value={editingEvent.workType}
                onChange={(e) => setEditingEvent({ ...editingEvent, workType: e.target.value })}
              >
                <option value="serialization">연재</option>
                <option value="break">휴재</option>
                <option value="other">기타</option>
              </ArtistFormSelect>
            </ArtistFormRow>

            <ArtistFormRow>
              <ArtistFormLabel>작업 단계</ArtistFormLabel>
              <ArtistFormSelect
                value={editingEvent.workStage || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, workStage: e.target.value })}
              >
                <option value="">선택 안 함</option>
                {WORK_STAGES.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </ArtistFormSelect>
            </ArtistFormRow>

            <ArtistFormRow>
              <ArtistFormLabel>카테고리</ArtistFormLabel>
              <ArtistFormSelect
                value={editingEvent.category}
                onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
              >
                <option value="personal">개인 일정</option>
                <option value="work">작품 일정</option>
              </ArtistFormSelect>
            </ArtistFormRow>

            {editingEvent.category === 'work' && (
              <ArtistFormRow>
                <ArtistFormLabel>작품</ArtistFormLabel>
                <ArtistFormSelect
                  value={editingEvent.project || '내 웹툰'}
                  onChange={(e) => setEditingEvent({ ...editingEvent, project: e.target.value })}
                >
                  <option value="내 웹툰">내 웹툰</option>
                  <option value="신작">신작</option>
                </ArtistFormSelect>
              </ArtistFormRow>
            )}

            <ArtistFormRow>
              <ArtistColorPickerContainer>
                <ArtistColorPickerLabel>
                  <Palette className="w-4 h-4" />
                  색상
                </ArtistColorPickerLabel>
                <ArtistColorPickerGrid>
                  {COLOR_PRESETS.map((preset) => (
                    <ArtistColorPickerButton
                      key={preset.color}
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, color: preset.color })}
                      $color={preset.color}
                      $isSelected={editingEvent.color === preset.color}
                      title={preset.name}
                    />
                  ))}
                </ArtistColorPickerGrid>
              </ArtistColorPickerContainer>
            </ArtistFormRow>

            <ArtistFormRow>
              <ArtistColorPickerLabel>
                <AlignLeft className="w-4 h-4" />
                설명
              </ArtistColorPickerLabel>
              <ArtistFormTextarea
                placeholder="설명 추가"
                value={editingEvent.description || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                rows={3}
              />
            </ArtistFormRow>

            <ArtistModalActions>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                취소
              </Button>
              <Button onClick={handleEditEvent}>저장</Button>
            </ArtistModalActions>
          </ArtistModalForm>
        )}
      </Modal>

      {/* 날짜 클릭 시 캘린더 및 메모 모달 */}
      <Modal
        isOpen={isDayDetailModalOpen}
        onClose={() => setIsDayDetailModalOpen(false)}
        title={`1월 ${selectedDate}일`}
        maxWidth="lg"
      >
        {selectedDate !== null && (
          <ArtistEventDetailContainer>
            {selectedDateEvents.length > 0 && (
              <div>
                <ArtistFormLabel style={{ marginBottom: '8px', display: 'block' }}>캘린더</ArtistFormLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedDateEvents.map((event, idx) => (
                    <ArtistEventDetailCard key={idx} $color={event.color || '#6E8FB3'}>
                      <ArtistEventDetailTitle>{event.title}</ArtistEventDetailTitle>
                      <ArtistEventDetailInfo>
                        <ArtistEventDetailText>
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
                              ? '휴재'
                              : '기타'}
                          </Badge>
                        </ArtistEventDetailText>
                        {event.project && (
                          <ArtistEventDetailText>
                            <strong>작품:</strong> {event.project}
                          </ArtistEventDetailText>
                        )}
                        {event.description && (
                          <ArtistEventDetailText>
                            <strong>설명:</strong> {event.description}
                          </ArtistEventDetailText>
                        )}
                      </ArtistEventDetailInfo>
                    </ArtistEventDetailCard>
                  ))}
                </div>
              </div>
            )}

            <ArtistFormRow>
              <ArtistFormLabel>메모</ArtistFormLabel>
              <ArtistFormTextarea
                placeholder="메모를 입력하세요"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                rows={4}
              />
            </ArtistFormRow>

            <ArtistModalActions>
              <Button variant="outline" onClick={() => setIsDayDetailModalOpen(false)}>
                취소
              </Button>
              <Button
                onClick={() => {
                  handleSaveNote();
                  setIsDayDetailModalOpen(false);
                }}
              >
                저장
              </Button>
            </ArtistModalActions>
          </ArtistEventDetailContainer>
        )}
      </Modal>

      {/* 메모 상세 모달 */}
      <Modal
        isOpen={isMemoDetailModalOpen}
        onClose={() => {
          setIsMemoDetailModalOpen(false);
          setSelectedMemoDate(null);
          setEditingMemoContent('');
        }}
        title={`메모 상세 - 1월 ${selectedMemoDate}일`}
        maxWidth="md"
      >
        {selectedMemoDate !== null && (
          <ArtistEventDetailContainer>
            <ArtistFormRow>
              <ArtistFormLabel>메모 내용</ArtistFormLabel>
              <ArtistFormTextarea
                value={editingMemoContent}
                onChange={(e) => setEditingMemoContent(e.target.value)}
                rows={6}
              />
            </ArtistFormRow>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '8px' }}>
              <Button variant="outline" onClick={handleDeleteMemo} style={{ color: '#dc2626' }}>
                <Trash2 className="w-4 h-4" style={{ marginRight: '8px' }} />
                삭제
              </Button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsMemoDetailModalOpen(false);
                    setSelectedMemoDate(null);
                    setEditingMemoContent('');
                  }}
                >
                  취소
                </Button>
                <Button onClick={handleSaveMemoEdit}>
                  <Save className="w-4 h-4" style={{ marginRight: '8px' }} />
                  저장
                </Button>
              </div>
            </div>
          </ArtistEventDetailContainer>
        )}
      </Modal>

      {/* 근태 신청 모달 */}
      <LeaveRequestModal open={isAttendanceModalOpen} onOpenChange={setIsAttendanceModalOpen} />

      {/* 캘린더 3개 이상일 때 모달 */}
      <Modal
        isOpen={isMultipleEventsModalOpen}
        onClose={() => {
          setIsMultipleEventsModalOpen(false);
          setSelectedDateForMultipleEvents(null);
        }}
        title={selectedDateForMultipleEvents ? `1월 ${selectedDateForMultipleEvents}일 캘린더` : '캘린더'}
        maxWidth="lg"
      >
        {selectedDateForMultipleEvents !== null && (
          <ArtistEventDetailContainer>
            {filteredEvents
              .filter((e) => e.date === selectedDateForMultipleEvents)
              .map((event, idx) => {
                const displayColor = getWorkStageColor(event.workStage) || event.color || '#6E8FB3';
                return (
                  <ArtistEventDetailCard key={idx} $color={displayColor}>
                    <ArtistEventDetailTitle>{event.title}</ArtistEventDetailTitle>
                    <ArtistEventDetailInfo>
                      <ArtistEventDetailText>
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
                            ? '휴재'
                            : '기타'}
                        </Badge>
                      </ArtistEventDetailText>
                      {event.project && (
                        <ArtistEventDetailText>
                          <strong>작품:</strong> {event.project}
                        </ArtistEventDetailText>
                      )}
                      {event.description && (
                        <ArtistEventDetailText>
                          <strong>설명:</strong> {event.description}
                        </ArtistEventDetailText>
                      )}
                    </ArtistEventDetailInfo>
                  </ArtistEventDetailCard>
                );
              })}
          </ArtistEventDetailContainer>
        )}
      </Modal>
    </ArtistCalendarRoot>
  );
}
