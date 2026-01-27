import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight, Trash2, Save, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AdminCalendarRoot,
  AdminCalendarBody,
  AdminCalendarLayoutGrid,
  AdminCalendarFilterCard,
  AdminCalendarFilterRow,
  AdminCalendarFilterField,
  AdminCalendarFilterLabel,
  AdminCalendarFilterSelect,
  AdminCalendarCard,
  AdminCalendarHeader,
  AdminCalendarHeaderLeft,
  AdminCalendarMonthTitle,
  AdminCalendarHeaderRight,
  AdminCalendarLegend,
  AdminCalendarLegendItem,
  AdminCalendarLegendColor,
  AdminCalendarLegendLabel,
  AdminCalendarGridContainer,
  AdminCalendarDaysOfWeekGrid,
  AdminCalendarDayOfWeekHeader,
  AdminCalendarDatesGrid,
  AdminCalendarDateCell,
  AdminCalendarDateNumber,
  AdminCalendarDateEvents,
  AdminCalendarDateMemo,
  AdminCalendarEventBar,
  AdminCalendarMoreEvents,
  AdminCalendarSidebar,
  AdminCalendarSidebarCard,
  AdminCalendarSidebarHeader,
  AdminCalendarSidebarHeaderLeft,
  AdminCalendarSidebarTitle,
  AdminCalendarSidebarMoreButton,
  AdminCalendarSidebarList,
  AdminCalendarScheduleChangeItem,
  AdminCalendarScheduleChangeHeader,
  AdminCalendarScheduleChangeContent,
  AdminCalendarScheduleChangeTitle,
  AdminCalendarScheduleChangeEpisode,
  AdminCalendarScheduleChangeDates,
  AdminCalendarScheduleChangeDate,
  AdminCalendarScheduleChangeArrow,
  AdminCalendarScheduleChangeReason,
  AdminCalendarDeadlineItem,
  AdminCalendarDeadlineContent,
  AdminCalendarDeadlineColorBar,
  AdminCalendarDeadlineDetails,
  AdminCalendarDeadlineTitle,
  AdminCalendarDeadlineDate,
  AdminCalendarEmptyState,
  AdminCalendarModalForm,
  AdminCalendarModalField,
  AdminCalendarModalLabel,
  AdminCalendarModalTextarea,
  AdminCalendarModalActions,
  AdminCalendarModalList,
  AdminCalendarModalListItem,
  AdminCalendarModalListItemHeader,
  AdminCalendarModalListItemContent,
  AdminCalendarModalListItemTitle,
  AdminCalendarModalListItemSubtitle,
  AdminCalendarModalListItemMeta,
  AdminCalendarModalListItemDate,
  AdminCalendarModalListItemArrow,
  AdminCalendarModalListItemReason,
  AdminCalendarModalEmptyState,
  AdminEventDetailContainer,
  AdminEventDetailCard,
  AdminEventDetailTitle,
  AdminEventDetailInfo,
  AdminEventDetailText,
} from './AdminCalendarPage.styled';

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

