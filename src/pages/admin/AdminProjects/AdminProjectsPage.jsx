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
  FilterSection,
  FilterRow,
  FilterLabel,
  FilterButtonGroup,
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
  AdminProjectsEmptyIcon,
  AdminProjectsEmptyText,
  AdminProjectModalForm,
  AdminProjectModalField,
  AdminProjectModalLabel,
  AdminProjectModalInput,
  AdminProjectModalHelperText,
  AdminProjectNextSchedulePreview,
  AdminProjectModalSelect,
  AdminProjectModalThumbnailPreview,
  AdminProjectModalThumbnailPreviewLabel,
  AdminProjectModalActions,
  StatusBadge,
  RequiredMark,
  ThumbnailImage,
  PrimaryButton,
  FilterButton,
  SortButton,
  FullWidthButton,
  ArtistBadge,
} from './AdminProjectsPage.styled';

export function AdminProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState('전체');
  const [selectedArtistFilter, setSelectedArtistFilter] = useState(null);

  const [sortType, setSortType] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const [newProjectForm, setNewProjectForm] = useState({
    artistId: 0,
    title: '',
    platform: '네이버 웹툰',
    genre: '',
    schedule: '',
    startDate: '',
    thumbnail: '',
    thumbnailFile: null,
  });

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
    const headerTitle = document.querySelector('h1.text-2xl.font-bold');
    if (headerTitle) {
      if (showDetailPage) {
        headerTitle.textContent = '프로젝트 상세';
      } else {
        headerTitle.textContent = '프로젝트 관리';
      }
    }
  }, [showDetailPage]);

  // localStorage에서 선택된 프로젝트 ID 확인 및 자동 이동
  useEffect(() => {
    const selectedProjectId = localStorage.getItem('selectedProjectId');
    if (selectedProjectId && !showDetailPage) {
      const projectId = parseInt(selectedProjectId, 10);
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setSelectedProject(project);
        setShowDetailPage(true);
        // 사용 후 제거
        localStorage.removeItem('selectedProjectId');
      }
    }
  }, [projects, showDetailPage]);

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

  // 상태 필터 선택 핸들러 (단일 선택)
  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
  };

  // 상태별 배지 색상 (작가 계정과 동일)
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

  // 필터링된 프로젝트
  const filteredProjects = projects.filter((project) => {
    const statusMatch = statusFilter === '전체' || statusFilter === project.serialStatus;
    const artistMatch = !selectedArtistFilter || project.artistId === selectedArtistFilter;
    return statusMatch && artistMatch;
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
      startDate: '',
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
          <PrimaryButton onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            프로젝트 추가
          </PrimaryButton>
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

        {/* 필터 영역 (하나로 합침) */}
        <FilterSection>
          {/* 작가별 필터 */}
          <FilterRow>
            <FilterLabel>작가:</FilterLabel>
            <FilterButtonGroup>
              <Button
                variant={selectedArtistFilter === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedArtistFilter(null)}
              >
                전체
              </Button>
              {artists.map((artist) => (
                <Button
                  key={artist.id}
                  variant={selectedArtistFilter === artist.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedArtistFilter(artist.id)}
                >
                  {artist.name}
                </Button>
              ))}
            </FilterButtonGroup>
          </FilterRow>

          {/* 상태 필터 */}
          <FilterRow>
            <FilterLabel>상태:</FilterLabel>
            <FilterButtonGroup>
              {['전체', '연재중', '휴재', '완결'].map((filter) => (
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
            </FilterButtonGroup>
          </FilterRow>
        </FilterSection>

        {/* 작품 리스트 */}
        <AdminProjectsList>
          {filteredProjects.map((project) => (
            <AdminProjectCard key={project.id} onClick={() => handleProjectClick(project)}>
              <AdminProjectCardContent>
                <AdminProjectThumbnail>
                  <ThumbnailImage
                    src={project.thumbnail || 'https://images.unsplash.com/photo-1591788806059-cb6e2f6a2498?w=400'}
                    alt={project.title}
                  />
                </AdminProjectThumbnail>
                <AdminProjectInfo>
                  <AdminProjectInfoHeader>
                    <AdminProjectTitle>{project.title}</AdminProjectTitle>
                    <ArtistBadge variant="outline">
                      {project.artistName}
                    </ArtistBadge>
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
                      {project.schedule && !isNaN(project.schedule) ? `${project.schedule}일` : project.schedule || '미정'}
                    </AdminProjectMetaItem>
                    {getNextScheduleDate(project) && (
                      <>
                        <AdminProjectMetaDivider>•</AdminProjectMetaDivider>
                        <AdminProjectMetaItem>
                          <Calendar className="w-3 h-3" />
                          다음: {formatDateKorean(getNextScheduleDate(project))}
                        </AdminProjectMetaItem>
                      </>
                    )}
                  </AdminProjectMeta>
                </AdminProjectInfo>
                <AdminProjectStatus>
                  <StatusBadge status={project.serialStatus}>{project.serialStatus}</StatusBadge>
                  <AdminProjectStatusText>마감: {project.deadline}</AdminProjectStatusText>
                </AdminProjectStatus>
              </AdminProjectCardContent>
            </AdminProjectCard>
          ))}

          {filteredProjects.length === 0 && (
            <AdminProjectsEmpty>
              <AdminProjectsEmptyIcon>
                <AlertCircle />
              </AdminProjectsEmptyIcon>
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
              작가 선택 <RequiredMark>*</RequiredMark>
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
              프로젝트명 <RequiredMark>*</RequiredMark>
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
              장르 <RequiredMark>*</RequiredMark>
            </AdminProjectModalLabel>
            <AdminProjectModalInput type="text" value={newProjectForm.genre} onChange={(e) => setNewProjectForm({ ...newProjectForm, genre: e.target.value })} placeholder="예: 로맨스/판타지" />
          </AdminProjectModalField>

          {/* 플랫폼 선택 */}
          <AdminProjectModalField>
            <AdminProjectModalLabel>
              플랫폼 <RequiredMark>*</RequiredMark>
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

          {/* 연재 주기 */}
          <AdminProjectModalField>
            <AdminProjectModalLabel>연재 주기</AdminProjectModalLabel>
            <AdminProjectModalInput 
              type="number" 
              min="1"
              value={newProjectForm.schedule} 
              onChange={(e) => setNewProjectForm({ ...newProjectForm, schedule: e.target.value })} 
              placeholder="예: 7 (일 단위)" 
            />
            <AdminProjectModalHelperText>연재 주기를 일 단위로 입력하세요 (예: 7일, 14일 등)</AdminProjectModalHelperText>
          </AdminProjectModalField>

          {/* 연재 시작일 */}
          <AdminProjectModalField>
            <AdminProjectModalLabel>연재 시작일</AdminProjectModalLabel>
            <AdminProjectModalInput 
              type="date" 
              value={newProjectForm.startDate} 
              onChange={(e) => setNewProjectForm({ ...newProjectForm, startDate: e.target.value })} 
            />
            <AdminProjectModalHelperText>연재 시작일을 선택하면 다음 연재 일정이 자동으로 계산됩니다</AdminProjectModalHelperText>
            {newProjectForm.startDate && newProjectForm.schedule && !isNaN(newProjectForm.schedule) && (
              <AdminProjectNextSchedulePreview>
                다음 연재 예정일: {formatDateKorean(calculateNextScheduleDate(newProjectForm.startDate, Number(newProjectForm.schedule)))}
              </AdminProjectNextSchedulePreview>
            )}
          </AdminProjectModalField>

          {/* 썸네일 */}
          <AdminProjectModalField>
            <AdminProjectModalLabel>썸네일 첨부 (선택)</AdminProjectModalLabel>
            <AdminProjectModalInput type="file" accept="image/*" onChange={handleThumbnailChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            {newProjectForm.thumbnail && (
              <AdminProjectModalThumbnailPreview>
                <AdminProjectModalThumbnailPreviewLabel>미리보기:</AdminProjectModalThumbnailPreviewLabel>
                <ThumbnailImage src={newProjectForm.thumbnail} alt="썸네일 미리보기" />
              </AdminProjectModalThumbnailPreview>
            )}
          </AdminProjectModalField>

          {/* 버튼 */}
          <AdminProjectModalActions>
            <FullWidthButton variant="outline" onClick={() => setIsAddModalOpen(false)}>
              취소
            </FullWidthButton>
            <FullWidthButton onClick={handleAddProject} as={PrimaryButton}>
              등록
            </FullWidthButton>
          </AdminProjectModalActions>
        </AdminProjectModalForm>
      </Modal>
    </AdminProjectsRoot>
  );
}
