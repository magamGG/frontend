import { useState, useEffect, useMemo } from 'react';
import { CalendarComponent } from '@/components/common/Calendar';
import { leaveService } from '@/api/services';

/** 담당 작가 근태 API 응답 → 캘린더 근태 데이터. APPROVED만, 연차/병가→휴가, 워케이션→워케이션 (memberNo 포함) */
function mapManagerRequestsToCalendar(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((r) => String(r.attendanceRequestStatus || '').toUpperCase() === 'APPROVED')
    .map((r) => {
      const start = r.attendanceRequestStartDate != null ? String(r.attendanceRequestStartDate).slice(0, 10) : null;
      const end = r.attendanceRequestEndDate != null ? String(r.attendanceRequestEndDate).slice(0, 10) : null;
      const t = String(r.attendanceRequestType || '').trim();
      const isWorkation = t === '워케이션';
      const type = isWorkation ? 'workation' : 'break';
      const typeName = isWorkation ? '워케이션' : '휴가';
      const days = r.attendanceRequestUsingDays != null ? r.attendanceRequestUsingDays : (start && end ? Math.ceil((new Date(end) - new Date(start)) / (24 * 60 * 60 * 1000)) + 1 : 1);
      return {
        id: r.attendanceRequestNo,
        memberNo: r.memberNo,
        type,
        typeName,
        startDate: start,
        endDate: end,
        days,
        reason: r.attendanceRequestReason || (isWorkation ? r.workcationLocation : '') || '',
        status: 'approved',
        requestDate: r.attendanceRequestCreatedAt ? String(r.attendanceRequestCreatedAt).slice(0, 10) : null,
      };
    })
    .filter((a) => a.startDate && a.endDate);
}

export function AdminCalendarPage() {
  const [managerRequests, setManagerRequests] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [selectedProject, setSelectedProject] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // 담당 작가 목록: API 응답에서 memberNo/memberName 유일값
  const artists = useMemo(() => {
    const seen = new Set();
    return (managerRequests || [])
      .filter((r) => r.memberNo != null && !seen.has(r.memberNo) && (seen.add(r.memberNo), true))
      .map((r) => ({ id: String(r.memberNo), name: r.memberName || `회원 ${r.memberNo}` }));
  }, [managerRequests]);

  // APPROVED 근태만 캘린더 형식으로 (memberNo 포함)
  const approvedForCalendar = useMemo(() => mapManagerRequestsToCalendar(managerRequests), [managerRequests]);

  // 선택한 작가의 근태만 캘린더에 전달 (전체 선택 시 색칠 없음)
  const currentAttendanceData = useMemo(() => {
    if (selectedArtist === 'all') return [];
    return approvedForCalendar.filter((a) => String(a.memberNo) === String(selectedArtist));
  }, [selectedArtist, approvedForCalendar]);

  const [adminNotes, setAdminNotes] = useState({});

  // 담당 작가 근태 신청 목록 조회 (담당자 캘린더용)
  useEffect(() => {
    const fetch = async () => {
      try {
        const list = await leaveService.getManagerRequests();
        setManagerRequests(Array.isArray(list) ? list : list?.data ?? list?.content ?? []);
      } catch (err) {
        console.error('담당자 근태 신청 목록 조회 실패:', err);
        setManagerRequests([]);
      }
    };
    fetch();
  }, []);

  // TODO: 담당 작가별 칸반 일정 API 연동 시 events 채우기
  const filteredSchedule = [];

  const selectedArtistProjects = [];

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
    const notes = adminNotes[selectedArtist] || [];
    const updatedNotes = notes.filter((n) => n.date !== date);
    setAdminNotes({ ...adminNotes, [selectedArtist]: updatedNotes });
  };

  const currentDayNotes = adminNotes[selectedArtist] || [];

  return (
    <CalendarComponent
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
