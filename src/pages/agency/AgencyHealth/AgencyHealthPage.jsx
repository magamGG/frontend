import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/app/components/ui/dialog';
import { Calendar, User, ChevronRight, Clock, CheckCircle2, FileText, Plus, Edit2, Trash2, X, Settings } from 'lucide-react';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import { agencyService } from '@/api/services';
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
  HeaderSection,
  HeaderTitle,
  HeaderSubtitle,
  HeaderActions,
  CheckupDateGrid,
  CheckupItem,
  CheckupItemHeader,
  CheckupItemInfo,
  CheckupItemLabel,
  CheckupItemDate,
  CheckupItemBadge,
  CheckupItemMeta,
  CheckupItemMetaIcon,
  CheckupItemMetaText,
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
  MonitoringTabWrap,
  MonitoringTabButton,
  MonitoringChartContainer,
  MonitoringFooter,
  UnscreenedCard,
  UnscreenedHeader,
  UnscreenedList,
  UnscreenedItem,
  UnscreenedAvatar,
  UnscreenedName,
} from './AgencyHealthPage.styled';

// HEALTH_SURVEY 기반 예정일 기본값 (API 로드 전)
const defaultNextCheckupDate = {
  mentalCheckup: '-',
  physicalCheckup: '-',
  daysUntilMental: 0,
  daysUntilPhysical: 0,
};

const defaultMonitoringPieData = [
  { name: '위험', value: 0, color: '#EF4444' },
  { name: '경고', value: 0, color: '#CA8A04' },
  { name: '주의', value: 0, color: '#FF9800' },
  { name: '정상', value: 0, color: '#10B981' },
  { name: '미검진', value: 0, color: '#94A3B8' },
];

// 설문 데이터
const initialSurveys = [
  { 
    id: '1', 
    title: '일일 간이 체크', 
    category: '정신건강', 
    status: '사용 중', 
    createdDate: '2025.12.01', 
    questions: [
      '오늘 기분은 어떠신가요?',
      '수면은 충분히 취하셨나요?',
      '스트레스 수준은 어떠신가요?',
      '업무에 집중할 수 있었나요?',
      '다른 사람들과 소통하는 것이 편안했나요?'
    ]
  },
  { 
    id: '2', 
    title: '정기 심층 검사', 
    category: '정신건강', 
    status: '사용 중', 
    createdDate: '2025.11.15', 
    questions: [
      '지난 2주간 우울감을 느낀 적이 있습니까?',
      '지난 2주간 불안감을 느낀 적이 있습니까?',
      '수면 패턴에 변화가 있었습니까?',
      '식욕에 변화가 있었습니까?',
      '일상 활동에 흥미를 잃은 적이 있습니까?'
    ]
  },
  { 
    id: '3', 
    title: 'PHQ-9 우울증 검사', 
    category: '정신건강', 
    status: '사용 중', 
    createdDate: '2025.10.20', 
    questions: [
      '일이나 여가 활동을 하는 데 흥미나 즐거움을 느끼지 못했다',
      '기분이 가라앉거나, 우울하거나, 희망이 없다고 느꼈다',
      '잠들기 어렵거나 자주 깨어났다, 혹은 너무 많이 잤다'
    ]
  },
  { 
    id: '5', 
    title: '일일 간이 체크', 
    category: '신체건강', 
    status: '사용 중', 
    createdDate: '2025.12.01', 
    questions: [
      '오늘 신체적 통증이 있었나요?',
      '규칙적인 식사를 하셨나요?',
      '충분한 수분 섭취를 하셨나요?',
      '눈의 피로를 느끼셨나요?',
      '어깨나 목에 긴장감을 느끼셨나요?'
    ]
  },
  { 
    id: '6', 
    title: '정기 심층 검사', 
    category: '신체건강', 
    status: '사용 중', 
    createdDate: '2025.11.15', 
    questions: [
      '지난 한 달간 두통이 있었습니까?',
      '지난 한 달간 소화 불량이 있었습니까?',
      '지난 한 달간 근육통이 있었습니까?',
      '지난 한 달간 시력 변화가 있었습니까?'
    ]
  },
];

