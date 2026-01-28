import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
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
  X,
  Edit2,
  Trash2,
  BookOpen,
  Heart,
  Calendar
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
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
  EmptyStateIcon,
  EmptyStateText,
} from './AgencyTeamPage.styled';

// TODO: Zustand store mapping - 직원 목록
const initialEmployees = [
  {
    id: 1,
    name: '김담당자',
    role: '담당자',
    position: '담당자',
    email: 'kim@agency.com',
    phone: '010-1234-5678',
    status: '근무중',
    joinDate: '2020-03-15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    currentProjects: ['로맨스 판타지', '액션 드라마', '일상 코미디', '미스터리 스릴러'],
    participatedProjects: ['로맨스 판타지', '액션 드라마', '일상 코미디', '미스터리 스릴러', 'SF 대작', '판타지 모험', '일상 슬라이스'],
    managedArtists: ['김작가', '박작가'], // 담당 작가 목록
    healthCheck: {
      date: '2026-01-23',
      condition: '보통',
      sleepHours: 7,
      discomfortLevel: 4,
      memo: '오늘은 키위가 먹고싶네여...'
    }
  },
  {
    id: 2,
    name: '이담당자',
    role: '담당자',
    position: '담당자',
    email: 'lee@agency.com',
    phone: '010-2345-6789',
    status: '근무중',
    joinDate: '2021-06-20',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    currentProjects: ['학원물', '로맨스 웹툰', '판타지 액션'],
    participatedProjects: ['학원물', '로맨스 웹툰', '판타지 액션', '스릴러 웹툰', '코미디 시리즈'],
    managedArtists: ['이작가'],
    healthCheck: {
      date: '2026-01-23',
      condition: '좋음',
      sleepHours: 8,
      discomfortLevel: 2,
      memo: ''
    }
  },
  {
    id: 3,
    name: '박담당자',
    role: '담당자',
    position: '담당자',
    email: 'park@agency.com',
    phone: '010-3456-7890',
    status: '근무중',
    joinDate: '2023-01-10',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    currentProjects: ['스포츠 드라마', '청춘 로맨스'],
    participatedProjects: ['스포츠 드라마', '청춘 로맨스', '학원 코미디'],
    managedArtists: [],
    healthCheck: {
      date: '2026-01-23',
      condition: '보통',
      sleepHours: 6,
      discomfortLevel: 5,
      memo: ''
    }
  },
  {
    id: 4,
    name: '김작가',
    role: '작가',
    position: '메인 작가',
    email: 'kim.artist@agency.com',
    phone: '010-4567-8901',
    status: '근무중',
    joinDate: '2021-09-05',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    currentProjects: ['로맨스 판타지', '액션 드라마'],
    participatedProjects: ['로맨스 판타지', '액션 드라마', 'SF 대작', '미스터리 시리즈', '일상 웹툰'],
    myWorks: ['로맨스 판타지', '액션 드라마', 'SF 대작'], // 자기 작품
    serializingWorks: ['로맨스 판타지', '액션 드라마'], // 연재중인 작품
    healthCheck: {
      date: '2026-01-23',
      condition: '보통',
      sleepHours: 7,
      discomfortLevel: 4,
      memo: '오늘은 키위가 먹고싶네여...'
    }
  },
  {
    id: 5,
    name: '이작가',
    role: '작가',
    position: '시니어 작가',
    email: 'lee.artist@agency.com',
    phone: '010-5678-9012',
    status: '휴가',
    joinDate: '2019-11-22',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    currentProjects: ['무협 웹툰', '판타지 로맨스'],
    participatedProjects: ['무협 웹툰', '판타지 로맨스', '액션 판타지', '역사 드라마', '로맨스 코미디', '스릴러 웹툰'],
    myWorks: ['무협 웹툰', '판타지 로맨스', '액션 판타지'],
    serializingWorks: ['무협 웹툰', '판타지 로맨스'],
    healthCheck: {
      date: '2026-01-23',
      condition: '피곤함',
      sleepHours: 5,
      discomfortLevel: 6,
      memo: ''
    }
  },
  {
    id: 6,
    name: '최어시',
    role: '어시스트',
    position: '배경 어시스트',
    email: 'choi.assist@agency.com',
    phone: '010-6789-0123',
    status: '근무중',
    joinDate: '2023-05-15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    currentProjects: ['로맨스 판타지', '액션 드라마'],
    participatedProjects: ['로맨스 판타지', '액션 드라마', 'SF 대작'],
    healthCheck: {
      date: '2026-01-23',
      condition: '좋음',
      sleepHours: 8,
      discomfortLevel: 3,
      memo: ''
    }
  },
  {
    id: 7,
    name: '정어시',
    role: '어시스트',
    position: '채색 어시스트',
    email: 'jung.assist@agency.com',
    phone: '010-7890-1234',
    status: '근무중',
    joinDate: '2023-08-20',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    currentProjects: ['무협 웹툰', '판타지 로맨스'],
    participatedProjects: ['무협 웹툰', '판타지 로맨스', '액션 판타지'],
    healthCheck: {
      date: '2026-01-23',
      condition: '보통',
      sleepHours: 7,
      discomfortLevel: 4,
      memo: ''
    }
  },
];

