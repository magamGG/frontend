import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  ChevronRight,
  Clock,
  CheckCircle2,
  Target,
  AlertCircle
} from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { toast } from 'sonner';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import {
  AgencyDashboardRoot,
  AgencyDashboardBody,
  MetricsGrid,
  MetricCard,
  MetricCardContent,
  MetricLabel,
  MetricValue,
  MetricChange,
  MetricIcon,
  ChartsGrid,
  ChartCard,
  ChartCardHeader,
  ChartCardTitle,
  ChartCardIcon,
  ChartContainer,
  ChartAlert,
  ChartAlertIcon,
  ChartAlertText,
  PieChartSection,
  PieChartContainer,
  PieChartLegend,
  PieChartLegendItem,
  PieChartLegendDot,
  PieChartLegendLabel,
  PieChartLegendValue,
  PieChartFooter,
  PieChartFooterLabel,
  PieChartFooterValue,
  WarningBox,
  WarningContent,
  WarningTitle,
  WarningDescription,
  ModalActions,
} from './AgencyDashboardPage.styled';

// 근태 신청 상태 정의
const REQUEST_STATUS = {
  PENDING: '대기',
  APPROVED: '승인',
  REJECTED: '반려',
};

export function AgencyDashboardPage() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  
  // TODO: Zustand store mapping - 마감 임박 현황 데이터
  const deadlineData = [
    { day: '오늘', count: 2 },
    { day: '내일', count: 3 },
    { day: '2일 후', count: 1 },
    { day: '3일 후', count: 4 },
    { day: '4일 후', count: 2 },
  ];
  
  // TODO: Zustand store mapping - 신청 현황 데이터
  const attendanceRequests = [
    {
      id: '1',
      typeName: '휴가',
      startDate: '1월 20일',
      endDate: '1월 22일',
      status: REQUEST_STATUS.PENDING,
    },
    {
      id: '2',
      typeName: '재택근무',
      startDate: '1월 16일',
      endDate: '1월 16일',
      status: REQUEST_STATUS.APPROVED,
    },
    {
      id: '3',
      typeName: '휴가',
      startDate: '1월 20일',
      endDate: '1월 22일',
      status: REQUEST_STATUS.PENDING,
    },
    {
      id: '4',
      typeName: '재택근무',
      startDate: '1월 16일',
      endDate: '1월 16일',
      status: REQUEST_STATUS.APPROVED,
    },
    {
      id: '5',
      typeName: '휴가',
      startDate: '1월 20일',
      endDate: '1월 22일',
      status: REQUEST_STATUS.PENDING,
    },
  ];

  // TODO: Zustand store mapping - 메트릭 데이터
  const metrics = [
    { 
      id: 1, 
      label: '평균 마감 준수율', 
      value: '87.5%', 
      change: '+5.2%',
      icon: Target,
      color: '#10B981',
      bgColor: '#F0FDF4',
      iconBgColor: '#D1FAE5'
    },
    { 
      id: 2, 
      label: '활동 작가', 
      value: '24명', 
      change: '+3명',
      icon: Users,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      iconBgColor: '#DBEAFE'
    },
    { 
      id: 3, 
      label: '진행 프로젝트', 
      value: '18개', 
      change: '+2개',
      icon: Briefcase,
      color: '#9333EA',
      bgColor: '#F3E8FF',
      iconBgColor: '#E9D5FF'
    },
  ];

  // TODO: Zustand store mapping - 마감 준수율 추이 데이터
  const complianceData = [
    { month: '1월', rate: 78 },
    { month: '2월', rate: 82 },
    { month: '3월', rate: 85 },
    { month: '4월', rate: 83 },
    { month: '5월', rate: 86 },
    { month: '6월', rate: 87.5 },
  ];

  // TODO: Zustand store mapping - 작품별 아티스트 분포 데이터
  const artistDistributionData = [
    { name: '로맨스 판타지', artists: 5 },
    { name: '액션 웹툰', artists: 4 },
    { name: 'SF 드라마', artists: 3 },
    { name: '일상 코미디', artists: 6 },
    { name: '스릴러', artists: 2 },
  ];

  // TODO: Zustand store mapping - 출석 현황 데이터
  const attendanceData = [
    { name: '출근', value: 18, color: '#00ACC1' },
    { name: '재택근무', value: 3, color: '#FF9800' },
    { name: '휴재', value: 2, color: '#757575' },
    { name: '워케이션', value: 1, color: '#9C27B0' },
  ];

  // TODO: Zustand store mapping - 승인 대기 데이터
  const approvalData = [
    { name: '휴재', value: 2, color: '#757575' },
    { name: '계약', value: 2, color: '#9C27B0' },
    { name: '신청', value: 1, color: '#00ACC1' },
  ];

  // 출근 시작 핸들러
  const handleStartWork = () => {
    setIsWorking(true);
    toast.success('출근이 시작되었습니다.');
  };

  // 출근 종료 핸들러
  const handleStopWork = () => {
    // 항상 확인 창 표시
    setShowStopConfirm(true);
  };

  // 출근 종료 확인 핸들러
  const confirmStopWork = () => {
    setIsWorking(false);
    setShowStopConfirm(false);
    toast.success('출근을 종료했습니다.');
  };

  return (
    <AgencyDashboardRoot>
      <AgencyDashboardBody>
        {/* 출근/종료 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <Button 
            onClick={isWorking ? handleStopWork : handleStartWork} 
            className={isWorking ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'} 
            size="lg"
            style={{ minWidth: '200px' }}
          >
            {isWorking ? (
              <>
                <Clock className="w-5 h-5 mr-2" />
                출근 종료
              </>
            ) : (
              <>
                <Clock className="w-5 h-5 mr-2" />
                출근 시작
              </>
            )}
          </Button>
        </div>

        {/* 메트릭 카드 섹션 */}
        <MetricsGrid>
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <MetricCard key={metric.id} $bgColor={metric.bgColor}>
                <MetricCardContent>
                  <div style={{ flex: 1 }}>
                    <MetricLabel>{metric.label}</MetricLabel>
                    <MetricValue>{metric.value}</MetricValue>
                    <MetricChange $color={metric.color}>{metric.change}</MetricChange>
                  </div>
                  <MetricIcon $bgColor={metric.iconBgColor} $color={metric.color}>
                    <Icon className="w-5 h-5" />
                  </MetricIcon>
                </MetricCardContent>
              </MetricCard>
            );
          })}
        </MetricsGrid>

        {/* 그래프 섹션 */}
        <ChartsGrid>
          {/* 평균 마감 준수율 추이 (선 그래프) */}
          <ChartCard onClick={() => setSelectedSection('revenue')}>
            <ChartCardHeader>
              <ChartCardIcon>
                <Target className="w-5 h-5" style={{ color: '#6E8FB3' }} />
              </ChartCardIcon>
              <ChartCardTitle>평균 마감 준수율 추이</ChartCardTitle>
            </ChartCardHeader>

            <ChartContainer>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, '준수율']}
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#6E8FB3" 
                    strokeWidth={3}
                    dot={{ fill: '#6E8FB3', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartAlert $bgColor="#F0FDF4" $borderColor="#86EFAC">
              <ChartAlertIcon>
                <TrendingUp className="w-4 h-4" style={{ color: '#10B981' }} />
              </ChartAlertIcon>
              <ChartAlertText $color="#065F46">
                전월 대비 5.2% 증가했습니다
              </ChartAlertText>
            </ChartAlert>
          </ChartCard>

          {/* 작품별 아티스트 분포도 (막대 그래프) */}
          <ChartCard onClick={() => setSelectedSection('distribution')}>
            <ChartCardHeader>
              <ChartCardIcon>
                <Users className="w-5 h-5" style={{ color: '#6E8FB3' }} />
              </ChartCardIcon>
              <ChartCardTitle>작품별 아티스트 분포도</ChartCardTitle>
            </ChartCardHeader>

            <ChartContainer>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={artistDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                    tickFormatter={(value) => `${value}명`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}명`, '아티스트']}
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="artists" 
                    fill="#6E8FB3" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartAlert $bgColor="#EFF6FF" $borderColor="#BFDBFE">
              <ChartAlertIcon>
                <Users className="w-4 h-4" style={{ color: '#3B82F6' }} />
              </ChartAlertIcon>
              <ChartAlertText $color="#1E3A8A">
                일상 코미디에 가장 많은 아티스트가 배정되어 있습니다
              </ChartAlertText>
            </ChartAlert>
          </ChartCard>
        </ChartsGrid>

        {/* 금일 출석 현황 & 승인 대기 직원 수 */}
        <ChartsGrid>
          {/* 금일 출석 현황 (원형 그래프) */}
          <ChartCard>
            <ChartCardHeader>
              <ChartCardIcon>
                <CheckCircle2 className="w-5 h-5" style={{ color: '#6E8FB3' }} />
              </ChartCardIcon>
              <ChartCardTitle>금일 출석 현황</ChartCardTitle>
            </ChartCardHeader>

            <PieChartSection>
              <PieChartContainer>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </PieChartContainer>

              <PieChartLegend>
                {attendanceData.map((item, index) => (
                  <PieChartLegendItem key={index}>
                    <PieChartLegendDot style={{ backgroundColor: item.color }} />
                    <PieChartLegendLabel>{item.name}</PieChartLegendLabel>
                    <PieChartLegendValue>{item.value}명</PieChartLegendValue>
                  </PieChartLegendItem>
                ))}
              </PieChartLegend>
            </PieChartSection>

            <PieChartFooter>
              <PieChartFooterLabel>전체 인원</PieChartFooterLabel>
              <PieChartFooterValue>
                {attendanceData.reduce((sum, item) => sum + item.value, 0)}명
              </PieChartFooterValue>
            </PieChartFooter>
          </ChartCard>

          {/* 승인 대기 중인 직원 수 */}
          <ChartCard onClick={() => setSelectedSection('approvals')}>
            <ChartCardHeader>
              <ChartCardIcon>
                <Clock className="w-5 h-5" style={{ color: '#6E8FB3' }} />
              </ChartCardIcon>
              <ChartCardTitle>승인 대기 중인 직원 수</ChartCardTitle>
            </ChartCardHeader>

            <PieChartSection>
              <PieChartContainer>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={approvalData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {approvalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </PieChartContainer>

              <PieChartLegend>
                {approvalData.map((item, index) => (
                  <PieChartLegendItem key={index}>
                    <PieChartLegendDot style={{ backgroundColor: item.color }} />
                    <PieChartLegendLabel>{item.name}</PieChartLegendLabel>
                    <PieChartLegendValue>{item.value}건</PieChartLegendValue>
                  </PieChartLegendItem>
                ))}
              </PieChartLegend>
            </PieChartSection>

            <PieChartFooter>
              <PieChartFooterLabel>전체 대기</PieChartFooterLabel>
              <PieChartFooterValue>
                {approvalData.reduce((sum, item) => sum + item.value, 0)}건
              </PieChartFooterValue>
            </PieChartFooter>
          </ChartCard>
        </ChartsGrid>

        {/* 마감 임박 현황 & 신청 현황 */}
        <ChartsGrid>
          {/* 마감 임박 현황 */}
          <ChartCard>
            <ChartCardHeader>
              <ChartCardIcon>
                <AlertCircle className="w-5 h-5" style={{ color: '#6E8FB3' }} />
              </ChartCardIcon>
              <ChartCardTitle>마감 임박 현황</ChartCardTitle>
            </ChartCardHeader>
            <ChartContainer>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={deadlineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                    domain={[0, 'dataMax + 1']}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}개`, '작품']}
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#6E8FB3" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            {deadlineData[0]?.count > 0 && (
              <ChartAlert $bgColor="#FEF2F2" $borderColor="#FECACA">
                <ChartAlertIcon>
                  <AlertCircle className="w-4 h-4" style={{ color: '#DC2626' }} />
                </ChartAlertIcon>
                <ChartAlertText $color="#991B1B">
                  오늘 마감 예정 작품이 {deadlineData[0].count}개 있습니다
                </ChartAlertText>
              </ChartAlert>
            )}
          </ChartCard>

          {/* 신청 현황 */}
          <ChartCard>
            <ChartCardHeader>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChartCardIcon>
                    <FileText className="w-5 h-5" style={{ color: '#6E8FB3' }} />
                  </ChartCardIcon>
                  <ChartCardTitle>신청 현황</ChartCardTitle>
                </div>
                {attendanceRequests.length >= 2 && (
                  <ChevronRight 
                    className="w-4 h-4" 
                    style={{ color: 'var(--muted-foreground)', cursor: 'pointer' }}
                    onClick={() => setShowAttendanceModal(true)}
                  />
                )}
              </div>
            </ChartCardHeader>
            <div style={{ padding: '16px', maxHeight: '200px', overflowY: 'auto' }}>
              {attendanceRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted-foreground)' }}>
                  신청 현황이 없습니다
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {attendanceRequests.slice(0, 5).map((request) => {
                    const statusColor = 
                      request.status === REQUEST_STATUS.PENDING ? '#F59E0B' :
                      request.status === REQUEST_STATUS.APPROVED ? '#10B981' :
                      '#EF4444';
                    
                    return (
                      <div
                        key={request.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px',
                          backgroundColor: 'white',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>
                            {request.typeName}
                          </p>
                          <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', margin: 0 }}>
                            {request.startDate} ~ {request.endDate}
                          </p>
                        </div>
                        <div
                          style={{
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            backgroundColor: statusColor,
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {request.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ChartCard>
        </ChartsGrid>

        {/* 신청 현황 모달 */}
        <Modal 
          isOpen={showAttendanceModal} 
          onClose={() => setShowAttendanceModal(false)} 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
              <span>신청 현황 목록</span>
            </div>
          }
          maxWidth="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {attendanceRequests.map((request) => {
              const statusColor = 
                request.status === REQUEST_STATUS.PENDING ? '#F59E0B' :
                request.status === REQUEST_STATUS.APPROVED ? '#10B981' :
                '#EF4444';
              
              return (
                <div
                  key={request.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        backgroundColor: '#E5E7EB',
                        color: '#6B7280',
                        fontSize: '12px',
                        fontWeight: 500,
                        marginBottom: '8px',
                        width: 'fit-content',
                      }}
                    >
                      프로젝트
                    </div>
                    <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', margin: '0 0 4px 0' }}>
                      {request.typeName}
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--foreground)', margin: '0 0 12px 0' }}>
                      {request.startDate} ~ {request.endDate}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', margin: 0 }}>
                      남은 일수 • {request.status}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      backgroundColor: statusColor,
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {request.status}
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>

        {/* 출근 종료 확인 모달 */}
        <Modal isOpen={showStopConfirm} onClose={() => setShowStopConfirm(false)} title="출근 종료 확인" maxWidth="sm">
          <WarningBox>
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <WarningContent>
              <WarningTitle>출근을 종료하시겠습니까?</WarningTitle>
              <WarningDescription>
                출근을 종료하시겠습니까?
              </WarningDescription>
            </WarningContent>
          </WarningBox>
          <ModalActions>
            <Button variant="outline" className="flex-1" onClick={() => setShowStopConfirm(false)}>
              취소
            </Button>
            <Button variant="destructive" className="flex-1" onClick={confirmStopWork}>
              종료
            </Button>
          </ModalActions>
        </Modal>
      </AgencyDashboardBody>
    </AgencyDashboardRoot>
  );
}
