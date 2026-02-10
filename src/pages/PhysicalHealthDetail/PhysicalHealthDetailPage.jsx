import { ArrowLeft, Search } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import { agencyService, managerService } from '@/api/services';
import {
  PhysicalHealthDetailRoot,
  PhysicalHealthDetailBody,
  HeaderSection,
  BackButton,
  HeaderTitle,
  HeaderSubtitle,
  FilterSelect,
  SummaryGrid,
  SummaryCard,
  SummaryLabel,
  SummaryValue,
  ProgressBar,
  ProgressFill,
  ProgressText,
  DeadlineBadge,
  RiskChartCard,
  RiskChartContainer,
  RiskLegend,
  RiskLegendItem,
  RiskLegendColor,
  RiskLegendLabel,
  RiskLegendValue,
  DataTableCard,
  TableHeader,
  TableTitle,
  SearchContainer,
  SearchIcon,
  TableWrapper,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  StatusBadge,
  RiskBadge,
} from './PhysicalHealthDetailPage.styled';

const RISK_COLORS = {
  정상: '#52C41A',
  주의: '#FA8C16',
  위험: '#FF4D4F',
  경고: '#CA8A04',
  미검진: '#94A3B8',
};

const STATUS_FILTERS = ['전체', '완료', '대기'];

