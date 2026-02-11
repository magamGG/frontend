import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import {
  Briefcase,
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Play,
  Square,
  Users,
  Building2,
  Home,
  Palmtree,
  FileText,
  Clock,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ProjectListModal } from '@/components/modals/ProjectListModal';
import { AttendanceListModal } from '@/components/modals/AttendanceListModal';
import { toast } from 'sonner';
import { leaveService, attendanceService, memberService, projectService, agencyService } from '@/api/services';
import useAuthStore from '@/store/authStore';
import { LeaveRequestEditModal } from '@/components/modals/LeaveRequestEditModal';
import svgPaths from '@/imports/svg-oq0e8tu4xb';
import {
  AdminDashboardRoot,
  AdminDashboardBody,
  AdminDashboardTopGrid,
  AttendanceStartCard,
  AttendanceStartHeader,
  AttendanceStartDateInfo,
  AttendanceStartDate,
  AttendanceStartDateSub,
  AttendanceStartActions,
  HealthCheckWarning,
  AttendanceStatusBox,
  AttendanceStatusBoxContent,
  AttendanceStatusBoxInfo,
  AttendanceStatusBoxIcon,
  AttendanceStatusBoxText,
  AttendanceStatusBoxTitle,
  AttendanceStatusBoxDescription,
  AttendanceStatusBoxPeriod,
  AttendanceStatusBoxPeriodLabel,
  AttendanceStatusBoxPeriodValue,
  AttendanceStatusEmpty,
  AttendanceStatusEmptyIcon,
  AttendanceStatusEmptyTitle,
  AttendanceStatusEmptyDescription,
  WorkingArtistsCard,
  WorkingArtistsHeader,
  WorkingArtistsTitle,
  WorkingArtistsGrid,
  WorkingArtistCard,
  WorkingArtistHeader,
  WorkingArtistStatusDot,
  WorkingArtistName,
  WorkingArtistProject,
  WorkingArtistMeta,
  WorkingArtistMetaLabel,
  WorkingArtistMetaValue,
  ChartSection,
  ChartCard,
  ChartHeader,
  ChartTitle,
  ChartAlert,
  ChartAlertText,
  ProjectsAttendanceGrid,
  ProjectsCard,
  ProjectsHeader,
  ProjectsHeaderLeft,
  ProjectsList,
  ProjectItem,
  ProjectItemHeader,
  ProjectItemInfo,
  ProjectItemTitleRow,
  ProjectItemTitle,
  ProjectItemArtist,
  ProjectItemMeta,
  ProjectsInfoBox,
  ProjectsInfoText,
  AttendanceScheduleCard,
  AttendanceScheduleHeader,
  AttendanceScheduleHeaderLeft,
  AttendanceScheduleList,
  AttendanceScheduleItem,
  AttendanceScheduleItemHeader,
  AttendanceScheduleItemLeft,
  AttendanceScheduleItemName,
  AttendanceScheduleItemDate,
  AttendanceScheduleWarningBox,
  AttendanceScheduleWarningText,
  WarningBox,
  WarningContent,
  WarningTitle,
  WarningDescription,
  ModalActions,
  QuickInfoCard,
  QuickInfoTitle,
  AttendanceRequestCardHeader,
  AttendanceRequestCardList,
  AttendanceRequestCardItem,
  AttendanceRequestCardItemContent,
  AttendanceRequestCardItemTitle,
  AttendanceRequestCardItemDate,
  AttendanceRequestCardItemBadge,
  AttendanceRequestModalContent,
  AttendanceRequestList,
  AttendanceRequestCard,
  AttendanceRequestCardContent,
  AttendanceRequestStatusBadge,
  AttendanceRequestInfo,
  AttendanceRequestTypeText,
  AttendanceRequestDateText,
  AttendanceRequestActions,
  AttendanceRequestSummary,
  AttendanceRequestSummaryItem,
  AttendanceRequestSummaryNumber,
  AttendanceRequestSummaryLabel,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
} from './AdminDashboardPage.styled';

// 근태 신청 타입 매핑 (백엔드 → 프론트 표시, GUIDE 변수명 준수)
const ATTENDANCE_TYPE_MAP = {
  연차: { type: '휴가', typeName: '연차' },
  반차: { type: '휴가', typeName: '반차' },
  반반차: { type: '휴가', typeName: '반반차' },
  병가: { type: '휴가', typeName: '병가' },
  휴재: { type: '휴가', typeName: '휴재' },
  휴가: { type: '휴가', typeName: '휴가' },
  재택: { type: '재택근무', typeName: '재택근무' },
  재택근무: { type: '재택근무', typeName: '재택근무' },
  워케이션: { type: '워케이션', typeName: '워케이션' },
};

const REQUEST_STATUS = {
  PENDING: '대기',
  APPROVED: '승인',
  REJECTED: '반려',
};

const REQUEST_STATUS_MAP = {
  PENDING: '대기',
  APPROVED: '승인',
  REJECTED: '반려',
  CANCELLED: '반려',
};

