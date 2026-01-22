import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Calendar, User, ChevronRight } from 'lucide-react';
import { MentalHealthDetailPage } from '@/app/pages/health/MentalHealthDetailPage';
import { PhysicalHealthDetailPage } from '@/app/pages/health/PhysicalHealthDetailPage';
import { RiskAnalysisPage } from '@/app/pages/health/RiskAnalysisPage';
import { MonitoringDetailPage } from '@/app/pages/health/MonitoringDetailPage';
import { UnscreenedDetailPage } from '@/app/pages/health/UnscreenedDetailPage';
import { SurveyListManagementPage } from '@/app/pages/health/SurveyListManagementPage';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

/**
 * AgencyHealthPage component
 */
export function AgencyHealthPage() {
  // 상세 페이지 상태 관리
  const [currentView, setCurrentView] = useState('main');

  // 다음 검진 예정일 데이터
  const [nextCheckupDate] = useState({
    mentalCheckup: '2026.01.25',
    physicalCheckup: '2026.02.01',
    daysUntilMental: 5,
    daysUntilPhysical: 12,
  });

  // 심층 검진 검사 데이터
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
      ].sort((a, b) => b.score - a.score), // 점수 내림차순 정렬
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
      ].sort((a, b) => b.score - a.score), // 점수 내림차순 정렬
    },
  });

  // 정신 건강 점수 분포 데이터 (도넛 차트용)
  const mentalPieData = [
    { name: '정상', value: 3, color: '#10B981' },
    { name: '주의', value: 3, color: '#F59E0B' },
    { name: '위험', value: 2, color: '#EF4444' },
  ];

  // 신체 건강 점수 분포 데이터 (도넛 차트용)
  const physicalPieData = [
    { name: '정상', value: 6, color: '#10B981' },
    { name: '주의', value: 3, color: '#F59E0B' },
    { name: '위험', value: 1, color: '#EF4444' },
  ];

  // 검진 모니터링 데이터 (도넛 차트용) - 미검진 인원 추가
  const monitoringStatusData = [
    { name: '정상', value: 5, color: '#10B981' },
    { name: '주의', value: 4, color: '#F59E0B' },
    { name: '위험', value: 3, color: '#EF4444' },
    { name: '미검진', value: 4, color: '#9CA3AF' },
  ];

  // 미검진 인원 데이터 - 지연 일수 내림차순 정렬
  const [unscreenedData] = useState(
    [
      { id: 1, name: '김담당', team: '', daysOverdue: 7 },
      { id: 2, name: '서유진', team: '', daysOverdue: 5 },
      { id: 3, name: '조수연', team: '', daysOverdue: 3 },
      { id: 4, name: '김희동', team: '', daysOverdue: 1 },
    ].sort((a, b) => b.daysOverdue - a.daysOverdue) // 지연 일수 내림차순 정렬
  );

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
    <div className="h-full overflow-y-auto bg-[#F5F5F7] p-4">
      <div className="max-w-[1200px] mx-auto space-y-3 pb-24">
        {/* 상단: 다음 검진 예정일 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 정신 건강 검진 예정일 */}
          <Card className="p-4 bg-white border-none shadow-sm rounded-2xl">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs text-[#9CA3AF] mb-1">정신 건강 검진 예정일</div>
                <div className="text-2xl font-bold text-[#1F2328] mb-1">{nextCheckupDate.mentalCheckup}</div>
                <div className="flex items-center gap-1.5 text-xs text-[#6E8FB3]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>검진 {nextCheckupDate.daysUntilMental}일 전</span>
                </div>
              </div>
              <Badge className="bg-purple-500 text-white text-xs px-2.5 py-1 rounded-full">
                정신
              </Badge>
            </div>
          </Card>

          {/* 신체 건강 검진 예정일 */}
          <Card className="p-4 bg-white border-none shadow-sm rounded-2xl">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs text-[#9CA3AF] mb-1">신체 건강 검진 예정일</div>
                <div className="text-2xl font-bold text-[#1F2328] mb-1">{nextCheckupDate.physicalCheckup}</div>
                <div className="flex items-center gap-1.5 text-xs text-[#6E8FB3]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>검진 {nextCheckupDate.daysUntilPhysical}일 전</span>
                </div>
              </div>
              <Badge className="bg-blue-500 text-white text-xs px-2.5 py-1 rounded-full">
                신체
              </Badge>
            </div>
          </Card>
        </div>

        {/* 중단: 정신/신체 건강 심층 검사 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 정신 건강 심층 검사 */}
          <Card className="p-4 bg-white border-none shadow-sm rounded-2xl">
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => setCurrentView('mental-detail')}
            >
              <h2 className="text-sm font-bold text-[#1F2328]">정신 건강 심층 검사</h2>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </div>

            {/* 검사 현황 */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#9CA3AF]">검사 현황</span>
                <span className="font-bold text-[#1F2328]">{deepCheckupData.mental.completionRate}%</span>
              </div>
              <div className="w-full bg-[#E5E7EB] rounded-full h-1.5">
                <div
                  className="bg-purple-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${deepCheckupData.mental.completionRate}%` }}
                />
              </div>
              <div className="text-xs text-[#9CA3AF] mt-1">
                총 {deepCheckupData.mental.totalEmployees}명, 미완료 {deepCheckupData.mental.pending}명 · {deepCheckupData.mental.lastUpdated}
              </div>
            </div>

            {/* 점수 분포 */}
            <div>
              <div className="text-xs font-medium text-[#1F2328] mb-2">점수 분포</div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
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
                </div>
                <div className="flex-1 space-y-1.5">
                  {mentalPieData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-[#6E8FB3]">{item.name}</span>
                      </div>
                      <span className="text-xs font-medium text-[#1F2328]">{item.value}명</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* 신체 건강 심층 검사 */}
          <Card className="p-4 bg-white border-none shadow-sm rounded-2xl">
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => setCurrentView('physical-detail')}
            >
              <h2 className="text-sm font-bold text-[#1F2328]">신체 건강 심층 검사</h2>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </div>

            {/* 검사 현황 */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#9CA3AF]">검사 현황</span>
                <span className="font-bold text-[#1F2328]">{deepCheckupData.physical.completionRate}%</span>
              </div>
              <div className="w-full bg-[#E5E7EB] rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${deepCheckupData.physical.completionRate}%` }}
                />
              </div>
              <div className="text-xs text-[#9CA3AF] mt-1">
                총 {deepCheckupData.physical.totalEmployees}명, 미완료 {deepCheckupData.physical.pending}명 · {deepCheckupData.physical.lastUpdated}
              </div>
            </div>

            {/* 점수 분포 */}
            <div>
              <div className="text-xs font-medium text-[#1F2328] mb-2">점수 분포</div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
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
                </div>
                <div className="flex-1 space-y-1.5">
                  {physicalPieData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-[#6E8FB3]">{item.name}</span>
                      </div>
                      <span className="text-xs font-medium text-[#1F2328]">{item.value}명</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 하단: 검진 모니터링 및 미검진 인원 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 검진 모니터링 */}
          <Card className="p-4 bg-white border-none shadow-sm rounded-2xl">
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => setCurrentView('monitoring-detail')}
            >
              <h2 className="text-sm font-bold text-[#1F2328]">검진 모니터링</h2>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-shrink-0">
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
              </div>

              <div className="flex-1 space-y-1.5">
                {monitoringStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-[#6E8FB3]">{item.name}</span>
                    </div>
                    <span className="text-xs font-medium text-[#1F2328]">{item.value}명</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#E5E7EB] text-center">
              <span className="text-xs text-[#9CA3AF]">검진 인원</span>
            </div>
          </Card>

          {/* 미검진 인원 집중 관리 */}
          <Card className="p-4 bg-white border-none shadow-sm rounded-2xl">
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => setCurrentView('unscreened-detail')}
            >
              <h2 className="text-sm font-bold text-[#1F2328]">미검진 인원 집중 관리</h2>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </div>

            <div className="space-y-2">
              {unscreenedData.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between p-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center">
                      <User className="w-4 h-4 text-[#6B7280]" />
                    </div>
                    <span className="text-sm font-medium text-[#1F2328]">{person.name}</span>
                  </div>
                  <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {person.daysOverdue}일 지연
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}