import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import {
  SearchContainer,
  SearchIcon,
  ProjectList,
  ProjectItem,
  ProjectHeader,
  ProjectInfo,
  ProjectTitleGroup,
  ProjectName,
  ProjectArtist,
  ProjectMeta,
  ProjectMetaGroup,
  ProgressBar,
  ProgressFill,
  StatsContainer,
  StatsGrid,
  StatItem,
  StatValue,
  StatLabel,
  EmptyMessage,
  ChevronRightIcon,
} from './ProjectListModal.styled';

/**
 * @typedef {Object} Project
 * @property {number} id
 * @property {string} name
 * @property {string} artist
 * @property {string} status
 * @property {number} progress
 * @property {string} deadline
 */

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {Project[]} props.projects
 * @param {(project: Project) => void} [props.onProjectClick]
 */
export function ProjectListModal({ open, onOpenChange, projects, onProjectClick }) {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case '정상':
        return 'bg-green-500';
      case '주의':
        return 'bg-yellow-500';
      case '지연':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 프로젝트 클릭 핸들러
  const handleProjectClick = (project, e) => {
    e.stopPropagation();
    if (onProjectClick) {
      onProjectClick(project);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[700px] bg-white max-h-[85vh] flex flex-col" 
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-xl" style={{ color: 'var(--foreground)' }}>담당 프로젝트 전체 목록</DialogTitle>
        </DialogHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0', flex: 1, overflow: 'hidden' }}>
          {/* 검색 */}
          <SearchContainer>
            <SearchIcon>
              <Search style={{ width: '16px', height: '16px' }} />
            </SearchIcon>
            <Input
              type="text"
              placeholder="프로젝트명 또는 작가명 검색..."
              className="pl-10 h-9 text-sm"
              style={{ 
                backgroundColor: 'var(--card)', 
                borderColor: 'var(--border)', 
                color: 'var(--foreground)',
                '--tw-ring-color': 'var(--accent)'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          {/* 프로젝트 목록 */}
          <ProjectList>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectItem 
                  key={project.id}
                >
                  <ProjectHeader>
                    <ProjectInfo>
                      <ProjectTitleGroup>
                        <ProjectName>{project.name}</ProjectName>
                        <Badge className={`${getStatusColor(project.status)} text-white text-xs`}>
                          {project.status}
                        </Badge>
                      </ProjectTitleGroup>
                      <ProjectArtist>담당: {project.artist}</ProjectArtist>
                    </ProjectInfo>
                    <ChevronRightIcon 
                      onClick={(e) => handleProjectClick(project, e)}
                    />
                  </ProjectHeader>

                  <ProjectMeta>
                    <ProjectMetaGroup>
                      <span>진행률: {project.progress}%</span>
                      <span>마감: {project.deadline}</span>
                    </ProjectMetaGroup>
                  </ProjectMeta>

                  {/* 진행률 바 */}
                  <ProgressBar>
                    <ProgressFill
                      className={getStatusColor(project.status)}
                      style={{ width: `${project.progress}%` }}
                    />
                  </ProgressBar>
                </ProjectItem>
              ))
            ) : (
              <EmptyMessage>
                <p style={{ fontSize: '14px' }}>검색 결과가 없습니다.</p>
              </EmptyMessage>
            )}
          </ProjectList>

          {/* 통계 요약 */}
          <StatsContainer>
            <StatsGrid>
              <StatItem>
                <StatValue>{projects.length}</StatValue>
                <StatLabel>전체 프로젝트</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue style={{ color: 'var(--chart-2)' }}>
                  {projects.filter((p) => p.status === '정상').length}
                </StatValue>
                <StatLabel>정상</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue style={{ color: 'var(--chart-4)' }}>
                  {projects.filter((p) => p.status === '주의').length}
                </StatValue>
                <StatLabel>주의</StatLabel>
              </StatItem>
            </StatsGrid>
          </StatsContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
