import { useState, useEffect, useMemo, useCallback } from 'react';
import { CalendarComponent } from '@/components/common/Calendar';
import { leaveService, projectService, memoService } from '@/api/services';
import useAuthStore from '@/store/authStore';

/** 캘린더 메모 API 목록 → 해당 연월의 dayNotes { date, year, month, dateStr, note, memoNo } */
function mapCalendarMemosToDayNotes(memos, viewYear, viewMonth) {
  if (!Array.isArray(memos)) return [];
  return memos
    .filter((m) => {
      const d = m.calendarMemoDate ? String(m.calendarMemoDate).slice(0, 10) : '';
      if (!d) return false;
      const parts = d.split('-').map(Number);
      if (parts.length < 3) return false;
      const [y, mo] = parts;
      return y === viewYear && mo === viewMonth;
    })
    .map((m) => {
      const d = String(m.calendarMemoDate || '').slice(0, 10);
      const parts = d ? d.split('-').map(Number) : [0, 0, 0];
      const y = parts[0] || viewYear;
      const mo = parts[1] || viewMonth;
      const day = parts[2] || 0;
      const dateStr = `${y}-${String(mo).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return {
        date: day,
        year: y,
        month: mo,
        dateStr,
        note: m.memoText || '',
        memoNo: m.memoNo,
      };
    });
}

/** 담당 작가 근태 API → 캘린더 근태 데이터. 휴재는 캘린더에 표시하지 않음(작품 일정만 영향) */
function mapManagerRequestsToCalendar(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((r) => String(r.attendanceRequestStatus || '').toUpperCase() === 'APPROVED')
    .filter((r) => String(r.attendanceRequestType || '').trim() !== '휴재')
    .map((r) => {
      const start = r.attendanceRequestStartDate ? String(r.attendanceRequestStartDate).slice(0, 10) : null;
      const end = r.attendanceRequestEndDate ? String(r.attendanceRequestEndDate).slice(0, 10) : null;
      const t = String(r.attendanceRequestType || '').trim();

      let type = 'break';
      if (t === '워케이션') type = 'workation';
      else if (t === '재택근무') type = 'remote';
      else if (['휴가', '연차', '반차', '반반차', '병가'].includes(t)) type = 'break';

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
  const [prevKanbanCards, setPrevKanbanCards] = useState([]);
  const [nextKanbanCards, setNextKanbanCards] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [projects, setProjects] = useState([]);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');
  const [calendarMemos, setCalendarMemos] = useState([]);
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth() + 1);

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

  /** 칸반 카드 조회 (현재 월 + 이전/다음 달) */
  const fetchKanbanCards = useCallback(async (year, month) => {
    try {
      const prevY = month === 1 ? year - 1 : year;
      const prevM = month === 1 ? 12 : month - 1;
      const nextY = month === 12 ? year + 1 : year;
      const nextM = month === 12 ? 1 : month + 1;

      const [res, prevRes, nextRes] = await Promise.all([
        projectService.getMyProjectsCalendarCards(year, month),
        projectService.getMyProjectsCalendarCards(prevY, prevM),
        projectService.getMyProjectsCalendarCards(nextY, nextM),
      ]);

      setKanbanCards(Array.isArray(res) ? res : res?.data ?? res?.content ?? []);
      setPrevKanbanCards(Array.isArray(prevRes) ? prevRes : prevRes?.data ?? prevRes?.content ?? []);
      setNextKanbanCards(Array.isArray(nextRes) ? nextRes : nextRes?.data ?? nextRes?.content ?? []);
    } catch (err) {
      console.error('칸반 카드 조회 실패:', err);
    }
  }, []);

  const refreshCalendarMemos = useCallback(async () => {
    try {
      const list = await memoService.getCalendarList();
      setCalendarMemos(Array.isArray(list) ? list : list?.data ?? list?.content ?? []);
    } catch (err) {
      console.error('캘린더 메모 조회 실패:', err);
    }
  }, []);

  const handleViewMonthChange = useCallback((year, month) => {
    setViewYear(year);
    setViewMonth(month);
    fetchKanbanCards(year, month);
  }, [fetchKanbanCards]);

  /** 데이터 조회 */
  useEffect(() => {
    const fetch = async () => {
      try {
        const [myList, projRes, memoList] = await Promise.all([
          leaveService.getMyRequests(),
          projectService.getProjects(),
          memoService.getCalendarList(),
        ]);

        setMyRequests(Array.isArray(myList) ? myList : myList?.data ?? myList?.content ?? []);
        setCalendarMemos(Array.isArray(memoList) ? memoList : memoList?.data ?? memoList?.content ?? []);

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

  const dayNotes = useMemo(
    () => mapCalendarMemosToDayNotes(calendarMemos, viewYear, viewMonth),
    [calendarMemos, viewYear, viewMonth]
  );

  const prevMonthDayNotes = useMemo(() => {
    const pm = viewMonth === 1 ? 12 : viewMonth - 1;
    const py = viewMonth === 1 ? viewYear - 1 : viewYear;
    return mapCalendarMemosToDayNotes(calendarMemos, py, pm);
  }, [calendarMemos, viewYear, viewMonth]);

  const nextMonthDayNotes = useMemo(() => {
    const nm = viewMonth === 12 ? 1 : viewMonth + 1;
    const ny = viewMonth === 12 ? viewYear + 1 : viewYear;
    return mapCalendarMemosToDayNotes(calendarMemos, ny, nm);
  }, [calendarMemos, viewYear, viewMonth]);

  const handleNoteSave = useCallback(async (dateStr, note) => {
    const existing = dayNotes.find((n) => n.dateStr === dateStr && n.memoNo != null);
    try {
      if (existing?.memoNo) {
        await memoService.update(existing.memoNo, { memoText: note });
      } else {
        await memoService.create({
          memoType: '캘린더',
          calendarMemoDate: dateStr,
          memoText: note || '',
        });
      }
      await refreshCalendarMemos();
    } catch (err) {
      console.error('캘린더 메모 저장 실패:', err);
      throw err;
    }
  }, [dayNotes, refreshCalendarMemos]);

  const handleNoteDelete = useCallback(async (dateStr) => {
    const existing = dayNotes.find((n) => n.dateStr === dateStr && n.memoNo != null);
    if (!existing?.memoNo) return;
    try {
      await memoService.delete(existing.memoNo);
      await refreshCalendarMemos();
    } catch (err) {
      console.error('캘린더 메모 삭제 실패:', err);
      throw err;
    }
  }, [dayNotes, refreshCalendarMemos]);

  /** 이전/다음 달 이벤트 (흐린 영역 표시용) */
  const prevMonthEvents = useMemo(() => {
    let list = prevKanbanCards;
    if (selectedArtist !== 'all') list = list.filter(p => String(p.assigneeNo) === String(selectedArtist));
    return list.map(c => ({
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
  }, [prevKanbanCards, selectedArtist]);

  const nextMonthEvents = useMemo(() => {
    let list = nextKanbanCards;
    if (selectedArtist !== 'all') list = list.filter(p => String(p.assigneeNo) === String(selectedArtist));
    return list.map(c => ({
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
  }, [nextKanbanCards, selectedArtist]);

  return (
    <CalendarComponent
      events={filteredSchedule}
      attendanceData={currentAttendanceData} // 근태 데이터 복구
      dayNotes={dayNotes}
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
      prevMonthEvents={prevMonthEvents}
      nextMonthEvents={nextMonthEvents}
      prevMonthDayNotes={prevMonthDayNotes}
      nextMonthDayNotes={nextMonthDayNotes}
    />
  );
}
