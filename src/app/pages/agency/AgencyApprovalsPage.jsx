import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Textarea } from '@/app/components/ui/textarea';
import { CheckCircle2, XCircle, Calendar, FileText, Clock, AlertCircle, User, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';









export function AgencyApprovalsPage() {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('vacation');

  // 요청 데이터
  const [requests, setRequests] = useState([
    {
      id,
      type: '휴가',
      category,
      requester: '김담당자',
      role: '시니어 매니저',
      startDate: '2026-01-20',
      endDate: '2026-01-22',
      days,
      reason: '개인 사유로 인한 휴가 신청',
      status: '대기',
      submittedDate: '2026-01-15',
    },
    {
      id,
      type: '신작',
      category,
      requester: '이담당자',
      role: '매니저',
      projectName: '새로운 판타지 웹툰',
      artist: '신작가',
      platform: '네이버',
      reason: '신규 프로젝트 계약 승인 요청',
      status: '대기',
      submittedDate: '2026-01-14',
    },
    {
      id,
      type: '휴가',
      category,
      requester: '박담당자',
      role: '주니어 매니저',
      startDate: '2026-01-16',
      endDate: '2026-01-18',
      days,
      reason: '건강 검진 및 치료',
      status: '대기',
      submittedDate: '2026-01-15',
    },
    {
      id,
      type: '신작',
      category,
      requester: '최담당자',
      role: '매니저',
      projectName: '로맨스 드라마',
      artist: '유작가',
      platform: '카카오',
      reason: '계약 연장 승인 요청 (시즌 2)',
      status: '대기',
      submittedDate: '2026-01-13',
    },
    {
      id,
      type: '가입',
      category,
      requester: '박신입',
      role: '작가',
      email: 'newartist@email.com',
      phone: '010-9999-8888',
      reason: '신규 작가 가입 신청',
      status: '대기',
      submittedDate: '2026-01-12',
    },
    {
      id,
      type: '가입',
      category,
      requester: '정신입',
      role: '담당자',
      email: 'newmanager@email.com',
      phone: '010-8888-7777',
      reason: '신규 담당자 가입 신청',
      status: '대기',
      submittedDate: '2026-01-11',
    },
    {
      id,
      type: '휴가',
      category,
      requester: '이담당자',
      role: '매니저',
      startDate: '2026-01-10',
      endDate: '2026-01-12',
      days,
      reason: '가족 행사',
      status: '승인',
      submittedDate: '2026-01-05',
      processedDate: '2026-01-06',
    },
    {
      id,
      type: '신작',
      category,
      requester: '김담당자',
      role: '시니어 매니저',
      projectName: '액션 만화',
      artist: '강작가',
      platform: '레진코믹스',
      reason: '신규 액션 만화 계약',
      status: '승인',
      submittedDate: '2026-01-08',
      processedDate: '2026-01-09',
    },
    {
      id,
      type: '가입',
      category,
      requester: '김작가',
      role: '작가',
      email: 'rejected@email.com',
      phone: '010-7777-6666',
      reason: '신규 작가 가입 신청',
      status: '반려',
      submittedDate: '2026-01-05',
      rejectionReason: '포트폴리오 검토 후 재신청 요망',
      processedDate: '2026-01-06',
    },
  ]);

  // 카테고리별 필터링
  const filteredRequests = requests.filter(r => r.category === selectedCategory);
  const pendingRequests = filteredRequests.filter(r => r.status === '대기');
  const processedRequests = filteredRequests.filter(r => r.status !== '대기')
    .sort((a, b) => {
      const dateA = new Date(a.processedDate || '').getTime();
      const dateB = new Date(b.processedDate || '').getTime();
      return dateB - dateA;
    });

  const handleApprove = (request) => {
    setRequests(requests.map(r => 
      r.id === request.id 
        ? { ...r, status: '승인', processedDate: new Date().toISOString().split('T')[0] }
        : r
    ));
    toast.success(`${request.requester}의 ${request.type} 신청이 승인되었습니다.`);
  };

  const handleOpenRejectModal = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('반려 사유를 입력해주세요.');
      return;
    }

    if (selectedRequest) {
      setRequests(requests.map(r => 
        r.id === selectedRequest.id 
          ? { 
              ...r, 
              status: '반려', 
              rejectionReason,
              processedDate: new Date().toISOString().split('T')[0]
            }
          : r
      ));
      toast.success(`${selectedRequest.requester}의 ${selectedRequest.type} 신청이 반려되었습니다.`);
    }

    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  const getTypeColor = (type) => {
    switch (type) {
      case '휴가':
        return 'bg-[#9C27B0]'; // 보라색
      case '가입':
        return 'bg-[#00ACC1]'; // 청록색
      case '신작':
        return 'bg-[#FF9800]'; // 오렌지색
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '대기':
        return 'bg-yellow-500';
      case '승인':
        return 'bg-green-500';
      case '반려':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 통계 계산
  const allPendingCount = requests.filter(r => r.status === '대기').length;
  const thisMonthApproved = requests.filter(r => r.status === '승인').length;
  const thisMonthRejected = requests.filter(r => r.status === '반려').length;

  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar">
      <div className="pb-24 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">요청 관리</h1>
            <p className="text-sm text-muted-foreground mt-1">직원들의 휴가, 가입, 작가의 신작을 처리할 수 있습니다</p>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-medium text-muted-foreground">승인 대기</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{allPendingCount}건</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-muted-foreground">이번 달 승인</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{thisMonthApproved}건</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-muted-foreground">이번 달 반려</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{thisMonthRejected}건</p>
            </Card>
          </div>

          {/* 카테고리 필터 */}
          <Card className="p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">카테고리:</span>
              <div className="flex gap-2">
                <Button
                  variant={selectedCategory === 'vacation' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('vacation')}
                  className={selectedCategory === 'vacation' ? 'bg-[#9C27B0] hover:bg-[#9C27B0]/90' : ''}
                >
                  휴가
                </Button>
                <Button
                  variant={selectedCategory === 'join' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('join')}
                  className={selectedCategory === 'join' ? 'bg-[#00ACC1] hover:bg-[#00ACC1]/90' : ''}
                >
                  가입
                </Button>
                <Button
                  variant={selectedCategory === 'project' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('project')}
                  className={selectedCategory === 'project' ? 'bg-[#FF9800] hover:bg-[#FF9800]/90' : ''}
                >
                  신작
                </Button>
              </div>
            </div>
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: 승인/반려 대기 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">승인 대기 중</h3>
                {pendingRequests.length > 0 && (
                  <Badge className="bg-white border border-border">{pendingRequests.length}건</Badge>
                )}
              </div>

              <div className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <Card className="p-8">
                    <div className="text-center text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">대기 중인 신청이 없습니다</p>
                    </div>
                  </Card>
                ) : (
                  pendingRequests.map((request) => (
                    <Card key={request.id} className="p-5 bg-white border-2 border-border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-foreground">{request.requester}</h4>
                            <Badge className={`${getTypeColor(request.type)} text-xs`}>
                              {request.type}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3" />
                              <span>{request.role}</span>
                            </div>
                            
                            {request.category === 'vacation' && (
                              <>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    {formatDate((request).startDate)} ~ {formatDate((request).endDate)} 
                                    ({(request).days}일)
                                  </span>
                                </div>
                              </>
                            )}
                            
                            {request.category === 'join' && (
                              <>
                                <div className="flex items-center gap-2">
                                  <FileText className="w-3 h-3" />
                                  <span>{(request).email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="w-3 h-3" />
                                  <span>{(request).phone}</span>
                                </div>
                              </>
                            )}
                            
                            {request.category === 'project' && (
                              <>
                                <div className="flex items-center gap-2">
                                  <Briefcase className="w-3 h-3" />
                                  <span>{(request).projectName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="w-3 h-3" />
                                  <span>작가: {(request).artist}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="w-3 h-3" />
                                  <span>플랫폼: {(request).platform}</span>
                                </div>
                              </>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <FileText className="w-3 h-3" />
                              <span>{request.reason}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              <span>신청일: {formatDate(request.submittedDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-border">
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(request)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          승인
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handleOpenRejectModal(request)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          반려
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Right: 승인/반려 내역 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">처리 내역</h3>
                <Badge variant="outline">{processedRequests.length}건</Badge>
              </div>

              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {processedRequests.length === 0 ? (
                  <Card className="p-8 bg-white">
                    <div className="text-center text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">처리된 내역이 없습니다</p>
                    </div>
                  </Card>
                ) : (
                  processedRequests.map((request) => (
                    <Card 
                      key={request.id} 
                      className={`p-4 ${
                        request.status === '승인' 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-foreground">{request.requester}</h5>
                            <Badge className={`${getTypeColor(request.type)} text-xs`}>
                              {request.type}
                            </Badge>
                            <Badge className={`${getStatusColor(request.status)} text-xs`}>
                              {request.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            {request.category === 'vacation' && (
                              <div>
                                {formatDate((request).startDate)} ~ {formatDate((request).endDate)} 
                                ({(request).days}일)
                              </div>
                            )}
                            {request.category === 'join' && (
                              <div>{(request).email}</div>
                            )}
                            {request.category === 'project' && (
                              <div>{(request).projectName} - {(request).artist}</div>
                            )}
                            <div>사유: {request.reason}</div>
                            {request.status === '반려' && request.rejectionReason && (
                              <div className="flex items-start gap-1 mt-2 p-2 bg-red-100 rounded border border-red-200">
                                <AlertCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                                <span className="text-red-900">반려 사유: {request.rejectionReason}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground pt-2 border-t">
                        처리일: {formatDate(request.processedDate || '')}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 반려 사유 입력 모달 */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">반려 사유 입력</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              {selectedRequest?.requester}의 {selectedRequest?.type} 신청을 반려하는 사유를 입력해주세요.
            </p>
            <Textarea
              placeholder="반려 사유를 입력하세요..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[120px] bg-white border-[#DADDE1] text-[#1F2328]"
            />
          </div>
          <div className="flex gap-2 justify-end pt-4 border-t border-[#DADDE1]">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason('');
              }}
            >
              취소
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white" 
              onClick={handleReject}
            >
              반려하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}