export function PhysicalHealthDetailPage({ onBack, agencyNo: agencyNoProp }) {
  const user = useAuthStore((s) => s.user);
  const agencyNo = agencyNoProp ?? user?.agencyNo;
  const isManager = user?.memberRole === '담당자';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [progressRate, setProgressRate] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [deadlineDate, setDeadlineDate] = useState('-');
  const [daysUntilDeadline, setDaysUntilDeadline] = useState(0);
  const [riskData, setRiskData] = useState([]);

  useEffect(() => {
    if (!isManager && !agencyNo) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const [detailRes, scheduleRes] = await Promise.all([
          isManager
            ? managerService.getHealthMonitoringDetail('physical')
            : agencyService.getHealthMonitoringDetail(agencyNo, 'physical'),
          isManager
            ? managerService.getHealthSchedule()
            : agencyService.getAgencyHealthSchedule(agencyNo),
        ]);
        const items = detailRes?.items ?? [];
        const total = items.length;
        const completed = items.filter((i) => i.status !== '미검진').length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        setTotalCount(total);
        setCompletedCount(completed);
        setProgressRate(rate);
        setDeadlineDate(scheduleRes?.nextCheckupDate ?? '-');
        setDaysUntilDeadline(scheduleRes?.daysUntil ?? 0);

        const list = items.map((i) => {
          const progressStatus = i.status === '미검진' ? '대기' : '완료';
          const statusColor = progressStatus === '완료' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700';
          const riskColor =
            i.status === '정상'
              ? 'bg-green-50 text-green-700'
              : i.status === '주의' || i.status === '경고'
                ? 'bg-orange-50 text-orange-700'
                : i.status === '위험'
                  ? 'bg-red-50 text-red-700'
                  : '';
          return {
            memberNo: i.memberNo,
            name: i.memberName ?? '-',
            dept: i.position ?? '-',
            status: progressStatus,
            statusColor,
            score: i.totalScore ?? '-',
            risk: i.status === '미검진' ? '-' : i.status,
            riskColor,
            date: i.lastCheckDate ? i.lastCheckDate.replace(/-/g, '.') : '-',
          };
        });
        setParticipants(list);

        const riskOrder = ['위험', '경고', '주의', '정상', '미검진'];
        const counts = {};
        riskOrder.forEach((r) => (counts[r] = 0));
        items.forEach((i) => {
          const s = i.status || '미검진';
          counts[s] = (counts[s] || 0) + 1;
        });
        setRiskData(
          riskOrder.filter((name) => counts[name] > 0).map((name) => ({ name, value: counts[name], color: RISK_COLORS[name] || '#94A3B8' }))
        );
      } catch (err) {
        console.error('신체 건강 검사 상세 조회 실패:', err);
        toast.error('데이터를 불러오는데 실패했습니다.');
        setParticipants([]);
        setRiskData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [agencyNo, isManager]);

  const filteredParticipants = participants
    .filter((p) => {
      const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === '전체' || p.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const scoreA = typeof a.score === 'number' ? a.score : -1;
      const scoreB = typeof b.score === 'number' ? b.score : -1;
      return scoreB - scoreA;
    });

  if (loading) {
    return (
      <PhysicalHealthDetailRoot>
        <PhysicalHealthDetailBody>
          <div className="flex items-center justify-center py-24 text-muted-foreground">로딩 중...</div>
        </PhysicalHealthDetailBody>
      </PhysicalHealthDetailRoot>
    );
  }

  return (
    <PhysicalHealthDetailRoot>
      <PhysicalHealthDetailBody>
        {/* Header */}
        <HeaderSection>
          <div className="flex items-center gap-4">
            <BackButton onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#333333]" />
            </BackButton>
            <div>
              <HeaderTitle>신체 건강 심층 검사 상세 현황</HeaderTitle>
              <HeaderSubtitle>2026년 1분기 정기 검사 진행 중</HeaderSubtitle>
            </div>
          </div>
          <FilterSelect
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {STATUS_FILTERS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </FilterSelect>
        </HeaderSection>

        {/* Top Summary Cards */}
        <SummaryGrid>
          {/* Progress Card */}
          <SummaryCard>
            <SummaryLabel>총 진행률</SummaryLabel>
            <SummaryValue>{progressRate}%</SummaryValue>
            <ProgressBar>
              <ProgressFill $width={progressRate} $color="blue" />
            </ProgressBar>
            <ProgressText>완료 {completedCount} / 전체 {totalCount}</ProgressText>
          </SummaryCard>

          {/* Schedule Card */}
          <SummaryCard>
            <SummaryLabel>검사 일정</SummaryLabel>
            <SummaryValue>{deadlineDate}</SummaryValue>
            <DeadlineBadge>마감 D-{daysUntilDeadline}</DeadlineBadge>
          </SummaryCard>

          {/* Risk Chart Card */}
          <RiskChartCard>
            <SummaryLabel>위험군 분포</SummaryLabel>
            <div className="flex items-center gap-4">
              <RiskChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </RiskChartContainer>
              <RiskLegend>
                {riskData.map((item) => (
                  <RiskLegendItem key={item.name}>
                    <RiskLegendColor $color={item.color} />
                    <RiskLegendLabel>{item.name}</RiskLegendLabel>
                    <RiskLegendValue>{item.value}명</RiskLegendValue>
                  </RiskLegendItem>
                ))}
              </RiskLegend>
            </div>
          </RiskChartCard>
        </SummaryGrid>

        {/* Main Data Table */}
        <DataTableCard>
          <TableHeader>
            <TableTitle>대상자 목록</TableTitle>
            <SearchContainer>
              <SearchIcon>
                <Search className="w-4 h-4 text-[#666666]" />
              </SearchIcon>
              <Input 
                placeholder="이름 검색" 
                className="pl-10 rounded-lg border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
          </TableHeader>

          <TableWrapper>
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>이름</TableHeaderCell>
                  <TableHeaderCell>부서</TableHeaderCell>
                  <TableHeaderCell>상태</TableHeaderCell>
                  <TableHeaderCell>점수</TableHeaderCell>
                  <TableHeaderCell>위험도</TableHeaderCell>
                  <TableHeaderCell>검사일</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {filteredParticipants.map((person, index) => (
                  <TableRow key={index}>
                    <TableCell $fontWeight="medium">{person.name}</TableCell>
                    <TableCell>{person.dept}</TableCell>
                    <TableCell>
                      <StatusBadge className={person.statusColor}>
                        {person.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell $fontWeight="medium">{person.score}</TableCell>
                    <TableCell>
                      {person.risk !== '-' ? (
                        <RiskBadge className={person.riskColor}>
                          {person.risk}
                        </RiskBadge>
                      ) : (
                        <span className="text-sm text-[#666666]">-</span>
                      )}
                    </TableCell>
                    <TableCell>{person.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </DataTableCard>
      </PhysicalHealthDetailBody>
    </PhysicalHealthDetailRoot>
  );
}
