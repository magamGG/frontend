import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { FileText, Download, ExternalLink, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { leaveService } from '@/api/services';
import { toast } from 'sonner';
import {
  ModalHeader,
  ModalContent,
  ModalFooter,
} from '../LeaveRequestModal/LeaveRequestModal.styled';

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {Object} props.request
 */
export function RequestDetailModal({ open, onOpenChange, request }) {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [expandedImages, setExpandedImages] = useState(new Set());

  if (!request) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]})`;
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const calculateDays = () => {
    if (!request.startDate || !request.endDate) return 0;
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days;
  };

  const isImageFile = (fileName) => {
    if (!fileName) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const lowerFileName = fileName.toLowerCase();
    return imageExtensions.some(ext => lowerFileName.endsWith(ext));
  };

  const handleFileDownload = async (fileUrl, fileName) => {
    if (!fileUrl || !fileName) {
      toast.error('파일 정보가 없습니다.');
      return;
    }
    
    try {
      // 파일명에서 경로 제거 (파일명만 추출)
      const cleanFileName = fileName.includes('/') ? fileName.split('/').pop() : fileName;
      
      // 백엔드 다운로드 API 호출
      const response = await leaveService.downloadFile(cleanFileName);
      
      // response가 axios response 객체인 경우 data 추출, 이미 Blob인 경우 그대로 사용
      const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);
      
      // Blob이 유효한지 확인
      if (!(blob instanceof Blob)) {
        throw new Error('응답이 Blob 형식이 아닙니다.');
      }
      
      // Blob URL 생성
      const blobUrl = window.URL.createObjectURL(blob);
      
      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = cleanFileName || '첨부파일';
      document.body.appendChild(link);
      link.click();
      
      // 정리
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success('파일 다운로드가 시작되었습니다.');
    } catch (error) {
      console.error('파일 다운로드 오류:', error);
      console.error('응답 데이터:', error.response?.data);
      toast.error('파일 다운로드에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleFileOpen = (fileUrl) => {
    if (fileUrl) {
      // 이미지인 경우 새 창에서 열기
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getInitial = (name) => {
    if (!name) return '?';
    return name[0];
  };

  // 파일 URL 생성 헬퍼 함수
  const buildFileUrl = (fileName) => {
    if (!fileName || (typeof fileName === 'string' && fileName.trim() === '')) {
      return null;
    }
    
    const fileNameStr = String(fileName);
    
    // 이미 전체 URL인 경우 그대로 반환
    if (fileNameStr.startsWith('http://') || fileNameStr.startsWith('https://')) {
      return fileNameStr;
    }
    
    // 파일명에서 경로 제거 (파일명만 추출)
    const cleanFileName = fileNameStr.includes('/') ? fileNameStr.split('/').pop() : fileNameStr;
    
    // BASE_URL 가져오기 (VITE_API_BASE_URL 우선, 없으면 fallback)
    const envBaseUrl = import.meta.env.VITE_API_BASE_URL;
    // envBaseUrl이 undefined, null, 빈 문자열이면 fallback 사용 (백엔드 포트는 8888)
    const BASE_URL = (envBaseUrl && typeof envBaseUrl === 'string' && envBaseUrl.trim() !== '') 
      ? envBaseUrl.trim() 
      : 'http://localhost:8888';
    
    const fullUrl = `${BASE_URL}/uploads/attendance/${cleanFileName}`;
    return fullUrl;
  };

  const getFileUrl = () => {
    // medicalFileUrl 또는 attachedFile이 없으면 null 반환
    let fileName = null;
    if (request.medicalFileUrl && request.medicalFileUrl.trim() !== '') {
      fileName = request.medicalFileUrl;
    } else if (request.attachedFile && request.attachedFile.trim() !== '') {
      fileName = request.attachedFile;
    } else if (request.attachedFileUrl && request.attachedFileUrl.trim() !== '') {
      fileName = request.attachedFileUrl;
    }
    
    return buildFileUrl(fileName);
  };

  const getFileName = () => {
    if (request.attachedFile && request.attachedFile.trim() !== '') {
      return request.attachedFile;
    }
    if (request.medicalFileUrl && request.medicalFileUrl.trim() !== '') {
      const fileName = request.medicalFileUrl.split('/').pop();
      return fileName || '첨부파일';
    }
    return '첨부파일';
  };

  // 파일 URL과 파일명 계산 (request가 있을 때만)
  const fileUrl = request ? getFileUrl() : null;
  const fileName = request ? getFileName() : '첨부파일';
  const isImage = fileUrl ? isImageFile(fileName) : false;

  // 가입 요청인 경우
  if (request.category === 'join') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className="sm:max-w-[960px] bg-white p-0 gap-0 max-h-[90vh] overflow-hidden flex flex-col" 
          aria-describedby={undefined}
        >
          {/* Header */}
          <ModalHeader>
            <DialogHeader className="p-0 m-0">
              <DialogTitle className="text-xl font-semibold m-0" style={{ color: 'var(--foreground)' }}>
                가입 신청 상세보기
              </DialogTitle>
            </DialogHeader>
            {request.submittedDate && (
              <div className="text-sm text-gray-600 mt-2">
                신청일: {formatDate(request.submittedDate)}
                {request.processedDate && ` | 처리일: ${formatDate(request.processedDate)}`}
              </div>
            )}
          </ModalHeader>

          {/* Content */}
          <ModalContent style={{ flex: 1, overflowY: 'auto' }}>
            {/* Profile Section */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-[#4CAF50] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {getInitial(request.requester)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{request.requester}</h3>
                <p className="text-sm text-gray-600 mb-1">{request.role}</p>
                {request.email && (
                  <p className="text-sm text-gray-600">{request.email}</p>
                )}
              </div>
            </div>

            {/* Request Details Grid */}
            <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">요청자</div>
                  <div className="text-sm font-medium text-gray-900">{request.requester}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">신청일</div>
                  <div className="text-sm font-medium text-gray-900">
                    {request.submittedDate ? formatDate(request.submittedDate) : '-'}
                  </div>
                </div>
                {request.email && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">이메일</div>
                    <div className="text-sm font-medium text-gray-900">{request.email}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-gray-500 mb-1">상태</div>
                  <div className="text-sm font-medium text-gray-900">
                    {request.status || '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Reason */}
            {request.reason && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <Label className="text-sm font-medium text-gray-700">사유</Label>
                </div>
                <div className="px-4 py-3 bg-[#F5F5F5] rounded-lg text-sm text-gray-900">
                  {request.reason}
                </div>
              </div>
            )}

            {/* Rejection Reason */}
            {request.status === '반려' && request.rejectionReason && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-red-600" />
                  <Label className="text-sm font-medium text-red-700">반려 사유</Label>
                </div>
                <div className="px-4 py-3 bg-red-50 rounded-lg text-sm text-red-900 border border-red-200">
                  {request.rejectionReason}
                </div>
              </div>
            )}

            {/* Attached Files */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-gray-600" />
                <Label className="text-sm font-medium text-gray-700">첨부파일</Label>
              </div>
              {request.attachedFiles && request.attachedFiles.length > 0 ? (
                <div className="space-y-3">
                  {request.attachedFiles.map((file, index) => {
                    const fileIsImage = isImageFile(file.name);
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between px-4 py-3 bg-[#F5F5F5] rounded-lg mb-2">
                          <div className="flex items-center gap-3 flex-1">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{file.name}</div>
                              {file.size && (
                                <div className="text-xs text-gray-500">{file.size}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const fileUrl = buildFileUrl(file.url || file.name);
                              return fileUrl ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-2 h-auto"
                                    onClick={() => handleFileOpen(fileUrl)}
                                    title="새 창으로 열기"
                                  >
                                    <ExternalLink className="w-4 h-4 text-gray-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-2 h-auto"
                                    onClick={() => handleFileDownload(fileUrl, file.name)}
                                    title="다운로드"
                                  >
                                    <Download className="w-4 h-4 text-gray-600" />
                                  </Button>
                                </>
                              ) : null;
                            })()}
                          </div>
                        </div>
                        {fileIsImage && (() => {
                          const fileUrl = buildFileUrl(file.url || file.name);
                          return fileUrl ? (
                            <div className="bg-[#F5F5F5] rounded-lg overflow-hidden mt-2">
                              <button
                                onClick={() => {
                                  const newExpanded = new Set(expandedImages);
                                  if (newExpanded.has(file.name)) {
                                    newExpanded.delete(file.name);
                                  } else {
                                    newExpanded.add(file.name);
                                  }
                                  setExpandedImages(newExpanded);
                                }}
                                className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-200 transition-colors"
                              >
                                <span className="text-sm font-medium text-gray-700">
                                  {expandedImages.has(file.name) ? '이미지 접기' : '이미지 미리보기'}
                                </span>
                                {expandedImages.has(file.name) ? (
                                  <ChevronUp className="w-4 h-4 text-gray-600" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-600" />
                                )}
                              </button>
                              {expandedImages.has(file.name) && fileUrl && (
                                <div className="px-4 py-3 max-h-96 overflow-y-auto">
                                  <img 
                                    src={fileUrl} 
                                    alt={file.name}
                                    className="max-w-full h-auto rounded"
                                    style={{ maxHeight: '400px' }}
                                    onError={(e) => {
                                      console.error('이미지 로드 실패:', fileUrl);
                                      e.target.style.display = 'none';
                                      const errorDiv = document.createElement('div');
                                      errorDiv.className = 'text-sm text-red-500 text-center py-4';
                                      errorDiv.textContent = '이미지를 불러올 수 없습니다.';
                                      e.target.parentNode.appendChild(errorDiv);
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          ) : null;
                        })()}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-3 bg-[#F5F5F5] rounded-lg text-sm text-gray-500 text-center">
                  첨부된 파일이 없습니다.
                </div>
              )}
            </div>
          </ModalContent>

          {/* Footer */}
          <ModalFooter>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              목록으로
            </Button>
            <Button 
              onClick={() => onOpenChange(false)}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              닫기
            </Button>
          </ModalFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // 근태 신청인 경우
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[960px] bg-white p-0 gap-0 max-h-[90vh] overflow-hidden flex flex-col request-detail-modal" 
        aria-describedby={undefined}
      >
        {/* Header */}
        <ModalHeader>
          <DialogHeader className="p-0 m-0">
            <DialogTitle className="text-xl font-semibold m-0" style={{ color: 'var(--foreground)' }}>
              근태 신청 상세보기
            </DialogTitle>
          </DialogHeader>
          {request.submittedDate && (
            <div className="text-sm text-gray-600 mt-2">
              신청일: {formatDate(request.submittedDate)}
              {request.processedDate && ` | 처리일: ${formatDate(request.processedDate)}`}
            </div>
          )}
        </ModalHeader>

        {/* Content */}
        <ModalContent style={{ flex: 1, overflowY: 'auto' }}>
          {/* Profile Section */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-[#4CAF50] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {getInitial(request.requester)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{request.requester}</h3>
              <p className="text-sm text-gray-600 mb-1">{request.role || '작가'}</p>
            </div>
          </div>

          {/* Request Details Grid */}
          <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">요청 유형</div>
                <div className="text-sm font-medium text-gray-900">{request.type}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">요청자</div>
                <div className="text-sm font-medium text-gray-900">{request.requester}</div>
              </div>
              {request.startDate && request.endDate && (
                <>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">시작일</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDisplayDate(request.startDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">종료일</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDisplayDate(request.endDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">사용 일수</div>
                    <div className="text-sm font-medium text-gray-900">
                      {request.days || calculateDays()}일
                    </div>
                  </div>
                </>
              )}
              {request.type === '워케이션' && request.workcationLocation && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">워케이션 장소</div>
                  <div className="text-sm font-medium text-gray-900">{request.workcationLocation}</div>
                </div>
              )}
              {request.type === '휴재' && request.projectName && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">작품</div>
                  <div className="text-sm font-medium text-gray-900">{request.projectName}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-500 mb-1">신청일</div>
                <div className="text-sm font-medium text-gray-900">
                  {request.submittedDate ? formatDate(request.submittedDate) : '-'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">상태</div>
                <div className="text-sm font-medium text-gray-900">
                  {request.status || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Reason */}
          {request.reason && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <Label className="text-sm font-medium text-gray-700">사유</Label>
              </div>
              <div className="px-4 py-3 bg-[#F5F5F5] rounded-lg text-sm text-gray-900">
                {request.reason}
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {request.status === '반려' && request.rejectionReason && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-red-600" />
                <Label className="text-sm font-medium text-red-700">반려 사유</Label>
              </div>
              <div className="px-4 py-3 bg-red-50 rounded-lg text-sm text-red-900 border border-red-200">
                {request.rejectionReason}
              </div>
            </div>
          )}

          {/* Attached Files */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-gray-600" />
              <Label className="text-sm font-medium text-gray-700">첨부파일</Label>
            </div>
            {fileUrl ? (
              <div>
                <div className="flex items-center justify-between px-4 py-3 bg-[#F5F5F5] rounded-lg mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{fileName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-auto"
                      onClick={() => handleFileOpen(fileUrl)}
                      title="새 창으로 열기"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-auto"
                      onClick={() => handleFileDownload(fileUrl, fileName)}
                      title="다운로드"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                    </Button>
                  </div>
                </div>
                {isImage && fileUrl && (
                  <div className="bg-[#F5F5F5] rounded-lg overflow-hidden">
                    <button
                      onClick={() => setIsImageExpanded(!isImageExpanded)}
                      className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {isImageExpanded ? '이미지 접기' : '이미지 미리보기'}
                      </span>
                      {isImageExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                    {isImageExpanded && fileUrl && (
                      <div className="px-4 py-3 max-h-96 overflow-y-auto">
                        <img 
                          src={fileUrl} 
                          alt={fileName}
                          className="max-w-full h-auto rounded"
                          style={{ maxHeight: '400px' }}
                          onError={(e) => {
                            console.error('이미지 로드 실패:', fileUrl);
                            e.target.style.display = 'none';
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'text-sm text-red-500 text-center py-4';
                            errorDiv.textContent = '이미지를 불러올 수 없습니다.';
                            e.target.parentNode.appendChild(errorDiv);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="px-4 py-3 bg-[#F5F5F5] rounded-lg text-sm text-gray-500 text-center">
                첨부된 파일이 없습니다.
              </div>
            )}
          </div>
        </ModalContent>

        {/* Footer */}
        <ModalFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            목록으로
          </Button>
          <Button 
            onClick={() => onOpenChange(false)}
            className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            닫기
          </Button>
        </ModalFooter>
      </DialogContent>
    </Dialog>
  );
}
