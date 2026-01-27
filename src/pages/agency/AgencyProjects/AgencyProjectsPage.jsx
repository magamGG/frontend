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
import { AgencyProjectDetailPage } from '@/pages/agency/AgencyProjectDetail';
import { toast } from 'sonner';
import {
  AgencyProjectsRoot,
  AgencyProjectsBody,
  AgencyProjectsHeader,
  AgencyProjectsTitle,
  AgencyProjectsDescription,
  AgencyProjectsStatsGrid,
  AgencyProjectsStatCard,
  AgencyProjectsStatHeader,
  AgencyProjectsStatLabel,
  AgencyProjectsStatValue,
  AgencyProjectsSearchBar,
  AgencyProjectsSearchIcon,
  AgencyProjectsFilterCard,
  AgencyProjectsFilterSection,
  AgencyProjectsFilterRow,
  AgencyProjectsFilterLabel,
  AgencyProjectsFilterButtons,
  AgencyProjectsFilterDivider,
  AgencyProjectsFilterActions,
  AgencyProjectsFilterLeft,
  AgencyProjectsSortButtons,
  AgencyProjectsList,
  AgencyProjectCard,
  AgencyProjectCardContent,
  AgencyProjectThumbnail,
  AgencyProjectInfo,
  AgencyProjectInfoHeader,
  AgencyProjectTitle,
  AgencyProjectGenre,
  AgencyProjectMeta,
  AgencyProjectMetaItem,
  AgencyProjectMetaDivider,
  AgencyProjectStatus,
  AgencyProjectStatusText,
  AgencyProjectEpisodeText,
  AgencyProjectsEmpty,
  AgencyProjectsEmptyText,
  AgencyProjectModal,
  AgencyProjectModalForm,
  AgencyProjectModalField,
  AgencyProjectModalLabel,
  AgencyProjectModalInput,
  AgencyProjectModalHelperText,
  AgencyProjectNextSchedulePreview,
  AgencyProjectModalSelect,
  AgencyProjectModalThumbnailPreview,
  AgencyProjectModalThumbnailPreviewLabel,
  AgencyProjectModalActions,
} from './AgencyProjectsPage.styled';

