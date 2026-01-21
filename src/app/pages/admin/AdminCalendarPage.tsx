import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/app/components/Modal';
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ArtistSchedule {
  artistId: string;
  artistName: string;
  projects: {
    id: string;
    title: string;
    episodes: {
      date: number;
      episode: string;
      stage: string;
      stageColor: string;
      startDate?: number;
      endDate?: number;
    }[];
  }[];
  attendance: {
    date: number;
    type: 'break' | 'workation';
  }[];
}

export function AdminCalendarPage() {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  
  // 작가 목록 데이터 (ㄱ 순서대로 정렬)
  const artists = [
    { id: 'artist1', name: '김작가', projects: ['나의 히어로', '별빛 아래서'] },
    { id: 'artist2', name: '나작가', projects: ['러브 스토리'] },
    { id: 'artist3', name: '박작가', projects: ['판타지 월드'] },
  ];

  // 필터 상태 (기본값: 전체 선택)
  const [selectedArtist, setSelectedArtist] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('');
  
  // 메모 상태 (작가별, 날짜별)
  const [adminNotes, setAdminNotes] = useState<{ [artistId: string]: { date: number; note: string }[] }>({
    artist1: [
      { date: 10, note: 'EP.42 마감 확인 필요' },
    ],
    artist2: [],
    artist3: [],
  });
  const [currentNote, setCurrentNote] = useState('');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false);
  
  // 더보기 모달 상태
  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
  const [upcomingModalType, setUpcomingModalType] = useState<'schedule' | 'deadline'>('schedule');

  // 작가별 일정 데이터 (예시)
  const artistSchedules: ArtistSchedule[] = [
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

  // 웹툰 제목 자르기 (4글자 초과 시)
  const truncateProjectName = (name: string) => {
    if (name.length > 4) {
      return name.substring(0, 4) + '...';
    }
    return name;
  };

  // 필터링된 일정 가져오기
  const getFilteredSchedule = () => {
    // 전체 작가 선택 시
    if (selectedArtist === 'all') {
      // 모든 작가의 모든 프로젝트 일정 합치기
      return artistSchedules.flatMap(artist =>
        artist.projects.flatMap(p =>
          p.episodes.map(e => ({ 
            ...e, 
            projectTitle: p.title,
            artistName: artist.artistName 
          }))
        )
      );
    }
    
    const artist = artistSchedules.find(a => a.artistId === selectedArtist);
    if (!artist) return [];

    if (!selectedProject) {
      // 모든 프로젝트 일정 합치기
      return artist.projects.flatMap(p => 
        p.episodes.map(e => ({ 
          ...e, 
          projectTitle: p.title,
          artistName: artist.artistName 
        }))
      );
    }

    // 특정 프로젝트만 필터링
    const project = artist.projects.find(p => p.title === selectedProject);
    return project ? project.episodes.map(e => ({ 
      ...e, 
      projectTitle: project.title,
      artistName: artist.artistName 
    })) : [];
  };

  const filteredSchedule = getFilteredSchedule();

  // 근태 데이터 가져오기
  const getAttendanceForDate = (day: number) => {
    // 전체 작가 선택 시에는 근태 표시 안 함
    if (selectedArtist === 'all') return null;
    
    const artist = artistSchedules.find(a => a.artistId === selectedArtist);
    if (!artist) return null;

    const attendance = artist.attendance.find(a => a.date === day);
    return attendance ? attendance.type : null;
  };

  // 근태 배경색
  const getAttendanceBackgroundColor = (type: string | null) => {
    if (!type) return '';
    
    switch (type) {
      case 'workation':
        return 'bg-purple-500/15 hover:bg-purple-500/25';
      case 'break':
        return 'bg-gray-400/25 hover:bg-gray-400/35';
      default:
        return '';
    }
  };

  // 선택된 작가의 프로젝트 목록
  const selectedArtistProjects = selectedArtist 
    ? artists.find(a => a.id === selectedArtist)?.projects || []
    : [];

  // 연재 일정 변경 사항 (예시)
  const scheduleChanges = [
    { artistName: '김작가', project: '나의 히어로', episode: 'EP.43', originalDate: '1/19', newDate: '1/22', reason: '긴급휴재로 인한 조정' },
  ];

  // 날짜 클릭 핸들러
  const handleDateClick = (day: number) => {
    setSelectedDate(day);
    const dayNote = adminNotes[selectedArtist]?.find(n => n.date === day);
    setCurrentNote(dayNote?.note || '');
    setIsDayDetailModalOpen(true);
  };

  // 메모 저장 핸들러
  const handleSaveNote = () => {
    if (selectedDate === null) return;
    
    const existingNoteIndex = adminNotes[selectedArtist]?.findIndex(n => n.date === selectedDate) ?? -1;
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
        const updatedNotes = adminNotes[selectedArtist].filter(n => n.date !== selectedDate);
        setAdminNotes({ ...adminNotes, [selectedArtist]: updatedNotes });
        toast.success('메모가 삭제되었습니다.');
      }
    }
  };

  // 메모 삭제 핸들러
  const handleDeleteNote = (artistId: string, date: number) => {
    const updatedNotes = adminNotes[artistId].filter(n => n.date !== date);
    setAdminNotes({ ...adminNotes, [artistId]: updatedNotes });
    toast.success('메모가 삭제되었습니다.');
  };

  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar">
      <div className="pb-24 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-6" style={{ height: 'calc(100vh - 180px)' }}>
            {/* Left Column - Calendar (2/3) */}
            <div className="col-span-2 flex flex-col gap-4">
              {/* 필터 영역 */}
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">작가 선택</label>
                    <select
                      value={selectedArtist}
                      onChange={(e) => {
                        setSelectedArtist(e.target.value);
                        setSelectedProject(''); // 작가 변경 시 프로젝트 초기화
                      }}
                      className="w-full h-9 px-3 py-1.5 rounded-md border-2 border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                    >
                      <option value="all">전체 작가</option>
                      {artists.map(artist => (
                        <option key={artist.id} value={artist.id}>{artist.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">웹툰 선택</label>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full h-9 px-3 py-1.5 rounded-md border-2 border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                    >
                      <option value="">전체 작품</option>
                      {selectedArtistProjects.map(project => (
                        <option key={project} value={project}>{project}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>

              {/* 캘린더 */}
              <Card className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-semibold text-foreground">2026년 1월</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 px-4 py-2 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-purple-500/15 border border-purple-500/30"></div>
                      <span className="text-xs text-muted-foreground">워케이션</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gray-400/25 border border-gray-400/40"></div>
                      <span className="text-xs text-muted-foreground">휴재</span>
                    </div>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 min-h-0 flex flex-col">
                  {/* Days of week */}
                  <div className="grid grid-cols-7 gap-2 mb-2 flex-shrink-0">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar dates grid */}
                  <div className="grid grid-cols-7 grid-rows-5 flex-1 border-l border-t border-border">
                    {/* Empty cells before first day */}
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={`empty-${i}`} className="w-full h-full border-r border-b border-border" />
                    ))}

                    {/* Days */}
                    {Array.from({ length: 31 }).map((_, i) => {
                      const day = i + 1;
                      const isToday = day === 13;
                      const dayEvents = filteredSchedule.filter(e => e.date === day);
                      const attendanceType = getAttendanceForDate(day);
                      const attendanceBgColor = getAttendanceBackgroundColor(attendanceType);

                      // 요일 계산 (1일이 수요일이므로 day + 2를 7로 나눈 나머지)
                      const dayOfWeek = (day + 2) % 7; // 0: 일요일, 1: 월요일, ..., 6: 토요일

                      // 이 날짜에 시작하는 작업 또는 주의 시작(일요일)에 이어지는 작업 필터링
                      const startingEvents = dayEvents.filter(e => {
                        // 작업의 실제 시작일이면 표시
                        if (!e.startDate || e.startDate === day) return true;
                        // 작업이 진행 중이고 오늘이 일요일(주의 시작)이면 표시
                        if (dayOfWeek === 0 && e.startDate < day && e.endDate && e.endDate >= day) return true;
                        return false;
                      });
                      
                      // 진행 중인 작업 (시작일도 아니고 일요일도 아닌 날)
                      const ongoingEvents = dayEvents.filter(e => {
                        if (!e.startDate || e.startDate === day) return false;
                        if (dayOfWeek === 0 && e.startDate < day && e.endDate && e.endDate >= day) return false;
                        return true;
                      });

                      // 메모 확인
                      const dayNote = adminNotes[selectedArtist]?.find(n => n.date === day);

                      return (
                        <div
                          key={day}
                          className={`w-full h-full border-r border-b border-border p-2 transition-colors cursor-pointer flex flex-col relative ${isToday ? 'bg-primary/5' : ''} ${attendanceBgColor || 'hover:bg-muted/50'}`}
                          onClick={() => handleDateClick(day)}
                        >
                          <div className={`text-sm font-medium mb-1 flex-shrink-0 ${isToday ? 'text-primary font-bold' : 'text-foreground'}`}>
                            {day}
                          </div>
                          <div className="space-y-1 flex-1 overflow-visible relative">
                            {/* 메모 표시 */}
                            {dayNote && (
                              <div className="bg-yellow-100 border border-yellow-300 rounded px-2 py-1 mb-1">
                                <div className="flex items-start gap-1">
                                  <span className="text-xs">📝</span>
                                  <span className="text-xs text-yellow-900 truncate flex-1">{dayNote.note}</span>
                                </div>
                              </div>
                            )}
                            
                            {/* 시작하는 작업만 표시 (여러 날 걸치면 width 늘림) */}
                            {startingEvents.slice(0, 3).map((event, idx) => {
                              // 연속된 일정인지 확인
                              const isMultiDay = event.startDate && event.endDate && event.startDate !== event.endDate;
                              
                              // 이번 주 토요일까지의 날짜 계산
                              const daysUntilSaturday = 6 - dayOfWeek; // 토요일까지 남은 일수
                              const lastDayOfWeek = day + daysUntilSaturday; // 이번 주 마지막 날
                              
                              // 실제 표시할 마지막 날 (작업 종료일과 주 마지막 날 중 작은 값)
                              const displayEndDate = isMultiDay 
                                ? Math.min(event.endDate!, lastDayOfWeek, 31)
                                : day;
                              
                              const daySpan = displayEndDate - day + 1;
                              
                              // 주를 넘어가는지 확인 (토요일에서 끝나지만 실제 종료일은 더 나중인 경우)
                              const continuesNextWeek = isMultiDay && event.endDate! > lastDayOfWeek;
                              
                              // 이번 주 시작(일요일)에 이어지는 작업인지 확인
                              const isContinuedFromLastWeek = dayOfWeek === 0 && event.startDate < day;
                              
                              // 셀의 너비 계산 (border 1px 고려)
                              const barWidth = daySpan > 1
                                ? `calc(${daySpan * 100}% + ${(daySpan - 1) * 2}px)` 
                                : '100%';
                              
                              // 제목 포맷
                              const truncatedProject = truncateProjectName(event.projectTitle || '');
                              const displayTitle = `${truncatedProject} ${event.episode} ${event.stage}`;
                              
                              return (
                                <div
                                  key={idx}
                                  className="text-xs px-2 py-1.5 truncate font-semibold rounded shadow-sm flex items-center justify-between"
                                  style={{ 
                                    backgroundColor: event.stageColor,
                                    color: '#FFFFFF',
                                    width: barWidth,
                                    position: daySpan > 1 ? 'absolute' : 'relative',
                                    left: daySpan > 1 ? 0 : undefined,
                                    top: daySpan > 1 ? `${idx * 28 + (dayNote ? 32 : 0)}px` : undefined,
                                    zIndex: daySpan > 1 ? 10 : 1,
                                  }}
                                >
                                  <span className="truncate flex-1 flex items-center gap-1">
                                    {isContinuedFromLastWeek && (
                                      <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ transform: 'rotate(180deg)' }} />
                                    )}
                                    {displayTitle}
                                  </span>
                                  {continuesNextWeek && (
                                    <ArrowRight className="w-3 h-3 flex-shrink-0 ml-1" />
                                  )}
                                </div>
                              );
                            })}
                            
                            {/* 진행 중인 작업은 공간만 차지 (보이지 않음) */}
                            {ongoingEvents.slice(0, 3).map((_, idx) => (
                              <div key={`ongoing-${idx}`} className="text-xs py-1.5" style={{ height: '28px', visibility: 'hidden' }}>
                                &nbsp;
                              </div>
                            ))}
                            
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-muted-foreground px-1">
                                +{dayEvents.length - 3}개 더보기
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Empty cells after last day */}
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={`empty-end-${i}`} className="w-full h-full border-r border-b border-border" />
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Management Panel (1/3) */}
            <div className="flex flex-col gap-4">
              {/* 일정 변경 내역 */}
              <Card className="p-5 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground text-base">일정 조정</h3>
                  </div>
                  <button
                    onClick={() => {
                      setUpcomingModalType('schedule');
                      setIsUpcomingModalOpen(true);
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    더보기
                  </button>
                </div>
                <div className="space-y-2 overflow-y-auto flex-1 pr-1 hide-scrollbar">
                  {scheduleChanges.slice(0, 3).map((change, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex-shrink-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-blue-900">{change.artistName} - {change.project}</p>
                        <p className="text-xs text-blue-700">{change.episode}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-blue-600 line-through">{change.originalDate}</span>
                          <span className="text-xs text-blue-600">→</span>
                          <span className="text-xs font-semibold text-blue-900">{change.newDate}</span>
                        </div>
                        <p className="text-xs text-blue-500 mt-1">{change.reason}</p>
                      </div>
                    </div>
                  ))}
                  
                  {scheduleChanges.length === 0 && (
                    <div className="text-center text-muted-foreground text-xs py-4 bg-muted/20 rounded-lg">
                      일정 변경 내역이 없습니다
                    </div>
                  )}
                </div>
              </Card>

              {/* 다가오는 마감 */}
              <Card className="p-5 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <h3 className="font-semibold text-foreground text-base">다가오는 마감</h3>
                  </div>
                  <button
                    onClick={() => {
                      setUpcomingModalType('deadline');
                      setIsUpcomingModalOpen(true);
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    더보기
                  </button>
                </div>
                <div className="space-y-2 overflow-y-auto flex-1 pr-1 hide-scrollbar">
                  {filteredSchedule
                    .filter(e => e.stage === '검수')
                    .slice(0, 3)
                    .map((event, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 bg-orange-50 rounded-lg border border-orange-200 flex-shrink-0"
                      >
                        <div className="flex items-start gap-2">
                          <div 
                            className="w-1 h-full rounded-full flex-shrink-0 mt-1"
                            style={{ backgroundColor: event.stageColor, minHeight: '40px' }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-orange-900 truncate">
                              {event.projectTitle} {event.episode}
                            </p>
                            <p className="text-xs text-orange-700 mt-1">1월 {event.date}일</p>
                            <Badge className="mt-2 text-xs bg-orange-500">마감 임박</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {filteredSchedule.filter(e => e.stage === '검수').length === 0 && (
                    <div className="text-center text-muted-foreground text-xs py-4 bg-muted/20 rounded-lg">
                      예정된 마감이 없습니다
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 날짜 클릭 시 메모 모달 */}
      <Modal
        isOpen={isDayDetailModalOpen}
        onClose={() => setIsDayDetailModalOpen(false)}
        title={`1월 ${selectedDate}일 - ${artists.find(a => a.id === selectedArtist)?.name}`}
        maxWidth="lg"
      >
        {selectedDate !== null && (
          <div className="space-y-4">
            {/* 메모 입력 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">담당자 메모</label>
              <textarea
                placeholder="메모를 입력하세요"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsDayDetailModalOpen(false)}
              >
                취소
              </Button>
              <Button onClick={() => {
                handleSaveNote();
                setIsDayDetailModalOpen(false);
              }}>
                저장
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 더보기 모달 - 일정 조정 & 다가오는 마감 전체 목록 */}
      <Modal
        isOpen={isUpcomingModalOpen}
        onClose={() => setIsUpcomingModalOpen(false)}
        title={upcomingModalType === 'schedule' ? '일정 조정 전체 목록' : '다가오는 마감 전체 목록'}
        maxWidth="2xl"
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {upcomingModalType === 'schedule' ? (
            // 일정 조정 목록
            <>
              {scheduleChanges.map((change, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex-shrink-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-blue-900">{change.artistName} - {change.project}</p>
                      <p className="text-xs text-blue-700">{change.episode}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-blue-600 line-through">{change.originalDate}</span>
                        <span className="text-xs text-blue-600">→</span>
                        <span className="text-xs font-semibold text-blue-900">{change.newDate}</span>
                      </div>
                      <p className="text-xs text-blue-500 mt-1">{change.reason}</p>
                    </div>
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
                  </div>
                </div>
              ))}
              
              {scheduleChanges.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8 bg-muted/20 rounded-lg">
                  일정 변경 내역이 없습니다
                </div>
              )}
            </>
          ) : (
            // 다가오는 마감 목록
            <>
              {filteredSchedule
                .filter(e => e.stage === '검수')
                .map((event, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 bg-orange-50 rounded-lg border border-orange-200 flex-shrink-0"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <div 
                          className="w-1 h-full rounded-full flex-shrink-0 mt-1"
                          style={{ backgroundColor: event.stageColor, minHeight: '40px' }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-orange-900">
                            {event.projectTitle} {event.episode}
                          </p>
                          <p className="text-xs text-orange-700 mt-1">1월 {event.date}일</p>
                          <Badge className="mt-2 text-xs bg-orange-500">마감 임박</Badge>
                        </div>
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
                    </div>
                  </div>
                ))}
              
              {filteredSchedule.filter(e => e.stage === '검수').length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8 bg-muted/20 rounded-lg">
                  예정된 마감이 없습니다
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}