import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Users, Plus, MoreVertical, CheckCircle2, Clock, AlertTriangle, Mail, MessageCircle } from 'lucide-react';

const teamMembers = [
  {
    id: 1,
    name: '김작가',
    role: '메인 작가',
    status: '출근',
    avatar: '김',
    projects: ['로맨스 판타지', '학원물'],
    productivity: 85,
    workHours: '8.5시간'
  },
  {
    id: 2,
    name: '이어시',
    role: '어시스턴트',
    status: '출근',
    avatar: '이',
    projects: ['로맨스 판타지'],
    productivity: 92,
    workHours: '7.2시간'
  },
  {
    id: 3,
    name: '박채색',
    role: '채색 담당',
    status: '휴가',
    avatar: '박',
    projects: ['학원물', '액션 판타지'],
    productivity: 78,
    workHours: '-'
  },
  {
    id: 4,
    name: '정배경',
    role: '배경 담당',
    status: '출근',
    avatar: '정',
    projects: ['액션 판타지'],
    productivity: 88,
    workHours: '6.8시간'
  }
];

export function TeamPage() {
  return (
    <div className="w-full h-full">
      <div className="pb-24 px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                팀원 추가
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">전체</Button>
                <Button variant="outline" size="sm">출근</Button>
                <Button variant="outline" size="sm">휴가</Button>
              </div>
            </div>
          </div>

          {/* Team Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
            <Card className="p-3">
              <p className="text-xs text-muted-foreground mb-1">총 팀원</p>
              <p className="text-2xl font-bold text-foreground">4명</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground mb-1">출근</p>
              <p className="text-2xl font-bold text-primary">3명</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground mb-1">휴가/휴재</p>
              <p className="text-2xl font-bold text-secondary">1명</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground mb-1">평균 생산성</p>
              <p className="text-2xl font-bold text-foreground">86%</p>
            </Card>
          </div>

          {/* Team Members */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
            {teamMembers.map((member) => (
              <Card key={member.id} className="p-4 overflow-hidden">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary-foreground">{member.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-foreground">{member.name}</h3>
                      <Badge 
                        variant={member.status === '출근' ? 'default' : 'secondary'}
                      >
                        {member.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">담당 작품</span>
                    <span className="text-xs font-medium text-foreground truncate ml-2">{member.projects.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">근무 시간</span>
                    <span className="text-xs font-medium text-foreground">{member.workHours}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">생산성</span>
                      <span className="text-xs font-medium text-foreground">{member.productivity}%</span>
                    </div>
                    <Progress value={member.productivity} className="h-1.5" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <Mail className="w-3 h-3 mr-1" />
                    이메일
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    메시지
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}