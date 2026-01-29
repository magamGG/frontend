import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Users, Mail, MessageCircle, Calendar } from 'lucide-react';

const teamMembers = [
  {
    id,
    name: '김작가',
    role: '메인 작가',
    status: '출근',
    avatar: '김',
    projects: ['내 웹툰'],
    productivity,
    workHours: '8.5시간',
    isMe,
  {
    id,
    name: '이어시',
    role: '어시스턴트',
    status: '출근',
    avatar: '이',
    projects: ['내 웹툰'],
    productivity,
    workHours: '7.2시간',
    isMe,
  {
    id,
    name: '박채색',
    role: '채색 담당',
    status: '휴재',
    avatar: '박',
    projects: ['내 웹툰'],
    productivity,
    workHours: '-',
    isMe,
  {
    id,
    name: '정배경',
    role: '배경 담당',
    status: '출근',
    avatar: '정',
    projects: ['내 웹툰'],
    productivity,
    workHours: '6.8시간',
    isMe: false
  }
];

export function ArtistTeamPage() {
  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar">
      <div className="pb-24 px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">내 팀</h1>
            <p className="text-sm text-muted-foreground mt-1">함께 작업하는 팀원들을 확인하고 소통하세요</p>
          </div>

          {/* Team Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">총 팀원</p>
                  <p className="text-2xl font-bold text-foreground mt-1">4명</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">출근</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">3명</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">휴재</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">1명</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">평균 생산성</p>
                  <p className="text-2xl font-bold text-foreground mt-1">86%</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">%</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Team Members */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">팀원 목록</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {teamMembers.map((member) => (
                <div 
                  key={member.id} 
                  className={`p-5 rounded-lg border-2 transition-all ${
                    member.isMe 
                      ? 'bg-primary/5 border-primary/30' 
                      : 'bg-muted/30 border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                      member.isMe ? 'bg-primary' : 'bg-muted'
                    }`}>
                      <span className={`text-xl font-bold ${
                        member.isMe ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}>
                        {member.avatar}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                        {member.isMe && (
                          <Badge className="bg-primary text-xs">나</Badge>
                        )}
                        <Badge 
                          variant={member.status === '출근' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {member.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">담당 작품</span>
                      <span className="text-sm font-medium text-foreground">{member.projects.join(', ')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">근무 시간</span>
                      <span className="text-sm font-medium text-foreground">{member.workHours}</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">생산성</span>
                        <span className="text-sm font-medium text-foreground">{member.productivity}%</span>
                      </div>
                      <Progress value={member.productivity} className="h-2" />
                    </div>
                  </div>

                  {!member.isMe && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Mail className="w-4 h-4 mr-2" />
                        이메일
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        메시지
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Team Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">최근 활동</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-foreground">이</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground"><strong>이어시</strong> 님이 에피소드 42 채색을 완료했습니다.</p>
                  <p className="text-xs text-muted-foreground mt-1">2시간 전</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-muted-foreground">정</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground"><strong>정배경</strong> 님이 배경 작업 5개를 업로드했습니다.</p>
                  <p className="text-xs text-muted-foreground mt-1">5시간 전</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-muted-foreground">박</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground"><strong>박채색</strong> 님이 휴재를 신청했습니다.</p>
                  <p className="text-xs text-muted-foreground mt-1">어제</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-foreground">김</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground"><strong>김작가</strong> 님이 에피소드 43 스케치를 업로드했습니다.</p>
                  <p className="text-xs text-muted-foreground mt-1">2일 전</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
