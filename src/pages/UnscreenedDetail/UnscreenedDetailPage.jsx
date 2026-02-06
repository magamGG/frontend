import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ArrowLeft, Search, Calendar, Clock, Bell } from 'lucide-react';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import { agencyService, managerService } from '@/api/services';
import {
  UnscreenedDetailRoot,
  UnscreenedDetailBody,
  HeaderSection,
  BackButton,
  HeaderTitle,
  BulkAlarmButton,
  StatisticsGrid,
  StatisticsCard,
  StatisticsLabel,
  StatisticsValue,
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
  TypeBadge,
  DelayBadge,
  AlarmButton,
  EmptyState,
} from './UnscreenedDetailPage.styled';

const FILTER_TYPES = ['전체', '정신', '신체', '둘 다'];

function getStatusLabel(status) {
  if (status === 'BOTH') return '전체';
  if (status === 'MENTAL_ONLY') return '정신';
  if (status === 'PHYSICAL_ONLY') return '신체';
  return status || '-';
}

export function UnscreenedDetailPage({ onBack, managerMode = false }) {
  const { user } = useAuthStore();
  const agencyNo = user?.agencyNo;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('전체');
  const [unscreenedData, setUnscreenedData] = useState([]);
  const [nextCheckupDate, setNextCheckupDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (managerMode) {
      setLoading(true);
      managerService
        .getUnscreenedList()
        .then((res) => {
          setUnscreenedData(res?.items ?? []);
          setNextCheckupDate(res?.nextCheckupDate ?? null);
        })
        .catch(() => setUnscreenedData([]))
        .finally(() => setLoading(false));
      return;
    }
    if (!agencyNo) {
      setUnscreenedData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    agencyService
      .getAgencyUnscreenedList(agencyNo)
      .then((res) => {
        setUnscreenedData(res?.items ?? []);
        setNextCheckupDate(res?.nextCheckupDate ?? null);
      })
      .catch(() => setUnscreenedData([]))
      .finally(() => setLoading(false));
  }, [agencyNo, managerMode]);

  // 유형별 배지 색상 (status: BOTH | MENTAL_ONLY | PHYSICAL_ONLY)
  const getTypeBadgeStyle = (status) => {
    switch (status) {
      case 'BOTH':
        return { backgroundColor: '#FEE2E2', color: '#DC2626' };
      case 'MENTAL_ONLY':
        return { backgroundColor: '#F3E5F5', color: '#9333EA' };
      case 'PHYSICAL_ONLY':
        return { backgroundColor: '#DBEAFE', color: '#2563EB' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  // 마지막 검사일 (정신/신체 중 더 최근)
  const getLastCheckDate = (person) => {
    const m = person.lastMentalCheckDate;
    const p = person.lastPhysicalCheckDate;
    if (!m && !p) return '-';
    if (!m) return p;
    if (!p) return m;
    return m >= p ? m : p;
  };

  // 지연 일수 (백엔드에서 health_survey 생성일·cycle·period 기준으로 계산된 값 사용)
  const getDaysOverdue = (person) => {
    if (person?.daysOverdue != null) return person.daysOverdue;
    return null;
  };

  // 필터링된 데이터
  const filteredData = unscreenedData
    .filter((person) => {
      const name = person.memberName ?? '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesType = true;
      if (filterType === '정신') matchesType = person.status === 'MENTAL_ONLY';
      else if (filterType === '신체') matchesType = person.status === 'PHYSICAL_ONLY';
      else if (filterType === '둘 다') matchesType = person.status === 'BOTH';
      return matchesSearch && matchesType;
    })
    .sort((a, b) => (getDaysOverdue(b) ?? 0) - (getDaysOverdue(a) ?? 0));

  // 알람 발송 핸들러 (해당 회원 member_no로 NOTIFICATION 저장)
  const handleSendAlarm = (person) => {
    if (!agencyNo || !person?.memberNo) return;
    agencyService
      .sendUnscreenedNotification(agencyNo, person.memberNo)
      .then(() => {
        toast.success(`${person.memberName ?? '해당 인원'}님에게 검진 알림을 발송했습니다.`);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message ?? '알림 발송에 실패했습니다.');
      });
  };

  // 7일 이상 지연 인원 일괄 알람 발송
  const handleSendBulkAlarm = () => {
    const overdueCount = unscreenedData.filter((p) => (getDaysOverdue(p) ?? 0) >= 7).length;
    if (overdueCount === 0) {
      toast.info('7일 이상 지연된 인원이 없습니다.');
      return;
    }
    if (!agencyNo) return;
    agencyService
      .sendUnscreenedBulkNotification(agencyNo)
      .then(() => {
        toast.success(`${overdueCount}명에게 검진 알림을 일괄 발송했습니다.`);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message ?? '일괄 알림 발송에 실패했습니다.');
      });
  };

  // 통계 (정신 미검진 = MENTAL_ONLY + BOTH, 신체 미검진 = PHYSICAL_ONLY + BOTH)
  const stats = {
    total: unscreenedData.length,
    mental: unscreenedData.filter((p) => p.status === 'MENTAL_ONLY' || p.status === 'BOTH').length,
    physical: unscreenedData.filter((p) => p.status === 'PHYSICAL_ONLY' || p.status === 'BOTH').length,
  };

  return (
    <UnscreenedDetailRoot>
      <UnscreenedDetailBody>
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
            <HeaderTitle>미검진 인원</HeaderTitle>
          </div>
          <BulkAlarmButton onClick={handleSendBulkAlarm}>
            <Bell className="w-4 h-4" />
            7일 이상 지연 인원 알람 일괄 전송
          </BulkAlarmButton>
        </HeaderSection>

        {/* 통계 카드 */}
        <StatisticsGrid>
          <StatisticsCard>
            <StatisticsLabel>전체 미검진</StatisticsLabel>
            <StatisticsValue $color="red">{stats.total}명</StatisticsValue>
          </StatisticsCard>
          <StatisticsCard>
            <StatisticsLabel>정신 미검진</StatisticsLabel>
            <StatisticsValue $color="purple">{stats.mental}명</StatisticsValue>
          </StatisticsCard>
          <StatisticsCard>
            <StatisticsLabel>신체 미검진</StatisticsLabel>
            <StatisticsValue $color="blue">{stats.physical}명</StatisticsValue>
          </StatisticsCard>
        </StatisticsGrid>

        {/* 필터 및 검색 */}
        <FilterCard>
          <div className="flex items-center gap-3">
            <FilterSearchContainer>
              <FilterSearchIcon>
                <Search className="w-4 h-4" style={{ color: '#5a6067' }} />
              </FilterSearchIcon>
              <Input
                type="text"
                placeholder="이름으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 text-sm"
                style={{ backgroundColor: '#e8eaed' }}
              />
            </FilterSearchContainer>
            <FilterButtonGroup>
              {FILTER_TYPES.map((type) => (
                <FilterButton
                  key={type}
                  $variant={filterType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </FilterButton>
              ))}
            </FilterButtonGroup>
          </div>
        </FilterCard>

        {/* 목록 테이블 */}
        <DataTableCard>
          {loading ? (
            <EmptyState>
              <p className="text-sm" style={{ color: 'var(--accent)' }}>불러오는 중...</p>
            </EmptyState>
          ) : (
            <>
              <TableWrapper>
                <Table>
                  <TableHead>
                    <TableHeaderRow>
                      <TableHeaderCell>이름</TableHeaderCell>
                      <TableHeaderCell>직책</TableHeaderCell>
                      <TableHeaderCell $align="center">미검진 유형</TableHeaderCell>
                      <TableHeaderCell $align="center">검진 만료일</TableHeaderCell>
                      <TableHeaderCell $align="center">지연 일수</TableHeaderCell>
                      <TableHeaderCell $align="right">마지막 검사일</TableHeaderCell>
                      <TableHeaderCell $align="right"></TableHeaderCell>
                    </TableHeaderRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((person) => {
                      const daysOverdue = getDaysOverdue(person);
                      return (
                        <TableRow key={person.memberNo}>
                          <TableCell $fontWeight="medium">{person.memberName ?? '-'}</TableCell>
                          <TableCell>{person.position ?? '-'}</TableCell>
                          <TableCell $align="center">
                            <TypeBadge style={getTypeBadgeStyle(person.status)}>
                              {getStatusLabel(person.status)}
                            </TypeBadge>
                          </TableCell>
                          <TableCell $align="center">
                            <div className="flex items-center justify-center gap-1 text-sm" style={{ color: '#1f2328' }}>
                              <Calendar className="w-3.5 h-3.5" style={{ color: '#5a6067' }} />
                              {nextCheckupDate ?? '-'}
                            </div>
                          </TableCell>
                          <TableCell $align="center">
                            <DelayBadge>{daysOverdue != null && daysOverdue > 0 ? `${daysOverdue}일 지연` : '-'}</DelayBadge>
                          </TableCell>
                          <TableCell $align="right">
                            <div className="flex items-center justify-end gap-1 text-sm" style={{ color: '#1f2328' }}>
                              <Clock className="w-3.5 h-3.5" style={{ color: '#5a6067' }} />
                              {getLastCheckDate(person)}
                            </div>
                          </TableCell>
                          <TableCell $align="right">
                            <AlarmButton
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendAlarm(person);
                              }}
                            >
                              <Bell className="w-3.5 h-3.5" />
                              <span className="text-xs">알람 전송</span>
                            </AlarmButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableWrapper>

              {filteredData.length === 0 && (
                <EmptyState>
                  <p className="text-sm" style={{ color: 'var(--accent)' }}>검색 결과가 없습니다.</p>
                </EmptyState>
              )}
            </>
          )}
        </DataTableCard>
      </UnscreenedDetailBody>
    </UnscreenedDetailRoot>
  );
}
