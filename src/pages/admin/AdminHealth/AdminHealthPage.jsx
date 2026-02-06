import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { AlertTriangle, TrendingUp, ChevronRight, Calendar, Clock, FileText, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import { managerService } from '@/api/services';
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
  MonitoringTabWrap,
  MonitoringTabButton,
  MonitoringChartContainer,
  HealthLegendContainer,
  HealthLegendItem,
  HealthLegendColor,
  HealthLegendLabel,
  HealthLegendValue,
  MonitoringFooter,
} from './AdminHealthPage.styled';

const defaultMonitoringPieData = [
  { name: '위험', value: 0, color: '#EF4444' },
  { name: '경고', value: 0, color: '#CA8A04' },
  { name: '주의', value: 0, color: '#FF9800' },
  { name: '정상', value: 0, color: '#10B981' },
  { name: '미검진', value: 0, color: '#94A3B8' },
];

export function AdminHealthPage() {
  const { user } = useAuthStore();
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

  // 담당자 배정 작가 건강 데이터 (manager_no → ARTIST_ASSIGNMENT → 배정 작가만)
  const [nextCheckupDate, setNextCheckupDate] = useState({
    mentalCheckup: '-',
    physicalCheckup: '-',
    daysUntilMental: 0,
    daysUntilPhysical: 0,
  });
  const [monitoringTab, setMonitoringTab] = useState('mental');
  const [monitoringMentalData, setMonitoringMentalData] = useState(defaultMonitoringPieData);
  const [monitoringPhysicalData, setMonitoringPhysicalData] = useState(defaultMonitoringPieData);

  useEffect(() => {
    if (!user?.memberNo) return;
    managerService.getHealthSchedule().then((res) => {
      const dateStr = res?.nextCheckupDate ?? '-';
      const days = res?.daysUntil ?? 0;
      setNextCheckupDate({
        mentalCheckup: dateStr,
        physicalCheckup: dateStr,
        daysUntilMental: days,
        daysUntilPhysical: days,
      });
    }).catch(() => {});
  }, [user?.memberNo]);

  useEffect(() => {
    if (!user?.memberNo) return;
    managerService.getHealthDistribution().then((res) => {
      const mapItem = (d) => ({ name: d.name ?? '-', value: d.value ?? 0, color: d.color ?? '#94a3b8' });
      setMonitoringMentalData((res?.mentalDistribution ?? []).map(mapItem).length ? (res.mentalDistribution || []).map(mapItem) : defaultMonitoringPieData);
      setMonitoringPhysicalData((res?.physicalDistribution ?? []).map(mapItem).length ? (res.physicalDistribution || []).map(mapItem) : defaultMonitoringPieData);
    }).catch(() => {});
  }, [user?.memberNo]);

  useEffect(() => {
    if (!user?.memberNo) return;
    managerService.getUnscreenedList().then((res) => {
      setUnscreenedData(res?.items ?? []);
    }).catch(() => setUnscreenedData([]));
  }, [user?.memberNo]);

  // 심층 검진 검사 데이터 (담당자 배정 작가만, API)
  const [deepCheckupData, setDeepCheckupData] = useState({
    mental: { totalEmployees: 0, completed: 0, pending: 0, completionRate: 0, lastUpdated: '-', completedList: [], pendingList: [] },
    physical: { totalEmployees: 0, completed: 0, pending: 0, completionRate: 0, lastUpdated: '-', completedList: [], pendingList: [] },
  });

  useEffect(() => {
    if (!user?.memberNo) return;
    const mapItemsToDeep = (items) => {
      const list = Array.isArray(items) ? items : [];
      const completed = list.filter((i) => i.status && i.status !== '미검진');
      const pending = list.filter((i) => i.status === '미검진');
      const total = list.length;
      const completedCount = completed.length;
      const pendingCount = pending.length;
      return {
        totalEmployees: total,
        completed: completedCount,
        pending: pendingCount,
        completionRate: total ? Math.round((completedCount / total) * 100) : 0,
        lastUpdated: new Date().toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\. /g, '.').replace('. ', ' '),
        completedList: completed.map((i, idx) => ({
          id: i.memberNo ?? idx,
          name: i.memberName ?? '-',
          date: i.lastCheckDate ? i.lastCheckDate.replace(/-/g, '.') : '-',
          score: i.totalScore ?? 0,
          status: i.status ?? '-',
        })),
        pendingList: pending.map((i, idx) => ({
          id: i.memberNo ?? idx,
          name: i.memberName ?? '-',
          daysRemaining: 0,
        })),
      };
    };
    Promise.all([
      managerService.getHealthMonitoringDetail('mental'),
      managerService.getHealthMonitoringDetail('physical'),
    ]).then(([mentalRes, physicalRes]) => {
      const mentalItems = mentalRes?.items ?? [];
      const physicalItems = physicalRes?.items ?? [];
      setDeepCheckupData({
        mental: mapItemsToDeep(mentalItems),
        physical: mapItemsToDeep(physicalItems),
      });
    }).catch(() => {});
  }, [user?.memberNo]);

  // 미검진 인원 (담당자 배정 작가만, API)
  const [unscreenedData, setUnscreenedData] = useState([]);

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
    return <MonitoringDetailPage onBack={() => setCurrentView('main')} managerMode />;
  }
  
  if (currentView === 'unscreened-detail') {
    return <UnscreenedDetailPage onBack={() => setCurrentView('main')} managerMode />;
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

        <StatsGrid>
        {/* 검진 모니터링 (배정 작가) - 정신/신체 도넛 차트 (에이전시 건강관리와 동일) */}
        <MonitoringCard onClick={() => setCurrentView('monitoring-detail')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 className="text-sm font-bold" style={{ color: '#1f2328' }}>검진 모니터링</h2>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <MonitoringTabWrap>
                <MonitoringTabButton
                  type="button"
                  $active={monitoringTab === 'mental'}
                  onClick={() => setMonitoringTab('mental')}
                >
                  정신 건강
                </MonitoringTabButton>
                <MonitoringTabButton
                  type="button"
                  $active={monitoringTab === 'physical'}
                  onClick={() => setMonitoringTab('physical')}
                >
                  신체 건강
                </MonitoringTabButton>
              </MonitoringTabWrap>
              <ChevronRight className="w-4 h-4" style={{ color: '#6E8FB3' }} />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <MonitoringChartContainer>
              <PieChart width={140} height={140}>
                <Pie
                  data={monitoringTab === 'mental' ? monitoringMentalData : monitoringPhysicalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={200}
                >
                  {(monitoringTab === 'mental' ? monitoringMentalData : monitoringPhysicalData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </MonitoringChartContainer>

            <HealthLegendContainer>
              {(monitoringTab === 'mental' ? monitoringMentalData : monitoringPhysicalData).map((item, index) => (
                <HealthLegendItem key={index}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <HealthLegendColor $color={item.color} />
                    <HealthLegendLabel>{item.name}</HealthLegendLabel>
                  </div>
                  <HealthLegendValue>{item.value}명</HealthLegendValue>
                </HealthLegendItem>
              ))}
            </HealthLegendContainer>
          </div>

          <MonitoringFooter>
            <span className="text-xs" style={{ color: '#6E8FB3' }}>
              {monitoringTab === 'mental' ? '정신 건강' : '신체 건강'} · 담당자 배정 작가
            </span>
          </MonitoringFooter>
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
              {(Array.isArray(unscreenedData) ? [...unscreenedData] : [])
                .sort((a, b) => (b.daysOverdue ?? 0) - (a.daysOverdue ?? 0))
                .map((item) => (
                <UnscreenedListItem key={item.memberNo ?? item.id ?? item.memberName}>
                  <UnscreenedListItemAvatar>
                    <User className="w-5 h-5" style={{ color: '#6B7280' }} />
                  </UnscreenedListItemAvatar>
                  <UnscreenedListItemInfo>
                    <UnscreenedListItemName>{item.memberName ?? item.name ?? '-'}</UnscreenedListItemName>
                    <UnscreenedListItemTeam>{item.position ?? item.team ?? ''}</UnscreenedListItemTeam>
                  </UnscreenedListItemInfo>
                  {(item.daysOverdue != null && item.daysOverdue > 0) && (
                    <UnscreenedListItemBadge>{item.daysOverdue}일 지연</UnscreenedListItemBadge>
                  )}
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
