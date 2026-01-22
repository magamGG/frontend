import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import { BookOpen, Users, Calendar, AlertCircle, Plus, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ProjectDetailPage } from '@/pages/ProjectDetail';
import {
  AdminProjectsRoot,
  AdminProjectsBody,
  AdminProjectsHeader,
  AdminProjectsHeaderLeft,
  AdminProjectsTitle,
  AdminProjectsDescription,
  AdminProjectsStatsGrid,
  AdminProjectsStatCard,
  AdminProjectsStatHeader,
  AdminProjectsStatLabel,
  AdminProjectsStatValue,
  AdminProjectsFilterCard,
  AdminProjectsFilterSection,
  AdminProjectsFilterRow,
  AdminProjectsFilterLabel,
  AdminProjectsFilterButtons,
  AdminProjectsFilterDivider,
  AdminProjectsFilterActions,
  AdminProjectsFilterLeft,
  AdminProjectsSortButtons,
  AdminProjectsList,
  AdminProjectCard,
  AdminProjectCardContent,
  AdminProjectThumbnail,
  AdminProjectInfo,
  AdminProjectInfoHeader,
  AdminProjectTitle,
  AdminProjectGenre,
  AdminProjectMeta,
  AdminProjectMetaItem,
  AdminProjectMetaDivider,
  AdminProjectStatus,
  AdminProjectStatusText,
  AdminProjectEpisodeText,
  AdminProjectsEmpty,
  AdminProjectsEmptyText,
  AdminProjectModalForm,
  AdminProjectModalField,
  AdminProjectModalLabel,
  AdminProjectModalInput,
  AdminProjectModalSelect,
  AdminProjectModalThumbnailPreview,
  AdminProjectModalThumbnailPreviewLabel,
  AdminProjectModalActions,
} from './AdminProjectsPage.styled';

