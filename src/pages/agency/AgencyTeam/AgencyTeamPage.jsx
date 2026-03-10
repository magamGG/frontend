// 외부 라이브러리
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { 
  Search,
  Users,
  ChevronRight,
  ChevronDown,
  Mail,
  Phone,
  Briefcase,
  UserPlus,
  Trash2,
  BookOpen,
  Heart,
  CalendarClock,
  FileText,
  Loader2,
  User,
  FolderOpen,
  Sparkles
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// 내부 alias (@/)
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/app/components/ui/pagination';
import { memberService, leaveService, attendanceService, portfolioService } from '@/api';
import { getMemberProfileUrl, MEMBER_AVATAR_PLACEHOLDER } from '@/api/config';
import useAuthStore from '@/store/authStore';
import { formatDateToString } from '@/utils/dateUtils';

// 상대 경로
import {
  AgencyTeamRoot,
  AgencyTeamBody,
  HeaderSection,
  HeaderTitle,
  HeaderSubtitle,
  HeaderActions,
  FilterButtonGroup,
  SearchBarContainer,
  SearchIcon,
  EmployeeListContainer,
  EmployeeCard,
  EmployeeCardContent,
  EmployeeAvatar,
  EmployeeAvatarImg,
  EmployeeAvatarFallback,
  CardActionsColumn,
  ProjectsInfoRow,
  ExpandedCard,
  EmployeeInfo,
  EmployeeNameRow,
  EmployeeName,
  EmployeeContactInfo,
  EmployeeStats,
  EmployeeDetailContainer,
  BackButtonContainer,
  EmployeeDetailHeader,
  EmployeeDetailHeaderContent,
  EmployeeDetailBadges,
  EmployeeDetailGrid,
  EmployeeDetailItem,
  EmployeeDetailLabel,
  EmployeeDetailValue,
  ProjectsGrid,
  ProjectCard,
  ProjectCardContent,
  ProjectIcon,
  StatisticsGrid,
  StatisticsCard,
  EmptyState,
  EmptyStateText,
} from './AgencyTeamPage.styled';

const ROLE_FILTERS = ['전체', '담당자', '작가', '어시스트'];

// 근태 타입별 색상 (담당자 마이페이지와 동일)
const ATTENDANCE_TYPE_COLORS = {
  '출근': '#00ACC1',
  '휴가': '#757575',
  '재택근무': '#FF9800',
  '워케이션': '#9C27B0',
};

// 근태 신청 상태 매핑
const REQUEST_STATUS_MAP = {
  PENDING: { label: '대기', color: '#F59E0B' },
  APPROVED: { label: '승인', color: '#10B981' },
  REJECTED: { label: '반려', color: '#EF4444' },
  CANCELLED: { label: '취소', color: '#6B7280' },
};

const formatReqDate = (str) => {
  if (!str) return '-';
  try {
    const d = new Date(str);
    return d.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', year: 'numeric' });
  } catch {
    return str;
  }
};

export function AgencyTeamPage() {
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEmployees, setExpandedEmployees] = useState(new Set());
  const [selectedRoles, setSelectedRoles] = useState(['전체']);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [portfolioModalMemberNo, setPortfolioModalMemberNo] = useState(null);
  const [portfolioModalData, setPortfolioModalData] = useState(null);
  const [portfolioModalLoading, setPortfolioModalLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({}); // 직원별 상세 정보 캐시
  const [loadingDetails, setLoadingDetails] = useState(new Set()); // 로딩 중인 직원 ID
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const projectContainerRefs = useRef({}); // 참여 중인 프로젝트 컨테이너 refs
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 한 페이지에 표시할 직원 수
  const [agencyLeaveRequests, setAgencyLeaveRequests] = useState([]); // 에이전시 소속 근태 신청 목록

  // 새 직원 추가 폼 상태
  const [newEmployee, setNewEmployee] = useState({
    email: '',
  });

  // 편집 중인 직원 상태
  const [editingEmployee, setEditingEmployee] = useState(null);

  // API에서 직원 목록 가져오기
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!user?.agencyNo) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await memberService.getMembersByAgency(user.agencyNo);
        
        // API 응답 데이터를 컴포넌트에서 사용하는 형식으로 변환
        const members = Array.isArray(response) ? response : [];
        const mappedEmployees = members.map((member) => ({
          id: member.memberNo,
          name: member.memberName,
          role: member.memberRole,
          position: member.memberRole,
          email: member.memberEmail,
          phone: member.memberPhone || '',
          status: member.todayWorkStatus ?? (member.memberStatus === 'ACTIVE' ? '근무중' : member.memberStatus === 'ON_LEAVE' ? '휴가' : member.memberStatus === 'SICK_LEAVE' ? '병가' : '작업 시작전'),
          joinDate: formatDateToString(member.memberCreatedAt),
          avatar: getMemberProfileUrl(member.memberProfileImage) || null,
        }));

        setEmployees(mappedEmployees);
      } catch (error) {
        console.error('직원 목록 조회 실패:', error);
        toast.error('직원 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [user?.agencyNo]);

  // 에이전시 소속 근태 신청 목록 조회 (직원별 필터링용)
  useEffect(() => {
    const fetchAgencyLeaveRequests = async () => {
      if (!user?.agencyNo) return;
      try {
        const list = await leaveService.getAgencyRequests(user.agencyNo);
        setAgencyLeaveRequests(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('에이전시 근태 신청 목록 조회 실패:', err);
        setAgencyLeaveRequests([]);
      }
    };
    fetchAgencyLeaveRequests();
  }, [user?.agencyNo]);

  const getStatusColor = (status) => {
    switch (status) {
      case '근무중':
        return 'bg-green-500';
      case '작업 종료':
        return 'bg-slate-500';
      case '작업 시작전':
        return 'bg-gray-400';
      case '휴가':
        return 'bg-yellow-500';
      case '병가':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case '담당자':
        return 'bg-blue-100 text-blue-700';
      case '작가':
        return 'bg-purple-100 text-purple-700';
      case '어시스트':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // 역할 필터 토글 핸들러
  const handleRoleToggle = (role) => {
    if (role === '전체') {
      setSelectedRoles(['전체']);
      return;
    }

    const otherRoles = ['담당자', '작가', '어시스트'];
    let newSelectedRoles = [...selectedRoles.filter(r => r !== '전체')];

    if (newSelectedRoles.includes(role)) {
      newSelectedRoles = newSelectedRoles.filter(r => r !== role);
    } else {
      newSelectedRoles.push(role);
    }

    // 세 가지 역할이 모두 선택되면 '전체'로 변경
    if (newSelectedRoles.length === 3) {
      setSelectedRoles(['전체']);
    } else if (newSelectedRoles.length === 0) {
      setSelectedRoles(['전체']);
    } else {
      setSelectedRoles(newSelectedRoles);
    }
  };

  // 직원 추가 핸들러
  const handleAddEmployee = () => {
    if (!newEmployee.email) {
      toast.error('이메일은 필수 입력 항목입니다.');
      return;
    }

    const employee = {
      id: employees.length + 1,
      name: '새 직원',
      role: '담당자',
      position: '',
      email: newEmployee.email,
      phone: '',
      status: '근무중',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: null,
      currentProjects: [],
      participatedProjects: [],
      managedArtists: [],
      healthCheck: {
        date: new Date().toISOString().split('T')[0],
        condition: '보통',
        sleepHours: 0,
        discomfortLevel: 0,
        memo: ''
      }
    };

    setEmployees([...employees, employee]);
    setNewEmployee({
      email: '',
    });
    setIsAddModalOpen(false);
    toast.success(`${employee.name}님을 초대했습니다.`);
  };

  // 직원 수정 핸들러
  const handleEditEmployee = () => {
    if (!editingEmployee) return;

    setEmployees(employees.map(emp => 
      emp.id === editingEmployee.id ? editingEmployee : emp
    ));
    setIsEditModalOpen(false);
    setEditingEmployee(null);
    toast.success('직원 정보가 수정되었습니다.');
  };

  // 삭제 확인 모달 열기
  const handleDeleteClick = (employee, event) => {
    // 이벤트 전파 방지 (카드 클릭 이벤트와 충돌 방지)
    if (event) {
      event.stopPropagation();
    }
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const openPortfolioModal = (memberNo, e) => {
    if (e) e.stopPropagation();
    setPortfolioModalMemberNo(memberNo);
    setPortfolioModalData(null);
    setPortfolioModalLoading(true);
    portfolioService
      .getByMemberNo(memberNo)
      .then((res) => {
        const data = res?.data ?? res;
        if (!data || data.portfolioStatus === 'N' || data.portfolioNo == null) {
          setPortfolioModalData(null);
          return;
        }
        setPortfolioModalData(data);
      })
      .catch(() => setPortfolioModalData(null))
      .finally(() => setPortfolioModalLoading(false));
  };

  // 직원 삭제 핸들러 (에이전시에서 제거 - agencyNo를 null로 설정)
  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    try {
      // API 호출하여 agencyNo를 null로 설정 (회원은 삭제하지 않음)
      await memberService.removeFromAgency(employeeToDelete.id);
      // 로컬 상태에서도 제거
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      // 상태 초기화
      setIsEditModalOpen(false);
      setEditingEmployee(null);
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
      toast.success('직원이 에이전시에서 제거되었습니다.');
    } catch (error) {
      console.error('직원 제거 실패:', error);
      const errorMessage = error?.message || '직원 제거에 실패했습니다.';
      toast.error(errorMessage);
    }
  };

  // 접이식 토글 핸들러 - 직원 클릭 시 상세 정보 로드
  const toggleEmployee = async (employeeId) => {
    const newExpanded = new Set(expandedEmployees);
    const isExpanding = !newExpanded.has(employeeId);
    
    if (isExpanding) {
      newExpanded.add(employeeId);
      // 상세 정보가 없으면 API 호출
      if (!employeeDetails[employeeId]) {
        await fetchEmployeeDetails(employeeId);
      }
    } else {
      newExpanded.delete(employeeId);
    }
    setExpandedEmployees(newExpanded);
  };

  // 직원 상세 정보 가져오기 (데일리 설문, 근태 통계 포함)
  const fetchEmployeeDetails = async (employeeId) => {
    if (loadingDetails.has(employeeId)) return;
    
    setLoadingDetails(prev => new Set(prev).add(employeeId));
    try {
      const [memberResponse, statsResponse] = await Promise.all([
        memberService.getMemberDetails(employeeId),
        (async () => {
          try {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            return await attendanceService.getStatistics(employeeId, year, month);
          } catch {
            return null;
          }
        })(),
      ]);
      
      const data = Array.isArray(memberResponse) ? memberResponse[0] : memberResponse;
      
      // 근태 통계 데이터 변환 (파이 차트용)
      let attendanceStats = null;
      if (statsResponse?.typeCounts?.length) {
        attendanceStats = {
          data: statsResponse.typeCounts.map((item) => ({
            name: item.type,
            value: Number(item.count),
            color: ATTENDANCE_TYPE_COLORS[item.type] || '#6E8FB3',
          })),
          totalDays: statsResponse.totalCount || 0,
        };
      }
      
      const details = {
        currentProjects: data?.currentProjects || [],
        participatedProjects: data?.participatedProjects || [],
        myWorks: data?.myWorks || [],
        serializingWorks: data?.serializingWorks || [],
        managedArtists: data?.managedArtists || [],
        healthCheck: data?.healthCheck ? {
          date: data.healthCheck.date || new Date().toISOString().split('T')[0],
          condition: data.healthCheck.condition || '보통',
          sleepHours: data.healthCheck.sleepHours || 0,
          discomfortLevel: data.healthCheck.discomfortLevel || 0,
          memo: data.healthCheck.memo || '',
        } : null,
        attendanceStats,
      };
      
      setEmployeeDetails(prev => ({
        ...prev,
        [employeeId]: details,
      }));
    } catch (error) {
      console.error('직원 상세 정보 조회 실패:', error);
      toast.error('직원 상세 정보를 불러오는데 실패했습니다.');
      setEmployeeDetails(prev => ({
        ...prev,
        [employeeId]: {
          currentProjects: [],
          participatedProjects: [],
          myWorks: [],
          serializingWorks: [],
          managedArtists: [],
          healthCheck: null,
          attendanceStats: null,
        },
      }));
    } finally {
      setLoadingDetails(prev => {
        const next = new Set(prev);
        next.delete(employeeId);
        return next;
      });
    }
  };

  // 담당자의 담당 작가 정보 가져오기 (DB에서 가져온 데이터 사용)
  const getManagedArtists = (managerId) => {
    const details = employeeDetails[managerId];
    if (!details || !details.managedArtists) return [];
    // API에서 받은 ManagedArtistInfo를 컴포넌트 형식으로 변환
    return details.managedArtists.map(artist => ({
      id: artist.id,
      name: artist.name,
      role: artist.role,
      position: artist.position || artist.role,
      email: artist.email,
      phone: artist.phone,
    }));
  };

  // 담당자의 담당 작가의 연재중인 작품 가져오기
  const getManagedArtistsSerializingWorks = (managerId) => {
    const managedArtists = getManagedArtists(managerId);
    const works = [];
    managedArtists.forEach(artist => {
      const artistDetails = employeeDetails[artist.id];
      if (artistDetails && artistDetails.serializingWorks) {
        works.push(...artistDetails.serializingWorks);
      }
    });
    return [...new Set(works)]; // 중복 제거
  };

  // 직원의 상세 정보 가져오기 (캐시된 데이터 또는 기본값)
  const getEmployeeDetails = (employeeId) => {
    return employeeDetails[employeeId] || {
      currentProjects: [],
      participatedProjects: [],
      myWorks: [],
      serializingWorks: [],
      managedArtists: [],
      healthCheck: null,
      attendanceStats: null,
    };
  };

  // 해당 직원의 근태 신청 목록 (에이전시 목록에서 필터링)
  const getEmployeeLeaveRequests = (employeeId) => {
    return agencyLeaveRequests.filter((r) => Number(r.memberNo) === Number(employeeId));
  };

  // 직원 목록 로드 시 프로젝트 개수 등 상세 정보 사전 로드 (참여 중인 프로젝트 정확 표시)
  useEffect(() => {
    if (!employees.length || !user?.agencyNo) return;
    const ids = employees
      .filter((emp) => emp.role !== '에이전시 관리자' && emp.role !== '관리자')
      .map((emp) => emp.id);
    ids.forEach((id) => {
      if (!employeeDetails[id]) {
        fetchEmployeeDetails(id);
      }
    });
  }, [employees, user?.agencyNo]);

  // 역할을 필터 카테고리로 매핑하는 함수
  const mapRoleToFilterCategory = (role) => {
    if (!role) return '';
    
    // 작가 관련 역할들을 "작가"로 매핑
    if (role.includes('작가')) {
      return '작가';
    }
    // 어시스트 관련 역할들을 "어시스트"로 매핑
    if (role.includes('어시스트')) {
      return '어시스트';
    }
    // 그 외는 그대로 반환
    return role;
  };

  // Filter employees by search query and role
  const filteredEmployees = employees.filter(employee => {
    // 에이전시 관리자는 전체 직원 목록에서 제외
    if (employee.role === '에이전시 관리자' || employee.role === '관리자') {
      return false;
    }

    const matchesSearch = 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase());

    // 역할을 필터 카테고리로 매핑하여 비교
    const roleCategory = mapRoleToFilterCategory(employee.role);
    const matchesRole = 
      selectedRoles.includes('전체') ||
      selectedRoles.includes(roleCategory) ||
      selectedRoles.includes(employee.role); // 정확한 역할명도 체크 (호환성)

    return matchesSearch && matchesRole;
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  // 검색어나 필터가 변경되면 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRoles]);

  return (
    <AgencyTeamRoot>
      <AgencyTeamBody>
        {/* Header */}
        <HeaderSection>
          <div>
            <HeaderTitle>전체 직원</HeaderTitle>
            <HeaderSubtitle>
              에이전시 소속 직원 {employees.length}명
            </HeaderSubtitle>
          </div>
          <HeaderActions>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              직원 추가
            </Button>
          </HeaderActions>
        </HeaderSection>

        {/* Role Filter */}
        <FilterButtonGroup>
          {ROLE_FILTERS.map((role) => (
            <Button
              key={role}
              variant={selectedRoles.includes(role) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRoleToggle(role)}
              className="transition-all"
            >
              {role}
            </Button>
          ))}
        </FilterButtonGroup>

        {/* Search Bar */}
        <SearchBarContainer>
          <SearchIcon>
            <Search className="w-4 h-4 text-muted-foreground" />
          </SearchIcon>
          <Input
            type="text"
            placeholder="이름, 이메일 또는 직급으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </SearchBarContainer>

        {/* Employee List Cards */}
        {isLoading ? (
          <Card className="p-12 text-center">
            <EmptyStateText>직원 목록을 불러오는 중...</EmptyStateText>
          </Card>
        ) : filteredEmployees.length === 0 ? (
          <Card className="p-12 text-center">
            <EmptyStateText>
              {employees.length === 0 
                ? '등록된 직원이 없습니다. "직원 추가" 버튼을 눌러 직원을 추가해주세요.' 
                : searchQuery || (selectedRoles.length > 0 && !selectedRoles.includes('전체'))
                  ? '검색 결과가 없습니다'
                  : '등록된 직원이 없습니다. "직원 추가" 버튼을 눌러 직원을 추가해주세요.'}
            </EmptyStateText>
          </Card>
        ) : (
          <>
            <EmployeeListContainer>
              {paginatedEmployees.map((employee) => {
            const isExpanded = expandedEmployees.has(employee.id);
            return (
              <div key={employee.id}>
                <EmployeeCard onClick={() => toggleEmployee(employee.id)}>
                  <EmployeeCardContent>
                    <EmployeeAvatar>
                      {employee.avatar ? (
                        <EmployeeAvatarImg
                          src={employee.avatar}
                          alt={employee.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <EmployeeAvatarFallback $visible={!employee.avatar}>
                        <Users className="w-7 h-7 text-primary" />
                      </EmployeeAvatarFallback>
                    </EmployeeAvatar>
                    <EmployeeInfo>
                      <EmployeeNameRow>
                        <EmployeeName>{employee.name}</EmployeeName>
                        <Badge className={getRoleColor(employee.role)}>
                          {employee.role}
                        </Badge>
                        {employee.position && employee.position !== employee.role && (
                          <Badge variant="outline">
                            {employee.position}
                          </Badge>
                        )}
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status}
                        </Badge>
                      </EmployeeNameRow>
                      <EmployeeContactInfo>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{employee.phone}</span>
                        </div>
                      </EmployeeContactInfo>
                    </EmployeeInfo>
                    <CardActionsColumn>
                      <ProjectsInfoRow
                        ref={(el) => {
                          projectContainerRefs.current[employee.id] = el;
                        }}
                      >
                        <EmployeeStats>
                          <p className="text-xs text-muted-foreground mb-0">참여 중인 프로젝트</p>
                          <p className="text-lg font-semibold text-foreground mb-0">
                            {loadingDetails.has(employee.id) 
                              ? '...' 
                              : (getEmployeeDetails(employee.id).currentProjects?.length || 0) + '개'}
                          </p>
                        </EmployeeStats>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </ProjectsInfoRow>
                      <Button
                        data-employee-id={employee.id}
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(employee, e); }}
                        className="bg-destructive hover:bg-destructive/90 text-white h-8 px-3 text-sm font-medium shrink-0"
                        title="직원 삭제"
                      >
                        삭제
                      </Button>
                    </CardActionsColumn>
                  </EmployeeCardContent>
                </EmployeeCard>
                
                {/* 접이식 내용: 데일리 설문, 근태 신청 리스트, 근태 통계 그래프 (담당자 직원관리와 동일) */}
                {isExpanded && (
                  <ExpandedCard>
                    {loadingDetails.has(employee.id) ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">상세 정보를 불러오는 중...</p>
                      </div>
                    ) : (
                      <>
                        {/* 공통: 데일리 설문(건강 체크), 근태 신청 리스트, 근태 통계 그래프 */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 pb-6 border-b border-border">
                          {/* 1. 데일리 설문 내용 */}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                              <Heart className="w-4 h-4 text-primary" />
                              <h3 className="text-base font-semibold text-foreground">데일리 설문 (건강 체크)</h3>
                            </div>
                            {getEmployeeDetails(employee.id).healthCheck ? (
                              <Card className="p-4 bg-white border border-border min-h-[220px] flex-1 flex flex-col">
                                <div className="space-y-0">
                                  <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-sm text-muted-foreground">오늘 컨디션</span>
                                    <span className="text-sm font-medium">{getEmployeeDetails(employee.id).healthCheck?.condition || '-'}</span>
                                  </div>
                                  <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-sm text-muted-foreground">수면 시간</span>
                                    <span className="text-sm font-medium">{getEmployeeDetails(employee.id).healthCheck?.sleepHours ?? 0}시간</span>
                                  </div>
                                  <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-sm text-muted-foreground">신체 불편함</span>
                                    <span className="text-sm font-medium">{getEmployeeDetails(employee.id).healthCheck?.discomfortLevel ?? 0}</span>
                                  </div>
                                  {getEmployeeDetails(employee.id).healthCheck?.memo && (
                                    <div className="pt-3 mt-3 border-t border-border">
                                      <p className="text-xs text-muted-foreground mb-2">메모</p>
                                      <div className="p-3 bg-muted/30 rounded-lg">
                                        <p className="text-sm">{getEmployeeDetails(employee.id).healthCheck.memo}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </Card>
                            ) : (
                              <Card className="p-4 border border-border flex-1 flex flex-col min-h-[220px]">
                                <div className="text-center py-6 text-sm text-muted-foreground flex-1 flex items-center justify-center">오늘 체크하지 않았습니다</div>
                              </Card>
                            )}
                          </div>

                          {/* 2. 근태 신청 리스트 */}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                              <CalendarClock className="w-4 h-4 text-primary" />
                              <h3 className="text-base font-semibold text-foreground">근태 신청 리스트</h3>
                            </div>
                            <Card className="p-4 border border-border flex-1 flex flex-col min-h-[220px]">
                              {getEmployeeLeaveRequests(employee.id).length > 0 ? (
                                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                                  {getEmployeeLeaveRequests(employee.id)
                                    .filter((r) => r.attendanceRequestStatus !== 'CANCELLED')
                                    .map((req) => {
                                      const statusMap = REQUEST_STATUS_MAP[req.attendanceRequestStatus] || { label: req.attendanceRequestStatus, color: '#6B7280' };
                                      return (
                                        <div key={req.attendanceRequestNo} className="p-2 bg-muted/30 rounded-lg border border-border">
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">{req.attendanceRequestType || '-'}</span>
                                            <Badge style={{ backgroundColor: statusMap.color, color: '#fff', fontSize: '10px' }}>{statusMap.label}</Badge>
                                          </div>
                                          <p className="text-xs text-muted-foreground mt-1">{formatReqDate(req.attendanceRequestStartDate)} ~ {formatReqDate(req.attendanceRequestEndDate)}</p>
                                        </div>
                                      );
                                    })}
                                </div>
                              ) : (
                                <div className="text-center py-6 text-sm text-muted-foreground flex-1 flex items-center justify-center">근태 신청 내역이 없습니다</div>
                              )}
                            </Card>
                          </div>

                          {/* 3. 근태 통계 그래프 */}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                              <Briefcase className="w-4 h-4 text-primary" />
                              <h3 className="text-base font-semibold text-foreground">근태 통계</h3>
                            </div>
                            <Card className="p-4 border border-border flex-1 flex flex-col min-h-[220px]">
                              {getEmployeeDetails(employee.id).attendanceStats?.data?.length > 0 ? (
                                <div className="flex items-center gap-4 flex-1 min-h-[180px]">
                                  <div className="w-[140px] h-[140px] flex-shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <Pie
                                          data={getEmployeeDetails(employee.id).attendanceStats.data}
                                          cx="50%"
                                          cy="50%"
                                          innerRadius={30}
                                          outerRadius={50}
                                          paddingAngle={2}
                                          dataKey="value"
                                        >
                                          {getEmployeeDetails(employee.id).attendanceStats.data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                          ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value}일`, '']} />
                                      </PieChart>
                                    </ResponsiveContainer>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-2xl font-bold text-foreground">{getEmployeeDetails(employee.id).attendanceStats.totalDays}<span className="text-sm font-normal text-muted-foreground ml-1">일</span></p>
                                    <p className="text-xs text-muted-foreground">이번 달 출근</p>
                                    <div className="mt-2 space-y-1">
                                      {getEmployeeDetails(employee.id).attendanceStats.data.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs">
                                          <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
                                          <span>{item.name} {item.value}일</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-6 text-sm text-muted-foreground flex-1 flex items-center justify-center">근태 통계 데이터가 없습니다</div>
                              )}
                            </Card>
                          </div>
                        </div>
                        <div className="flex justify-end pt-2">
                          <Button variant="outline" size="sm" className="gap-2" onClick={(e) => openPortfolioModal(employee.id, e)}>
                            <FileText className="w-4 h-4" />
                            포트폴리오
                          </Button>
                        </div>
                      </>
                    )}
                  </ExpandedCard>
                )}
              </div>
            );
          })}
            </EmployeeListContainer>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </AgencyTeamBody>

      {/* 직원 추가 모달 */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>새 직원 초대</DialogTitle>
            <DialogDescription>
              이메일을 통해 새로운 직원을 초대합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일 *</Label>
              <Input
                id="email"
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                placeholder="example@agency.com"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddEmployee}>
              초대 보내기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 포트폴리오 모달 (아티스트 포트폴리오 페이지와 동일한 디자인 + 프로필 이미지) */}
      <Dialog open={portfolioModalMemberNo !== null} onOpenChange={(open) => !open && setPortfolioModalMemberNo(null)}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              포트폴리오
            </DialogTitle>
          </DialogHeader>
          {portfolioModalLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : portfolioModalData && portfolioModalData.portfolioNo && portfolioModalData.portfolioStatus !== 'N' ? (
            <div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              {(portfolioModalData.profileImage || portfolioModalData.portfolioUserName) && (
                <div className="flex items-center gap-4">
                  <img
                    src={getMemberProfileUrl(portfolioModalData.profileImage) ?? MEMBER_AVATAR_PLACEHOLDER}
                    alt="프로필"
                    className="w-16 h-16 rounded-full object-cover border border-border shrink-0"
                  />
                  {portfolioModalData.portfolioUserName && (
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-muted-foreground shrink-0" />
                      <span className="font-medium">이름</span>
                      <span>{portfolioModalData.portfolioUserName}</span>
                    </div>
                  )}
                </div>
              )}
              {portfolioModalData.portfolioUserEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">이메일</span>
                  <span>{portfolioModalData.portfolioUserEmail}</span>
                </div>
              )}
              {portfolioModalData.portfolioUserPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">전화</span>
                  <span>{portfolioModalData.portfolioUserPhone}</span>
                </div>
              )}
              {portfolioModalData.portfolioUserCareer && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">경력</span>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-3 rounded">{portfolioModalData.portfolioUserCareer}</pre>
                </div>
              )}
              {portfolioModalData.portfolioUserProject && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FolderOpen className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">참여 프로젝트</span>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-3 rounded">{portfolioModalData.portfolioUserProject}</pre>
                </div>
              )}
              {portfolioModalData.portfolioUserSkill && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">스킬</span>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-3 rounded">{portfolioModalData.portfolioUserSkill}</pre>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-6 text-center">등록된 포트폴리오가 없습니다.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* 작가 프로필 모달 */}
      <Dialog open={selectedArtist !== null} onOpenChange={(open) => !open && setSelectedArtist(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedArtist && (
            <div className="space-y-6">
              {/* 프로필 헤더 */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-12 h-12 text-primary" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground">{selectedArtist.name}</h2>
                </div>
              </div>

              {/* 상세 정보 */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">직무</p>
                    <p className="text-sm font-medium text-foreground">{selectedArtist.position || selectedArtist.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">이메일</p>
                    <p className="text-sm font-medium text-foreground">{selectedArtist.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">전화번호</p>
                    <p className="text-sm font-medium text-foreground">{selectedArtist.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 직원 편집 모달 */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>직원 정보 수정</DialogTitle>
            <DialogDescription>
              직원 정보를 수정하거나 삭제할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          {editingEmployee && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">이름</Label>
                <Input
                  id="edit-name"
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">직책</Label>
                <select
                  id="edit-role"
                  value={editingEmployee.role}
                  onChange={(e) => setEditingEmployee({...editingEmployee, role: e.target.value})}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="담당자">담당자</option>
                  <option value="작가">작가</option>
                  <option value="어시스트">어시스트</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-position">직급</Label>
                <Input
                  id="edit-position"
                  value={editingEmployee.position || ''}
                  onChange={(e) => setEditingEmployee({...editingEmployee, position: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">이메일</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingEmployee.email}
                  onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">전화번호</Label>
                <Input
                  id="edit-phone"
                  value={editingEmployee.phone}
                  onChange={(e) => setEditingEmployee({...editingEmployee, phone: e.target.value})}
                />
              </div>
            </div>
          )}
          <div className="flex gap-2 justify-between">
            <Button
              variant="destructive"
              onClick={() => {
                if (editingEmployee) {
                  setEmployeeToDelete(editingEmployee);
                  setIsEditModalOpen(false);
                  setIsDeleteModalOpen(true);
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              삭제
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                취소
              </Button>
              <Button onClick={handleEditEmployee}>
                저장
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 모달 */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>에이전시에서 제거</DialogTitle>
            <DialogDescription>
              {employeeToDelete && (
                <>
                  <strong>{employeeToDelete.name}</strong>님을 에이전시에서 제거하시겠습니까?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteModalOpen(false);
                setEmployeeToDelete(null);
              }}
            >
              취소
            </Button>
            <Button 
              onClick={handleDeleteEmployee}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              제거
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AgencyTeamRoot>
  );
}
