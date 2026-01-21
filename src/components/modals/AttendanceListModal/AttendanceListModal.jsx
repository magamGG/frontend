import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  SearchContainer,
  SearchIcon,
  AttendanceList,
  AttendanceItem,
  AttendanceHeader,
  AttendanceNameGroup,
  AttendanceName,
  AttendanceDate,
  StatsContainer,
  StatsGrid,
  StatItem,
  StatValue,
  StatLabel,
  EmptyMessage,
} from './AttendanceListModal.styled';

/**
 * @typedef {Object} Attendance
 * @property {number} id
 * @property {string} name
 * @property {string} type
 * @property {string} date
 * @property {string} status
 */

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {Attendance[]} props.attendances
 */
export function AttendanceListModal({ open, onOpenChange, attendances }) {
  const [searchTerm, setSearchTerm] = useState('');

  const getAttendanceTypeColor = (type) => {
    switch (type) {
      case '워케이션':
        return 'bg-purple-500 text-white';
      case '휴재':
        return 'bg-gray-500 text-white';
      case '재택근무':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case '승인':
        return 'bg-green-500 text-white';
      case '대기':
        return 'bg-yellow-500 text-white';
      case '반려':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const filteredAttendances = attendances.filter(
    (attendance) =>
      attendance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendance.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[700px] bg-white max-h-[85vh] flex flex-col" 
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-[#1F2328]">금주 근태 전체 목록</DialogTitle>
        </DialogHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0', flex: 1, overflow: 'hidden' }}>
          {/* 검색 */}
          <SearchContainer>
            <SearchIcon>
              <Search style={{ width: '16px', height: '16px' }} />
            </SearchIcon>
            <Input
              type="text"
              placeholder="이름 또는 근태 유형 검색..."
              className="pl-10 h-9 bg-[#FAFAFA] border-[#DADDE1] text-[#1F2328] text-sm focus:ring-[#6E8FB3]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          {/* 근태 목록 */}
          <AttendanceList>
            {filteredAttendances.length > 0 ? (
              filteredAttendances.map((item) => (
                <AttendanceItem key={item.id}>
                  <AttendanceHeader>
                    <AttendanceNameGroup>
                      <AttendanceName>{item.name}</AttendanceName>
                      <Badge className={`${getAttendanceTypeColor(item.type)} text-xs`}>
                        {item.type}
                      </Badge>
                    </AttendanceNameGroup>
                    <Badge className={`${getAttendanceStatusColor(item.status)} text-xs`}>
                      {item.status}
                    </Badge>
                  </AttendanceHeader>
                  <AttendanceDate>{item.date}</AttendanceDate>
                </AttendanceItem>
              ))
            ) : (
              <EmptyMessage>
                <p style={{ fontSize: '14px' }}>검색 결과가 없습니다.</p>
              </EmptyMessage>
            )}
          </AttendanceList>

          {/* 통계 요약 */}
          <StatsContainer>
            <StatsGrid>
              <StatItem>
                <StatValue>{attendances.length}</StatValue>
                <StatLabel>전체 근태</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue style={{ color: '#10b981' }}>
                  {attendances.filter((a) => a.status === '승인').length}
                </StatValue>
                <StatLabel>승인</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue style={{ color: '#eab308' }}>
                  {attendances.filter((a) => a.status === '대기').length}
                </StatValue>
                <StatLabel>대기</StatLabel>
              </StatItem>
            </StatsGrid>
          </StatsContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
