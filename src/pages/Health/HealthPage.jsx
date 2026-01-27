import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Heart, Activity, Moon, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  HealthRoot,
  HealthBody,
  HealthOverviewGrid,
  WeeklyHealthCard,
  WeeklyHealthHeader,
  WeeklyHealthTitle,
  WeeklyHealthList,
  WeeklyHealthItem,
  WeeklyHealthDayLabel,
  WeeklyHealthProgressContainer,
  WeeklyHealthPercent,
  HealthRecommendationsGrid,
  RecommendationsCard,
  RecommendationsTitle,
  RecommendationsList,
  RecommendationItem,
  RecommendationContent,
  RecommendationIcon,
  RecommendationText,
  RecommendationTitle,
  RecommendationDescription,
  RecentRecordsCard,
  RecentRecordsTitle,
  RecentRecordsList,
  HealthRecordItem,
  HealthRecordHeader,
  HealthRecordDate,
  HealthRecordDetails,
  HealthRecordDetailItem,
  HealthRecordLabel,
  HealthRecordValue,
} from './HealthPage.styled';

// 요일 목록
const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

// 건강 권장사항 데이터
const healthRecommendations = [
  {
    icon: Moon,
    iconColor: 'var(--primary)',
    bgColor: 'var(--primary)',
    title: '충분한 수면',
    description: '매일 7-8시간의 수면을 취하세요.',
  },
  {
    icon: Activity,
    iconColor: 'var(--secondary)',
    bgColor: 'var(--secondary)',
    title: '스트레칭',
    description: '매시간 10분씩 손목과 어깨 스트레칭을 하세요.',
  },
  {
    icon: Heart,
    iconColor: 'var(--accent)',
    bgColor: 'var(--accent)',
    title: '정기 휴식',
    description: '20분마다 20초간 먼 곳을 바라보세요.',
  },
];

// TODO: Zustand store mapping - 최근 건강 기록
const recentHealthRecords = [
  { date: '2026.01.13', sleep: '7.5시간', pain: '3/10', burnout: '25%' },
  { date: '2026.01.12', sleep: '6.8시간', pain: '4/10', burnout: '30%' },
  { date: '2026.01.11', sleep: '7.2시간', pain: '3/10', burnout: '28%' },
  { date: '2026.01.10', sleep: '8.0시간', pain: '2/10', burnout: '20%' },
];

export function HealthPage() {
  // TODO: Zustand store에서 건강 데이터 가져오기
  const healthOverview = {
    sleepHours: 7.2,
    wristPain: 3,
    burnoutIndex: 25,
    stressLevel: 4,
  };

  // TODO: Zustand store에서 주간 건강 추이 데이터 가져오기
  const weeklyHealthData = daysOfWeek.map((day, idx) => ({
    day,
    value: 70 + idx * 5,
  }));

  return (
    <HealthRoot>
      <HealthBody>
        {/* 건강 개요 통계 */}
        <HealthOverviewGrid>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Moon className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">수면 시간</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{healthOverview.sleepHours}시간</p>
            <p className="text-xs text-muted-foreground mt-0.5">평균</p>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">손목 통증</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{healthOverview.wristPain}/10</p>
            <p className="text-xs text-muted-foreground mt-0.5">낮음</p>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-3 h-3 text-destructive" />
              <span className="text-xs text-muted-foreground">번아웃 지수</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{healthOverview.burnoutIndex}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">양호</p>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-3 h-3 text-secondary" />
              <span className="text-xs text-muted-foreground">스트레스</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{healthOverview.stressLevel}/10</p>
            <p className="text-xs text-muted-foreground mt-0.5">보통</p>
          </Card>
        </HealthOverviewGrid>

        {/* 주간 건강 추이 */}
        <WeeklyHealthCard>
          <WeeklyHealthHeader>
            <WeeklyHealthTitle>주간 건강 추이</WeeklyHealthTitle>
            <Button size="sm">건강 데이터 입력</Button>
          </WeeklyHealthHeader>

          <WeeklyHealthList>
            {weeklyHealthData.map((item) => (
              <WeeklyHealthItem key={item.day}>
                <WeeklyHealthDayLabel>{item.day}</WeeklyHealthDayLabel>
                <WeeklyHealthProgressContainer>
                  <Progress value={item.value} className="h-2" />
                </WeeklyHealthProgressContainer>
                <WeeklyHealthPercent>{item.value}%</WeeklyHealthPercent>
              </WeeklyHealthItem>
            ))}
          </WeeklyHealthList>
        </WeeklyHealthCard>

        {/* 건강 권장사항 및 최근 기록 */}
        <HealthRecommendationsGrid>
          {/* 건강 권장사항 */}
          <RecommendationsCard>
            <RecommendationsTitle>건강 권장사항</RecommendationsTitle>
            <RecommendationsList>
              {healthRecommendations.map((recommendation, idx) => {
                const Icon = recommendation.icon;
                return (
                  <RecommendationItem key={idx} $bgColor={recommendation.bgColor}>
                    <RecommendationContent>
                      <RecommendationIcon iconColor={recommendation.iconColor}>
                        <Icon className="w-4 h-4 mt-0.5" />
                      </RecommendationIcon>
                      <RecommendationText>
                        <RecommendationTitle>{recommendation.title}</RecommendationTitle>
                        <RecommendationDescription>{recommendation.description}</RecommendationDescription>
                      </RecommendationText>
                    </RecommendationContent>
                  </RecommendationItem>
                );
              })}
            </RecommendationsList>
          </RecommendationsCard>

          {/* 최근 건강 기록 */}
          <RecentRecordsCard>
            <RecentRecordsTitle>최근 건강 기록</RecentRecordsTitle>
            <RecentRecordsList>
              {recentHealthRecords.map((record, idx) => (
                <HealthRecordItem key={idx}>
                  <HealthRecordHeader>
                    <HealthRecordDate>{record.date}</HealthRecordDate>
                  </HealthRecordHeader>
                  <HealthRecordDetails>
                    <HealthRecordDetailItem>
                      <HealthRecordLabel>수면: </HealthRecordLabel>
                      <HealthRecordValue>{record.sleep}</HealthRecordValue>
                    </HealthRecordDetailItem>
                    <HealthRecordDetailItem>
                      <HealthRecordLabel>통증: </HealthRecordLabel>
                      <HealthRecordValue>{record.pain}</HealthRecordValue>
                    </HealthRecordDetailItem>
                    <HealthRecordDetailItem>
                      <HealthRecordLabel>번아웃: </HealthRecordLabel>
                      <HealthRecordValue>{record.burnout}</HealthRecordValue>
                    </HealthRecordDetailItem>
                  </HealthRecordDetails>
                </HealthRecordItem>
              ))}
            </RecentRecordsList>
          </RecentRecordsCard>
        </HealthRecommendationsGrid>
      </HealthBody>
    </HealthRoot>
  );
}
