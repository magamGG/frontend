import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { 
  Home, 
  Printer, 
  User, 
  Settings,
  Calendar,
  Activity,
  AlertTriangle,
  FileText,
  Heart,
  Brain
} from 'lucide-react';
import {
  MasterStyleGuideRoot,
  MasterStyleGuideBody,
  HeaderSection,
  HeaderTitle,
  HeaderRight,
  HeaderSubtitle,
  UserProfile,
  UserAvatar,
  UserName,
  ScheduleGrid,
  ScheduleCard,
  ScheduleHeader,
  ScheduleLabel,
  ScheduleTitle,
  ScheduleIcon,
  ScheduleContent,
  ScheduleDays,
  ScheduleDate,
  StatusGrid,
  StatusCard,
  StatusCardHeader,
  StatusCardTitle,
  StatusBadge,
  StatusProgress,
  StatusItemList,
  StatusItem,
  StatusItemLabel,
  StatusItemBadge,
  RiskCard,
  RiskCardHeader,
  RiskCardTitle,
  RiskCardContent,
  RiskItem,
  RiskItemHeader,
  RiskItemTitle,
  RiskItemBadge,
  RiskItemDescription,
  SurveyCard,
  SurveyCardHeader,
  SurveyCardTitle,
  SurveyList,
  SurveyButton,
  SurveyButtonContent,
  SurveyButtonTitle,
  SurveyButtonSubtitle,
  MonitoringGrid,
  MonitoringCard,
  MonitoringCardHeader,
  MonitoringCardTitle,
  MonitoringTable,
  MonitoringTableHead,
  MonitoringTableHeaderRow,
  MonitoringTableHeaderCell,
  MonitoringTableBody,
  MonitoringTableRow,
  MonitoringTableCell,
  ScoreCell,
  NonParticipantsCard,
  NonParticipantsHeader,
  NonParticipantsTitle,
  NonParticipantsDescription,
  NonParticipantsList,
  NonParticipantItem,
  NonParticipantAvatar,
  NonParticipantInfo,
  NonParticipantName,
  NonParticipantTeam,
  FloatingActions,
  FloatingActionButton,
} from './MasterStyleGuidePage.styled';

// TODO: Zustand store mapping - 스타일 가이드 모니터링 데이터
const monitoringData = [
  { name: '김민준', mentalScore: 85, physicalScore: 92, risk: '낮음', date: '2026-01-15' },
  { name: '이서연', mentalScore: 72, physicalScore: 78, risk: '중간', date: '2026-01-14' },
  { name: '박지호', mentalScore: 95, physicalScore: 88, risk: '낮음', date: '2026-01-14' },
  { name: '최유나', mentalScore: 68, physicalScore: 71, risk: '중간', date: '2026-01-13' },
];

// TODO: Zustand store mapping - 미검진 인원 데이터
const nonParticipants = [
  { name: '강호배', team: '영업팀', daysOverdue: 7 },
  { name: '조인혜', team: '개발팀', daysOverdue: 8 },
  { name: '서동혁', team: '경영지원', daysOverdue: 9 },
  { name: '김미영', team: '디자인팀', daysOverdue: 10 },
];

const mentalHealthTests = [
  { label: '스트레스 지수 측정', status: '완료', statusColor: '#10B981' },
  { label: '우울증 선별 검사', status: '완료', statusColor: '#10B981' },
  { label: '불안 장애 검사', status: '진행중', statusColor: '#F59E0B' },
  { label: '심리 상담 평가', status: '대기', statusColor: '#9CA3AF' },
];

const physicalHealthTests = [
  { label: '혈압 및 맥박 측정', status: '완료', statusColor: '#10B981' },
  { label: '혈액 검사', status: '완료', statusColor: '#10B981' },
  { label: '신체 계측', status: '완료', statusColor: '#10B981' },
  { label: '시력 및 청력 검사', status: '진행중', statusColor: '#F59E0B' },
];

const surveys = [
  { title: '번아웃 증후군 자가 진단', time: '약 5분' },
  { title: '수면의 질 평가', time: '약 3분' },
  { title: '생활 습관 체크리스트', time: '약 7분' },
];

const getRiskColor = (risk) => {
  switch (risk) {
    case '낮음':
      return 'bg-green-500/10 text-green-700';
    case '중간':
      return 'bg-yellow-500/10 text-yellow-700';
    case '높음':
      return 'bg-red-500/10 text-red-700';
    default:
      return 'bg-gray-500/10 text-gray-700';
  }
};

const getScoreColor = (score) => {
  if (score >= 80) return '#10B981';
  if (score >= 70) return '#F59E0B';
  return '#EF4444';
};

const getRiskBadgeColor = (risk) => {
  switch (risk) {
    case '낮음':
      return { borderColor: '#10B981', color: '#10B981' };
    case '중간':
      return { borderColor: '#F59E0B', color: '#F59E0B' };
    case '높음':
      return { borderColor: '#EF4444', color: '#EF4444' };
    default:
      return { borderColor: '#9CA3AF', color: '#9CA3AF' };
  }
};

