import { useState, useEffect } from 'react';
import { CalendarComponent } from '@/components/common/Calendar';
import { LeaveRequestModal } from '@/components/modals/LeaveRequestModal';

const currentMonth = '2026년 1월';

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
  { id: '21-1', date: 21, title: 'EP.45 스케치', workType: 'serialization', workStage: 'sketch', category: 'work', project: '나의 히어로', episode: 'EP.45', description: '스케치 작업', color: '#F59E0B', startDate: 21, endDate: 21 },
  { id: '21-2', date: 21, title: 'EP.46 기획', workType: 'serialization', workStage: 'storyboard', category: 'work', project: '나의 히어로', episode: 'EP.46', description: '에피소드 기획', color: '#10B981', startDate: 21, endDate: 21 },
  { id: '21-3', date: 21, title: 'EP.47 콘티', workType: 'serialization', workStage: 'storyboard', category: 'work', project: '나의 히어로', episode: 'EP.47', description: '콘티 작업', color: '#FCD34D', startDate: 21, endDate: 22 },
  { id: '21-5', date: 21, title: 'EP.49 스케치', workType: 'serialization', workStage: 'sketch', category: 'work', project: '별빛 아래서', episode: 'EP.01', description: '스케치 작업', color: '#EC4899', startDate: 21, endDate: 22 },
  { id: '21-4', date: 21, title: 'EP.48 선화', workType: 'serialization', workStage: 'lineart', category: 'work', project: '나의 히어로', episode: 'EP.48', description: '선화 작업', color: '#60A5FA', startDate: 21, endDate: 23 },
  { id: '21-6', date: 21, title: 'EP.50 채색', workType: 'serialization', workStage: 'coloring', category: 'work', project: '별빛 아래서', episode: 'EP.02', description: '채색 작업', color: '#F472B6', startDate: 21, endDate: 23 },
  { id: '21-7', date: 21, title: 'EP.51 후보정', workType: 'serialization', workStage: 'effects', category: 'work', project: '나의 히어로', episode: 'EP.51', description: '후보정 작업', color: '#A78BFA', startDate: 21, endDate: 25 },
  { id: '21-8', date: 21, title: 'EP.52 배경', workType: 'serialization', workStage: 'background', category: 'work', project: '별빛 아래서', episode: 'EP.03', description: '배경 작업', color: '#4ADE80', startDate: 21, endDate: 25 },
  { id: '21-9', date: 21, title: 'EP.53 검수', workType: 'serialization', workStage: 'review', category: 'work', project: '나의 히어로', episode: 'EP.53', description: '최종 검수', color: '#F87171', startDate: 21, endDate: 25 },
  { id: '21-10', date: 21, title: 'EP.54 스케치', workType: 'serialization', workStage: 'sketch', category: 'work', project: '별빛 아래서', episode: 'EP.04', description: '스케치 작업', color: '#FB923C', startDate: 21, endDate: 25 },
  { id: '21-11', date: 21, title: 'EP.55 선화', workType: 'serialization', workStage: 'lineart', category: 'work', project: '나의 히어로', episode: 'EP.55', description: '선화 작업', color: '#60A5FA', startDate: 21, endDate: 25 },
  { id: '21-12', date: 21, title: 'EP.56 채색', workType: 'serialization', workStage: 'coloring', category: 'work', project: '별빛 아래서', episode: 'EP.05', description: '채색 작업', color: '#F472B6', startDate: 21, endDate: 25 },
  { id: '13', date: 24, title: 'EP.44 후보정', workType: 'serialization', workStage: 'effects', category: 'work', project: '나의 히어로', episode: 'EP.44', color: '#F59E0B', startDate: 24, endDate: 25 },
  { id: '14', date: 25, title: 'EP.44 후보정', workType: 'serialization', workStage: 'effects', category: 'work', project: '나의 히어로', episode: 'EP.44', color: '#F59E0B', startDate: 24, endDate: 25 },
];

// TODO: Zustand store mapping - 근태 데이터
const initialAttendanceData = [
  { id: 1, type: 'workation', typeName: '워케이션', startDate: '2026-01-05', endDate: '2026-01-07', days: 3, reason: '제주도 워케이션', status: 'approved', requestDate: '2025-12-20' },
  { id: 2, type: 'break', typeName: '휴가', startDate: '2026-01-10', endDate: '2026-01-12', days: 3, reason: '개인 사유', status: 'approved', requestDate: '2026-01-05' },
  { id: 3, type: 'break', typeName: '휴가', startDate: '2026-01-20', endDate: '2026-01-20', days: 1, reason: '건강 문제', status: 'approved', requestDate: '2026-01-19' },
  { id: 4, type: 'workation', typeName: '워케이션', startDate: '2026-01-25', endDate: '2026-01-27', days: 3, reason: '강릉 워케이션', status: 'approved', requestDate: '2026-01-10' },
];

// TODO: Zustand store mapping - 메모 데이터
const initialDayNotes = [
  { date: 5, note: '마감일 점검 필요' },
  { date: 15, note: '휴식 필요' },
];

export function ArtistCalendarPage({ openAttendanceModal, onCloseAttendanceModal } = {}) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [dayNotes, setDayNotes] = useState(initialDayNotes);
  const [attendanceData, setAttendanceData] = useState(initialAttendanceData);
  const [allEvents, setAllEvents] = useState(initialEvents);
  const [projectsData, setProjectsData] = useState([]);

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

  const handleEventAdd = (event) => {
    setAllEvents([...allEvents, event]);
  };

  const handleEventDelete = (eventId) => {
    setAllEvents(allEvents.filter((e) => e.id !== eventId));
  };

  const handleNoteSave = (date, note) => {
    const existingNoteIndex = dayNotes.findIndex((n) => n.date === date);
      if (existingNoteIndex >= 0) {
        const updated = [...dayNotes];
      updated[existingNoteIndex] = { date, note };
        setDayNotes(updated);
      } else {
      setDayNotes([...dayNotes, { date, note }]);
    }
  };

  const handleNoteDelete = (date) => {
    setDayNotes(dayNotes.filter((n) => n.date !== date));
  };

  return (
    <CalendarComponent
      currentMonth={currentMonth}
      events={allEvents}
      attendanceData={attendanceData}
      dayNotes={dayNotes}
      filterCategory={filterCategory}
      onFilterCategoryChange={setFilterCategory}
      showArtistFilter={false}
      onEventAdd={handleEventAdd}
      onEventDelete={handleEventDelete}
      onNoteSave={handleNoteSave}
      onNoteDelete={handleNoteDelete}
      openAttendanceModal={openAttendanceModal}
      onCloseAttendanceModal={onCloseAttendanceModal}
      LeaveRequestModalComponent={LeaveRequestModal}
    />
  );
}
