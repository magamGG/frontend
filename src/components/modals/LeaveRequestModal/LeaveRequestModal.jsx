import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Upload, FileText } from 'lucide-react';
import {
  ModalHeader,
  ModalTitle,
  ModalContent,
  TabContainer,
  TabButton,
  FormGroup,
  DateGrid,
  DaysInfo,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  FileUploadSection,
  FileUploadHeader,
  FileInfo,
  InfoList,
  InfoItem,
  InfoBullet,
  ModalFooter,
} from './LeaveRequestModal.styled';

/**
 * @typedef {'연차' | '병가' | '워케이션' | '재택근무' | '휴재'} LeaveType
 */

// 현재 날짜를 YYYY-MM-DD 형식으로 반환
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 */
export function LeaveRequestModal({ open, onOpenChange }) {
  const [selectedType, setSelectedType] = useState('연차');
  const [leaveCategory, setLeaveCategory] = useState('연차');
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [reason, setReason] = useState('');
  const [location, setLocation] = useState('');
  const [selectedProject, setSelectedProject] = useState('선택 안 함');
  const [attachedFile, setAttachedFile] = useState(null);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  // Get projects from localStorage
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem('projectsData');
    if (stored) {
      const data = JSON.parse(stored);
      setProjects(data);
    }
  }, []);

  const leaveTypes = ['연차', '병가', '워케이션', '재택근무', '휴재'];

  const projectOptions = ['선택 안 함', ...projects.map(p => `${p.title} (${p.currentEpisode})`)];

  // Reset form when type changes
  useEffect(() => {
    setLeaveCategory(selectedType);
    setLocation('');
    setSelectedProject('선택 안 함');
  }, [selectedType]);

  // Calculate days between dates
  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days;
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
      toast.success('파일이 첨부되었습니다.');
    }
  };

  const handleSubmit = () => {
    if (!startDate || !endDate || !reason) {
      toast.error('모든 필수 항목을 입력해주세요.');
      return;
    }

    // Validate specific fields based on type
    if (selectedType === '워케이션' && !location) {
      toast.error('워케이션 장소를 입력해주세요.');
      return;
    }

    // localStorage에서 기존 근태 데이터 가져오기
    const existingAttendance = JSON.parse(localStorage.getItem('attendanceData') || '[]');
    
    // 새 신청 ID 생성
    const newId = existingAttendance.length > 0 
      ? Math.max(...existingAttendance.map((r) => r.id), 0) + 1 
      : 1;
    
    const days = calculateDays();
    
    const typeMap = {
      '연차': 'break',
      '병가': 'break',
      '워케이션': 'workation',
      '재택근무': 'remote',
      '휴재': 'break',
    };

    const newRequestData = {
      id: newId,
      type: typeMap[selectedType],
      typeName: selectedType,
      startDate: startDate,
      endDate: endDate,
      days: days,
      reason: reason,
      location: location || undefined,
      project: selectedProject !== '선택 안 함' ? selectedProject : undefined,
      status: 'approved', // 자동 승인으로 설정
      requestDate: new Date().toISOString().split('T')[0],
      rejectionReason: '',
      attachedFile: attachedFile?.name || undefined,
    };

    // localStorage에 저장
    localStorage.setItem('attendanceData', JSON.stringify([...existingAttendance, newRequestData]));

    toast.success('근태 신청이 완료되었습니다.');
    
    // 폼 초기화
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setSelectedType('연차');
    setLeaveCategory('연차');
    setStartDate(getCurrentDate());
    setEndDate(getCurrentDate());
    setReason('');
    setLocation('');
    setSelectedProject('선택 안 함');
    setAttachedFile(null);
  };

  // Handle modal close with reset
  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const getInfoText = () => {
    switch (selectedType) {
      case '연차':
        return '연차는 최소 반차 단위로 신청할 수 있습니다.';
      case '병가':
        return '병가일 경우 진단서를 첨부할 수 있습니다. (나중에 업로드 가능)';
      case '워케이션':
        return '워케이션 관련 제출 자료가 있으면 첨부할 수 있습니다.';
      case '재택근무':
        return '재택근무 관련 공지/승인 자료가 있으면 첨부할 수 있습니다.';
      case '휴재':
        return '휴재 사유 관련 자료가 있다면 첨부할 수 있습니다.';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[960px] bg-white p-0 gap-0" 
        aria-describedby={undefined}
      >
        {/* Header */}
        <ModalHeader>
          <DialogHeader className="p-0 m-0">
            <DialogTitle className="text-xl font-semibold text-[#1F2328] m-0">근태 신청</DialogTitle>
          </DialogHeader>
        </ModalHeader>

        {/* Content */}
        <ModalContent>
          {/* Tab Buttons */}
          <TabContainer>
            {leaveTypes.map((type) => (
              <TabButton
                key={type}
                onClick={() => setSelectedType(type)}
                $isActive={selectedType === type}
              >
                {type}
              </TabButton>
            ))}
          </TabContainer>

          {/* 신청 기간 */}
          <FormGroup>
            <Label className="text-sm font-medium text-[#1F2328]">신청 기간</Label>
            <DateGrid>
              <Input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border-gray-300 text-[#1F2328]"
              />
              <Input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border-gray-300 text-[#1F2328]"
              />
            </DateGrid>
            <DaysInfo>총 {calculateDays()}일 사용 예정</DaysInfo>
          </FormGroup>

          {/* 워케이션 장소 (워케이션 선택시만) */}
          {selectedType === '워케이션' && (
            <FormGroup>
              <Label className="text-sm font-medium text-[#1F2328]">워케이션 장소</Label>
              <Input
                placeholder="예: 제주, 부산, 해외 등"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white border-gray-300 text-[#1F2328]"
              />
              <DaysInfo>워케이션을 떠날 입력</DaysInfo>
            </FormGroup>
          )}

          {/* 작품(선택) (휴재 선택시만) */}
          {selectedType === '휴재' && (
            <FormGroup>
              <Label className="text-sm font-medium text-[#1F2328]">작품(선택)</Label>
              <div style={{ position: 'relative' }}>
                <DropdownButton
                  onClick={() => {
                    setShowProjectDropdown(!showProjectDropdown);
                  }}
                >
                  <span>{selectedProject}</span>
                  <svg
                    style={{ width: '16px', height: '16px', color: '#9CA3AF' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </DropdownButton>
                
                {showProjectDropdown && (
                  <DropdownMenu>
                    {projectOptions.map((option) => (
                      <DropdownItem
                        key={option}
                        onClick={() => {
                          setSelectedProject(option);
                          setShowProjectDropdown(false);
                        }}
                        $isSelected={selectedProject === option}
                      >
                        {option}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                )}
              </div>
              <DaysInfo>휴재는 특정 작품과 연결할 수 있으요.</DaysInfo>
            </FormGroup>
          )}

          {/* 사유 */}
          <FormGroup>
            <Label className="text-sm font-medium text-[#1F2328]">사유</Label>
            <Textarea 
              placeholder="사유를 입력해 주세요." 
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-white border-gray-300 text-[#1F2328] resize-none"
            />
          </FormGroup>

          {/* 첨부 파일 */}
          <FileUploadSection>
            <FileUploadHeader>
              <Label className="text-sm font-medium text-[#1F2328]">첨부 파일</Label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <label htmlFor="file-upload">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-500 hover:bg-blue-50"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    파일 선택
                  </Button>
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-500"
                  disabled
                >
                  삭제
                </Button>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </FileUploadHeader>

            {attachedFile ? (
              <FileInfo>
                <FileText style={{ width: '16px', height: '16px', color: '#9CA3AF' }} />
                <span style={{ fontSize: '14px', color: '#4B5563' }}>{attachedFile.name}</span>
              </FileInfo>
            ) : (
              <InfoList>
                <InfoItem>
                  <InfoBullet>●</InfoBullet>
                  <span>{getInfoText()}</span>
                </InfoItem>
                <InfoItem>
                  <InfoBullet>●</InfoBullet>
                  <span>상태는 PENDING으로 저장되며, 승인/반려/취소는 관리자가 처리합니다.</span>
                </InfoItem>
              </InfoList>
            )}
          </FileUploadSection>
        </ModalContent>

        {/* Footer */}
        <ModalFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            취소
          </Button>
          <Button 
            onClick={handleSubmit}
            className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            신청하기
          </Button>
        </ModalFooter>
      </DialogContent>
    </Dialog>
  );
}
