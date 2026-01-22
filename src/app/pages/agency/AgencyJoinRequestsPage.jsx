import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { 
  Bell, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * AgencyJoinRequestsPage component
 */
export function AgencyJoinRequestsPage() {
  const [requests, setRequests] = useState([
    {
      id: '1',
      name: '김작가',
      email: 'kim.artist@example.com',
      phone: '010-1234-5678',
      position: '웹툰 작가',
      userType: 'individual',
      agencyCode: 'AGENCY-2026-001',
      message: '안녕하세요. 웹툰 작가 김작가입니다. 귀사와 함께 작업하고 싶습니다.',
      requestDate: '2026-01-17',
      status: 'pending'
    },
    {
      id: '2',
      name: '이담당',
      email: 'lee.manager@example.com',
      phone: '010-9876-5432',
      position: '프로젝트 매니저',
      userType: 'manager',
      agencyCode: 'AGENCY-2026-001',
      message: '프로젝트 관리 경력 5년차 이담당입니다.',
      requestDate: '2026-01-16',
      status: 'pending'
    },
    {
      id: '3',
      name: '박신입',
      email: 'park.newbie@example.com',
      phone: '010-5555-7777',
      position: '어시스턴트',
      userType: 'individual',
      agencyCode: 'AGENCY-2026-001',
      message: '',
      requestDate: '2026-01-15',
      status: 'approved'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  const handleViewDetail = (request: JoinRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleApprove = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved' as const }
          : req
      )
    );
    toast.success('가입 요청이 승인되었습니다.');
    setIsDetailModalOpen(false);
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected' as const }
          : req
      )
    );
    toast.success('가입 요청이 거절되었습니다.');
    setIsDetailModalOpen(false);
  };

  const getStatusBadge = (status: JoinRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">대기중</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">승인됨</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">거절됨</Badge>;
    }
  };

  const getUserTypeBadge = (userType: 'individual' | 'manager') => {
    return userType === 'individual' 
      ? <Badge className="bg-purple-100 text-purple-700 border-purple-200">작가</Badge>
      : <Badge className="bg-blue-100 text-blue-700 border-blue-200">담당자</Badge>;
  };

  return (
    <div className="px-8 py-6 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">가입 요청 관리</h1>
          </div>
          <p className="text-muted-foreground">
            새로운 작가 및 담당자의 에이전시 가입 요청을 관리하세요
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">대기중인 요청</p>
                <p className="text-3xl font-bold text-foreground">{pendingRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">승인된 요청</p>
                <p className="text-3xl font-bold text-foreground">
                  {requests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">전체 요청</p>
                <p className="text-3xl font-bold text-foreground">{requests.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h2 className="text-xl font-semibold text-foreground">새로운 요청</h2>
              <Badge className="bg-yellow-100 text-yellow-700">{pendingRequests.length}</Badge>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {pendingRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-primary-foreground" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{request.name}</h3>
                            {getUserTypeBadge(request.userType)}
                            {getStatusBadge(request.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {request.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              {request.position || '미입력'}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {request.phone || '미입력'}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {request.requestDate}
                            </div>
                          </div>

                          {request.message && (
                            <p className="mt-3 text-sm text-foreground bg-muted/30 p-3 rounded-lg">
                              {request.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleViewDetail(request)}
                          className="flex-1 md:w-full"
                        >
                          상세보기
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          className="flex-1 md:w-full border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          승인
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                          className="flex-1 md:w-full border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          거절
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Processed Requests Section */}
        {processedRequests.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">처리 완료</h2>

            <div className="grid grid-cols-1 gap-4">
              {processedRequests.map((request) => (
                <Card key={request.id} className="p-6 opacity-75 hover:opacity-100 transition-opacity">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{request.name}</h3>
                          {getUserTypeBadge(request.userType)}
                          {getStatusBadge(request.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {request.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {request.requestDate}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetail(request)}
                    >
                      상세보기
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {requests.length === 0 && (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">가입 요청이 없습니다</h3>
            <p className="text-muted-foreground">
              새로운 가입 요청이 들어오면 여기에 표시됩니다
            </p>
          </Card>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>가입 요청 상세 정보</DialogTitle>
            <DialogDescription>
              {selectedRequest?.name}님의 가입 요청 내역입니다
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <span className="font-medium text-foreground">상태</span>
                {getStatusBadge(selectedRequest.status)}
              </div>

              {/* Personal Info */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  개인 정보
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">이름</span>
                    <span className="font-medium text-foreground">{selectedRequest.name}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">계정 유형</span>
                    {getUserTypeBadge(selectedRequest.userType)}
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">이메일</span>
                    <span className="font-medium text-foreground">{selectedRequest.email}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">연락처</span>
                    <span className="font-medium text-foreground">{selectedRequest.phone || '미입력'}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">
                      {selectedRequest.userType === 'individual' ? '작가명' : '직책'}
                    </span>
                    <span className="font-medium text-foreground">{selectedRequest.position || '미입력'}</span>
                  </div>
                </div>
              </div>

              {/* Agency Info */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-primary" />
                  에이전시 정보
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">회사 코드</span>
                    <span className="font-medium text-foreground font-mono">{selectedRequest.agencyCode}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">요청일</span>
                    <span className="font-medium text-foreground">{selectedRequest.requestDate}</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedRequest.message && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">메시지</h4>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-foreground whitespace-pre-wrap">{selectedRequest.message}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => handleApprove(selectedRequest.id)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    승인
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => handleReject(selectedRequest.id)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    거절
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}