import { useState } from 'react';
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
  // TODO: Zustand store mapping - 팀원 및 프로젝트 데이터
  const teamMembersData = [
    {
      id: 1,
      name: '김작가',
      role: '메인 작가',
      email: 'kim@example.com',
      phone: '010-1234-5678',
      status: '출근',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      id: 2,
      name: '이채색',
      role: '채색 담당',
      email: 'lee@example.com',
      phone: '010-2345-6789',
      status: '출근',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  ];

  const [teamMembers] = useState(teamMembersData);

  // 칸반 보드 데이터 - localStorage에서 로드 (읽기 전용)
  const [boards] = useState(() => {
    const saved = localStorage.getItem(`kanban_boards_${project.id}`);
    if (saved) {
      const parsedBoards = JSON.parse(saved);
      // 담당자 정보를 팀원 데이터와 매칭
      return parsedBoards.map(board => ({
        ...board,
        cards: board.cards.map(card => ({
          ...card,
          assignedTo: card.assignedTo ? teamMembersData.find(m => m.id === card.assignedTo.id || m.name === card.assignedTo.name) : null
        }))
      }));
    }
    return [
      {
        id: 1,
        title: '할 일',
        cards: [
          { id: 1, title: '43화 스토리보드', description: '스토리 구성 및 콘티 작업', startDate: '2026-01-15', dueDate: '2026-01-20', boardId: 1, comments: [], assignedTo: teamMembersData[0], completed: false },
        ],
      },
      {
        id: 2,
        title: '진행중',
        cards: [
          { id: 3, title: '42화 채색', description: '메인 씬 채색 작업', startDate: '2026-01-16', dueDate: '2026-01-18', boardId: 2, comments: [], assignedTo: teamMembersData[1], completed: false },
        ],
      },
      {
        id: 3,
        title: '완료',
        cards: [
          { id: 4, title: '41화 업로드', description: '네이버 웹툰 업로드 완료', startDate: '2026-01-13', dueDate: '2026-01-14', boardId: 3, comments: [], assignedTo: teamMembersData[0], completed: true },
        ],
      },
    ];
  });

  // 주간 캘린더
  const [weeklySchedule] = useState([
    { date: '1/19', day: '오늘 (월)', events: ['42화 채색 마감', '팀 미팅 3PM'] },
    { date: '1/20', day: '화', events: ['43화 스토리보드 시작'] },
    { date: '1/21', day: '수', events: [] },
    { date: '1/22', day: '목', events: ['42화 최종 검수'] },
    { date: '1/23', day: '금', events: ['42화 업로드'] },
    { date: '1/24', day: '토', events: ['43화 스토리보드 마감'] },
    { date: '1/25', day: '일', events: ['44화 기획 회의'] },
  ]);

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
                src={project.thumbnail || 'https://images.unsplash.com/photo-1591788806059-cb6e2f6a2498?w=400'}
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
                    팀원 ({teamMembers.length}명)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsTeamModalOpen(true)}
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
                {boards.map((board) => (
                  <ReadOnlyBoardComponent key={board.id} board={board} />
                ))}
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
                            <span className="text-xs text-muted-foreground">{event}</span>
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
                    src={member.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
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
                src={selectedMember.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
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
