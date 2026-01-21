import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight, Trash2 } from 'lucide-react';
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
  AdminCalendarDateMemoText,
  AdminCalendarEventBar,
  AdminCalendarEventBarText,
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

  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
  const [upcomingModalType, setUpcomingModalType] = useState('schedule');

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
    setCurrentNote(dayNote?.note || '');
    setIsDayDetailModalOpen(true);
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
                    <AdminCalendarLegendColor $bgColor="rgba(156, 39, 176, 0.15)" $borderColor="rgba(156, 39, 176, 0.3)" />
                    <AdminCalendarLegendLabel>워케이션</AdminCalendarLegendLabel>
                  </AdminCalendarLegend>
                  <AdminCalendarLegend>
                    <AdminCalendarLegendColor $bgColor="rgba(156, 163, 175, 0.25)" $borderColor="rgba(156, 163, 175, 0.4)" />
                    <AdminCalendarLegendLabel>휴재</AdminCalendarLegendLabel>
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
                    <div key={`empty-${i}`} style={{ width: '100%', height: '100%', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }} />
                  ))}

                  {/* Days */}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === 13;
                    const dayEvents = filteredSchedule.filter((e) => e.date === day);
                    const attendanceType = getAttendanceForDate(day);
                    const dayOfWeek = (day + 2) % 7;

                    const startingEvents = dayEvents.filter((e) => {
                      if (!e.startDate || e.startDate === day) return true;
                      if (dayOfWeek === 0 && e.startDate < day && e.endDate && e.endDate >= day) return true;
                      return false;
                    });

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
                          {/* 메모 표시 */}
                          {dayNote && (
                            <AdminCalendarDateMemo>
                              <span style={{ fontSize: '12px' }}>📝</span>
                              <AdminCalendarDateMemoText>{dayNote.note}</AdminCalendarDateMemoText>
                            </AdminCalendarDateMemo>
                          )}

                          {/* 시작하는 작업만 표시 */}
                          {startingEvents.slice(0, 3).map((event, idx) => {
                            const isMultiDay = event.startDate && event.endDate && event.startDate !== event.endDate;
                            const daysUntilSaturday = 6 - dayOfWeek;
                            const lastDayOfWeek = day + daysUntilSaturday;
                            const displayEndDate = isMultiDay ? Math.min(event.endDate, lastDayOfWeek, 31) : day;
                            const daySpan = displayEndDate - day + 1;
                            const continuesNextWeek = isMultiDay && event.endDate > lastDayOfWeek;
                            const isContinuedFromLastWeek = dayOfWeek === 0 && event.startDate < day;
                            const barWidth = daySpan > 1 ? `calc(${daySpan * 100}% + ${(daySpan - 1) * 2}px)` : '100%';
                            const truncatedProject = truncateProjectName(event.projectTitle || '');
                            const displayTitle = `${truncatedProject} ${event.episode} ${event.stage}`;

                            return (
                              <AdminCalendarEventBar
                                key={idx}
                                $isMultiDay={daySpan > 1}
                                $width={barWidth}
                                $color={event.stageColor}
                                $topOffset={idx * 28 + (dayNote ? 32 : 0)}
                              >
                                <AdminCalendarEventBarText>
                                  {isContinuedFromLastWeek && <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ transform: 'rotate(180deg)' }} />}
                                  {displayTitle}
                                </AdminCalendarEventBarText>
                                {continuesNextWeek && <ArrowRight className="w-3 h-3 flex-shrink-0 ml-1" />}
                              </AdminCalendarEventBar>
                            );
                          })}

                          {/* 진행 중인 작업은 공간만 차지 */}
                          {ongoingEvents.slice(0, 3).map((_, idx) => (
                            <div key={`ongoing-${idx}`} style={{ fontSize: '12px', padding: '6px 0', height: '28px', visibility: 'hidden' }}>
                              &nbsp;
                            </div>
                          ))}

                          {dayEvents.length > 3 && <AdminCalendarMoreEvents>+{dayEvents.length - 3}개 더보기</AdminCalendarMoreEvents>}
                        </AdminCalendarDateEvents>
                      </AdminCalendarDateCell>
                    );
                  })}

                  {/* Empty cells after last day */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`empty-end-${i}`} style={{ width: '100%', height: '100%', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }} />
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

      {/* 날짜 클릭 시 메모 모달 */}
      <Modal isOpen={isDayDetailModalOpen} onClose={() => setIsDayDetailModalOpen(false)} title={`1월 ${selectedDate}일 - ${artists.find((a) => a.id === selectedArtist)?.name}`} maxWidth="lg">
        {selectedDate !== null && (
          <AdminCalendarModalForm>
            <AdminCalendarModalField>
              <AdminCalendarModalLabel>담당자 메모</AdminCalendarModalLabel>
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
          </AdminCalendarModalForm>
        )}
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
