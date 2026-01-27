import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { BookOpen, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
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
  ProjectCard,
  ProjectThumbnail,
  ProjectContent,
  ProjectTitle,
  ProjectGenre,
  ProjectInfo,
  ProjectInfoRow,
  ProjectInfoIcon,
  ProjectInfoText,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
} from './ArtistProjectsPage.styled';

// 작품 상태 정의
const PROJECT_SERIAL_STATUS = {
  SERIALIZING: '연재중',
  ON_BREAK: '휴재',
  COMPLETED: '완결',
};

// TODO: Zustand store mapping - 작가 작품 목록
const initialProjects = [
  {
    id: 1,
    title: '로맨스 판타지',
    platform: '네이버 웹툰',
    status: 'urgent',
    serialStatus: PROJECT_SERIAL_STATUS.SERIALIZING,
    currentEpisode: 42,
    deadline: 'D-2',
    genre: '로맨스/판타지',
    description: '매주 일요일 업데이트. 현재 스토리보드 단계입니다.',
    schedule: '매주 일요일 오전 10시',
    thumbnail: 'https://images.unsplash.com/photo-1591788806059-cb6e2f6a2498?w=400',
  },
  {
    id: 2,
    title: '학원물',
    platform: '카카오페이지',
    status: 'normal',
    serialStatus: PROJECT_SERIAL_STATUS.SERIALIZING,
    currentEpisode: 15,
    deadline: 'D-5',
    genre: '학원/일상',
    description: '매주 수요일 업데이트. 러프 스케치 단계입니다.',
    schedule: '매주 수요일 오후 2시',
    thumbnail: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400',
  },
  {
    id: 3,
    title: '미스터리 스릴러',
    platform: '레진코믹스',
    status: 'normal',
    serialStatus: PROJECT_SERIAL_STATUS.ON_BREAK,
    currentEpisode: 28,
    deadline: '휴재중',
    genre: '미스터리/스릴러',
    description: '2025년 3월 재연재 예정',
    schedule: '휴재중 (3월 재개 예정)',
    thumbnail: 'https://images.unsplash.com/photo-1618556662146-0c86c2466516?w=400',
  },
  {
    id: 4,
    title: '액션 판타지',
    platform: '네이버 시리즈',
    status: 'completed',
    serialStatus: PROJECT_SERIAL_STATUS.COMPLETED,
    currentEpisode: 120,
    deadline: '완결',
    genre: '액션/판타지',
    description: '총 120화 완결. 조회수 2.5M을 기록했습니다.',
    schedule: '완결 (2024년 12월)',
    thumbnail: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400',
  },
];

export function ArtistProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [statusFilter, setStatusFilter] = useState('전체');
  const [projects, setProjects] = useState(initialProjects);

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

  // localStorage에서 작품 데이터 로드
  useEffect(() => {
    const stored = localStorage.getItem('projectsData');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.length > 0) {
        setProjects(data);
      }
    }
  }, []);

  // 작품 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('projectsData', JSON.stringify(projects));
  }, [projects]);

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
    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
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

  // 상태별 배지 색상
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case PROJECT_SERIAL_STATUS.SERIALIZING:
        return 'bg-green-500 hover:bg-green-600';
      case PROJECT_SERIAL_STATUS.ON_BREAK:
        return 'bg-orange-500 hover:bg-orange-600';
      case PROJECT_SERIAL_STATUS.COMPLETED:
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
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
              <StatCardLabel>연재중</StatCardLabel>
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
            {['전체', PROJECT_SERIAL_STATUS.SERIALIZING, PROJECT_SERIAL_STATUS.ON_BREAK, PROJECT_SERIAL_STATUS.COMPLETED].map(
              (filter) => (
                <Button
                  key={filter}
                  variant={statusFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange(filter)}
                  className={statusFilter === filter ? getStatusBadgeColor(filter === '전체' ? '' : filter) : ''}
                >
                  {filter}
                </Button>
              )
            )}
          </FilterButtonGroup>
        </FilterSection>

        {/* 작품 리스트 */}
        <ProjectsList>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} onClick={() => handleProjectClick(project)}>
              <ProjectThumbnail>
                <ImageWithFallback
                  src={project.thumbnail || 'https://images.unsplash.com/photo-1591788806059-cb6e2f6a2498?w=400'}
                  alt={project.title}
                />
              </ProjectThumbnail>

              <ProjectContent>
                <div>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectGenre>{project.genre}</ProjectGenre>
                </div>

                <ProjectInfo>
                  <ProjectInfoRow>
                    <ProjectInfoIcon>
                      <BookOpen className="w-4 h-4" />
                    </ProjectInfoIcon>
                    <ProjectInfoText>{project.platform}</ProjectInfoText>
                  </ProjectInfoRow>

                  <ProjectInfoRow>
                    <ProjectInfoIcon>
                      <Calendar className="w-4 h-4" />
                    </ProjectInfoIcon>
                    <ProjectInfoText>{project.schedule}</ProjectInfoText>
                  </ProjectInfoRow>

                  <ProjectInfoRow>
                    <Badge className={getStatusBadgeColor(project.serialStatus)}>
                      {project.serialStatus}
                    </Badge>
                  </ProjectInfoRow>
                </ProjectInfo>
              </ProjectContent>
            </ProjectCard>
          ))}

          {filteredProjects.length === 0 && (
            <EmptyState>
              <EmptyStateIcon>
                <AlertCircle className="w-12 h-12" />
              </EmptyStateIcon>
              <EmptyStateText>해당 상태의 작품이 없습니다</EmptyStateText>
            </EmptyState>
          )}
        </ProjectsList>
      </ArtistProjectsBody>
    </ArtistProjectsRoot>
  );
}