const ROLE_FILTERS = ['전체', '담당자', '작가', '어시스트'];

export function AgencyTeamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEmployees, setExpandedEmployees] = useState(new Set());
  const [selectedRoles, setSelectedRoles] = useState(['전체']);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [employees, setEmployees] = useState(initialEmployees);
  
  // 프로젝트 데이터 (실제로는 Zustand store에서 가져와야 함)
  const [projects] = useState(() => {
    const stored = localStorage.getItem('agencyProjectsData');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  // 새 직원 추가 폼 상태
  const [newEmployee, setNewEmployee] = useState({
    email: '',
  });

  // 편집 중인 직원 상태
  const [editingEmployee, setEditingEmployee] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case '근무중':
        return 'bg-green-500';
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

  // 직원 삭제 핸들러
  const handleDeleteEmployee = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
      setIsEditModalOpen(false);
      setEditingEmployee(null);
      toast.success('직원이 삭제되었습니다.');
    }
  };

  // 접이식 토글 핸들러
  const toggleEmployee = (employeeId) => {
    const newExpanded = new Set(expandedEmployees);
    if (newExpanded.has(employeeId)) {
      newExpanded.delete(employeeId);
    } else {
      newExpanded.add(employeeId);
    }
    setExpandedEmployees(newExpanded);
  };

  // 담당자의 담당 작가 정보 가져오기
  const getManagedArtists = (managerId) => {
    const manager = employees.find(m => m.id === managerId);
    if (!manager || !manager.managedArtists) return [];
    
    return employees.filter(emp => 
      emp.role === '작가' && manager.managedArtists.includes(emp.name)
    );
  };

  // 담당자의 담당 작가의 연재중인 작품 가져오기
  const getManagedArtistsSerializingWorks = (managerId) => {
    const managedArtists = getManagedArtists(managerId);
    
    const works = [];
    managedArtists.forEach(artist => {
      if (artist.serializingWorks) {
        works.push(...artist.serializingWorks);
      }
    });
    return [...new Set(works)]; // 중복 제거
  };

  // Filter employees by search query and role
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = 
      selectedRoles.includes('전체') ||
      selectedRoles.includes(employee.role);

    return matchesSearch && matchesRole;
  });

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
        <EmployeeListContainer>
          {filteredEmployees.map((employee) => {
            const isExpanded = expandedEmployees.has(employee.id);
            return (
              <div key={employee.id}>
                <EmployeeCard 
                  onClick={() => toggleEmployee(employee.id)}
                >
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
                        {employee.position && (
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
                    <EmployeeStats>
                      <p className="text-xs text-muted-foreground mb-1">참여 중인 프로젝트</p>
                      <p className="text-lg font-semibold text-foreground">{employee.currentProjects.length}개</p>
                    </EmployeeStats>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </EmployeeCardContent>
                </EmployeeCard>
                
                {/* 접이식 내용 */}
                {isExpanded && (
                  <Card className="mt-0 p-6 bg-white border-t-0 rounded-t-none" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: '-1px' }}>
                    {employee.role === '작가' && (
                      <div className="grid grid-cols-2 gap-6">
                        {/* 왼쪽: 작가와 연재중인 작품 */}
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <BookOpen className="w-4 h-4 text-primary" />
                              <h3 className="text-base font-semibold text-foreground">내 작품</h3>
                            </div>
                            <div className="space-y-2">
                              {(employee.myWorks || []).map((work, index) => (
                                <div key={index} className="p-2 bg-muted/30 rounded-lg border border-border">
                                  <span className="text-sm font-medium text-foreground">{work}</span>
                                </div>
                              ))}
                              {(!employee.myWorks || employee.myWorks.length === 0) && (
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
                              {(employee.serializingWorks || []).map((work, index) => (
                                <div key={index} className="p-2 bg-muted/30 rounded-lg border border-border">
                                  <span className="text-sm font-medium text-foreground">{work}</span>
                                </div>
                              ))}
                              {(!employee.serializingWorks || employee.serializingWorks.length === 0) && (
                                <p className="text-sm text-muted-foreground">연재중인 작품이 없습니다</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 오른쪽: 건강검진 결과 */}
                        {employee.healthCheck && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Heart className="w-4 h-4 text-primary" />
                              <h3 className="text-base font-semibold text-foreground">
                                {employee.healthCheck.date} 건강 체크 결과
                              </h3>
                            </div>
                            <Card className="p-4 bg-white border border-border">
                              <div className="space-y-0">
                                <div className="flex items-center justify-between py-2 border-b border-border">
                                  <span className="text-sm text-muted-foreground">오늘 컨디션</span>
                                  <span className="text-sm font-medium text-foreground">{employee.healthCheck.condition}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-border">
                                  <span className="text-sm text-muted-foreground">수면 시간</span>
                                  <span className="text-sm font-medium text-foreground">{employee.healthCheck.sleepHours}시간</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                  <span className="text-sm text-muted-foreground">신체 불편함</span>
                                  <span className="text-sm font-medium text-foreground">{employee.healthCheck.discomfortLevel}</span>
                                </div>
                                {employee.healthCheck.memo && (
                                  <div className="pt-3 mt-3 border-t border-border">
                                    <p className="text-xs text-muted-foreground mb-2">메모</p>
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                      <p className="text-sm text-foreground">{employee.healthCheck.memo}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </Card>
                          </div>
                        )}
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
                        {employee.healthCheck && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Heart className="w-4 h-4 text-primary" />
                              <h3 className="text-base font-semibold text-foreground">
                                {employee.healthCheck.date} 건강 체크 결과
                              </h3>
                            </div>
                            <Card className="p-4 bg-white border border-border">
                              <div className="space-y-0">
                                <div className="flex items-center justify-between py-2 border-b border-border">
                                  <span className="text-sm text-muted-foreground">오늘 컨디션</span>
                                  <span className="text-sm font-medium text-foreground">{employee.healthCheck.condition}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-border">
                                  <span className="text-sm text-muted-foreground">수면 시간</span>
                                  <span className="text-sm font-medium text-foreground">{employee.healthCheck.sleepHours}시간</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                  <span className="text-sm text-muted-foreground">신체 불편함</span>
                                  <span className="text-sm font-medium text-foreground">{employee.healthCheck.discomfortLevel}</span>
                                </div>
                                {employee.healthCheck.memo && (
                                  <div className="pt-3 mt-3 border-t border-border">
                                    <p className="text-xs text-muted-foreground mb-2">메모</p>
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                      <p className="text-sm text-foreground">{employee.healthCheck.memo}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </Card>
                          </div>
                        )}
                      </div>
                    )}

                    {employee.role === '어시스트' && (
                      <div className="grid grid-cols-2 gap-6">
                        {/* 왼쪽: 참여중인 작품 */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Briefcase className="w-4 h-4 text-primary" />
                            <h3 className="text-base font-semibold text-foreground">참여중인 작품</h3>
                          </div>
                          <div className="space-y-2">
                            {(employee.currentProjects || []).map((project, index) => (
                              <div key={index} className="p-2 bg-muted/30 rounded-lg border border-border">
                                <span className="text-sm font-medium text-foreground">{project}</span>
                              </div>
                            ))}
                            {(!employee.currentProjects || employee.currentProjects.length === 0) && (
                              <p className="text-sm text-muted-foreground">참여중인 작품이 없습니다</p>
                            )}
                          </div>
                        </div>

                        {/* 오른쪽: 건강검진 결과 */}
                        {employee.healthCheck && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Heart className="w-4 h-4 text-primary" />
                              <h3 className="text-base font-semibold text-foreground">
                                {employee.healthCheck.date} 건강 체크 결과
                              </h3>
                            </div>
                            <Card className="p-4 bg-white border border-border">
                              <div className="space-y-0">
                                <div className="flex items-center justify-between py-2 border-b border-border">
                                  <span className="text-sm text-muted-foreground">오늘 컨디션</span>
                                  <span className="text-sm font-medium text-foreground">{employee.healthCheck.condition}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-border">
                                  <span className="text-sm text-muted-foreground">수면 시간</span>
                                  <span className="text-sm font-medium text-foreground">{employee.healthCheck.sleepHours}시간</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                  <span className="text-sm text-muted-foreground">신체 불편함</span>
                                  <span className="text-sm font-medium text-foreground">{employee.healthCheck.discomfortLevel}</span>
                                </div>
                                {employee.healthCheck.memo && (
                                  <div className="pt-3 mt-3 border-t border-border">
                                    <p className="text-xs text-muted-foreground mb-2">메모</p>
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                      <p className="text-sm text-foreground">{employee.healthCheck.memo}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </Card>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                )}
              </div>
            );
          })}
        </EmployeeListContainer>

        {filteredEmployees.length === 0 && (
          <Card className="p-12 text-center">
            <EmptyStateIcon>
              <Users className="w-12 h-12 text-muted-foreground" />
            </EmptyStateIcon>
            <EmptyStateText>검색 결과가 없습니다</EmptyStateText>
          </Card>
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
              onClick={() => editingEmployee && handleDeleteEmployee(editingEmployee.id)}
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
    </AgencyTeamRoot>
  );
}
