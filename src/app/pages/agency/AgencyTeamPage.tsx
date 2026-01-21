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
  Mail,
  Phone,
  Briefcase,
  UserPlus,
  X,
  Edit2,
  Trash2
} from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  role: '담당자' | '작가' | '어시스트'; // 직책 타입
  position?: string; // 직급 (시니어, 주니어 등)
  email: string;
  phone: string;
  status: string;
  joinDate: string;
  currentProjects: string[]; // 현재 참여 중인 프로젝트 목록
  participatedProjects: string[]; // 지금까지 참여했던 모든 프로젝트
}

type RoleFilter = '전체' | '담당자' | '작가' | '어시스트';

export function AgencyTeamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<RoleFilter[]>(['전체']);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProjectListModalOpen, setIsProjectListModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: '김담당자',
      role: '담당자',
      position: '시니어 매니저',
      email: 'kim@agency.com',
      phone: '010-1234-5678',
      status: '근무중',
      joinDate: '2020-03-15',
      currentProjects: ['로맨스 판타지', '액션 드라마', '일상 코미디', '미스터리 스릴러'],
      participatedProjects: ['로맨스 판타지', '액션 드라마', '일상 코미디', '미스터리 스릴러', 'SF 대작', '판타지 모험', '일상 슬라이스']
    },
    {
      id: 2,
      name: '이담당자',
      role: '담당자',
      position: '매니저',
      email: 'lee@agency.com',
      phone: '010-2345-6789',
      status: '근무중',
      joinDate: '2021-06-20',
      currentProjects: ['학원물', '로맨스 웹툰', '판타지 액션'],
      participatedProjects: ['학원물', '로맨스 웹툰', '판타지 액션', '스릴러 웹툰', '코미디 시리즈']
    },
    {
      id: 3,
      name: '박담당자',
      role: '담당자',
      position: '주니어 매니저',
      email: 'park@agency.com',
      phone: '010-3456-7890',
      status: '근무중',
      joinDate: '2023-01-10',
      currentProjects: ['스포츠 드라마', '청춘 로맨스'],
      participatedProjects: ['스포츠 드라마', '청춘 로맨스', '학원 코미디']
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
      currentProjects: ['로맨스 판타지', '액션 드라마'],
      participatedProjects: ['로맨스 판타지', '액션 드라마', 'SF 대작', '미스터리 시리즈', '일상 웹툰']
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
      currentProjects: ['무협 웹툰', '판타지 로맨스'],
      participatedProjects: ['무협 웹툰', '판타지 로맨스', '액션 판타지', '역사 드라마', '로맨스 코미디', '스릴러 웹툰']
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
      currentProjects: ['로맨스 판타지', '액션 드라마'],
      participatedProjects: ['로맨스 판타지', '액션 드라마', 'SF 대작']
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
      currentProjects: ['무협 웹툰', '판타지 로맨스'],
      participatedProjects: ['무협 웹툰', '판타지 로맨스', '액션 판타지']
    },
  ]);

  // 새 직원 추가 폼 상태
  const [newEmployee, setNewEmployee] = useState({
    email: '',
  });

  // 편집 중인 직원 상태
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const getStatusColor = (status: string) => {
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

  const getRoleColor = (role: string) => {
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
  const handleRoleToggle = (role: RoleFilter) => {
    if (role === '전체') {
      setSelectedRoles(['전체']);
      return;
    }

    const otherRoles: RoleFilter[] = ['담당자', '작가', '어시스트'];
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

    const employee: Employee = {
      id: employees.length + 1,
      name: '새 직원',
      role: '담당자',
      position: '',
      email: newEmployee.email,
      phone: '',
      status: '근무중',
      joinDate: new Date().toISOString().split('T')[0],
      currentProjects: [],
      participatedProjects: []
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
  const handleDeleteEmployee = (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
      setIsEditModalOpen(false);
      setEditingEmployee(null);
      toast.success('직원이 삭제되었습니다.');
    }
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

  if (selectedEmployee !== null) {
    const employee = employees.find(e => e.id === selectedEmployee);
    if (!employee) return null;

    return (
      <div className="w-full h-full">
        <div className="pb-24 px-8">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedEmployee(null)}
                className="bg-background text-foreground hover:bg-muted p-0 h-auto"
              >
                ← 목록으로 돌아가기
              </Button>
            </div>

            {/* Employee Detail */}
            <div className="space-y-6">
              {/* Header Card */}
              <Card className="p-6">
                <div className="flex items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-foreground">{employee.name}</h1>
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleColor(employee.role)}>
                          {employee.role}
                        </Badge>
                        {employee.position && (
                          <Badge variant="outline">
                            {employee.position}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">이메일</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{employee.email}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">전화번호</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{employee.phone}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">참여 중인 프로젝트</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{employee.currentProjects.length}개</p>
                  </div>
                </div>
              </Card>

              {/* Current Projects */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">현재 참여 중인 프로젝트</h3>
                  <Badge className="bg-primary text-xs ml-2">
                    {employee.currentProjects.length}개
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {employee.currentProjects.map((project, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{project}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {employee.currentProjects.length === 0 && (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">참여 중인 프로젝트가 없습니다</p>
                  </div>
                )}
              </Card>

              {/* Employee Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">활동 통계</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">입사일</span>
                      <span className="font-semibold text-foreground">{employee.joinDate}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">근속 기간</span>
                      <span className="font-semibold text-foreground">
                        {Math.floor((new Date().getTime() - new Date(employee.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 365))}년
                      </span>
                    </div>
                    <button
                      onClick={() => setIsProjectListModalOpen(true)}
                      className="w-full flex justify-between items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all cursor-pointer"
                    >
                      <span className="text-sm text-muted-foreground">참여 프로젝트</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary">{employee.participatedProjects.length}개</span>
                        <ChevronRight className="w-4 h-4 text-primary" />
                      </div>
                    </button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">최근 활동</h3>
                  <div className="space-y-3">
                    {[
                      { date: '2026-01-15', activity: '프로젝트 업데이트: 로맨스 판타지' },
                      { date: '2026-01-14', activity: '회의 참석: 신규 작품 기획' },
                      { date: '2026-01-13', activity: '작가 미팅 완료' },
                      { date: '2026-01-12', activity: '계약서 검토 완료' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm text-foreground">{item.activity}</span>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* 참여 프로젝트 목록 모달 */}
        <Dialog open={isProjectListModalOpen} onOpenChange={setIsProjectListModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>참여 프로젝트 전체 목록</DialogTitle>
              <DialogDescription>
                {employee.name}님이 참여했던 모든 프로젝트 목록입니다.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {employee.participatedProjects.map((project, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-muted/30 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{project}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">전체 직원</h1>
                <p className="text-sm text-muted-foreground">
                  에이전시 소속 직원 {employees.length}명
                </p>
              </div>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                직원 추가
              </Button>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2 mb-4">
              {(['전체', '담당자', '작가', '어시스트'] as RoleFilter[]).map((role) => (
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
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="이름, 이메일 또는 직급으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Employee List Cards */}
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <Card 
                key={employee.id}
                className="p-5 hover:border-primary/50 transition-all cursor-pointer hover:shadow-md"
                onClick={() => setSelectedEmployee(employee.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">{employee.name}</h3>
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
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{employee.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 mr-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">참여 중인 프로젝트</p>
                        <p className="text-lg font-semibold text-foreground">{employee.currentProjects.length}개</p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <Card className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">검색 결과가 없습니다</p>
            </Card>
          )}
        </div>
      </div>

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
                  onChange={(e) => setEditingEmployee({...editingEmployee, role: e.target.value as '담당자' | '작가' | '어시스트'})}
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
    </div>
  );
}