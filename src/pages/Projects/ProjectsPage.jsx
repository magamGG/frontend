import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Plus, MoreVertical, Calendar, TrendingUp } from 'lucide-react';
import {
  ProjectsRoot,
  ProjectsBody,
  HeaderActions,
  HeaderActionsLeft,
  FilterButtonGroup,
  ProjectsGrid,
  ProjectCard,
  ProjectCardHeader,
  ProjectCardTitleSection,
  ProjectCardTitle,
  ProjectCardPlatform,
  ProjectInfoList,
  ProjectInfoItem,
  ProjectInfoLabel,
  ProjectInfoValue,
  ProgressSection,
  ProgressHeader,
  ProjectActionButtons,
} from './ProjectsPage.styled';

// 작품 상태 정의
const PROJECT_STATUS = {
  SERIALIZING: '연재',
  ON_BREAK: '휴재',
  PREPARING: '준비중',
  COMPLETED: '완결',
};

// 작품 상태별 Badge variant 매핑
const getStatusVariant = (status) => {
  const variantMap = {
    [PROJECT_STATUS.SERIALIZING]: 'default',
    [PROJECT_STATUS.ON_BREAK]: 'secondary',
    [PROJECT_STATUS.PREPARING]: 'outline',
    [PROJECT_STATUS.COMPLETED]: 'default',
  };
  return variantMap[status] || 'outline';
};

export function ProjectsPage() {
  const [filterStatus, setFilterStatus] = useState('전체');
  const [projects] = useState([]);

  // 필터링된 작품 목록
  const filteredProjects =
    filterStatus === '전체'
      ? projects
      : projects.filter((project) => project.status === filterStatus);

  // 필터 버튼 목록
  const filterButtons = ['전체', PROJECT_STATUS.SERIALIZING, PROJECT_STATUS.ON_BREAK, PROJECT_STATUS.COMPLETED];

  return (
    <ProjectsRoot>
      <ProjectsBody>
        {/* 헤더 액션 */}
        <HeaderActions>
          <HeaderActionsLeft>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              새 작품 추가
            </Button>
            <FilterButtonGroup>
              {filterButtons.map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </Button>
              ))}
            </FilterButtonGroup>
          </HeaderActionsLeft>
        </HeaderActions>

        {/* 작품 그리드 */}
        <ProjectsGrid>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id}>
              <ProjectCardHeader>
                <ProjectCardTitleSection>
                  <ProjectCardTitle>{project.title}</ProjectCardTitle>
                  <ProjectCardPlatform>{project.platform}</ProjectCardPlatform>
                </ProjectCardTitleSection>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </ProjectCardHeader>

              <ProjectInfoList>
                <ProjectInfoItem>
                  <ProjectInfoLabel>상태</ProjectInfoLabel>
                  <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                </ProjectInfoItem>

                <ProjectInfoItem>
                  <ProjectInfoLabel>에피소드</ProjectInfoLabel>
                  <ProjectInfoValue>{project.episodeCount}화</ProjectInfoValue>
                </ProjectInfoItem>

                <ProjectInfoItem>
                  <ProjectInfoLabel>조회수</ProjectInfoLabel>
                  <ProjectInfoValue>{project.views}</ProjectInfoValue>
                </ProjectInfoItem>

                {project.nextDeadline && (
                  <ProjectInfoItem>
                    <ProjectInfoLabel>다음 마감</ProjectInfoLabel>
                    <ProjectInfoValue>{project.nextDeadline}</ProjectInfoValue>
                  </ProjectInfoItem>
                )}
              </ProjectInfoList>

              <ProgressSection>
                <ProgressHeader>
                  <ProjectInfoLabel>진행률</ProjectInfoLabel>
                  <ProjectInfoValue>{project.progress}%</ProjectInfoValue>
                </ProgressHeader>
                <Progress value={project.progress} className="h-2" />
              </ProgressSection>

              <ProjectActionButtons>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  일정
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  통계
                </Button>
              </ProjectActionButtons>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </ProjectsBody>
    </ProjectsRoot>
  );
}
