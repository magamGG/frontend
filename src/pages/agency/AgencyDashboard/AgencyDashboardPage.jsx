import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  Target,
  Activity,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import { agencyService, leaveService } from '@/api/services';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Label } from 'recharts';
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
  HealthTabWrap,
  HealthTabButton,
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
  const user = useAuthStore((state) => state.user);

  // 메트릭 데이터 (DB 연동 - 평균 마감 준수율, 활동 작가, 진행 프로젝트)
  const [metrics, setMetrics] = useState([
    { id: 1, label: '평균 마감 준수율', value: '0%', change: '-', icon: Target, color: '#10B981', bgColor: '#F0FDF4', iconBgColor: '#D1FAE5' },
    { id: 2, label: '활동 작가', value: '0명', change: '-', icon: Users, color: '#3B82F6', bgColor: '#EFF6FF', iconBgColor: '#DBEAFE' },
    { id: 3, label: '진행 프로젝트', value: '0개', change: '-', icon: Briefcase, color: '#9333EA', bgColor: '#F3E8FF', iconBgColor: '#E9D5FF' },
  ]);
  const [metricsLoading, setMetricsLoading] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      const agencyNo = user?.agencyNo;
      if (!agencyNo) return;

      setMetricsLoading(true);
      try {
        const data = await agencyService.getDashboardMetrics(agencyNo);
        const rate = data?.averageDeadlineComplianceRate ?? 0;
        const artists = data?.activeArtistCount ?? 0;
        const projects = data?.activeProjectCount ?? 0;
        const complianceChange = data?.complianceRateChange ?? null;
        const artistChange = data?.activeArtistChange ?? null;
        const projectChange = data?.activeProjectChange ?? null;
        setMetrics([
          {
            id: 1,
            label: '평균 마감 준수율',
            value: `${rate}%`,
            change: complianceChange ?? '-',
            changeColor: complianceChange ? (complianceChange.includes('+') || complianceChange.includes('대비 +') ? '#10B981' : complianceChange.includes('대비 -') ? '#EF4444' : '#10B981') : undefined,
            icon: Target,
            color: '#10B981',
            bgColor: '#F0FDF4',
            iconBgColor: '#D1FAE5',
          },
          {
            id: 2,
            label: '활동 작가',
            value: `${artists}명`,
            change: artistChange ?? '-',
            changeColor: artistChange ? (artistChange.includes('+') || artistChange.includes('대비 증가') ? '#10B981' : artistChange.includes('대비 -') ? '#EF4444' : '#3B82F6') : undefined,
            icon: Users,
            color: '#3B82F6',
            bgColor: '#EFF6FF',
            iconBgColor: '#DBEAFE',
          },
          {
            id: 3,
            label: '진행 프로젝트',
            value: `${projects}개`,
            change: projectChange ?? '-',
            changeColor: projectChange ? (projectChange.includes('+') || projectChange.includes('대비 증가') ? '#10B981' : projectChange.includes('대비 -') ? '#EF4444' : '#9333EA') : undefined,
            icon: Briefcase,
            color: '#9333EA',
            bgColor: '#F3E8FF',
            iconBgColor: '#E9D5FF',
          },
        ]);
      } catch (err) {
        console.error('에이전시 대시보드 메트릭 조회 실패:', err);
        setMetrics([
          { id: 1, label: '평균 마감 준수율', value: '0%', change: '-', icon: Target, color: '#10B981', bgColor: '#F0FDF4', iconBgColor: '#D1FAE5' },
          { id: 2, label: '활동 작가', value: '0명', change: '-', icon: Users, color: '#3B82F6', bgColor: '#EFF6FF', iconBgColor: '#DBEAFE' },
          { id: 3, label: '진행 프로젝트', value: '0개', change: '-', icon: Briefcase, color: '#9333EA', bgColor: '#F3E8FF', iconBgColor: '#E9D5FF' },
        ]);
      } finally {
        setMetricsLoading(false);
      }
    };
    fetchMetrics();
  }, [user?.agencyNo]);

  // 마감 임박 현황 (DB 연동)
  const [deadlineData, setDeadlineData] = useState([]);

  // 신청 현황 (DB 연동 - 에이전시 소속 근태 신청)
  const [attendanceRequests, setAttendanceRequests] = useState([]);

  const formatDateKr = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  const REQUEST_STATUS_MAP = {
    PENDING: REQUEST_STATUS.PENDING,
    APPROVED: REQUEST_STATUS.APPROVED,
    REJECTED: REQUEST_STATUS.REJECTED,
  };

  const fetchDeadlineAndRequests = async () => {
    const agencyNo = user?.agencyNo;
    if (!agencyNo) return;

    try {
      const [deadlineRes, requestsRes] = await Promise.all([
        agencyService.getDeadlineCounts(agencyNo),
        leaveService.getAgencyRequests(agencyNo),
      ]);

      const counts = deadlineRes ?? [];
      setDeadlineData(
        counts.map((c) => ({ day: c.name ?? '-', count: c.count ?? 0 }))
      );

      const raw = Array.isArray(requestsRes) ? requestsRes : (requestsRes?.data ?? []);
      const filtered = raw.filter((r) => r.attendanceRequestStatus !== 'CANCELLED');
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      setAttendanceRequests(
        filtered
          .filter((r) => {
            const endAt = r.attendanceRequestEndDate ? new Date(r.attendanceRequestEndDate) : null;
            return !endAt || endAt >= todayStart;
          })
          .map((r) => ({
            id: String(r.attendanceRequestNo ?? r.memberNo),
            applicantName: r.memberName ?? '-',
            typeName: r.attendanceRequestType ?? '-',
            startDate: formatDateKr(r.attendanceRequestStartDate),
            endDate: formatDateKr(r.attendanceRequestEndDate),
            status: REQUEST_STATUS_MAP[r.attendanceRequestStatus] ?? '-',
            attendanceRequestNo: r.attendanceRequestNo,
          }))
      );
    } catch (err) {
      console.error('마감 임박/신청 현황 조회 실패:', err);
      setDeadlineData([]);
      setAttendanceRequests([]);
    }
  };

  useEffect(() => {
    fetchDeadlineAndRequests();
  }, [user?.agencyNo]);

  useEffect(() => {
    const onRefresh = () => fetchDeadlineAndRequests();
    window.addEventListener('leaveRequestSuccess', onRefresh);
    window.addEventListener('focus', onRefresh);
    return () => {
      window.removeEventListener('leaveRequestSuccess', onRefresh);
      window.removeEventListener('focus', onRefresh);
    };
  }, [user?.agencyNo]);

  // 평균 마감 준수율 추이 (DB 연동)
  const [complianceData, setComplianceData] = useState([]);
  const [complianceMonthOverMonthChange, setComplianceMonthOverMonthChange] = useState(null);

  // 작품별 아티스트 분포 (DB 연동)
  const [artistDistributionData, setArtistDistributionData] = useState([]);
  const [maxArtistProjectNames, setMaxArtistProjectNames] = useState([]);

  useEffect(() => {
    const fetchComplianceAndDistribution = async () => {
      const agencyNo = user?.agencyNo;
      if (!agencyNo) return;

      try {
        const [trendRes, distRes] = await Promise.all([
          agencyService.getComplianceTrend(agencyNo),
          agencyService.getArtistDistribution(agencyNo),
        ]);

        const trend = trendRes?.trend ?? [];
        setComplianceData(trend.map((t) => ({ month: t.month, rate: t.rate ?? 0 })));
        setComplianceMonthOverMonthChange(trendRes?.monthOverMonthChange ?? null);

        const dist = distRes?.distribution ?? [];
        const mapped = dist.map((d) => ({ name: d.name ?? '-', artists: Number(d.artists) || 0 }));
        setArtistDistributionData(mapped);
        const namesFromApi = Array.isArray(distRes?.maxArtistProjectNames)
          ? distRes.maxArtistProjectNames
          : (distRes?.maxArtistProjectName ? [distRes.maxArtistProjectName] : []);
        if (namesFromApi.length > 0) {
          setMaxArtistProjectNames(namesFromApi);
        } else if (mapped.length > 0) {
          const maxArtists = Math.max(...mapped.map((d) => d.artists));
          setMaxArtistProjectNames(
            maxArtists > 0 ? mapped.filter((d) => d.artists === maxArtists).map((d) => d.name) : []
          );
        } else {
          setMaxArtistProjectNames([]);
        }
      } catch (err) {
        console.error('준수율 추이/아티스트 분포 조회 실패:', err);
        setComplianceData([]);
        setComplianceMonthOverMonthChange(null);
        setArtistDistributionData([]);
        setMaxArtistProjectNames([]);
      }
    };
    fetchComplianceAndDistribution();
  }, [user?.agencyNo]);

  // 금일 출석 현황 (DB 연동, 휴가/미출석 포함)
  const [attendanceData, setAttendanceData] = useState([
    { name: '출근', value: 0, color: '#00ACC1' },
    { name: '재택근무', value: 0, color: '#FF9800' },
    { name: '휴가', value: 0, color: '#757575' },
    { name: '워케이션', value: 0, color: '#9C27B0' },
    { name: '미출석', value: 0, color: '#EF4444' },
  ]);

  // 건강 인원 분포 - 정신/신체 분리 (DB 연동, 미검진 포함, 에이전시 관리자 제외)
  const [healthMentalData, setHealthMentalData] = useState([
    { name: '위험', value: 0, color: '#EF4444' },
    { name: '경고', value: 0, color: '#CA8A04' },
    { name: '주의', value: 0, color: '#FF9800' },
    { name: '정상', value: 0, color: '#10B981' },
    { name: '미검진', value: 0, color: '#94A3B8' },
  ]);
  const [healthPhysicalData, setHealthPhysicalData] = useState([
    { name: '위험', value: 0, color: '#EF4444' },
    { name: '경고', value: 0, color: '#CA8A04' },
    { name: '주의', value: 0, color: '#FF9800' },
    { name: '정상', value: 0, color: '#10B981' },
    { name: '미검진', value: 0, color: '#94A3B8' },
  ]);
  // 건강 인원 분포 탭: 'mental' | 'physical'
  const [healthTab, setHealthTab] = useState('mental');

  useEffect(() => {
    const fetchAttendanceAndHealth = async () => {
      const agencyNo = user?.agencyNo;
      if (!agencyNo) return;

      try {
        const [attRes, healthRes] = await Promise.all([
          agencyService.getAttendanceDistribution(agencyNo),
          agencyService.getHealthDistribution(agencyNo),
        ]);

        const attDist = attRes?.distribution ?? [];
        setAttendanceData(
          attDist.map((d) => ({ name: d.name ?? '-', value: d.value ?? 0, color: d.color ?? '#94a3b8' }))
        );

        const mapItem = (d) => ({ name: d.name ?? '-', value: d.value ?? 0, color: d.color ?? '#94a3b8' });
        const mentalDist = healthRes?.mentalDistribution ?? [];
        const physicalDist = healthRes?.physicalDistribution ?? [];
        setHealthMentalData(mentalDist.length > 0 ? mentalDist.map(mapItem) : [
          { name: '위험', value: 0, color: '#EF4444' },
          { name: '경고', value: 0, color: '#CA8A04' },
          { name: '주의', value: 0, color: '#FF9800' },
          { name: '정상', value: 0, color: '#10B981' },
          { name: '미검진', value: 0, color: '#94A3B8' },
        ]);
        setHealthPhysicalData(physicalDist.length > 0 ? physicalDist.map(mapItem) : [
          { name: '위험', value: 0, color: '#EF4444' },
          { name: '경고', value: 0, color: '#CA8A04' },
          { name: '주의', value: 0, color: '#FF9800' },
          { name: '정상', value: 0, color: '#10B981' },
          { name: '미검진', value: 0, color: '#94A3B8' },
        ]);
      } catch (err) {
        console.error('출석/건강 분포 조회 실패:', err);
      }
    };
    fetchAttendanceAndHealth();
  }, [user?.agencyNo]);

  return (
    <AgencyDashboardRoot>
      <AgencyDashboardBody>
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
                    <MetricChange $color={metric.changeColor ?? metric.color}>
                      {metric.change !== '-' && metric.change != null ? metric.change : '-'}
                    </MetricChange>
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
          <ChartCard>
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

            {complianceMonthOverMonthChange != null && (
              <ChartAlert
                $bgColor={complianceMonthOverMonthChange >= 0 ? '#F0FDF4' : '#FEF2F2'}
                $borderColor={complianceMonthOverMonthChange >= 0 ? '#86EFAC' : '#FECACA'}
              >
                <ChartAlertIcon>
                  {complianceMonthOverMonthChange >= 0 ? (
                    <TrendingUp className="w-4 h-4" style={{ color: '#10B981' }} />
                  ) : (
                    <TrendingDown className="w-4 h-4" style={{ color: '#EF4444' }} />
                  )}
                </ChartAlertIcon>
                <ChartAlertText $color={complianceMonthOverMonthChange >= 0 ? '#065F46' : '#991B1B'}>
                  {complianceMonthOverMonthChange >= 0
                    ? `전월 대비 ${Math.abs(complianceMonthOverMonthChange)}% 증가했습니다`
                    : `전월 대비 ${Math.abs(complianceMonthOverMonthChange)}% 감소했습니다`}
                </ChartAlertText>
              </ChartAlert>
            )}
          </ChartCard>

          {/* 작품별 아티스트 분포도 (막대 그래프) */}
          <ChartCard>
            <ChartCardHeader>
              <ChartCardIcon>
                <Users className="w-5 h-5" style={{ color: '#6E8FB3' }} />
              </ChartCardIcon>
              <ChartCardTitle>작품별 아티스트 분포도</ChartCardTitle>
            </ChartCardHeader>

            <ChartContainer>
              {artistDistributionData.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--muted-foreground)', fontSize: 14 }}>
                  배정된 작품이 없습니다. 작가를 프로젝트에 배정하면 여기에 표시됩니다.
                </div>
              ) : (
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
              )}
            </ChartContainer>

            {maxArtistProjectNames.length > 0 && (
              <ChartAlert $bgColor="#EFF6FF" $borderColor="#BFDBFE">
                <ChartAlertIcon>
                  <Users className="w-4 h-4" style={{ color: '#3B82F6' }} />
                </ChartAlertIcon>
                <ChartAlertText $color="#1E3A8A">
                  {maxArtistProjectNames.join(', ')}에 가장 많은 아티스트가 배정되어 있습니다
                </ChartAlertText>
              </ChartAlert>
            )}
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

            {attendanceData.some((item) => item.name === '미출석' && item.value > 0) && (
              <ChartAlert $bgColor="#FEF2F2" $borderColor="#FECACA">
                <ChartAlertIcon>
                  <AlertCircle className="w-4 h-4" style={{ color: '#DC2626' }} />
                </ChartAlertIcon>
                <ChartAlertText $color="#991B1B">
                  미출석 {attendanceData.find((d) => d.name === '미출석')?.value ?? 0}명 — 출석 확인이 필요합니다
                </ChartAlertText>
              </ChartAlert>
            )}
          </ChartCard>

          {/* 건강 인원 분포 (정신/신체 토글) */}
          <ChartCard>
            <ChartCardHeader>
              <ChartCardIcon>
                <Activity className="w-5 h-5" style={{ color: '#6E8FB3' }} />
              </ChartCardIcon>
              <ChartCardTitle>건강 인원 분포</ChartCardTitle>
              <HealthTabWrap>
                <HealthTabButton
                  type="button"
                  $active={healthTab === 'mental'}
                  onClick={() => setHealthTab('mental')}
                >
                  정신 건강
                </HealthTabButton>
                <HealthTabButton
                  type="button"
                  $active={healthTab === 'physical'}
                  onClick={() => setHealthTab('physical')}
                >
                  신체 건강
                </HealthTabButton>
              </HealthTabWrap>
            </ChartCardHeader>

            <PieChartSection>
              <PieChartContainer>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                    <Pie
                      data={healthTab === 'mental' ? healthMentalData : healthPhysicalData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      isAnimationActive={true}
                      animationDuration={200}
                    >
                      {(healthTab === 'mental' ? healthMentalData : healthPhysicalData).map((entry, index) => (
                        <Cell key={`health-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </PieChartContainer>

              <PieChartLegend>
                {(healthTab === 'mental' ? healthMentalData : healthPhysicalData).map((item, index) => (
                  <PieChartLegendItem key={index}>
                    <PieChartLegendDot style={{ backgroundColor: item.color }} />
                    <PieChartLegendLabel>{item.name}</PieChartLegendLabel>
                    <PieChartLegendValue>{item.value}명</PieChartLegendValue>
                  </PieChartLegendItem>
                ))}
              </PieChartLegend>
            </PieChartSection>

            <PieChartFooter>
              <PieChartFooterLabel>
                {healthTab === 'mental' ? '정신 건강' : '신체 건강'} · 전체 인원 (에이전시 관리자 제외)
              </PieChartFooterLabel>
              <PieChartFooterValue>
                {(healthTab === 'mental' ? healthMentalData : healthPhysicalData).reduce((sum, item) => sum + item.value, 0)}명
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
                    formatter={(value) => [`${value}개`, '업무']}
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
                  오늘 마감 예정 업무가 {deadlineData[0].count}개 있습니다
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
                {attendanceRequests.length >= 1 && (
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
                            {request.applicantName} · {request.startDate} ~ {request.endDate}
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

        {/* 신청 현황 모달 (담당자-작가 배정 모달과 동일한 Dialog + X 닫기) */}
        <Dialog open={showAttendanceModal} onOpenChange={setShowAttendanceModal}>
          <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col bg-white p-6">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
                신청 현황 목록
              </DialogTitle>
              <DialogDescription>
                에이전시 소속 근태 신청 목록입니다. 종료일이 지난 신청은 제외됩니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 overflow-y-auto min-h-0 flex-1 pr-1">
              {attendanceRequests.map((request) => {
                const statusColor =
                  request.status === REQUEST_STATUS.PENDING ? '#F59E0B' :
                  request.status === REQUEST_STATUS.APPROVED ? '#10B981' :
                  '#EF4444';
                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
                  >
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground m-0">
                        {request.applicantName}
                      </p>
                      <p className="text-base font-semibold text-foreground m-0">
                        {request.typeName}
                      </p>
                      <p className="text-sm text-foreground m-0">
                        {request.startDate} ~ {request.endDate}
                      </p>
                      <p className="text-xs text-muted-foreground m-0">
                        {request.status}
                      </p>
                    </div>
                    <div
                      className="flex-shrink-0 px-3 py-1 rounded-full text-white text-xs font-semibold"
                      style={{ backgroundColor: statusColor }}
                    >
                      {request.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

      </AgencyDashboardBody>
    </AgencyDashboardRoot>
  );
}
