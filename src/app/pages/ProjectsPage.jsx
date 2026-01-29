import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Plus, MoreVertical, Calendar, TrendingUp } from 'lucide-react';

const projects = [
  {
    id,
    title: '로맨스 판타지',
    status: '연재중',
    platform: '네이버 웹툰',
    episodeCount,
    nextDeadline: '2026년 1월 15일',
    progress,
    views: '125만'
  },
  {
    id,
    title: '학원물',
    status: '연재중',
    platform: '카카오 웹툰',
    episodeCount,
    nextDeadline: '2026년 1월 18일',
    progress,
    views: '85만'
  },
  {
    id,
    title: '액션 판타지',
    status: '휴재',
    platform: '네이버 웹툰',
    episodeCount,
    nextDeadline,
    progress,
    views: '200만'
  },
  {
    id,
    title: 'SF 스릴러',
    status: '준비중',
    platform: '카카오 웹툰',
    episodeCount,
    nextDeadline: '2026년 2월 1일',
    progress,
    views: '-'
  }
];

export function ProjectsPage() {
  return (
    <div className="w-full h-full">
      <div className="pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                새 작품 추가
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">전체</Button>
                <Button variant="outline" size="sm">연재중</Button>
                <Button variant="outline" size="sm">휴재</Button>
                <Button variant="outline" size="sm">완결</Button>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden">
            {projects.map((project) => (
              <Card key={project.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">{project.title}</h3>
                    <p className="text-xs text-muted-foreground">{project.platform}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">상태</span>
                    <Badge 
                      variant={
                        project.status === '연재중' ? 'default' : 
                        project.status === '휴재' ? 'secondary' : 
                        'outline'
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">에피소드</span>
                    <span className="text-xs font-medium text-foreground">{project.episodeCount}화</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">조회수</span>
                    <span className="text-xs font-medium text-foreground">{project.views}</span>
                  </div>

                  {project.nextDeadline && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">다음 마감</span>
                      <span className="text-xs font-medium text-foreground">{project.nextDeadline}</span>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">진행률</span>
                    <span className="text-xs font-medium text-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    일정
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    통계
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}