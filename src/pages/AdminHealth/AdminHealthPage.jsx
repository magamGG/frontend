import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { AlertTriangle, TrendingUp, ChevronRight, Calendar, Clock, FileText, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { MentalHealthDetailPage } from '@/pages/MentalHealthDetail';
import { PhysicalHealthDetailPage } from '@/pages/PhysicalHealthDetail';
import { RiskAnalysisPage } from '@/pages/RiskAnalysis';
import { SurveyManagementPage } from '@/pages/SurveyManagement';
import { MonitoringDetailPage } from '@/pages/MonitoringDetail';
import { UnscreenedDetailPage } from '@/pages/UnscreenedDetail';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  AdminHealthRoot,
  AdminHealthBody,
  NextCheckupCard,
  NextCheckupHeader,
  NextCheckupTitle,
  NextCheckupGrid,
  CheckupItem,
  CheckupItemHeader,
  CheckupItemInfo,
  CheckupItemLabel,
  CheckupItemDate,
  CheckupItemBadge,
  CheckupItemMeta,
  CheckupItemMetaIcon,
  CheckupItemMetaText,
  DeepCheckupGrid,
  DeepCheckupCard,
  DeepCheckupCardHeader,
  DeepCheckupCardTitle,
  DeepCheckupCardIcon,
  ProgressSection,
  ProgressHeader,
  ProgressLabel,
  ProgressValue,
  ProgressBar,
  ProgressBarFill,
  ProgressMeta,
  CompletedButton,
  CompletedButtonContent,
  CompletedButtonLabel,
  PendingSection,
  PendingHeader,
  PendingList,
  PendingItem,
  PendingItemContent,
  PendingItemName,
  PendingItemBadge,
  StatsGrid,
  RiskCard,
  RiskCardHeader,
  RiskCardTitle,
  RiskCardGrid,
  RiskBox,
  RiskBoxHeader,
  RiskBoxBadge,
  RiskBoxValue,
  RiskBoxLabel,
  RiskBoxDetails,
  RiskBoxDetailRow,
  RiskBoxFooter,
  DistributionCard,
  DistributionCardHeader,
  DistributionCardTitle,
  DistributionCardSubtitle,
  DistributionChart,
  DistributionLegend,
  DistributionLegendItem,
  DistributionLegendDot,
  DistributionLegendLabel,
  DistributionLegendValue,
  MonitoringCard,
  MonitoringCardHeader,
  MonitoringTable,
  MonitoringTableHeader,
  MonitoringTableRow,
  MonitoringTableCell,
  UnscreenedCard,
  UnscreenedCardHeader,
  UnscreenedCardTitle,
  UnscreenedCardSubtitle,
  UnscreenedList,
  UnscreenedListItem,
  UnscreenedListItemAvatar,
  UnscreenedListItemInfo,
  UnscreenedListItemName,
  UnscreenedListItemTeam,
  UnscreenedListItemBadge,
} from './AdminHealthPage.styled';

