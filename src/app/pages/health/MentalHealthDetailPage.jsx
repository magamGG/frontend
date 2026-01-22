import { ArrowLeft, Search } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useState } from 'react';

const riskData = [
  { name: '정상', value: 4, color: '#52C41A' },
  { name: '주의', value: 3, color: '#FA8C16' },
  { name: '위험', value: 2, color: '#FF4D4F' },
];

const participants = [
  { name: '송도동', dept: '개발팀', status: '완료', statusColor: 'bg-green-50 text-green-700', score: 85, risk: '위험', riskColor: 'bg-red-50 text-red-700', date: '2026.01.18' },
  { name: '강호배', dept: '영업팀', status: '대기', statusColor: 'bg-orange-50 text-orange-700', score: '-', risk: '-', riskColor: '', date: '-' },
  { name: '이수민', dept: '기획팀', status: '완료', statusColor: 'bg-green-50 text-green-700', score: 92, risk: '정상', riskColor: 'bg-green-50 text-green-700', date: '2026.01.19' },
  { name: '박지훈', dept: '디자인팀', status: '완료', statusColor: 'bg-green-50 text-green-700', score: 78, risk: '주의', riskColor: 'bg-orange-50 text-orange-700', date: '2026.01.17' },
  { name: '최은영', dept: '마케팅팀', status: '진행중', statusColor: 'bg-blue-50 text-blue-700', score: '-', risk: '-', riskColor: '', date: '-' },
  { name: '김태양', dept: '개발팀', status: '완료', statusColor: 'bg-green-50 text-green-700', score: 88, risk: '주의', riskColor: 'bg-orange-50 text-orange-700', date: '2026.01.20' },
  { name: '정민서', dept: '인사팀', status: '완료', statusColor: 'bg-green-50 text-green-700', score: 95, risk: '정상', riskColor: 'bg-green-50 text-green-700', date: '2026.01.18' },
];

interface MentalHealthDetailPageProps {
  onBack?: () => void;
}

export function MentalHealthDetailPage({ onBack }: MentalHealthDetailPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');

  const filteredParticipants = participants
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

  return (
    <div className="min-h-screen bg-[#F4F7FC] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#333333]" />
            </button>
            <h1 className="text-3xl font-bold text-[#333333]">정신 건강 심층 검사 상세 현황</h1>
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#6E8FB3]"
            >
              <option value="전체">전체</option>
              <option value="완료">완료</option>
              <option value="진행중">진행중</option>
              <option value="대기">대기</option>
            </select>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Progress Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-[#666666] mb-2">총 진행률</p>
            <p className="text-4xl font-bold text-[#333333] mb-4">56%</p>
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: '56%',
                  background: 'linear-gradient(90deg, #8E44AD 0%, #A569BD 100%)'
                }}
              />
            </div>
            <p className="text-xs text-[#666666] mt-2">완료 5 / 전체 9</p>
          </div>

          {/* Schedule Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-[#666666] mb-2">검사 일정</p>
            <p className="text-4xl font-bold text-[#333333] mb-4">2026.01.25</p>
            <div className="inline-block px-3 py-1 bg-red-50 text-red-600 text-sm font-medium rounded-full">
              마감 D-7
            </div>
          </div>

          {/* Risk Chart Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-[#666666] mb-4">위험군 분포</p>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32">
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
              </div>
              <div className="space-y-2">
                {riskData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-[#666666]">{item.name}</span>
                    <span className="text-sm font-medium text-[#333333]">{item.value}명</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Data Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#333333]">대상자 목록</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
              <Input 
                placeholder="이름 검색" 
                className="pl-10 rounded-lg border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#666666]">이름</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#666666]">부서</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#666666]">상태</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#666666]">점수</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#666666]">위험도</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#666666]">검사일</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((person, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm font-medium text-[#333333]">{person.name}</td>
                    <td className="py-4 px-4 text-sm text-[#666666]">{person.dept}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${person.statusColor}`}>
                        {person.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-[#333333]">{person.score}</td>
                    <td className="py-4 px-4">
                      {person.risk !== '-' && (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${person.riskColor}`}>
                          {person.risk}
                        </span>
                      )}
                      {person.risk === '-' && <span className="text-sm text-[#666666]">-</span>}
                    </td>
                    <td className="py-4 px-4 text-sm text-[#666666]">{person.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}