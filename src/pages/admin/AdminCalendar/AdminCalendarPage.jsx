import { useState } from 'react';
import { CalendarComponent } from '@/components/common/Calendar';

const currentMonth = '2026년 1월';

export function AdminCalendarPage() {
  // TODO: Zustand store mapping - 작가 목록
  const artists = [
    { id: 'artist1', name: '김작가', projects: ['나의 히어로', '별빛 아래서'] },
    { id: 'artist2', name: '나작가', projects: ['러브 스토리'] },
    { id: 'artist3', name: '박작가', projects: ['판타지 월드'] },
  ];

  const [selectedArtist, setSelectedArtist] = useState('all');
  const [selectedProject, setSelectedProject] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [adminNotes, setAdminNotes] = useState({
    artist1: [{ date: 10, note: 'EP.42 마감 확인 필요' }],
    artist2: [],
    artist3: [],
  });

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
            { id: '1', date: 5, title: 'EP.42 마감', workType: 'serialization', workStage: 'review', category: 'work', project: '나의 히어로', episode: 'EP.42', description: '최종 검수 및 업로드', color: '#F87171', startDate: 5, endDate: 5 },
            { id: '2', date: 6, title: 'EP.43 콘티', workType: 'serialization', workStage: 'storyboard', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#FCD34D', startDate: 6, endDate: 7 },
            { id: '3', date: 7, title: 'EP.43 콘티', workType: 'serialization', workStage: 'storyboard', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#FCD34D', startDate: 6, endDate: 7 },
            { id: '4', date: 14, title: 'EP.43 선화', workType: 'serialization', workStage: 'lineart', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#60A5FA', startDate: 14, endDate: 15 },
            { id: '5', date: 15, title: 'EP.43 선화', workType: 'serialization', workStage: 'lineart', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#60A5FA', startDate: 14, endDate: 15 },
            { id: '6', date: 16, title: 'EP.43 채색', workType: 'serialization', workStage: 'coloring', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F472B6', startDate: 16, endDate: 18 },
            { id: '7', date: 17, title: 'EP.43 채색', workType: 'serialization', workStage: 'coloring', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F472B6', startDate: 16, endDate: 18 },
            { id: '8', date: 18, title: 'EP.43 채색', workType: 'serialization', workStage: 'coloring', category: 'work', project: '나의 히어로', episode: 'EP.43', color: '#F472B6', startDate: 16, endDate: 18 },
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
          ],
        },
        {
          id: 'project2',
          title: '별빛 아래서',
          episodes: [],
        },
        {
          id: 'project5',
          title: '기타',
          episodes: [
          ],
        },
      ],
      attendance: [
        { id: 1, type: 'break', typeName: '휴가', startDate: '2026-01-10', endDate: '2026-01-12', days: 3, reason: '개인 사유', status: 'approved', requestDate: '2026-01-05' },
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
            { id: '14', date: 8, title: 'EP.10 배경', workType: 'serialization', workStage: 'background', category: 'work', project: '러브 스토리', episode: 'EP.10', color: '#34D399', startDate: 8, endDate: 9 },
            { id: '15', date: 9, title: 'EP.10 배경', workType: 'serialization', workStage: 'background', category: 'work', project: '러브 스토리', episode: 'EP.10', color: '#34D399', startDate: 8, endDate: 9 },
          ],
        },
      ],
      attendance: [
        { id: 2, type: 'workation', typeName: '워케이션', startDate: '2026-01-20', endDate: '2026-01-22', days: 3, reason: '제주도 워케이션', status: 'approved', requestDate: '2025-12-20' },
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
            { id: '16', date: 25, title: 'EP.05 스케치', workType: 'serialization', workStage: 'sketch', category: 'work', project: '판타지 월드', episode: 'EP.05', color: '#A78BFA', startDate: 25, endDate: 26 },
            { id: '17', date: 26, title: 'EP.05 스케치', workType: 'serialization', workStage: 'sketch', category: 'work', project: '판타지 월드', episode: 'EP.05', color: '#A78BFA', startDate: 25, endDate: 26 },
          ],
        },
      ],
      attendance: [
        { id: 3, type: 'workation', typeName: '워케이션', startDate: '2026-01-13', endDate: '2026-01-13', days: 1, reason: '강릉 워케이션', status: 'approved', requestDate: '2026-01-10' },
        { id: 4, type: 'break', typeName: '휴가', startDate: '2026-01-27', endDate: '2026-01-27', days: 1, reason: '건강 문제', status: 'approved', requestDate: '2026-01-19' },
      ],
    },
  ];

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

    const dateStr = `2026-01-${day.toString().padStart(2, '0')}`;
    for (const attendance of artist.attendance) {
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

  const selectedArtistProjects = selectedArtist ? artists.find((a) => a.id === selectedArtist)?.projects || [] : [];

  const handleEventAdd = (event) => {
    // TODO: Implement event add logic
  };

  const handleEventDelete = (eventId) => {
    // TODO: Implement event delete logic
  };

  const handleNoteSave = (date, note) => {
    const existingNoteIndex = adminNotes[selectedArtist]?.findIndex((n) => n.date === date) ?? -1;
    const updatedNotes = [...(adminNotes[selectedArtist] || [])];
    if (existingNoteIndex >= 0) {
      updatedNotes[existingNoteIndex] = { date, note };
    } else {
      updatedNotes.push({ date, note });
    }
    setAdminNotes({ ...adminNotes, [selectedArtist]: updatedNotes });
  };

  const handleNoteDelete = (date) => {
    const updatedNotes = adminNotes[selectedArtist].filter((n) => n.date !== date);
    setAdminNotes({ ...adminNotes, [selectedArtist]: updatedNotes });
  };

  // 현재 선택된 작가의 근태 데이터
  const currentAttendanceData = selectedArtist === 'all' 
    ? [] 
    : artistSchedules.find((a) => a.artistId === selectedArtist)?.attendance || [];

  // 현재 선택된 작가의 메모 데이터
  const currentDayNotes = adminNotes[selectedArtist] || [];

  return (
    <CalendarComponent
      currentMonth={currentMonth}
      events={filteredSchedule}
      attendanceData={currentAttendanceData}
      dayNotes={currentDayNotes}
      filterCategory={filterCategory}
      onFilterCategoryChange={setFilterCategory}
      showArtistFilter={true}
      artists={artists}
      selectedArtist={selectedArtist}
      onArtistChange={(artistId) => {
        setSelectedArtist(artistId);
        setSelectedProject('');
      }}
      showProjectFilter={true}
      projects={selectedArtistProjects}
      selectedProject={selectedProject}
      onProjectChange={setSelectedProject}
      onEventAdd={handleEventAdd}
      onEventDelete={handleEventDelete}
      onNoteSave={handleNoteSave}
      onNoteDelete={handleNoteDelete}
    />
  );
}
