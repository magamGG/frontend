import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Users, Plus, Mail, MessageCircle } from 'lucide-react';
import {
  TeamRoot,
  TeamBody,
  HeaderSection,
  HeaderActionsLeft,
  FilterButtonGroup,
  TeamOverviewGrid,
  TeamMembersGrid,
  TeamMemberCard,
  TeamMemberHeader,
  AvatarContainer,
  AvatarText,
  TeamMemberInfo,
  TeamMemberNameRow,
  TeamMemberName,
  TeamMemberRole,
  TeamMemberInfoList,
  TeamMemberInfoItem,
  TeamMemberInfoLabel,
  TeamMemberInfoValue,
  ProductivitySection,
  ProductivityHeader,
  TeamMemberActions,
} from './TeamPage.styled';

// 근태 상태 정의
const ATTENDANCE_STATUS = {
  WORKING: '출근',
  ON_LEAVE: '휴가',
};

// TODO: Zustand store mapping - 팀원 목록
const initialTeamMembers = [
  {
    id: 1,
    name: '김작가',
    role: '메인 작가',
    status: ATTENDANCE_STATUS.WORKING,
    avatar: '김',
    projects: ['로맨스 판타지', '학원물'],
    productivity: 85,
    workHours: '8.5시간',
  },
  {
    id: 2,
    name: '이어시',
    role: '어시스턴트',
    status: ATTENDANCE_STATUS.WORKING,
    avatar: '이',
    projects: ['로맨스 판타지'],
    productivity: 92,
    workHours: '7.2시간',
  },
  {
    id: 3,
    name: '박채색',
    role: '채색 담당',
    status: ATTENDANCE_STATUS.ON_LEAVE,
    avatar: '박',
    projects: ['학원물', '액션 판타지'],
    productivity: 78,
    workHours: '-',
  },
  {
    id: 4,
    name: '정배경',
    role: '배경 담당',
    status: ATTENDANCE_STATUS.WORKING,
    avatar: '정',
    projects: ['액션 판타지'],
    productivity: 88,
    workHours: '6.8시간',
  },
];

export function TeamPage() {
  const [filterStatus, setFilterStatus] = useState('전체');
  const [teamMembers] = useState(initialTeamMembers);

  // 필터링된 팀원 목록
  const filteredMembers =
    filterStatus === '전체'
      ? teamMembers
      : teamMembers.filter((member) => member.status === filterStatus);

  // 통계 계산
  const totalMembers = teamMembers.length;
  const workingMembers = teamMembers.filter((m) => m.status === ATTENDANCE_STATUS.WORKING).length;
  const onLeaveMembers = teamMembers.filter((m) => m.status === ATTENDANCE_STATUS.ON_LEAVE).length;
  const averageProductivity = Math.round(
    teamMembers.reduce((sum, m) => sum + m.productivity, 0) / teamMembers.length
  );

  // 필터 버튼 목록
  const filterButtons = ['전체', ATTENDANCE_STATUS.WORKING, ATTENDANCE_STATUS.ON_LEAVE];

  return (
    <TeamRoot>
      <TeamBody>
        {/* 헤더 */}
        <HeaderSection>
          <HeaderActionsLeft>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              팀원 추가
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
        </HeaderSection>

        {/* 팀 개요 통계 */}
        <TeamOverviewGrid>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">총 팀원</p>
            <p className="text-2xl font-bold text-foreground">{totalMembers}명</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">출근</p>
            <p className="text-2xl font-bold text-primary">{workingMembers}명</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">휴가/휴재</p>
            <p className="text-2xl font-bold text-secondary">{onLeaveMembers}명</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-1">평균 생산성</p>
            <p className="text-2xl font-bold text-foreground">{averageProductivity}%</p>
          </Card>
        </TeamOverviewGrid>

        {/* 팀원 목록 */}
        <TeamMembersGrid>
          {filteredMembers.map((member) => (
            <TeamMemberCard key={member.id}>
              <TeamMemberHeader>
                <AvatarContainer>
                  <AvatarText>{member.avatar}</AvatarText>
                </AvatarContainer>
                <TeamMemberInfo>
                  <TeamMemberNameRow>
                    <TeamMemberName>{member.name}</TeamMemberName>
                    <Badge variant={member.status === ATTENDANCE_STATUS.WORKING ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </TeamMemberNameRow>
                  <TeamMemberRole>{member.role}</TeamMemberRole>
                </TeamMemberInfo>
              </TeamMemberHeader>

              <TeamMemberInfoList>
                <TeamMemberInfoItem>
                  <TeamMemberInfoLabel>담당 작품</TeamMemberInfoLabel>
                  <TeamMemberInfoValue truncate>{member.projects.join(', ')}</TeamMemberInfoValue>
                </TeamMemberInfoItem>
                <TeamMemberInfoItem>
                  <TeamMemberInfoLabel>근무 시간</TeamMemberInfoLabel>
                  <TeamMemberInfoValue>{member.workHours}</TeamMemberInfoValue>
                </TeamMemberInfoItem>
                <ProductivitySection>
                  <ProductivityHeader>
                    <TeamMemberInfoLabel>생산성</TeamMemberInfoLabel>
                    <TeamMemberInfoValue>{member.productivity}%</TeamMemberInfoValue>
                  </ProductivityHeader>
                  <Progress value={member.productivity} className="h-1.5" />
                </ProductivitySection>
              </TeamMemberInfoList>

              <TeamMemberActions>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Mail className="w-3 h-3 mr-1" />
                  이메일
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  메시지
                </Button>
              </TeamMemberActions>
            </TeamMemberCard>
          ))}
        </TeamMembersGrid>
      </TeamBody>
    </TeamRoot>
  );
}
