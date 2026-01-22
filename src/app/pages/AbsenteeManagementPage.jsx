import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/app/components/Modal';
import { Calendar, User, Clock, CheckCircle2, XCircle, Plus, AlignLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * AbsenteeManagementPage component
 */
export function AbsenteeManagementPage() {
  const [absenceRequests, setAbsenceRequests] = useState([
    {
      id: 1,
      name: '박채색',
      role: '채색 담당',
      reason: '휴재',
      startDate: '2026.01.10',
      endDate: '2026.01.20',
      status: '승인됨',
      projects: ['학원물', '액션 판타지'],
      description: '개인 건강 관리를 위한 일시 중단'
    },
    {
      id: 2,
      name: '최스토리',
      role: '스토리 작가',
      reason: '긴급 휴재',
      startDate: '2026.01.12',
      endDate: '2026.01.15',
      status: '대기중',
      projects: ['로맨스 판타지'],
      description: '건강 상의 이유로 긴급 휴재'
    }
  ]);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newRequest, setNewRequest] = useState({
    reason: 'break',
    startDate: '',
    endDate: '',
    projects: '',
    description: '',
  });

  /**
   * Handle request submission
   */
  const handleRequestSubmit = () => {
    // 임시로 작가 본인 이름 사용
    const request = {
      id: Date.now(),
      name: '김작가',
      role: '작가',
      reason: 
        newRequest.reason === 'break' ? '휴재' :
        newRequest.reason === 'emergency-break' ? '긴급 휴재' :
        newRequest.reason === 'workation' ? '워케이션' :
        '건강 관리',
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      status: '대기중',
      projects: newRequest.projects.split(',').map(p => p.trim()),
      description: newRequest.description,
    };
    
    setAbsenceRequests([...absenceRequests, request]);
    setIsRequestModalOpen(false);
    setNewRequest({
      reason: 'break',
      startDate: '',
      endDate: '',
      projects: '',
      description: '',
    });
    toast.success('근태 신청이 완료되었습니다.');
  };

  const handleApprove = (id: number) => {
    setAbsenceRequests(absenceRequests.map(req => 
      req.id === id ? { ...req, status: '승인됨' } : req
    ));
    toast.success('근태가 승인되었습니다.');
  };

  const handleReject = (id: number) => {
    setAbsenceRequests(absenceRequests.filter(req => req.id !== id));
    toast.error('근태가 거부되었습니다.');
  };

  /**
   * Open detail modal for a request
   * @param {Object} request - Absence request object
   */
  const openDetailModal = (request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="w-full h-full">
      <div className="pb-24 px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">현재 휴재 중</span>
              </div>
              <p className="text-2xl font-bold text-foreground">2명</p>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3 h-3 text-primary" />
                <span className="text-xs text-muted-foreground">예정된 휴재</span>
              </div>
              <p className="text-2xl font-bold text-foreground">3건</p>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-3 h-3 text-destructive" />
                <span className="text-xs text-muted-foreground">승인 대기</span>
              </div>
              <p className="text-2xl font-bold text-foreground">1건</p>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-3 h-3 text-primary" />
                <span className="text-xs text-muted-foreground">이번 달 승인</span>
              </div>
              <p className="text-2xl font-bold text-foreground">5건</p>
            </Card>
          </div>

          {/* Request Button */}
          <div className="flex justify-end">
            <Button onClick={() => setIsRequestModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              근태 신청
            </Button>
          </div>

          {/* Current Absences */}
          <Card className="p-4 flex-1 overflow-hidden">
            <h3 className="text-base font-semibold text-foreground mb-3">현재 휴재 중인 작가/팀원</h3>
            <div className="space-y-3">
              {absenceRequests.map((person) => (
                <div 
                  key={person.id} 
                  className="p-3 bg-muted/30 rounded border border-border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => openDetailModal(person)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-foreground">
                          {person.name[0]}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{person.name}</h4>
                        <p className="text-xs text-muted-foreground">{person.role}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={person.status === '승인됨' ? 'default' : 'secondary'}
                    >
                      {person.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">사유</p>
                      <p className="text-xs font-medium text-foreground">{person.reason}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">기간</p>
                      <p className="text-xs font-medium text-foreground">
                        {person.startDate} ~ {person.endDate}
                      </p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground mb-0.5">담당 작품</p>
                    <p className="text-xs font-medium text-foreground">{person.projects.join(', ')}</p>
                  </div>

                  {person.status === '대기중' && (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" className="flex-1" onClick={() => handleApprove(person.id)}>승인</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleReject(person.id)}>거부</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Schedule */}
          <Card className="p-4 flex-shrink-0">
            <h3 className="text-base font-semibold text-foreground mb-3">예정된 휴재 일정</h3>
            <div className="space-y-2">
              {[
                { name: '이어시', dates: '2026.02.01 - 02.05', reason: '휴재' },
                { name: '정배경', dates: '2026.02.10 - 02.15', reason: '워케이션' },
                { name: '김작가', dates: '2026.03.01 - 03.10', reason: '워케이션' }
              ].map((schedule, idx) => (
                <div key={idx} className="p-3 bg-muted/30 rounded border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{schedule.name}</p>
                      <p className="text-xs text-muted-foreground">{schedule.dates}</p>
                    </div>
                    <Badge variant="outline">{schedule.reason}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 근태 신청 모달 */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="근태 신청"
        maxWidth="xl"
      >
        <div className="space-y-3">
          {/* 사유 선택 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">사유</label>
            <select
              value={newRequest.reason}
              onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
            >
              <option value="break">휴재</option>
              <option value="emergency-break">긴급 휴재</option>
              <option value="workation">워케이션</option>
              <option value="sick-leave">건강 관리</option>
            </select>
          </div>

          {/* 날짜 */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">시작 날짜</label>
              <input
                type="date"
                value={newRequest.startDate}
                onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">종료 날짜</label>
              <input
                type="date"
                value={newRequest.endDate}
                onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
              />
            </div>
          </div>

          {/* 담당 작품 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">담당 작품</label>
            <input
              type="text"
              placeholder="작품명을 쉼표로 구분하여 입력 (예: 내 웹툰, 신작)"
              value={newRequest.projects}
              onChange={(e) => setNewRequest({ ...newRequest, projects: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
            />
          </div>

          {/* 상세 설명 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
              <AlignLeft className="w-4 h-4" />
              상세 설명
            </label>
            <textarea
              placeholder="상세한 사유를 입력해주세요"
              value={newRequest.description}
              onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsRequestModalOpen(false)}
            >
              취소
            </Button>
            <Button onClick={handleRequestSubmit}>
              신청
            </Button>
          </div>
        </div>
      </Modal>

      {/* 상세 정보 모달 */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="근태 상세 정보"
        maxWidth="lg"
      >
        {selectedRequest && (
          <div className="space-y-3">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground">
                    {selectedRequest.name[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedRequest.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedRequest.role}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">상태:</span>
                  <Badge variant={selectedRequest.status === '승인됨' ? 'default' : 'secondary'}>
                    {selectedRequest.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">사유:</span>
                  <span className="font-medium text-foreground">{selectedRequest.reason}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">기간:</span>
                  <span className="font-medium text-foreground">
                    {selectedRequest.startDate} ~ {selectedRequest.endDate}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-muted-foreground">담당 작품:</span>
                  <span className="font-medium text-foreground text-right">
                    {selectedRequest.projects.join(', ')}
                  </span>
                </div>
                {selectedRequest.description && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-muted-foreground block mb-1">상세 설명:</span>
                    <p className="text-foreground">{selectedRequest.description}</p>
                  </div>
                )}
              </div>
            </div>

            {selectedRequest.status === '대기중' && (
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  onClick={() => {
                    handleApprove(selectedRequest.id);
                    setIsDetailModalOpen(false);
                  }}
                >
                  승인
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    handleReject(selectedRequest.id);
                    setIsDetailModalOpen(false);
                  }}
                >
                  거부
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
