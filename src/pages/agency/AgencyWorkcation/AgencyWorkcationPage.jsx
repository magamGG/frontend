import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { 
  MapPin, 
  Calendar, 
  Briefcase, 
  Mail, 
  Phone, 
  ChevronRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileText,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { memberService, leaveService, projectService } from '@/api/services';
import { API_BASE_URL } from '@/api/config';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';
import { parseBackendDate } from '@/utils/dateUtils';
import {
  AgencyWorkcationRoot,
  AgencyWorkcationBody,
  HeaderSection,
  HeaderTitle,
  HeaderSubtitle,
  HeaderActions,
  FilterButtonGroup,
  StatisticsGrid,
  StatisticsCard,
  StatisticsCardContent,
  StatisticsIcon,
  StatisticsLabel,
  StatisticsValue,
  MembersGrid,
  MemberCard,
  MemberCardHeader,
  MemberCardHeaderContent,
  MemberCardBadges,
  MemberCardInfo,
  MemberCardAvatar,
  MemberCardName,
  MemberCardRole,
  MemberCardContent,
  MemberCardLocation,
  MemberCardDate,
  MemberCardProjects,
  MemberCardProgress,
  MemberCardTasks,
  MemberCardActions,
  EmptyStateCard,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
  DetailModalContent,
  DetailMemberHeader,
  DetailMemberInfo,
  DetailMemberAvatar,
  DetailMemberName,
  DetailMemberRole,
  DetailMemberGrid,
  DetailMemberItem,
  DetailMemberLabel,
  DetailMemberValue,
  DailyReportCard,
  DailyReportHeader,
  DailyReportTitle,
  DailyReportProgress,
  DailyReportTasks,
  TasksList,
  TaskCard,
  TaskCardHeader,
  TaskCardTitle,
  TaskCardInfo,
  TaskCardProgress,
  ProjectsSection,
} from './AgencyWorkcationPage.styled';

export function AgencyWorkcationPage() {
  const { user } = useAuthStore();
  const agencyNo = user?.agencyNo;
  const isManager = user?.memberRole === '담당자';

  const [selectedMember, setSelectedMember] = useState(null);
  const [sortType, setSortType] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // attendance_request에서 승인된 워케이션/재택근무 조회 (담당자: 배정 작가만, 에이전시: 소속 전체)
  useEffect(() => {
    const fetchWorkcationMembers = async () => {
      if (!isManager && !agencyNo) {
        console.log('❌ 에이전시 소속이 아니어서 종료');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log('📡 워케이션/재택근무 직원 조회 시작:', { isManager, agencyNo });
        
        // 1. 담당자면 배정 작가 근태 신청만, 에이전시면 소속 전체 근태 신청 조회
        const response = isManager
          ? await leaveService.getManagerRequests()
          : await leaveService.getAgencyRequests(agencyNo);
        const requestsList = Array.isArray(response?.data) 
          ? response.data 
          : Array.isArray(response) 
            ? response 
            : [];
        
        console.log('📋 근태 신청 목록:', requestsList);
        
        // 2. 승인된 워케이션/재택근무 신청 필터링 (현재 날짜가 기간 내에 있는 것만)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const activeRequests = requestsList.filter(request => {
          // 승인된 신청만 (백엔드 필드명: attendanceRequestStatus)
          const status = request.attendanceRequestStatus || request.status;
          if (status !== 'APPROVED' && status !== '승인') {
            return false;
          }
          
          // 재택근무 또는 워케이션 타입만 (백엔드 필드명: attendanceRequestType)
          const attendanceType = request.attendanceRequestType || request.attendanceType || request.type;
          if (attendanceType !== '재택근무' && 
              attendanceType !== '워케이션' && 
              attendanceType !== 'REMOTE' && 
              attendanceType !== 'WORKATION') {
            return false;
          }
          
          // 현재 날짜가 신청 기간 내에 있는지 확인
          // 백엔드 필드명: attendanceRequestStartDate, attendanceRequestEndDate
          const startDateStr = request.attendanceRequestStartDate || request.startDate;
          const endDateStr = request.attendanceRequestEndDate || request.endDate;
          
          if (!startDateStr || !endDateStr) {
            return false;
          }
          
          // 배열 형태의 날짜 파싱 (LocalDateTime이 배열로 직렬화됨)
          const startDate = parseBackendDate(startDateStr);
          const endDate = parseBackendDate(endDateStr);
          
          if (!startDate || !endDate) {
            console.warn('날짜 파싱 실패:', { startDateStr, endDateStr });
            return false;
          }
          
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          
          return today >= startDate && today <= endDate;
        });
        
        console.log('✅ 활성 워케이션/재택근무 신청:', activeRequests);
        
        // 3. 각 회원의 상세 정보 조회
        const membersData = await Promise.all(
          activeRequests.map(async (request) => {
            try {
              // 백엔드 필드명: memberNo
              const memberNo = request.memberNo;
              if (!memberNo) {
                console.warn('memberNo가 없음:', request);
                return null;
              }
              
              // 회원 상세 정보 + 해당 회원 작업 수(미완료/완료/삭제제외) 병렬 조회
              const [memberInfo, taskCountRes, completedTaskCountRes, activeTaskCountRes] = await Promise.all([
                memberService.getMyPageInfo(memberNo),
                projectService.getTaskCountByMember(memberNo).catch(() => ({ count: 0 })),
                projectService.getCompletedTaskCountByMember(memberNo).catch(() => ({ count: 0 })),
                projectService.getActiveTaskCountByMember(memberNo).catch(() => ({ count: 0 })),
              ]);
              
              // 프로필 이미지 URL 구성
              let profileImageUrl = null;
              if (memberInfo.memberProfileImage) {
                const imageBaseUrl = API_BASE_URL || 'http://localhost:8888';
                if (memberInfo.memberProfileImage.startsWith('http://') || 
                    memberInfo.memberProfileImage.startsWith('https://')) {
                  profileImageUrl = memberInfo.memberProfileImage;
                } else if (memberInfo.memberProfileImage.startsWith('/uploads/')) {
                  profileImageUrl = `${imageBaseUrl}${memberInfo.memberProfileImage}`;
                } else {
                  profileImageUrl = `${imageBaseUrl}/uploads/${memberInfo.memberProfileImage}`;
                }
              }
              
              // 근태 타입 매핑
              const attendanceType = request.attendanceRequestType || request.attendanceType || request.type;
              const workcationType = attendanceType === '재택근무' || attendanceType === 'REMOTE' 
                ? '재택근무' 
                : '워케이션';
              
              // 날짜 포맷팅 (LocalDateTime -> YYYY-MM-DD)
              const formatDate = (dateStr) => {
                if (!dateStr) return '';
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) return '';
                return date.toISOString().split('T')[0];
              };
              
              const startDate = formatDate(request.attendanceRequestStartDate || request.startDate);
              const endDate = formatDate(request.attendanceRequestEndDate || request.endDate);
              
              const taskCount = Number(taskCountRes?.count ?? taskCountRes?.data?.count ?? 0);
              const completedTaskCount = Number(completedTaskCountRes?.count ?? completedTaskCountRes?.data?.count ?? 0);
              const activeTaskCount = Number(activeTaskCountRes?.count ?? activeTaskCountRes?.data?.count ?? 0);
              return {
                id: memberNo,
                name: memberInfo.memberName || request.memberName || '',
                email: memberInfo.memberEmail || '',
                phone: memberInfo.memberPhone || '',
                role: memberInfo.memberRole || '',
                avatar: profileImageUrl,
                // 백엔드 필드명: workcationLocation
                location: request.workcationLocation || request.location || '위치 정보 없음',
                startDate: startDate,
                endDate: endDate,
                workcationType: workcationType,
                projectNames: [], // 추후 프로젝트 API로 조회
                tasks: [], // 진행률 등 추후 사용
                taskCount, // 미완료 N (상단 "진행 중인 작업" 통계용)
                completedTaskCount, // 완료된 칸반 카드 수 (KANBAN_CARD_STATUS='Y')
                activeTaskCount, // STATUS != 'D' (카드 "작업 N개" 표시용)
                dailyReport: null,
                contact: {
                  email: memberInfo.memberEmail || '',
                  phone: memberInfo.memberPhone || '',
                },
              };
            } catch (error) {
              console.error(`회원 ${request.memberNo} 정보 조회 실패:`, error);
              return null;
            }
          })
        );
        
        // null 제거
        const validMembers = membersData.filter(m => m !== null);
        
        console.log('✅ 워케이션/재택근무 직원 목록:', validMembers);
        setMembers(validMembers);
      } catch (error) {
        console.error('워케이션/재택근무 직원 조회 실패:', error);
        toast.error('데이터를 불러오는데 실패했습니다.');
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkcationMembers();
  }, [agencyNo, isManager]);

  // Calculate days remaining for each member
  const getDaysRemaining = (endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Get role display name
  const getRoleDisplay = (role, customRole) => {
    if (role === 'assist' && customRole) return customRole;
    const roleMap = {
      story: '스토리',
      line: '라인',
      coloring: '컬러링',
      background: '배경',
      assist: '어시스트',
    };
    return roleMap[role] || role;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // 정렬 핸들러
  const handleSort = (type) => {
    if (sortType === type) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortType(null);
        setSortOrder('asc');
      }
    } else {
      setSortType(type);
      setSortOrder('asc');
    }
  };

  // Sort members
  const sortedMembers = [...members].sort((a, b) => {
    if (!sortType) return 0;

    if (sortType === 'alphabetical') {
      const comparison = a.name.localeCompare(b.name, 'ko');
      return sortOrder === 'asc' ? comparison : -comparison;
    } else if (sortType === 'imminent') {
      // 연재 임박 순서: 마감일이 가까운 순서
      const aDeadline = a.tasks.length > 0 ? new Date(a.tasks[0].deadline) : new Date('9999-12-31');
      const bDeadline = b.tasks.length > 0 ? new Date(b.tasks[0].deadline) : new Date('9999-12-31');
      const comparison = aDeadline - bDeadline;
      return sortOrder === 'asc' ? comparison : -comparison;
    }
    return 0;
  });

  // Calculate statistics (진행 중인 작업 = 워케이션 멤버별 칸반 카드 수 합, KANBAN_CARD_STATUS='N'만)
  const stats = {
    total: members.length,
    avgProgress: members.length > 0 
      ? Math.round(
          members.reduce((acc, m) => acc + (m.dailyReport?.progress || 0), 0) / members.length
        )
      : 0,
    totalTasks: members.reduce((acc, m) => acc + (m.taskCount ?? 0), 0),
    completedTasks: members.reduce((acc, m) => acc + (m.completedTaskCount ?? 0), 0),
  };


  return (
    <AgencyWorkcationRoot>
      <AgencyWorkcationBody>
        {/* Header */}
        <HeaderSection>
          <div>
            <HeaderTitle>원격 관리</HeaderTitle>
            <HeaderSubtitle>원격 근무 중인 팀원들의 작업 현황을 관리합니다</HeaderSubtitle>
          </div>
        </HeaderSection>

        {/* 정렬 옵션 */}
        <div className="mb-4 flex justify-end">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--foreground)', whiteSpace: 'nowrap' }}>정렬:</span>
            <FilterButtonGroup>
              <Button
                variant={sortType === 'alphabetical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('alphabetical')}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                가나다순
                {sortType === 'alphabetical' && (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
              </Button>
              <Button
                variant={sortType === 'imminent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('imminent')}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                연재 임박
                {sortType === 'imminent' && (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
              </Button>
            </FilterButtonGroup>
          </div>
        </div>

        {/* Statistics Cards */}
        <StatisticsGrid>
          <StatisticsCard>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              <StatisticsLabel>원격 인원</StatisticsLabel>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.total}명</p>
          </StatisticsCard>

          <StatisticsCard>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-green-600" />
              <StatisticsLabel>진행 중인 작업</StatisticsLabel>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalTasks}개</p>
          </StatisticsCard>

          <StatisticsCard>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <StatisticsLabel>완료된 작업</StatisticsLabel>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.completedTasks}개</p>
          </StatisticsCard>
        </StatisticsGrid>

        {/* Workcation Members Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>워케이션/재택근무 직원 목록을 불러오는 중...</p>
          </div>
        ) : (
          <MembersGrid>
            {sortedMembers.map((member) => {
            const daysRemaining = getDaysRemaining(member.endDate);
            // 전체 작업 진행률: (완료 작업 수 / 삭제 제외 전체 작업 수) * 100. 작업이 없으면 0%
            const total = member.activeTaskCount ?? 0;
            const completed = member.completedTaskCount ?? 0;
            const avgProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <MemberCard 
                key={member.id}
                onClick={() => setSelectedMember(member)}
              >
                {/* Header with gradient */}
                <MemberCardHeader>
                  <MemberCardHeaderContent>
                    <MemberCardBadges>
                      <Badge className="bg-white/20 text-white border-none">
                        {member.workcationType} 진행 중
                      </Badge>
                      <Badge className="bg-white/90 text-[#3F4A5A] border-none">
                        D-{daysRemaining}
                      </Badge>
                    </MemberCardBadges>
                    
                    <MemberCardInfo>
                      <MemberCardAvatar>
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-16 h-16 rounded-full border-4 border-white/20 object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-16 h-16 rounded-full border-4 border-white/20 bg-white/20 flex items-center justify-center"
                          style={{ display: member.avatar ? 'none' : 'flex' }}
                        >
                          <Briefcase className="w-8 h-8 text-white" />
                        </div>
                      </MemberCardAvatar>
                      <div>
                        <MemberCardName>{member.name}</MemberCardName>
                        <MemberCardRole>
                          {member.role || '역할 정보 없음'}
                        </MemberCardRole>
                      </div>
                    </MemberCardInfo>
                  </MemberCardHeaderContent>
                </MemberCardHeader>

                {/* Content */}
                <MemberCardContent>
                  {/* Location & Date */}
                  <div className="space-y-2">
                    <MemberCardLocation>
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{member.location}</span>
                    </MemberCardLocation>
                    <MemberCardDate>
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {member.startDate ? member.startDate.slice(5) : ''} ~ {member.endDate ? member.endDate.slice(5) : ''}
                      </span>
                    </MemberCardDate>
                  </div>

                  {/* Projects */}
                  {member.projectNames && member.projectNames.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">담당 작품</p>
                      <MemberCardProjects>
                        {member.projectNames.map((project, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline" 
                            className="text-xs border-border text-foreground"
                          >
                            {project}
                          </Badge>
                        ))}
                      </MemberCardProjects>
                    </div>
                  )}

                  {/* Progress - 완료/전체 작업 수로 진행률 계산 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">전체 작업 진행률</span>
                      <span className="text-2xl font-bold text-foreground">{avgProgress}%</span>
                    </div>
                    <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                        style={{
                          width: `${avgProgress}%`,
                          background: 'linear-gradient(90deg, #A855F7 0%, #9333EA 50%, #7C3AED 100%)',
                          boxShadow: '0 2px 4px rgba(147, 51, 234, 0.3)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Tasks Summary */}
                  <MemberCardTasks>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        작업 <span className="font-semibold text-foreground">{member.activeTaskCount ?? member.taskCount ?? 0}개</span>
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-foreground hover:text-foreground/80 hover:bg-muted transition-transform"
                    >
                      상세보기
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </MemberCardTasks>
                </MemberCardContent>
              </MemberCard>
            );
          })}
          </MembersGrid>
        )}

        {/* Empty State */}
        {sortedMembers.length === 0 && (
          <EmptyStateCard>
            <EmptyStateIcon>
              <MapPin className="w-8 h-8 text-purple-600" />
            </EmptyStateIcon>
            <EmptyStateTitle>워케이션 중인 팀원이 없습니다</EmptyStateTitle>
            <EmptyStateText>워케이션 중인 인원이 없습니다</EmptyStateText>
          </EmptyStateCard>
        )}
      </AgencyWorkcationBody>

      {/* Detail Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto modal-scrollbar-transparent" aria-describedby={undefined}>
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">워케이션 상세 정보</DialogTitle>
              </DialogHeader>

              <DetailModalContent>
                {/* Member Info Card */}
                <div
                  className="rounded-lg p-6 text-white"
                  style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' }}
                >
                  <DetailMemberHeader>
                    <DetailMemberInfo>
                      <DetailMemberAvatar>
                        {selectedMember.avatar ? (
                          <img
                            src={selectedMember.avatar}
                            alt={selectedMember.name}
                            className="w-20 h-20 rounded-full border-4 border-white/20 object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-20 h-20 rounded-full border-4 border-white/20 bg-white/20 flex items-center justify-center"
                          style={{ display: selectedMember.avatar ? 'none' : 'flex' }}
                        >
                          <Briefcase className="w-10 h-10 text-white" />
                        </div>
                      </DetailMemberAvatar>
                      <div>
                        <DetailMemberName>{selectedMember.name}</DetailMemberName>
                        <DetailMemberRole>
                          {selectedMember.role || '역할 정보 없음'}
                        </DetailMemberRole>
                      </div>
                    </DetailMemberInfo>
                    <Badge className="bg-white/20 text-white border-none text-sm">
                      {selectedMember?.workcationType} 진행 중
                    </Badge>
                  </DetailMemberHeader>

                  <DetailMemberGrid>
                    <DetailMemberItem>
                      <DetailMemberLabel>
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm text-white/70">위치</span>
                      </DetailMemberLabel>
                      <DetailMemberValue>{selectedMember.location}</DetailMemberValue>
                    </DetailMemberItem>
                    <DetailMemberItem>
                      <DetailMemberLabel>
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm text-white/70">기간</span>
                      </DetailMemberLabel>
                      <DetailMemberValue>
                        {selectedMember.startDate} ~ {selectedMember.endDate}
                      </DetailMemberValue>
                      <p className="text-sm text-white/70 mt-1">
                        (D-{getDaysRemaining(selectedMember.endDate)}일 남음)
                      </p>
                    </DetailMemberItem>
                  </DetailMemberGrid>

                  <DetailMemberGrid>
                    <DetailMemberItem>
                      <DetailMemberLabel>
                        <Mail className="w-4 h-4" />
                        <span className="text-sm text-white/70">이메일</span>
                      </DetailMemberLabel>
                      <DetailMemberValue className="text-sm">{selectedMember.contact.email}</DetailMemberValue>
                    </DetailMemberItem>
                    {selectedMember.contact.phone && (
                      <DetailMemberItem>
                        <DetailMemberLabel>
                          <Phone className="w-4 h-4" />
                          <span className="text-sm text-white/70">연락처</span>
                        </DetailMemberLabel>
                        <DetailMemberValue className="text-sm">{selectedMember.contact.phone}</DetailMemberValue>
                      </DetailMemberItem>
                    )}
                  </DetailMemberGrid>
                </div>

                {/* Daily Report */}
                {selectedMember.dailyReport && (
                  <DailyReportCard>
                    <DailyReportHeader>
                      <DailyReportTitle>
                        <FileText className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold text-foreground">현재 작업 중인 업무</h4>
                      </DailyReportTitle>
                      <Badge variant="outline" className="ml-auto text-xs bg-white">
                        {selectedMember.dailyReport.lastUpdated}
                      </Badge>
                    </DailyReportHeader>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">전체 진행률</p>
                        <DailyReportProgress>
                          <Progress value={selectedMember.dailyReport.progress} className="flex-1" />
                          <span className="text-lg font-bold text-foreground">
                            {selectedMember.dailyReport.progress}%
                          </span>
                        </DailyReportProgress>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">완료한 작업</p>
                        <DailyReportTasks>
                          {selectedMember.dailyReport.tasksCompleted.map((task, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              {task}
                            </li>
                          ))}
                        </DailyReportTasks>
                      </div>
                    </div>
                  </DailyReportCard>
                )}

                {/* Tasks List */}
                {selectedMember.tasks && selectedMember.tasks.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-muted-foreground" />
                      담당 작업 목록
                    </h4>
                    <TasksList>
                      {selectedMember.tasks.map((task) => (
                      <TaskCard key={task.id}>
                        <TaskCardHeader>
                          <div className="flex-1">
                            <TaskCardTitle>
                              <h5 className="font-semibold text-foreground">{task.title}</h5>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(task.priority)}`}
                              >
                                {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '보통' : '낮음'}
                              </Badge>
                            </TaskCardTitle>
                            <TaskCardInfo>{task.projectName}</TaskCardInfo>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{task.deadline}</span>
                          </div>
                        </TaskCardHeader>

                        <TaskCardProgress>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">진행률</span>
                            <span className="font-semibold text-foreground">{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </TaskCardProgress>

                        {task.progress === 100 && (
                          <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>작업 완료</span>
                          </div>
                        )}
                      </TaskCard>
                      ))}
                    </TasksList>
                  </div>
                )}

                {/* Projects */}
                {selectedMember.projectNames && selectedMember.projectNames.length > 0 && (
                  <ProjectsSection>
                    <h4 className="font-semibold text-foreground mb-4">참여 작품</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.projectNames.map((project, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline"
                          className="px-4 py-2 text-sm border-border text-foreground"
                        >
                          {project}
                        </Badge>
                      ))}
                    </div>
                  </ProjectsSection>
                )}
              </DetailModalContent>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AgencyWorkcationRoot>
  );
}
