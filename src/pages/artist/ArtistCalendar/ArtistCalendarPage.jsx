import { useState, useEffect, useCallback } from 'react';
import { CalendarComponent } from '@/components/common/Calendar';
import { LeaveRequestModal } from '@/components/modals/LeaveRequestModal';
import { projectService, leaveService } from '@/api/services';
import useAuthStore from '@/store/authStore';

/** PROJECT_COLOR → 캘린더 바 색상 (hex면 그대로, 아니면 기본) */
function toCalendarColor(projectColor) {
  if (!projectColor) return 'var(--accent)';
  const t = String(projectColor).trim();
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(t)) return t;
  return 'var(--accent)';
}

/** API 칸반 카드 목록 → 캘린더 events (해당 월 day 기준, PROJECT_COLOR 적용) */
function mapCalendarCardsToEvents(cards, year, month) {
  if (!Array.isArray(cards) || cards.length === 0) return [];
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const firstDay = first.getDate();
  const lastDay = last.getDate();

  return cards.map((c) => {
    const start = c.startDate ? new Date(c.startDate) : first;
    const end = c.endDate ? new Date(c.endDate) : last;
    const startDay = start.getFullYear() === year && start.getMonth() + 1 === month
      ? start.getDate()
      : firstDay;
    const endDay = end.getFullYear() === year && end.getMonth() + 1 === month
      ? end.getDate()
      : lastDay;
    const clampedStart = Math.max(startDay, firstDay);
    const clampedEnd = Math.min(endDay, lastDay);

    return {
      id: String(c.id),
      date: clampedStart,
      title: c.title || '업무',
      category: 'work',
      project: c.projectName,
      projectNo: c.projectNo,
      color: toCalendarColor(c.projectColor),
      startDate: clampedStart,
      endDate: clampedEnd,
    };
  });
}

/** ATTENDANCE_REQUEST API 응답 → 캘린더 근태 데이터. APPROVED만, 연차/병가→휴가, 워케이션→워케이션, startDate~endDate 전체 색칠 */
function mapAttendanceRequestsToCalendar(list) {
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

// TODO: Zustand store mapping - 메모 데이터
const initialDayNotes = [
  { date: 5, note: '마감일 점검 필요' },
  { date: 15, note: '휴식 필요' },
];

export function ArtistCalendarPage({ openAttendanceModal, onCloseAttendanceModal } = {}) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('');
  const [projectListForFilter, setProjectListForFilter] = useState([]);
  const [dayNotes, setDayNotes] = useState(initialDayNotes);
  const [attendanceData, setAttendanceData] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [projectsData, setProjectsData] = useState([]);

  // 프로젝트 목록 조회 (필터 펼치면 프로젝트 목록에 사용)
  useEffect(() => {
    const fetchProjects = async () => {
      const memberNo = useAuthStore.getState().user?.memberNo;
      if (!memberNo) {
        setProjectListForFilter([]);
        return;
      }
      try {
        const res = await projectService.getProjects(0, 100);
        const list = Array.isArray(res) ? res : res?.data ?? res?.content ?? [];
        const mapped = (list.content != null ? list.content : list).map((p) => ({
          projectNo: p.projectNo ?? p.id,
          projectName: p.projectName ?? p.title ?? '',
        })).filter((p) => p.projectNo != null && p.projectName != null);
        setProjectListForFilter(mapped);
      } catch (err) {
        console.error('프로젝트 목록 조회 실패:', err);
        setProjectListForFilter([]);
      }
    };
    fetchProjects();
  }, []);

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

  // 근태 데이터: ATTENDANCE_REQUEST 중 APPROVED만 조회 → 캘린더에 휴가/워케이션 색칠
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const list = await leaveService.getMyRequests();
        const data = mapAttendanceRequestsToCalendar(Array.isArray(list) ? list : list?.data ?? list?.content ?? []);
        setAttendanceData(data);
      } catch (err) {
        console.error('근태 신청 목록 조회 실패:', err);
        setAttendanceData([]);
      }
    };
    fetchAttendance();
  }, []);

  // KANBAN_CARD 담당자 배정 업무: 보기 월 변경 시 해당 월 칸반 카드 로드 (PROJECT_COLOR, STARTED_AT, ENDED_AT)
  const handleViewMonthChange = useCallback(async (viewYear, viewMonth) => {
    const memberNo = useAuthStore.getState().user?.memberNo;
    if (!memberNo) {
      setAllEvents([]);
      return;
    }
    try {
      const list = await projectService.getMyCalendarCards(viewYear, viewMonth);
      const events = mapCalendarCardsToEvents(list, viewYear, viewMonth);
      setAllEvents(events);
    } catch (err) {
      console.error('캘린더 칸반 카드 조회 실패:', err);
      setAllEvents([]);
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
      events={allEvents}
      attendanceData={attendanceData}
      dayNotes={dayNotes}
      filterCategory={filterCategory}
      onFilterCategoryChange={setFilterCategory}
      showArtistFilter={false}
      useProjectFilter={true}
      projectListForFilter={projectListForFilter}
      selectedProjectFilter={selectedProjectFilter}
      onProjectFilterChange={setSelectedProjectFilter}
      onEventAdd={handleEventAdd}
      onEventDelete={handleEventDelete}
      onNoteSave={handleNoteSave}
      onNoteDelete={handleNoteDelete}
      openAttendanceModal={openAttendanceModal}
      onCloseAttendanceModal={onCloseAttendanceModal}
      LeaveRequestModalComponent={LeaveRequestModal}
      onViewMonthChange={handleViewMonthChange}
    />
  );
}