export function AgencyHealthPage() {
  const { user } = useAuthStore();
  const agencyNo = user?.agencyNo;

  const [currentView, setCurrentView] = useState('main');
  const [nextCheckupDate, setNextCheckupDate] = useState(defaultNextCheckupDate);
  const [unscreenedData, setUnscreenedData] = useState([]);
  const [surveys, setSurveys] = useState(initialSurveys);

  // 검진 모니터링: 정신/신체 토글 및 API 데이터 (분포 = getHealthDistribution, 예정일 = getAgencyHealthSchedule)
  const [monitoringTab, setMonitoringTab] = useState('mental');
  const [monitoringMentalData, setMonitoringMentalData] = useState(defaultMonitoringPieData);
  const [monitoringPhysicalData, setMonitoringPhysicalData] = useState(defaultMonitoringPieData);

  // HEALTH_SURVEY 생성일·주기 기반 다음 검진 예정일 (정신/신체 동일 주기)
  useEffect(() => {
    if (!agencyNo) return;
    agencyService.getAgencyHealthSchedule(agencyNo).then((res) => {
      const dateStr = res?.nextCheckupDate ?? '-';
      const days = res?.daysUntil ?? 0;
      setNextCheckupDate({
        mentalCheckup: dateStr,
        physicalCheckup: dateStr,
        daysUntilMental: days,
        daysUntilPhysical: days,
      });
    }).catch(() => {});
  }, [agencyNo]);

  useEffect(() => {
    if (!agencyNo) return;
    agencyService.getHealthDistribution(agencyNo).then((res) => {
      const mapItem = (d) => ({ name: d.name ?? '-', value: d.value ?? 0, color: d.color ?? '#94a3b8' });
      setMonitoringMentalData((res?.mentalDistribution ?? []).map(mapItem).length ? (res.mentalDistribution || []).map(mapItem) : defaultMonitoringPieData);
      setMonitoringPhysicalData((res?.physicalDistribution ?? []).map(mapItem).length ? (res.physicalDistribution || []).map(mapItem) : defaultMonitoringPieData);
    }).catch(() => {});
  }, [agencyNo]);

  // 미검진 인원 (정신/신체 중 하나라도 미검진이면 포함)
  useEffect(() => {
    if (!agencyNo) return;
    agencyService.getAgencyUnscreenedList(agencyNo).then((res) => {
      setUnscreenedData(res?.items ?? []);
    }).catch(() => setUnscreenedData([]));
  }, [agencyNo]);

  // 분포 데이터로 심층 검사 현황 계산 (정신/신체)
  const mentalTotal = monitoringMentalData.reduce((acc, d) => acc + (Number(d.value) || 0), 0);
  const mentalCompleted = monitoringMentalData.filter((d) => d.name !== '미검진').reduce((acc, d) => acc + (Number(d.value) || 0), 0);
  const mentalPending = monitoringMentalData.find((d) => d.name === '미검진')?.value ?? 0;
  const mentalCompletionRate = mentalTotal ? Math.round((mentalCompleted / mentalTotal) * 100) : 0;

  const physicalTotal = monitoringPhysicalData.reduce((acc, d) => acc + (Number(d.value) || 0), 0);
  const physicalCompleted = monitoringPhysicalData.filter((d) => d.name !== '미검진').reduce((acc, d) => acc + (Number(d.value) || 0), 0);
  const physicalPending = monitoringPhysicalData.find((d) => d.name === '미검진')?.value ?? 0;
  const physicalCompletionRate = physicalTotal ? Math.round((physicalCompleted / physicalTotal) * 100) : 0;

  // 건강 검진 설정 모달 (HEALTH_SURVEY_PERIOD, HEALTH_SURVEY_CYCLE)
  const [isSurveySettingsModalOpen, setIsSurveySettingsModalOpen] = useState(false);
  const [surveyPeriod, setSurveyPeriod] = useState(15);
  const [surveyCycle, setSurveyCycle] = useState(30);

  // 설정 모달 열릴 때 현재 기간·주기 로드
  useEffect(() => {
    if (!isSurveySettingsModalOpen || !agencyNo) return;
    agencyService.getAgencyHealthSchedule(agencyNo).then((res) => {
      if (res?.period != null) setSurveyPeriod(res.period);
      if (res?.cycle != null) setSurveyCycle(res.cycle);
    }).catch(() => {});
  }, [isSurveySettingsModalOpen, agencyNo]);

  // 모달 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('정신건강');
  
  // 설문 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    category: '정신건강',
    status: '사용 중',
    questions: [],
  });
  
  // 새 문항 입력 상태
  const [newQuestion, setNewQuestion] = useState('');

  // 설문 필터링
  const mentalSurveys = surveys.filter(s => s.category === '정신건강');
  const physicalSurveys = surveys.filter(s => s.category === '신체건강');

  // 설문 추가 핸들러
  const handleAddSurvey = (category) => {
    setSelectedCategory(category);
    setFormData({
      title: '',
      category: category,
      status: '사용 중',
      questions: [],
    });
    setNewQuestion('');
    setIsAddModalOpen(true);
  };

  // 설문 수정 핸들러
  const handleEditSurvey = (survey) => {
    setSelectedSurvey(survey);
    setFormData({
      title: survey.title,
      category: survey.category,
      status: survey.status,
      questions: [...survey.questions],
    });
    setNewQuestion('');
    setIsEditModalOpen(true);
  };

  // 설문 삭제 핸들러
  const handleDeleteSurvey = (survey) => {
    setSurveys(surveys.filter(s => s.id !== survey.id));
    toast.success('설문이 삭제되었습니다');
  };

  // 문항 추가 핸들러
  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      toast.error('문항 내용을 입력해주세요');
      return;
    }
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion.trim()],
    });
    setNewQuestion('');
    setIsQuestionModalOpen(false);
  };

  // 문항 삭제 핸들러
  const handleRemoveQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    });
  };

  // 설문 추가 제출
  const handleAddSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('설문 제목을 입력해주세요');
      return;
    }
    if (formData.questions.length === 0) {
      toast.error('최소 1개 이상의 문항을 추가해주세요');
      return;
    }

    const newSurvey = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      status: formData.status,
      createdDate: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      questions: formData.questions,
    };
    setSurveys([...surveys, newSurvey]);
    setIsAddModalOpen(false);
    toast.success('설문이 추가되었습니다');
  };

  // 설문 수정 제출
  const handleEditSubmit = () => {
    if (!selectedSurvey) return;
    if (!formData.title.trim()) {
      toast.error('설문 제목을 입력해주세요');
      return;
    }
    if (formData.questions.length === 0) {
      toast.error('최소 1개 이상의 문항을 추가해주세요');
      return;
    }

    setSurveys(surveys.map(s => 
      s.id === selectedSurvey.id 
        ? { ...s, ...formData }
        : s
    ));
    setIsEditModalOpen(false);
    toast.success('설문이 수정되었습니다');
  };

  // 건강 검진 설정 저장 (HEALTH_SURVEY period, cycle 업데이트)
  const handleSurveySettingsSave = () => {
    const period = Number(surveyPeriod);
    const cycle = Number(surveyCycle);
    if (Number.isNaN(period) || period < 1 || period > 365) {
      toast.error('설문 기간은 1~365일 사이로 입력해주세요.');
      return;
    }
    if (Number.isNaN(cycle) || cycle < 1 || cycle > 365) {
      toast.error('설문 주기는 1~365일 사이로 입력해주세요.');
      return;
    }
    if (!agencyNo) {
      toast.error('에이전시 정보를 불러올 수 없습니다.');
      return;
    }
    agencyService
      .updateAgencyHealthSchedule(agencyNo, { period, cycle })
      .then(() => {
        setIsSurveySettingsModalOpen(false);
        toast.success('건강 검진 설정이 저장되었습니다.');
        return agencyService.getAgencyHealthSchedule(agencyNo);
      })
      .then((res) => {
        if (res?.nextCheckupDate != null && res?.daysUntil != null) {
          setNextCheckupDate({
            mentalCheckup: res.nextCheckupDate,
            physicalCheckup: res.nextCheckupDate,
            daysUntilMental: res.daysUntil,
            daysUntilPhysical: res.daysUntil,
          });
        }
      })
      .catch(() => toast.error('설정 저장에 실패했습니다.'));
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
  
  if (currentView === 'survey-list-management') {
    return <SurveyListManagementPage onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'monitoring-detail') {
    return (
      <MonitoringDetailPage
        onBack={() => setCurrentView('main')}
        initialTab={monitoringTab}
      />
    );
  }
  
  if (currentView === 'unscreened-detail') {
    return <UnscreenedDetailPage onBack={() => setCurrentView('main')} />;
  }

  return (
    <AgencyHealthRoot>
      <AgencyHealthBody>
        {/* Header */}
        <HeaderSection>
          <div>
            <HeaderTitle>건강관리</HeaderTitle>
            <HeaderSubtitle>정신·신체 검진 현황과 미검진 인원을 확인하고 관리합니다</HeaderSubtitle>
          </div>
          <HeaderActions>
            <Button
              variant="outline"
              size="default"
              onClick={() => setIsSurveySettingsModalOpen(true)}
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--card)',
                transition: 'all 0.2s ease'
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              설정
            </Button>
          </HeaderActions>
        </HeaderSection>

        {/* 상단: 검진 예정일 및 심층 검사 */}
        <CheckupDateGrid>
          {/* 정신 건강 검진 예정일 */}
          <CheckupItem $bgColor="from-purple-50 to-purple-100/50" $borderColor="border-purple-200">
            <CheckupItemHeader>
              <CheckupItemInfo>
                <CheckupItemLabel $color="#9333EA">정신 건강 검진 예정일</CheckupItemLabel>
                <CheckupItemDate>{nextCheckupDate.mentalCheckup}</CheckupItemDate>
              </CheckupItemInfo>
              <Badge className="text-white text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: '#9333EA' }}>
                정신
              </Badge>
            </CheckupItemHeader>
            <CheckupItemMeta>
              <CheckupItemMetaIcon>
                <Calendar className="w-3.5 h-3.5" />
              </CheckupItemMetaIcon>
              <CheckupItemMetaText>검진 {nextCheckupDate.daysUntilMental}일 전</CheckupItemMetaText>
            </CheckupItemMeta>

            {/* 정신 건강 심층 검사 */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E9D5FF' }}>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4" style={{ color: '#9333EA' }} />
                <h3 className="text-sm font-bold" style={{ color: '#1f2328' }}>정신 건강 심층 검사</h3>
              </div>

              {/* 검사 현황 (getHealthDistribution 기반) */}
              <DeepCheckupStatus>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span style={{ color: '#6E8FB3' }}>검사 현황</span>
                  <span className="font-bold" style={{ color: '#1f2328' }}>{mentalCompletionRate}%</span>
                </div>
                <DeepCheckupProgressBar>
                  <DeepCheckupProgress $color="purple" $width={mentalCompletionRate} />
                </DeepCheckupProgressBar>
                <DeepCheckupProgressText>
                  총 {mentalTotal}명, 미완료 {mentalPending}명 실시간
                </DeepCheckupProgressText>
              </DeepCheckupStatus>

              {/* 점수 분포 (getHealthDistribution 정신 분포) */}
              <ScoreDistribution>
                <ScoreDistributionTitle>점수 분포</ScoreDistributionTitle>
                <div className="flex items-center gap-3">
                  <PieChartContainer>
                    <PieChart width={100} height={100}>
                      <Pie
                        data={monitoringMentalData}
                        cx="50%"
                        cy="50%"
                        innerRadius={28}
                        outerRadius={42}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {monitoringMentalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </PieChartContainer>
                  <LegendContainer>
                    {monitoringMentalData.map((item, index) => (
                      <LegendItem key={index}>
                        <LegendColor $color={item.color} />
                        <LegendLabel>{item.name}</LegendLabel>
                        <LegendValue>{item.value}명</LegendValue>
                      </LegendItem>
                    ))}
                  </LegendContainer>
                </div>
              </ScoreDistribution>
            </div>
          </CheckupItem>

          {/* 신체 건강 검진 예정일 */}
          <CheckupItem $bgColor="from-blue-50 to-blue-100/50" $borderColor="border-blue-200">
            <CheckupItemHeader>
              <CheckupItemInfo>
                <CheckupItemLabel $color="#2563EB">신체 건강 검진 예정일</CheckupItemLabel>
                <CheckupItemDate>{nextCheckupDate.physicalCheckup}</CheckupItemDate>
              </CheckupItemInfo>
              <Badge className="text-white text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: '#2563EB' }}>
                신체
              </Badge>
            </CheckupItemHeader>
            <CheckupItemMeta>
              <CheckupItemMetaIcon>
                <Calendar className="w-3.5 h-3.5" />
              </CheckupItemMetaIcon>
              <CheckupItemMetaText>검진 {nextCheckupDate.daysUntilPhysical}일 전</CheckupItemMetaText>
            </CheckupItemMeta>

            {/* 신체 건강 심층 검사 */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: '#BFDBFE' }}>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4" style={{ color: '#2563EB' }} />
                <h3 className="text-sm font-bold" style={{ color: '#1f2328' }}>신체 건강 심층 검사</h3>
              </div>

              {/* 검사 현황 (getHealthDistribution 기반) */}
              <DeepCheckupStatus>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span style={{ color: '#6E8FB3' }}>검사 현황</span>
                  <span className="font-bold" style={{ color: '#1f2328' }}>{physicalCompletionRate}%</span>
                </div>
                <DeepCheckupProgressBar>
                  <DeepCheckupProgress $color="blue" $width={physicalCompletionRate} />
                </DeepCheckupProgressBar>
                <DeepCheckupProgressText>
                  총 {physicalTotal}명, 미완료 {physicalPending}명 실시간
                </DeepCheckupProgressText>
              </DeepCheckupStatus>

              {/* 점수 분포 (getHealthDistribution 신체 분포) */}
              <ScoreDistribution>
                <ScoreDistributionTitle>점수 분포</ScoreDistributionTitle>
                <div className="flex items-center gap-3">
                  <PieChartContainer>
                    <PieChart width={100} height={100}>
                      <Pie
                        data={monitoringPhysicalData}
                        cx="50%"
                        cy="50%"
                        innerRadius={28}
                        outerRadius={42}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {monitoringPhysicalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </PieChartContainer>
                  <LegendContainer>
                    {monitoringPhysicalData.map((item, index) => (
                      <LegendItem key={index}>
                        <LegendColor $color={item.color} />
                        <LegendLabel>{item.name}</LegendLabel>
                        <LegendValue>{item.value}명</LegendValue>
                      </LegendItem>
                    ))}
                  </LegendContainer>
                </div>
              </ScoreDistribution>
            </div>
          </CheckupItem>
        </CheckupDateGrid>

        {/* 하단: 검진 모니터링 및 미검진 인원 */}
        <MonitoringGrid>
          {/* 검진 모니터링 (정신/신체 토글) */}
          <MonitoringCard onClick={() => setCurrentView('monitoring-detail')}>
            <MonitoringHeader>
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
            </MonitoringHeader>

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

              <LegendContainer>
                {(monitoringTab === 'mental' ? monitoringMentalData : monitoringPhysicalData).map((item, index) => (
                  <LegendItem key={index}>
                    <LegendColor $color={item.color} />
                    <LegendLabel>{item.name}</LegendLabel>
                    <LegendValue>{item.value}명</LegendValue>
                  </LegendItem>
                ))}
              </LegendContainer>
            </div>

            <MonitoringFooter>
              <span className="text-xs" style={{ color: '#6E8FB3' }}>
                {monitoringTab === 'mental' ? '정신 건강' : '신체 건강'} · 전체 인원(에이전시 관리자 제외)
              </span>
            </MonitoringFooter>
          </MonitoringCard>

          {/* 미검진 인원 집중 관리 */}
          <UnscreenedCard onClick={() => setCurrentView('unscreened-detail')}>
            <UnscreenedHeader>
              <h2 className="text-sm font-bold" style={{ color: '#1f2328' }}>미검진 인원 집중 관리</h2>
              <ChevronRight className="w-4 h-4" style={{ color: '#6E8FB3' }} />
            </UnscreenedHeader>

            <UnscreenedList>
              {unscreenedData.length === 0 ? (
                <UnscreenedItem>
                  <UnscreenedName style={{ color: '#6E8FB3' }}>미검진 인원이 없습니다</UnscreenedName>
                </UnscreenedItem>
              ) : (
                unscreenedData.map((person) => {
                  const statusLabel = person.status === 'BOTH' ? '전체' : person.status === 'MENTAL_ONLY' ? '정신' : '신체';
                  const daysOverdue = person.daysOverdue != null && person.daysOverdue > 0 ? person.daysOverdue : 0;
                  return (
                    <UnscreenedItem key={person.memberNo}>
                      <div className="flex items-center gap-2">
                        <UnscreenedAvatar>
                          <User className="w-4 h-4" style={{ color: '#6B7280' }} />
                        </UnscreenedAvatar>
                        <UnscreenedName>{person.memberName ?? '-'}</UnscreenedName>
                      </div>
                      <div className="flex items-center gap-2">
                        {daysOverdue > 0 && (
                          <Badge className="text-white text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#DC2626' }}>
                            {daysOverdue}일 지연
                          </Badge>
                        )}
                        <Badge className="text-white text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#DC2626' }}>
                          {statusLabel}
                        </Badge>
                      </div>
                    </UnscreenedItem>
                  );
                })
              )}
            </UnscreenedList>
          </UnscreenedCard>
        </MonitoringGrid>
      </AgencyHealthBody>

      {/* 건강 검진 설정 모달 (HEALTH_SURVEY_PERIOD, HEALTH_SURVEY_CYCLE) */}
      <Dialog open={isSurveySettingsModalOpen} onOpenChange={setIsSurveySettingsModalOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>건강 검진 설정</DialogTitle>
            <DialogDescription>
              설문 기간과 설문 주기를 설정합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="survey-period">설문 기간 (일)</Label>
              <Input
                id="survey-period"
                type="number"
                min={1}
                max={365}
                value={surveyPeriod}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '') return;
                  const n = parseInt(v, 10);
                  if (!Number.isNaN(n)) setSurveyPeriod(Math.max(1, Math.min(365, n)));
                }}
                placeholder="15"
              />
              <p className="text-xs text-muted-foreground">설문이 진행되는 기간(일 단위)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="survey-cycle">설문 주기 (일)</Label>
              <Input
                id="survey-cycle"
                type="number"
                min={1}
                max={365}
                value={surveyCycle}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '') return;
                  const n = parseInt(v, 10);
                  if (!Number.isNaN(n)) setSurveyCycle(Math.max(1, Math.min(365, n)));
                }}
                placeholder="30"
              />
              <p className="text-xs text-muted-foreground">설문이 반복되는 주기(일 단위)</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSurveySettingsModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSurveySettingsSave}>
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AgencyHealthRoot>
  );
}
