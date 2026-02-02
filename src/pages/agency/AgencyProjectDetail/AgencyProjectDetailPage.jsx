import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Mail, 
  Phone, 
  Briefcase,
  MessageSquare,
  Circle,
  CheckCircle2
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { getProjectThumbnailUrl, getMemberProfileUrl, PROJECT_THUMBNAIL_PLACEHOLDER, MEMBER_AVATAR_PLACEHOLDER } from '@/api/config';
import { projectService } from '@/api/services';
import { toast } from 'sonner';
import {
  AgencyProjectDetailRoot,
  AgencyProjectDetailBody,
  BackButtonContainer,
  ProjectHeaderCard,
  ProjectHeaderContent,
  ProjectThumbnail,
  ProjectInfo,
  ProjectTitle,
  ProjectArtist,
  ProjectBadges,
  ProjectTeamSection,
  ProjectTeamHeader,
  ProjectManagementSection,
  ProjectManagementTitle,
  KanbanBoardsContainer,
  WeeklyScheduleSection,
  WeeklyScheduleTitle,
  WeeklyScheduleList,
  WeeklyScheduleItem,
  WeeklyScheduleDate,
  WeeklyScheduleDay,
  WeeklyScheduleEvents,
  WeeklyScheduleEvent,
  WeeklyScheduleDateContainer,
  WeeklyScheduleEmptyText,
  ReadOnlyCard,
  ReadOnlyCardHeader,
  ReadOnlyCardHeaderContent,
  ReadOnlyCardTitle,
  ReadOnlyCardDescription,
  ReadOnlyCardFooter,
  ReadOnlyCardFooterLeft,
  ReadOnlyCardDate,
  ReadOnlyCardAssignee,
  ReadOnlyCardComments,
  ReadOnlyBoard,
  ReadOnlyBoardTitleContainer,
  ReadOnlyBoardTitle,
  ReadOnlyBoardCards,
  ContentGrid,
  ContentGridLeft,
  ContentGridRight,
} from './AgencyProjectDetailPage.styled';

// 읽기 전용 카드 컴포넌트
function ReadOnlyCardComponent({ card }) {
  const commentCount = card.comments?.length || 0;

  return (
    <ReadOnlyCard>
      <ReadOnlyCardHeader>
        <ReadOnlyCardHeaderContent>
        {card.completed && (
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
        )}
        <ReadOnlyCardTitle>{card.title}</ReadOnlyCardTitle>
        </ReadOnlyCardHeaderContent>
      </ReadOnlyCardHeader>
      <ReadOnlyCardDescription>{card.description}</ReadOnlyCardDescription>
      <ReadOnlyCardFooter>
        <ReadOnlyCardFooterLeft>
          <ReadOnlyCardDate>
            <Calendar className="w-3 h-3" />
            <span>{card.dueDate}</span>
          </ReadOnlyCardDate>
          {card.assignedTo && (
            <ReadOnlyCardAssignee>
              <Users className="w-3 h-3" />
              <span>{card.assignedTo.name}</span>
            </ReadOnlyCardAssignee>
          )}
        </ReadOnlyCardFooterLeft>
        {commentCount > 0 && (
          <ReadOnlyCardComments>
            <MessageSquare className="w-3 h-3" />
            <span>{commentCount}</span>
          </ReadOnlyCardComments>
        )}
      </ReadOnlyCardFooter>
    </ReadOnlyCard>
  );
}

// 읽기 전용 보드 컴포넌트
function ReadOnlyBoardComponent({ board }) {
  return (
    <ReadOnlyBoard>
      <ReadOnlyBoardTitleContainer>
      <ReadOnlyBoardTitle>{board.title}</ReadOnlyBoardTitle>
      </ReadOnlyBoardTitleContainer>
      <ReadOnlyBoardCards>
        {board.cards.map((card) => (
          <ReadOnlyCardComponent key={card.id} card={card} />
        ))}
      </ReadOnlyBoardCards>
    </ReadOnlyBoard>
  );
}

