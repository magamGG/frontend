import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { 
  Search,
  ChevronRight,
  BookOpen,
  AlertCircle,
  Plus,
  ArrowUpDown,
  Calendar
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { AgencyProjectDetailPage } from '@/app/pages/agency/AgencyProjectDetailPage';
import { toast } from 'sonner';

interface Project {
  id: number;
  title: string;
  platform: string;
  status: 'urgent' | 'normal' | 'completed';
  serialStatus: '연재중' | '휴재' | '완결';
  currentEpisode: number;
  deadline: string;
  genre: string;
  description?: string;
  schedule?: string;
  thumbnail?: string;
  artistName: string;
  artistId: number;
  managerName: string;
  managerId: number;
}

interface Manager {
  id: number;
  name: string;
}

export function AgencyProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // 필터 상태
  const [statusFilters, setStatusFilters] = useState<string[]>(['전체']);
  const [selectedManagerFilters, setSelectedManagerFilters] = useState<number[]>([]); // 다중 선택으로 변경

  // 정렬 상태
  type SortType = 'name' | 'deadline' | null;
  type SortOrder = 'asc' | 'desc';
  const [sortType, setSortType] = useState<SortType>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // 작품 추가 폼 상태
  const [newProjectForm, setNewProjectForm] = useState({
    managerId: 0,
    artistName: '',
    title: '',
    platform: '네이버 웹툰',
    genre: '',
    schedule: '',
    thumbnail: '',
    thumbnailFile: null as File | null,
  });

  // 페이지 제목 변경을 위한 헤더 업데이트
  useEffect(() => {
    const headerTitle = document.querySelector('h1.text-2xl.font-bold');
    if (headerTitle) {
      if (showDetailPage) {
        headerTitle.textContent = '프로젝트 상세';
      } else {
        headerTitle.textContent = '전체 프로젝트';
      }
    }
  }, [showDetailPage]);

  // 담당자 목록 (샘플 데이터)
  const [managers] = useState<Manager[]>([
    { id: 1, name: '김담당자' },
    { id: 2, name: '이담당자' },
    { id: 3, name: '박담당자' },
    { id: 4, name: '최담당자' },
    { id: 5, name: '정담당자' },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: '로맨스 판타지',
      platform: '네이버 웹툰',
      status: 'urgent',
      serialStatus: '연재중',
      currentEpisode: 42,
      deadline: 'D-2',
      genre: '로맨스/판타지',
      description: '매주 일요일 업데이트. 현재 스토리보드 단계입니다.',
      schedule: '매주 일요일 오전 10시',
      thumbnail: 'https://images.unsplash.com/photo-1591788806059-cb6e2f6a2498?w=400',
      artistName: '김작가',
      artistId: 1,
      managerName: '김담당자',
      managerId: 1,
    },
    {
      id: 2,
      title: '학원물',
      platform: '카카오페이지',
      status: 'normal',
      serialStatus: '연재중',
      currentEpisode: 15,
      deadline: 'D-5',
      genre: '학원/일상',
      description: '매주 수요일 업데이트. 러프 스케치 단계입니다.',
      schedule: '매주 수요일 오후 2시',
      thumbnail: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400',
      artistName: '이작가',
      artistId: 2,
      managerName: '이담당자',
      managerId: 2,
    },
    {
      id: 3,
      title: '미스터리 스릴러',
      platform: '레진코믹스',
      status: 'normal',
      serialStatus: '휴재',
      currentEpisode: 28,
      deadline: '휴재중',
      genre: '미스터리/스릴러',
      description: '2025년 3월 재연재 예정',
      schedule: '휴재중 (3월 재개 예정)',
      thumbnail: 'https://images.unsplash.com/photo-1618556662146-0c86c2466516?w=400',
      artistName: '박작가',
      artistId: 3,
      managerName: '박담당자',
      managerId: 3,
    },
    {
      id: 4,
      title: '액션 판타지',
      platform: '네이버 시리즈',
      status: 'completed',
      serialStatus: '완결',
      currentEpisode: 120,
      deadline: '완결',
      genre: '액션/판타지',
      description: '총 120화 완결. 조회수 2.5M을 기록했습니다.',
      schedule: '완결 (2024년 12월)',
      thumbnail: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400',
      artistName: '최작가',
      artistId: 4,
      managerName: '최담당자',
      managerId: 4,
    },
    {
      id: 5,
      title: '일상 코미디',
      platform: '카카오웹툰',
      status: 'normal',
      serialStatus: '연재중',
      currentEpisode: 35,
      deadline: 'D-7',
      genre: '일상/코미디',
      description: '매주 금요일 업데이트',
      schedule: '매주 금요일 오후 6시',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      artistName: '정작가',
      artistId: 5,
      managerName: '김담당자',
      managerId: 1,
    },
    {
      id: 6,
      title: 'SF 액션',
      platform: '네이버 웹툰',
      status: 'normal',
      serialStatus: '연재중',
      currentEpisode: 22,
      deadline: 'D-4',
      genre: 'SF/액션',
      description: '매주 목요일 업데이트',
      schedule: '매주 목요일 오전 11시',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      artistName: '한작가',
      artistId: 6,
      managerName: '정담당자',
      managerId: 5,
    },
  ]);

  // localStorage에서 작품 데이터 로드
  useEffect(() => {
    const stored = localStorage.getItem('agencyProjectsData');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.length > 0) {
        setProjects(data);
      }
    }
  }, []);

  // 작품 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('agencyProjectsData', JSON.stringify(projects));
  }, [projects]);

  // 상태 필터 토글
  const toggleFilter = (filter: string) => {
    if (filter === '전체') {
      setStatusFilters(['전체']);
    } else {
      const newFilters = statusFilters.includes(filter)
        ? statusFilters.filter(f => f !== filter)
        : [...statusFilters.filter(f => f !== '전체'), filter];
      
      // 3개를 모두 선택하면 전체만 활성화
      if (newFilters.length === 3 && newFilters.includes('연재중') && newFilters.includes('휴재') && newFilters.includes('완결')) {
        setStatusFilters(['전체']);
      } else {
        setStatusFilters(newFilters.length === 0 ? ['전체'] : newFilters);
      }
    }
  };

  // 검색 및 필터링된 프로젝트
  const filteredProjects = projects.filter(project => {
    // 검색어 필터
    const searchMatch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.managerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 상태 필터
    const statusMatch = statusFilters.includes('전체') || statusFilters.includes(project.serialStatus);
    
    // 담당자 필터
    const managerMatch = selectedManagerFilters.length === 0 || selectedManagerFilters.includes(project.managerId);
    
    return searchMatch && statusMatch && managerMatch;
  });

  // 정렬 핸들러
  const handleSort = (type: SortType) => {
    if (sortType === type) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortType(null);
        setSortOrder('asc');
      }
    } else {
      setSortType(type);
      setSortOrder('asc');
    }
  };

  // 정렬된 프로젝트
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (!sortType) return 0;

    if (sortType === 'name') {
      const comparison = a.title.localeCompare(b.title, 'ko');
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    if (sortType === 'deadline') {
      const getDeadlineValue = (deadline: string): number => {
        if (deadline === '완결') return 9999;
        if (deadline === '휴재중') return 9998;
        if (deadline.startsWith('D-')) {
          const days = parseInt(deadline.substring(2));
          return days;
        }
        return 9997;
      };

      const aValue = getDeadlineValue(a.deadline);
      const bValue = getDeadlineValue(b.deadline);
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // 작품 추가 핸들러
  const handleAddProject = () => {
    if (!newProjectForm.managerId || !newProjectForm.artistName || !newProjectForm.title || !newProjectForm.genre) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    const selectedManager = managers.find(m => m.id === newProjectForm.managerId);
    if (!selectedManager) {
      toast.error('담당자를 선택해주세요.');
      return;
    }

    const newProject: Project = {
      id: Date.now(),
      title: newProjectForm.title,
      platform: newProjectForm.platform,
      status: 'normal',
      serialStatus: '연재중',
      currentEpisode: 1,
      deadline: 'D-7',
      genre: newProjectForm.genre,
      schedule: newProjectForm.schedule || '미정',
      thumbnail: newProjectForm.thumbnail || 'https://images.unsplash.com/photo-1591788806059-cb6e2f6a2498?w=400',
      artistName: newProjectForm.artistName,
      artistId: Date.now(),
      managerName: selectedManager.name,
      managerId: newProjectForm.managerId,
    };

    setProjects([...projects, newProject]);
    setIsAddModalOpen(false);
    setNewProjectForm({
      managerId: 0,
      artistName: '',
      title: '',
      platform: '네이버 웹툰',
      genre: '',
      schedule: '',
      thumbnail: '',
      thumbnailFile: null,
    });
    toast.success('작품이 추가되었습니다.');
  };

  // 썸네일 파일 선택 핸들러
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('이미지 파일만 업로드 가능합니다.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setNewProjectForm({
          ...newProjectForm,
          thumbnail: result,
          thumbnailFile: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowDetailPage(true);
  };

  // 통계 계산
  const stats = {
    totalManagers: new Set(projects.map(p => p.managerId)).size, // 총 담당자 수
    totalProjects: projects.length, // 전체 프로젝트 수
    todayDeadlines: projects.filter(p => 
      p.deadline.includes('D-0') || p.deadline.includes('D-1') || p.deadline.includes('D-2')
    ).slice(0, 3).length, // 오늘 마감 작품 3개
  };

  // 상태별 배지 색상
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case '연재중':
        return 'bg-green-500 hover:bg-green-600';
      case '휴재':
        return 'bg-orange-500 hover:bg-orange-600';
      case '완결':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar">
      {/* 작품 상세 페이지 표시 */}
      {showDetailPage && selectedProject ? (
        <AgencyProjectDetailPage 
          project={selectedProject} 
          onBack={() => setShowDetailPage(false)} 
        />
      ) : (
        /* 작품 목록 표시 */
        <div className="pb-24 px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">전체 프로젝트</h1>
                <p className="text-sm text-muted-foreground mt-1">에이전시의 모든 프로젝트를 조회하세요</p>
              </div>
            </div>

            {/* 상단 통계 카드 - 3개만 표시 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">전체 프로젝트 수</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.totalProjects}개</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">마감 임박 작품</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.todayDeadlines}개</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">총 담당자 수</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.totalManagers}명</p>
              </Card>
            </div>

            {/* 검색 바 */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="프로젝트명, 작가명 또는 담당자명으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* 필터 영역 */}
            <Card className="p-4 mb-6">
              <div className="space-y-4">
                {/* 담당자 카테고리 탭 */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">담당자:</span>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={selectedManagerFilters.length === 0 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        // 전체 인원 클릭 시 모든 필터 해제 (전체 활성화)
                        setSelectedManagerFilters([]);
                      }}
                      className={selectedManagerFilters.length === 0 ? 'bg-primary' : ''}
                    >
                      전체 인원
                    </Button>
                    {managers.map((manager) => {
                      // 모든 담당자가 선택되었는지 확인
                      const allSelected = selectedManagerFilters.length === managers.length &&
                        managers.every(m => selectedManagerFilters.includes(m.id));
                      
                      return (
                        <Button
                          key={manager.id}
                          variant={selectedManagerFilters.includes(manager.id) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            let newFilters = [...selectedManagerFilters];
                            
                            if (selectedManagerFilters.includes(manager.id)) {
                              // 이미 선택된 경우 제거
                              newFilters = newFilters.filter(id => id !== manager.id);
                            } else {
                              // 선택되지 않은 경우 추가
                              newFilters.push(manager.id);
                            }
                            
                            // 모든 담당자가 선택되면 전체 인원 활성화 (빈 배열)
                            if (newFilters.length === managers.length) {
                              setSelectedManagerFilters([]);
                            } else {
                              setSelectedManagerFilters(newFilters);
                            }
                          }}
                          className={selectedManagerFilters.includes(manager.id) ? 'bg-primary' : ''}
                        >
                          {manager.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* 구분선 */}
                <div className="w-full border-t border-border" />

                {/* 작품 상태 필터 & 정렬 */}
                <div className="flex items-center justify-between">
                  {/* 작품 상태 필터 */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">상태:</span>
                    <div className="flex gap-2">
                      {['전체', '연재중', '휴재', '완결'].map((filter) => (
                        <Button
                          key={filter}
                          variant={statusFilters.includes(filter) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleFilter(filter)}
                          className={statusFilters.includes(filter) ? getStatusBadgeColor(filter === '전체' ? '' : filter) : ''}
                        >
                          {filter}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* 정렬 */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">정렬:</span>
                    <div className="flex gap-2">
                      <Button
                        variant={sortType === 'name' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-1"
                      >
                        가나다순
                        {sortType === 'name' && (
                          <ArrowUpDown className="w-3 h-3" />
                        )}
                        {sortType === 'name' && (
                          <span className="text-xs ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </Button>
                      <Button
                        variant={sortType === 'deadline' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleSort('deadline')}
                        className="flex items-center gap-1"
                      >
                        마감일순
                        {sortType === 'deadline' && (
                          <ArrowUpDown className="w-3 h-3" />
                        )}
                        {sortType === 'deadline' && (
                          <span className="text-xs ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 작품 리스트 */}
            <div className="space-y-4">
              {sortedProjects.map((project) => (
                <Card 
                  key={project.id}
                  className="p-5 cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="flex items-center gap-5">
                    {/* 왼쪽: 썸네일 */}
                    <div className="flex-shrink-0">
                      <ImageWithFallback
                        src={project.thumbnail || 'https://images.unsplash.com/photo-1591788806059-cb6e2f6a2498?w=400'}
                        alt={project.title}
                        className="w-24 h-32 object-cover rounded-md border-2 border-border"
                      />
                    </div>

                    {/* 가운데: 작품 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {project.artistName}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-primary/10">
                          {project.managerName}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project.genre}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-foreground">
                          <BookOpen className="w-3 h-3 inline mr-1" />
                          {project.platform}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-foreground">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {project.schedule}
                        </span>
                      </div>
                    </div>

                    {/* 오른쪽: 상태 정보 */}
                    <div className="flex-shrink-0 text-right space-y-2">
                      <Badge className={getStatusBadgeColor(project.serialStatus)}>
                        {project.serialStatus}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        현재 {project.currentEpisode}화
                      </p>
                      <p className="text-xs text-muted-foreground">
                        마감: {project.deadline}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              {sortedProjects.length === 0 && (
                <Card className="p-12">
                  <div className="text-center text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">해당 조건의 작품이 없습니다</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 작품 추가 모달 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4 p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">프로젝트 추가</h2>
            <div className="space-y-4">
              {/* 담당자 선택 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  담당자 선택 <span className="text-red-500">*</span>
                </label>
                <select
                  value={newProjectForm.managerId}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, managerId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value={0}>담당자를 선택하세요</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 작가명 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  작가명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newProjectForm.artistName}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, artistName: e.target.value })}
                  placeholder="작가명을 입력하세요"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>

              {/* 프로젝트명 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  프로젝트명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newProjectForm.title}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                  placeholder="프로젝트명을 입력하세요"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>

              {/* 장르 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  장르 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newProjectForm.genre}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, genre: e.target.value })}
                  placeholder="예: 로맨스/판타지"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>

              {/* 플랫폼 선택 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  플랫폼 <span className="text-red-500">*</span>
                </label>
                <select
                  value={newProjectForm.platform}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, platform: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option>네이버 웹툰</option>
                  <option>카카오페이지</option>
                  <option>카카오웹툰</option>
                  <option>레진코믹스</option>
                  <option>네이버 시리즈</option>
                  <option>리디북스</option>
                  <option>탑툰</option>
                </select>
              </div>

              {/* 연재 일정 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  연재 일정
                </label>
                <input
                  type="text"
                  value={newProjectForm.schedule}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, schedule: e.target.value })}
                  placeholder="예: 매주 일요일 오전 10시"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>

              {/* 썸네일 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  썸네일 첨부 (선택)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                {newProjectForm.thumbnail && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">미리보기:</p>
                    <ImageWithFallback
                      src={newProjectForm.thumbnail}
                      alt="썸네일 미리보기"
                      className="w-24 h-32 object-cover rounded-md border-2 border-border"
                    />
                  </div>
                )}
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  onClick={handleAddProject}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  등록
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}