import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { toast } from 'sonner';
import { X, Paperclip } from 'lucide-react';
import { API_BASE_URL } from '@/api/config';
import useAuthStore from '@/store/authStore';

const INQUIRY_TYPES = [
  { value: 'bug', label: '버그 신고' },
  { value: 'feature', label: '기능 요청' },
  { value: 'system', label: '시스템 문의' },
  { value: 'other', label: '기타' }
];

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 */
export function InquiryModal({ open, onOpenChange }) {
  const [inquiryType, setInquiryType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // useAuthStore에서 memberNo와 token 가져오기
  const { user, token } = useAuthStore();
  const memberNo = user?.memberNo;

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = [...files, ...selectedFiles];
    
    // 최대 5개 파일 제한
    if (newFiles.length > 5) {
      toast.error('최대 5개까지 첨부할 수 있습니다.');
      return;
    }
    
    // 파일 크기 검증 (각 파일 최대 20MB)
    const oversizedFiles = newFiles.filter(file => file.size > 20 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('파일 크기는 20MB를 초과할 수 없습니다.');
      return;
    }
    
    setFiles(newFiles);
    // input 초기화 (같은 파일 다시 선택 가능하도록)
    e.target.value = '';
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async () => {
    // 유효성 검사
    if (!inquiryType) {
      toast.error('문의 유형을 선택해주세요.');
      return;
    }
    
    if (!title || !title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    
    if (!content || !content.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    // memberNo 확인
    if (!memberNo) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // JSON 데이터 추가
      const data = {
        inquiryType: inquiryType,
        title: title.trim(),
        content: content.trim(),
        developerEmail: 'magamgglocalservice@gmail.com' // 개발자 이메일 고정
      };
      formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
      
      // 파일 추가
      files.forEach((file) => {
        formData.append('files', file);
      });
      
      // API 호출
      const baseUrl = API_BASE_URL || 'http://localhost:8888';
      
      const headers = {
        'X-Member-No': memberNo.toString()
      };
      
      // 토큰이 있으면 추가
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${baseUrl}/api/inquiries`, {
        method: 'POST',
        headers: headers,
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '문의 전송에 실패했습니다.' }));
        throw new Error(errorData.message || '문의 전송에 실패했습니다.');
      }
      
      toast.success('문의가 성공적으로 전송되었습니다.');
      
      // 폼 초기화
      setInquiryType('');
      setTitle('');
      setContent('');
      setFiles([]);
      onOpenChange(false);
    } catch (error) {
      console.error('문의 전송 실패:', error);
      toast.error(error.message || '문의 전송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setInquiryType('');
    setTitle('');
    setContent('');
    setFiles([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg text-[#1F2328] font-bold">문의하기</DialogTitle>
          <DialogDescription className="text-sm text-[#6E8FB3]">
            시스템 문의를 남겨주세요. 개발자에게 전달됩니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* 문의 유형 */}
          <div className="space-y-2">
            <Label htmlFor="inquiry-type" className="text-sm text-[#1F2328]">
              문의 유형 <span className="text-red-500">*</span>
            </Label>
            <Select value={inquiryType} onValueChange={setInquiryType}>
              <SelectTrigger id="inquiry-type" className="bg-white border-[#DADDE1] text-[#1F2328]">
                <SelectValue placeholder="문의 유형을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {INQUIRY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="inquiry-title" className="text-sm text-[#1F2328]">
              제목 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="inquiry-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문의 제목을 입력하세요"
              maxLength={200}
              className="bg-white border-[#DADDE1] text-[#1F2328]"
            />
            <p className="text-xs text-[#6E8FB3]">{title.length}/200</p>
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <Label htmlFor="inquiry-content" className="text-sm text-[#1F2328]">
              내용 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="inquiry-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="문의 내용을 입력하세요"
              rows={6}
              className="bg-white border-[#DADDE1] text-[#1F2328] resize-none"
            />
          </div>

          {/* 첨부파일 */}
          <div className="space-y-2">
            <Label className="text-sm text-[#1F2328]">
              첨부파일 <span className="text-[#6E8FB3] text-xs font-normal">(선택, 최대 5개, 각 20MB 이하)</span>
            </Label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                id="file-input"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-input').click()}
                className="w-full justify-start border-[#DADDE1] text-[#1F2328] hover:bg-gray-50"
                disabled={files.length >= 5 || isLoading}
              >
                <Paperclip className="w-4 h-4 mr-2" />
                파일 선택
              </Button>
              
              {/* 파일 목록 */}
              {files.length > 0 && (
                <div className="space-y-2 mt-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-[#DADDE1]"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Paperclip className="w-4 h-4 text-[#6E8FB3] flex-shrink-0" />
                        <span className="text-sm text-[#1F2328] truncate">{file.name}</span>
                        <span className="text-xs text-[#6E8FB3] flex-shrink-0">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4 text-[#6E8FB3]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 justify-end pt-4 border-t border-[#DADDE1]">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            className="bg-[#3F4A5A] hover:bg-[#3F4A5A]/90"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '전송 중...' : '전송'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

