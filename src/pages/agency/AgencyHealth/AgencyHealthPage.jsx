import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Calendar, User, ChevronRight } from 'lucide-react';
import { MentalHealthDetailPage } from '@/pages/MentalHealthDetail';
import { PhysicalHealthDetailPage } from '@/pages/PhysicalHealthDetail';
import { RiskAnalysisPage } from '@/pages/RiskAnalysis';
import { MonitoringDetailPage } from '@/pages/MonitoringDetail';
import { UnscreenedDetailPage } from '@/pages/UnscreenedDetail';
import { SurveyListManagementPage } from '@/pages/SurveyListManagement';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import {
  AgencyHealthRoot,
  AgencyHealthBody,
  CheckupDateGrid,
  CheckupDateCard,
  CheckupDateHeader,
  CheckupDateInfo,
  CheckupDateLabel,
  CheckupDateValue,
  CheckupDateMeta,
  DeepCheckupGrid,
  DeepCheckupCard,
  DeepCheckupHeader,
  DeepCheckupTitle,
  DeepCheckupStatus,
  DeepCheckupProgress,
  DeepCheckupProgressBar,
  DeepCheckupProgressText,
  ScoreDistribution,
  ScoreDistributionTitle,
  PieChartContainer,
  LegendContainer,
  LegendItem,
  LegendColor,
  LegendLabel,
  LegendValue,
  MonitoringGrid,
  MonitoringCard,
  MonitoringHeader,
  MonitoringChartContainer,
  MonitoringFooter,
  UnscreenedCard,
  UnscreenedHeader,
  UnscreenedList,
  UnscreenedItem,
  UnscreenedAvatar,
  UnscreenedName,
} from './AgencyHealthPage.styled';

// TODO: Zustand store mapping - 건강 검진 데이터
const initialNextCheckupDate = {
  mentalCheckup: '2026.01.25',
  physicalCheckup: '2026.02.01',
  daysUntilMental: 5,
  daysUntilPhysical: 12,
};

const initialDeepCheckupData = {
  mental: {
    totalEmployees: 12,
    completed: 8,
    pending: 4,
    completionRate: 67,
    lastUpdated: '2026.01.18 14:30',
    completedList: [
      { id: 1, name: '송도동', date: '2026.01.15', score: 12, status: '주의' },
      { id: 2, name: '박아시', date: '2026.01.16', score: 5, status: '정상' },
      { id: 3, name: '이직가', date: '2026.01.17', score: 3, status: '정상' },
      { id: 4, name: '최소연', date: '2026.01.18', score: 8, status: '주의' },
      { id: 5, name: '김작가', date: '2026.01.15', score: 2, status: '정상' },
      { id: 6, name: '정원화', date: '2026.01.16', score: 15, status: '위험' },
      { id: 7, name: '한민수', date: '2026.01.17', score: 6, status: '정상' },
      { id: 8, name: '윤서진', date: '2026.01.18', score: 9, status: '주의' },
    ].sort((a, b) => b.score - a.score),
  },
  physical: {
    totalEmployees: 12,
    completed: 10,
    pending: 2,
    completionRate: 83,
    lastUpdated: '2026.01.18 15:45',
    completedList: [
      { id: 1, name: '송도동', date: '2026.01.14', score: 18, status: '위험' },
      { id: 2, name: '박아시', date: '2026.01.15', score: 8, status: '정상' },
      { id: 3, name: '이직가', date: '2026.01.15', score: 12, status: '주의' },
      { id: 4, name: '최소연', date: '2026.01.16', score: 5, status: '정상' },
      { id: 5, name: '김작가', date: '2026.01.16', score: 3, status: '정상' },
      { id: 6, name: '정원화', date: '2026.01.17', score: 7, status: '정상' },
      { id: 7, name: '한민수', date: '2026.01.17', score: 11, status: '주의' },
      { id: 8, name: '윤서진', date: '2026.01.18', score: 4, status: '정상' },
      { id: 9, name: '강태희', date: '2026.01.18', score: 6, status: '정상' },
      { id: 10, name: '조민아', date: '2026.01.18', score: 9, status: '주의' },
    ].sort((a, b) => b.score - a.score),
  },
};

const mentalPieData = [
  { name: '정상', value: 3, color: 'var(--chart-2)' },
  { name: '주의', value: 3, color: 'var(--chart-4)' },
  { name: '위험', value: 2, color: 'var(--destructive)' },
];

