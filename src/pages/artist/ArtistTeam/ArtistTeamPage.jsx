import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Users, Mail, MessageCircle, Calendar } from 'lucide-react';
import {
  ArtistTeamRoot,
  ArtistTeamBody,
  ArtistTeamHeader,
  ArtistTeamTitle,
  ArtistTeamDescription,
  ArtistTeamOverviewGrid,
  ArtistTeamOverviewCard,
  ArtistTeamOverviewContent,
  ArtistTeamOverviewLabel,
  ArtistTeamOverviewValue,
  ArtistTeamOverviewValueGreen,
  ArtistTeamOverviewValueAmber,
  ArtistTeamOverviewIcon,
  ArtistTeamMembersCard,
  ArtistTeamMembersTitle,
  ArtistTeamMembersGrid,
  ArtistTeamMemberCard,
  ArtistTeamMemberHeader,
  ArtistTeamMemberAvatar,
  ArtistTeamMemberAvatarText,
  ArtistTeamMemberInfo,
  ArtistTeamMemberNameRow,
  ArtistTeamMemberName,
  ArtistTeamMemberRole,
  ArtistTeamMemberInfoList,
  ArtistTeamMemberInfoItem,
  ArtistTeamMemberInfoLabel,
  ArtistTeamMemberInfoValue,
  ArtistTeamMemberProductivity,
  ArtistTeamMemberProductivityHeader,
  ArtistTeamMemberActions,
  ArtistTeamActivityCard,
  ArtistTeamActivityTitle,
  ArtistTeamActivityList,
  ArtistTeamActivityItem,
  ArtistTeamActivityAvatar,
  ArtistTeamActivityAvatarText,
  ArtistTeamActivityContent,
  ArtistTeamActivityText,
  ArtistTeamActivityTime,
} from './ArtistTeamPage.styled';

// TODO: Zustand store mapping - 작가 팀원 목록
const teamMembers = [
  {
    id: 1,
    name: '김작가',
    role: '메인 작가',
    status: '출근',
    avatar: '김',
    projects: ['내 웹툰'],
    productivity: 85,
    workHours: '8.5시간',
    isMe: true,
  },
  {
    id: 2,
    name: '이어시',
    role: '어시스턴트',
    status: '출근',
    avatar: '이',
    projects: ['내 웹툰'],
    productivity: 92,
    workHours: '7.2시간',
    isMe: false,
  },
  {
    id: 3,
    name: '박채색',
    role: '채색 담당',
    status: '휴재',
    avatar: '박',
    projects: ['내 웹툰'],
    productivity: 78,
    workHours: '-',
    isMe: false,
  },
  {
    id: 4,
    name: '정배경',
    role: '배경 담당',
    status: '출근',
    avatar: '정',
    projects: ['내 웹툰'],
    productivity: 88,
    workHours: '6.8시간',
    isMe: false,
  },
];

// TODO: Zustand store mapping - 최근 활동 목록
const recentActivities = [
  {
    id: 1,
    memberName: '이어시',
    memberAvatar: '이',
    isPrimary: true,
    action: '에피소드 42 채색을 완료했습니다.',
    time: '2시간 전',
  },
  {
    id: 2,
    memberName: '정배경',
    memberAvatar: '정',
    isPrimary: false,
    action: '배경 작업 5개를 업로드했습니다.',
    time: '5시간 전',
  },
  {
    id: 3,
    memberName: '박채색',
    memberAvatar: '박',
    isPrimary: false,
    action: '휴재를 신청했습니다.',
    time: '어제',
  },
  {
    id: 4,
    memberName: '김작가',
    memberAvatar: '김',
    isPrimary: true,
    action: '에피소드 43 스케치를 업로드했습니다.',
    time: '2일 전',
  },
];