export function AdminCalendarPage() {
  // TODO: Zustand store mapping - 작가 목록
  const artists = [
    { id: 'artist1', name: '김작가', projects: ['나의 히어로', '별빛 아래서'] },
    { id: 'artist2', name: '나작가', projects: ['러브 스토리'] },
    { id: 'artist3', name: '박작가', projects: ['판타지 월드'] },
  ];

  const [selectedArtist, setSelectedArtist] = useState('all');
  const [selectedProject, setSelectedProject] = useState('');

  const [adminNotes, setAdminNotes] = useState({
    artist1: [{ date: 10, note: 'EP.42 마감 확인 필요' }],
    artist2: [],
    artist3: [],
  });
  const [currentNote, setCurrentNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false);
  const [isMemoDetailModalOpen, setIsMemoDetailModalOpen] = useState(false);
  const [isMultipleEventsModalOpen, setIsMultipleEventsModalOpen] = useState(false);
  const [selectedMemoDate, setSelectedMemoDate] = useState(null);
  const [selectedDateForMultipleEvents, setSelectedDateForMultipleEvents] = useState(null);
  const [editingMemoContent, setEditingMemoContent] = useState('');
  const [showDeleteMemoConfirm, setShowDeleteMemoConfirm] = useState(false);

  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
  const [upcomingModalType, setUpcomingModalType] = useState('schedule');

  // 실제 오늘 날짜 계산
  const currentDay = new Date().getDate();

  // TODO: Zustand store mapping - 작가별 일정 데이터
  const artistSchedules = [
    {
      artistId: 'artist1',
      artistName: '김작가',
      projects: [
        {
          id: 'project1',
          title: '나의 히어로',
          episodes: [
            { date: 5, episode: 'EP.42', stage: '검수', stageColor: '#F87171', startDate: 5, endDate: 5 },
            { date: 6, episode: 'EP.43', stage: '콘티', stageColor: '#FCD34D', startDate: 6, endDate: 7 },
            { date: 7, episode: 'EP.43', stage: '콘티', stageColor: '#FCD34D', startDate: 6, endDate: 7 },
            { date: 14, episode: 'EP.43', stage: '선화', stageColor: '#60A5FA', startDate: 14, endDate: 15 },
            { date: 15, episode: 'EP.43', stage: '선화', stageColor: '#60A5FA', startDate: 14, endDate: 15 },
            { date: 16, episode: 'EP.43', stage: '채색', stageColor: '#F472B6', startDate: 16, endDate: 18 },
            { date: 17, episode: 'EP.43', stage: '채색', stageColor: '#F472B6', startDate: 16, endDate: 18 },
            { date: 18, episode: 'EP.43', stage: '채색', stageColor: '#F472B6', startDate: 16, endDate: 18 },
            { date: 21, episode: 'EP.45', stage: '스케치', stageColor: '#F59E0B', startDate: 21, endDate: 21 },
            { date: 21, episode: 'EP.46', stage: '콘티', stageColor: '#10B981', startDate: 21, endDate: 21 },
          ],
        },
        {
          id: 'project2',
          title: '별빛 아래서',
          episodes: [
            { date: 21, episode: 'EP.01', stage: '콘티', stageColor: '#8B5CF6', startDate: 21, endDate: 22 },
            { date: 22, episode: 'EP.01', stage: '콘티', stageColor: '#8B5CF6', startDate: 21, endDate: 22 },
          ],
        },
        {
          id: 'project5',
          title: '기타',
          episodes: [
            { date: 21, episode: '', stage: '팀 미팅', stageColor: '#3B82F6', startDate: 21, endDate: 21 },
          ],
        },
      ],
      attendance: [
        { date: 10, type: 'break' },
        { date: 11, type: 'break' },
        { date: 12, type: 'break' },
      ],
    },
    {
      artistId: 'artist2',
      artistName: '나작가',
      projects: [
        {
          id: 'project3',
          title: '러브 스토리',
          episodes: [
            { date: 8, episode: 'EP.10', stage: '배경', stageColor: '#34D399', startDate: 8, endDate: 9 },
            { date: 9, episode: 'EP.10', stage: '배경', stageColor: '#34D399', startDate: 8, endDate: 9 },
          ],
        },
      ],
      attendance: [
        { date: 20, type: 'workation' },
        { date: 21, type: 'workation' },
        { date: 22, type: 'workation' },
      ],
    },
    {
      artistId: 'artist3',
      artistName: '박작가',
      projects: [
        {
          id: 'project4',
          title: '판타지 월드',
          episodes: [
            { date: 25, episode: 'EP.05', stage: '스케치', stageColor: '#A78BFA', startDate: 25, endDate: 26 },
            { date: 26, episode: 'EP.05', stage: '스케치', stageColor: '#A78BFA', startDate: 25, endDate: 26 },
          ],
        },
      ],
      attendance: [
        { date: 13, type: 'workation' },
        { date: 27, type: 'break' },
      ],
    },
  ];

  const truncateProjectName = (name) => {
    if (name.length > 4) {
      return name.substring(0, 4) + '...';
    }
    return name;
  };

  const getFilteredSchedule = () => {
    if (selectedArtist === 'all') {
      return artistSchedules.flatMap((artist) =>
        artist.projects.flatMap((p) =>
          p.episodes.map((e) => ({
            ...e,
            projectTitle: p.title,
            artistName: artist.artistName,
          }))
        )
      );
    }

    const artist = artistSchedules.find((a) => a.artistId === selectedArtist);
    if (!artist) return [];

    if (!selectedProject) {
      return artist.projects.flatMap((p) =>
        p.episodes.map((e) => ({
          ...e,
          projectTitle: p.title,
          artistName: artist.artistName,
        }))
      );
    }

    const project = artist.projects.find((p) => p.title === selectedProject);
    return project
      ? project.episodes.map((e) => ({
          ...e,
          projectTitle: project.title,
          artistName: artist.artistName,
        }))
      : [];
  };

  const filteredSchedule = getFilteredSchedule();

  const getAttendanceForDate = (day) => {
    if (selectedArtist === 'all') return null;

    const artist = artistSchedules.find((a) => a.artistId === selectedArtist);
    if (!artist) return null;

    const attendance = artist.attendance.find((a) => a.date === day);
    return attendance ? attendance.type : null;
  };

  const selectedArtistProjects = selectedArtist ? artists.find((a) => a.id === selectedArtist)?.projects || [] : [];

  // TODO: Zustand store mapping - 일정 변경 내역
  const scheduleChanges = [
    { artistName: '김작가', project: '나의 히어로', episode: 'EP.43', originalDate: '1/19', newDate: '1/22', reason: '긴급휴재로 인한 조정' },
  ];

  const handleDateClick = (day) => {
    setSelectedDate(day);
    const dayNote = adminNotes[selectedArtist]?.find((n) => n.date === day);
    const dayEvents = filteredSchedule.filter((e) => e.date === day);
    
    // 메모가 있으면 메모 상세 모달 열기 (삭제 버튼 포함)
    if (dayNote) {
      setSelectedMemoDate(day);
      setEditingMemoContent(dayNote.note);
      setIsMemoDetailModalOpen(true);
    } 
    // 일정이 있으면 일정 상세 모달 열기
    else if (dayEvents.length > 0) {
      setCurrentNote('');
      setIsDayDetailModalOpen(true);
    }
    // 둘 다 없으면 메모 생성 모달 열기
    else {
      setCurrentNote('');
      setIsDayDetailModalOpen(true);
    }
  };

  const handleSaveNote = () => {
    if (selectedDate === null) return;

    const existingNoteIndex = adminNotes[selectedArtist]?.findIndex((n) => n.date === selectedDate) ?? -1;
    if (currentNote.trim()) {
      const updatedNotes = [...(adminNotes[selectedArtist] || [])];
      if (existingNoteIndex >= 0) {
        updatedNotes[existingNoteIndex] = { date: selectedDate, note: currentNote };
      } else {
        updatedNotes.push({ date: selectedDate, note: currentNote });
      }
      setAdminNotes({ ...adminNotes, [selectedArtist]: updatedNotes });
      toast.success('메모가 저장되었습니다.');
    } else {
      if (existingNoteIndex >= 0) {
        const updatedNotes = adminNotes[selectedArtist].filter((n) => n.date !== selectedDate);
        setAdminNotes({ ...adminNotes, [selectedArtist]: updatedNotes });
        toast.success('메모가 삭제되었습니다.');
      }
    }
  };

  // 메모 클릭 핸들러
  const handleMemoClick = (date) => {
    const dayNote = adminNotes[selectedArtist]?.find((n) => n.date === date);
    if (dayNote) {
      setSelectedMemoDate(date);
      setEditingMemoContent(dayNote.note);
      setIsMemoDetailModalOpen(true);
    }
  };

  // 메모 수정 저장
  const handleSaveMemoEdit = () => {
    if (selectedMemoDate === null) return;

    const existingNoteIndex = adminNotes[selectedArtist]?.findIndex((n) => n.date === selectedMemoDate) ?? -1;
    if (editingMemoContent.trim()) {
      const updatedNotes = [...(adminNotes[selectedArtist] || [])];
      if (existingNoteIndex >= 0) {
        updatedNotes[existingNoteIndex] = { date: selectedMemoDate, note: editingMemoContent };
      } else {
        updatedNotes.push({ date: selectedMemoDate, note: editingMemoContent });
      }
      setAdminNotes({ ...adminNotes, [selectedArtist]: updatedNotes });
      toast.success('메모가 수정되었습니다.');
    }
    setIsMemoDetailModalOpen(false);
    setSelectedMemoDate(null);
    setEditingMemoContent('');
  };

  // 메모 삭제 확인 핸들러
  const handleDeleteMemoClick = () => {
    if (selectedMemoDate === null) return;
    setShowDeleteMemoConfirm(true);
  };

  // 메모 삭제 실행 핸들러
  const handleDeleteMemoConfirm = () => {
    if (selectedMemoDate === null) return;

    const updatedNotes = adminNotes[selectedArtist].filter((n) => n.date !== selectedMemoDate);
    setAdminNotes({ ...adminNotes, [selectedArtist]: updatedNotes });
    toast.success('메모가 삭제되었습니다.');
    setIsMemoDetailModalOpen(false);
    setSelectedMemoDate(null);
    setEditingMemoContent('');
    setShowDeleteMemoConfirm(false);
  };

  return (
    <AdminCalendarRoot>
      <AdminCalendarBody>
        <AdminCalendarLayoutGrid>
          {/* Left Column - Calendar (2/3) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 필터 영역 */}
            <AdminCalendarFilterCard>
              <AdminCalendarFilterRow>
                <AdminCalendarFilterField>
                  <AdminCalendarFilterLabel>작가 선택</AdminCalendarFilterLabel>
                  <AdminCalendarFilterSelect
                    value={selectedArtist}
                    onChange={(e) => {
                      setSelectedArtist(e.target.value);
                      setSelectedProject('');
                    }}
                  >
                    <option value="all">전체 작가</option>
                    {artists.map((artist) => (
                      <option key={artist.id} value={artist.id}>
                        {artist.name}
                      </option>
                    ))}
                  </AdminCalendarFilterSelect>
                </AdminCalendarFilterField>

                <AdminCalendarFilterField>
                  <AdminCalendarFilterLabel>웹툰 선택</AdminCalendarFilterLabel>
                  <AdminCalendarFilterSelect value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                    <option value="">전체 작품</option>
                    {selectedArtistProjects.map((project) => (
                      <option key={project} value={project}>
                        {project}
                      </option>
                    ))}
                  </AdminCalendarFilterSelect>
                </AdminCalendarFilterField>
              </AdminCalendarFilterRow>
            </AdminCalendarFilterCard>

            {/* 캘린더 */}
            <AdminCalendarCard>
              <AdminCalendarHeader>
                <AdminCalendarHeaderLeft>
                  <AdminCalendarMonthTitle>2026년 1월</AdminCalendarMonthTitle>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="outline" size="icon">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </AdminCalendarHeaderLeft>

                <AdminCalendarHeaderRight>
                  <AdminCalendarLegend>
                    <AdminCalendarLegendItem>
                      <AdminCalendarLegendColor $backgroundColor="rgba(168, 85, 247, 0.15)" $borderColor="rgba(168, 85, 247, 0.3)" />
                      <AdminCalendarLegendLabel>워케이션</AdminCalendarLegendLabel>
                    </AdminCalendarLegendItem>
                    <AdminCalendarLegendItem>
                      <AdminCalendarLegendColor $backgroundColor="rgba(156, 163, 175, 0.25)" $borderColor="rgba(156, 163, 175, 0.4)" />
                      <AdminCalendarLegendLabel>휴재</AdminCalendarLegendLabel>
                    </AdminCalendarLegendItem>
                  </AdminCalendarLegend>
                </AdminCalendarHeaderRight>
              </AdminCalendarHeader>

              {/* Calendar Grid */}
              <AdminCalendarGridContainer>
                {/* Days of week */}
                <AdminCalendarDaysOfWeekGrid>
                  {daysOfWeek.map((day) => (
                    <AdminCalendarDayOfWeekHeader key={day}>{day}</AdminCalendarDayOfWeekHeader>
                  ))}
                </AdminCalendarDaysOfWeekGrid>

                {/* Calendar dates grid */}
                <AdminCalendarDatesGrid>
                  {/* Empty cells before first day */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {/* Days */}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === currentDay;
                    const dayEvents = filteredSchedule.filter((e) => e.date === day);
                    const attendanceType = getAttendanceForDate(day);
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

                    const dayNote = adminNotes[selectedArtist]?.find((n) => n.date === day);

                    return (
                      <AdminCalendarDateCell key={day} $isToday={isToday} $attendanceType={attendanceType} onClick={() => handleDateClick(day)}>
                        <AdminCalendarDateNumber $isToday={isToday}>{day}</AdminCalendarDateNumber>

                        <AdminCalendarDateEvents>
                          {/* 3개 이상이면 라벨만 표시, 3개 미만이면 개별 일정 표시 */}
                          {dayEvents.length >= 3 ? (
                            <AdminCalendarMoreEvents
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDateForMultipleEvents(day);
                                setIsMultipleEventsModalOpen(true);
                              }}
                            >
                              총 {dayEvents.length}개의 작업...
                            </AdminCalendarMoreEvents>
                          ) : (
                            <>
                              {/* 시작하는 작업만 표시 */}
                              {startingEvents.slice(0, 2).map((event, idx) => {
                                const isMultiDay = event.startDate && event.endDate && event.startDate !== event.endDate;

                                const daysUntilSaturday = 6 - dayOfWeek;
                                const lastDayOfWeek = day + daysUntilSaturday;

                                const displayEndDate = isMultiDay ? Math.min(event.endDate, lastDayOfWeek, 31) : day;
                                const daySpan = displayEndDate - day + 1;

                                const barWidth = daySpan > 1 ? `calc(${daySpan * 100}% + ${(daySpan - 1) * 2}px)` : '100%';
                                const truncatedProject = truncateProjectName(event.projectTitle || '');
                                const displayTitle = `${truncatedProject} ${event.episode} ${event.stage}`;

                                return (
                                  <AdminCalendarEventBar
                                    key={idx}
                                    $color={event.stageColor}
                                    $width={barWidth}
                                    $isMultiDay={daySpan > 1}
                                    $topOffset={idx * 28}
                                  >
                                    {displayTitle}
                                  </AdminCalendarEventBar>
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
                        </AdminCalendarDateEvents>

                        {/* 메모 표시 */}
                        {dayNote && (
                          <AdminCalendarDateMemo
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMemoClick(day);
                            }}
                          >
                            📝 {dayNote.note}
                          </AdminCalendarDateMemo>
                        )}
                      </AdminCalendarDateCell>
                    );
                  })}

                  {/* Empty cells after last day */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`empty-end-${i}`} />
                  ))}
                </AdminCalendarDatesGrid>
              </AdminCalendarGridContainer>
            </AdminCalendarCard>
          </div>

          {/* Right Column - Management Panel (1/3) */}
          <AdminCalendarSidebar>
            {/* 일정 변경 내역 */}
            <AdminCalendarSidebarCard>
              <AdminCalendarSidebarHeader>
                <AdminCalendarSidebarHeaderLeft>
                  <Calendar className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  <AdminCalendarSidebarTitle>일정 조정</AdminCalendarSidebarTitle>
                </AdminCalendarSidebarHeaderLeft>
                <AdminCalendarSidebarMoreButton
                  onClick={() => {
                    setUpcomingModalType('schedule');
                    setIsUpcomingModalOpen(true);
                  }}
                >
                  더보기
                </AdminCalendarSidebarMoreButton>
              </AdminCalendarSidebarHeader>
              <AdminCalendarSidebarList>
                {scheduleChanges.slice(0, 3).map((change, idx) => (
                  <AdminCalendarScheduleChangeItem key={idx}>
                    <AdminCalendarScheduleChangeHeader>
                      <AdminCalendarScheduleChangeContent>
                        <AdminCalendarScheduleChangeTitle>
                          {change.artistName} - {change.project}
                        </AdminCalendarScheduleChangeTitle>
                        <AdminCalendarScheduleChangeEpisode>{change.episode}</AdminCalendarScheduleChangeEpisode>
                        <AdminCalendarScheduleChangeDates>
                          <AdminCalendarScheduleChangeDate $isOld>{change.originalDate}</AdminCalendarScheduleChangeDate>
                          <AdminCalendarScheduleChangeArrow>→</AdminCalendarScheduleChangeArrow>
                          <AdminCalendarScheduleChangeDate>{change.newDate}</AdminCalendarScheduleChangeDate>
                        </AdminCalendarScheduleChangeDates>
                        <AdminCalendarScheduleChangeReason>{change.reason}</AdminCalendarScheduleChangeReason>
                      </AdminCalendarScheduleChangeContent>
                    </AdminCalendarScheduleChangeHeader>
                  </AdminCalendarScheduleChangeItem>
                ))}

                {scheduleChanges.length === 0 && <AdminCalendarEmptyState>일정 변경 내역이 없습니다</AdminCalendarEmptyState>}
              </AdminCalendarSidebarList>
            </AdminCalendarSidebarCard>

            {/* 다가오는 마감 */}
            <AdminCalendarSidebarCard>
              <AdminCalendarSidebarHeader>
                <AdminCalendarSidebarHeaderLeft>
                  <Clock className="w-5 h-5" style={{ color: '#f97316' }} />
                  <AdminCalendarSidebarTitle>다가오는 마감</AdminCalendarSidebarTitle>
                </AdminCalendarSidebarHeaderLeft>
                <AdminCalendarSidebarMoreButton
                  onClick={() => {
                    setUpcomingModalType('deadline');
                    setIsUpcomingModalOpen(true);
                  }}
                >
                  더보기
                </AdminCalendarSidebarMoreButton>
              </AdminCalendarSidebarHeader>
              <AdminCalendarSidebarList>
                {filteredSchedule
                  .filter((e) => e.stage === '검수')
                  .slice(0, 3)
                  .map((event, idx) => (
                    <AdminCalendarDeadlineItem key={idx}>
                      <AdminCalendarDeadlineContent>
                        <AdminCalendarDeadlineColorBar $color={event.stageColor} />
                        <AdminCalendarDeadlineDetails>
                          <AdminCalendarDeadlineTitle>
                            {event.projectTitle} {event.episode}
                          </AdminCalendarDeadlineTitle>
                          <AdminCalendarDeadlineDate>1월 {event.date}일</AdminCalendarDeadlineDate>
                          <Badge className="mt-2 text-xs bg-orange-500">마감 임박</Badge>
                        </AdminCalendarDeadlineDetails>
                      </AdminCalendarDeadlineContent>
                    </AdminCalendarDeadlineItem>
                  ))}

                {filteredSchedule.filter((e) => e.stage === '검수').length === 0 && <AdminCalendarEmptyState>예정된 마감이 없습니다</AdminCalendarEmptyState>}
              </AdminCalendarSidebarList>
            </AdminCalendarSidebarCard>
          </AdminCalendarSidebar>
        </AdminCalendarLayoutGrid>
      </AdminCalendarBody>

      {/* 날짜 클릭 시 캘린더 및 메모 모달 */}
      <Modal isOpen={isDayDetailModalOpen} onClose={() => setIsDayDetailModalOpen(false)} title={`1월 ${selectedDate}일`} maxWidth="lg">
        {selectedDate !== null && (
          <AdminEventDetailContainer>
            {filteredSchedule.filter((e) => e.date === selectedDate).length > 0 && (
              <div>
                <AdminCalendarModalLabel style={{ marginBottom: '8px', display: 'block' }}>캘린더</AdminCalendarModalLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredSchedule
                    .filter((e) => e.date === selectedDate)
                    .map((event, idx) => {
                      const displayColor = event.stageColor || '#6E8FB3';
                      const displayTitle = `${event.projectTitle} ${event.episode} ${event.stage}`;
                      
                      // workType 결정 (stage 기반)
                      let workType = 'other';
                      if (event.stage && ['콘티', '스케치', '선화', '채색', '배경', '후보정', '검수'].includes(event.stage)) {
                        workType = 'serialization';
                      }
                      
                      return (
                        <AdminEventDetailCard key={idx} $color={displayColor}>
                          <AdminEventDetailTitle>{displayTitle}</AdminEventDetailTitle>
                          <AdminEventDetailInfo>
                            <AdminEventDetailText>
                              <strong>유형:</strong>{' '}
                              <Badge
                                className="text-xs"
                                variant={
                                  workType === 'serialization'
                                    ? 'destructive'
                                    : workType === 'break'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {workType === 'serialization'
                                  ? '연재'
                                  : workType === 'break'
                                  ? '휴재'
                                  : '기타'}
                              </Badge>
                            </AdminEventDetailText>
                            {event.projectTitle && (
                              <AdminEventDetailText>
                                <strong>작품:</strong> {event.projectTitle}
                              </AdminEventDetailText>
                            )}
                            {event.artistName && (
                              <AdminEventDetailText>
                                <strong>작가:</strong> {event.artistName}
                              </AdminEventDetailText>
                            )}
                            {event.episode && (
                              <AdminEventDetailText>
                                <strong>에피소드:</strong> {event.episode}
                              </AdminEventDetailText>
                            )}
                            {event.stage && (
                              <AdminEventDetailText>
                                <strong>단계:</strong> {event.stage}
                              </AdminEventDetailText>
                            )}
                          </AdminEventDetailInfo>
                        </AdminEventDetailCard>
                      );
                    })}
                </div>
              </div>
            )}

            <AdminCalendarModalField>
              <AdminCalendarModalLabel>메모</AdminCalendarModalLabel>
              <AdminCalendarModalTextarea
                placeholder="메모를 입력하세요"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                rows={4}
              />
            </AdminCalendarModalField>

            <AdminCalendarModalActions>
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
            </AdminCalendarModalActions>
          </AdminEventDetailContainer>
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
        title={`메모 상세 - 1월 ${selectedMemoDate}일 - ${artists.find((a) => a.id === selectedArtist)?.name || '전체'}`}
        maxWidth="md"
      >
        {selectedMemoDate !== null && (
          <AdminCalendarModalForm>
            <AdminCalendarModalField>
              <AdminCalendarModalLabel>메모 내용</AdminCalendarModalLabel>
              <AdminCalendarModalTextarea
                value={editingMemoContent}
                onChange={(e) => setEditingMemoContent(e.target.value)}
                rows={6}
              />
            </AdminCalendarModalField>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '8px' }}>
              <Button variant="outline" onClick={handleDeleteMemoClick} style={{ color: '#dc2626' }}>
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
          </AdminCalendarModalForm>
        )}
      </Modal>

      {/* 여러 일정 모달 */}
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
          <AdminEventDetailContainer>
            {filteredSchedule
              .filter((e) => e.date === selectedDateForMultipleEvents)
              .map((event, idx) => {
                const displayColor = event.stageColor || '#6E8FB3';
                const displayTitle = `${event.projectTitle} ${event.episode} ${event.stage}`;
                
                return (
                  <AdminEventDetailCard key={idx} $color={displayColor}>
                    <AdminEventDetailTitle>{displayTitle}</AdminEventDetailTitle>
                    <AdminEventDetailInfo>
                      {event.artistName && (
                        <AdminEventDetailText>
                          <strong>작가:</strong> {event.artistName}
                        </AdminEventDetailText>
                      )}
                      <AdminEventDetailText>
                        <strong>작품:</strong> {event.projectTitle}
                      </AdminEventDetailText>
                      {event.episode && (
                        <AdminEventDetailText>
                          <strong>에피소드:</strong> {event.episode}
                        </AdminEventDetailText>
                      )}
                      {event.stage && (
                        <AdminEventDetailText>
                          <strong>단계:</strong> {event.stage}
                        </AdminEventDetailText>
                      )}
                    </AdminEventDetailInfo>
                  </AdminEventDetailCard>
                );
              })}
          </AdminEventDetailContainer>
        )}
      </Modal>

      {/* 메모 삭제 확인 모달 */}
      <Modal isOpen={showDeleteMemoConfirm} onClose={() => { setShowDeleteMemoConfirm(false); }} title="메모 삭제 확인" maxWidth="sm">
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '12px', 
          padding: '16px', 
          backgroundColor: 'color-mix(in srgb, #fbbf24 20%, transparent)', 
          border: '1px solid color-mix(in srgb, #fbbf24 40%, transparent)', 
          borderRadius: '8px' 
        }}>
          <AlertCircle className="w-5 h-5" style={{ color: 'var(--destructive)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--foreground)', margin: '0 0 4px 0' }}>
              정말 메모를 삭제하시겠습니까?
            </p>
            <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', margin: 0 }}>
              삭제한 메모는 복구할 수 없습니다.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', justifyContent: 'flex-end' }}>
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
        </div>
      </Modal>

      {/* 더보기 모달 - 일정 조정 & 다가오는 마감 전체 목록 */}
      <Modal isOpen={isUpcomingModalOpen} onClose={() => setIsUpcomingModalOpen(false)} title={upcomingModalType === 'schedule' ? '일정 조정 전체 목록' : '다가오는 마감 전체 목록'} maxWidth="2xl">
        <AdminCalendarModalList>
          {upcomingModalType === 'schedule' ? (
            <>
              {scheduleChanges.map((change, idx) => (
                <AdminCalendarModalListItem key={idx} $bgColor="#eff6ff" $borderColor="#bfdbfe">
                  <AdminCalendarModalListItemHeader>
                    <AdminCalendarModalListItemContent>
                      <AdminCalendarModalListItemTitle $textColor="#1e3a8a">
                        {change.artistName} - {change.project}
                      </AdminCalendarModalListItemTitle>
                      <AdminCalendarModalListItemSubtitle $subTextColor="#1e40af">{change.episode}</AdminCalendarModalListItemSubtitle>
                      <AdminCalendarModalListItemMeta>
                        <AdminCalendarModalListItemDate $isOld $textColor="#2563eb">
                          {change.originalDate}
                        </AdminCalendarModalListItemDate>
                        <AdminCalendarModalListItemArrow $textColor="#2563eb">→</AdminCalendarModalListItemArrow>
                        <AdminCalendarModalListItemDate $textColor="#2563eb">{change.newDate}</AdminCalendarModalListItemDate>
                      </AdminCalendarModalListItemMeta>
                      <AdminCalendarModalListItemReason $reasonColor="#3b82f6">{change.reason}</AdminCalendarModalListItemReason>
                    </AdminCalendarModalListItemContent>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                      onClick={() => {
                        toast.success('일정이 삭제되었습니다.');
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AdminCalendarModalListItemHeader>
                </AdminCalendarModalListItem>
              ))}

              {scheduleChanges.length === 0 && <AdminCalendarModalEmptyState>일정 변경 내역이 없습니다</AdminCalendarModalEmptyState>}
            </>
          ) : (
            <>
              {filteredSchedule
                .filter((e) => e.stage === '검수')
                .map((event, idx) => (
                  <AdminCalendarModalListItem key={idx} $bgColor="#fff7ed" $borderColor="#fed7aa">
                    <AdminCalendarModalListItemHeader>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1 }}>
                        <AdminCalendarDeadlineColorBar $color={event.stageColor} />
                        <AdminCalendarModalListItemContent>
                          <AdminCalendarModalListItemTitle $textColor="#92400e">
                            {event.projectTitle} {event.episode}
                          </AdminCalendarModalListItemTitle>
                          <AdminCalendarModalListItemSubtitle $subTextColor="#c2410c">1월 {event.date}일</AdminCalendarModalListItemSubtitle>
                          <Badge className="mt-2 text-xs bg-orange-500">마감 임박</Badge>
                        </AdminCalendarModalListItemContent>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-100"
                        onClick={() => {
                          toast.success('마감이 삭제되었습니다.');
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AdminCalendarModalListItemHeader>
                  </AdminCalendarModalListItem>
                ))}

              {filteredSchedule.filter((e) => e.stage === '검수').length === 0 && <AdminCalendarModalEmptyState>예정된 마감이 없습니다</AdminCalendarModalEmptyState>}
            </>
          )}
        </AdminCalendarModalList>
      </Modal>
    </AdminCalendarRoot>
  );
}
