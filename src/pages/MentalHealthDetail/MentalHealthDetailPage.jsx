import { ArrowLeft, Search } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useState } from 'react';
import {
  MentalHealthDetailRoot,
  MentalHealthDetailBody,
  HeaderSection,
  BackButton,
  HeaderTitle,
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
} from './MentalHealthDetailPage.styled';

// TODO: Zustand store mapping - 정신 건강 검사 데이터
const riskData = [
  { name: '정상', value: 4, color: '#52C41A' },
  { name: '주의', value: 3, color: '#FA8C16' },
  { name: '위험', value: 2, color: '#FF4D4F' },
];

const initialParticipants = [
  { name: '송도동', dept: '개발팀', status: '완료', statusColor: 'bg-green-50 text-green-700', score: 85, risk: '위험', riskColor: 'bg-red-50 text-red-700', date: '2026.01.18' },
  { name: '강호배', dept: '영업팀', status: '대기', statusColor: 'bg-orange-50 text-orange-700', score: '-', risk: '-', riskColor: '', date: '-' },
  { name: '이수민', dept: '기획팀', status: '완료', statusColor: 'bg-green-50 text-green-700', score: 92, risk: '정상', riskColor: 'bg-green-50 text-green-700', date: '2026.01.19' },
  { name: '박지훈', dept: '디자인팀', status: '완료', statusColor: 'bg-green-50 text-green-700', score: 78, risk: '주의', riskColor: 'bg-orange-50 text-orange-700', date: '2026.01.17' },
  { name: '최은영', dept: '마케팅팀', status: '진행중', statusColor: 'bg-blue-50 text-blue-700', score: '-', risk: '-', riskColor: '', date: '-' },
  { name: '김태양', dept: '개발팀', status: '완료', statusColor: 'bg-green-50 text-green-700', score: 88, risk: '주의', riskColor: 'bg-orange-50 text-orange-700', date: '2026.01.20' },
  { name: '정민서', dept: '인사팀', status: '완료', statusColor: 'bg-green-50 text-green-700', score: 95, risk: '정상', riskColor: 'bg-green-50 text-green-700', date: '2026.01.18' },
];

const STATUS_FILTERS = ['전체', '완료', '진행중', '대기'];

export function MentalHealthDetailPage({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');

  const filteredParticipants = initialParticipants
    .filter((participant) => {
      const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === '전체' || participant.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // 점수 내림차순 정렬 (점수가 높은 순)
      const scoreA = typeof a.score === 'number' ? a.score : -1;
      const scoreB = typeof b.score === 'number' ? b.score : -1;
      return scoreB - scoreA;
    });

  const progressRate = 56;
  const completedCount = 5;
  const totalCount = 9;
  const deadlineDate = '2026.01.25';
  const daysUntilDeadline = 7;

  return (
    <MentalHealthDetailRoot>
      <MentalHealthDetailBody>
        {/* Header */}
        <HeaderSection>
          <div className="flex items-center gap-4">
            <BackButton onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#333333]" />
            </BackButton>
            <HeaderTitle>정신 건강 심층 검사 상세 현황</HeaderTitle>
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
              <ProgressFill $width={progressRate} />
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
      </MentalHealthDetailBody>
    </MentalHealthDetailRoot>
  );
}
