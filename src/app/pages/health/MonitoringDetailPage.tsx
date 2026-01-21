import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ArrowLeft, Search, TrendingUp, AlertTriangle, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface MonitoringPerson {
  id: number;
  name: string;
  mentalCount: number;
  physicalCount: number;
  status: '위험' | '주의' | '정상';
  lastCheckDate: string;
  team: string;
  position: string;
}

interface MonitoringDetailPageProps {
  onBack: () => void;
}

export function MonitoringDetailPage({ onBack }: MonitoringDetailPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'전체' | '위험' | '주의' | '정상'>('전체');

  // 검진 모니터링 전체 데이터 (최근 검사일 기준 내림차순 정렬)
  const [monitoringData] = useState<MonitoringPerson[]>([
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
  ].sort((a, b) => new Date(b.lastCheckDate).getTime() - new Date(a.lastCheckDate).getTime()));

  // 상태별 배지 색상
  const getStatusBadgeClass = (status: string) => {
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
  const getStatusIcon = (status: string) => {
    switch (status) {
      case '위험':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case '주의':
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
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
  const handleSendAlarm = (personName: string) => {
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
            <h1 className="text-xl font-bold text-[#1F2328]">검진 모니터링</h1>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-none shadow-sm">
            <div className="text-xs text-[#6E8FB3] mb-1">전체 인원</div>
            <div className="text-2xl font-bold text-[#1F2328]">{stats.total}명</div>
          </Card>
          <Card className="p-4 bg-white border-none shadow-sm">
            <div className="flex items-center gap-1 text-xs text-red-600 mb-1">
              <AlertTriangle className="w-3 h-3" />
              위험
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.risk}명</div>
          </Card>
          <Card className="p-4 bg-white border-none shadow-sm">
            <div className="flex items-center gap-1 text-xs text-orange-600 mb-1">
              <TrendingUp className="w-3 h-3" />
              주의
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.warning}명</div>
          </Card>
          <Card className="p-4 bg-white border-none shadow-sm">
            <div className="text-xs text-[#6E8FB3] mb-1">정상</div>
            <div className="text-2xl font-bold text-green-600">{stats.normal}명</div>
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
                variant={filterStatus === '전체' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('전체')}
                className="h-9 text-xs"
              >
                전체
              </Button>
              <Button
                variant={filterStatus === '위험' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('위험')}
                className="h-9 text-xs"
              >
                위험
              </Button>
              <Button
                variant={filterStatus === '주의' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('주의')}
                className="h-9 text-xs"
              >
                주의
              </Button>
              <Button
                variant={filterStatus === '정상' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('정상')}
                className="h-9 text-xs"
              >
                정상
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
                  <th className="text-left text-xs font-medium text-[#6E8FB3] pb-3 px-4">직책</th>
                  <th className="text-center text-xs font-medium text-[#6E8FB3] pb-3 px-4">상태</th>
                  <th className="text-right text-xs font-medium text-[#6E8FB3] pb-3 px-4">최근 검사일</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((person) => (
                  <tr key={person.id} className="border-b border-[#DADDE1] hover:bg-[#FAFAFA] transition-colors">
                    <td className="py-3 pr-4">
                      <span className="font-medium text-sm text-[#1F2328]">{person.name}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#6E8FB3]">{person.position}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={`${getStatusBadgeClass(person.status)} text-xs px-3 py-1`}>
                        {person.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-[#6E8FB3]">{person.lastCheckDate}</td>
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