export function ArtistTeamPage() {
  // 통계 계산
  const totalMembers = teamMembers.length;
  const workingMembers = teamMembers.filter((m) => m.status === '출근').length;
  const onLeaveMembers = teamMembers.filter((m) => m.status === '휴재').length;
  const averageProductivity = Math.round(teamMembers.reduce((sum, m) => sum + m.productivity, 0) / teamMembers.length);

  return (
    <ArtistTeamRoot>
      <ArtistTeamBody>
        {/* Header */}
        <ArtistTeamHeader>
          <ArtistTeamTitle>내 팀</ArtistTeamTitle>
          <ArtistTeamDescription>함께 작업하는 팀원들을 확인하고 소통하세요</ArtistTeamDescription>
        </ArtistTeamHeader>

        {/* Team Overview */}
        <ArtistTeamOverviewGrid>
          <ArtistTeamOverviewCard>
            <ArtistTeamOverviewContent>
              <ArtistTeamOverviewLabel>총 팀원</ArtistTeamOverviewLabel>
              <ArtistTeamOverviewValue>{totalMembers}명</ArtistTeamOverviewValue>
            </ArtistTeamOverviewContent>
            <ArtistTeamOverviewIcon $bgColor="var(--primary)">
              <Users className="w-6 h-6 text-primary" />
            </ArtistTeamOverviewIcon>
          </ArtistTeamOverviewCard>
          <ArtistTeamOverviewCard>
            <ArtistTeamOverviewContent>
              <ArtistTeamOverviewLabel>출근</ArtistTeamOverviewLabel>
              <ArtistTeamOverviewValueGreen>{workingMembers}명</ArtistTeamOverviewValueGreen>
            </ArtistTeamOverviewContent>
            <ArtistTeamOverviewIcon $bgColor="#16a34a">
              <Calendar className="w-6 h-6 text-green-600" />
            </ArtistTeamOverviewIcon>
          </ArtistTeamOverviewCard>
          <ArtistTeamOverviewCard>
            <ArtistTeamOverviewContent>
              <ArtistTeamOverviewLabel>휴재</ArtistTeamOverviewLabel>
              <ArtistTeamOverviewValueAmber>{onLeaveMembers}명</ArtistTeamOverviewValueAmber>
            </ArtistTeamOverviewContent>
            <ArtistTeamOverviewIcon $bgColor="#d97706">
              <Calendar className="w-6 h-6 text-amber-600" />
            </ArtistTeamOverviewIcon>
          </ArtistTeamOverviewCard>
          <ArtistTeamOverviewCard>
            <ArtistTeamOverviewContent>
              <ArtistTeamOverviewLabel>평균 생산성</ArtistTeamOverviewLabel>
              <ArtistTeamOverviewValue>{averageProductivity}%</ArtistTeamOverviewValue>
            </ArtistTeamOverviewContent>
            <ArtistTeamOverviewIcon $bgColor="#2563eb">
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#2563eb' }}>%</span>
            </ArtistTeamOverviewIcon>
          </ArtistTeamOverviewCard>
        </ArtistTeamOverviewGrid>

        {/* Team Members */}
        <ArtistTeamMembersCard>
          <ArtistTeamMembersTitle>팀원 목록</ArtistTeamMembersTitle>
          <ArtistTeamMembersGrid>
            {teamMembers.map((member) => (
              <ArtistTeamMemberCard key={member.id} isMe={member.isMe}>
                <ArtistTeamMemberHeader>
                  <ArtistTeamMemberAvatar isMe={member.isMe}>
                    <ArtistTeamMemberAvatarText isMe={member.isMe}>{member.avatar}</ArtistTeamMemberAvatarText>
                  </ArtistTeamMemberAvatar>
                  <ArtistTeamMemberInfo>
                    <ArtistTeamMemberNameRow>
                      <ArtistTeamMemberName>{member.name}</ArtistTeamMemberName>
                      {member.isMe && (
                        <Badge className="bg-primary text-xs">나</Badge>
                      )}
                      <Badge variant={member.status === '출근' ? 'default' : 'secondary'} className="text-xs">
                        {member.status}
                      </Badge>
                    </ArtistTeamMemberNameRow>
                    <ArtistTeamMemberRole>{member.role}</ArtistTeamMemberRole>
                  </ArtistTeamMemberInfo>
                </ArtistTeamMemberHeader>

                <ArtistTeamMemberInfoList>
                  <ArtistTeamMemberInfoItem>
                    <ArtistTeamMemberInfoLabel>담당 작품</ArtistTeamMemberInfoLabel>
                    <ArtistTeamMemberInfoValue>{member.projects.join(', ')}</ArtistTeamMemberInfoValue>
                  </ArtistTeamMemberInfoItem>
                  <ArtistTeamMemberInfoItem>
                    <ArtistTeamMemberInfoLabel>근무 시간</ArtistTeamMemberInfoLabel>
                    <ArtistTeamMemberInfoValue>{member.workHours}</ArtistTeamMemberInfoValue>
                  </ArtistTeamMemberInfoItem>
                  <ArtistTeamMemberProductivity>
                    <ArtistTeamMemberProductivityHeader>
                      <ArtistTeamMemberInfoLabel>생산성</ArtistTeamMemberInfoLabel>
                      <ArtistTeamMemberInfoValue>{member.productivity}%</ArtistTeamMemberInfoValue>
                    </ArtistTeamMemberProductivityHeader>
                    <Progress value={member.productivity} className="h-2" />
                  </ArtistTeamMemberProductivity>
                </ArtistTeamMemberInfoList>

                {!member.isMe && (
                  <ArtistTeamMemberActions>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      이메일
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      메시지
                    </Button>
                  </ArtistTeamMemberActions>
                )}
              </ArtistTeamMemberCard>
            ))}
          </ArtistTeamMembersGrid>
        </ArtistTeamMembersCard>

        {/* Team Activity */}
        <ArtistTeamActivityCard>
          <ArtistTeamActivityTitle>최근 활동</ArtistTeamActivityTitle>
          <ArtistTeamActivityList>
            {recentActivities.map((activity) => (
              <ArtistTeamActivityItem key={activity.id}>
                <ArtistTeamActivityAvatar isPrimary={activity.isPrimary}>
                  <ArtistTeamActivityAvatarText isPrimary={activity.isPrimary}>
                    {activity.memberAvatar}
                  </ArtistTeamActivityAvatarText>
                </ArtistTeamActivityAvatar>
                <ArtistTeamActivityContent>
                  <ArtistTeamActivityText>
                    <strong>{activity.memberName}</strong> 님이 {activity.action}
                  </ArtistTeamActivityText>
                  <ArtistTeamActivityTime>{activity.time}</ArtistTeamActivityTime>
                </ArtistTeamActivityContent>
              </ArtistTeamActivityItem>
            ))}
          </ArtistTeamActivityList>
        </ArtistTeamActivityCard>
      </ArtistTeamBody>
    </ArtistTeamRoot>
  );
}
