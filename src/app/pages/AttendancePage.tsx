import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/app/components/Modal';
import { CheckCircle2, XCircle, Calendar, FileText, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AttendanceRequest {
  id: number;
  artistName: string;
  type: '출근' | '재택근무' | '휴재' | '워케이션';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: '대기' | '승인' | '반려';
  requestDate: string;
  rejectionReason?: string;
  processedDate?: string;
}

export function AttendancePage() {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AttendanceRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // 근태 신청 데이터
  const [requests, setRequests] = useState<AttendanceRequest[]>([
    {
      id: 1,
      artistName: '김작가',
      type: '휴재',
      startDate: '2026-01-20',
      endDate: '2026-01-22',
      days: 3,
      reason: '개인 사유로 인한 휴재 신청',
      status: '대기',
      requestDate: '2026-01-13',
    },
    {
      id: 2,
      artistName: '이작가',
      type: '워케이션',
      startDate: '2026-01-18',
      endDate: '2026-01-20',
      days: 3,
      reason: '제주도 워케이션, 신작 기획 작업 예정',
      status: '대기',
      requestDate: '2026-01-12',
    },
    {
      id: 3,
      artistName: '박작가',
      type: '재택근무',
      startDate: '2026-01-16',
      endDate: '2026-01-16',
      days: 1,
      reason: '집에서 작업이 필요한 상황',
      status: '대기',
      requestDate: '2026-01-14',
    },
    {
      id: 4,
      artistName: '김작가',
      type: '휴재',
      startDate: '2026-01-10',
      endDate: '2026-01-12',
      days: 3,
      reason: '가족 행사',
      status: '승인',
      requestDate: '2026-01-05',
      processedDate: '2026-01-06',
    },
    {
      id: 5,
      artistName: '최작가',
      type: '워케이션',
      startDate: '2026-01-08',
      endDate: '2026-01-10',
      days: 3,
      reason: '강릉 워케이션',
      status: '승인',
      requestDate: '2026-01-02',
      processedDate: '2026-01-03',
    },
    {
      id: 6,
      artistName: '이작가',
      type: '휴재',
      startDate: '2026-01-05',
      endDate: '2026-01-05',
      days: 1,
      reason: '개인 일정',
      status: '반려',
      requestDate: '2026-01-03',
      rejectionReason: '해당 날짜는 중요한 에피소드 마감일입니다.',
      processedDate: '2026-01-04',
    },
  ]);

  // 대기 중인 신청 필터링
  const pendingRequests = requests.filter(r => r.status === '대기');

  // 처리된 신청 필터링 (승인/반려)
  const processedRequests = requests.filter(r => r.status !== '대기')
    .sort((a, b) => {
      const dateA = new Date(a.processedDate || '').getTime();
      const dateB = new Date(b.processedDate || '').getTime();
      return dateB - dateA;
    });

  const handleApprove = (request: AttendanceRequest) => {
    setRequests(requests.map(r => 
      r.id === request.id 
        ? { ...r, status: '승인', processedDate: new Date().toISOString().split('T')[0] }
        : r
    ));
    toast.success(`${request.artistName}의 ${request.type} 신청이 승인되었습니다.`);
  };

  const handleOpenRejectModal = (request: AttendanceRequest) => {
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
              rejectionReason: rejectionReason,
              processedDate: new Date().toISOString().split('T')[0]
            }
          : r
      ));
      toast.success(`${selectedRequest.artistName}의 ${selectedRequest.type} 신청이 반려되었습니다.`);
    }

    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '워케이션':
        return 'bg-[#9C27B0]'; // 보라색
      case '휴재':
        return 'bg-[#757575]'; // 회색
      case '재택근무':
        return 'bg-[#FF9800]'; // 오렌지색
      case '출근':
        return 'bg-[#00ACC1]'; // 청록색
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar">
      <div className="pb-24 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">근태 관리</h1>
            <p className="text-sm text-muted-foreground mt-1">작가들의 근태 신청을 관리하세요</p>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-medium text-muted-foreground">승인 대기</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{pendingRequests.length}건</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-muted-foreground">이번 달 승인</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {processedRequests.filter(r => r.status === '승인').length}건
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-muted-foreground">이번 달 반려</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {processedRequests.filter(r => r.status === '반려').length}건
              </p>
            </Card>
          </div>

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
                            <h4 className="font-semibold text-foreground">{request.artistName}</h4>
                            <Badge className={`${getTypeColor(request.type)} text-xs`}>
                              {request.type}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {formatDate(request.startDate)} ~ {formatDate(request.endDate)} 
                                ({request.days}일)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="w-3 h-3" />
                              <span>{request.reason}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              <span>신청일: {formatDate(request.requestDate)}</span>
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
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">처리 내역</h3>
                <Badge variant="outline">{processedRequests.length}건</Badge>
              </div>

              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {processedRequests.length === 0 ? (
                  <Card className="p-8">
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
                            <h5 className="font-medium text-foreground">{request.artistName}</h5>
                            <Badge className={`${getTypeColor(request.type)} text-xs`}>
                              {request.type}
                            </Badge>
                            <Badge className={`${getStatusColor(request.status)} text-xs`}>
                              {request.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div>
                              {formatDate(request.startDate)} ~ {formatDate(request.endDate)} 
                              ({request.days}일)
                            </div>
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
                        처리일: {request.processedDate ? formatDate(request.processedDate) : '-'}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 반려 사유 모달 */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedRequest(null);
          setRejectionReason('');
        }}
        title="신청 반려"
        maxWidth="md"
      >
        <div className="space-y-4">
          {selectedRequest && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-foreground">{selectedRequest.artistName}</h4>
                <Badge className={`${getTypeColor(selectedRequest.type)}`}>
                  {selectedRequest.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDate(selectedRequest.startDate)} ~ {formatDate(selectedRequest.endDate)} 
                ({selectedRequest.days}일)
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                사유: {selectedRequest.reason}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              반려 사유 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="반려 사유를 입력하세요"
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              작가에게 전달될 반려 사유를 명확하게 작성해주세요.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setSelectedRequest(null);
                setRejectionReason('');
              }}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              className="flex-1"
            >
              반려 확정
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}