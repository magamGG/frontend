import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { 
  MapPin, 
  Calendar, 
  Briefcase, 
  Mail, 
  Phone, 
  ChevronRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileText
} from 'lucide-react';
import { mockWorkcationMembers } from '@/data/mockData';
import {
  AgencyWorkcationRoot,
  AgencyWorkcationBody,
  HeaderSection,
  HeaderTitle,
  HeaderSubtitle,
  HeaderActions,
  FilterButtonGroup,
  StatisticsGrid,
  StatisticsCard,
  StatisticsCardContent,
  StatisticsIcon,
  StatisticsLabel,
  StatisticsValue,
  MembersGrid,
  MemberCard,
  MemberCardHeader,
  MemberCardHeaderContent,
  MemberCardBadges,
  MemberCardInfo,
  MemberCardAvatar,
  MemberCardName,
  MemberCardRole,
  MemberCardContent,
  MemberCardLocation,
  MemberCardDate,
  MemberCardProjects,
  MemberCardProgress,
  MemberCardTasks,
  MemberCardActions,
  EmptyStateCard,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
  DetailModalContent,
  DetailMemberHeader,
  DetailMemberInfo,
  DetailMemberAvatar,
  DetailMemberName,
  DetailMemberRole,
  DetailMemberGrid,
  DetailMemberItem,
  DetailMemberLabel,
  DetailMemberValue,
  DailyReportCard,
  DailyReportHeader,
  DailyReportTitle,
  DailyReportProgress,
  DailyReportTasks,
  TasksList,
  TaskCard,
  TaskCardHeader,
  TaskCardTitle,
  TaskCardInfo,
  TaskCardProgress,
  ProjectsSection,
} from './AgencyWorkcationPage.styled';

const ROLE_FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'story', label: '스토리' },
  { value: 'line', label: '라인' },
  { value: 'coloring', label: '컬러링' },
];

