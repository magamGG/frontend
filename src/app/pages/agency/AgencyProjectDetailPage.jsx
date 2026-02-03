import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/app/components/Modal';
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
import { getProjectThumbnailUrl, PROJECT_THUMBNAIL_PLACEHOLDER } from '@/api/config';













// 읽기 전용 카드 컴포넌트 (드래그 불가, 편집/삭제 버튼 없음)
/**
 * @param {Object} props
 * @param {Object} props.card
 */
function ReadOnlyCard({ card }) {
  const commentCount = card.comments?.length || 0;

  return (
    <div className="bg-white border-l-4 border-primary rounded-lg p-3 mb-2 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {card.completed && (
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          )}
          <h4 className="font-semibold text-sm text-foreground flex-1 break-words">{card.title}</h4>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{card.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{card.dueDate}</span>
          </div>
          {card.assignedTo && (
            <div className="flex items-center gap-1 text-xs">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-semibold text-primary">
                  {card.assignedTo.name.charAt(0)}
                </span>
              </div>
            </div>
          )}
        </div>
        {commentCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="w-3 h-3" />
            <span>{commentCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 읽기 전용 보드 컴포넌트 (드롭 불가, 추가/삭제 버튼 없음)
/**
 * @param {Object} props
 * @param {Object} props.board
 */
function ReadOnlyBoard({ board }) {
  return (
    <div className="bg-muted/30 rounded-lg p-4 min-w-[280px] max-w-[280px] flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground">{board.title}</h3>
      </div>
      
      <div className="space-y-2 mb-3 max-h-[500px] overflow-y-auto hide-scrollbar">
        {board.cards.map((card) => (
          <ReadOnlyCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export function AgencyProjectDetailPage({ 
  project, 
  onBack,
}: { 
  project: Project; 
  onBack: () => void;
}) {
  // 팀원 데이터
  const [teamMembers] = useState([
    {
      id,
      name: '김작가',
      role: '메인 작가',
      email: 'kim@example.com',
      phone: '010-1234-5678',
      status: '출근',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      id,
      name: '이채색',
      role: '채색 담당',
      email: 'lee@example.com',
      phone: '010-2345-6789',
      status: '출근',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  ]);

  // 칸반 보드 데이터 - localStorage에서 로드 (읽기 전용)
  const [boards] = useState(() => {
    const saved = localStorage.getItem(`kanban_boards_${project.id}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id,
        title: '할 일',
        cards: [
          { id, title: '43화 스토리보드', description: '스토리 구성 및 콘티 작업', startDate: '2026-01-15', dueDate: '2026-01-20', boardId, comments,
        ],
      },
      {
        id,
        title: '진행중',
        cards: [
          { id, title: '42화 채색', description: '메인 씬 채색 작업', startDate: '2026-01-16', dueDate: '2026-01-18', boardId, comments,
        ],
      },
      {
        id,
        title: '완료',
        cards: [
          { id, title: '41화 업로드', description: '네이버 웹툰 업로드 완료', startDate: '2026-01-13', dueDate: '2026-01-14', boardId, comments,
        ],
      },
    ];
  });

  // 주간 일정
  const [weeklySchedule] = useState([
    { date: '1/19', day: '오늘 (월)', events: ['42화 채색 마감', '팀 미팅 3PM'] },
    { date: '1/20', day: '화', events: ['43화 스토리보드 시작'] },
    { date: '1/21', day: '수', events,
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
    <div className="w-full h-full overflow-y-auto hide-scrollbar bg-background">
      <div className="pb-24 px-8 py-6">
        <div className="max-w-[1600px] mx-auto">
          {/* 상단 헤더 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                프로젝트 목록으로
              </Button>
            </div>

            <Card className="p-6">
              <div className="flex gap-6">
                {/* 작품 표지 */}
                <div className="flex-shrink-0">
                  <ImageWithFallback
                    src={getProjectThumbnailUrl(project.thumbnail) || PROJECT_THUMBNAIL_PLACEHOLDER}
                    alt={project.title}
                    className="w-32 h-44 object-cover rounded-lg border-2 border-border shadow-md"
                  />
                </div>

                {/* 작품 정보 */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-3">{project.title}</h1>

                  {/* 작가명 */}
                  {project.artistName && (
                    <div className="mb-3">
                      <p className="text-lg text-muted-foreground">작가: {project.artistName}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-4">
                    {/* 플랫폼 */}
                    <Badge className="bg-primary text-sm px-3 py-1">{project.platform}</Badge>

                    {/* 연재 상태 */}
                    <Badge className="bg-green-500 text-sm px-3 py-1">{project.serialStatus}</Badge>

                    {/* 현재 회차 */}
                    <span className="text-sm text-muted-foreground">
                      현재 {project.currentEpisode}화
                    </span>
                  </div>

                  {/* 팀원 정보 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">팀원</span>
                      <span className="text-xs text-muted-foreground">({teamMembers.length}명)</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsTeamModalOpen(true)}
                        className="ml-2"
                      >
                        팀원 보기
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* 왼쪽 열: 프로젝트 관리 (칸반 보드) */}
            <div className="col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">프로젝트 관리</h2>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                  {boards.map((board) => (
                    <ReadOnlyBoard key={board.id} board={board} />
                  ))}
                </div>
              </Card>
            </div>

            {/* 오른쪽 열: 주간 일정 */}
            <div className="col-span-1">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">주간 일정</h2>

                <div className="space-y-3">
                  {weeklySchedule.map((schedule, index) => (
                    <div key={index} className="pb-3 border-b border-border last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{schedule.date}</span>
                        <span className="text-xs text-muted-foreground">{schedule.day}</span>
                      </div>
                      {schedule.events.length > 0 ? (
                        <div className="space-y-1">
                          {schedule.events.map((event, eventIndex) => (
                            <div key={eventIndex} className="flex items-center gap-2">
                              <Circle className="w-2 h-2 fill-primary text-primary flex-shrink-0" />
                              <span className="text-xs text-muted-foreground">{event}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">일정 없음</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 팀원 목록 모달 (수정 버튼 없음) */}
      {isTeamModalOpen && (
        <Modal onClose={() => setIsTeamModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">팀원 목록</h2>
            
            <div className="space-y-3 mb-4">
              {teamMembers.map((member) => (
                <Card 
                  key={member.id} 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="flex items-center gap-4">
                    <ImageWithFallback
                      src={member.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-border"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{member.name}</h3>
                        <Badge className={`text-xs ${getStatusBadgeColor(member.status)}`}>
                          {member.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 팀원 상세 정보 */}
          {selectedMember && (
            <div className="border-t border-border p-6 bg-muted/30">
              <h3 className="text-lg font-bold text-foreground mb-3">상세 정보</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedMember.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedMember.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedMember.role}</span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