export function AdminDashboardPage({ onNavigateToSection }) {
  const [isProjectListOpen, setIsProjectListOpen] = useState(false);
  const [isAttendanceListOpen, setIsAttendanceListOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [showHealthSurvey, setShowHealthSurvey] = useState(false);
  const [healthCheckCompleted, setHealthCheckCompleted] = useState(false);
  const [currentAttendanceType, setCurrentAttendanceType] = useState(null);
  const [currentAttendanceData, setCurrentAttendanceData] = useState(null);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [agencyName, setAgencyName] = useState('');

  const [healthSurvey, setHealthSurvey] = useState({
    condition: 'normal',
    sleepHours: '',
    discomfortLevel: 0,
    notes: '',
  });

  // 현재 적용 중인 근태 상태 조회 (API 호출)
  useEffect(() => {
    const fetchCurrentAttendanceStatus = async () => {
      try {
        const response = await leaveService.getCurrentStatus();
        const data = response;
        if (data && data.attendanceRequestType) {
          const typeMap = {
            '연차': '휴가',
            '반차': '휴가',
            '병가': '휴가',
            '워케이션': '워케이션',
            '재택근무': '재택근무',
            '재택': '재택근무',
            '휴가': '휴가',
            '휴재': '휴가',
          };
          const displayType = typeMap[data.attendanceRequestType] || data.attendanceRequestType;
          setCurrentAttendanceType(displayType);
          setCurrentAttendanceData(data);
        } else {
          setCurrentAttendanceType('출근');
          setCurrentAttendanceData(null);
        }
      } catch (error) {
        console.error('현재 근태 상태 조회 실패:', error);
        setCurrentAttendanceType('출근');
        setCurrentAttendanceData(null);
      }
    };

    fetchCurrentAttendanceStatus();
    const interval = setInterval(fetchCurrentAttendanceStatus, 300000);
    return () => clearInterval(interval);
  }, []);


  // 오늘 출근 상태 조회 (페이지 로드 시 및 리다이렉션 시), 탭 포커스 시 신청 현황 새로고침
  useEffect(() => {
    const fetchTodayAttendanceStatus = async () => {
      try {
        const response = await attendanceService.getTodayStatus();
        const data = response;
        if (data && data.isWorking && data.lastAttendanceType === '출근') {
          setIsWorking(true);
          setHealthCheckCompleted(true);
        } else {
          setIsWorking(false);
          setHealthCheckCompleted(false);
        }
      } catch (error) {
        console.error('오늘 출근 상태 조회 실패:', error);
        setIsWorking(false);
        setHealthCheckCompleted(false);
      }
    };

    const handleFocus = () => {
      fetchTodayAttendanceStatus();
      setAttendanceRequestsRefreshTrigger((prev) => prev + 1);
      setWeeklyAttendanceRefreshTrigger((prev) => prev + 1);
    };

    fetchTodayAttendanceStatus();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // 현재 작업 중인 작가: API 연동 (ARTIST_ASSIGNMENT + 오늘 마지막 ATTENDANCE '출근')
  const user = useAuthStore((state) => state.user);
  const [workingArtists, setWorkingArtists] = useState([]);
  const [workingArtistsLoading, setWorkingArtistsLoading] = useState(false);
  useEffect(() => {
    const fetchWorkingArtists = async () => {
      if (!user?.memberNo || !user?.agencyNo) return;
      setWorkingArtistsLoading(true);
      try {
        const managersRes = await memberService.getManagersByAgency(user.agencyNo);
        const managersList = Array.isArray(managersRes) ? managersRes : managersRes?.data ?? [];
        const currentManager = managersList.find((m) => Number(m.memberNo) === Number(user.memberNo));
        if (!currentManager?.managerNo) {
          setWorkingArtists([]);
          return;
        }
        const res = await memberService.getWorkingArtistsByManager(currentManager.managerNo);
        const list = Array.isArray(res) ? res : res?.data ?? [];
        setWorkingArtists(list);
      } catch (e) {
        console.error('현재 작업중인 작가 조회 실패:', e);
        setWorkingArtists([]);
      } finally {
        setWorkingArtistsLoading(false);
      }
    };
    fetchWorkingArtists();
  }, [user?.memberNo, user?.agencyNo]);

  // 에이전시 정보 조회
  useEffect(() => {
    const fetchAgencyInfo = async () => {
      if (user?.agencyNo) {
        try {
          const response = await agencyService.getAgency(user.agencyNo);
          if (response && response.agencyName) {
            setAgencyName(response.agencyName);
          }
        } catch (error) {
          console.error('에이전시 정보 조회 실패:', error);
        }
      }
    };
    fetchAgencyInfo();
  }, [user?.agencyNo]);

  // 담당 프로젝트 현황 (DB 연동 - 마감 기한 대비 진행률 → 정상/주의)
  const [managedProjects, setManagedProjects] = useState([]);
  const [managedProjectsLoading, setManagedProjectsLoading] = useState(false);

  // YYYY-MM-DD → "N월 N일" (마감 보정용)
  const formatDeadlineFromIso = (isoStr) => {
    if (!isoStr) return null;
    const d = new Date(isoStr);
    if (Number.isNaN(d.getTime())) return null;
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  // 주기 기준 다음 연재일 계산 (프로젝트 목록과 동일 로직 - deadline '-' 보정용)
  const getNextScheduleDateFromProject = (p) => {
    const startDateStr = p.projectStartedAt
      ? (typeof p.projectStartedAt === 'string' ? p.projectStartedAt.slice(0, 10) : null)
      : null;
    if (!startDateStr || p.projectCycle == null || isNaN(Number(p.projectCycle))) return null;
    const start = new Date(startDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    if (daysDiff < 0) return start;
    const n = daysDiff === 0 ? 0 : Math.ceil(daysDiff / Number(p.projectCycle));
    const next = new Date(start);
    next.setDate(start.getDate() + n * Number(p.projectCycle));
    return next;
  };

  // 마감일 문자열("N월 N일")을 Date 객체로 변환 (정렬용)
  const parseDeadlineToDate = (deadlineStr) => {
    if (!deadlineStr || deadlineStr === '-') return null;
    const match = deadlineStr.match(/(\d+)월\s*(\d+)일/);
    if (!match) return null;
    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = today.getFullYear();
    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    // 올해 날짜가 이미 지났으면 내년으로 처리 (단, 오늘과 같은 날짜는 올해로 유지)
    if (date < today && date.getTime() !== today.getTime()) {
      date.setFullYear(year + 1);
    }
    return date;
  };

  // 마감일 표시용 D-N / D-DAY 라벨
  const getDeadlineDnLabel = (deadlineStr) => {
    const date = parseDeadlineToDate(deadlineStr);
    if (!date) return '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `D-${diffDays}`;
    if (diffDays === 0) return 'D-DAY';
    return `D+${Math.abs(diffDays)}`;
  };

  useEffect(() => {
    const fetchManagedProjects = async () => {
      const memberNo = useAuthStore.getState().user?.memberNo;
      if (!memberNo) return;

      setManagedProjectsLoading(true);
      try {
        const [managedList, projectsList] = await Promise.all([
          projectService.getManagedProjects(),
          projectService.getProjects(0, 100),
        ]);
        const arr = Array.isArray(managedList) ? managedList : [];
        const fullList = Array.isArray(projectsList) ? projectsList : projectsList?.content ?? projectsList?.data ?? [];
        const mapped = arr.map((p) => {
          let deadline = p.deadline || '-';
          if (deadline === '-') {
            const full = fullList.find((x) => x.projectNo === p.projectNo);
            if (full) {
              const nextDate = getNextScheduleDateFromProject(full);
              if (nextDate) {
                const iso = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
                deadline = formatDeadlineFromIso(iso) || '-';
              }
            }
          }
          return {
            id: p.projectNo,
            name: p.projectName || '-',
            artist: p.artist || '-',
            status: p.status || '정상',
            progress: p.progress ?? 0,
            deadline,
          };
        });

        // 마감일 기준으로 정렬 (오늘이 연재일인 항목이 제일 위, 그 다음 가까운 순서대로)
        mapped.sort((a, b) => {
          const dateA = parseDeadlineToDate(a.deadline);
          const dateB = parseDeadlineToDate(b.deadline);

          // 둘 다 마감일이 없으면 프로젝트 번호순
          if (!dateA && !dateB) {
            return a.id - b.id;
          }
          // 마감일이 없는 항목은 뒤로
          if (!dateA) return 1;
          if (!dateB) return -1;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // 오늘이 연재일인 항목을 최우선으로
          const aIsToday = dateA && dateA.getTime() === today.getTime();
          const bIsToday = dateB && dateB.getTime() === today.getTime();
          if (aIsToday && !bIsToday) return -1;  // a가 오늘이면 앞으로
          if (!aIsToday && bIsToday) return 1;   // b가 오늘이면 앞으로

          // 둘 다 오늘이거나 둘 다 오늘이 아니면 날짜 오름차순 (가까운 순서)
          return dateA - dateB;
        });

        setManagedProjects(mapped);
      } catch (err) {
        console.error('담당 프로젝트 현황 조회 실패:', err);
        setManagedProjects([]);
      } finally {
        setManagedProjectsLoading(false);
      }
    };
    fetchManagedProjects();
  }, [user?.memberNo]);

  // 신청 현황 (근태 신청 목록) - leaveService.getManagerRequests API 연동, 담당 작가 근태 신청 현황
  const [attendanceRequests, setAttendanceRequests] = useState([]);
  const [isLoadingAttendanceRequests, setIsLoadingAttendanceRequests] = useState(false);
  const [attendanceRequestsRefreshTrigger, setAttendanceRequestsRefreshTrigger] = useState(0);
  const [editingAttendanceRequest, setEditingAttendanceRequest] = useState(null);
  const [showEditAttendanceModal, setShowEditAttendanceModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  useEffect(() => {
    const fetchAttendanceRequests = async () => {
      const memberNo = useAuthStore.getState().user?.memberNo;
      if (!memberNo) return;

      setIsLoadingAttendanceRequests(true);
      try {
        const response = await leaveService.getManagerRequests();
        const list = Array.isArray(response) ? response : [];
        const filtered = list.filter((item) => item.attendanceRequestStatus !== 'CANCELLED');
        const formatReqDate = (dt) => {
          if (!dt) return '';
          const d = typeof dt === 'string' ? new Date(dt) : dt;
          return `${d.getMonth() + 1}월 ${d.getDate()}일`;
        };
        const mapped = filtered.map((item) => {
          const typeConfig = ATTENDANCE_TYPE_MAP[item.attendanceRequestType] || {
            type: '휴가',
            typeName: item.attendanceRequestType || '휴가',
          };
          const status = REQUEST_STATUS_MAP[item.attendanceRequestStatus] || REQUEST_STATUS.PENDING;
          const requesterName = item.memberName || item.artistName || item.requesterName || '-';

          return {
            id: String(item.attendanceRequestNo),
            type: typeConfig.type,
            typeName: typeConfig.typeName,
            startDate: formatReqDate(item.attendanceRequestStartDate),
            endDate: formatReqDate(item.attendanceRequestEndDate),
            status,
            rawStatus: item.attendanceRequestStatus,
            requesterName,
            raw: item,
          };
        });
        setAttendanceRequests(mapped);
      } catch (error) {
        console.error('신청 현황 조회 실패:', error);
        setAttendanceRequests([]);
      } finally {
        setIsLoadingAttendanceRequests(false);
      }
    };

    fetchAttendanceRequests();
  }, [attendanceRequestsRefreshTrigger]);

  useEffect(() => {
    const handleLeaveRequestSuccess = () => {
      setAttendanceRequestsRefreshTrigger((prev) => prev + 1);
    };
    window.addEventListener('leaveRequestSuccess', handleLeaveRequestSuccess);
    return () => window.removeEventListener('leaveRequestSuccess', handleLeaveRequestSuccess);
  }, []);

  const handleEditAttendanceRequest = (request) => {
    if (!request?.raw || request.rawStatus !== 'PENDING') return;
    setEditingAttendanceRequest(request.raw);
    setShowEditAttendanceModal(true);
  };

  const handleCancelAttendanceRequest = async (request) => {
    if (!request?.id) return;
    try {
      await leaveService.cancelAttendanceRequest(Number(request.id));
      toast.success('근태 신청이 취소되었습니다.');
      setAttendanceRequestsRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('근태 신청 취소 실패:', error);
      toast.error(error?.message || '취소에 실패했습니다.');
    }
  };

  // 마감 임박 현황 (캘린더 DB 연동)
  const [deadlineData, setDeadlineData] = useState([
    { name: '오늘', count: 0 },
    { name: '내일', count: 0 },
    { name: '2일 후', count: 0 },
    { name: '3일 후', count: 0 },
    { name: '4일 후', count: 0 },
  ]);
  const [deadlineLoading, setDeadlineLoading] = useState(false);

  useEffect(() => {
    const fetchDeadlineCounts = async () => {
      setDeadlineLoading(true);
      try {
        const list = await projectService.getDeadlineCounts();
        const arr = Array.isArray(list) ? list : [];
        if (arr.length >= 5) {
          setDeadlineData(arr);
        } else {
          const defaultLabels = ['오늘', '내일', '2일 후', '3일 후', '4일 후'];
          const mapped = defaultLabels.map((label) => {
            const item = arr.find((d) => d.name === label);
            return item ? { name: label, count: item.count ?? 0 } : { name: label, count: 0 };
          });
          setDeadlineData(mapped);
        }
      } catch (err) {
        console.error('마감 임박 현황 조회 실패:', err);
        setDeadlineData([
          { name: '오늘', count: 0 },
          { name: '내일', count: 0 },
          { name: '2일 후', count: 0 },
          { name: '3일 후', count: 0 },
          { name: '4일 후', count: 0 },
        ]);
      } finally {
        setDeadlineLoading(false);
      }
    };
    fetchDeadlineCounts();
  }, []);

  // 금주 근태 예정 (DB 연동 - 담당 작가별 근태 신청)
  const [weeklyAttendance, setWeeklyAttendance] = useState([]);
  const [weeklyAttendanceLoading, setWeeklyAttendanceLoading] = useState(false);
  const [weeklyAttendanceRefreshTrigger, setWeeklyAttendanceRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchWeeklyAttendance = async () => {
      const memberNo = useAuthStore.getState().user?.memberNo;
      if (!memberNo) return;

      setWeeklyAttendanceLoading(true);
      try {
        const list = await leaveService.getWeeklyAttendanceByManager();
        const arr = Array.isArray(list) ? list : [];
        const typeMap = {
          연차: '휴가',
          반차: '휴가',
          반반차: '휴가',
          병가: '휴가',
          휴재: '휴가',
          휴가: '휴가',
          재택: '재택근무',
          재택근무: '재택근무',
          워케이션: '워케이션',
        };
        const statusMap = { PENDING: '대기', APPROVED: '승인', REJECTED: '반려' };
        const formatDate = (dt) => {
          if (!dt) return '';
          const d = typeof dt === 'string' ? new Date(dt) : dt;
          return `${d.getMonth() + 1}월 ${d.getDate()}일`;
        };
        const mapped = arr.map((item) => {
          const startStr = formatDate(item.attendanceRequestStartDate);
          const endStr = formatDate(item.attendanceRequestEndDate);
          const dateStr = startStr === endStr ? startStr : `${startStr} ~ ${endStr}`;
          return {
            id: item.attendanceRequestNo,
            name: item.memberName || '-',
            type: typeMap[item.attendanceRequestType] || item.attendanceRequestType || '-',
            date: dateStr,
            status: statusMap[item.attendanceRequestStatus] || item.attendanceRequestStatus || '-',
          };
        });
        setWeeklyAttendance(mapped);
      } catch (err) {
        console.error('금주 근태 예정 조회 실패:', err);
        setWeeklyAttendance([]);
      } finally {
        setWeeklyAttendanceLoading(false);
      }
    };
    fetchWeeklyAttendance();
  }, [user?.memberNo, weeklyAttendanceRefreshTrigger]);

  const getStatusColor = (status) => {
    switch (status) {
      case '정상':
        return 'bg-green-500';
      case '주의':
        return 'bg-amber-500';
      case '워케이션':
        return 'bg-[#9C27B0]';
      case '휴가':
        return 'bg-[#757575]';
      case '재택근무':
        return 'bg-[#FF9800]';
      case '출근':
        return 'bg-[#00ACC1]';
      default:
        return 'bg-gray-500';
    }
  };

  const getAttendanceTypeColor = (type) => {
    switch (type) {
      case '워케이션':
        return 'bg-[#9C27B0]';
      case '휴가':
        return 'bg-[#757575]';
      case '재택근무':
        return 'bg-[#FF9800]';
      case '출근':
        return 'bg-[#00ACC1]';
      default:
        return 'bg-gray-500';
    }
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case '승인':
        return 'bg-green-500';
      case '대기':
        return 'bg-yellow-500';
      case '반려':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleStartWork = () => {
    setShowHealthSurvey(true);
  };

  // 출근 종료 핸들러
  const handleStopWork = () => {
    // 항상 확인 창 표시
    setShowStopConfirm(true);
  };

  const confirmStopWork = async () => {
    try {
      await attendanceService.endAttendance();
      setIsWorking(false);
      setHealthCheckCompleted(false);
      setShowStopConfirm(false);
      toast.success('출근이 종료되었습니다.');
    } catch (error) {
      console.error('출근 종료 실패:', error);
      toast.error(error?.message || '출근 종료에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const isHealthSurveyValid = () => {
    return healthSurvey.sleepHours.trim() !== '';
  };

  const handleHealthSurveySubmit = async () => {
    if (!isHealthSurveyValid()) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }
    try {
      const sleepHoursMatch = healthSurvey.sleepHours.match(/\d+/);
      const sleepHoursValue = sleepHoursMatch ? parseInt(sleepHoursMatch[0]) : null;
      const healthCheckData = {
        healthCondition: healthSurvey.condition,
        sleepHours: sleepHoursValue,
        discomfortLevel: healthSurvey.discomfortLevel,
        healthCheckNotes: healthSurvey.notes || '',
      };
      await attendanceService.startAttendance(healthCheckData);
      setIsWorking(true);
      setHealthCheckCompleted(true);
      setShowHealthSurvey(false);
      toast.success('출근이 시작되었습니다. 좋은 하루 되세요!');
    } catch (error) {
      console.error('출근 시작 실패:', error);
      toast.error(error?.message || '출근 시작에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancelHealthCheck = () => {
    setShowHealthSurvey(false);
    toast.info('건강 체크를 취소했습니다. 출근이 시작되지 않았습니다.');
  };

  const today = new Date();
  const todayString = `${today.getMonth() + 1}월 ${today.getDate()}일`;
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const todayFullDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${weekdays[today.getDay()]}`;

  const getCurrentStatusText = () => {
    // 에이전시 정보가 있으면 최우선으로 표시
    if (agencyName) {
      return agencyName;
    }

    if (!isWorking && (!currentAttendanceType || currentAttendanceType === '출근')) {
      return '출근 대기중';
    }
    const displayType = currentAttendanceType || '출근';
    return `${displayType} 중`;
  };

  const formatPeriodDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const getAttendancePeriod = () => {
    if (!currentAttendanceData) return null;
    const startDate = formatPeriodDate(currentAttendanceData.attendanceRequestStartDate);
    const endDate = formatPeriodDate(currentAttendanceData.attendanceRequestEndDate);
    return `${startDate} ~ ${endDate}`;
  };

  const getAttendanceStatusBoxProps = (type) => {
    const period = getAttendancePeriod();
    const location = currentAttendanceData?.workcationLocation;

    switch (type) {
      case '출근':
        if (!isWorking) {
          return {
            bgColor: '#F5F5F5',
            borderColor: 'rgba(117, 117, 117, 0.2)',
            iconBgColor: 'rgba(117, 117, 117, 0.1)',
            iconColor: '#757575',
            Icon: Building2,
            title: '출근 대기중',
            description: '오늘 하루도 힘내세요!',
          };
        }
        return {
          bgColor: '#E8F6F8',
          borderColor: 'rgba(0, 172, 193, 0.2)',
          iconBgColor: 'rgba(0, 172, 193, 0.1)',
          iconColor: '#00ACC1',
          Icon: Building2,
          title: '출근 중',
          description: agencyName ? `${agencyName}에서 작업 중입니다` : '사무실에서 작업 중입니다',
        };
      case '재택근무':
        return {
          bgColor: '#FFF4E6',
          borderColor: 'rgba(255, 152, 0, 0.2)',
          iconBgColor: 'rgba(255, 152, 0, 0.1)',
          iconColor: '#FF9800',
          Icon: Home,
          title: '재택근무 중',
          description: '자택에서 작업 중입니다',
          period: period,
        };
      case '휴가':
        return {
          bgColor: '#E0F2F1',
          borderColor: 'rgba(0, 150, 136, 0.2)',
          iconBgColor: 'rgba(0, 150, 136, 0.1)',
          iconColor: '#009688',
          Icon: Calendar,
          title: '휴가 중',
          description: '휴식 중입니다',
          period: period,
        };
      case '워케이션':
        return {
          bgColor: '#F6F3FA',
          borderColor: 'rgba(156, 39, 176, 0.2)',
          iconBgColor: 'rgba(156, 39, 176, 0.1)',
          iconColor: '#9C27B0',
          Icon: Palmtree,
          title: '워케이션 중',
          description: location ? `${location}에서 작업 중입니다` : '외부 환경에서 작업 중입니다',
          period: period,
        };
      default:
        return null;
    }
  };

  const statusBoxProps = currentAttendanceType ? getAttendanceStatusBoxProps(currentAttendanceType) : null;

  return (
    <AdminDashboardRoot>
      <AdminDashboardBody>
        {/* 출근 시작 & 현재 작업 중인 작가 섹션 */}
        <AdminDashboardTopGrid>
          {/* 왼쪽: 출근 시작 섹션 */}
          <AttendanceStartCard>
            <AttendanceStartHeader>
              <AttendanceStartDateInfo>
                <AttendanceStartDate>{getCurrentStatusText()}</AttendanceStartDate>
                <AttendanceStartDateSub>{todayFullDate}</AttendanceStartDateSub>
              </AttendanceStartDateInfo>
              <AttendanceStartActions>
                {isWorking && !healthCheckCompleted && (
                  <HealthCheckWarning>
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs text-yellow-700 font-medium">건강 체크 미완료</span>
                  </HealthCheckWarning>
                )}
                <Button onClick={isWorking ? handleStopWork : handleStartWork} className={`bg-[#3f4a5a] hover:bg-[#6E8FB3] ${isWorking ? 'bg-red-500 hover:bg-red-600' : ''}`} size="lg">
                  {isWorking ? (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      출근 종료
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 16 16">
                        <path d={svgPaths.p2b703a00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      </svg>
                      출근 시작
                    </>
                  )}
                </Button>
              </AttendanceStartActions>
            </AttendanceStartHeader>

            {(() => {
              const displayType = currentAttendanceType || '출근';
              const displayProps = getAttendanceStatusBoxProps(displayType);

              if (!displayProps) {
                const defaultProps = {
                  bgColor: '#E8F6F8',
                  borderColor: 'rgba(0, 172, 193, 0.2)',
                  iconBgColor: 'rgba(0, 172, 193, 0.1)',
                  iconColor: '#00ACC1',
                  Icon: Building2,
                  title: '출근 중',
                  description: '사무실에서 작업 중입니다',
                };
                const DefaultIcon = defaultProps.Icon;
                return (
                  <AttendanceStatusBox $bgColor={defaultProps.bgColor} $borderColor={defaultProps.borderColor}>
                    <AttendanceStatusBoxContent>
                      <AttendanceStatusBoxInfo>
                        <AttendanceStatusBoxIcon $bgColor={defaultProps.iconBgColor}>
                          <DefaultIcon className="w-6 h-6" style={{ color: defaultProps.iconColor }} />
                        </AttendanceStatusBoxIcon>
                        <AttendanceStatusBoxText>
                          <AttendanceStatusBoxTitle>{defaultProps.title}</AttendanceStatusBoxTitle>
                          <AttendanceStatusBoxDescription>{defaultProps.description}</AttendanceStatusBoxDescription>
                        </AttendanceStatusBoxText>
                      </AttendanceStatusBoxInfo>
                    </AttendanceStatusBoxContent>
                  </AttendanceStatusBox>
                );
              }

              const DisplayIcon = displayProps.Icon;
              return (
                <AttendanceStatusBox $bgColor={displayProps.bgColor} $borderColor={displayProps.borderColor}>
                  <AttendanceStatusBoxContent>
                    <AttendanceStatusBoxInfo>
                      <AttendanceStatusBoxIcon $bgColor={displayProps.iconBgColor}>
                        <DisplayIcon className="w-6 h-6" style={{ color: displayProps.iconColor }} />
                      </AttendanceStatusBoxIcon>
                      <AttendanceStatusBoxText>
                        <AttendanceStatusBoxTitle>{displayProps.title}</AttendanceStatusBoxTitle>
                        <AttendanceStatusBoxDescription>{displayProps.description}</AttendanceStatusBoxDescription>
                      </AttendanceStatusBoxText>
                    </AttendanceStatusBoxInfo>
                  </AttendanceStatusBoxContent>
                  {(displayType === '휴가' || displayType === '워케이션') && currentAttendanceData && displayProps.period && (
                    <AttendanceStatusBoxPeriod $borderColor={displayProps.borderColor}>
                      <AttendanceStatusBoxPeriodLabel>{displayType === '휴가' ? '휴가 기간' : '워케이션 기간'}</AttendanceStatusBoxPeriodLabel>
                      <AttendanceStatusBoxPeriodValue>{displayProps.period}</AttendanceStatusBoxPeriodValue>
                    </AttendanceStatusBoxPeriod>
                  )}
                </AttendanceStatusBox>
              );
            })()}
          </AttendanceStartCard>

          {/* 오른쪽: 현재 작업 중인 작가 섹션 */}
          <WorkingArtistsCard>
            <WorkingArtistsHeader>
              <Play className="w-5 h-5" style={{ color: '#6E8FB3' }} />
              <WorkingArtistsTitle>현재 작업 중인 작가</WorkingArtistsTitle>
              <Badge className="bg-[#6E8FB3] text-white text-xs px-2 py-1">{workingArtists.length}명</Badge>
            </WorkingArtistsHeader>

            <WorkingArtistsGrid>
              {workingArtistsLoading ? (
                <p className="text-sm text-muted-foreground py-4">조회 중...</p>
              ) : workingArtists.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">현재 출근 중인 배정 작가가 없습니다.</p>
              ) : (
                workingArtists.map((artist) => (
                  <WorkingArtistCard key={artist.artistNo || artist.memberNo}>
                    <WorkingArtistHeader>
                      <WorkingArtistStatusDot />
                      <WorkingArtistName>{artist.artistName || artist.memberName}</WorkingArtistName>
                    </WorkingArtistHeader>
                    <WorkingArtistProject>{artist.currentProjectName || '-'}</WorkingArtistProject>
                    <WorkingArtistMeta>
                      <WorkingArtistMetaLabel>시작</WorkingArtistMetaLabel>
                      <WorkingArtistMetaValue>
                        {artist.attendanceTime
                          ? new Date(artist.attendanceTime).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })
                          : '-'}
                      </WorkingArtistMetaValue>
                    </WorkingArtistMeta>
                  </WorkingArtistCard>
                ))
              )}
            </WorkingArtistsGrid>
          </WorkingArtistsCard>
        </AdminDashboardTopGrid>

        {/* 마감 임박 현황 & 신청 현황 */}
        <ChartSection style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* 마감 임박 현황 */}
          <ChartCard>
            <ChartHeader>
              <AlertCircle className="w-5 h-5" style={{ color: '#6E8FB3' }} />
              <ChartTitle>마감 임박 현황</ChartTitle>
            </ChartHeader>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deadlineData} barSize={40}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" domain={[0, 'dataMax + 1']} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#6E8FB3" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {deadlineData[0]?.count > 0 && (
              <ChartAlert>
                <AlertCircle className="w-4 h-4 text-red-600" />
                <ChartAlertText>오늘 마감 예정 작품이 {deadlineData[0].count}개 있습니다</ChartAlertText>
              </ChartAlert>
            )}
          </ChartCard>

          {/* 신청 현황 - 작가 신청 현황과 동일 (DB 연동, 수정/삭제 버튼) */}
          <QuickInfoCard>
            <AttendanceRequestCardHeader onClick={() => setShowAttendanceModal(true)} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
                <QuickInfoTitle style={{ margin: 0 }}>신청 현황</QuickInfoTitle>
              </div>
              {attendanceRequests.length >= 1 && (
                <ChevronRight className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              )}
            </AttendanceRequestCardHeader>
            {attendanceRequests.length >= 1 && (
              <AttendanceRequestCardList>
                {attendanceRequests.slice(0, 2).map((request) => {
                  const statusColor =
                    request.status === REQUEST_STATUS.PENDING ? '#F59E0B' :
                      request.status === REQUEST_STATUS.APPROVED ? '#10B981' :
                        '#EF4444';

                  return (
                    <AttendanceRequestCardItem key={request.id}>
                      <AttendanceRequestCardItemContent>
                        <AttendanceRequestCardItemTitle>
                          {request.requesterName || '-'}
                        </AttendanceRequestCardItemTitle>
                        <AttendanceRequestCardItemDate>
                          {(request.typeName || request.type) || '-'} · {request.startDate} ~ {request.endDate}
                        </AttendanceRequestCardItemDate>
                      </AttendanceRequestCardItemContent>
                      <AttendanceRequestCardItemBadge $statusColor={statusColor}>
                        {request.status}
                      </AttendanceRequestCardItemBadge>
                    </AttendanceRequestCardItem>
                  );
                })}
              </AttendanceRequestCardList>
            )}
          </QuickInfoCard>
        </ChartSection>

        {/* 프로젝트 및 근태 섹션 */}
        <ProjectsAttendanceGrid>
          {/* 담당 프로젝트 현황 */}
          <ProjectsCard>
            <ProjectsHeader>
              <ProjectsHeaderLeft>
                <Briefcase className="w-5 h-5" style={{ color: '#6E8FB3' }} />
                <ChartTitle>다음 연재일</ChartTitle>
              </ProjectsHeaderLeft>
              <Button variant="outline" size="sm" onClick={() => setIsProjectListOpen(true)} className="text-xs h-7">
                전체보기
              </Button>
            </ProjectsHeader>

            <ProjectsList>
              {managedProjects.slice(0, 4).map((project) => {
                // 프로젝트 클릭 핸들러
                const handleProjectClick = () => {
                  // 프로젝트 ID를 localStorage에 저장하여 AdminProjectsPage에서 사용
                  localStorage.setItem('selectedProjectId', project.id.toString());
                  // 프로젝트 관리 섹션으로 이동 (manager-projects는 인덱스 1)
                  if (onNavigateToSection) {
                    onNavigateToSection(1);
                  }
                };

                return (
                  <ProjectItem
                    key={project.id}
                    onClick={handleProjectClick}
                  >
                    <ProjectItemHeader>
                      <ProjectItemInfo>
                        <ProjectItemTitleRow>
                          <ProjectItemTitle>{project.name}</ProjectItemTitle>
                          <Badge className={`${getStatusColor(project.status)} text-xs text-white`}>
                            {getDeadlineDnLabel(project.deadline)}
                          </Badge>
                        </ProjectItemTitleRow>
                      </ProjectItemInfo>
                    </ProjectItemHeader>
                    <ProjectItemMeta>
                      <ProjectItemArtist>담당: {project.artist}</ProjectItemArtist>
                      <span>연재일 : {project.deadline}</span>
                    </ProjectItemMeta>
                  </ProjectItem>
                );
              })}
            </ProjectsList>

            <ProjectsInfoBox>
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <ProjectsInfoText>총 {managedProjects.length}개의 프로젝트를 담당하고 있습니다</ProjectsInfoText>
            </ProjectsInfoBox>
          </ProjectsCard>

          {/* 금주 근태 예정 */}
          <AttendanceScheduleCard>
            <AttendanceScheduleHeader>
              <AttendanceScheduleHeaderLeft>
                <Calendar className="w-5 h-5" style={{ color: '#6E8FB3' }} />
                <ChartTitle>금주 근태 예정</ChartTitle>
              </AttendanceScheduleHeaderLeft>
              <Button variant="outline" size="sm" onClick={() => setIsAttendanceListOpen(true)} className="text-xs h-7">
                전체보기
              </Button>
            </AttendanceScheduleHeader>

            <AttendanceScheduleList>
              {weeklyAttendance.map((item) => (
                <AttendanceScheduleItem key={item.id}>
                  <AttendanceScheduleItemHeader>
                    <AttendanceScheduleItemLeft>
                      <AttendanceScheduleItemName>{item.name}</AttendanceScheduleItemName>
                      <Badge className={`${getAttendanceTypeColor(item.type)} text-xs text-white`}>{item.type}</Badge>
                    </AttendanceScheduleItemLeft>
                    <Badge className={`${getAttendanceStatusColor(item.status)} text-xs text-white`}>{item.status}</Badge>
                  </AttendanceScheduleItemHeader>
                  <AttendanceScheduleItemDate>{item.date}</AttendanceScheduleItemDate>
                </AttendanceScheduleItem>
              ))}
            </AttendanceScheduleList>

            {weeklyAttendance.filter((a) => a.status === '대기').length > 0 && (
              <AttendanceScheduleWarningBox>
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <AttendanceScheduleWarningText>승인 대기 중인 신청이 {weeklyAttendance.filter((a) => a.status === '대기').length}건 있습니다</AttendanceScheduleWarningText>
              </AttendanceScheduleWarningBox>
            )}
          </AttendanceScheduleCard>
        </ProjectsAttendanceGrid>
      </AdminDashboardBody>

      {/* Project List Modal */}
      <ProjectListModal
        open={isProjectListOpen}
        onOpenChange={setIsProjectListOpen}
        projects={managedProjects}
        onProjectClick={(project) => {
          // 프로젝트 관리 섹션으로 이동 (manager-projects는 인덱스 1)
          if (onNavigateToSection) {
            // 프로젝트 ID를 localStorage에 저장하여 AdminProjectsPage에서 사용
            localStorage.setItem('selectedProjectId', project.id.toString());
            onNavigateToSection(1); // manager-projects 섹션 인덱스
          }
        }}
      />

      {/* Attendance List Modal */}
      <AttendanceListModal open={isAttendanceListOpen} onOpenChange={setIsAttendanceListOpen} attendances={weeklyAttendance} />

      {/* Health Survey Modal */}
      <Modal isOpen={showHealthSurvey} onClose={() => setShowHealthSurvey(false)} title="건강 체크" maxWidth="lg">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">출근을 시작하기 전에 간단한 건강 체크를 진행합니다.</p>

          {/* 컨디션 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              오늘 컨디션 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'tired', label: '피곤함' },
                { value: 'normal', label: '보통' },
                { value: 'good', label: '좋음' },
                { value: 'excellent', label: '최상' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setHealthSurvey({ ...healthSurvey, condition: option.value })}
                  className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${healthSurvey.condition === option.value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 수면 시간 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              수면 시간 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="예: 7시간"
              value={healthSurvey.sleepHours}
              onChange={(e) => setHealthSurvey({ ...healthSurvey, sleepHours: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
            />
          </div>

          {/* 불편함 정도 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              신체 불편함 (0-10) <span className="text-red-500">*</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={healthSurvey.discomfortLevel}
              onChange={(e) => setHealthSurvey({ ...healthSurvey, discomfortLevel: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>없음</span>
              <span className="font-medium text-foreground">{healthSurvey.discomfortLevel}</span>
              <span>매우 불편함</span>
            </div>
          </div>

          {/* 메모 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">메모 (선택사항)</label>
            <textarea
              placeholder="특이사항을 입력하세요"
              value={healthSurvey.notes}
              onChange={(e) => setHealthSurvey({ ...healthSurvey, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={handleCancelHealthCheck}>
              취소
            </Button>
            <Button className="flex-1" onClick={handleHealthSurveySubmit} disabled={!isHealthSurveyValid()}>
              완료
            </Button>
          </div>
        </div>
      </Modal>

      {/* 출근 종료 확인 모달 */}
      <Modal isOpen={showStopConfirm} onClose={() => setShowStopConfirm(false)} title="출근 종료 확인" maxWidth="sm">
        <WarningBox>
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <WarningContent>
            <WarningDescription>출근을 종료하시겠습니까?</WarningDescription>
          </WarningContent>
        </WarningBox>
        <ModalActions>
          <Button variant="outline" className="flex-1" onClick={() => setShowStopConfirm(false)}>
            취소
          </Button>
          <Button variant="destructive" className="flex-1" onClick={confirmStopWork}>
            종료
          </Button>
        </ModalActions>
      </Modal>

      {/* 신청 현황 모달 - 작가와 동일 (대기: 수정/삭제, 반려: 삭제만, 승인: 버튼 없음) */}
      <Modal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
            <span>신청 현황 목록</span>
          </div>
        }
        maxWidth="lg"
      >
        <AttendanceRequestModalContent>
          <AttendanceRequestList>
            {isLoadingAttendanceRequests ? (
              <EmptyState>
                <EmptyStateText>로딩 중...</EmptyStateText>
              </EmptyState>
            ) : attendanceRequests.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>
                  <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                </EmptyStateIcon>
                <EmptyStateText>아직 신청 현황이 없습니다.</EmptyStateText>
              </EmptyState>
            ) : (
              attendanceRequests.map((request) => {
                const statusColor =
                  request.status === REQUEST_STATUS.PENDING ? '#F59E0B' :
                    request.status === REQUEST_STATUS.APPROVED ? '#10B981' :
                      '#EF4444';

                return (
                  <AttendanceRequestCard key={request.id}>
                    <AttendanceRequestCardContent>
                      <AttendanceRequestStatusBadge $statusColor={statusColor}>
                        {request.status}
                      </AttendanceRequestStatusBadge>
                      <AttendanceRequestInfo>
                        <AttendanceRequestTypeText>
                          {request.requesterName || '-'} · {(request.typeName || request.type) || '-'}
                        </AttendanceRequestTypeText>
                        <AttendanceRequestDateText>
                          {request.startDate} ~ {request.endDate}
                        </AttendanceRequestDateText>
                      </AttendanceRequestInfo>
                      {request.status === REQUEST_STATUS.PENDING && (
                        <AttendanceRequestActions>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAttendanceRequest(request)}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                          >
                            수정
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelAttendanceRequest(request)}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                          >
                            삭제
                          </Button>
                        </AttendanceRequestActions>
                      )}
                      {request.status === REQUEST_STATUS.REJECTED && (
                        <AttendanceRequestActions>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelAttendanceRequest(request)}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                          >
                            삭제
                          </Button>
                        </AttendanceRequestActions>
                      )}
                    </AttendanceRequestCardContent>
                  </AttendanceRequestCard>
                );
              })
            )}
          </AttendanceRequestList>

          {/* 하단 통계 */}
          {attendanceRequests.length > 0 && (
            <AttendanceRequestSummary>
              <AttendanceRequestSummaryItem>
                <AttendanceRequestSummaryNumber>{attendanceRequests.length}</AttendanceRequestSummaryNumber>
                <AttendanceRequestSummaryLabel>전체</AttendanceRequestSummaryLabel>
              </AttendanceRequestSummaryItem>
              <AttendanceRequestSummaryItem>
                <AttendanceRequestSummaryNumber $color="#10B981">
                  {attendanceRequests.filter((r) => r.status === REQUEST_STATUS.APPROVED).length}
                </AttendanceRequestSummaryNumber>
                <AttendanceRequestSummaryLabel>승인</AttendanceRequestSummaryLabel>
              </AttendanceRequestSummaryItem>
              <AttendanceRequestSummaryItem>
                <AttendanceRequestSummaryNumber $color="#F59E0B">
                  {attendanceRequests.filter((r) => r.status === REQUEST_STATUS.PENDING).length}
                </AttendanceRequestSummaryNumber>
                <AttendanceRequestSummaryLabel>대기</AttendanceRequestSummaryLabel>
              </AttendanceRequestSummaryItem>
              <AttendanceRequestSummaryItem>
                <AttendanceRequestSummaryNumber $color="#EF4444">
                  {attendanceRequests.filter((r) => r.status === REQUEST_STATUS.REJECTED).length}
                </AttendanceRequestSummaryNumber>
                <AttendanceRequestSummaryLabel>반려</AttendanceRequestSummaryLabel>
              </AttendanceRequestSummaryItem>
            </AttendanceRequestSummary>
          )}
        </AttendanceRequestModalContent>
      </Modal>

      <LeaveRequestEditModal
        open={showEditAttendanceModal}
        onOpenChange={setShowEditAttendanceModal}
        request={editingAttendanceRequest}
        onSuccess={() => {
          setAttendanceRequestsRefreshTrigger((prev) => prev + 1);
          setEditingAttendanceRequest(null);
        }}
      />
    </AdminDashboardRoot>
  );
}