export function AgencyWorkcationPage() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [filterRole, setFilterRole] = useState('all');

  // Calculate days remaining for each member
  const getDaysRemaining = (endDate) => {
    const today = new Date('2026-01-16');
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get role display name
  const getRoleDisplay = (role, customRole) => {
    if (role === 'assist' && customRole) return customRole;
    const roleMap = {
      story: '스토리',
      line: '라인',
      coloring: '컬러링',
      background: '배경',
      assist: '어시스트',
    };
    return roleMap[role] || role;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Filter members by role
  const filteredMembers = filterRole === 'all' 
    ? mockWorkcationMembers 
    : mockWorkcationMembers.filter(m => m.role === filterRole);

  // Calculate statistics
  const stats = {
    total: mockWorkcationMembers.length,
    avgProgress: Math.round(
      mockWorkcationMembers.reduce((acc, m) => acc + (m.dailyReport?.progress || 0), 0) / mockWorkcationMembers.length
    ),
    totalTasks: mockWorkcationMembers.reduce((acc, m) => acc + m.tasks.length, 0),
    completedTasks: mockWorkcationMembers.reduce(
      (acc, m) => acc + m.tasks.filter(t => t.progress === 100).length, 
      0
    ),
  };

  return (
    <AgencyWorkcationRoot>
      <AgencyWorkcationBody>
        {/* Header */}
        <HeaderSection>
          <div>
            <HeaderTitle>원격 관리</HeaderTitle>
            <HeaderSubtitle>원격 근무 중인 팀원들의 작업 현황을 관리합니다</HeaderSubtitle>
          </div>
          <HeaderActions>
            <FilterButtonGroup>
              {ROLE_FILTERS.map((filter) => (
                <Button
                  key={filter.value}
                  variant={filterRole === filter.value ? 'default' : 'outline'}
                  onClick={() => setFilterRole(filter.value)}
                  className={filterRole === filter.value ? 'bg-[#3F4A5A]' : ''}
                >
                  {filter.label}
                </Button>
              ))}
            </FilterButtonGroup>
          </HeaderActions>
        </HeaderSection>

        {/* Statistics Cards */}
        <StatisticsGrid>
          <StatisticsCard>
            <StatisticsCardContent>
              <div>
                <StatisticsLabel>원격 인원</StatisticsLabel>
                <StatisticsValue>{stats.total}명</StatisticsValue>
              </div>
              <StatisticsIcon $color="purple">
                <MapPin className="w-6 h-6 text-purple-600" />
              </StatisticsIcon>
            </StatisticsCardContent>
          </StatisticsCard>

          <StatisticsCard>
            <StatisticsCardContent>
              <div>
                <StatisticsLabel>진행 중인 작업</StatisticsLabel>
                <StatisticsValue>{stats.totalTasks}개</StatisticsValue>
              </div>
              <StatisticsIcon $color="green">
                <Briefcase className="w-6 h-6 text-green-600" />
              </StatisticsIcon>
            </StatisticsCardContent>
          </StatisticsCard>

          <StatisticsCard>
            <StatisticsCardContent>
              <div>
                <StatisticsLabel>완료된 작업</StatisticsLabel>
                <StatisticsValue>{stats.completedTasks}개</StatisticsValue>
              </div>
              <StatisticsIcon $color="teal">
                <CheckCircle2 className="w-6 h-6 text-teal-600" />
              </StatisticsIcon>
            </StatisticsCardContent>
          </StatisticsCard>
        </StatisticsGrid>

        {/* Workcation Members Grid */}
        <MembersGrid>
          {filteredMembers.map((member) => {
            const daysRemaining = getDaysRemaining(member.endDate);
            const avgProgress = Math.round(
              member.tasks.reduce((acc, t) => acc + t.progress, 0) / member.tasks.length
            );

            return (
              <MemberCard 
                key={member.id}
                onClick={() => setSelectedMember(member)}
              >
                {/* Header with gradient */}
                <MemberCardHeader>
                  <MemberCardHeaderContent>
                    <MemberCardBadges>
                      <Badge className="bg-white/20 text-white border-none">
                        워케이션 진행 중
                      </Badge>
                      <Badge className="bg-white/90 text-[#3F4A5A] border-none">
                        D-{daysRemaining}
                      </Badge>
                    </MemberCardBadges>
                    
                    <MemberCardInfo>
                      <MemberCardAvatar>
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-16 h-16 rounded-full border-4 border-white/20 object-cover"
                        />
                      </MemberCardAvatar>
                      <div>
                        <MemberCardName>{member.name}</MemberCardName>
                        <MemberCardRole>
                          {getRoleDisplay(member.role, member.customRole)}
                        </MemberCardRole>
                      </div>
                    </MemberCardInfo>
                  </MemberCardHeaderContent>
                </MemberCardHeader>

                {/* Content */}
                <MemberCardContent>
                  {/* Location & Date */}
                  <div className="space-y-2">
                    <MemberCardLocation>
                      <MapPin className="w-4 h-4 text-[#3F4A5A]" />
                      <span className="text-sm font-medium">{member.location}</span>
                    </MemberCardLocation>
                    <MemberCardDate>
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {member.startDate.slice(5)} ~ {member.endDate.slice(5)}
                      </span>
                    </MemberCardDate>
                  </div>

                  {/* Projects */}
                  <div>
                    <p className="text-xs text-[#6E8FB3] mb-2">담당 작품</p>
                    <MemberCardProjects>
                      {member.projectNames.map((project, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline" 
                          className="text-xs border-[#DADDE1] text-[#1F2328]"
                        >
                          {project}
                        </Badge>
                      ))}
                    </MemberCardProjects>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6E8FB3]">전체 작업 진행률</span>
                      <span className="text-sm font-semibold text-[#1F2328]">{avgProgress}%</span>
                    </div>
                    <Progress value={avgProgress} className="h-2" />
                  </div>

                  {/* Tasks Summary */}
                  <MemberCardTasks>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-[#6E8FB3]">
                        작업 <span className="font-semibold text-[#1F2328]">{member.tasks.length}개</span>
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-[#3F4A5A] hover:text-[#3F4A5A]/80 hover:bg-[#3F4A5A]/10 transition-transform"
                    >
                      상세보기
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </MemberCardTasks>
                </MemberCardContent>
              </MemberCard>
            );
          })}
        </MembersGrid>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <EmptyStateCard>
            <EmptyStateIcon>
              <MapPin className="w-8 h-8 text-purple-600" />
            </EmptyStateIcon>
            <EmptyStateTitle>워케이션 중인 팀원이 없습니다</EmptyStateTitle>
            <EmptyStateText>선택한 역할의 워케이션 인원이 없습니다</EmptyStateText>
          </EmptyStateCard>
        )}
      </AgencyWorkcationBody>

      {/* Detail Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">워케이션 상세 정보</DialogTitle>
              </DialogHeader>

              <DetailModalContent>
                {/* Member Info Card */}
                <div className="bg-[#3F4A5A] rounded-lg p-6 text-white">
                  <DetailMemberHeader>
                    <DetailMemberInfo>
                      <DetailMemberAvatar>
                        <img
                          src={selectedMember.avatar}
                          alt={selectedMember.name}
                          className="w-20 h-20 rounded-full border-4 border-white/20 object-cover"
                        />
                      </DetailMemberAvatar>
                      <div>
                        <DetailMemberName>{selectedMember.name}</DetailMemberName>
                        <DetailMemberRole>
                          {getRoleDisplay(selectedMember.role, selectedMember.customRole)}
                        </DetailMemberRole>
                      </div>
                    </DetailMemberInfo>
                    <Badge className="bg-white/20 text-white border-none text-sm">
                      워케이션 진행 중
                    </Badge>
                  </DetailMemberHeader>

                  <DetailMemberGrid>
                    <DetailMemberItem>
                      <DetailMemberLabel>
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm text-white/70">위치</span>
                      </DetailMemberLabel>
                      <DetailMemberValue>{selectedMember.location}</DetailMemberValue>
                    </DetailMemberItem>
                    <DetailMemberItem>
                      <DetailMemberLabel>
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm text-white/70">기간</span>
                      </DetailMemberLabel>
                      <DetailMemberValue>
                        {selectedMember.startDate} ~ {selectedMember.endDate}
                      </DetailMemberValue>
                      <p className="text-sm text-white/70 mt-1">
                        (D-{getDaysRemaining(selectedMember.endDate)}일 남음)
                      </p>
                    </DetailMemberItem>
                  </DetailMemberGrid>

                  <DetailMemberGrid>
                    <DetailMemberItem>
                      <DetailMemberLabel>
                        <Mail className="w-4 h-4" />
                        <span className="text-sm text-white/70">이메일</span>
                      </DetailMemberLabel>
                      <DetailMemberValue className="text-sm">{selectedMember.contact.email}</DetailMemberValue>
                    </DetailMemberItem>
                    {selectedMember.contact.phone && (
                      <DetailMemberItem>
                        <DetailMemberLabel>
                          <Phone className="w-4 h-4" />
                          <span className="text-sm text-white/70">연락처</span>
                        </DetailMemberLabel>
                        <DetailMemberValue className="text-sm">{selectedMember.contact.phone}</DetailMemberValue>
                      </DetailMemberItem>
                    )}
                  </DetailMemberGrid>
                </div>

                {/* Daily Report */}
                {selectedMember.dailyReport && (
                  <DailyReportCard>
                    <DailyReportHeader>
                      <DailyReportTitle>
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-[#1F2328]">현재 작업 중인 업무</h4>
                      </DailyReportTitle>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {selectedMember.dailyReport.lastUpdated}
                      </Badge>
                    </DailyReportHeader>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-[#6E8FB3] mb-2">전체 진행률</p>
                        <DailyReportProgress>
                          <Progress value={selectedMember.dailyReport.progress} className="flex-1" />
                          <span className="text-lg font-bold text-[#1F2328]">
                            {selectedMember.dailyReport.progress}%
                          </span>
                        </DailyReportProgress>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#1F2328] mb-2">완료한 작업</p>
                        <DailyReportTasks>
                          {selectedMember.dailyReport.tasksCompleted.map((task, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-[#1F2328]">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              {task}
                            </li>
                          ))}
                        </DailyReportTasks>
                      </div>
                    </div>
                  </DailyReportCard>
                )}

                {/* Tasks List */}
                <div>
                  <h4 className="font-semibold text-[#1F2328] mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#6E8FB3]" />
                    담당 작업 목록
                  </h4>
                  <TasksList>
                    {selectedMember.tasks.map((task) => (
                      <TaskCard key={task.id}>
                        <TaskCardHeader>
                          <div className="flex-1">
                            <TaskCardTitle>
                              <h5 className="font-semibold text-[#1F2328]">{task.title}</h5>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(task.priority)}`}
                              >
                                {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '보통' : '낮음'}
                              </Badge>
                            </TaskCardTitle>
                            <TaskCardInfo>{task.projectName}</TaskCardInfo>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-[#6E8FB3]">
                            <Clock className="w-4 h-4" />
                            <span>{task.deadline}</span>
                          </div>
                        </TaskCardHeader>

                        <TaskCardProgress>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#6E8FB3]">진행률</span>
                            <span className="font-semibold text-[#1F2328]">{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </TaskCardProgress>

                        {task.progress === 100 && (
                          <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>작업 완료</span>
                          </div>
                        )}
                      </TaskCard>
                    ))}
                  </TasksList>
                </div>

                {/* Projects */}
                <ProjectsSection>
                  <h4 className="font-semibold text-[#1F2328] mb-4">참여 작품</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.projectNames.map((project, idx) => (
                      <Badge 
                        key={idx}
                        variant="outline"
                        className="px-4 py-2 text-sm border-[#DADDE1] text-[#1F2328]"
                      >
                        {project}
                      </Badge>
                    ))}
                  </div>
                </ProjectsSection>
              </DetailModalContent>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AgencyWorkcationRoot>
  );
}
