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
  Heart
} from 'lucide-react';

// 내부 alias (@/)
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/app/components/ui/pagination';
import { memberService } from '@/api';
import useAuthStore from '@/store/authStore';

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

export function AgencyTeamPage() {
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEmployees, setExpandedEmployees] = useState(new Set());
  const [selectedRoles, setSelectedRoles] = useState(['전체']);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({}); // 직원별 상세 정보 캐시
  const [loadingDetails, setLoadingDetails] = useState(new Set()); // 로딩 중인 직원 ID
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const projectContainerRefs = useRef({}); // 참여 중인 프로젝트 컨테이너 refs
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 한 페이지에 표시할 직원 수

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
          joinDate: member.memberCreatedAt ? new Date(member.memberCreatedAt).toISOString().split('T')[0] : '',
          avatar: member.memberProfileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
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
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
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

  // 직원 상세 정보 가져오기
  const fetchEmployeeDetails = async (employeeId) => {
    if (loadingDetails.has(employeeId)) return;
    
    setLoadingDetails(prev => new Set(prev).add(employeeId));
    try {
      const response = await memberService.getMemberDetails(employeeId);
      const data = Array.isArray(response) ? response[0] : response;
      
      // API 응답을 컴포넌트 형식으로 변환
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
      };
      
      setEmployeeDetails(prev => ({
        ...prev,
        [employeeId]: details,
      }));
    } catch (error) {
      console.error('직원 상세 정보 조회 실패:', error);
      toast.error('직원 상세 정보를 불러오는데 실패했습니다.');
      // 에러 시 빈 데이터 설정
      setEmployeeDetails(prev => ({
        ...prev,
        [employeeId]: {
          currentProjects: [],
          participatedProjects: [],
          myWorks: [],
          serializingWorks: [],
          managedArtists: [],
          healthCheck: null,
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
    };
  };

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
                <EmployeeCard>
                  <EmployeeCardContent>
                    <EmployeeAvatar>
                      <Users className="w-7 h-7 text-primary" />
                    </EmployeeAvatar>
                    <EmployeeInfo>
                      <EmployeeNameRow>
                        <EmployeeName>{employee.name}</EmployeeName>
                        <Badge className={getRoleColor(employee.role)} style={{ fontSize: '11px' }}>
                          {employee.role}
                        </Badge>
                        {employee.position && employee.position !== employee.role && (
                          <Badge variant="outline" style={{ fontSize: '10px' }}>
                            {employee.position}
                          </Badge>
                        )}
                        <Badge className={getStatusColor(employee.status)} style={{ fontSize: '10px' }}>
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      {/* 참여 중인 프로젝트와 화살표를 하나로 묶기 */}
                      <div 
                        ref={(el) => {
                          projectContainerRefs.current[employee.id] = el;
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0px', cursor: 'pointer', height: 'fit-content' }} 
                        onClick={() => toggleEmployee(employee.id)}
                      >
                        <EmployeeStats style={{ display: 'flex', alignItems: 'center', gap: '8px', height: 'fit-content', lineHeight: '1.2' }}>
                          <p className="text-xs text-muted-foreground mb-0" style={{ lineHeight: '1.2' }}>참여 중인 프로젝트</p>
                          <p className="text-lg font-semibold text-foreground mb-0" style={{ lineHeight: '1.2' }}>
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
                      </div>
                      {/* 삭제 버튼 */}
                      <Button
                        data-employee-id={employee.id}
                        onClick={(e) => handleDeleteClick(employee, e)}
                        className="bg-destructive hover:bg-destructive/90 text-white h-8 px-3 text-sm font-medium"
                        style={{ width: '60px', minWidth: '60px' }}
                        title="직원 삭제"
                      >
                        삭제
                      </Button>
                    </div>
                  </EmployeeCardContent>
                </EmployeeCard>
                
                {/* 접이식 내용 */}
                {isExpanded && (
                  <Card className="mt-0 p-6 bg-white border-t-0 rounded-t-none" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: '-1px' }}>
                    {loadingDetails.has(employee.id) ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">상세 정보를 불러오는 중...</p>
                      </div>
                    ) : (
                      <>
                        {employee.role === '작가' || employee.role?.includes('작가') && (
                          <div className="grid grid-cols-2 gap-6">
                            {/* 왼쪽: 작가와 연재중인 작품 */}
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <BookOpen className="w-4 h-4 text-primary" />
                                  <h3 className="text-base font-semibold text-foreground">내 작품</h3>
                                </div>
                                <div className="space-y-2">
                                  {(getEmployeeDetails(employee.id).myWorks || []).map((work, index) => (
                                    <div key={index} className="p-2 bg-muted/30 rounded-lg border border-border">
                                      <span className="text-sm font-medium text-foreground">{work}</span>
                                    </div>
                                  ))}
                                  {(!getEmployeeDetails(employee.id).myWorks || getEmployeeDetails(employee.id).myWorks.length === 0) && (
                                    <p className="text-sm text-muted-foreground">작품이 없습니다</p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Briefcase className="w-4 h-4 text-primary" />
                                  <h3 className="text-base font-semibold text-foreground">연재중인 작품</h3>
                                </div>
                                <div className="space-y-2">
                                  {(getEmployeeDetails(employee.id).serializingWorks || []).map((work, index) => (
                                    <div key={index} className="p-2 bg-muted/30 rounded-lg border border-border">
                                      <span className="text-sm font-medium text-foreground">{work}</span>
                                    </div>
                                  ))}
                                  {(!getEmployeeDetails(employee.id).serializingWorks || getEmployeeDetails(employee.id).serializingWorks.length === 0) && (
                                    <p className="text-sm text-muted-foreground">연재중인 작품이 없습니다</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* 오른쪽: 건강검진 결과 */}
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Heart className="w-4 h-4 text-primary" />
                              <h3 className="text-base font-semibold text-foreground">
                                건강 체크 결과
                              </h3>
                            </div>
                            {getEmployeeDetails(employee.id).healthCheck ? (
                              <Card className="p-4 bg-white border border-border">
                                <div className="space-y-0">
                                  <div className="flex items-center justify-between py-2 border-b border-border">
                                    <span className="text-sm text-muted-foreground">오늘 컨디션</span>
                                    <span className="text-sm font-medium text-foreground">{getEmployeeDetails(employee.id).healthCheck?.condition || '-'}</span>
                                  </div>
                                  <div className="flex items-center justify-between py-2 border-b border-border">
                                    <span className="text-sm text-muted-foreground">수면 시간</span>
                                    <span className="text-sm font-medium text-foreground">{getEmployeeDetails(employee.id).healthCheck?.sleepHours || 0}시간</span>
                                  </div>
                                  <div className="flex items-center justify-between py-2">
                                    <span className="text-sm text-muted-foreground">신체 불편함</span>
                                    <span className="text-sm font-medium text-foreground">{getEmployeeDetails(employee.id).healthCheck?.discomfortLevel || 0}</span>
                                  </div>
                                  {getEmployeeDetails(employee.id).healthCheck?.memo && (
                                    <div className="pt-3 mt-3 border-t border-border">
                                      <p className="text-xs text-muted-foreground mb-2">메모</p>
                                      <div className="p-3 bg-muted/30 rounded-lg">
                                        <p className="text-sm text-foreground">{getEmployeeDetails(employee.id).healthCheck.memo}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </Card>
                            ) : (
                              <Card className="p-4 bg-white border border-border">
                                <div className="text-center py-8">
                                  <p className="text-sm text-muted-foreground">검진을 하지 않았습니다</p>
                                </div>
                              </Card>
                            )}
                          </div>
                      </div>
                    )}

                    {employee.role === '담당자' && (
                      <div className="grid grid-cols-2 gap-6">
                        {/* 왼쪽: 담당 작가와 연재중인 작품 */}
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Users className="w-4 h-4 text-primary" />
                              <h3 className="text-base font-semibold text-foreground">담당 작가</h3>
                            </div>
                            <div className="space-y-0 divide-y divide-border border border-border rounded-lg overflow-hidden">
                              {getManagedArtists(employee.id).map((artist) => (
                                <div 
                                  key={artist.id} 
                                  onClick={() => setSelectedArtist(artist)}
                                  className="p-3 bg-white hover:bg-muted/30 transition-colors cursor-pointer"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                      <Users className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-foreground">{artist.name}</p>
                                      <p className="text-xs text-muted-foreground">{artist.position || artist.role}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {getManagedArtists(employee.id).length === 0 && (
                                <div className="p-3">
                                  <p className="text-sm text-muted-foreground">담당 작가가 없습니다</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Briefcase className="w-4 h-4 text-primary" />
                              <h3 className="text-base font-semibold text-foreground">담당 작가의 연재중인 작품</h3>
                            </div>
                            <div className="space-y-2">
                              {getManagedArtistsSerializingWorks(employee.id).map((work, index) => (
                                <div key={index} className="p-2 bg-muted/30 rounded-lg border border-border">
                                  <span className="text-sm font-medium text-foreground">{work}</span>
                                </div>
                              ))}
                              {getManagedArtistsSerializingWorks(employee.id).length === 0 && (
                                <p className="text-sm text-muted-foreground">연재중인 작품이 없습니다</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 오른쪽: 건강검진 결과 */}
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Heart className="w-4 h-4 text-primary" />
                              <h3 className="text-base font-semibold text-foreground">
                                건강 체크 결과
                              </h3>
                            </div>
                            {getEmployeeDetails(employee.id).healthCheck ? (
                              <Card className="p-4 bg-white border border-border">
                                <div className="space-y-0">
                                  <div className="flex items-center justify-between py-2 border-b border-border">
                                    <span className="text-sm text-muted-foreground">오늘 컨디션</span>
                                    <span className="text-sm font-medium text-foreground">{getEmployeeDetails(employee.id).healthCheck.condition}</span>
                                  </div>
                                  <div className="flex items-center justify-between py-2 border-b border-border">
                                    <span className="text-sm text-muted-foreground">수면 시간</span>
                                    <span className="text-sm font-medium text-foreground">{getEmployeeDetails(employee.id).healthCheck.sleepHours}시간</span>
                                  </div>
                                  <div className="flex items-center justify-between py-2">
                                    <span className="text-sm text-muted-foreground">신체 불편함</span>
                                    <span className="text-sm font-medium text-foreground">{getEmployeeDetails(employee.id).healthCheck.discomfortLevel}</span>
                                  </div>
                                  {getEmployeeDetails(employee.id).healthCheck.memo && (
                                    <div className="pt-3 mt-3 border-t border-border">
                                      <p className="text-xs text-muted-foreground mb-2">메모</p>
                                      <div className="p-3 bg-muted/30 rounded-lg">
                                        <p className="text-sm text-foreground">{getEmployeeDetails(employee.id).healthCheck.memo}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </Card>
                            ) : (
                              <Card className="p-4 bg-white border border-border">
                                <div className="text-center py-8">
                                  <p className="text-sm text-muted-foreground">검진을 하지 않았습니다</p>
                                </div>
                              </Card>
                            )}
                          </div>
                      </div>
                    )}

                    {employee.role?.includes('어시스트') && (
                      <div className="grid grid-cols-2 gap-6">
                        {/* 왼쪽: 참여중인 작품 */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Briefcase className="w-4 h-4 text-primary" />
                            <h3 className="text-base font-semibold text-foreground">참여중인 작품</h3>
                          </div>
                          <div className="space-y-2">
                            {(getEmployeeDetails(employee.id).currentProjects || []).map((project, index) => (
                              <div key={index} className="p-2 bg-muted/30 rounded-lg border border-border">
                                <span className="text-sm font-medium text-foreground">{project}</span>
                              </div>
                            ))}
                            {(!getEmployeeDetails(employee.id).currentProjects || getEmployeeDetails(employee.id).currentProjects.length === 0) && (
                              <p className="text-sm text-muted-foreground">참여중인 작품이 없습니다</p>
                            )}
                          </div>
                        </div>

                            {/* 오른쪽: 건강검진 결과 */}
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Heart className="w-4 h-4 text-primary" />
                                  <h3 className="text-base font-semibold text-foreground">
                                    건강 체크 결과
                                  </h3>
                                </div>
                                {getEmployeeDetails(employee.id).healthCheck ? (
                                  <Card className="p-4 bg-white border border-border">
                                    <div className="space-y-0">
                                      <div className="flex items-center justify-between py-2 border-b border-border">
                                        <span className="text-sm text-muted-foreground">오늘 컨디션</span>
                                        <span className="text-sm font-medium text-foreground">{getEmployeeDetails(employee.id).healthCheck.condition}</span>
                                      </div>
                                      <div className="flex items-center justify-between py-2 border-b border-border">
                                        <span className="text-sm text-muted-foreground">수면 시간</span>
                                        <span className="text-sm font-medium text-foreground">{getEmployeeDetails(employee.id).healthCheck.sleepHours}시간</span>
                                      </div>
                                      <div className="flex items-center justify-between py-2">
                                        <span className="text-sm text-muted-foreground">신체 불편함</span>
                                        <span className="text-sm font-medium text-foreground">{getEmployeeDetails(employee.id).healthCheck.discomfortLevel}</span>
                                      </div>
                                      {getEmployeeDetails(employee.id).healthCheck.memo && (
                                        <div className="pt-3 mt-3 border-t border-border">
                                          <p className="text-xs text-muted-foreground mb-2">메모</p>
                                          <div className="p-3 bg-muted/30 rounded-lg">
                                            <p className="text-sm text-foreground">{getEmployeeDetails(employee.id).healthCheck.memo}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </Card>
                                ) : (
                                  <Card className="p-4 bg-white border border-border">
                                    <div className="text-center py-8">
                                      <p className="text-sm text-muted-foreground">검진을 하지 않았습니다</p>
                                    </div>
                                  </Card>
                                )}
                              </div>
                          </div>
                        )}

                        {/* 역할이 매칭되지 않을 때 기본 정보 표시 (작가/담당자/어시스트 제외) */}
                        {employee.role !== '작가' && !employee.role?.includes('작가') && employee.role !== '담당자' && !employee.role?.includes('어시스트') && (
                          <div className="grid grid-cols-2 gap-6">
                            {/* 왼쪽: 참여중인 프로젝트 */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Briefcase className="w-4 h-4 text-primary" />
                                <h3 className="text-base font-semibold text-foreground">참여중인 프로젝트</h3>
                              </div>
                              <div className="space-y-2">
                                {(getEmployeeDetails(employee.id).currentProjects || []).map((project, index) => (
                                  <div key={index} className="p-2 bg-muted/30 rounded-lg border border-border">
                                    <span className="text-sm font-medium text-foreground">{project}</span>
                                  </div>
                                ))}
                                {(!getEmployeeDetails(employee.id).currentProjects || getEmployeeDetails(employee.id).currentProjects.length === 0) && (
                                  <p className="text-sm text-muted-foreground">참여중인 프로젝트가 없습니다</p>
                                )}
                              </div>
                            </div>

                            {/* 오른쪽: 건강검진 결과 */}
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Heart className="w-4 h-4 text-primary" />
                                  <h3 className="text-base font-semibold text-foreground">
                                    건강 체크 결과
                                  </h3>
                                </div>
                                {getEmployeeDetails(employee.id).healthCheck ? (
                                  <Card className="p-4 bg-white border border-border">
                                    <div className="space-y-0">
                                      <div className="flex items-center justify-between py-2 border-b border-border">
                                        <span className="text-sm text-muted-foreground">오늘 컨디션</span>
                                        <span className="text-sm font-medium text-foreground">{getEmployeeDetails(employee.id).healthCheck.condition}</span>
                                      </div>
                                      <div className="flex items-center justify-between py-2 border-b border-border">
                                        <span className="text-sm text-muted-foreground">수면 시간</span>
                                        <span className="text-sm font-medium text-foreground">{getEmployeeDetails(employee.id).healthCheck.sleepHours}시간</span>
                                      </div>
                                      <div className="flex items-center justify-between py-2">
                                        <span className="text-sm text-muted-foreground">신체 불편함</span>
                                        <span className="text-sm font-medium text-foreground">{getEmployeeDetails(employee.id).healthCheck.discomfortLevel}</span>
                                      </div>
                                      {getEmployeeDetails(employee.id).healthCheck.memo && (
                                        <div className="pt-3 mt-3 border-t border-border">
                                          <p className="text-xs text-muted-foreground mb-2">메모</p>
                                          <div className="p-3 bg-muted/30 rounded-lg">
                                            <p className="text-sm text-foreground">{getEmployeeDetails(employee.id).healthCheck.memo}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </Card>
                                ) : (
                                  <Card className="p-4 bg-white border border-border">
                                    <div className="text-center py-8">
                                      <p className="text-sm text-muted-foreground">검진을 하지 않았습니다</p>
                                    </div>
                                  </Card>
                                )}
                              </div>
                          </div>
                        )}
                      </>
                    )}
                  </Card>
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
