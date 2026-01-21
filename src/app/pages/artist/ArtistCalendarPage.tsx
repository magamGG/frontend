import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/app/components/Modal';
import { ChevronLeft, ChevronRight, Plus, AlignLeft, Palette, ClipboardList, Save, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { LeaveRequestModal } from '@/app/components/modals/LeaveRequestModal';

interface Event {
  id: string;
  date: number;
  title: string;
  workType: 'serialization' | 'break' | 'other';
  workStage?: 'storyboard' | 'sketch' | 'lineart' | 'coloring' | 'background' | 'effects' | 'review'; // 작업 단계
  category: 'personal' | 'work';
  project?: string;
  episode?: string; // 에피소드 번호 (예: "EP.42")
  description?: string;
  color?: string;
  isAttendance?: boolean; // 근태에서 생성된 일정인지 구분
  attendanceType?: 'break' | 'emergency_break' | 'workation'; // 근태 유형
  startDate?: number; // 작업 시작일
  endDate?: number; // 작업 종료일 (여러 날짜에 걸친 작업)
}

interface DayNote {
  date: number;
  note: string;
}

interface ArtistCalendarPageProps {
  openAttendanceModal?: boolean;
  onCloseAttendanceModal?: () => void;
}

export function ArtistCalendarPage({ openAttendanceModal, onCloseAttendanceModal }: ArtistCalendarPageProps = {}) {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const currentMonth = '2026년 1월';
  
  // 작업 단계 정의
  const workStages = [
    { value: 'storyboard', label: '콘티', color: '#FCD34D' },
    { value: 'sketch', label: '스케치', color: '#FB923C' },
    { value: 'lineart', label: '선화', color: '#60A5FA' },
    { value: 'coloring', label: '채색', color: '#F472B6' },
    { value: 'background', label: '배경', color: '#4ADE80' },
    { value: 'effects', label: '후보정', color: '#A78BFA' },
    { value: 'review', label: '검수', color: '#F87171' },
  ];

  // 작업 단계로 색상 가져오기
  const getWorkStageColor = (stage?: string) => {
    if (!stage) return null;
    const stageInfo = workStages.find(s => s.value === stage);
    return stageInfo ? stageInfo.color : null;
  };

  // 작업 단계로 라벨 가져오기
  const getWorkStageLabel = (stage?: string) => {
    if (!stage) return '';
    const stageInfo = workStages.find(s => s.value === stage);
    return stageInfo ? stageInfo.label : '';
  };

  // 웹툰 제목 자르기 (4글자 초과 시)
  const truncateProjectName = (name: string) => {
    if (name.length > 4) {
      return name.substring(0, 4) + '...';
    }
    return name;
  };
  
  const [filterCategory, setFilterCategory] = useState<'all' | 'personal' | 'work'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(openAttendanceModal || false);
  const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMemoDetailModalOpen, setIsMemoDetailModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedMemoDate, setSelectedMemoDate] = useState<number | null>(null);
  const [editingMemoContent, setEditingMemoContent] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: '',
    endDate: '',
    category: 'work' as 'personal' | 'work',
    project: '내 웹툰' as string,
    color: '#6E8FB3' as string,
    description: '',
    workType: 'serialization' as 'serialization' | 'break' | 'other',
    workStage: '' as string, // 작업 단계
  });
  const [attendanceRequest, setAttendanceRequest] = useState({
    type: 'break' as 'break' | 'workation',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [dayNotes, setDayNotes] = useState<DayNote[]>([
    { date: 5, note: '마감일 점검 필요' },
    { date: 15, note: '휴식 필요' },
  ]);
  const [currentNote, setCurrentNote] = useState('');

  // 근태 데이터 상태 (임시 데이터 포함)
  const [attendanceData, setAttendanceData] = useState<any[]>([
    {
      id: 1,
      type: 'workation',
      typeName: '워케이션',
      startDate: '2026-01-05',
      endDate: '2026-01-07',
      days: 3,
      reason: '제주도 워케이션',
      status: 'approved',
      requestDate: '2025-12-20',
    },
    {
      id: 2,
      type: 'break',
      typeName: '휴재',
      startDate: '2026-01-10',
      endDate: '2026-01-12',
      days: 3,
      reason: '개인 사유',
      status: 'approved',
      requestDate: '2026-01-05',
    },
    {
      id: 3,
      type: 'break',
      typeName: '휴재',
      startDate: '2026-01-20',
      endDate: '2026-01-20',
      days: 1,
      reason: '건강 문제',
      status: 'approved',
      requestDate: '2026-01-19',
    },
    {
      id: 4,
      type: 'workation',
      typeName: '워케이션',
      startDate: '2026-01-25',
      endDate: '2026-01-27',
      days: 3,
      reason: '강릉 워케이션',
      status: 'approved',
      requestDate: '2026-01-10',
    },
  ]);

  // 작품 데이터 상태
  const [projectsData, setProjectsData] = useState<any[]>([]);

  // 특정 날짜에 근태가 있는지 확인하는 함수
  const getAttendanceForDate = (day: number) => {
    const dateStr = `2026-01-${day.toString().padStart(2, '0')}`;
    
    for (const attendance of attendanceData) {
      if (attendance.status !== 'approved') continue; // 승인된 것만 표시
      
      const start = new Date(attendance.startDate);
      const end = new Date(attendance.endDate);
      const current = new Date(dateStr);
      
      if (current >= start && current <= end) {
        return attendance.type; // 'break', 'emergency_break', 'workation'
      }
    }
    return null;
  };

  // 근태 유형에 따른 배경색 반환
  const getAttendanceBackgroundColor = (type: string | null) => {
    if (!type) return '';
    
    switch (type) {
      case 'workation':
        return 'bg-purple-500/15 hover:bg-purple-500/25'; // hover 시 더 진하게
      case 'break':
        return 'bg-gray-400/25 hover:bg-gray-400/35'; // hover 시 더 진하게
      default:
        return '';
    }
  };

  // 모든 일정 데이터
  const [allEvents, setAllEvents] = useState<Event[]>([
    // EP.42 마감 (1일)
    { id: '1', date: 5, title: 'EP.42 마감', workType: 'serialization', workStage: 'review', category: 'work', project: '나의 히어로', episode: 'EP.42', description: '최종 검수 및 업로드', color: '#EF4444', startDate: 5, endDate: 5 },
    
    // EP.43 콘티 (2일)
    { id: '2', date: 6, title: 'EP.43 콘티', workType: 'serialization', workStage: 'storyboard', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 6, endDate: 7 },
    { id: '3', date: 7, title: 'EP.43 콘티', workType: 'serialization', workStage: 'storyboard', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 6, endDate: 7 },
    
    // EP.43 스케치 (1일)
    { id: '4', date: 8, title: 'EP.43 스케치', workType: 'serialization', workStage: 'sketch', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 8, endDate: 8 },
    
    // EP.43 선화 (2일)
    { id: '5', date: 14, title: 'EP.43 선화', workType: 'serialization', workStage: 'lineart', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 14, endDate: 15 },
    { id: '6', date: 15, title: 'EP.43 선화', workType: 'serialization', workStage: 'lineart', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 14, endDate: 15 },
    
    // EP.43 채색 (3일)
    { id: '7', date: 16, title: 'EP.43 채색', workType: 'serialization', workStage: 'coloring', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 16, endDate: 18 },
    { id: '8', date: 17, title: 'EP.43 채색', workType: 'serialization', workStage: 'coloring', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 16, endDate: 18 },
    { id: '9', date: 18, title: 'EP.43 ', workType: 'serialization', workStage: 'coloring', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 16, endDate: 18 },
    
    // EP.43 배경 (1일)
    { id: '10', date: 19, title: 'EP.43 배경', workType: 'serialization', workStage: 'background', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F59E0B', startDate: 19, endDate: 19 },
    
    // 신작 콘티 (2일)
    { id: '11', date: 21, title: '신작 콘티', workType: 'serialization', workStage: 'storyboard', category: 'work', project: '별빛 아래서', episode: 'EP.01', description: '신작 기획', color: '#8B5CF6', startDate: 21, endDate: 22 },
    { id: '12', date: 22, title: '신작 콘티', workType: 'serialization', workStage: 'storyboard', category: 'work', project: '별빛 아래서', episode: 'EP.01', description: '신작 기획', color: '#8B5CF6', startDate: 21, endDate: 22 },
    
    // EP.44 후보정 (2일)
    { id: '13', date: 24, title: 'EP.44 후보정', workType: 'serialization', workStage: 'effects', category: 'work', project: '나의 히어로', episode: 'EP.44', color: '#F59E0B', startDate: 24, endDate: 25 },
    { id: '14', date: 25, title: 'EP.44 후보정', workType: 'serialization', workStage: 'effects', category: 'work', project: '나의 히어로', episode: 'EP.44', color: '#F59E0B', startDate: 24, endDate: 25 },
  ]);

  // 근태 데이터를 일정으로 변환하여 가
  useEffect(() => {
    // 근태는 배경색으로만 표시하고 일정 목록에는 추가하지 않음
    // 배경색은 getAttendanceForDate와 getAttendanceBackgroundColor 함수로 처리됨
  }, [attendanceData]);

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

  // 필터링된 일정
  const filteredEvents = allEvents.filter(event => {
    if (filterCategory === 'all') return true;
    return event.category === filterCategory;
  });

  // 선택된 날짜의 일정들
  const selectedDateEvents = selectedDate ? filteredEvents.filter(e => e.date === selectedDate) : [];

  // 다가오는 일정 (오늘 기준 이후, 정렬됨)
  const upcomingEvents = filteredEvents
    .filter(e => e.date >= 13)
    .sort((a, b) => a.date - b.date)
    .slice(0, 5);

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
    const dayNote = dayNotes.find(n => n.date === day);
    setCurrentNote(dayNote?.note || '');
    setIsDayDetailModalOpen(true);
  };

  const handleDateSingleClick = (day: number) => {
    setSelectedDate(day);
  };

  const handleDateDoubleClick = (day: number) => {
    const dayNote = dayNotes.find(n => n.date === day);
    setCurrentNote(dayNote?.note || '');
    setIsDayDetailModalOpen(true);
  };

  const handleSaveNote = () => {
    if (selectedDate === null) return;
    
    const existingNoteIndex = dayNotes.findIndex(n => n.date === selectedDate);
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
        setDayNotes(dayNotes.filter(n => n.date !== selectedDate));
        toast.success('메모가 삭제되었습니다.');
      }
    }
  };

  const handleAttendanceSubmit = () => {
    if (!attendanceRequest.startDate || !attendanceRequest.endDate || !attendanceRequest.reason) {
      toast.error('모든 필수 항목을 입력해주세요.');
      return;
    }

    // localStorage에서 기존 근태 데이터 가져오기
    const existingAttendance = JSON.parse(localStorage.getItem('attendanceData') || '[]');
    
    // 새 신청 ID 생성
    const newId = existingAttendance.length > 0 
      ? Math.max(...existingAttendance.map((r: any) => r.id), 0) + 1 
      : 1;
    
    const startDate = new Date(attendanceRequest.startDate);
    const endDate = new Date(attendanceRequest.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const typeNameMap = {
      break: '휴재',
      emergency_break: '긴급 휴재',
      workation: '워케이션',
    };

    const newRequestData = {
      id: newId,
      type: attendanceRequest.type,
      typeName: typeNameMap[attendanceRequest.type],
      startDate: attendanceRequest.startDate,
      endDate: attendanceRequest.endDate,
      days: days,
      reason: attendanceRequest.reason,
      status: 'approved', // 자동 승인으로 설정
      requestDate: new Date().toISOString().split('T')[0],
      rejectionReason: '',
    };

    // localStorage에 저장
    localStorage.setItem('attendanceData', JSON.stringify([...existingAttendance, newRequestData]));

    setIsAttendanceModalOpen(false);
    toast.success('근태 신청이 완료되었습니다.');
    
    // 폼 초기화
    setAttendanceRequest({
      type: 'break',
      startDate: '',
      endDate: '',
      reason: '',
    });

    // 즉시 근태 데이터 다시 로드하여 화면에 반영
    const stored = localStorage.getItem('attendanceData');
    if (stored) {
      const data = JSON.parse(stored);
      setAttendanceData(data);
    }

    // onCloseAttendanceModal 콜백 호출
    if (onCloseAttendanceModal) {
      onCloseAttendanceModal();
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'break':
        return 'bg-blue-500/10 text-blue-700';
      case 'emergency_break':
        return 'bg-red-500/10 text-red-700';
      case 'workation':
        return 'bg-purple-500/10 text-purple-700';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const handleAddEvent = () => {
    const event: Event = {
      id: Date.now().toString(),
      date: parseInt(newEvent.startDate.split('-')[2]) || 1,
      title: newEvent.title,
      workType: newEvent.workType,
      category: newEvent.category,
      project: newEvent.category === 'work' ? newEvent.project : undefined,
      description: newEvent.description,
      color: newEvent.color,
      workStage: newEvent.workStage, // 작업 단계 추가
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
      workStage: '', // 작업 단계 초기화
    });
    toast.success('일정이 추가되었습니다.');
  };

  const handleEditEvent = () => {
    if (!editingEvent) return;
    
    const updatedEvents = allEvents.map(e => 
      e.id === editingEvent.id ? editingEvent : e
    );
    setAllEvents(updatedEvents);
    setIsEditModalOpen(false);
    setEditingEvent(null);
    toast.success('일정이 수정되었습니다.');
  };

  const handleDeleteEvent = (eventId: string) => {
    setAllEvents(allEvents.filter(e => e.id !== eventId));
    setSelectedDate(null);
    toast.success('일정이 삭제되었습니다.');
  };

  const openEditModal = () => {
    const eventToEdit = selectedDateEvents[selectedEventIndex];
    if (eventToEdit) {
      setEditingEvent({ ...eventToEdit });
      setIsDayDetailModalOpen(false);
      setIsEditModalOpen(true);
    }
  };

  const openEditModalForEvent = (event: Event) => {
    setEditingEvent({ ...event });
    setIsDayDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteEventFromDetail = (eventId: string) => {
    setAllEvents(allEvents.filter(e => e.id !== eventId));
    const remainingEvents = selectedDateEvents.filter(e => e.id !== eventId);
    if (remainingEvents.length === 0) {
      setIsDayDetailModalOpen(false);
    }
    toast.success('일정이 삭제되었습니다.');
  };

  // 메모 클릭 핸들러
  const handleMemoClick = (date: number) => {
    const dayNote = dayNotes.find(n => n.date === date);
    if (dayNote) {
      setSelectedMemoDate(date);
      setEditingMemoContent(dayNote.note);
      setIsMemoDetailModalOpen(true);
    }
  };

  // 메모 수정 저장
  const handleSaveMemoEdit = () => {
    if (selectedMemoDate === null) return;
    
    const existingNoteIndex = dayNotes.findIndex(n => n.date === selectedMemoDate);
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
    
    setDayNotes(dayNotes.filter(n => n.date !== selectedMemoDate));
    toast.success('메모가 삭제되었습니다.');
    setIsMemoDetailModalOpen(false);
    setSelectedMemoDate(null);
    setEditingMemoContent('');
  };

  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar">
      <div className="pb-24 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-6" style={{ height: 'calc(100vh - 180px)' }}>
            {/* Left Column - Calendar (2/3) */}
            <div className="col-span-2">
              <Card className="p-6 h-full flex flex-col">
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
                  
                  <div className="flex items-center gap-3">
                    {/* 근태 색상 범례 */}
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
                    
                    {/* 일정 필터 select box */}
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value as any)}
                      className="h-9 px-3 py-2 rounded-md border-2 border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors min-w-[110px]"
                    >
                      <option value="all">전체</option>
                      <option value="personal">개인 일정</option>
                      <option value="work">작품 일정</option>
                    </select>
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
                      const dayEvents = filteredEvents.filter(e => e.date === day);
                      const attendanceType = getAttendanceForDate(day);
                      const attendanceBgColor = getAttendanceBackgroundColor(attendanceType);
                      const dayNote = dayNotes.find(n => n.date === day);

                      // 요일 계산 (1일이 수요일이므로 day + 2를 7로 나눈 나머지)
                      const dayOfWeek = (day + 2) % 7; // 0: 일요일, 1: 월요일, ..., 6: 토요일

                      // �� 날짜에 시작하는 작업 또는 주의 시작(일요일)에 이어지는 작업 필터링
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

                      return (
                        <div
                          key={day}
                          onClick={() => handleDateClick(day)}
                          className={`w-full h-full border-r border-b border-border p-2 transition-colors cursor-pointer flex flex-col relative ${isToday ? 'bg-primary/5' : ''} ${attendanceBgColor || 'hover:bg-muted/50'}`}
                        >
                          <div className={`text-sm font-medium mb-1 flex-shrink-0 ${isToday ? 'text-primary font-bold' : 'text-foreground'}`}>
                            {day}
                          </div>
                          
                          {/* 일정 표시 영역 */}
                          <div className="space-y-1 flex-1 overflow-visible relative">
                            {/* 시작하는 작업만 표시 (여러 날 걸치면 width 늘림) */}
                            {startingEvents.slice(0, 3).map((event, idx) => {
                              const displayColor = getWorkStageColor(event.workStage) || event.color;
                              const stageLabel = getWorkStageLabel(event.workStage);
                              
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
                              
                              // 셀의 너비 계산 (border 1px 고려)
                              const barWidth = daySpan > 1
                                ? `calc(${daySpan * 100}% + ${(daySpan - 1) * 2}px)` 
                                : '100%';
                              
                              // 제목 포맷: "웹툰제목 EP.번호 작업단계" (웹툰 제목은 4글자 초과 시 ... 처리)
                              let displayTitle = event.title;
                              if (event.category === 'work' && event.project) {
                                const truncatedProject = truncateProjectName(event.project);
                                const episodePart = event.episode ? ` ${event.episode}` : '';
                                const stagePart = stageLabel ? ` ${stageLabel}` : '';
                                displayTitle = `${truncatedProject}${episodePart}${stagePart}`;
                              }
                              
                              return (
                                <div
                                  key={idx}
                                  className="text-xs px-2 py-1.5 truncate font-semibold rounded shadow-sm"
                                  style={{ 
                                    backgroundColor: displayColor,
                                    color: '#FFFFFF',
                                    width: barWidth,
                                    position: daySpan > 1 ? 'absolute' : 'relative',
                                    left: daySpan > 1 ? 0 : undefined,
                                    top: daySpan > 1 ? `${idx * 28}px` : undefined,
                                    zIndex: daySpan > 1 ? 10 : 1,
                                  }}
                                >
                                  {displayTitle}
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
                          
                          {/* 메모 표시 영역 - 일정 아래 별도로 표시 */}
                          {dayNote && (
                            <div 
                              className="text-xs px-2 py-1 rounded truncate bg-yellow-100 text-yellow-900 border border-yellow-300 cursor-pointer hover:bg-yellow-200 transition-colors mt-1" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMemoClick(day);
                              }}
                            >
                              📝 {dayNote.note}
                            </div>
                          )}
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

            {/* Right Column - Upcoming Events (1/3) */}
            <div>
              <Card className="p-5 h-full flex flex-col">
                <h3 className="font-semibold text-foreground mb-4 text-base">다가오는 일정</h3>
                <div className="flex flex-col gap-4 flex-1 min-h-0">
                  {/* 작품 관련 일정 */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <h4 className="text-sm font-semibold text-foreground">작품 관련</h4>
                      <span className="text-xs text-muted-foreground ml-auto">최근 3개</span>
                    </div>
                    <div className="space-y-2 overflow-y-auto flex-1 pr-1 hide-scrollbar">
                      {upcomingEvents.filter(e => e.category === 'work').slice(0, 3).map((event, idx) => {
                        const displayColor = getWorkStageColor(event.workStage) || event.color;
                        const stageLabel = getWorkStageLabel(event.workStage);
                        const truncatedProject = event.project ? truncateProjectName(event.project) : '';
                        
                        return (
                          <div 
                            key={idx} 
                            className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer flex-shrink-0"
                            onClick={() => handleDateClick(event.date)}
                          >
                            <div className="flex items-start gap-2">
                              <div 
                                className="w-1 h-full rounded-full flex-shrink-0 mt-1"
                                style={{ backgroundColor: displayColor, minHeight: '40px' }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {truncatedProject} {event.episode} {stageLabel}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">1월 {event.date}일</p>
                                {event.startDate && event.endDate && event.startDate !== event.endDate && (
                                  <p className="text-xs text-muted-foreground">
                                    ({event.endDate - event.startDate + 1}일 작업)
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {upcomingEvents.filter(e => e.category === 'work').length === 0 && (
                        <div className="text-center text-muted-foreground text-xs py-4 bg-muted/20 rounded-lg">
                          예정된 작품 일정이 없습니다
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 구분선 */}
                  <div className="border-t border-border flex-shrink-0"></div>

                  {/* 메모 */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <h4 className="text-sm font-semibold text-foreground">메모</h4>
                      <span className="text-xs text-muted-foreground ml-auto">최근 3개</span>
                    </div>
                    <div className="space-y-2 overflow-y-auto flex-1 pr-1 hide-scrollbar">
                      {dayNotes
                        .map(note => ({
                          ...note,
                          daysFromToday: Math.abs(note.date - 13) // 오늘(13일)과의 거리 계산
                        }))
                        .sort((a, b) => {
                          // 먼저 거리로 정렬
                          if (a.daysFromToday !== b.daysFromToday) {
                            return a.daysFromToday - b.daysFromToday;
                          }
                          // 거리가 같으면 날짜가 큰 것(미래)부터
                          return b.date - a.date;
                        })
                        .slice(0, 3)
                        .map((note, idx) => (
                        <div 
                          key={idx} 
                          className="p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer border border-yellow-200 flex-shrink-0"
                          onClick={() => handleMemoClick(note.date)}
                        >
                          <div className="flex items-start gap-2">
                            <div className="text-base flex-shrink-0">📝</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-yellow-900 break-words">
                                {note.note}
                              </p>
                              <p className="text-xs text-yellow-700 mt-1">1월 {note.date}일</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {dayNotes.length === 0 && (
                        <div className="text-center text-muted-foreground text-xs py-4 bg-muted/20 rounded-lg">
                          저장된 메모가 없습니다
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 일정 추가 모달 */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="일정 추가"
        maxWidth="xl"
      >
        <div className="space-y-3">
          {/* 제목 입력 */}
          <div>
            <input
              type="text"
              placeholder="제목 추가"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full px-3 py-2 text-lg border-b-2 border-border focus:border-primary outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* 날짜 */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">시작 날짜</label>
              <input
                type="date"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">종료 날짜</label>
              <input
                type="date"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
              />
            </div>
          </div>

          {/* 유형 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">유형</label>
            <select
              value={newEvent.workType}
              onChange={(e) => setNewEvent({ ...newEvent, workType: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
            >
              <option value="serialization">연재</option>
              <option value="break">휴재</option>
              <option value="other">기타</option>
            </select>
          </div>

          {/* 작업 단계 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">작업 단계</label>
            <select
              value={newEvent.workStage}
              onChange={(e) => setNewEvent({ ...newEvent, workStage: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
            >
              <option value="">선택 안 함</option>
              {workStages.map(stage => (
                <option key={stage.value} value={stage.value}>{stage.label}</option>
              ))}
            </select>
          </div>

          {/* 카테고리 선택 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">카테고리</label>
            <select
              value={newEvent.category}
              onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
            >
              <option value="personal">개인 일정</option>
              <option value="work">작품 일정</option>
            </select>
          </div>

          {/* 작품 선택 (작품 일정일 때만 표시) */}
          {newEvent.category === 'work' && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">작품</label>
              <select
                value={newEvent.project}
                onChange={(e) => setNewEvent({ ...newEvent, project: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
              >
                <option value="내 웹툰">내 웹툰</option>
                <option value="신작">신작</option>
              </select>
            </div>
          )}

          {/* 색상 선택 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
              <Palette className="w-4 h-4" />
              색상
            </label>
            <div className="flex items-center gap-2">
              {[
                { color: '#EF4444', name: '빨강' },
                { color: '#F59E0B', name: '주황' },
                { color: '#10B981', name: '초록' },
                { color: '#3B82F6', name: '파랑' },
                { color: '#6E8FB3', name: '스틸블루' },
                { color: '#8B5CF6', name: '보라' },
                { color: '#EC4899', name: '핑크' },
                { color: '#6B7280', name: '회색' },
              ].map((preset) => (
                <button
                  key={preset.color}
                  type="button"
                  onClick={() => setNewEvent({ ...newEvent, color: preset.color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${ 
                    newEvent.color === preset.color 
                      ? 'border-foreground scale-110' 
                      : 'border-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          {/* 설명 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
              <AlignLeft className="w-4 h-4" />
              설명
            </label>
            <textarea
              placeholder="설명 추가"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              취소
            </Button>
            <Button onClick={handleAddEvent}>
              저장
            </Button>
          </div>
        </div>
      </Modal>

      {/* 일정 수정 모달 */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="일정 수정"
        maxWidth="xl"
      >
        {editingEvent && (
          <div className="space-y-3">
            {/* 제목 입력 */}
            <div>
              <input
                type="text"
                placeholder="제목 추가"
                value={editingEvent.title}
                onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                className="w-full px-3 py-2 text-lg border-b-2 border-border focus:border-primary outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* 유형 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">유형</label>
              <select
                value={editingEvent.workType}
                onChange={(e) => setEditingEvent({ ...editingEvent, workType: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
              >
                <option value="serialization">연재</option>
                <option value="break">휴재</option>
                <option value="other">기타</option>
              </select>
            </div>

            {/* 작업 단계 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">작업 단계</label>
              <select
                value={editingEvent.workStage || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, workStage: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
              >
                <option value="">선택 안 함</option>
                {workStages.map(stage => (
                  <option key={stage.value} value={stage.value}>{stage.label}</option>
                ))}
              </select>
            </div>

            {/* 카테고리 선택 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">카테고리</label>
              <select
                value={editingEvent.category}
                onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
              >
                <option value="personal">개인 일정</option>
                <option value="work">작품 일정</option>
              </select>
            </div>

            {/* 작품 선택 (작품 일정일 때만 표시) */}
            {editingEvent.category === 'work' && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">작품</label>
                <select
                  value={editingEvent.project || '내 웹툰'}
                  onChange={(e) => setEditingEvent({ ...editingEvent, project: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
                >
                  <option value="내 웹툰">내 웹툰</option>
                  <option value="신작">신작</option>
                </select>
              </div>
            )}

            {/* 색상 선택 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
                <Palette className="w-4 h-4" />
                색상
              </label>
              <div className="flex items-center gap-2">
                {[
                  { color: '#EF4444', name: '빨강' },
                  { color: '#F59E0B', name: '주황' },
                  { color: '#10B981', name: '초록' },
                  { color: '#3B82F6', name: '파랑' },
                  { color: '#6E8FB3', name: '스틸블루' },
                  { color: '#8B5CF6', name: '보라' },
                  { color: '#EC4899', name: '핑크' },
                  { color: '#6B7280', name: '회색' },
                ].map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => setEditingEvent({ ...editingEvent, color: preset.color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${ 
                      editingEvent.color === preset.color 
                        ? 'border-foreground scale-110' 
                        : 'border-border hover:scale-105'
                    }`}
                    style={{ backgroundColor: preset.color }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            {/* 설명 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
                <AlignLeft className="w-4 h-4" />
                설명
              </label>
              <textarea
                placeholder="설명 추가"
                value={editingEvent.description || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                취소
              </Button>
              <Button onClick={handleEditEvent}>
                저장
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 날짜 클릭 시 일정 및 메모 모달 - 통합 버전 */}
      <Modal
        isOpen={isDayDetailModalOpen}
        onClose={() => setIsDayDetailModalOpen(false)}
        title={`1월 ${selectedDate}일`}
        maxWidth="lg"
      >
        {selectedDate !== null && (
          <div className="space-y-4">
            {/* 해당 날짜의 일정 목록 */}
            {selectedDateEvents.length > 0 && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">일정</label>
                <div className="space-y-2">
                  {selectedDateEvents.map((event, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border-l-4 flex items-start justify-between"
                      style={{ 
                        backgroundColor: `${event.color}10`,
                        borderLeftColor: event.color
                      }}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{event.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            className="text-xs"
                            variant={
                              event.workType === 'serialization' ? 'destructive' : 
                              event.workType === 'break' ? 'default' : 
                              'secondary'
                            }
                          >
                            {event.workType === 'serialization' ? '연재' : 
                             event.workType === 'break' ? '휴재' : '기타'}
                          </Badge>
                          {event.project && (
                            <span className="text-xs text-muted-foreground">{event.project}</span>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-2">{event.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 메모 입력 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">메모</label>
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
          <div className="space-y-4">
            {/* 메모 내용 수정 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">메모 내용</label>
              <textarea
                value={editingMemoContent}
                onChange={(e) => setEditingMemoContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground resize-none"
              />
            </div>

            {/* 버튼들 */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleDeleteMemo}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </Button>
              <div className="flex gap-2">
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
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}