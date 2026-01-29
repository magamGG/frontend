import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Calendar, User, ChevronRight, Clock, CheckCircle2, FileText, Plus, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
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
    ].sort((a, b) => b.score - a.score),
    pendingList: [
      { id: 11, name: '서준혁', daysRemaining: 4 },
      { id: 12, name: '임유진', daysRemaining: 6 },
    ],
  },
};

const mentalPieData = [
  { name: '정상', value: 3, color: '#10B981' },
  { name: '주의', value: 3, color: '#F59E0B' },
  { name: '위험', value: 2, color: '#EF4444' },
];

const physicalPieData = [
  { name: '정상', value: 6, color: '#10B981' },
  { name: '주의', value: 3, color: '#F59E0B' },
  { name: '위험', value: 1, color: '#EF4444' },
];

const monitoringStatusData = [
  { name: '정상', value: 5, color: '#10B981' },
  { name: '주의', value: 4, color: '#F59E0B' },
  { name: '위험', value: 3, color: '#EF4444' },
  { name: '미검진', value: 4, color: '#6B7280' },
];

const initialUnscreenedData = [
  { id: 1, name: '김담당', team: '', daysOverdue: 7 },
  { id: 2, name: '서유진', team: '', daysOverdue: 5 },
  { id: 3, name: '조수연', team: '', daysOverdue: 3 },
  { id: 4, name: '김희동', team: '', daysOverdue: 1 },
].sort((a, b) => b.daysOverdue - a.daysOverdue);

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
  const [currentView, setCurrentView] = useState('main');
  const [nextCheckupDate] = useState(initialNextCheckupDate);
  const [deepCheckupData] = useState(initialDeepCheckupData);
  const [unscreenedData] = useState(initialUnscreenedData);
  const [surveys, setSurveys] = useState(initialSurveys);
  
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

              {/* 검사 현황 */}
              <DeepCheckupStatus>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span style={{ color: '#6E8FB3' }}>검사 현황</span>
                  <span className="font-bold" style={{ color: '#1f2328' }}>{deepCheckupData.mental.completionRate}%</span>
                </div>
                <DeepCheckupProgressBar>
                  <DeepCheckupProgress $color="purple" $width={deepCheckupData.mental.completionRate} />
                </DeepCheckupProgressBar>
                <DeepCheckupProgressText>
                  총 {deepCheckupData.mental.totalEmployees}명, 미완료 {deepCheckupData.mental.pending}명 {deepCheckupData.mental.lastUpdated}
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

              {/* 검사 현황 */}
              <DeepCheckupStatus>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span style={{ color: '#6E8FB3' }}>검사 현황</span>
                  <span className="font-bold" style={{ color: '#1f2328' }}>{deepCheckupData.physical.completionRate}%</span>
                </div>
                <DeepCheckupProgressBar>
                  <DeepCheckupProgress $color="blue" $width={deepCheckupData.physical.completionRate} />
                </DeepCheckupProgressBar>
                <DeepCheckupProgressText>
                  총 {deepCheckupData.physical.totalEmployees}명, 미완료 {deepCheckupData.physical.pending}명 {deepCheckupData.physical.lastUpdated}
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
            </div>
          </CheckupItem>
        </CheckupDateGrid>

        {/* 하단: 검진 모니터링 및 미검진 인원 */}
        <MonitoringGrid>
          {/* 검진 모니터링 */}
          <MonitoringCard onClick={() => setCurrentView('monitoring-detail')}>
            <MonitoringHeader>
              <h2 className="text-sm font-bold" style={{ color: '#1f2328' }}>검진 모니터링</h2>
              <ChevronRight className="w-4 h-4" style={{ color: '#6E8FB3' }} />
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
              <span className="text-xs" style={{ color: '#6E8FB3' }}>검진 인원</span>
            </MonitoringFooter>
          </MonitoringCard>

          {/* 미검진 인원 집중 관리 */}
          <UnscreenedCard onClick={() => setCurrentView('unscreened-detail')}>
            <UnscreenedHeader>
              <h2 className="text-sm font-bold" style={{ color: '#1f2328' }}>미검진 인원 집중 관리</h2>
              <ChevronRight className="w-4 h-4" style={{ color: '#6E8FB3' }} />
            </UnscreenedHeader>

            <UnscreenedList>
              {unscreenedData.map((person) => (
                <UnscreenedItem key={person.id}>
                  <div className="flex items-center gap-2">
                    <UnscreenedAvatar>
                      <User className="w-4 h-4" style={{ color: '#6B7280' }} />
                    </UnscreenedAvatar>
                    <UnscreenedName>{person.name}</UnscreenedName>
                  </div>
                  <Badge className="text-white text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#DC2626' }}>
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