export function MasterStyleGuidePage() {
  return (
    <MasterStyleGuideRoot>
      <MasterStyleGuideBody>
        {/* Header */}
        <HeaderSection>
          <HeaderTitle>마감지기</HeaderTitle>
          <HeaderRight>
            <HeaderSubtitle>전사 건강</HeaderSubtitle>
            <UserProfile>
              <UserAvatar />
              <UserName>김마기</UserName>
            </UserProfile>
          </HeaderRight>
        </HeaderSection>

        {/* Top Row - Schedule Cards */}
        <ScheduleGrid>
          {/* 다음 검진 예정일 - 정신 건강 */}
          <ScheduleCard>
            <ScheduleHeader>
              <div>
                <ScheduleLabel>다음 검진 예정일</ScheduleLabel>
                <ScheduleTitle>정신 건강 심층 검진</ScheduleTitle>
              </div>
              <ScheduleIcon $color="#9C27B0">
                <Brain className="w-8 h-8" />
              </ScheduleIcon>
            </ScheduleHeader>
            <ScheduleContent>
              <ScheduleDays $color="#9C27B0">D-7</ScheduleDays>
              <ScheduleDate>2026년 1월 26일</ScheduleDate>
            </ScheduleContent>
          </ScheduleCard>

          {/* 다음 검진 예정일 - 신체 건강 */}
          <ScheduleCard>
            <ScheduleHeader>
              <div>
                <ScheduleLabel>다음 검진 예정일</ScheduleLabel>
                <ScheduleTitle>신체 건강 심층 검진</ScheduleTitle>
              </div>
              <ScheduleIcon $color="#00ACC1">
                <Heart className="w-8 h-8" />
              </ScheduleIcon>
            </ScheduleHeader>
            <ScheduleContent>
              <ScheduleDays $color="#00ACC1">D-14</ScheduleDays>
              <ScheduleDate>2026년 2월 2일</ScheduleDate>
            </ScheduleContent>
          </ScheduleCard>
        </ScheduleGrid>

        {/* Middle Row - Detailed Status */}
        <StatusGrid>
          {/* 정신 건강 심층 검사 */}
          <StatusCard>
            <StatusCardHeader>
              <StatusCardTitle>정신 건강 심층 검사</StatusCardTitle>
              <StatusBadge $color="#9C27B0">67%</StatusBadge>
            </StatusCardHeader>
            <StatusProgress value={67} className="mb-4" />
            <StatusItemList>
              {mentalHealthTests.map((test, idx) => (
                <StatusItem key={idx}>
                  <StatusItemLabel>{test.label}</StatusItemLabel>
                  <StatusItemBadge $color={test.statusColor}>{test.status}</StatusItemBadge>
                </StatusItem>
              ))}
            </StatusItemList>
          </StatusCard>

          {/* 신체 건강 심층 검사 */}
          <StatusCard>
            <StatusCardHeader>
              <StatusCardTitle>신체 건강 심층 검사</StatusCardTitle>
              <StatusBadge $color="#00ACC1">83%</StatusBadge>
            </StatusCardHeader>
            <StatusProgress value={83} className="mb-4" />
            <StatusItemList>
              {physicalHealthTests.map((test, idx) => (
                <StatusItem key={idx}>
                  <StatusItemLabel>{test.label}</StatusItemLabel>
                  <StatusItemBadge $color={test.statusColor}>{test.status}</StatusItemBadge>
                </StatusItem>
              ))}
            </StatusItemList>
          </StatusCard>
        </StatusGrid>

        {/* Bottom Row - Risk & Survey */}
        <StatusGrid>
          {/* 위험 */}
          <RiskCard>
            <RiskCardHeader>
              <AlertTriangle className="w-5 h-5" style={{ color: '#EF4444' }} />
              <RiskCardTitle>위험</RiskCardTitle>
            </RiskCardHeader>
            <RiskCardContent>
              <RiskItem $variant="high">
                <RiskItemHeader>
                  <RiskItemTitle>고위험군 관리</RiskItemTitle>
                  <RiskItemBadge $color="red">긴급</RiskItemBadge>
                </RiskItemHeader>
                <RiskItemDescription>3명의 직원이 즉각적인 관리가 필요합니다</RiskItemDescription>
              </RiskItem>
              <RiskItem $variant="medium">
                <RiskItemHeader>
                  <RiskItemTitle>중위험군 모니터링</RiskItemTitle>
                  <RiskItemBadge $color="orange">주의</RiskItemBadge>
                </RiskItemHeader>
                <RiskItemDescription>7명의 직원이 지속적인 관찰이 필요합니다</RiskItemDescription>
              </RiskItem>
            </RiskCardContent>
          </RiskCard>

          {/* 설문 목록 */}
          <SurveyCard>
            <SurveyCardHeader>
              <FileText className="w-5 h-5" style={{ color: '#6E8FB3' }} />
              <SurveyCardTitle>설문 목록</SurveyCardTitle>
            </SurveyCardHeader>
            <SurveyList>
              {surveys.map((survey, idx) => (
                <SurveyButton key={idx} variant="outline">
                  <SurveyButtonContent>
                    <SurveyButtonTitle>{survey.title}</SurveyButtonTitle>
                    <SurveyButtonSubtitle>소요 시간: {survey.time}</SurveyButtonSubtitle>
                  </SurveyButtonContent>
                </SurveyButton>
              ))}
            </SurveyList>
          </SurveyCard>
        </StatusGrid>

        {/* Bottom Section - Monitors & Non-participants */}
        <MonitoringGrid>
          {/* 검진 모니터링 */}
          <MonitoringCard>
            <MonitoringCardHeader>
              <Activity className="w-5 h-5" style={{ color: '#6E8FB3' }} />
              <MonitoringCardTitle>검진 모니터링</MonitoringCardTitle>
            </MonitoringCardHeader>
            <MonitoringTable>
              <MonitoringTableHead>
                <MonitoringTableHeaderRow>
                  <MonitoringTableHeaderCell>이름</MonitoringTableHeaderCell>
                  <MonitoringTableHeaderCell $align="center">정신</MonitoringTableHeaderCell>
                  <MonitoringTableHeaderCell $align="center">신체</MonitoringTableHeaderCell>
                  <MonitoringTableHeaderCell $align="center">위험도</MonitoringTableHeaderCell>
                  <MonitoringTableHeaderCell $align="right">검진일</MonitoringTableHeaderCell>
                </MonitoringTableHeaderRow>
              </MonitoringTableHead>
              <MonitoringTableBody>
                {monitoringData.map((item, idx) => {
                  const riskColors = getRiskBadgeColor(item.risk);
                  return (
                    <MonitoringTableRow key={idx}>
                      <MonitoringTableCell $fontWeight="medium">{item.name}</MonitoringTableCell>
                      <MonitoringTableCell $align="center">
                        <ScoreCell $color={getScoreColor(item.mentalScore)}>
                          {item.mentalScore}
                        </ScoreCell>
                      </MonitoringTableCell>
                      <MonitoringTableCell $align="center">
                        <ScoreCell $color={getScoreColor(item.physicalScore)}>
                          {item.physicalScore}
                        </ScoreCell>
                      </MonitoringTableCell>
                      <MonitoringTableCell $align="center">
                        <Badge variant="outline" className="text-xs" style={riskColors}>
                          {item.risk}
                        </Badge>
                      </MonitoringTableCell>
                      <MonitoringTableCell $align="right">{item.date}</MonitoringTableCell>
                    </MonitoringTableRow>
                  );
                })}
              </MonitoringTableBody>
            </MonitoringTable>
          </MonitoringCard>

          {/* 미검진 인원 집중 관리 */}
          <NonParticipantsCard>
            <NonParticipantsHeader>
              <NonParticipantsTitle>미검진 인원 집중 관리</NonParticipantsTitle>
              <NonParticipantsDescription>
                직원을 위치하기 전송 위해 미검진 인원을 보내드립니다.
              </NonParticipantsDescription>
            </NonParticipantsHeader>
            <NonParticipantsList>
              {nonParticipants.map((person, idx) => (
                <NonParticipantItem key={idx}>
                  <NonParticipantAvatar>
                    <User className="w-5 h-5" style={{ color: '#6B7280' }} />
                  </NonParticipantAvatar>
                  <NonParticipantInfo>
                    <NonParticipantName>{person.name}</NonParticipantName>
                    <NonParticipantTeam>{person.team}</NonParticipantTeam>
                  </NonParticipantInfo>
                  <Badge style={{ background: '#FEE2E2', color: '#991B1B', flexShrink: 0 }}>
                    +{person.daysOverdue}일 지남
                  </Badge>
                </NonParticipantItem>
              ))}
            </NonParticipantsList>
          </NonParticipantsCard>
        </MonitoringGrid>

        {/* Floating Action Buttons */}
        <FloatingActions>
          <FloatingActionButton variant="ghost" size="icon">
            <Home className="w-5 h-5" style={{ color: '#3F4A5A' }} />
          </FloatingActionButton>
          <FloatingActionButton variant="ghost" size="icon">
            <Calendar className="w-5 h-5" style={{ color: '#3F4A5A' }} />
          </FloatingActionButton>
          <FloatingActionButton variant="ghost" size="icon">
            <Printer className="w-5 h-5" style={{ color: '#3F4A5A' }} />
          </FloatingActionButton>
          <FloatingActionButton variant="ghost" size="icon">
            <User className="w-5 h-5" style={{ color: '#3F4A5A' }} />
          </FloatingActionButton>
          <FloatingActionButton variant="ghost" size="icon">
            <Settings className="w-5 h-5" style={{ color: '#3F4A5A' }} />
          </FloatingActionButton>
        </FloatingActions>
      </MasterStyleGuideBody>
    </MasterStyleGuideRoot>
  );
}
