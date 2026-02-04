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
  ArrowUpDown
} from 'lucide-react';
import { memberService, leaveService, projectService } from '@/api/services';
import { getMemberProfileUrl } from '@/api/config';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';
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
  SortOptionsRow,
  SortLabel,
  LoadingMessage,
  MemberAvatarPlaceholder,
} from './AgencyWorkcationPage.styled';

export function AgencyWorkcationPage() {
  const { user } = useAuthStore();
  const agencyNo = user?.agencyNo;
  
  const [selectedMember, setSelectedMember] = useState(null);
  const [sortType, setSortType] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // DB에서 워케이션 중인 직원 조회 (재택근무 제외)
  useEffect(() => {
    const fetchWorkcationMembers = async () => {
      if (!agencyNo) {
        console.log('❌ agencyNo가 없어서 종료');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log('📡 워케이션 직원 조회 시작:', { agencyNo });
        
        // 1. 에이전시 소속 근태 신청 목록 조회
        const response = await leaveService.getAgencyRequests(agencyNo);
        const requestsList = Array.isArray(response?.data) 
          ? response.data 
          : Array.isArray(response) 
            ? response 
            : [];
        
        console.log('📋 근태 신청 목록:', requestsList);
        
        // 2. 승인된 워케이션 신청만 필터링 (재택근무 제외, 현재 날짜가 기간 내에 있는 것만)
        // DB ATTENDANCE_REQUEST_TYPE: 워케이션 | 재택 | 재택근무 등
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const workationTypes = ['워케이션', 'WORKATION', 'workation']; // 워케이션만 포함, 재택근무/재택/REMOTE 제외
        const activeRequests = requestsList.filter(request => {
          // 승인된 신청만 (백엔드 필드명: attendanceRequestStatus)
          const status = request.attendanceRequestStatus || request.status;
          if (status !== 'APPROVED' && status !== '승인') {
            return false;
          }
          
          // 워케이션 타입만 (재택근무는 워케이션 관리에 표시하지 않음)
          const attendanceType = request.attendanceRequestType || request.attendanceType || request.type;
          if (!workationTypes.includes(attendanceType)) {
            return false;
          }
          
          // 현재 날짜가 신청 기간 내에 있는지 확인
          // 백엔드 필드명: attendanceRequestStartDate, attendanceRequestEndDate
          const startDateStr = request.attendanceRequestStartDate || request.startDate;
          const endDateStr = request.attendanceRequestEndDate || request.endDate;
          
          if (!startDateStr || !endDateStr) {
            return false;
          }
          
          // LocalDateTime 문자열 파싱 (예: "2026-01-15T00:00:00" 또는 "2026-01-15")
          const startDate = new Date(startDateStr);
          const endDate = new Date(endDateStr);
          
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.warn('날짜 파싱 실패:', { startDateStr, endDateStr });
            return false;
          }
          
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          
          return today >= startDate && today <= endDate;
        });
        
        console.log('✅ 활성 워케이션 신청:', activeRequests);
        
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
              
              // 회원 상세 정보 및 칸반 통계 조회
              const [memberInfo, memberDetails, kanbanStats] = await Promise.all([
                memberService.getMyPageInfo(memberNo),
                memberService.getMemberDetails(memberNo).catch(() => null),
                projectService.getKanbanStatsForMember(memberNo).catch(() => ({ totalCount: 0, inProgressCount: 0, completedCount: 0 })),
              ]);
              
              // 프로필 이미지 URL 구성 (config 유틸 사용)
              const profileImageUrl = getMemberProfileUrl(memberInfo.memberProfileImage);
              
              // 워케이션만 표시하므로 타입은 항상 워케이션
              const workcationType = '워케이션';
              
              // 날짜 포맷팅 (LocalDateTime -> YYYY-MM-DD)
              const formatDate = (dateStr) => {
                if (!dateStr) return '';
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) return '';
                return date.toISOString().split('T')[0];
              };
              
              const startDate = formatDate(request.attendanceRequestStartDate || request.startDate);
              const endDate = formatDate(request.attendanceRequestEndDate || request.endDate);
              
              // 칸반 통계: 진행률 = 완료/전체 * 100 (전체 0이면 0)
              const totalCount = kanbanStats?.totalCount ?? 0;
              const completedCount = kanbanStats?.completedCount ?? 0;
              const inProgressCount = kanbanStats?.inProgressCount ?? 0;
              const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return {
                id: memberNo,
                name: memberInfo.memberName || request.memberName || '',
                email: memberInfo.memberEmail || '',
                phone: memberInfo.memberPhone || '',
                role: memberInfo.memberRole || '',
                avatar: profileImageUrl,
                location: request.workcationLocation || request.location || '위치 정보 없음',
                startDate: startDate,
                endDate: endDate,
                workcationType: workcationType,
                projectNames: memberDetails?.currentProjects || [],
                kanbanStats: {
                  totalCount,
                  inProgressCount,
                  completedCount,
                  progressPercent,
                },
                tasks: [],
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
        
        console.log('✅ 워케이션 직원 목록:', validMembers);
        setMembers(validMembers);
      } catch (error) {
        console.error('워케이션 직원 조회 실패:', error);
        toast.error('데이터를 불러오는데 실패했습니다.');
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkcationMembers();
  }, [agencyNo]);

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
      // 작업 진행률 낮은 순 (미완료 많은 순)
      const aProgress = a.kanbanStats?.progressPercent ?? 0;
      const bProgress = b.kanbanStats?.progressPercent ?? 0;
      return sortOrder === 'asc' ? aProgress - bProgress : bProgress - aProgress;
    }
    return 0;
  });

  // Calculate statistics (KANBAN_CARD 기준)
  const stats = {
    total: members.length,
    totalTasks: members.reduce((acc, m) => acc + (m.kanbanStats?.totalCount || 0), 0),
    inProgressTasks: members.reduce((acc, m) => acc + (m.kanbanStats?.inProgressCount || 0), 0),
    completedTasks: members.reduce((acc, m) => acc + (m.kanbanStats?.completedCount || 0), 0),
    avgProgress: members.length > 0
      ? Math.round(
          members.reduce((acc, m) => acc + (m.kanbanStats?.progressPercent || 0), 0) / members.length
        )
      : 0,
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
          <SortOptionsRow>
            <SortLabel>정렬:</SortLabel>
            <FilterButtonGroup>
              <Button
                variant={sortType === 'alphabetical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('alphabetical')}
                className="flex items-center gap-1"
              >
                가나다순
                {sortType === 'alphabetical' && (
                  <>
                    <ArrowUpDown className="w-3 h-3" />
                    <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  </>
                )}
              </Button>
              <Button
                variant={sortType === 'imminent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('imminent')}
                className="flex items-center gap-1"
              >
                연재 임박
                {sortType === 'imminent' && (
                  <>
                    <ArrowUpDown className="w-3 h-3" />
                    <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  </>
                )}
              </Button>
            </FilterButtonGroup>
          </SortOptionsRow>
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
              <Briefcase className="w-4 h-4 text-amber-600" />
              <StatisticsLabel>진행 중인 작업</StatisticsLabel>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.inProgressTasks}개</p>
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
          <LoadingMessage>
            <p>워케이션 직원 목록을 불러오는 중...</p>
          </LoadingMessage>
        ) : (
          <MembersGrid>
            {sortedMembers.map((member) => {
            const daysRemaining = getDaysRemaining(member.endDate);
            const ks = member.kanbanStats || {};
            const totalCount = ks.totalCount ?? 0;
            const completedCount = ks.completedCount ?? 0;
            const progressPercent = ks.progressPercent ?? 0;

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
                        워케이션 진행 중
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
                        <MemberAvatarPlaceholder $visible={!member.avatar}>
                          <Briefcase className="w-8 h-8 text-white" />
                        </MemberAvatarPlaceholder>
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

                  {/* Progress - KANBAN_CARD 기준 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">작업 진행률</span>
                      <span className="text-2xl font-bold text-foreground">{progressPercent}%</span>
                    </div>
                    <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                        style={{
                          width: `${progressPercent}%`,
                          background: 'linear-gradient(90deg, #A855F7 0%, #9333EA 50%, #7C3AED 100%)',
                          boxShadow: '0 2px 4px rgba(147, 51, 234, 0.3)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Tasks Summary - 진행중/완료 작업 개수 */}
                  <MemberCardTasks>
                    <div className="flex items-center gap-4 text-sm flex-wrap">
                      <span className="text-muted-foreground">
                        진행중 <span className="font-semibold text-foreground">{totalCount > 0 ? totalCount - completedCount : 0}개</span>
                      </span>
                      <span className="text-muted-foreground">
                        완료 <span className="font-semibold text-green-600">{completedCount}개</span>
                      </span>
                      <span className="text-muted-foreground">
                        전체 <span className="font-semibold text-foreground">{totalCount}개</span>
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
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-white">
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
                        <MemberAvatarPlaceholder $visible={!selectedMember.avatar} $size="lg">
                          <Briefcase className="w-10 h-10 text-white" />
                        </MemberAvatarPlaceholder>
                      </DetailMemberAvatar>
                      <div>
                        <DetailMemberName>{selectedMember.name}</DetailMemberName>
                        <DetailMemberRole>
                          {selectedMember.role || '역할 정보 없음'}
                        </DetailMemberRole>
                      </div>
                    </DetailMemberInfo>
                    <Badge className="bg-white/20 text-white border-none text-sm">
                      워케이션 진행 중
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

                {/* Kanban 작업 통계 */}
                {selectedMember.kanbanStats && selectedMember.kanbanStats.totalCount > 0 && (
                  <DailyReportCard>
                    <DailyReportHeader>
                      <DailyReportTitle>
                        <Briefcase className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold text-foreground">작업 현황 (KANBAN_CARD)</h4>
                      </DailyReportTitle>
                    </DailyReportHeader>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">작업 진행률</p>
                        <DailyReportProgress>
                          <Progress value={selectedMember.kanbanStats.progressPercent || 0} className="flex-1" />
                          <span className="text-lg font-bold text-foreground">
                            {selectedMember.kanbanStats.progressPercent || 0}%
                          </span>
                        </DailyReportProgress>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 rounded-lg bg-muted/50 text-center">
                          <p className="text-2xl font-bold text-foreground">{selectedMember.kanbanStats.totalCount}</p>
                          <p className="text-xs text-muted-foreground">전체 작업</p>
                        </div>
                        <div className="p-3 rounded-lg bg-amber-50 text-center">
                          <p className="text-2xl font-bold text-amber-700">{selectedMember.kanbanStats.inProgressCount}</p>
                          <p className="text-xs text-muted-foreground">진행중</p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-50 text-center">
                          <p className="text-2xl font-bold text-green-700">{selectedMember.kanbanStats.completedCount}</p>
                          <p className="text-xs text-muted-foreground">완료</p>
                        </div>
                      </div>
                    </div>
                  </DailyReportCard>
                )}

                {/* Tasks List (상세 작업 목록 - 별도 API 연동 시) */}
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