const physicalPieData = [
  { name: '정상', value: 6, color: 'var(--chart-2)' },
  { name: '주의', value: 3, color: 'var(--chart-4)' },
  { name: '위험', value: 1, color: 'var(--destructive)' },
];

const monitoringStatusData = [
  { name: '정상', value: 5, color: 'var(--chart-2)' },
  { name: '주의', value: 4, color: 'var(--chart-4)' },
  { name: '위험', value: 3, color: 'var(--destructive)' },
  { name: '미검진', value: 4, color: 'var(--muted-foreground)' },
];

const initialUnscreenedData = [
  { id: 1, name: '김담당', team: '', daysOverdue: 7 },
  { id: 2, name: '서유진', team: '', daysOverdue: 5 },
  { id: 3, name: '조수연', team: '', daysOverdue: 3 },
  { id: 4, name: '김희동', team: '', daysOverdue: 1 },
].sort((a, b) => b.daysOverdue - a.daysOverdue);

export function AgencyHealthPage() {
  const [currentView, setCurrentView] = useState('main');
  const [nextCheckupDate] = useState(initialNextCheckupDate);
  const [deepCheckupData] = useState(initialDeepCheckupData);
  const [unscreenedData] = useState(initialUnscreenedData);

  // 상세 페이지 표시 조건부 렌더링
  if (currentView === 'mental-detail') {
    return <MentalHealthDetailPage onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'physical-detail') {
    return <PhysicalHealthDetailPage onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'risk-analysis') {
    return <RiskAnalysisPage onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'survey-list-management') {
    return <SurveyListManagementPage onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'monitoring-detail') {
    return <MonitoringDetailPage onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'unscreened-detail') {
    return <UnscreenedDetailPage onBack={() => setCurrentView('main')} />;
  }

  return (
    <AgencyHealthRoot>
      <AgencyHealthBody>
        {/* 상단: 다음 검진 예정일 */}
        <CheckupDateGrid>
          {/* 정신 건강 검진 예정일 */}
          <CheckupDateCard>
            <CheckupDateHeader>
              <CheckupDateInfo>
                <CheckupDateLabel>정신 건강 검진 예정일</CheckupDateLabel>
                <CheckupDateValue>{nextCheckupDate.mentalCheckup}</CheckupDateValue>
                <CheckupDateMeta>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>검진 {nextCheckupDate.daysUntilMental}일 전</span>
                </CheckupDateMeta>
              </CheckupDateInfo>
              <Badge className="bg-purple-500 text-white text-xs px-2.5 py-1 rounded-full">
                정신
              </Badge>
            </CheckupDateHeader>
          </CheckupDateCard>

          {/* 신체 건강 검진 예정일 */}
          <CheckupDateCard>
            <CheckupDateHeader>
              <CheckupDateInfo>
                <CheckupDateLabel>신체 건강 검진 예정일</CheckupDateLabel>
                <CheckupDateValue>{nextCheckupDate.physicalCheckup}</CheckupDateValue>
                <CheckupDateMeta>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>검진 {nextCheckupDate.daysUntilPhysical}일 전</span>
                </CheckupDateMeta>
              </CheckupDateInfo>
              <Badge className="bg-blue-500 text-white text-xs px-2.5 py-1 rounded-full">
                신체
              </Badge>
            </CheckupDateHeader>
          </CheckupDateCard>
        </CheckupDateGrid>

        {/* 중단: 정신/신체 건강 심층 검사 */}
        <DeepCheckupGrid>
          {/* 정신 건강 심층 검사 */}
          <DeepCheckupCard onClick={() => setCurrentView('mental-detail')}>
            <DeepCheckupHeader>
              <DeepCheckupTitle>정신 건강 심층 검사</DeepCheckupTitle>
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
            </DeepCheckupHeader>

            {/* 검사 현황 */}
            <DeepCheckupStatus>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span style={{ color: 'var(--muted-foreground)' }}>검사 현황</span>
                <span className="font-bold" style={{ color: 'var(--foreground)' }}>{deepCheckupData.mental.completionRate}%</span>
              </div>
              <DeepCheckupProgressBar>
                <DeepCheckupProgress $color="purple" $width={deepCheckupData.mental.completionRate} />
              </DeepCheckupProgressBar>
              <DeepCheckupProgressText>
                총 {deepCheckupData.mental.totalEmployees}명, 미완료 {deepCheckupData.mental.pending}명 · {deepCheckupData.mental.lastUpdated}
              </DeepCheckupProgressText>
            </DeepCheckupStatus>

            {/* 점수 분포 */}
            <ScoreDistribution>
              <ScoreDistributionTitle>점수 분포</ScoreDistributionTitle>
              <div className="flex items-center gap-3">
                <PieChartContainer>
                  <PieChart width={100} height={100}>
                    <Pie
                      data={mentalPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={42}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {mentalPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </PieChartContainer>
                <LegendContainer>
                  {mentalPieData.map((item, index) => (
                    <LegendItem key={index}>
                      <LegendColor $color={item.color} />
                      <LegendLabel>{item.name}</LegendLabel>
                      <LegendValue>{item.value}명</LegendValue>
                    </LegendItem>
                  ))}
                </LegendContainer>
              </div>
            </ScoreDistribution>
          </DeepCheckupCard>

          {/* 신체 건강 심층 검사 */}
          <DeepCheckupCard onClick={() => setCurrentView('physical-detail')}>
            <DeepCheckupHeader>
              <DeepCheckupTitle>신체 건강 심층 검사</DeepCheckupTitle>
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
            </DeepCheckupHeader>

            {/* 검사 현황 */}
            <DeepCheckupStatus>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span style={{ color: 'var(--muted-foreground)' }}>검사 현황</span>
                <span className="font-bold" style={{ color: 'var(--foreground)' }}>{deepCheckupData.physical.completionRate}%</span>
              </div>
              <DeepCheckupProgressBar>
                <DeepCheckupProgress $color="blue" $width={deepCheckupData.physical.completionRate} />
              </DeepCheckupProgressBar>
              <DeepCheckupProgressText>
                총 {deepCheckupData.physical.totalEmployees}명, 미완료 {deepCheckupData.physical.pending}명 · {deepCheckupData.physical.lastUpdated}
              </DeepCheckupProgressText>
            </DeepCheckupStatus>

            {/* 점수 분포 */}
            <ScoreDistribution>
              <ScoreDistributionTitle>점수 분포</ScoreDistributionTitle>
              <div className="flex items-center gap-3">
                <PieChartContainer>
                  <PieChart width={100} height={100}>
                    <Pie
                      data={physicalPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={42}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {physicalPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </PieChartContainer>
                <LegendContainer>
                  {physicalPieData.map((item, index) => (
                    <LegendItem key={index}>
                      <LegendColor $color={item.color} />
                      <LegendLabel>{item.name}</LegendLabel>
                      <LegendValue>{item.value}명</LegendValue>
                    </LegendItem>
                  ))}
                </LegendContainer>
              </div>
            </ScoreDistribution>
          </DeepCheckupCard>
        </DeepCheckupGrid>

        {/* 하단: 검진 모니터링 및 미검진 인원 */}
        <MonitoringGrid>
          {/* 검진 모니터링 */}
          <MonitoringCard onClick={() => setCurrentView('monitoring-detail')}>
            <MonitoringHeader>
              <h2 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>검진 모니터링</h2>
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
            </MonitoringHeader>

            <div className="flex items-center justify-between gap-4">
              <MonitoringChartContainer>
                <PieChart width={140} height={140}>
                  <Pie
                    data={monitoringStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {monitoringStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </MonitoringChartContainer>

              <LegendContainer>
                {monitoringStatusData.map((item, index) => (
                  <LegendItem key={index}>
                    <LegendColor $color={item.color} />
                    <LegendLabel>{item.name}</LegendLabel>
                    <LegendValue>{item.value}명</LegendValue>
                  </LegendItem>
                ))}
              </LegendContainer>
            </div>

            <MonitoringFooter>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>검진 인원</span>
            </MonitoringFooter>
          </MonitoringCard>

          {/* 미검진 인원 집중 관리 */}
          <UnscreenedCard onClick={() => setCurrentView('unscreened-detail')}>
            <UnscreenedHeader>
              <h2 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>미검진 인원 집중 관리</h2>
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
            </UnscreenedHeader>

            <UnscreenedList>
              {unscreenedData.map((person) => (
                <UnscreenedItem key={person.id}>
                  <div className="flex items-center gap-2">
                    <UnscreenedAvatar>
                      <User className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    </UnscreenedAvatar>
                    <UnscreenedName>{person.name}</UnscreenedName>
                  </div>
                  <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {person.daysOverdue}일 지연
                  </Badge>
                </UnscreenedItem>
              ))}
            </UnscreenedList>
          </UnscreenedCard>
        </MonitoringGrid>
      </AgencyHealthBody>
    </AgencyHealthRoot>
  );
}
