import { useState, useEffect, useMemo, useCallback } from 'react';
import { CalendarComponent } from '@/components/common/Calendar';
import { leaveService, projectService } from '@/api/services';
import useAuthStore from '@/store/authStore';

/** 담당 작가 근태 API → 캘린더 근태 데이터 */
function mapManagerRequestsToCalendar(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((r) => String(r.attendanceRequestStatus || '').toUpperCase() === 'APPROVED')
    .map((r) => {
      const start = r.attendanceRequestStartDate ? String(r.attendanceRequestStartDate).slice(0, 10) : null;
      const end = r.attendanceRequestEndDate ? String(r.attendanceRequestEndDate).slice(0, 10) : null;
      const t = String(r.attendanceRequestType || '').trim();

      let type = 'break';
      if (t === '워케이션') type = 'workation';
      else if (t === '재택근무') type = 'remote';
      else if (['휴가', '연차', '반차', '반반차', '병가', '휴재'].includes(t)) type = 'break';

      return {
        id: r.attendanceRequestNo,
        memberNo: r.memberNo,
        type,
        typeName: t,
        startDate: start,
        endDate: end,
        reason: r.attendanceRequestReason || '',
      };
    })
    .filter((a) => a.startDate && a.endDate);
}

export function AdminCalendarPage() {
  const { user } = useAuthStore();
  const [myRequests, setMyRequests] = useState([]); // 본인 근태
  const [kanbanCards, setKanbanCards] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [projects, setProjects] = useState([]);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');
  const [adminNotes, setAdminNotes] = useState({});

  /** 담당 작가 목록 */
  const artists = useMemo(() => {
    const seen = new Set();
    const list = [];
    
    // 본인 근태 데이터에서 작가 목록 추출 (본인만)
    (myRequests || []).forEach((r) => {
      if (r.memberNo != null && !seen.has(String(r.memberNo))) {
        seen.add(String(r.memberNo));
        list.push({ id: String(r.memberNo), name: r.memberName || `회원 ${r.memberNo}` });
      }
    });
    
    (kanbanCards || []).forEach((c) => {
      if (c.assigneeNo != null && !seen.has(String(c.assigneeNo))) {
        seen.add(String(c.assigneeNo));
        list.push({ id: String(c.assigneeNo), name: c.assigneeName || `회원 ${c.assigneeNo}` });
      }
    });
    return list;
  }, [myRequests, kanbanCards]);

  /** 본인 승인된 근태 캘린더 데이터로 변환 */
  const approvedForCalendar = useMemo(() => {
    return mapManagerRequestsToCalendar(myRequests);
  }, [myRequests]);

  /** 선택한 작가 필터 적용 (본인 근태는 항상 포함하거나 필터에 따라 처리) */
  const currentAttendanceData = useMemo(() => {
    if (selectedArtist === 'all') return approvedForCalendar;
    // 필터링 시 본인 근태도 보여줄지 여부는 정책에 따름 (여기서는 필터링된 작가 혹은 본인 것만)
    return approvedForCalendar.filter((a) => String(a.memberNo) === String(selectedArtist));
  }, [selectedArtist, approvedForCalendar]);

  /** 날짜별 근태 타입 (셀 색상용) */
  const attendanceByDate = useMemo(() => {
    const map = {};
    currentAttendanceData.forEach((a) => {
      const start = new Date(a.startDate);
      const end = new Date(a.endDate);
      // 시간 제거를 위해 00:00:00으로 설정
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        map[key] = a.type;
      }
    });
    return map;
  }, [currentAttendanceData]);

  /** 칸반 카드 조회 */
  const fetchKanbanCards = useCallback(async (year, month) => {
    try {
      const res = await projectService.getMyProjectsCalendarCards(year, month);
      const list = Array.isArray(res) ? res : res?.data ?? res?.content ?? [];
      setKanbanCards(list);
    } catch (err) {
      console.error('칸반 카드 조회 실패:', err);
    }
  }, []);

  const handleViewMonthChange = useCallback((year, month) => {
    fetchKanbanCards(year, month);
  }, [fetchKanbanCards]);

  /** 데이터 조회 */
  useEffect(() => {
    const fetch = async () => {
      try {
        // 본인 근태 및 프로젝트 정보 로드
        const [myList, projRes] = await Promise.all([
          leaveService.getMyRequests(),
          projectService.getProjects()
        ]);

        setMyRequests(Array.isArray(myList) ? myList : myList?.data ?? myList?.content ?? []);

        const projectList = Array.isArray(projRes) ? projRes : [];
        setProjects(projectList.map(p => ({ projectNo: p.projectNo, projectName: p.projectName })));
      } catch (err) {
        console.error('데이터 조회 실패:', err);
      }
    };
    fetch();
  }, []);

  /** 칸반 + 근태 이벤트 */
  const filteredSchedule = useMemo(() => {
    let list = kanbanCards;
    if (selectedArtist !== 'all') list = list.filter(p => String(p.assigneeNo) === String(selectedArtist));

    const kanbanEvents = list.map(c => ({
      id: c.id,
      title: `${c.assigneeName ? `(${c.assigneeName}) ` : ''}${c.title}`,
      date: c.endDate ? parseInt(c.endDate.split('-')[2], 10) : undefined,
      startDate: c.startDate ? parseInt(c.startDate.split('-')[2], 10) : undefined,
      endDate: c.endDate ? parseInt(c.endDate.split('-')[2], 10) : undefined,
      projectNo: c.projectNo,
      project: c.projectName,
      color: c.projectColor || '#6E8FB3',
      category: 'work',
      assigneeName: c.assigneeName,
      projectStatus: c.projectStatus
    }));

    return kanbanEvents;
  }, [kanbanCards, selectedArtist]);

  const handleNoteSave = (date, note) => {
    const existingIndex = adminNotes[selectedArtist]?.findIndex(n => n.date === date) ?? -1;
    const updated = [...(adminNotes[selectedArtist] || [])];
    if (existingIndex >= 0) updated[existingIndex] = { date, note };
    else updated.push({ date, note });
    setAdminNotes({ ...adminNotes, [selectedArtist]: updated });
  };

  const handleNoteDelete = (date) => {
    const notes = adminNotes[selectedArtist] || [];
    const updated = notes.filter((n) => n.date !== date);
    setAdminNotes({ ...adminNotes, [selectedArtist]: updated });
  };

  const currentDayNotes = adminNotes[selectedArtist] || [];

  return (
    <CalendarComponent
      events={filteredSchedule}
      attendanceData={currentAttendanceData} // 근태 데이터 복구
      dayNotes={currentDayNotes}
      showArtistFilter={false}
      artists={artists}
      selectedArtist={selectedArtist}
      onArtistChange={setSelectedArtist}
      showProjectFilter={false}
      projects={[]}
      selectedProject=""
      onProjectChange={() => { }}
      useProjectFilter={true}
      projectListForFilter={projects}
      selectedProjectFilter={selectedProjectFilter}
      onProjectFilterChange={setSelectedProjectFilter}
      onViewMonthChange={handleViewMonthChange}
      onEventAdd={() => { }}
      onEventDelete={() => { }}
      onNoteSave={handleNoteSave}
      onNoteDelete={handleNoteDelete}
    />
  );
}
