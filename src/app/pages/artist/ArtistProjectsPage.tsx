import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/app/components/Modal';
import { BookOpen, Users, Calendar, AlertCircle, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ProjectDetailPage } from './ProjectDetailPage';

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
  schedule?: string; // 연재 일정
  thumbnail?: string; // 썸네일 URL
}

export function ArtistProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDetailPage, setShowDetailPage] = useState(false);
  
  // 상태 필터 (복수 선택 가능)
  const [statusFilters, setStatusFilters] = useState<string[]>(['전체']);

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
    },
  ]);

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

  // 필터 토글 핸들러
  const toggleFilter = (filter: string) => {
    if (filter === '전체') {
      setStatusFilters(['전체']);
    } else {
      const newFilters = statusFilters.includes(filter)
        ? statusFilters.filter(f => f !== filter)
        : [...statusFilters.filter(f => f !== '전체'), filter];
      
      // 연재중, 휴재, 완결이 모두 선택되면 전체로 변경
      if (newFilters.length === 3 && 
          newFilters.includes('연재중') && 
          newFilters.includes('휴재') && 
          newFilters.includes('완결')) {
        setStatusFilters(['전체']);
      } else {
        setStatusFilters(newFilters.length === 0 ? ['전체'] : newFilters);
      }
    }
  };

  // 필터링된 프로젝트
  const filteredProjects = projects.filter(project => {
    if (statusFilters.includes('전체')) return true;
    return statusFilters.includes(project.serialStatus);
  });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowDetailPage(true);
  };

  const handleDeleteProject = (projectId: number) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
    toast.success('작품이 삭제되었습니다.');
  };

  // 통계 계산
  const stats = {
    total: projects.length,
    ongoing: projects.filter(p => p.serialStatus === '연재중').length,
    paused: projects.filter(p => p.serialStatus === '휴재').length,
    completed: projects.filter(p => p.serialStatus === '완결').length,
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
        <ProjectDetailPage 
          project={selectedProject} 
          onBack={() => setShowDetailPage(false)}
          isArtistView={true}
        />
      ) : (
        /* 작품 목록 표시 */
        <div className="pb-24 px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">프로젝트 관리</h1>
              <p className="text-sm text-muted-foreground mt-1">진행중인 작품을 관리하세요</p>
            </div>

            {/* Stats - 3개로 통일 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">총 작품</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.total}개</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">연재중</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.ongoing}개</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">오늘 마감</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {projects.filter(p => p.deadline.includes('D-0') || p.deadline.includes('D-1') || p.deadline.includes('D-2')).length}개
                </p>
              </Card>
            </div>

            {/* 필터 영역 */}
            <Card className="p-4 mb-6">
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
            </Card>

            {/* 작품 리스트 */}
            <div className="space-y-4">
              {filteredProjects.map((project) => (
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

                    {/* 가운데: 작품 제목 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.genre}</p>
                    </div>

                    {/* 오른쪽: 정보 */}
                    <div className="flex-shrink-0 space-y-3 min-w-[280px]">
                      {/* 플랫폼 */}
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-foreground font-medium">{project.platform}</span>
                      </div>

                      {/* 연재 일정 */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-foreground">{project.schedule}</span>
                      </div>

                      {/* 작품 상태 */}
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusBadgeColor(project.serialStatus)}>
                          {project.serialStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {filteredProjects.length === 0 && (
                <Card className="p-12">
                  <div className="text-center text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">해당 상태의 작품이 없습니다</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}