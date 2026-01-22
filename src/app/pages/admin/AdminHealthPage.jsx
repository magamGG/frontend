import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { AlertTriangle, TrendingUp, ChevronRight, Calendar, Clock, FileText, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { MentalHealthDetailPage } from '@/app/pages/health/MentalHealthDetailPage';
import { PhysicalHealthDetailPage } from '@/app/pages/health/PhysicalHealthDetailPage';
import { RiskAnalysisPage } from '@/app/pages/health/RiskAnalysisPage';
import { SurveyManagementPage } from '@/app/pages/health/SurveyManagementPage';
import { MonitoringDetailPage } from '@/app/pages/health/MonitoringDetailPage';
import { UnscreenedDetailPage } from '@/app/pages/health/UnscreenedDetailPage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

// 위험도 데이터 타입


// 검진 모니터링 데이터 타입


// 미검진 인원 데이터 타입


// 설문 항목 타입


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

  // 다음 검진 예정일 데이터
  const [nextCheckupDate] = useState({
    mentalCheckup: '2026.01.25',
    physicalCheckup: '2026.02.01',
    daysUntilMental,
    daysUntilPhysical,
  });

  // 심층 검진 검사 데이터
  const [deepCheckupData] = useState({
    mental: {
      totalEmployees,
      completed,
      pending,
      completionRate,
      lastUpdated: '2026.01.18 14,
      completedList: [
        { id, name: '송도동', date: '2026.01.15', score, status: '주의' },
        { id, name: '박아시', date: '2026.01.16', score, status: '정상' },
        { id, name: '이직가', date: '2026.01.17', score, status: '정상' },
        { id, name: '최소연', date: '2026.01.18', score, status: '주의' },
        { id, name: '김작가', date: '2026.01.15', score, status: '정상' },
        { id, name: '정원화', date: '2026.01.16', score, status: '위험' },
        { id, name: '한민수', date: '2026.01.17', score, status: '정상' },
        { id, name: '윤서진', date: '2026.01.18', score, status: '주의' },
      ],
      pendingList: [
        { id, name: '강태희', daysRemaining,
        { id, name: '조민아', daysRemaining,
        { id, name: '서준혁', daysRemaining,
        { id, name: '임유진', daysRemaining,
      ],
    },
    physical: {
      totalEmployees,
      completed,
      pending,
      completionRate,
      lastUpdated: '2026.01.18 15,
      completedList: [
        { id, name: '송도동', date: '2026.01.14', score, status: '위험' },
        { id, name: '박아시', date: '2026.01.15', score, status: '정상' },
        { id, name: '이직가', date: '2026.01.15', score, status: '주의' },
        { id, name: '최소연', date: '2026.01.16', score, status: '정상' },
        { id, name: '김작가', date: '2026.01.16', score, status: '정상' },
        { id, name: '정원화', date: '2026.01.17', score, status: '정상' },
        { id, name: '한민수', date: '2026.01.17', score, status: '주의' },
        { id, name: '윤서진', date: '2026.01.18', score, status: '정상' },
        { id, name: '강태희', date: '2026.01.18', score, status: '정상' },
        { id, name: '조민아', date: '2026.01.18', score, status: '주의' },
      ],
      pendingList: [
        { id, name: '서준혁', daysRemaining,
        { id, name: '임유진', daysRemaining,
      ],
    },
  });

  // 위험 인원 데이터
  const [riskData] = useState({
    high: [
      { id, name: '송도동', mentalCount, physicalCount, lastCheck: '01.13' },
      { id, name: '박아시', mentalCount, physicalCount, lastCheck: '01.13' },
      { id, name: '이직가', mentalCount, physicalCount, lastCheck: '01.13' },
    ],
    warning: [
      { id, name: '최소연', mentalCount, physicalCount, lastCheck: '01.13' },
      { id, name: '김작가', mentalCount, physicalCount, lastCheck: '01.13' },
      { id, name: '최소연', mentalCount, physicalCount, lastCheck: '01.13' },
      { id, name: '김작가', mentalCount, physicalCount, lastCheck: '01.13' },
    ],
  });

  // 검진 모니터링 데이터
  const [monitoringData] = useState([
    { id, name: '송도동', mentalCount, physicalCount, status: '위험', lastCheckDate: '01.13', position: '영업팀' },
    { id, name: '박아시', mentalCount, physicalCount, status: '주의', lastCheckDate: '01.13', position: '개발팀' },
    { id, name: '이직가', mentalCount, physicalCount, status: '주의', lastCheckDate: '01.10', position: '경영지원' },
    { id, name: '최소연', mentalCount, physicalCount, status: '정상', lastCheckDate: '01.12', position: '디자인팀' },
    { id, name: '김작가', mentalCount, physicalCount, status: '정상', lastCheckDate: '01.12', position: '영업팀' },
  ]);

  // 미검진 인원 데이터
  const [unscreenedData] = useState([
    { id, name: '이수진', team: '마케팅', daysOverdue,
    { id, name: '조인혜', team: '개발팀', daysOverdue,
    { id, name: '서동혁', team: '경영지원', daysOverdue,
    { id, name: '김미영', team: '디자인팀', daysOverdue,
  ]);

  // 인원 분포 데이터 (검진 모니터링 상세에서 가져온 형태)
  const distributionData = [
    { name: '위험', value, color: '#EF4444' },
    { name: '주의', value, color: '#F59E0B' },
    { name: '정상', value, color: '#10B981' },
  ];

  // 설문 목록 데이터
  const mentalSurveys = [
    { id, title: '일일 간이 체크', category: '정신건강분류', status: '사용 중' },
    { id, title: '정기 심층 검사', category: '정신건강분류', status: '사용 중' },
  ];

  const physicalSurveys = [
    { id, title: '일일 간이 체크', category: '신체건강분류', status: '사용 중' },
    { id, title: '정기 심층 검사', category: '신체건강분류', status: '사용 중' },
  ];

  const currentSurveys = selectedTab === '정신건강분류' ? mentalSurveys : physicalSurveys;

  // 설문 수정 핸들러
  const handleEditSurvey = (surveyId) => {
    const survey = [...mentalSurveys, ...physicalSurveys].find(s => s.id === surveyId);
    if (!survey) return;

    if (survey.title.includes('일일')) {
      setSelectedSurveyType('일일');
      if (survey.category === '정신건강분류') {
        setIsMentalSurveyModalOpen(true);
      } else {
        setIsPhysicalSurveyModalOpen(true);
      }
    } else {
      setSelectedSurveyType('정기');
      setDeepSurveyCategory(survey.category);
      setIsDeepSurveyModalOpen(true);
    }
  };

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
    <div className="h-full overflow-y-auto bg-[#FAFAFA] p-6">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* 다음 검진 예정일 */}
        <Card className="p-5 bg-white border-none shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#6E8FB3]" />
            <h2 className="text-base font-bold text-[#1F2328]">다음 검진 예정일</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* 정신 건강 검진 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs text-purple-600 font-medium mb-1">정신 건강 심층 검진</div>
                  <div className="text-2xl font-bold text-[#1F2328]">{nextCheckupDate.mentalCheckup}</div>
                </div>
                <Badge className="bg-purple-600 text-white text-xs px-2 py-1">
                  D-{nextCheckupDate.daysUntilMental}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6E8FB3]">
                <Clock className="w-3.5 h-3.5" />
                <span>PHQ-9 · GAD-7 설문 실시</span>
              </div>
            </div>

            {/* 신체 건강 검진 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs text-blue-600 font-medium mb-1">신체 건강 심층 검진</div>
                  <div className="text-2xl font-bold text-[#1F2328]">{nextCheckupDate.physicalCheckup}</div>
                </div>
                <Badge className="bg-blue-600 text-white text-xs px-2 py-1">
                  D-{nextCheckupDate.daysUntilPhysical}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6E8FB3]">
                <Clock className="w-3.5 h-3.5" />
                <span>종합 신체 상태 설문 실시</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 심층 검진 검사 현황 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 정신 건강 심층 검사 */}
          <Card className="p-5 bg-white border-none shadow-sm">
            <div 
              className="flex items-center justify-between mb-4 cursor-pointer hover:bg-muted/10 -m-5 p-5 rounded-t-lg transition-colors"
              onClick={() => setCurrentView('mental-detail')}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-bold text-[#1F2328]">정신 건강 심층 검사</h2>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6E8FB3]" />
            </div>

            {/* 진행 상황 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6E8FB3]">검사 진행률</span>
                <span className="text-lg font-bold text-[#1F2328]">
                  {deepCheckupData.mental.completionRate}%
                </span>
              </div>
              <div className="w-full bg-[#DADDE1] rounded-full h-2 mb-1">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${deepCheckupData.mental.completionRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-[#6E8FB3]">
                <span>완료 {deepCheckupData.mental.completed}명 / 대기 {deepCheckupData.mental.pending}명</span>
                <span>최종 업데이트: {deepCheckupData.mental.lastUpdated}</span>
              </div>
            </div>

            {/* 완료 목록 */}
            <div className="mb-3">
              <Button
                onClick={() => setIsMentalCompletedModalOpen(true)}
                variant="outline"
                className="w-full flex items-center justify-between p-3 h-auto hover:bg-green-50"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <h3 className="text-sm font-bold text-[#1F2328]">검사 완료</h3>
                  <Badge className="bg-green-100 text-green-600 text-xs px-2 py-0.5">
                    {deepCheckupData.mental.completed}명
                  </Badge>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6E8FB3]" />
              </Button>
            </div>

            {/* 대기 목록 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <h3 className="text-sm font-bold text-[#1F2328]">검사 대기</h3>
                <Badge className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5">
                  {deepCheckupData.mental.pending}명
                </Badge>
              </div>
              <div className="space-y-1.5">
                {deepCheckupData.mental.pendingList.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center justify-between p-2 bg-orange-50 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-orange-600" />
                      <span className="font-medium text-[#1F2328]">{person.name}</span>
                    </div>
                    <Badge className="bg-orange-600 text-white text-[10px] px-2 py-0.5">
                      {person.daysRemaining}일 남음
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 신체 건강 심층 검사 */}
          <Card className="p-5 bg-white border-none shadow-sm">
            <div 
              className="flex items-center justify-between mb-4 cursor-pointer hover:bg-muted/10 -m-5 p-5 rounded-t-lg transition-colors"
              onClick={() => setCurrentView('physical-detail')}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-[#1F2328]">신체 건강 심층 검사</h2>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6E8FB3]" />
            </div>

            {/* 진행 상황 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6E8FB3]">검사 진행률</span>
                <span className="text-lg font-bold text-[#1F2328]">
                  {deepCheckupData.physical.completionRate}%
                </span>
              </div>
              <div className="w-full bg-[#DADDE1] rounded-full h-2 mb-1">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${deepCheckupData.physical.completionRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-[#6E8FB3]">
                <span>완료 {deepCheckupData.physical.completed}명 / 대기 {deepCheckupData.physical.pending}명</span>
                <span>최종 업데이트: {deepCheckupData.physical.lastUpdated}</span>
              </div>
            </div>

            {/* 완료 목록 */}
            <div className="mb-3">
              <Button
                onClick={() => setIsPhysicalCompletedModalOpen(true)}
                variant="outline"
                className="w-full flex items-center justify-between p-3 h-auto hover:bg-green-50"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <h3 className="text-sm font-bold text-[#1F2328]">검사 완료</h3>
                  <Badge className="bg-green-100 text-green-600 text-xs px-2 py-0.5">
                    {deepCheckupData.physical.completed}명
                  </Badge>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6E8FB3]" />
              </Button>
            </div>

            {/* 대기 목록 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <h3 className="text-sm font-bold text-[#1F2328]">검사 대기</h3>
                <Badge className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5">
                  {deepCheckupData.physical.pending}명
                </Badge>
              </div>
              <div className="space-y-1.5">
                {deepCheckupData.physical.pendingList.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center justify-between p-2 bg-orange-50 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-orange-600" />
                      <span className="font-medium text-[#1F2328]">{person.name}</span>
                    </div>
                    <Badge className="bg-orange-600 text-white text-[10px] px-2 py-0.5">
                      {person.daysRemaining}일 남음
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* 2x2 그리드 레이아웃 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 위험 */}
          <Card className="p-5 bg-white border-none shadow-sm">
            <div 
              className="flex items-center justify-between mb-4 cursor-pointer hover:bg-muted/10 -mx-5 -mt-5 px-5 pt-5 pb-4 rounded-t-lg transition-colors"
              onClick={() => setCurrentView('risk-analysis')}
            >
              <h2 className="text-base font-bold text-[#1F2328]">위험</h2>
              <ChevronRight className="w-4 h-4 text-[#6E8FB3]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* 고위험 */}
              <div className="bg-[#FAFAFA] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    고위험
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {riskData.high.length}명 
                </div>
                <div className="text-[10px] text-[#6E8FB3] mb-1">정신·신체</div>
                <div className="text-xs text-[#6E8FB3] space-y-0.5">
                  <div>정신 건강 위험 인원 2명</div>
                  <div>신체 건강 위험 인원 1명</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#DADDE1] text-[11px]">
                    <span>최근 검사일</span>
                    <span>{riskData.high[0].lastCheck}</span>
                  </div>
                </div>
              </div>

              {/* 주의 */}
              <div className="bg-[#FAFAFA] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs font-medium">
                    <TrendingUp className="w-3 h-3" />
                    주의
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {riskData.warning.length}명
                </div>
                <div className="text-[10px] text-[#6E8FB3] mb-1">정신·신체</div>
                <div className="text-xs text-[#6E8FB3] space-y-0.5">
                  <div>정신 건강 주의 인원 1명</div>
                  <div>신체 건강 주의 인원 3명</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#DADDE1] text-[11px]">
                    <span>최근 검사일</span>
                    <span>{riskData.warning[0].lastCheck}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 인원 분포 시각화 - 파이차트로 변경 */}
          <Card className="p-5 bg-white border-none shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#1F2328]">인원 분포</h2>
              <span className="text-xs text-[#6E8FB3]">
                위험 {distributionData.find(d => d.name === '위험')?.value || 0}명 · 
                주의 {distributionData.find(d => d.name === '주의')?.value || 0}명 · 
                정상 {distributionData.find(d => d.name === '정상')?.value || 0}명
              </span>
            </div>

            {/* Pie Chart */}
            <div className="h-[200px] mb-4">
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
                      backgroundColor, 
                      border: '1px solid #DADDE1',
                      borderRadius,
                      fontSize: '12px'
                    }}
                    formatter={(value) => [`${value}명`, '인원']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4">
              {distributionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-[#6E8FB3]">{item.name}</span>
                  <span className="text-xs font-semibold text-[#1F2328]">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 검진 모니터링 */}
          <Card className="p-5 bg-white border-none shadow-sm">
            <div 
              className="flex items-center justify-between mb-4 cursor-pointer hover:bg-muted/10 -mx-5 -mt-5 px-5 pt-5 pb-4 rounded-t-lg transition-colors"
              onClick={() => setCurrentView('monitoring-detail')}
            >
              <h2 className="text-base font-bold text-[#1F2328]">검진 모니터링</h2>
              <ChevronRight className="w-4 h-4 text-[#6E8FB3]" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#DADDE1]">
                    <th className="text-left text-[10px] font-medium text-[#6E8FB3] pb-2 pr-2">이름</th>
                    <th className="text-left text-[10px] font-medium text-[#6E8FB3] pb-2 px-1">직책</th>
                    <th className="text-center text-[10px] font-medium text-[#6E8FB3] pb-2 px-1">상태</th>
                    <th className="text-right text-[10px] font-medium text-[#6E8FB3] pb-2 pl-2">최근 검사일</th>
                  </tr>
                </thead>
                <tbody>
                  {monitoringData.map((person) => (
                    <tr key={person.id} className="border-b border-[#DADDE1]">
                      <td className="py-2.5 text-sm text-[#1F2328] pr-2">{person.name}</td>
                      <td className="py-2.5 text-xs text-[#6E8FB3] px-1">{person.position}</td>
                      <td className="py-2.5 text-center px-1">
                        <Badge className={`${getStatusBadgeClass(person.status)} text-[10px] px-2 py-0.5`}>
                          {person.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-right text-xs text-[#6E8FB3] pl-2">{person.lastCheckDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* 미검진 인원 */}
          <Card className="p-5 bg-white border-none shadow-sm">
            <div 
              className="flex items-center justify-between mb-4 cursor-pointer hover:bg-muted/10 -mx-5 -mt-5 px-5 pt-5 pb-4 rounded-t-lg transition-colors"
              onClick={() => setCurrentView('unscreened-detail')}
            >
              <div>
                <h2 className="text-base font-bold text-[#1F2328] mb-1">미검진 인원 집중 관리</h2>
                <p className="text-xs text-[#6E8FB3]">미검진 직원을 확인하세요.</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6E8FB3] flex-shrink-0" />
            </div>

            <div className="space-y-2">
              {[...unscreenedData].sort((a, b) => b.daysOverdue - a.daysOverdue).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 hover:bg-[#FAFAFA] transition-colors cursor-pointer rounded-lg p-2"
                >
                  <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-[#6B7280]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1F2328]">{item.name}</p>
                    <p className="text-xs text-[#6B7280]">{item.team}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge 
                      className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full"
                      style={{ background: '#DC2626', color: '#FFFFFF' }}
                    >
                      {item.daysOverdue}일 ��연
                    </Badge>
                    <ChevronRight className="w-3.5 h-3.5 text-[#6E8FB3] flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 검사 완료 인원 모달 - 정신 건강 */}
        <Dialog open={isMentalCompletedModalOpen} onOpenChange={setIsMentalCompletedModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>정신 건강 심층 검사 완료 인원</DialogTitle>
              <DialogDescription>최근 정신 건강 심층 검사를 완료한 인원 목록입니다.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {[...deepCheckupData.mental.completedList]
                .sort((a, b) => {
                  // 날짜 문자열을 Date 객체로 변환하여 비교 (내림차순)
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
              {[...deepCheckupData.physical.completedList]
                .sort((a, b) => {
                  // 날짜 문자열을 Date 객체로 변환하여 비교 (내림차순)
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
      </div>
    </div>
  );
}