import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { BookOpen, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import useAuthStore from '@/store/authStore';
import { projectService } from '@/api/services';
import { getProjectThumbnailUrl, PROJECT_THUMBNAIL_PLACEHOLDER } from '@/api/config';
import {
  PROJECT_SERIAL_STATUS,
  SERIAL_STATUS_FILTER_OPTIONS,
  getProjectStatusBadgeClass,
} from '@/constants/projectSerialStatus';
import { ProjectStatusBadge } from '@/components/common/ProjectStatusBadge';
import { ProjectSerialCard } from '@/components/common/ProjectSerialCard';
// TODO: ProjectDetailPage 리팩터링 후 경로 수정 필요
import { ProjectDetailPage } from '@/pages/ProjectDetail';
import {
  ArtistProjectsRoot,
  ArtistProjectsBody,
  PageHeader,
  PageTitle,
  PageDescription,
  StatsGrid,
  StatCard,
  StatCardHeader,
  StatCardIcon,
  StatCardLabel,
  StatCardValue,
  FilterSection,
  FilterLabel,
  FilterButtonGroup,
  ProjectsList,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
} from './ArtistProjectsPage.styled';

export function ArtistProjectsPage() {
  const { user } = useAuthStore();
  const memberNo = user?.memberNo;

  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [statusFilter, setStatusFilter] = useState('전체');
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
    if (isNaN(next.getTime())) return '미정';
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
    const nextDateFromBackend = p.nextDeadline
      ? (typeof p.nextDeadline === 'string' ? new Date(p.nextDeadline.slice(0, 10)) : null)
      : null;
    const nextDate = nextDateFromBackend && !isNaN(nextDateFromBackend.getTime())
      ? nextDateFromBackend
      : calculateNextScheduleDate(startDateStr, p.projectCycle);
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
      startDate: startDateStr,
      nextScheduleDate: nextDate ? formatDate(nextDate) : null,
      thumbnail: p.thumbnailFile || null,
      artistName: p.artistName || '',
      artistId: p.artistMemberNo,
      projectColor: p.projectColor || '#6E8FB3',
    };
  };

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

  // 페이지 제목 변경을 위한 헤더 업데이트
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

  // 필터 선택 핸들러 (단일 선택)
  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
  };

  // 필터링된 프로젝트
  const filteredProjects = projects.filter((project) => {
    if (statusFilter === '전체') return true;
    return statusFilter === project.serialStatus;
  });

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowDetailPage(true);
  };

  const handleDeleteProject = (projectId) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    toast.success('작품이 삭제되었습니다.');
  };

  // 통계 계산
  const stats = {
    total: projects.length,
    ongoing: projects.filter((p) => p.serialStatus === PROJECT_SERIAL_STATUS.SERIALIZING).length,
    todayDeadline: projects.filter(
      (p) => p.deadline && (p.deadline.includes('D-0') || p.deadline.includes('D-1') || p.deadline.includes('D-2'))
    ).length,
  };

  // 작품 상세 페이지 표시
  if (showDetailPage && selectedProject) {
    return (
      <ProjectDetailPage
        project={selectedProject}
        onBack={() => setShowDetailPage(false)}
        isArtistView={true}
      />
    );
  }

  // 작품 목록 표시
  return (
    <ArtistProjectsRoot>
      <ArtistProjectsBody>
        {/* Header */}
        <PageHeader>
          <PageTitle>프로젝트 관리</PageTitle>
          <PageDescription>진행중인 작품을 관리하세요</PageDescription>
        </PageHeader>

        {/* Stats */}
        <StatsGrid>
          <StatCard>
            <StatCardHeader>
              <StatCardIcon>
                <BookOpen className="w-4 h-4" />
              </StatCardIcon>
              <StatCardLabel>총 작품</StatCardLabel>
            </StatCardHeader>
            <StatCardValue>{stats.total}개</StatCardValue>
          </StatCard>
          <StatCard>
            <StatCardHeader>
              <StatCardIcon>
                <AlertCircle className="w-4 h-4" />
              </StatCardIcon>
              <StatCardLabel>연재</StatCardLabel>
            </StatCardHeader>
            <StatCardValue>{stats.ongoing}개</StatCardValue>
          </StatCard>
          <StatCard>
            <StatCardHeader>
              <StatCardIcon>
                <Calendar className="w-4 h-4" />
              </StatCardIcon>
              <StatCardLabel>오늘 마감</StatCardLabel>
            </StatCardHeader>
            <StatCardValue>{stats.todayDeadline}개</StatCardValue>
          </StatCard>
        </StatsGrid>

        {/* 필터 영역 */}
        <FilterSection>
          <FilterLabel>상태:</FilterLabel>
          <FilterButtonGroup>
            {SERIAL_STATUS_FILTER_OPTIONS.map((filter) => (
              <Button
                key={filter}
                variant={statusFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange(filter)}
                className={statusFilter === filter ? getProjectStatusBadgeClass(filter === '전체' ? '' : filter) : ''}
              >
                {filter}
              </Button>
            ))}
          </FilterButtonGroup>
        </FilterSection>

        {/* 작품 리스트 */}
        <ProjectsList>
          {projectsLoading ? (
            <EmptyState>
              <EmptyStateIcon>
                <AlertCircle className="w-12 h-12" />
              </EmptyStateIcon>
              <EmptyStateText>프로젝트 목록을 불러오는 중...</EmptyStateText>
            </EmptyState>
          ) : (
          <>
          {filteredProjects.map((project) => (
            <ProjectSerialCard
              key={project.id}
              onClick={() => handleProjectClick(project)}
              title={project.title}
              artistName={project.artistName}
              platform={project.platform}
              schedule={project.schedule}
              deadline={project.deadline}
              genre={project.genre}
              serialStatus={project.serialStatus}
              thumbnail={project.thumbnail}
              showThumbnail={true}
            />
          ))}

          {filteredProjects.length === 0 && (
            <EmptyState>
              <EmptyStateIcon>
                <AlertCircle className="w-12 h-12" />
              </EmptyStateIcon>
              <EmptyStateText>해당 상태의 작품이 없습니다</EmptyStateText>
            </EmptyState>
          )}
          </>
          )}
        </ProjectsList>
      </ArtistProjectsBody>
    </ArtistProjectsRoot>
  );
}