export function AgencyProjectDetailPage({ project, onBack }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamMembersLoading, setTeamMembersLoading] = useState(false);

  useEffect(() => {
    if (!project?.id) return;
    const fetchMembers = async () => {
      setTeamMembersLoading(true);
      try {
        const result = await projectService.getProjectMembers(project.id);
        const list = Array.isArray(result) ? result : result?.content ?? result?.data ?? [];
        setTeamMembers(
          list.map((m) => ({
            id: m.memberNo,
            name: m.memberName || m.memberEmail || '-',
            role: m.projectMemberRole || '-',
            email: m.memberEmail || '',
            phone: m.memberPhone || '',
            status: m.memberStatus === '휴면' ? '휴면' : '출근',
            avatar: getMemberProfileUrl(m.memberProfileImage),
          }))
        );
      } catch (err) {
        toast.error('팀원 목록을 불러오는데 실패했습니다.');
        setTeamMembers([]);
      } finally {
        setTeamMembersLoading(false);
      }
    };
    fetchMembers();
  }, [project?.id]);

  // 칸반 보드 데이터 - DB(KANBAN_BOARD, KANBAN_CARD)에서 로드 (읽기 전용)
  const [boards, setBoards] = useState([]);
  const [boardsLoading, setBoardsLoading] = useState(false);

  useEffect(() => {
    if (!project?.id) return;
    const fetchBoards = async () => {
      setBoardsLoading(true);
      try {
        const result = await projectService.getKanbanBoard(project.id);
        const list = Array.isArray(result) ? result : result?.content ?? result?.data ?? [];
        const mapped = list.map((b) => ({
          id: b.id,
          title: b.title || '',
          cards: (b.cards || []).map((c) => ({
            id: c.id,
            title: c.title || '',
            description: c.description || '',
            startDate: c.startDate || '',
            dueDate: c.dueDate || '',
            boardId: c.boardId ?? b.id,
            completed: !!c.completed,
            assignedTo: c.assignedTo
              ? {
                  id: c.assignedTo.id,
                  name: c.assignedTo.name,
                  role: c.assignedTo.role,
                  email: c.assignedTo.email,
                  avatar: getMemberProfileUrl(c.assignedTo.avatar),
                }
              : null,
          })),
        }));
        setBoards(mapped);
      } catch (err) {
        toast.error('업무 보드를 불러오는데 실패했습니다.');
        setBoards([]);
      } finally {
        setBoardsLoading(false);
      }
    };
    fetchBoards();
  }, [project?.id]);

  // 이번 주 팀 일정 - 칸반 카드 기반 (시작일~마감일 사이 모든 날짜에 표시)
  const weeklySchedule = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const schedule = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
      const dayName = i === 0 ? `오늘 (${dayNames[d.getDay()]})` : dayNames[d.getDay()];
      const yyyyMmDd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const events = [];
      boards.forEach((board) => {
        (board.cards || []).forEach((card) => {
          const startStr = card.startDate ? String(card.startDate).slice(0, 10) : null;
          const dueStr = card.dueDate ? String(card.dueDate).slice(0, 10) : null;
          const assigneeName = card.assignedTo?.name || '';
          if (startStr && dueStr) {
            if (yyyyMmDd >= startStr && yyyyMmDd <= dueStr) {
              events.push({ title: card.title, assigneeName });
            }
          } else if (startStr && startStr === yyyyMmDd) {
            events.push({ title: card.title, assigneeName });
          } else if (dueStr && dueStr === yyyyMmDd) {
            events.push({ title: card.title, assigneeName });
          }
        });
      });
      schedule.push({ date: dateStr, day: dayName, events });
    }
    return schedule;
  }, [boards]);

  // 모달 상태
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // 상태별 배지 색상
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case '출근':
        return 'bg-green-500 hover:bg-green-600';
      case '워케이션':
        return 'bg-red-500 hover:bg-red-600';
      case '재택근무':
        return 'bg-blue-500 hover:bg-blue-600';
      case '휴면':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <AgencyProjectDetailRoot>
      <AgencyProjectDetailBody>
        {/* 상단 헤더 */}
        <BackButtonContainer>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            프로젝트 목록으로
          </Button>
        </BackButtonContainer>

        <ProjectHeaderCard>
          <ProjectHeaderContent>
            {/* 작품 표지 */}
            <ProjectThumbnail>
              <ImageWithFallback
                src={getProjectThumbnailUrl(project.thumbnail) || PROJECT_THUMBNAIL_PLACEHOLDER}
                alt={project.title}
                className="w-32 h-44 object-cover rounded-lg border-2 border-border shadow-md"
              />
            </ProjectThumbnail>

            {/* 작품 정보 */}
            <ProjectInfo>
              <ProjectTitle>{project.title}</ProjectTitle>

              {/* 작가명 */}
              {project.artistName && (
                <ProjectArtist>작가: {project.artistName}</ProjectArtist>
              )}
              
              <ProjectBadges>
                <Badge className="bg-primary text-sm px-3 py-1">{project.platform}</Badge>
                <Badge className="bg-green-500 text-sm px-3 py-1">{project.serialStatus}</Badge>
              </ProjectBadges>

              {/* 팀원 정보 */}
              <ProjectTeamSection>
                <ProjectTeamHeader>
                  <Users className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                  <span style={{ color: 'var(--foreground)', fontSize: '0.875rem' }}>
                    팀원 ({teamMembersLoading ? '...' : `${teamMembers.length}명`})
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsTeamModalOpen(true)}
                    disabled={teamMembersLoading}
                    style={{ 
                      marginLeft: '8px',
                      backgroundColor: 'var(--muted)',
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    팀원 보기
                  </Button>
                </ProjectTeamHeader>
              </ProjectTeamSection>
            </ProjectInfo>
          </ProjectHeaderContent>
        </ProjectHeaderCard>

        <ContentGrid>
          {/* 왼쪽 열: 프로젝트 관리 (칸반 보드) */}
          <ContentGridLeft>
            <ProjectManagementSection>
              <ProjectManagementTitle>업무 일정 보드</ProjectManagementTitle>

              <KanbanBoardsContainer>
                {boardsLoading ? (
                  <p className="text-sm text-muted-foreground">업무 보드 불러오는 중...</p>
                ) : boards.length === 0 ? (
                  <p className="text-sm text-muted-foreground">등록된 보드가 없습니다.</p>
                ) : (
                  boards.map((board) => (
                    <ReadOnlyBoardComponent key={board.id} board={board} />
                  ))
                )}
              </KanbanBoardsContainer>
            </ProjectManagementSection>
          </ContentGridLeft>

          {/* 오른쪽 열: 주간 캘린더 */}
          <ContentGridRight>
            <WeeklyScheduleSection>
              <WeeklyScheduleTitle>주간 캘린더</WeeklyScheduleTitle>

              <WeeklyScheduleList>
                {weeklySchedule.map((schedule, index) => (
                  <WeeklyScheduleItem key={index}>
                    <WeeklyScheduleDateContainer>
                      <WeeklyScheduleDate>{schedule.date}</WeeklyScheduleDate>
                      <WeeklyScheduleDay>{schedule.day}</WeeklyScheduleDay>
                    </WeeklyScheduleDateContainer>
                    {schedule.events.length > 0 ? (
                      <WeeklyScheduleEvents>
                        {schedule.events.map((event, eventIndex) => (
                          <WeeklyScheduleEvent key={eventIndex}>
                            <Circle className="w-2 h-2 fill-primary text-primary flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {event.title}
                              {event.assigneeName && ` (${event.assigneeName})`}
                            </span>
                          </WeeklyScheduleEvent>
                        ))}
                      </WeeklyScheduleEvents>
                    ) : (
                      <WeeklyScheduleEmptyText>캘린더 없음</WeeklyScheduleEmptyText>
                    )}
                  </WeeklyScheduleItem>
                ))}
              </WeeklyScheduleList>
            </WeeklyScheduleSection>
          </ContentGridRight>
        </ContentGrid>
      </AgencyProjectDetailBody>

      {/* 팀원 모달 */}
      <Modal
        isOpen={isTeamModalOpen}
        onClose={() => {
          setIsTeamModalOpen(false);
          setSelectedMember(null);
        }}
        title="팀원 보기"
        maxWidth="md"
      >
        <div>
          {/* 팀원 목록 */}
          <div className="space-y-0 divide-y divide-border">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="py-3 px-2 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div 
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  {/* 프로필 사진 */}
                  <ImageWithFallback
                    src={member.avatar || MEMBER_AVATAR_PLACEHOLDER}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  
                  {/* 이름과 역할 */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm">{member.name}</h4>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>

                  {/* 현재 상태 */}
                  <Badge className={`${getStatusBadgeColor(member.status)} text-xs px-2 py-1`}>
                    {member.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* 팀원 프로필 상세 모달 */}
      <Modal
        isOpen={selectedMember !== null}
        onClose={() => setSelectedMember(null)}
        title="팀원 프로필"
        maxWidth="md"
      >
        {selectedMember && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <ImageWithFallback
                src={selectedMember.avatar || MEMBER_AVATAR_PLACEHOLDER}
                alt={selectedMember.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-2">{selectedMember.name}</h3>
                <Badge className={getStatusBadgeColor(selectedMember.status)}>
                  {selectedMember.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">직무</p>
                  <p className="text-sm font-medium text-foreground">{selectedMember.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">이메일</p>
                  <p className="text-sm font-medium text-foreground">{selectedMember.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">전화번호</p>
                  <p className="text-sm font-medium text-foreground">{selectedMember.phone}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AgencyProjectDetailRoot>
  );
}