export function AdminHealthPage() {
  const [selectedTab, setSelectedTab] = useState('정신건강분류');
  const [isMentalSurveyModalOpen, setIsMentalSurveyModalOpen] = useState(false);
  const [isPhysicalSurveyModalOpen, setIsPhysicalSurveyModalOpen] = useState(false);
  const [isDeepSurveyModalOpen, setIsDeepSurveyModalOpen] = useState(false);
  const [deepSurveyCategory, setDeepSurveyCategory] = useState('정신건강분류');
  const [selectedSurveyType, setSelectedSurveyType] = useState(null);
  
  // 검사 완료된 인원 모달 상태
  const [isMentalCompletedModalOpen, setIsMentalCompletedModalOpen] = useState(false);
  const [isPhysicalCompletedModalOpen, setIsPhysicalCompletedModalOpen] = useState(false);
  
  // 상세 페이지 상태 관리
  const [currentView, setCurrentView] = useState('main');

  // TODO: Zustand store mapping - 다음 검진 예정일 데이터
  const [nextCheckupDate] = useState({
    mentalCheckup: '2026.01.25',
    physicalCheckup: '2026.02.01',
    daysUntilMental: 7,
    daysUntilPhysical: 14,
  });

  // TODO: Zustand store mapping - 심층 검진 검사 데이터
  const [deepCheckupData] = useState({
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
      ],
      pendingList: [
        { id: 9, name: '강태희', daysRemaining: 3 },
        { id: 10, name: '조민아', daysRemaining: 5 },
        { id: 11, name: '서준혁', daysRemaining: 6 },
        { id: 12, name: '임유진', daysRemaining: 7 },
      ],
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
      ],
      pendingList: [
        { id: 11, name: '서준혁', daysRemaining: 4 },
        { id: 12, name: '임유진', daysRemaining: 6 },
      ],
    },
  });

  // TODO: Zustand store mapping - 위험 인원 데이터
  const [riskData] = useState({
    high: [
      { id: 1, name: '송도동', mentalCount: 2, physicalCount: 1, lastCheck: '01.13' },
      { id: 2, name: '박아시', mentalCount: 1, physicalCount: 1, lastCheck: '01.13' },
      { id: 3, name: '이직가', mentalCount: 0, physicalCount: 1, lastCheck: '01.13' },
    ],
    warning: [
      { id: 4, name: '최소연', mentalCount: 1, physicalCount: 3, lastCheck: '01.13' },
      { id: 5, name: '김작가', mentalCount: 0, physicalCount: 3, lastCheck: '01.13' },
      { id: 6, name: '최소연', mentalCount: 1, physicalCount: 2, lastCheck: '01.13' },
      { id: 7, name: '김작가', mentalCount: 0, physicalCount: 2, lastCheck: '01.13' },
    ],
  });

  // TODO: Zustand store mapping - 검진 모니터링 데이터
  const [monitoringData] = useState([
    { id: 1, name: '송도동', mentalCount: 7, physicalCount: 2, status: '위험', lastCheckDate: '01.13', position: '영업팀' },
    { id: 2, name: '박아시', mentalCount: 6, physicalCount: 3, status: '주의', lastCheckDate: '01.13', position: '개발팀' },
    { id: 3, name: '이직가', mentalCount: 5, physicalCount: 0, status: '주의', lastCheckDate: '01.10', position: '경영지원' },
    { id: 4, name: '최소연', mentalCount: 2, physicalCount: 7, status: '정상', lastCheckDate: '01.12', position: '디자인팀' },
    { id: 5, name: '김작가', mentalCount: 9, physicalCount: 8, status: '정상', lastCheckDate: '01.12', position: '영업팀' },
  ]);

  // TODO: Zustand store mapping - 미검진 인원 데이터
  const [unscreenedData] = useState([
    { id: 1, name: '이수진', team: '마케팅', daysOverdue: 12 },
    { id: 2, name: '조인혜', team: '개발팀', daysOverdue: 8 },
    { id: 3, name: '서동혁', team: '경영지원', daysOverdue: 9 },
    { id: 4, name: '김미영', team: '디자인팀', daysOverdue: 10 },
  ]);

  // TODO: Zustand store mapping - 인원 분포 데이터
  const distributionData = [
    { name: '위험', value: 2, color: '#EF4444' },
    { name: '주의', value: 5, color: '#F59E0B' },
    { name: '정상', value: 15, color: '#10B981' },
  ];

  // 상태별 배지 색상
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case '위험':
        return 'bg-red-100 text-red-600';
      case '주의':
        return 'bg-orange-100 text-orange-600';
      case '정상':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

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
  
  if (currentView === 'survey-management') {
    return <SurveyManagementPage onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'monitoring-detail') {
    return <MonitoringDetailPage onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'unscreened-detail') {
    return <UnscreenedDetailPage onBack={() => setCurrentView('main')} />;
  }

  return (
    <AdminHealthRoot>
      <AdminHealthBody>
        {/* 다음 검진 예정일 */}
        <NextCheckupCard>
          <NextCheckupHeader>
            <Calendar className="w-5 h-5" style={{ color: '#6E8FB3' }} />
            <NextCheckupTitle>다음 검진 예정일</NextCheckupTitle>
          </NextCheckupHeader>
          
          <NextCheckupGrid>
            {/* 정신 건강 검진 */}
            <CheckupItem $bgColor="from-purple-50 to-purple-100/50" $borderColor="border-purple-200">
              <CheckupItemHeader>
                <CheckupItemInfo>
                  <CheckupItemLabel $color="#9333EA">정신 건강 심층 검진</CheckupItemLabel>
                  <CheckupItemDate>{nextCheckupDate.mentalCheckup}</CheckupItemDate>
                </CheckupItemInfo>
                <CheckupItemBadge $bgColor="#9333EA">D-{nextCheckupDate.daysUntilMental}</CheckupItemBadge>
              </CheckupItemHeader>
              <CheckupItemMeta>
                <CheckupItemMetaIcon>
                  <Clock className="w-3.5 h-3.5" />
                </CheckupItemMetaIcon>
                <CheckupItemMetaText>PHQ-9 · GAD-7 설문 실시</CheckupItemMetaText>
              </CheckupItemMeta>
            </CheckupItem>

            {/* 신체 건강 검진 */}
            <CheckupItem $bgColor="from-blue-50 to-blue-100/50" $borderColor="border-blue-200">
              <CheckupItemHeader>
                <CheckupItemInfo>
                  <CheckupItemLabel $color="#2563EB">신체 건강 심층 검진</CheckupItemLabel>
                  <CheckupItemDate>{nextCheckupDate.physicalCheckup}</CheckupItemDate>
                </CheckupItemInfo>
                <CheckupItemBadge $bgColor="#2563EB">D-{nextCheckupDate.daysUntilPhysical}</CheckupItemBadge>
              </CheckupItemHeader>
              <CheckupItemMeta>
                <CheckupItemMetaIcon>
                  <Clock className="w-3.5 h-3.5" />
                </CheckupItemMetaIcon>
                <CheckupItemMetaText>종합 신체 상태 설문 실시</CheckupItemMetaText>
              </CheckupItemMeta>
            </CheckupItem>
          </NextCheckupGrid>
        </NextCheckupCard>

        {/* 심층 검진 검사 현황 */}
        <DeepCheckupGrid>
          {/* 정신 건강 심층 검사 */}
          <DeepCheckupCard>
            <DeepCheckupCardHeader onClick={() => setCurrentView('mental-detail')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DeepCheckupCardIcon $color="#9333EA">
                  <FileText className="w-5 h-5" />
                </DeepCheckupCardIcon>
                <DeepCheckupCardTitle>정신 건강 심층 검사</DeepCheckupCardTitle>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: '#6E8FB3' }} />
            </DeepCheckupCardHeader>

            {/* 진행 상황 */}
            <ProgressSection>
              <ProgressHeader>
                <ProgressLabel>검사 진행률</ProgressLabel>
                <ProgressValue>{deepCheckupData.mental.completionRate}%</ProgressValue>
              </ProgressHeader>
              <ProgressBar>
                <ProgressBarFill $width={deepCheckupData.mental.completionRate} $bgColor="#9333EA" />
              </ProgressBar>
              <ProgressMeta>
                <span>완료 {deepCheckupData.mental.completed}명 / 대기 {deepCheckupData.mental.pending}명</span>
                <span>최종 업데이트: {deepCheckupData.mental.lastUpdated}</span>
              </ProgressMeta>
            </ProgressSection>

            {/* 완료 목록 */}
            <CompletedButton onClick={() => setIsMentalCompletedModalOpen(true)}>
              <CompletedButtonContent>
                <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} />
                <CompletedButtonLabel>검사 완료</CompletedButtonLabel>
                <Badge style={{ backgroundColor: '#D1FAE5', color: '#059669', fontSize: '12px', padding: '2px 8px' }}>
                  {deepCheckupData.mental.completed}명
                </Badge>
              </CompletedButtonContent>
              <ChevronRight className="w-4 h-4" style={{ color: '#6E8FB3' }} />
            </CompletedButton>

            {/* 대기 목록 */}
            <PendingSection>
              <PendingHeader>
                <Clock className="w-4 h-4" style={{ color: '#F97316' }} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1F2328' }}>검사 대기</span>
                <Badge style={{ backgroundColor: '#FED7AA', color: '#C2410C', fontSize: '12px', padding: '2px 8px' }}>
                  {deepCheckupData.mental.pending}명
                </Badge>
              </PendingHeader>
              <PendingList>
                {deepCheckupData.mental.pendingList.map((person) => (
                  <PendingItem key={person.id}>
                    <PendingItemContent>
                      <Clock className="w-3.5 h-3.5" style={{ color: '#F97316' }} />
                      <PendingItemName>{person.name}</PendingItemName>
                    </PendingItemContent>
                    <PendingItemBadge>{person.daysRemaining}일 남음</PendingItemBadge>
                  </PendingItem>
                ))}
              </PendingList>
            </PendingSection>
          </DeepCheckupCard>

          {/* 신체 건강 심층 검사 */}
          <DeepCheckupCard>
            <DeepCheckupCardHeader onClick={() => setCurrentView('physical-detail')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DeepCheckupCardIcon $color="#2563EB">
                  <FileText className="w-5 h-5" />
                </DeepCheckupCardIcon>
                <DeepCheckupCardTitle>신체 건강 심층 검사</DeepCheckupCardTitle>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: '#6E8FB3' }} />
            </DeepCheckupCardHeader>

            {/* 진행 상황 */}
            <ProgressSection>
              <ProgressHeader>
                <ProgressLabel>검사 진행률</ProgressLabel>
                <ProgressValue>{deepCheckupData.physical.completionRate}%</ProgressValue>
              </ProgressHeader>
              <ProgressBar>
                <ProgressBarFill $width={deepCheckupData.physical.completionRate} $bgColor="#2563EB" />
              </ProgressBar>
              <ProgressMeta>
                <span>완료 {deepCheckupData.physical.completed}명 / 대기 {deepCheckupData.physical.pending}명</span>
                <span>최종 업데이트: {deepCheckupData.physical.lastUpdated}</span>
              </ProgressMeta>
            </ProgressSection>

            {/* 완료 목록 */}
            <CompletedButton onClick={() => setIsPhysicalCompletedModalOpen(true)}>
              <CompletedButtonContent>
                <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} />
                <CompletedButtonLabel>검사 완료</CompletedButtonLabel>
                <Badge style={{ backgroundColor: '#D1FAE5', color: '#059669', fontSize: '12px', padding: '2px 8px' }}>
                  {deepCheckupData.physical.completed}명
                </Badge>
              </CompletedButtonContent>
              <ChevronRight className="w-4 h-4" style={{ color: '#6E8FB3' }} />
            </CompletedButton>

            {/* 대기 목록 */}
            <PendingSection>
              <PendingHeader>
                <Clock className="w-4 h-4" style={{ color: '#F97316' }} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1F2328' }}>검사 대기</span>
                <Badge style={{ backgroundColor: '#FED7AA', color: '#C2410C', fontSize: '12px', padding: '2px 8px' }}>
                  {deepCheckupData.physical.pending}명
                </Badge>
              </PendingHeader>
              <PendingList>
                {deepCheckupData.physical.pendingList.map((person) => (
                  <PendingItem key={person.id}>
                    <PendingItemContent>
                      <Clock className="w-3.5 h-3.5" style={{ color: '#F97316' }} />
                      <PendingItemName>{person.name}</PendingItemName>
                    </PendingItemContent>
                    <PendingItemBadge>{person.daysRemaining}일 남음</PendingItemBadge>
                  </PendingItem>
                ))}
              </PendingList>
            </PendingSection>
          </DeepCheckupCard>
        </DeepCheckupGrid>

        {/* 2x2 그리드 레이아웃 */}
        <StatsGrid>
          {/* 위험 */}
          <RiskCard>
            <RiskCardHeader onClick={() => setCurrentView('risk-analysis')}>
              <RiskCardTitle>위험</RiskCardTitle>
              <ChevronRight className="w-4 h-4" style={{ color: '#6E8FB3' }} />
            </RiskCardHeader>

            <RiskCardGrid>
              {/* 고위험 */}
              <RiskBox>
                <RiskBoxHeader>
                  <RiskBoxBadge $bgColor="#FEE2E2" $color="#DC2626">
                    <AlertTriangle className="w-3 h-3" />
                    고위험
                  </RiskBoxBadge>
                </RiskBoxHeader>
                <RiskBoxValue $color="#DC2626">{riskData.high.length}명</RiskBoxValue>
                <RiskBoxLabel>정신·신체</RiskBoxLabel>
                <RiskBoxDetails>
                  <RiskBoxDetailRow>정신 건강 위험 인원 2명</RiskBoxDetailRow>
                  <RiskBoxDetailRow>신체 건강 위험 인원 1명</RiskBoxDetailRow>
                  <RiskBoxFooter>
                    <span>최근 검사일</span>
                    <span>{riskData.high[0]?.lastCheck || 'N/A'}</span>
                  </RiskBoxFooter>
                </RiskBoxDetails>
              </RiskBox>

              {/* 주의 */}
              <RiskBox>
                <RiskBoxHeader>
                  <RiskBoxBadge $bgColor="#FED7AA" $color="#C2410C">
                    <TrendingUp className="w-3 h-3" />
                    주의
                  </RiskBoxBadge>
                </RiskBoxHeader>
                <RiskBoxValue $color="#C2410C">{riskData.warning.length}명</RiskBoxValue>
                <RiskBoxLabel>정신·신체</RiskBoxLabel>
                <RiskBoxDetails>
                  <RiskBoxDetailRow>정신 건강 주의 인원 1명</RiskBoxDetailRow>
                  <RiskBoxDetailRow>신체 건강 주의 인원 3명</RiskBoxDetailRow>
                  <RiskBoxFooter>
                    <span>최근 검사일</span>
                    <span>{riskData.warning[0]?.lastCheck || 'N/A'}</span>
                  </RiskBoxFooter>
                </RiskBoxDetails>
              </RiskBox>
            </RiskCardGrid>
          </RiskCard>

          {/* 인원 분포 시각화 */}
          <DistributionCard>
            <DistributionCardHeader>
              <DistributionCardTitle>인원 분포</DistributionCardTitle>
              <DistributionCardSubtitle>
                위험 {distributionData.find(d => d.name === '위험')?.value || 0}명 · 
                주의 {distributionData.find(d => d.name === '주의')?.value || 0}명 · 
                정상 {distributionData.find(d => d.name === '정상')?.value || 0}명
              </DistributionCardSubtitle>
            </DistributionCardHeader>

            <DistributionChart>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}명`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #DADDE1',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value) => [`${value}명`, '인원']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </DistributionChart>

            <DistributionLegend>
              {distributionData.map((item, index) => (
                <DistributionLegendItem key={index}>
                  <DistributionLegendDot style={{ backgroundColor: item.color }} />
                  <DistributionLegendLabel>{item.name}</DistributionLegendLabel>
                  <DistributionLegendValue>{item.value}</DistributionLegendValue>
                </DistributionLegendItem>
              ))}
            </DistributionLegend>
          </DistributionCard>

          {/* 검진 모니터링 */}
          <MonitoringCard>
            <MonitoringCardHeader onClick={() => setCurrentView('monitoring-detail')}>
              <RiskCardTitle>검진 모니터링</RiskCardTitle>
              <ChevronRight className="w-4 h-4" style={{ color: '#6E8FB3' }} />
            </MonitoringCardHeader>

            <MonitoringTable>
              <thead>
                <MonitoringTableHeader>
                  <th>이름</th>
                  <th>직책</th>
                  <th>상태</th>
                  <th>최근 검사일</th>
                </MonitoringTableHeader>
              </thead>
              <tbody>
                {monitoringData.map((person) => (
                  <MonitoringTableRow key={person.id}>
                    <MonitoringTableCell>{person.name}</MonitoringTableCell>
                    <MonitoringTableCell>{person.position}</MonitoringTableCell>
                    <MonitoringTableCell style={{ textAlign: 'center' }}>
                      <Badge className={`${getStatusBadgeClass(person.status)} text-[10px] px-2 py-0.5`}>
                        {person.status}
                      </Badge>
                    </MonitoringTableCell>
                    <MonitoringTableCell style={{ textAlign: 'right' }}>{person.lastCheckDate}</MonitoringTableCell>
                  </MonitoringTableRow>
                ))}
              </tbody>
            </MonitoringTable>
          </MonitoringCard>

          {/* 미검진 인원 */}
          <UnscreenedCard>
            <UnscreenedCardHeader onClick={() => setCurrentView('unscreened-detail')}>
              <div>
                <UnscreenedCardTitle>미검진 인원 집중 관리</UnscreenedCardTitle>
                <UnscreenedCardSubtitle>미검진 직원을 확인하세요.</UnscreenedCardSubtitle>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: '#6E8FB3' }} />
            </UnscreenedCardHeader>

            <UnscreenedList>
              {(Array.isArray(unscreenedData) ? [...unscreenedData] : []).sort((a, b) => b.daysOverdue - a.daysOverdue).map((item) => (
                <UnscreenedListItem key={item.id}>
                  <UnscreenedListItemAvatar>
                    <User className="w-5 h-5" style={{ color: '#6B7280' }} />
                  </UnscreenedListItemAvatar>
                  <UnscreenedListItemInfo>
                    <UnscreenedListItemName>{item.name}</UnscreenedListItemName>
                    <UnscreenedListItemTeam>{item.team}</UnscreenedListItemTeam>
                  </UnscreenedListItemInfo>
                  <UnscreenedListItemBadge>{item.daysOverdue}일 지연</UnscreenedListItemBadge>
                  <ChevronRight className="w-3.5 h-3.5" style={{ color: '#6E8FB3' }} />
                </UnscreenedListItem>
              ))}
            </UnscreenedList>
          </UnscreenedCard>
        </StatsGrid>

        {/* 검사 완료 인원 모달 - 정신 건강 */}
        <Dialog open={isMentalCompletedModalOpen} onOpenChange={setIsMentalCompletedModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>정신 건강 심층 검사 완료 인원</DialogTitle>
              <DialogDescription>최근 정신 건강 심층 검사를 완료한 인원 목록입니다.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {(Array.isArray(deepCheckupData?.mental?.completedList) ? [...deepCheckupData.mental.completedList] : [])
                .sort((a, b) => {
                  const dateA = new Date(a.date.replace(/\./g, '-'));
                  const dateB = new Date(b.date.replace(/\./g, '-'));
                  return dateB.getTime() - dateA.getTime();
                })
                .map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm text-[#1F2328]">{person.name}</p>
                      <p className="text-xs text-[#6E8FB3]">검사일: {person.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#1F2328]">점수: {person.score}</span>
                    <Badge className={`${getStatusBadgeClass(person.status)} text-xs px-2 py-1`}>
                      {person.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* 검사 완료 인원 모달 - 신체 건강 */}
        <Dialog open={isPhysicalCompletedModalOpen} onOpenChange={setIsPhysicalCompletedModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>신체 건강 심층 검사 완료 인원</DialogTitle>
              <DialogDescription>최근 신체 건강 심층 검사를 완료한 인원 목록입니다.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {(Array.isArray(deepCheckupData?.physical?.completedList) ? [...deepCheckupData.physical.completedList] : [])
                .sort((a, b) => {
                  const dateA = new Date(a.date.replace(/\./g, '-'));
                  const dateB = new Date(b.date.replace(/\./g, '-'));
                  return dateB.getTime() - dateA.getTime();
                })
                .map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm text-[#1F2328]">{person.name}</p>
                      <p className="text-xs text-[#6E8FB3]">검사일: {person.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#1F2328]">점수: {person.score}</span>
                    <Badge className={`${getStatusBadgeClass(person.status)} text-xs px-2 py-1`}>
                      {person.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </AdminHealthBody>
    </AdminHealthRoot>
  );
}
