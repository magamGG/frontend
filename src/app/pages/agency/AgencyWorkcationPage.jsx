import { useState } from 'react';
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
  FileText
} from 'lucide-react';
import { mockWorkcationMembers } from '@/app/data/mockData';
import { WorkcationMember } from '@/app/types';

export function AgencyWorkcationPage() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [filterRole, setFilterRole] = useState('all');

  // Calculate days remaining for each member
  const getDaysRemaining = (endDate) => {
    const today = new Date('2026-01-16');
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  // Filter members by role
  const filteredMembers = filterRole === 'all' 
    ? mockWorkcationMembers 
    : mockWorkcationMembers.filter(m => m.role === filterRole);

  // Calculate statistics
  const stats = {
    total: mockWorkcationMembers.length,
    avgProgress: Math.round(
      mockWorkcationMembers.reduce((acc, m) => acc + (m.dailyReport?.progress || 0), 0) / mockWorkcationMembers.length
    ),
    totalTasks: mockWorkcationMembers.reduce((acc, m) => acc + m.tasks.length, 0),
    completedTasks: mockWorkcationMembers.reduce(
      (acc, m) => acc + m.tasks.filter(t => t.progress === 100).length, 
      0
    ),
  };

  return (
    <div className="h-full overflow-y-auto bg-[#FAFAFA] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2328] mb-2">원격 관리</h1>
            <p className="text-[#6E8FB3]">원격 근무 중인 팀원들의 작업 현황을 관리합니다</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterRole === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterRole('all')}
              className={filterRole === 'all' ? 'bg-[#3F4A5A]' : ''}
            >
              전체
            </Button>
            <Button
              variant={filterRole === 'story' ? 'default' : 'outline'}
              onClick={() => setFilterRole('story')}
              className={filterRole === 'story' ? 'bg-[#3F4A5A]' : ''}
            >
              스토리
            </Button>
            <Button
              variant={filterRole === 'line' ? 'default' : 'outline'}
              onClick={() => setFilterRole('line')}
              className={filterRole === 'line' ? 'bg-[#3F4A5A]' : ''}
            >
              라인
            </Button>
            <Button
              variant={filterRole === 'coloring' ? 'default' : 'outline'}
              onClick={() => setFilterRole('coloring')}
              className={filterRole === 'coloring' ? 'bg-[#3F4A5A]' : ''}
            >
              컬러링
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-none shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6E8FB3] mb-1">원격 인원</p>
                <p className="text-3xl font-bold text-[#1F2328]">{stats.total}명</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6E8FB3] mb-1">진행 중인 작업</p>
                <p className="text-3xl font-bold text-[#1F2328]">{stats.totalTasks}개</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6E8FB3] mb-1">완료된 작업</p>
                <p className="text-3xl font-bold text-[#1F2328]">{stats.completedTasks}개</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Workcation Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
            const daysRemaining = getDaysRemaining(member.endDate);
            const avgProgress = Math.round(
              member.tasks.reduce((acc, t) => acc + t.progress, 0) / member.tasks.length
            );

            return (
              <Card 
                key={member.id}
                className="border-none shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer bg-white overflow-hidden group"
                onClick={() => setSelectedMember(member)}
              >
                {/* Header with gradient */}
                <div className="bg-[#3F4A5A] p-6 pb-8">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-white/20 text-white border-none">
                      워케이션 진행 중
                    </Badge>
                    <Badge className="bg-white/90 text-[#3F4A5A] border-none">
                      D-{daysRemaining}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full border-4 border-white/20 object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-purple-100 text-sm">
                        {getRoleDisplay(member.role, member.customRole)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Location & Date */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#1F2328]">
                      <MapPin className="w-4 h-4 text-[#3F4A5A]" />
                      <span className="text-sm font-medium">{member.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#6E8FB3]">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {member.startDate.slice(5)} ~ {member.endDate.slice(5)}
                      </span>
                    </div>
                  </div>

                  {/* Projects */}
                  <div>
                    <p className="text-xs text-[#6E8FB3] mb-2">담당 작품</p>
                    <div className="flex flex-wrap gap-1">
                      {member.projectNames.map((project, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline" 
                          className="text-xs border-[#DADDE1] text-[#1F2328]"
                        >
                          {project}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6E8FB3]">전체 작업 진행률</span>
                      <span className="text-sm font-semibold text-[#1F2328]">{avgProgress}%</span>
                    </div>
                    <Progress value={avgProgress} className="h-2" />
                  </div>

                  {/* Tasks Summary */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#DADDE1]">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-[#6E8FB3]">
                        작업 <span className="font-semibold text-[#1F2328]">{member.tasks.length}개</span>
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-[#3F4A5A] hover:text-[#3F4A5A]/80 hover:bg-[#3F4A5A]/10 group-hover:translate-x-1 transition-transform"
                    >
                      상세보기
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <Card className="p-12 text-center border-none shadow-sm bg-white">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1F2328] mb-2">
                  워케이션 중인 팀원이 없습니다
                </h3>
                <p className="text-[#6E8FB3]">
                  선택한 역할의 워케이션 인원이 없습니다
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">워케이션 상세 정보</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Member Info Card */}
                <div className="bg-[#3F4A5A] rounded-lg p-6 text-white">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedMember.avatar}
                        alt={selectedMember.name}
                        className="w-20 h-20 rounded-full border-4 border-white/20 object-cover"
                      />
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{selectedMember.name}</h3>
                        <p className="text-white/70">
                          {getRoleDisplay(selectedMember.role, selectedMember.customRole)}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-white/20 text-white border-none text-sm">
                      워케이션 진행 중
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm text-white/70">위치</span>
                      </div>
                      <p className="font-semibold">{selectedMember.location}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm text-white/70">기간</span>
                      </div>
                      <p className="font-semibold">
                        {selectedMember.startDate} ~ {selectedMember.endDate}
                      </p>
                      <p className="text-sm text-white/70 mt-1">
                        (D-{getDaysRemaining(selectedMember.endDate)}일 남음)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm text-white/70">이메일</span>
                      </div>
                      <p className="text-sm">{selectedMember.contact.email}</p>
                    </div>
                    {selectedMember.contact.phone && (
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm text-white/70">연락처</span>
                        </div>
                        <p className="text-sm">{selectedMember.contact.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Daily Report */}
                {selectedMember.dailyReport && (
                  <Card className="p-6 border-none shadow-sm bg-blue-50">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-[#1F2328]">현재 작업 중인 업무</h4>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {selectedMember.dailyReport.lastUpdated}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-[#6E8FB3] mb-2">전체 진행률</p>
                        <div className="flex items-center gap-3">
                          <Progress value={selectedMember.dailyReport.progress} className="flex-1" />
                          <span className="text-lg font-bold text-[#1F2328]">
                            {selectedMember.dailyReport.progress}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#1F2328] mb-2">완료한 작업</p>
                        <ul className="space-y-1">
                          {selectedMember.dailyReport.tasksCompleted.map((task, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-[#1F2328]">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Tasks List */}
                <div>
                  <h4 className="font-semibold text-[#1F2328] mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#6E8FB3]" />
                    담당 작업 목록
                  </h4>
                  <div className="space-y-3">
                    {selectedMember.tasks.map((task) => (
                      <Card key={task.id} className="p-4 border-none shadow-sm bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-semibold text-[#1F2328]">{task.title}</h5>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(task.priority)}`}
                              >
                                {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '보통' : '낮음'}
                              </Badge>
                            </div>
                            <p className="text-sm text-[#6E8FB3]">{task.projectName}</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-[#6E8FB3]">
                            <Clock className="w-4 h-4" />
                            <span>{task.deadline}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#6E8FB3]">진행률</span>
                            <span className="font-semibold text-[#1F2328]">{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>

                        {task.progress === 100 && (
                          <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>작업 완료</span>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <h4 className="font-semibold text-[#1F2328] mb-4">참여 작품</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.projectNames.map((project, idx) => (
                      <Badge 
                        key={idx}
                        variant="outline"
                        className="px-4 py-2 text-sm border-[#DADDE1] text-[#1F2328]"
                      >
                        {project}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}