export function AdminProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [statusFilters, setStatusFilters] = useState(['전체']);
  const [selectedArtistFilter, setSelectedArtistFilter] = useState(null);

  const [sortType, setSortType] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const [newProjectForm, setNewProjectForm] = useState({
    artistId: 0,
    title: '',
    platform: '네이버 웹툰',
    genre: '',
    schedule: '',
    thumbnail: '',
    thumbnailFile: null,
  });

  useEffect(() => {
    const headerTitle = document.querySelector('h1.text-2xl.font-bold');
    if (headerTitle) {
      if (showDetailPage) {
        headerTitle.textContent = '프로젝트 상세';
      } else {
        headerTitle.textContent = '프로젝트 관리';
      }
    }
  }, [showDetailPage]);

  // TODO: Zustand store mapping - 작가 목록
  const [artists] = useState([
    { id: 1, name: '김작가' },
    { id: 2, name: '이작가' },
    { id: 3, name: '박작가' },
    { id: 4, name: '최작가' },
    { id: 5, name: '정작가' },
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
      artistName: '김작가',
      artistId: 1,
    },
  ]);

  useEffect(() => {
    const stored = localStorage.getItem('adminProjectsData');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.length > 0) {
        setProjects(data);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('adminProjectsData', JSON.stringify(projects));
  }, [projects]);

  const toggleFilter = (filter) => {
    if (filter === '전체') {
      setStatusFilters(['전체']);
    } else {
      const newFilters = statusFilters.includes(filter) ? statusFilters.filter((f) => f !== filter) : [...statusFilters.filter((f) => f !== '전체'), filter];

      setStatusFilters(newFilters.length === 0 ? ['전체'] : newFilters);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const statusMatch = statusFilters.includes('전체') || statusFilters.includes(project.serialStatus);
    const artistMatch = !selectedArtistFilter || project.artistId === selectedArtistFilter;

    return statusMatch && artistMatch;
  });

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

  const handleAddProject = () => {
    if (!newProjectForm.artistId || !newProjectForm.title || !newProjectForm.genre) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    const selectedArtist = artists.find((a) => a.id === newProjectForm.artistId);
    if (!selectedArtist) {
      toast.error('작가를 선택해주세요.');
      return;
    }

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
      thumbnail: newProjectForm.thumbnail || 'https://images.unsplash.com/photo-1591788806059-cb6e2f6a2498?w=400',
      artistName: selectedArtist.name,
      artistId: newProjectForm.artistId,
    };

    setProjects([...projects, newProject]);
    setIsAddModalOpen(false);
    setNewProjectForm({
      artistId: 0,
      title: '',
      platform: '네이버 웹툰',
      genre: '',
      schedule: '',
      thumbnail: '',
      thumbnailFile: null,
    });
    toast.success('작품이 추가되었습니다.');
  };

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

  const stats = {
    totalArtists: new Set(projects.map((p) => p.artistId)).size,
    totalProjects: projects.length,
    todayDeadlines: projects.filter((p) => p.deadline.includes('D-0') || p.deadline.includes('D-1') || p.deadline.includes('D-2')).slice(0, 3).length,
  };

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

  if (showDetailPage && selectedProject) {
    return <ProjectDetailPage project={selectedProject} onBack={() => setShowDetailPage(false)} />;
  }

  return (
    <AdminProjectsRoot>
      <AdminProjectsBody>
        {/* Header */}
        <AdminProjectsHeader>
          <AdminProjectsHeaderLeft>
            <AdminProjectsTitle>프로젝트 관리</AdminProjectsTitle>
            <AdminProjectsDescription>담당 작가들의 작품을 관리하세요</AdminProjectsDescription>
          </AdminProjectsHeaderLeft>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            프로젝트 추가
          </Button>
        </AdminProjectsHeader>

        {/* 상단 통계 카드 */}
        <AdminProjectsStatsGrid>
          <AdminProjectsStatCard>
            <AdminProjectsStatHeader>
              <Users className="w-4 h-4 text-muted-foreground" />
              <AdminProjectsStatLabel>팀당 작가 수</AdminProjectsStatLabel>
            </AdminProjectsStatHeader>
            <AdminProjectsStatValue>{stats.totalArtists}명</AdminProjectsStatValue>
          </AdminProjectsStatCard>
          <AdminProjectsStatCard>
            <AdminProjectsStatHeader>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <AdminProjectsStatLabel>담당 프로젝트 수</AdminProjectsStatLabel>
            </AdminProjectsStatHeader>
            <AdminProjectsStatValue>{stats.totalProjects}개</AdminProjectsStatValue>
          </AdminProjectsStatCard>
          <AdminProjectsStatCard>
            <AdminProjectsStatHeader>
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
              <AdminProjectsStatLabel>오늘 마감 작품</AdminProjectsStatLabel>
            </AdminProjectsStatHeader>
            <AdminProjectsStatValue>{stats.todayDeadlines}개</AdminProjectsStatValue>
          </AdminProjectsStatCard>
        </AdminProjectsStatsGrid>

        {/* 필터 영역 */}
        <AdminProjectsFilterCard>
          <AdminProjectsFilterSection>
            {/* 작가 카테고리 탭 */}
            <AdminProjectsFilterRow>
              <AdminProjectsFilterLabel>작가:</AdminProjectsFilterLabel>
              <AdminProjectsFilterButtons>
                <Button variant={selectedArtistFilter === null ? 'default' : 'outline'} size="sm" onClick={() => setSelectedArtistFilter(null)} className={selectedArtistFilter === null ? 'bg-primary' : ''}>
                  전체
                </Button>
                {artists.map((artist) => (
                  <Button
                    key={artist.id}
                    variant={selectedArtistFilter === artist.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedArtistFilter(artist.id)}
                    className={selectedArtistFilter === artist.id ? 'bg-primary' : ''}
                  >
                    {artist.name}
                  </Button>
                ))}
              </AdminProjectsFilterButtons>
            </AdminProjectsFilterRow>

            <AdminProjectsFilterDivider />

            {/* 작품 상태 필터 & 정렬 */}
            <AdminProjectsFilterActions>
              <AdminProjectsFilterLeft>
                <AdminProjectsFilterLabel>상태:</AdminProjectsFilterLabel>
                <AdminProjectsFilterButtons>
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
                </AdminProjectsFilterButtons>
              </AdminProjectsFilterLeft>

              <AdminProjectsSortButtons>
                <AdminProjectsFilterLabel>정렬:</AdminProjectsFilterLabel>
                <Button variant={sortType === 'name' ? 'default' : 'outline'} size="sm" onClick={() => handleSort('name')} className="flex items-center gap-1">
                  가나다순
                  {sortType === 'name' && <ArrowUpDown className="w-3 h-3" />}
                  {sortType === 'name' && <span className="text-xs ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                </Button>
                <Button variant={sortType === 'deadline' ? 'default' : 'outline'} size="sm" onClick={() => handleSort('deadline')} className="flex items-center gap-1">
                  마감일순
                  {sortType === 'deadline' && <ArrowUpDown className="w-3 h-3" />}
                  {sortType === 'deadline' && <span className="text-xs ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                </Button>
              </AdminProjectsSortButtons>
            </AdminProjectsFilterActions>
          </AdminProjectsFilterSection>
        </AdminProjectsFilterCard>

        {/* 작품 리스트 */}
        <AdminProjectsList>
          {sortedProjects.map((project) => (
            <AdminProjectCard key={project.id} onClick={() => handleProjectClick(project)}>
              <AdminProjectCardContent>
                <AdminProjectThumbnail>
                  <ImageWithFallback
                    src={project.thumbnail || 'https://images.unsplash.com/photo-1591788806059-cb6e2f6a2498?w=400'}
                    alt={project.title}
                    className="w-24 h-32 object-cover rounded-md border-2 border-border"
                  />
                </AdminProjectThumbnail>
                <AdminProjectInfo>
                  <AdminProjectInfoHeader>
                    <AdminProjectTitle>{project.title}</AdminProjectTitle>
                    <Badge variant="outline" className="text-xs">
                      {project.artistName}
                    </Badge>
                  </AdminProjectInfoHeader>
                  <AdminProjectGenre>{project.genre}</AdminProjectGenre>
                  <AdminProjectMeta>
                    <AdminProjectMetaItem>
                      <BookOpen className="w-3 h-3" />
                      {project.platform}
                    </AdminProjectMetaItem>
                    <AdminProjectMetaDivider>•</AdminProjectMetaDivider>
                    <AdminProjectMetaItem>
                      <Calendar className="w-3 h-3" />
                      {project.schedule}
                    </AdminProjectMetaItem>
                  </AdminProjectMeta>
                </AdminProjectInfo>
                <AdminProjectStatus>
                  <Badge className={getStatusBadgeColor(project.serialStatus)}>{project.serialStatus}</Badge>
                  <AdminProjectEpisodeText>현재 {project.currentEpisode}화</AdminProjectEpisodeText>
                  <AdminProjectStatusText>마감: {project.deadline}</AdminProjectStatusText>
                </AdminProjectStatus>
              </AdminProjectCardContent>
            </AdminProjectCard>
          ))}

          {sortedProjects.length === 0 && (
            <AdminProjectsEmpty>
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <AdminProjectsEmptyText>해당 조건의 작품이 없습니다</AdminProjectsEmptyText>
            </AdminProjectsEmpty>
          )}
        </AdminProjectsList>
      </AdminProjectsBody>

      {/* 작품 추가 모달 */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="프로젝트 추가">
        <AdminProjectModalForm>
          {/* 작가 선택 */}
          <AdminProjectModalField>
            <AdminProjectModalLabel>
              작가 선택 <span className="text-red-500">*</span>
            </AdminProjectModalLabel>
            <AdminProjectModalSelect value={newProjectForm.artistId} onChange={(e) => setNewProjectForm({ ...newProjectForm, artistId: Number(e.target.value) })}>
              <option value={0}>작가를 선택하세요</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </AdminProjectModalSelect>
          </AdminProjectModalField>

          {/* 프로젝트명 */}
          <AdminProjectModalField>
            <AdminProjectModalLabel>
              프로젝트명 <span className="text-red-500">*</span>
            </AdminProjectModalLabel>
            <AdminProjectModalInput
              type="text"
              value={newProjectForm.title}
              onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
              placeholder="프로젝트명을 입력하세요"
            />
          </AdminProjectModalField>

          {/* 장르 */}
          <AdminProjectModalField>
            <AdminProjectModalLabel>
              장르 <span className="text-red-500">*</span>
            </AdminProjectModalLabel>
            <AdminProjectModalInput type="text" value={newProjectForm.genre} onChange={(e) => setNewProjectForm({ ...newProjectForm, genre: e.target.value })} placeholder="예: 로맨스/판타지" />
          </AdminProjectModalField>

          {/* 플랫폼 선택 */}
          <AdminProjectModalField>
            <AdminProjectModalLabel>
              플랫폼 <span className="text-red-500">*</span>
            </AdminProjectModalLabel>
            <AdminProjectModalSelect value={newProjectForm.platform} onChange={(e) => setNewProjectForm({ ...newProjectForm, platform: e.target.value })}>
              <option>네이버 웹툰</option>
              <option>카카오페이지</option>
              <option>카카오웹툰</option>
              <option>레진코믹스</option>
              <option>네이버 시리즈</option>
              <option>리디북스</option>
              <option>탑툰</option>
            </AdminProjectModalSelect>
          </AdminProjectModalField>

          {/* 연재 일정 */}
          <AdminProjectModalField>
            <AdminProjectModalLabel>연재 일정</AdminProjectModalLabel>
            <AdminProjectModalInput type="text" value={newProjectForm.schedule} onChange={(e) => setNewProjectForm({ ...newProjectForm, schedule: e.target.value })} placeholder="예: 매주 일요일 오전 10시" />
          </AdminProjectModalField>

          {/* 썸네일 */}
          <AdminProjectModalField>
            <AdminProjectModalLabel>썸네일 첨부 (선택)</AdminProjectModalLabel>
            <AdminProjectModalInput type="file" accept="image/*" onChange={handleThumbnailChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            {newProjectForm.thumbnail && (
              <AdminProjectModalThumbnailPreview>
                <AdminProjectModalThumbnailPreviewLabel>미리보기:</AdminProjectModalThumbnailPreviewLabel>
                <ImageWithFallback src={newProjectForm.thumbnail} alt="썸네일 미리보기" className="w-24 h-32 object-cover rounded-md border-2 border-border" />
              </AdminProjectModalThumbnailPreview>
            )}
          </AdminProjectModalField>

          {/* 버튼 */}
          <AdminProjectModalActions>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
              취소
            </Button>
            <Button onClick={handleAddProject} className="flex-1 bg-primary hover:bg-primary/90">
              등록
            </Button>
          </AdminProjectModalActions>
        </AdminProjectModalForm>
      </Modal>
    </AdminProjectsRoot>
  );
}
