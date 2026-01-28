import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ArrowLeft, Search, TrendingUp, AlertTriangle, Bell } from 'lucide-react';
import { toast } from 'sonner';
import {
  MonitoringDetailRoot,
  MonitoringDetailBody,
  HeaderSection,
  BackButton,
  HeaderTitle,
  StatisticsGrid,
  StatisticsCard,
  StatisticsLabel,
  StatisticsValue,
  StatisticsIcon,
  FilterCard,
  FilterSearchContainer,
  FilterSearchIcon,
  FilterButtonGroup,
  FilterButton,
  DataTableCard,
  TableWrapper,
  Table,
  TableHead,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  StatusBadge,
  EmptyState,
} from './MonitoringDetailPage.styled';

// TODO: Zustand store mapping - 검진 모니터링 데이터
const initialMonitoringData = [
  { id: 1, name: '송도동', mentalCount: 7, physicalCount: 2, status: '위험', lastCheckDate: '2026.01.18', team: '웹툰팀', position: '작가' },
  { id: 2, name: '박아시', mentalCount: 6, physicalCount: 3, status: '주의', lastCheckDate: '2026.01.17', team: '웹툰팀', position: '작가' },
  { id: 3, name: '이직가', mentalCount: 5, physicalCount: 0, status: '주의', lastCheckDate: '2026.01.16', team: '웹툰팀', position: '어시스턴트' },
  { id: 4, name: '최소연', mentalCount: 2, physicalCount: 7, status: '정상', lastCheckDate: '2026.01.15', team: '기획팀', position: '매니저' },
  { id: 5, name: '김작가', mentalCount: 9, physicalCount: 8, status: '정상', lastCheckDate: '2026.01.14', team: '웹툰팀', position: '작가' },
  { id: 6, name: '정원화', mentalCount: 8, physicalCount: 5, status: '주의', lastCheckDate: '2026.01.14', team: '웹툰팀', position: '작가' },
  { id: 7, name: '한민수', mentalCount: 3, physicalCount: 9, status: '정상', lastCheckDate: '2026.01.13', team: '기획팀', position: '담당자' },
  { id: 8, name: '윤서진', mentalCount: 10, physicalCount: 4, status: '위험', lastCheckDate: '2026.01.12', team: '웹툰팀', position: '작가' },
  { id: 9, name: '강태희', mentalCount: 4, physicalCount: 6, status: '정상', lastCheckDate: '2026.01.11', team: '웹툰팀', position: '어시스턴트' },
  { id: 10, name: '조민아', mentalCount: 7, physicalCount: 7, status: '주의', lastCheckDate: '2026.01.11', team: '기획팀', position: '매니저' },
  { id: 11, name: '서준혁', mentalCount: 11, physicalCount: 3, status: '위험', lastCheckDate: '2026.01.10', team: '웹툰팀', position: '작가' },
  { id: 12, name: '임유진', mentalCount: 5, physicalCount: 8, status: '정상', lastCheckDate: '2026.01.09', team: '웹툰팀', position: '어시스턴트' },
].sort((a, b) => new Date(b.lastCheckDate).getTime() - new Date(a.lastCheckDate).getTime());

const STATUS_FILTERS = ['전체', '위험', '주의', '정상'];

export function MonitoringDetailPage({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');
  const [monitoringData] = useState(initialMonitoringData);

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

  // 상태별 아이콘
  const getStatusIcon = (status) => {
    switch (status) {
      case '위험':
        return <AlertTriangle className="w-3 h-3" />;
      case '주의':
        return <TrendingUp className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // 필터링된 데이터
  const filteredData = monitoringData.filter((person) => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === '전체' || person.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // 알람 발송 핸들러
  const handleSendAlarm = (personName) => {
    toast.success(`${personName}님에게 검진 알림을 발송했습니다.`);
  };

  // 통계 계산
  const stats = {
    total: monitoringData.length,
    risk: monitoringData.filter(p => p.status === '위험').length,
    warning: monitoringData.filter(p => p.status === '주의').length,
    normal: monitoringData.filter(p => p.status === '정상').length,
  };

  return (
    <MonitoringDetailRoot>
      <MonitoringDetailBody>
        {/* 헤더 */}
        <HeaderSection>
          <div className="flex items-center gap-3">
            <BackButton
              variant="ghost"
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4" />
            </BackButton>
            <HeaderTitle>검진 모니터링</HeaderTitle>
          </div>
        </HeaderSection>

        {/* 통계 카드 */}
        <StatisticsGrid>
          <StatisticsCard $hasBorder={true}>
            <StatisticsLabel>전체 인원</StatisticsLabel>
            <StatisticsValue>{stats.total}명</StatisticsValue>
          </StatisticsCard>
          <StatisticsCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', width: '100%' }}>
              <StatisticsIcon $color="red">
                <AlertTriangle className="w-3 h-3" />
              </StatisticsIcon>
              <StatisticsLabel $color="red" style={{ marginBottom: 0 }}>위험</StatisticsLabel>
            </div>
            <StatisticsValue $color="red">{stats.risk}명</StatisticsValue>
          </StatisticsCard>
          <StatisticsCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', width: '100%' }}>
              <StatisticsIcon $color="orange">
                <TrendingUp className="w-3 h-3" />
              </StatisticsIcon>
              <StatisticsLabel $color="orange" style={{ marginBottom: 0 }}>주의</StatisticsLabel>
            </div>
            <StatisticsValue $color="orange">{stats.warning}명</StatisticsValue>
          </StatisticsCard>
          <StatisticsCard>
            <StatisticsLabel $color="green">정상</StatisticsLabel>
            <StatisticsValue $color="green">{stats.normal}명</StatisticsValue>
          </StatisticsCard>
        </StatisticsGrid>

        {/* 필터 및 검색 */}
        <FilterCard>
          <div className="flex items-center gap-3">
            <FilterSearchContainer>
              <FilterSearchIcon>
                <Search className="w-4 h-4 text-[#6E8FB3]" />
              </FilterSearchIcon>
              <Input
                type="text"
                placeholder="이름으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 text-sm"
              />
            </FilterSearchContainer>
            <FilterButtonGroup>
              {STATUS_FILTERS.map((status) => (
                <FilterButton
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </FilterButton>
              ))}
            </FilterButtonGroup>
          </div>
        </FilterCard>

        {/* 목록 테이블 */}
        <DataTableCard>
          <TableWrapper>
            <Table>
              <TableHead>
                <TableHeaderRow>
                  <TableHeaderCell>이름</TableHeaderCell>
                  <TableHeaderCell>직책</TableHeaderCell>
                  <TableHeaderCell $align="center">상태</TableHeaderCell>
                  <TableHeaderCell $align="right">최근 검사일</TableHeaderCell>
                </TableHeaderRow>
              </TableHead>
              <TableBody>
                {filteredData.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell $fontWeight="medium">{person.name}</TableCell>
                    <TableCell>{person.position}</TableCell>
                    <TableCell $align="center">
                      <StatusBadge className={getStatusBadgeClass(person.status)}>
                        {getStatusIcon(person.status)}
                        {person.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell $align="right">{person.lastCheckDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>

          {filteredData.length === 0 && (
            <EmptyState>
              <p className="text-sm text-[#6E8FB3]">검색 결과가 없습니다.</p>
            </EmptyState>
          )}
        </DataTableCard>
      </MonitoringDetailBody>
    </MonitoringDetailRoot>
  );
}
