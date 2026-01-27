import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ArrowLeft, Search, Calendar, Clock, Bell } from 'lucide-react';
import { toast } from 'sonner';
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

// TODO: Zustand store mapping - 미검진 인원 데이터
const initialUnscreenedData = [
  { id: 1, name: '송도동', date: '2026.01.12', missedType: '정신건강', lastCheckDate: '2025.12.15', team: '웹툰팀', position: '작가', daysOverdue: 7 },
  { id: 2, name: '박아시', date: '2026.01.11', missedType: '신체건강', lastCheckDate: '2025.12.20', team: '웹툰팀', position: '작가', daysOverdue: 5 },
  { id: 3, name: '이직가', date: '2026.01.10', missedType: '둘 다', lastCheckDate: '2025.12.10', team: '웹툰팀', position: '어시스턴트', daysOverdue: 9 },
  { id: 4, name: '최소연', date: '2026.01.13', missedType: '정신건강', lastCheckDate: '2025.12.18', team: '기획팀', position: '매니저', daysOverdue: 6 },
  { id: 5, name: '김작가', date: '2026.01.14', missedType: '신체건강', lastCheckDate: '2025.12.25', team: '웹툰팀', position: '작가', daysOverdue: 4 },
  { id: 6, name: '정원화', date: '2026.01.09', missedType: '둘 다', lastCheckDate: '2025.12.05', team: '웹툰팀', position: '작가', daysOverdue: 14 },
  { id: 7, name: '한민수', date: '2026.01.15', missedType: '정신건강', lastCheckDate: '2025.12.28', team: '기획팀', position: '담당자', daysOverdue: 3 },
  { id: 8, name: '윤서진', date: '2026.01.08', missedType: '신체건강', lastCheckDate: '2025.12.12', team: '웹툰팀', position: '작가', daysOverdue: 11 },
  { id: 9, name: '강태희', date: '2026.01.16', missedType: '둘 다', lastCheckDate: '2025.12.30', team: '웹툰팀', position: '어시스턴트', daysOverdue: 2 },
  { id: 10, name: '조민아', date: '2026.01.07', missedType: '정신건강', lastCheckDate: '2025.12.08', team: '기획팀', position: '매니저', daysOverdue: 12 },
];

const FILTER_TYPES = ['전체', '정신건강', '신체건강', '둘 다'];

export function UnscreenedDetailPage({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('전체');
  const [unscreenedData] = useState(initialUnscreenedData);

  // 유형별 배지 색상
  const getTypeBadgeClass = (type) => {
    switch (type) {
      case '둘 다':
        return 'bg-red-100 text-red-600';
      case '정신건강':
        return 'bg-purple-100 text-purple-600';
      case '신체건강':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // 유형 표시 텍스트
  const getTypeDisplayText = (type) => {
    return type === '둘 다' ? '전체' : type;
  };

  // 필터링된 데이터 (지연 일수 내림차순 정렬)
  const filteredData = unscreenedData
    .filter((person) => {
      const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === '전체' || person.missedType === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => b.daysOverdue - a.daysOverdue);

  // 알람 발송 핸들러
  const handleSendAlarm = (personName) => {
    toast.success(`${personName}님에게 검진 알림을 발송했습니다.`);
  };

  // 7일 이상 지연 인원 일괄 알람 발송
  const handleSendBulkAlarm = () => {
    const overduePersons = unscreenedData.filter(p => p.daysOverdue >= 7);
    if (overduePersons.length === 0) {
      toast.info('7일 이상 지연된 인원이 없습니다.');
      return;
    }
    toast.success(`${overduePersons.length}명에게 검진 알림을 일괄 발송했습니다.`);
  };

  // 통계 계산
  const stats = {
    total: unscreenedData.length,
    both: unscreenedData.filter(p => p.missedType === '둘 다').length,
    mental: unscreenedData.filter(p => p.missedType === '정신건강').length,
    physical: unscreenedData.filter(p => p.missedType === '신체건강').length,
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
            <StatisticsLabel $color="red">전체</StatisticsLabel>
            <StatisticsValue $color="red">{stats.both}명</StatisticsValue>
          </StatisticsCard>
          <StatisticsCard>
            <StatisticsLabel $color="purple">정신건강</StatisticsLabel>
            <StatisticsValue $color="purple">{stats.mental}명</StatisticsValue>
          </StatisticsCard>
          <StatisticsCard>
            <StatisticsLabel $color="blue">신체건강</StatisticsLabel>
            <StatisticsValue $color="blue">{stats.physical}명</StatisticsValue>
          </StatisticsCard>
        </StatisticsGrid>

        {/* 필터 및 검색 */}
        <FilterCard>
          <div className="flex items-center gap-3">
            <FilterSearchContainer>
              <FilterSearchIcon>
                <Search className="w-4 h-4" style={{ color: 'var(--accent)' }} />
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
              {FILTER_TYPES.map((type) => (
                <FilterButton
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
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
          <TableWrapper>
            <Table>
              <TableHead>
                <TableHeaderRow>
                  <TableHeaderCell>이름</TableHeaderCell>
                  <TableHeaderCell $align="center">미검진 유형</TableHeaderCell>
                  <TableHeaderCell $align="center">미검진 날짜</TableHeaderCell>
                  <TableHeaderCell $align="center">지연 일수</TableHeaderCell>
                  <TableHeaderCell $align="right">마지막 검사일</TableHeaderCell>
                  <TableHeaderCell $align="right"></TableHeaderCell>
                </TableHeaderRow>
              </TableHead>
              <TableBody>
                {filteredData.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell $fontWeight="medium">{person.name}</TableCell>
                    <TableCell $align="center">
                      <TypeBadge className={getTypeBadgeClass(person.missedType)}>
                        {getTypeDisplayText(person.missedType)}
                      </TypeBadge>
                    </TableCell>
                    <TableCell $align="center">
                      <div className="flex items-center justify-center gap-1 text-sm" style={{ color: 'var(--foreground)' }}>
                        <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                        {person.date}
                      </div>
                    </TableCell>
                    <TableCell $align="center">
                      <DelayBadge>{person.daysOverdue}일 지연</DelayBadge>
                    </TableCell>
                    <TableCell $align="right">
                      <div className="flex items-center justify-end gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {person.lastCheckDate}
                      </div>
                    </TableCell>
                    <TableCell $align="right">
                      <AlarmButton
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendAlarm(person.name);
                        }}
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span className="text-xs">알람 전송</span>
                      </AlarmButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>

          {filteredData.length === 0 && (
            <EmptyState>
              <p className="text-sm" style={{ color: 'var(--accent)' }}>검색 결과가 없습니다.</p>
            </EmptyState>
          )}
        </DataTableCard>
      </UnscreenedDetailBody>
    </UnscreenedDetailRoot>
  );
}