export function AgencyProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // 필터 상태
  const [statusFilters, setStatusFilters] = useState(['전체']);
  const [selectedManagerFilters, setSelectedManagerFilters] = useState([]);

  // 정렬 상태
  const [sortType, setSortType] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  // 작품 추가 폼 상태
  const [newProjectForm, setNewProjectForm] = useState({
    managerId: 0,
    artistName: '',
    title: '',
    platform: '네이버 웹툰',
    genre: '',
    schedule: '',
    startDate: '',
    thumbnail: '',
    thumbnailFile: null,
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

  // TODO: Zustand store mapping - 담당자 목록
  const [managers] = useState([
    { id: 1, name: '김담당자' },
    { id: 2, name: '이담당자' },
    { id: 3, name: '박담당자' },
    { id: 4, name: '최담당자' },
    { id: 5, name: '정담당자' },
  ]);

  // TODO: Zustand store mapping - 프로젝트 목록
  const [projects, setProjects] = useState([
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
  const toggleFilter = (filter) => {
    if (filter === '전체') {
      setStatusFilters(['전체']);
    } else {
      const newFilters = statusFilters.includes(filter)
        ? statusFilters.filter(f => f !== filter)
        : [...statusFilters.filter(f => f !== '전체'), filter];
      
      if (newFilters.length === 3 && newFilters.includes('연재중') && newFilters.includes('휴재') && newFilters.includes('완결')) {
        setStatusFilters(['전체']);
      } else {
        setStatusFilters(newFilters.length === 0 ? ['전체'] : newFilters);
      }
    }
  };

  // 검색 및 필터링된 프로젝트
  const filteredProjects = projects.filter(project => {
    const searchMatch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.managerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const statusMatch = statusFilters.includes('전체') || statusFilters.includes(project.serialStatus);
    const managerMatch = selectedManagerFilters.length === 0 || selectedManagerFilters.includes(project.managerId);
    
    return searchMatch && statusMatch && managerMatch;
  });

  // 정렬 핸들러
  const handleSort = (type) => {
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
      const getDeadlineValue = (deadline) => {
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

  // 다음 연재 일정 계산 함수
  const calculateNextScheduleDate = (startDate, scheduleDays) => {
    if (!startDate || !scheduleDays || isNaN(scheduleDays)) {
      return null;
    }

    const start = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);

    // 시작일부터 오늘까지 경과한 일수 계산
    const daysDiff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    
    // 다음 연재일 계산 (시작일 + (경과일수 / 주기 + 1) * 주기)
    const cyclesPassed = Math.floor(daysDiff / scheduleDays);
    const nextDate = new Date(start);
    nextDate.setDate(start.getDate() + (cyclesPassed + 1) * scheduleDays);

    // 오늘이 시작일보다 이전이면 시작일 반환
    if (daysDiff < 0) {
      return start;
    }

    return nextDate;
  };

  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 날짜를 한국어 형식으로 표시
  const formatDateKorean = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[d.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
  };

  // 프로젝트 렌더링 시 다음 연재 일정 계산 (렌더링 시점에 계산)
  const getNextScheduleDate = (project) => {
    if (project.nextScheduleDate) {
      return project.nextScheduleDate;
    }
    if (project.startDate && project.schedule && !isNaN(project.schedule)) {
      const nextDate = calculateNextScheduleDate(project.startDate, Number(project.schedule));
      return nextDate ? formatDate(nextDate) : null;
    }
    return null;
  };

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

    // 다음 연재 일정 계산
    const scheduleDays = newProjectForm.schedule ? Number(newProjectForm.schedule) : null;
    const nextScheduleDate = calculateNextScheduleDate(newProjectForm.startDate, scheduleDays);

    const newProject = {
      id: Date.now(),
      title: newProjectForm.title,
      platform: newProjectForm.platform,
      status: 'normal',
      serialStatus: '연재중',
      currentEpisode: 1,
      deadline: 'D-7',
      genre: newProjectForm.genre,
      schedule: newProjectForm.schedule || '미정',
      startDate: newProjectForm.startDate || null,
      nextScheduleDate: nextScheduleDate ? formatDate(nextScheduleDate) : null,
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
      startDate: '',
      thumbnail: '',
      thumbnailFile: null,
    });
    toast.success('작품이 추가되었습니다.');
  };

  // 썸네일 파일 선택 핸들러
  const handleThumbnailChange = (e) => {
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
        const result = event.target?.result;
        setNewProjectForm({
          ...newProjectForm,
          thumbnail: result,
          thumbnailFile: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowDetailPage(true);
  };

  // 통계 계산
  const stats = {
    totalManagers: new Set(projects.map(p => p.managerId)).size,
    totalProjects: projects.length,
    todayDeadlines: projects.filter(p => 
      p.deadline.includes('D-0') || p.deadline.includes('D-1') || p.deadline.includes('D-2')
    ).slice(0, 3).length,
  };

  // 상태별 배지 색상
  const getStatusBadgeColor = (status) => {
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

  // 작품 상세 페이지 표시
  if (showDetailPage && selectedProject) {
    return (
      <AgencyProjectDetailPage 
        project={selectedProject} 
        onBack={() => setShowDetailPage(false)} 
      />
    );
  }

  return (
    <AgencyProjectsRoot>
      <AgencyProjectsBody>
        {/* Header */}
        <AgencyProjectsHeader>
          <div>
            <AgencyProjectsTitle>전체 프로젝트</AgencyProjectsTitle>
            <AgencyProjectsDescription>에이전시의 모든 프로젝트를 조회하세요</AgencyProjectsDescription>
          </div>
        </AgencyProjectsHeader>

        {/* 상단 통계 카드 */}
        <AgencyProjectsStatsGrid>
          <AgencyProjectsStatCard>
            <AgencyProjectsStatHeader>
              <BookOpen className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              <AgencyProjectsStatLabel>전체 프로젝트 수</AgencyProjectsStatLabel>
            </AgencyProjectsStatHeader>
            <AgencyProjectsStatValue>{stats.totalProjects}개</AgencyProjectsStatValue>
          </AgencyProjectsStatCard>
          <AgencyProjectsStatCard>
            <AgencyProjectsStatHeader>
              <AlertCircle className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              <AgencyProjectsStatLabel>마감 임박 작품</AgencyProjectsStatLabel>
            </AgencyProjectsStatHeader>
            <AgencyProjectsStatValue>{stats.todayDeadlines}개</AgencyProjectsStatValue>
          </AgencyProjectsStatCard>
          <AgencyProjectsStatCard>
            <AgencyProjectsStatHeader>
              <BookOpen className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              <AgencyProjectsStatLabel>총 담당자 수</AgencyProjectsStatLabel>
            </AgencyProjectsStatHeader>
            <AgencyProjectsStatValue>{stats.totalManagers}명</AgencyProjectsStatValue>
          </AgencyProjectsStatCard>
        </AgencyProjectsStatsGrid>

        {/* 검색 바 */}
        <AgencyProjectsSearchBar>
          <AgencyProjectsSearchIcon>
            <Search className="w-4 h-4" />
          </AgencyProjectsSearchIcon>
          <Input
            type="text"
            placeholder="프로젝트명, 작가명 또는 담당자명으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </AgencyProjectsSearchBar>

        {/* 필터 영역 */}
        <AgencyProjectsFilterCard>
          <AgencyProjectsFilterSection>
            {/* 담당자 카테고리 탭 */}
            <AgencyProjectsFilterRow>
              <AgencyProjectsFilterLabel>담당자:</AgencyProjectsFilterLabel>
              <AgencyProjectsFilterButtons>
                <Button
                  variant={selectedManagerFilters.length === 0 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedManagerFilters([])}
                  className={selectedManagerFilters.length === 0 ? 'bg-primary' : ''}
                >
                  전체 인원
                </Button>
                {managers.map((manager) => (
                  <Button
                    key={manager.id}
                    variant={selectedManagerFilters.includes(manager.id) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      let newFilters = [...selectedManagerFilters];
                      
                      if (selectedManagerFilters.includes(manager.id)) {
                        newFilters = newFilters.filter(id => id !== manager.id);
                      } else {
                        newFilters.push(manager.id);
                      }
                      
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
                ))}
              </AgencyProjectsFilterButtons>
            </AgencyProjectsFilterRow>

            {/* 구분선 */}
            <AgencyProjectsFilterDivider />

            {/* 작품 상태 필터 & 정렬 */}
            <AgencyProjectsFilterActions>
              <AgencyProjectsFilterLeft>
                <AgencyProjectsFilterLabel>상태:</AgencyProjectsFilterLabel>
                <AgencyProjectsFilterButtons>
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
                </AgencyProjectsFilterButtons>
              </AgencyProjectsFilterLeft>

              {/* 정렬 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AgencyProjectsFilterLabel>정렬:</AgencyProjectsFilterLabel>
                <AgencyProjectsSortButtons>
                  <Button
                    variant={sortType === 'name' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSort('name')}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    가나다순
                    {sortType === 'name' && (
                      <>
                        <ArrowUpDown className="w-3 h-3" />
                        <span style={{ fontSize: '12px' }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant={sortType === 'deadline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSort('deadline')}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    마감일순
                    {sortType === 'deadline' && (
                      <>
                        <ArrowUpDown className="w-3 h-3" />
                        <span style={{ fontSize: '12px' }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      </>
                    )}
                  </Button>
                </AgencyProjectsSortButtons>
              </div>
            </AgencyProjectsFilterActions>
          </AgencyProjectsFilterSection>
        </AgencyProjectsFilterCard>

        {/* 작품 리스트 */}
        <AgencyProjectsList>
          {sortedProjects.map((project) => (
            <AgencyProjectCard key={project.id} onClick={() => handleProjectClick(project)}>
              <AgencyProjectCardContent>
                {/* 왼쪽: 썸네일 */}
                <AgencyProjectThumbnail>
                  <ImageWithFallback
                    src={project.thumbnail || 'https://images.unsplash.com/photo-1591788806059-cb6e2f6a2498?w=400'}
                    alt={project.title}
                    className="w-24 h-32 object-cover rounded-md border-2 border-border"
                  />
                </AgencyProjectThumbnail>

                {/* 가운데: 작품 정보 */}
                <AgencyProjectInfo>
                  <AgencyProjectInfoHeader>
                    <AgencyProjectTitle>{project.title}</AgencyProjectTitle>
                    <Badge variant="outline" className="text-xs">
                      {project.artistName}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-primary/10">
                      {project.managerName}
                    </Badge>
                  </AgencyProjectInfoHeader>
                  <AgencyProjectGenre>{project.genre}</AgencyProjectGenre>
                  <AgencyProjectMeta>
                    <AgencyProjectMetaItem>
                      <BookOpen className="w-3 h-3" />
                      <span>{project.platform}</span>
                    </AgencyProjectMetaItem>
                    <AgencyProjectMetaDivider>•</AgencyProjectMetaDivider>
                    <AgencyProjectMetaItem>
                      <Calendar className="w-3 h-3" />
                      <span>{project.schedule && !isNaN(project.schedule) ? `${project.schedule}일` : project.schedule || '미정'}</span>
                    </AgencyProjectMetaItem>
                    {getNextScheduleDate(project) && (
                      <>
                        <AgencyProjectMetaDivider>•</AgencyProjectMetaDivider>
                        <AgencyProjectMetaItem>
                          <Calendar className="w-3 h-3" />
                          <span>다음: {formatDateKorean(getNextScheduleDate(project))}</span>
                        </AgencyProjectMetaItem>
                      </>
                    )}
                  </AgencyProjectMeta>
                </AgencyProjectInfo>

                {/* 오른쪽: 상태 정보 */}
                <AgencyProjectStatus>
                  <Badge className={getStatusBadgeColor(project.serialStatus)}>
                    {project.serialStatus}
                  </Badge>
                  <AgencyProjectStatusText>현재 {project.currentEpisode}화</AgencyProjectStatusText>
                  <AgencyProjectEpisodeText>마감: {project.deadline}</AgencyProjectEpisodeText>
                </AgencyProjectStatus>
              </AgencyProjectCardContent>
            </AgencyProjectCard>
          ))}

          {sortedProjects.length === 0 && (
            <Card className="p-12">
              <AgencyProjectsEmpty>
                <AlertCircle className="w-12 h-12" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }} />
                <AgencyProjectsEmptyText>해당 조건의 작품이 없습니다</AgencyProjectsEmptyText>
              </AgencyProjectsEmpty>
            </Card>
          )}
        </AgencyProjectsList>
      </AgencyProjectsBody>

      {/* 작품 추가 모달 */}
      {isAddModalOpen && (
        <AgencyProjectModal>
          <Card className="w-full max-w-lg mx-4 p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">프로젝트 추가</h2>
            <AgencyProjectModalForm>
              {/* 담당자 선택 */}
              <AgencyProjectModalField>
                <AgencyProjectModalLabel>
                  담당자 선택 <span style={{ color: 'var(--destructive)' }}>*</span>
                </AgencyProjectModalLabel>
                <AgencyProjectModalSelect
                  value={newProjectForm.managerId}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, managerId: Number(e.target.value) })}
                >
                  <option value={0}>담당자를 선택하세요</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </AgencyProjectModalSelect>
              </AgencyProjectModalField>

              {/* 작가명 */}
              <AgencyProjectModalField>
                <AgencyProjectModalLabel>
                  작가명 <span style={{ color: 'var(--destructive)' }}>*</span>
                </AgencyProjectModalLabel>
                <AgencyProjectModalInput
                  type="text"
                  value={newProjectForm.artistName}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, artistName: e.target.value })}
                  placeholder="작가명을 입력하세요"
                />
              </AgencyProjectModalField>

              {/* 프로젝트명 */}
              <AgencyProjectModalField>
                <AgencyProjectModalLabel>
                  프로젝트명 <span style={{ color: 'var(--destructive)' }}>*</span>
                </AgencyProjectModalLabel>
                <AgencyProjectModalInput
                  type="text"
                  value={newProjectForm.title}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                  placeholder="프로젝트명을 입력하세요"
                />
              </AgencyProjectModalField>

              {/* 장르 */}
              <AgencyProjectModalField>
                <AgencyProjectModalLabel>
                  장르 <span style={{ color: 'var(--destructive)' }}>*</span>
                </AgencyProjectModalLabel>
                <AgencyProjectModalInput
                  type="text"
                  value={newProjectForm.genre}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, genre: e.target.value })}
                  placeholder="예: 로맨스/판타지"
                />
              </AgencyProjectModalField>

              {/* 플랫폼 선택 */}
              <AgencyProjectModalField>
                <AgencyProjectModalLabel>
                  플랫폼 <span style={{ color: 'var(--destructive)' }}>*</span>
                </AgencyProjectModalLabel>
                <AgencyProjectModalSelect
                  value={newProjectForm.platform}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, platform: e.target.value })}
                >
                  <option>네이버 웹툰</option>
                  <option>카카오페이지</option>
                  <option>카카오웹툰</option>
                  <option>레진코믹스</option>
                  <option>네이버 시리즈</option>
                  <option>리디북스</option>
                  <option>탑툰</option>
                </AgencyProjectModalSelect>
              </AgencyProjectModalField>

              {/* 연재 주기 */}
              <AgencyProjectModalField>
                <AgencyProjectModalLabel>연재 주기</AgencyProjectModalLabel>
                <AgencyProjectModalInput
                  type="number"
                  min="1"
                  value={newProjectForm.schedule}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, schedule: e.target.value })}
                  placeholder="예: 7 (일 단위)"
                />
                <AgencyProjectModalHelperText>연재 주기를 일 단위로 입력하세요 (예: 7일, 14일 등)</AgencyProjectModalHelperText>
              </AgencyProjectModalField>

              {/* 연재 시작일 */}
              <AgencyProjectModalField>
                <AgencyProjectModalLabel>연재 시작일</AgencyProjectModalLabel>
                <AgencyProjectModalInput
                  type="date"
                  value={newProjectForm.startDate}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, startDate: e.target.value })}
                />
                <AgencyProjectModalHelperText>연재 시작일을 선택하면 다음 연재 일정이 자동으로 계산됩니다</AgencyProjectModalHelperText>
                {newProjectForm.startDate && newProjectForm.schedule && !isNaN(newProjectForm.schedule) && (
                  <AgencyProjectNextSchedulePreview>
                    다음 연재 예정일: {formatDateKorean(calculateNextScheduleDate(newProjectForm.startDate, Number(newProjectForm.schedule)))}
                  </AgencyProjectNextSchedulePreview>
                )}
              </AgencyProjectModalField>

              {/* 썸네일 */}
              <AgencyProjectModalField>
                <AgencyProjectModalLabel>썸네일 첨부 (선택)</AgencyProjectModalLabel>
                <AgencyProjectModalInput
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  style={{ padding: '10px' }}
                />
                {newProjectForm.thumbnail && (
                  <AgencyProjectModalThumbnailPreview>
                    <AgencyProjectModalThumbnailPreviewLabel>미리보기:</AgencyProjectModalThumbnailPreviewLabel>
                    <ImageWithFallback
                      src={newProjectForm.thumbnail}
                      alt="썸네일 미리보기"
                      className="w-24 h-32 object-cover rounded-md border-2 border-border"
                    />
                  </AgencyProjectModalThumbnailPreview>
                )}
              </AgencyProjectModalField>

              {/* 버튼 */}
              <AgencyProjectModalActions>
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
              </AgencyProjectModalActions>
            </AgencyProjectModalForm>
          </Card>
        </AgencyProjectModal>
      )}
    </AgencyProjectsRoot>
  );
}
