import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ArrowLeft, Search, TrendingUp, AlertTriangle, Bell } from 'lucide-react';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import { agencyService } from '@/api/services';
import {
  MonitoringDetailRoot,
  MonitoringDetailBody,
  HeaderSection,
  BackButton,
  HeaderTitle,
  DetailTabWrap,
  DetailTabButton,
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

const STATUS_FILTERS = ['전체', '위험', '경고', '주의', '정상', '미검진'];

export function MonitoringDetailPage({ onBack, initialTab = 'mental' }) {
  const { user } = useAuthStore();
  const agencyNo = user?.agencyNo;

  const [detailTab, setDetailTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');
  const [monitoringData, setMonitoringData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agencyNo) {
      setMonitoringData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    agencyService
      .getHealthMonitoringDetail(agencyNo, detailTab)
      .then((res) => {
        setMonitoringData(res?.items ?? []);
      })
      .catch(() => setMonitoringData([]))
      .finally(() => setLoading(false));
  }, [agencyNo, detailTab]);

  // 상태별 배지 색상
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case '위험':
        return 'bg-red-100 text-red-600';
      case '경고':
        return 'bg-amber-100 text-amber-700';
      case '주의':
        return 'bg-orange-100 text-orange-600';
      case '정상':
        return 'bg-green-100 text-green-600';
      case '미검진':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // 상태별 아이콘
  const getStatusIcon = (status) => {
    switch (status) {
      case '위험':
        return <AlertTriangle className="w-3 h-3" />;
      case '경고':
      case '주의':
        return <TrendingUp className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // 필터링된 데이터 (API 항목: memberName, position, totalScore, status, lastCheckDate)
  const filteredData = monitoringData.filter((person) => {
    const name = person.memberName ?? '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === '전체' || person.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // 통계 계산 (현재 탭 데이터 기준)
  const stats = {
    total: monitoringData.length,
    risk: monitoringData.filter((p) => p.status === '위험').length,
    warning: monitoringData.filter((p) => p.status === '경고').length,
    caution: monitoringData.filter((p) => p.status === '주의').length,
    normal: monitoringData.filter((p) => p.status === '정상').length,
    unscreened: monitoringData.filter((p) => p.status === '미검진').length,
  };

  return (
    <MonitoringDetailRoot>
      <MonitoringDetailBody>
        {/* 헤더 + 정신/신체 토글 */}
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
            <DetailTabWrap>
              <DetailTabButton
                type="button"
                $active={detailTab === 'mental'}
                onClick={() => setDetailTab('mental')}
              >
                정신 건강
              </DetailTabButton>
              <DetailTabButton
                type="button"
                $active={detailTab === 'physical'}
                onClick={() => setDetailTab('physical')}
              >
                신체 건강
              </DetailTabButton>
            </DetailTabWrap>
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
              <StatisticsLabel $color="orange" style={{ marginBottom: 0 }}>경고·주의</StatisticsLabel>
            </div>
            <StatisticsValue $color="orange">{stats.warning + stats.caution}명</StatisticsValue>
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
                  $variant={filterStatus === status ? 'default' : 'outline'}
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
          {loading ? (
            <EmptyState>
              <p className="text-sm text-[#6E8FB3]">불러오는 중...</p>
            </EmptyState>
          ) : (
            <>
              <TableWrapper>
                <Table>
                  <TableHead>
                    <TableHeaderRow>
                      <TableHeaderCell>이름</TableHeaderCell>
                      <TableHeaderCell>직책</TableHeaderCell>
                      <TableHeaderCell $align="center">점수</TableHeaderCell>
                      <TableHeaderCell $align="center">상태</TableHeaderCell>
                      <TableHeaderCell $align="right">최근 검사일</TableHeaderCell>
                    </TableHeaderRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((person) => (
                      <TableRow key={person.memberNo}>
                        <TableCell $fontWeight="medium">{person.memberName ?? '-'}</TableCell>
                        <TableCell>{person.position ?? '-'}</TableCell>
                        <TableCell $align="center">
                          {person.totalScore != null ? person.totalScore : '미검진'}
                        </TableCell>
                        <TableCell $align="center">
                          <StatusBadge className={getStatusBadgeClass(person.status)}>
                            {getStatusIcon(person.status)}
                            {person.status}
                          </StatusBadge>
                        </TableCell>
                        <TableCell $align="right">{person.lastCheckDate ?? '-'}</TableCell>
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
            </>
          )}
        </DataTableCard>
      </MonitoringDetailBody>
    </MonitoringDetailRoot>
  );
}
