import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import { BookOpen, Users, Calendar, AlertCircle, Plus, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ProjectDetailPage } from '@/pages/ProjectDetail';
import useAuthStore from '@/store/authStore';
import { memberService, projectService } from '@/api/services';
import { getProjectThumbnailUrl, PROJECT_THUMBNAIL_PLACEHOLDER } from '@/api/config';
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
  AdminProjectMetaGroup,
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

  const { user } = useAuthStore();
  const agencyNo = user?.agencyNo;

  // 작가 목록 (API에서 조회)
  const [artists, setArtists] = useState([]);
  const [artistsLoading, setArtistsLoading] = useState(false);

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  /** 로그인 회원이 PROJECT_MEMBER에 등록된 프로젝트 수 (API 카운트) */
  const [myProjectCount, setMyProjectCount] = useState(null);

  const memberNo = user?.memberNo;

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 백엔드와 동일: 다음 연재일 = start + ceil(경과일/주기)*주기 (오늘이 연재일이면 오늘)
  const calculateNextScheduleDate = (startDate, scheduleDays) => {
    if (!startDate || !scheduleDays || isNaN(scheduleDays)) return null;
    const start = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    if (daysDiff < 0) return start;
    const n = daysDiff === 0 ? 0 : Math.ceil(daysDiff / scheduleDays);
    const nextDate = new Date(start);
    nextDate.setDate(start.getDate() + n * scheduleDays);
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
    if (daysDiff === 0) return 'D-DAY';
    return `D+${Math.abs(daysDiff)}`;
  };

  const mapApiProjectToFrontend = (p) => {
    const startDateStr = p.projectStartedAt
      ? (typeof p.projectStartedAt === 'string'
          ? p.projectStartedAt.slice(0, 10)
          : null)
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
      projectColor: p.projectColor || '#6E8FB3',
    };
  };

  // 프로젝트 목록 API 조회
  useEffect(() => {
    if (!memberNo) return;
    const fetchProjects = async () => {
      setProjectsLoading(true);
      try {
        const list = await projectService.getProjects(0, 100);
        const arr = Array.isArray(list) ? list : list?.content ?? list?.data ?? [];
        setProjects(arr.map((p) => mapApiProjectToFrontend(p)));
      } catch (err) {
        toast.error('프로젝트 목록을 불러오는데 실패했습니다.');
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, [memberNo]);

  // 로그인 회원 소속 프로젝트 수 (PROJECT_MEMBER 기준)
  useEffect(() => {
    if (!memberNo) return;
    const fetchMyProjectCount = async () => {
      try {
        const res = await projectService.getMyProjectCount();
        const count = res?.count ?? res?.data?.count ?? 0;
        setMyProjectCount(Number(count));
      } catch {
        setMyProjectCount(0);
      }
    };
    fetchMyProjectCount();
  }, [memberNo]);

  // 작가 목록 API 조회 (에이전시별)
  useEffect(() => {
    if (!agencyNo) return;
    const fetchArtists = async () => {
      setArtistsLoading(true);
      try {
        const response = await memberService.getArtistsByAgency(agencyNo);
        const list = Array.isArray(response) ? response : response?.data ?? [];
        setArtists(
          list.map((m) => ({
            id: m.memberNo,
            name: m.memberName || m.memberEmail,
          }))
        );
      } catch (err) {
        toast.error('작가 목록을 불러오는데 실패했습니다.');
        setArtists([]);
      } finally {
        setArtistsLoading(false);
      }
    };
    fetchArtists();
  }, [agencyNo]);

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


  // 상태 필터 선택 핸들러 (단일 선택)
  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
  };

  // 상태별 배지 색상 (작가 계정과 동일)
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

  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const handleAddProject = async () => {
    const titleTrimmed = (newProjectForm.title || '').trim();
    if (!newProjectForm.artistId || !titleTrimmed || !newProjectForm.genre) {
      toast.error('필수 항목(작가, 프로젝트명, 장르)을 모두 입력해주세요.');
      return;
    }

    const isDuplicateName = projects.some(
      (p) => (p.title || '').trim().toLowerCase() === titleTrimmed.toLowerCase()
    );
    if (isDuplicateName) {
      toast.error('이미 같은 이름의 프로젝트가 있습니다.');
      return;
    }

    const selectedArtist = artists.find((a) => a.id === newProjectForm.artistId);
    if (!selectedArtist) {
      toast.error('작가를 선택해주세요.');
      return;
    }

    const scheduleNum = newProjectForm.schedule ? Number(newProjectForm.schedule) : null;
    const startDate = newProjectForm.startDate
      ? `${newProjectForm.startDate}T00:00:00`
      : null;

    setIsCreateLoading(true);
    try {
      let thumbnailFileName = null;
      if (newProjectForm.thumbnailFile) {
        const uploadRes = await projectService.uploadThumbnail(newProjectForm.thumbnailFile);
        thumbnailFileName = uploadRes?.data ?? null;
      }

      const response = await projectService.createProject({
        projectName: titleTrimmed,
        artistMemberNo: newProjectForm.artistId,
        projectStatus: '연재',
        projectColor: '기본색',
        projectCycle: scheduleNum || undefined,
        projectStartedAt: startDate || undefined,
        projectGenre: newProjectForm.genre || undefined,
        platform: newProjectForm.platform || undefined,
        thumbnailFile: thumbnailFileName || undefined,
      });

      const nextScheduleDate = calculateNextScheduleDate(newProjectForm.startDate, scheduleNum);
      const deadlineDn = nextScheduleDate ? getDeadlineDn(nextScheduleDate) : '미정';
      const newProject = {
        id: response.projectNo,
        title: response.projectName,
        platform: response.platform || '미정',
        status: 'normal',
        serialStatus: response.projectStatus || '연재',
        currentEpisode: 1,
        deadline: deadlineDn,
        genre: response.projectGenre || '',
        schedule: newProjectForm.schedule || '미정',
        scheduleDays: scheduleNum ?? null,
        startDate: newProjectForm.startDate || null,
        nextScheduleDate: nextScheduleDate ? formatDate(nextScheduleDate) : null,
        thumbnail: response.thumbnailFile || null,
        artistName: response.artistName || selectedArtist.name,
        artistId: response.artistMemberNo || newProjectForm.artistId,
        projectColor: response.projectColor || '#6E8FB3',
      };

      setProjects((prev) => [newProject, ...prev]);
      setMyProjectCount((prev) => (prev ?? 0) + 1);
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
      toast.success('프로젝트가 추가되었습니다.');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || '프로젝트 추가에 실패했습니다.';
      toast.error(msg);
    } finally {
      setIsCreateLoading(false);
    }
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
    totalProjects: myProjectCount ?? projects.length,
    todayDeadlines: projects.filter((p) => p.deadline && (p.deadline === 'D-DAY' || p.deadline.includes('D-0') || p.deadline.includes('D-1') || p.deadline.includes('D-2'))).slice(0, 3).length,
  };


  const handleProjectUpdate = (updatedProject) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? { ...p, ...updatedProject } : p))
    );
    setSelectedProject((prev) => (prev?.id === updatedProject.id ? { ...prev, ...updatedProject } : prev));
  };

  const handleProjectDelete = () => {
    if (selectedProject) {
      setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
      setMyProjectCount((prev) => Math.max(0, (prev ?? 1) - 1));
      setSelectedProject(null);
    }
    setShowDetailPage(false);
  };

  if (showDetailPage && selectedProject) {
    return (
      <ProjectDetailPage
        project={selectedProject}
        onBack={() => setShowDetailPage(false)}
        onProjectUpdate={handleProjectUpdate}
        onProjectDelete={handleProjectDelete}
      />
    );
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
            </FilterButtonGroup>
          </FilterRow>
        </FilterSection>

        {/* 작품 리스트 */}
        <AdminProjectsList>
          {projectsLoading ? (
            <AdminProjectsEmpty>
              <AdminProjectsEmptyIcon>
                <AlertCircle />
              </AdminProjectsEmptyIcon>
              <AdminProjectsEmptyText>프로젝트 목록을 불러오는 중...</AdminProjectsEmptyText>
            </AdminProjectsEmpty>
          ) : (
          <>
          {filteredProjects.map((project) => (
            <AdminProjectCard key={project.id} onClick={() => handleProjectClick(project)}>
              <AdminProjectCardContent>
                <AdminProjectThumbnail>
                  <ThumbnailImage
                    src={getProjectThumbnailUrl(project.thumbnail) || PROJECT_THUMBNAIL_PLACEHOLDER}
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
                    <AdminProjectMetaGroup>
                      <AdminProjectMetaDivider>•</AdminProjectMetaDivider>
                      <AdminProjectMetaItem>
                        <Calendar className="w-3 h-3" />
                        {project.schedule && !isNaN(project.schedule) ? `${project.schedule}일` : project.schedule || '미정'}
                      </AdminProjectMetaItem>
                    </AdminProjectMetaGroup>
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
          </>
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
            <AdminProjectModalSelect
              value={newProjectForm.artistId}
              onChange={(e) => setNewProjectForm({ ...newProjectForm, artistId: Number(e.target.value) })}
              disabled={artistsLoading}
            >
              <option value={0}>
                {artistsLoading ? '작가 목록 불러오는 중...' : artists.length === 0 ? '등록된 작가가 없습니다' : '작가를 선택하세요'}
              </option>
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
            <FullWidthButton variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isCreateLoading}>
              취소
            </FullWidthButton>
            <FullWidthButton onClick={handleAddProject} as={PrimaryButton} disabled={isCreateLoading}>
              {isCreateLoading ? '등록 중...' : '등록'}
            </FullWidthButton>
          </AdminProjectModalActions>
        </AdminProjectModalForm>
      </Modal>
    </AdminProjectsRoot>
  );
}
