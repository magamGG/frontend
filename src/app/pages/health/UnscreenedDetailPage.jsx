import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ArrowLeft, Search, Calendar, Clock, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface UnscreenedPerson {
  id: number;
  name: string;
  date: string;
  missedType: '정신건강' | '신체건강' | '둘 다';
  lastCheckDate: string;
  team: string;
  position: string;
  daysOverdue: number;
}

interface UnscreenedDetailPageProps {
  onBack: () => void;
}

export function UnscreenedDetailPage({ onBack }: UnscreenedDetailPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'전체' | '정신건강' | '신체건강' | '둘 다'>('전체');

  // 미검진 인원 전체 데이터
  const [unscreenedData] = useState<UnscreenedPerson[]>([
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
  ]);

  // 유형별 배지 색상
  const getTypeBadgeClass = (type: string) => {
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
  const getTypeDisplayText = (type: string) => {
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
  const handleSendAlarm = (personName: string) => {
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
    <div className="h-full overflow-y-auto bg-[#FAFAFA] p-6">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-[#1F2328]">미검진 인원</h1>
          </div>
          <Button
            size="sm"
            onClick={handleSendBulkAlarm}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            7일 이상 지연 인원 알람 일괄 전송
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-white border-none shadow-sm">
            <div className="text-xs text-red-600 mb-1">전체</div>
            <div className="text-2xl font-bold text-red-600">{stats.both}명</div>
          </Card>
          <Card className="p-4 bg-white border-none shadow-sm">
            <div className="text-xs text-purple-600 mb-1">정신건강</div>
            <div className="text-2xl font-bold text-purple-600">{stats.mental}명</div>
          </Card>
          <Card className="p-4 bg-white border-none shadow-sm">
            <div className="text-xs text-blue-600 mb-1">신체건강</div>
            <div className="text-2xl font-bold text-blue-600">{stats.physical}명</div>
          </Card>
        </div>

        {/* 필터 및 검색 */}
        <Card className="p-4 bg-white border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E8FB3]" />
              <Input
                type="text"
                placeholder="이름으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === '전체' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('전체')}
                className="h-9 text-xs"
              >
                전체
              </Button>
              <Button
                variant={filterType === '정신건강' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('정신건강')}
                className="h-9 text-xs"
              >
                정신건강
              </Button>
              <Button
                variant={filterType === '신체건강' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('신체건강')}
                className="h-9 text-xs"
              >
                신체건강
              </Button>
            </div>
          </div>
        </Card>

        {/* 목록 테이블 */}
        <Card className="p-5 bg-white border-none shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#DADDE1]">
                  <th className="text-left text-xs font-medium text-[#6E8FB3] pb-3 pr-4">이름</th>
                  <th className="text-center text-xs font-medium text-[#6E8FB3] pb-3 px-4">미검진 유형</th>
                  <th className="text-center text-xs font-medium text-[#6E8FB3] pb-3 px-4">미검진 날짜</th>
                  <th className="text-center text-xs font-medium text-[#6E8FB3] pb-3 px-4">지연 일수</th>
                  <th className="text-right text-xs font-medium text-[#6E8FB3] pb-3 px-4">마지막 검사일</th>
                  <th className="text-right text-xs font-medium text-[#6E8FB3] pb-3 pl-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((person) => (
                  <tr key={person.id} className="border-b border-[#DADDE1] hover:bg-[#FAFAFA] transition-colors">
                    <td className="py-3 pr-4">
                      <span className="font-medium text-sm text-[#1F2328]">{person.name}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={`${getTypeBadgeClass(person.missedType)} text-xs px-3 py-1`}>
                        {getTypeDisplayText(person.missedType)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-[#1F2328]">
                        <Calendar className="w-3.5 h-3.5 text-[#6E8FB3]" />
                        {person.date}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className="bg-red-100 text-red-600 text-xs px-3 py-1">
                        {person.daysOverdue}일 지연
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-[#6E8FB3]">
                      <div className="flex items-center justify-end gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {person.lastCheckDate}
                      </div>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendAlarm(person.name);
                        }}
                        className="h-7 px-3 bg-red-600 text-white hover:bg-red-700 hover:text-white flex items-center gap-1.5"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span className="text-xs">알람 전송</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-[#6E8FB3]">검색 결과가 없습니다.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}