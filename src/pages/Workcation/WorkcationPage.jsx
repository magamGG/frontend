import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Palmtree, MapPin, Calendar } from 'lucide-react';
import {
  WorkcationRoot,
  WorkcationBody,
  HeaderCard,
  HeaderCardContent,
  HeaderCardText,
  HeaderCardTitle,
  HeaderCardDescription,
  MainContentGrid,
  CurrentWorkcationCard,
  CurrentWorkcationTitle,
  CurrentWorkcationContent,
  CurrentWorkcationHeader,
  CurrentWorkcationInfo,
  CurrentWorkcationName,
  CurrentWorkcationMeta,
  CurrentWorkcationMetaItem,
  StatsGrid,
  StatCard,
  StatLabel,
  StatValue,
  StatValuePrimary,
  CurrentWorkcationActions,
  TipsCard,
  TipsTitle,
  TipsList,
  TipItem,
  TipTitle,
  TipDescription,
  PastWorkcationsCard,
  PastWorkcationsTitle,
  PastWorkcationsGrid,
  PastWorkcationItem,
  PastWorkcationHeader,
  PastWorkcationName,
  PastWorkcationDate,
  PastWorkcationStats,
  PastWorkcationStat,
} from './WorkcationPage.styled';

// 워케이션 팁 데이터
const workcationTips = [
  {
    icon: '🌅',
    bgColor: 'var(--primary)',
    title: '아침 루틴',
    description: '새로운 환경에서 규칙적인 아침 루틴을 유지하세요',
  },
  {
    icon: '⏰',
    bgColor: 'var(--secondary)',
    title: '업무 시간',
    description: '명확한 업무 시간을 설정하고 지키세요',
  },
  {
    icon: '🎨',
    bgColor: 'var(--accent)',
    title: '로컬 경험',
    description: '지역 문화를 경험하며 창의력을 충전하세요',
  },
];

// TODO: Zustand store mapping - 지난 워케이션 목록
const pastWorkcations = [
  {
    id: 1,
    location: '강릉 워케이션',
    date: '2025.12.01 - 12.15',
    productivity: 92,
    completedTasks: 12,
  },
  {
    id: 2,
    location: '부산 워케이션',
    date: '2025.11.10 - 11.20',
    productivity: 88,
    completedTasks: 9,
  },
  {
    id: 3,
    location: '전주 워케이션',
    date: '2025.10.15 - 10.25',
    productivity: 85,
    completedTasks: 8,
  },
];

export function WorkcationPage() {
  // TODO: Zustand store에서 현재 워케이션 데이터 가져오기
  const currentWorkcation = {
    name: '제주도 워케이션',
    location: '제주시 애월읍',
    startDate: '2026.01.10',
    endDate: '2026.01.20',
    elapsedDays: 3,
    remainingDays: 7,
    completedTasks: 5,
    status: '진행중',
  };

  return (
    <WorkcationRoot>
      <WorkcationBody>
        {/* 헤더 */}
        <HeaderCard>
          <HeaderCardContent>
            <HeaderCardText>
              <HeaderCardTitle>워케이션 모드</HeaderCardTitle>
              <HeaderCardDescription>새로운 환경에서 창의력을 발휘하고 재충전하세요</HeaderCardDescription>
            </HeaderCardText>
            <Button>
              <Palmtree className="w-4 h-4 mr-2" />
              워케이션 시작하기
            </Button>
          </HeaderCardContent>
        </HeaderCard>

        {/* 메인 콘텐츠 */}
        <MainContentGrid>
          {/* 진행 중인 워케이션 */}
          <CurrentWorkcationCard>
            <CurrentWorkcationTitle>진행 중인 워케이션</CurrentWorkcationTitle>
            <CurrentWorkcationContent>
              <CurrentWorkcationHeader>
                <CurrentWorkcationInfo>
                  <CurrentWorkcationName>{currentWorkcation.name}</CurrentWorkcationName>
                  <CurrentWorkcationMeta>
                    <CurrentWorkcationMetaItem>
                      <MapPin className="w-3 h-3" />
                      <span>{currentWorkcation.location}</span>
                    </CurrentWorkcationMetaItem>
                    <CurrentWorkcationMetaItem>
                      <Calendar className="w-3 h-3" />
                      <span>
                        {currentWorkcation.startDate} - {currentWorkcation.endDate}
                      </span>
                    </CurrentWorkcationMetaItem>
                  </CurrentWorkcationMeta>
                </CurrentWorkcationInfo>
                <Badge>{currentWorkcation.status}</Badge>
              </CurrentWorkcationHeader>

              <StatsGrid>
                <StatCard>
                  <StatLabel>경과 일수</StatLabel>
                  <StatValue>{currentWorkcation.elapsedDays}일</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>남은 일수</StatLabel>
                  <StatValue>{currentWorkcation.remainingDays}일</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>작업 완료</StatLabel>
                  <StatValuePrimary>{currentWorkcation.completedTasks}개</StatValuePrimary>
                </StatCard>
              </StatsGrid>

              <CurrentWorkcationActions>
                <Button variant="outline" size="sm" className="flex-1">
                  일정 수정
                </Button>
                <Button variant="destructive" size="sm" className="flex-1">
                  조기 종료
                </Button>
              </CurrentWorkcationActions>
            </CurrentWorkcationContent>
          </CurrentWorkcationCard>

          {/* 워케이션 팁 */}
          <TipsCard>
            <TipsTitle>워케이션 팁</TipsTitle>
            <TipsList>
              {workcationTips.map((tip, idx) => (
                <TipItem key={idx} $bgColor={tip.bgColor}>
                  <TipTitle>
                    {tip.icon} {tip.title}
                  </TipTitle>
                  <TipDescription>{tip.description}</TipDescription>
                </TipItem>
              ))}
            </TipsList>
          </TipsCard>
        </MainContentGrid>

        {/* 지난 워케이션 */}
        <PastWorkcationsCard>
          <PastWorkcationsTitle>지난 워케이션</PastWorkcationsTitle>
          <PastWorkcationsGrid>
            {pastWorkcations.map((workcation) => (
              <PastWorkcationItem key={workcation.id}>
                <PastWorkcationHeader>
                  <MapPin className="w-3 h-3 text-primary" />
                  <PastWorkcationName>{workcation.location}</PastWorkcationName>
                </PastWorkcationHeader>
                <PastWorkcationDate>{workcation.date}</PastWorkcationDate>
                <PastWorkcationStats>
                  <PastWorkcationStat>생산성: {workcation.productivity}%</PastWorkcationStat>
                  <PastWorkcationStat>완료: {workcation.completedTasks}개</PastWorkcationStat>
                </PastWorkcationStats>
              </PastWorkcationItem>
            ))}
          </PastWorkcationsGrid>
        </PastWorkcationsCard>
      </WorkcationBody>
    </WorkcationRoot>
  );
}
