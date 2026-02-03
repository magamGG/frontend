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
import useAuthStore from '@/store/authStore';
import { memberService, projectService } from '@/api/services';
import { getProjectThumbnailUrl, PROJECT_THUMBNAIL_PLACEHOLDER } from '@/api/config';
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
  AgencyProjectMetaGroup,
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
  const [statusFilter, setStatusFilter] = useState('전체');
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

  const { user } = useAuthStore();
  const agencyNo = user?.agencyNo;
  const memberNo = user?.memberNo;

  const [managers, setManagers] = useState([]);
  const [managersLoading, setManagersLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateNextScheduleDate = (startDate, scheduleDays) => {
    if (!startDate || !scheduleDays || isNaN(scheduleDays)) return null;
    const start = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    if (daysDiff < 0) return start;
    const cyclesPassed = Math.floor(daysDiff / scheduleDays);
    const nextDate = new Date(start);
    nextDate.setDate(start.getDate() + (cyclesPassed + 1) * scheduleDays);
    return nextDate;
  };

  const getDeadlineDn = (date) => {
    if (!date) return '미정';
    const next = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    next.setHours(0, 0, 0, 0);
    const daysDiff = Math.round((next - today) / (1000 * 60 * 60 * 24));
    if (daysDiff > 0) return `D-${daysDiff}`;
    if (daysDiff === 0) return 'D-Day';
    return `D+${Math.abs(daysDiff)}`;
  };

  const mapApiProjectToFrontend = (p) => {
    const startDateStr = p.projectStartedAt
      ? (typeof p.projectStartedAt === 'string' ? p.projectStartedAt.slice(0, 10) : null)
      : null;
    const nextDate = calculateNextScheduleDate(startDateStr, p.projectCycle);
    const deadlineDn = nextDate ? getDeadlineDn(nextDate) : '미정';
    return {
      id: p.projectNo,
      title: p.projectName,
      platform: p.platform || '미정',
      status: 'normal',
      serialStatus: p.projectStatus || '연재',
      currentEpisode: 0,
      deadline: deadlineDn,
      genre: p.projectGenre || '',
      schedule: p.projectCycle ? `${p.projectCycle}일` : '미정',
      scheduleDays: p.projectCycle ?? null,
      startDate: startDateStr,
      nextScheduleDate: nextDate ? formatDate(nextDate) : null,
      thumbnail: p.thumbnailFile || null,
      artistName: p.artistName || '',
      artistId: p.artistMemberNo,
      managerName: p.managerName ?? '',
      managerId: p.managerMemberNo ?? null,
      projectColor: p.projectColor || '#6E8FB3',
    };
  };

  // 담당자 목록 API 조회
  useEffect(() => {
    if (!agencyNo) return;
    const fetchManagers = async () => {
      setManagersLoading(true);
      try {
        const response = await memberService.getManagersByAgency(agencyNo);
        const list = Array.isArray(response) ? response : response?.data ?? [];
        setManagers(list.map((m) => ({ id: m.memberNo, name: m.memberName || m.memberEmail })));
      } catch (err) {
        toast.error('담당자 목록을 불러오는데 실패했습니다.');
        setManagers([]);
      } finally {
        setManagersLoading(false);
      }
    };
    fetchManagers();
  }, [agencyNo]);

  // 프로젝트 목록 API 조회 — 에이전시에 있는 모든 프로젝트 (agencyNo 기준)
  useEffect(() => {
    if (!agencyNo) return;
    const fetchProjects = async () => {
      setProjectsLoading(true);
      try {
        const list = await projectService.getProjectsByAgency(agencyNo);
        const arr = Array.isArray(list) ? list : list?.content ?? list?.data ?? [];
        setProjects(arr.map((p) => mapApiProjectToFrontend(p)));
      } catch (err) {
        toast.error(err?.response?.data?.message || '프로젝트 목록을 불러오는데 실패했습니다.');
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, [agencyNo]);

  // 상태 필터 선택 핸들러 (단일 선택)
  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
  };

  // 검색 및 필터링된 프로젝트
  const filteredProjects = projects.filter(project => {
    const searchMatch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.managerName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch = statusFilter === '전체' || statusFilter === project.serialStatus;
    const managerMatch =
      selectedManagerFilters.length === 0 ||
      project.managerId == null ||
      selectedManagerFilters.includes(project.managerId);

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
      serialStatus: '연재',
      currentEpisode: 1,
      deadline: 'D-7',
      genre: newProjectForm.genre,
      schedule: newProjectForm.schedule || '미정',
      scheduleDays: scheduleDays ?? null,
      startDate: newProjectForm.startDate || null,
      nextScheduleDate: nextScheduleDate ? formatDate(nextScheduleDate) : null,
      thumbnail: newProjectForm.thumbnail || null,
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
    totalManagers: new Set(projects.map((p) => p.managerId).filter(Boolean)).size,
    totalProjects: projects.length,
    todayDeadlines: projects.filter(p => 
      p.deadline.includes('D-0') || p.deadline.includes('D-1') || p.deadline.includes('D-2')
    ).slice(0, 3).length,
  };

  // 상태별 배지 색상
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case '연재':
        return 'bg-green-500 hover:bg-green-600';
      case '휴재':
        return 'bg-orange-500 hover:bg-orange-600';
      case '완결':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  // 에이전시의 모든 프로젝트 조회는 MEMBER_ROLE이 '에이전시 관리자'일 때만 이용 가능
  if (user?.memberRole !== '에이전시 관리자') {
    return (
      <AgencyProjectsRoot>
        <AgencyProjectsBody>
          <Card className="p-12 flex flex-col items-center justify-center gap-4 min-h-[400px]">
            <AlertCircle className="w-16 h-16 text-muted-foreground opacity-60" />
            <p className="text-lg font-medium text-foreground">접근 권한이 없습니다</p>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              이 페이지는 에이전시 관리자만 이용할 수 있습니다.
            </p>
          </Card>
        </AgencyProjectsBody>
      </AgencyProjectsRoot>
    );
  }

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
                  {['전체', '연재', '휴재', '완결'].map((filter) => (
                    <Button
                      key={filter}
                      variant={statusFilter === filter ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange(filter)}
                      className={statusFilter === filter ? getStatusBadgeColor(filter === '전체' ? '' : filter) : ''}
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
          {projectsLoading ? (
            <Card className="p-12">
              <AgencyProjectsEmpty>
                <AlertCircle className="w-12 h-12" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }} />
                <AgencyProjectsEmptyText>프로젝트 목록을 불러오는 중...</AgencyProjectsEmptyText>
              </AgencyProjectsEmpty>
            </Card>
          ) : (
          <>
          {sortedProjects.map((project) => (
            <AgencyProjectCard key={project.id} onClick={() => handleProjectClick(project)}>
              <AgencyProjectCardContent>
                {/* 왼쪽: 썸네일 */}
                <AgencyProjectThumbnail>
                  <ImageWithFallback
                    src={getProjectThumbnailUrl(project.thumbnail) || PROJECT_THUMBNAIL_PLACEHOLDER}
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
                    <AgencyProjectMetaGroup>
                      <AgencyProjectMetaDivider>•</AgencyProjectMetaDivider>
                      <AgencyProjectMetaItem>
                        <Calendar className="w-3 h-3" />
                        <span>{project.schedule && !isNaN(project.schedule) ? `${project.schedule}일` : project.schedule || '미정'}</span>
                      </AgencyProjectMetaItem>
                    </AgencyProjectMetaGroup>
                  </AgencyProjectMeta>
                </AgencyProjectInfo>

                {/* 오른쪽: 상태 정보 */}
                <AgencyProjectStatus>
                  <Badge className={getStatusBadgeColor(project.serialStatus)}>
                    {project.serialStatus}
                  </Badge>
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
          </>
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
