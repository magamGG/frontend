import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Upload, FileText, Calendar, AlertCircle } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { leaveService } from '@/api/services';
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
 * @typedef {'연차' | '병가' | '워케이션' | '재택근무' | '휴가'} LeaveType
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
  const [halfDayType, setHalfDayType] = useState('선택 안 함'); // 반차 유형 (반차/반반차)
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [location, setLocation] = useState('');
  const [selectedProject, setSelectedProject] = useState('선택 안 함');
  const [attachedFile, setAttachedFile] = useState(null);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showHalfDayTypeDropdown, setShowHalfDayTypeDropdown] = useState(false);
  const [remainingLeave, setRemainingLeave] = useState(null);

  const { getMemberName } = useAuthStore();

  // Get projects from localStorage
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem('projectsData');
    if (stored) {
      const data = JSON.parse(stored);
      setProjects(data);
    }
  }, []);

  // Get current user's remaining leave
  useEffect(() => {
    if (selectedType === '연차' || selectedType === '반차') {
      const memberName = getMemberName();
      const employees = JSON.parse(localStorage.getItem('agencyEmployees') || '[]');
      
      if (memberName && employees.length > 0) {
        // Find employee by name
        const employee = employees.find(emp => emp.name === memberName);
        if (employee) {
          setRemainingLeave(employee.remainingLeave);
        } else {
          // If not found, try to get first employee as fallback
          setRemainingLeave(employees[0]?.remainingLeave || null);
        }
      } else if (employees.length > 0) {
        // Fallback: use first employee
        setRemainingLeave(employees[0]?.remainingLeave || null);
      } else {
        setRemainingLeave(null);
      }
    } else {
      setRemainingLeave(null);
    }
  }, [selectedType, getMemberName]);

  const leaveTypes = ['연차', '반차', '병가', '워케이션', '재택근무', '휴가'];

  const projectOptions = ['선택 안 함', ...projects.map(p => `${p.title} (${p.currentEpisode})`)];

  // Reset form when type changes
  useEffect(() => {
    setLeaveCategory(selectedType);
    setLocation('');
    setSelectedProject('선택 안 함');
    setHalfDayType('선택 안 함');
    setStartTime('');
    setEndTime('');
    // 반차/반반차 선택 시 날짜를 하루로 제한
    if (selectedType === '반차') {
      setEndDate(startDate);
    }
  }, [selectedType]);

  // 반차/반반차 선택 시 날짜 동기화
  useEffect(() => {
    if (selectedType === '반차') {
      setEndDate(startDate);
    }
  }, [startDate, selectedType]);

  // Calculate days between dates
  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days;
  };

  // Calculate hours between times (for 반차)
  const calculateHours = () => {
    if (!startTime || !endTime) return 0;
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;
    const diffMinutes = endTotal - startTotal;
    return Math.ceil(diffMinutes / 60);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
      toast.success('파일이 첨부되었습니다.');
    }
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason) {
      toast.error('모든 필수 항목을 입력해주세요.');
      return;
    }

    // 과거 날짜 선택 방지
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    if (start < today) {
      toast.error('과거 날짜는 선택할 수 없습니다.');
      return;
    }

    // 남은 연차 확인 (연차/반차)
    if ((selectedType === '연차' || selectedType === '반차') && remainingLeave !== null) {
      const requestedDays = selectedType === '반차'
        ? (halfDayType === '반반차' ? 0.25 : 0.5)
        : calculateDays();
      if (requestedDays > remainingLeave) {
        toast.error(`남은 연차(${remainingLeave}일)보다 많은 일수를 신청할 수 없습니다.`);
        return;
      }
    }

    // 반차/반반차 유형 선택 확인
    if (selectedType === '반차' && halfDayType === '선택 안 함') {
      toast.error('반차 유형을 선택해주세요.');
      return;
    }

    // 반차/반반차 날짜는 하루만 선택 가능
    if (selectedType === '반차' && startDate !== endDate) {
      toast.error('반차/반반차는 하루만 선택할 수 있습니다.');
      return;
    }

    // Validate specific fields based on type
    if (selectedType === '반차' && (!startTime || !endTime)) {
      toast.error('신청 시간을 입력해주세요.');
      return;
    }

    // 반차/반반차 시간 제한 검증
    if (selectedType === '반차' && startTime && endTime) {
      const hours = calculateHours();
      if (halfDayType === '반차' && hours > 4) {
        toast.error('반차는 최대 4시간까지 신청할 수 있습니다.');
        return;
      }
      if (halfDayType === '반반차' && hours > 2) {
        toast.error('반반차는 최대 2시간까지 신청할 수 있습니다.');
        return;
      }
      if (hours <= 0) {
        toast.error('종료 시간은 시작 시간보다 늦어야 합니다.');
        return;
      }
    }

    if (selectedType === '워케이션' && !location) {
      toast.error('워케이션 장소를 입력해주세요.');
      return;
    }

    const days = calculateDays();
    
    // 타입 매핑 (디자인용)
    const typeMap = {
      '연차': 'break',
      '반차': 'break',
      '병가': 'break',
      '워케이션': 'workation',
      '재택근무': 'remote',
      '휴가': 'break',
    };

    // API 요청 데이터 구성 (DB 필드명 기준 camelCase)
    // 반차 유형이 반반차면 백엔드에 '반반차'로 보내서 0.25일 차감되도록 함
    const requestTypeForApi = selectedType === '반차' && (halfDayType === '반차' || halfDayType === '반반차')
      ? halfDayType
      : selectedType;
    const requestData = {
      attendanceRequestType: requestTypeForApi,
      attendanceRequestStartDate: startDate,
      attendanceRequestEndDate: endDate,
      attendanceRequestUsingDays: selectedType === '반차' ? 1 : days,
      attendanceRequestReason: reason,
      workcationLocation: selectedType === '워케이션' ? location : null,
      medicalFileUrl: attachedFile?.name || null,
    };

    try {
      // API 호출
      const response = await leaveService.requestLeave(requestData);
      
      console.log('근태 신청 API 응답:', response);
      
      // 연차/반차/반반차 신청인 경우 로컬 스토리지의 연차 정보도 업데이트 (UI 동기화용)
      if (selectedType === '연차' || selectedType === '반차') {
        const memberName = getMemberName();
        const employees = JSON.parse(localStorage.getItem('agencyEmployees') || '[]');
        
        if (memberName && employees.length > 0) {
          const updatedEmployees = employees.map(emp => {
            if (emp.name === memberName) {
              const leaveDays = selectedType === '반차'
                ? (halfDayType === '반반차' ? 0.25 : 0.5)
                : days;
              const newUsedLeave = emp.usedLeave + leaveDays;
              const newRemainingLeave = emp.totalLeave - newUsedLeave;
              return {
                ...emp,
                usedLeave: newUsedLeave,
                remainingLeave: newRemainingLeave >= 0 ? newRemainingLeave : 0,
              };
            }
            return emp;
          });
          localStorage.setItem('agencyEmployees', JSON.stringify(updatedEmployees));
        }
      }

      toast.success('근태 신청이 완료되었습니다.');
      
      // 폼 초기화
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('근태 신청 실패:', error);
      toast.error(error.message || '근태 신청에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const resetForm = () => {
    setSelectedType('연차');
    setLeaveCategory('연차');
    setHalfDayType('선택 안 함');
    setStartDate(getCurrentDate());
    setEndDate(getCurrentDate());
    setStartTime('');
    setEndTime('');
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
      case '반차':
        return '반차 사유 관련 자료가 있다면 첨부할 수 있습니다.';
      case '병가':
        return '병가일 경우 진단서를 첨부할 수 있습니다. (나중에 업로드 가능)';
      case '워케이션':
        return '워케이션 관련 제출 자료가 있으면 첨부할 수 있습니다.';
      case '재택근무':
        return '재택근무 관련 공지/승인 자료가 있으면 첨부할 수 있습니다.';
      case '휴가':
        return '휴가 사유 관련 자료가 있다면 첨부할 수 있습니다.';
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
            <DialogTitle className="text-xl font-semibold m-0" style={{ color: 'var(--foreground)' }}>근태 신청</DialogTitle>
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

          {/* 연차/반차 선택 시 남은 연차 표시 */}
          {(selectedType === '연차' || selectedType === '반차') && remainingLeave !== null && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">남은 연차</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{remainingLeave}일</p>
              {(() => {
                const requestedDays = selectedType === '반차'
                  ? (halfDayType === '반반차' ? 0.25 : 0.5)
                  : calculateDays();
                if (requestedDays > remainingLeave) {
                  return (
                    <div className="mt-2 flex items-start gap-2 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>신청하신 일수({requestedDays}일)가 남은 연차보다 많습니다.</span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}

          {/* 반차 유형 선택 (반차 선택시만) */}
          {selectedType === '반차' && (
            <FormGroup>
              <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>유형 선택</Label>
              <div style={{ position: 'relative' }}>
                <DropdownButton
                  onClick={() => {
                    setShowHalfDayTypeDropdown(!showHalfDayTypeDropdown);
                  }}
                >
                  <span>{halfDayType}</span>
                  <svg
                    style={{ width: '16px', height: '16px', color: 'var(--muted-foreground)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </DropdownButton>
                
                {showHalfDayTypeDropdown && (
                  <DropdownMenu>
                    {['선택 안 함', '반차', '반반차'].map((option) => (
                      <DropdownItem
                        key={option}
                        onClick={() => {
                          setHalfDayType(option);
                          setShowHalfDayTypeDropdown(false);
                        }}
                        $isSelected={halfDayType === option}
                      >
                        {option}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                )}
              </div>
              <DaysInfo>반차인지 반반차인지 선택하세요.</DaysInfo>
            </FormGroup>
          )}

          {/* 신청 기간 */}
          <FormGroup>
            <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>신청 기간</Label>
            <DateGrid>
              <Input 
                type="date" 
                value={startDate}
                onChange={(e) => {
                  const newStartDate = e.target.value;
                  setStartDate(newStartDate);
                  // 반차/반반차는 하루만 선택 가능
                  if (selectedType === '반차') {
                    setEndDate(newStartDate);
                  }
                }}
                min={getCurrentDate()}
                className="bg-white border-gray-300"
                style={{ color: 'var(--foreground)' }}
              />
              <Input 
                type="date" 
                value={endDate}
                onChange={(e) => {
                  const newEndDate = e.target.value;
                  // 반차/반반차는 하루만 선택 가능
                  if (selectedType === '반차') {
                    setEndDate(startDate);
                    toast.info('반차/반반차는 하루만 선택할 수 있습니다.');
                    return;
                  }
                  setEndDate(newEndDate);
                }}
                min={selectedType === '반차' ? startDate : getCurrentDate()}
                disabled={selectedType === '반차'}
                className="bg-white border-gray-300"
                style={{ color: 'var(--foreground)' }}
              />
            </DateGrid>
            <DaysInfo>
              총 {selectedType === '반차'
                ? (halfDayType === '반반차' ? '0.25일' : '0.5일')
                : calculateDays() + '일'} 사용 예정
              {selectedType === '반차' && ' (반차/반반차는 하루만 선택 가능)'}
            </DaysInfo>
          </FormGroup>

          {/* 신청 시간 (반차 선택시만) */}
          {selectedType === '반차' && (
            <FormGroup>
              <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>신청 시간</Label>
              <DateGrid>
                <Input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-white border-gray-300"
                  style={{ color: 'var(--foreground)' }}
                />
                <Input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-white border-gray-300"
                  style={{ color: 'var(--foreground)' }}
                />
              </DateGrid>
              <DaysInfo>
                총 {calculateHours()}시간 사용 예정
                {halfDayType === '반차' && calculateHours() > 4 && (
                  <span style={{ color: '#dc2626', marginLeft: '8px' }}>
                    (반차는 최대 4시간까지 가능)
                  </span>
                )}
                {halfDayType === '반반차' && calculateHours() > 2 && (
                  <span style={{ color: '#dc2626', marginLeft: '8px' }}>
                    (반반차는 최대 2시간까지 가능)
                  </span>
                )}
              </DaysInfo>
            </FormGroup>
          )}

          {/* 워케이션 장소 (워케이션 선택시만) */}
          {selectedType === '워케이션' && (
            <FormGroup>
              <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>워케이션 장소</Label>
              <Input
                placeholder="예: 제주, 부산, 해외 등"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white border-gray-300"
                style={{ color: 'var(--foreground)' }}
              />
              <DaysInfo>워케이션을 떠날 입력</DaysInfo>
            </FormGroup>
          )}

          {/* 작품(선택) (휴가 선택시만) */}
          {selectedType === '휴가' && (
            <FormGroup>
              <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>작품(선택)</Label>
              <div style={{ position: 'relative' }}>
                <DropdownButton
                  onClick={() => {
                    setShowProjectDropdown(!showProjectDropdown);
                  }}
                >
                  <span>{selectedProject}</span>
                  <svg
                    style={{ width: '16px', height: '16px', color: 'var(--muted-foreground)' }}
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
              <DaysInfo>휴가는 특정 작품과 연결할 수 있으요.</DaysInfo>
            </FormGroup>
          )}

          {/* 사유 */}
          <FormGroup>
            <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>사유</Label>
            <Textarea 
              placeholder="사유를 입력해 주세요." 
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-white border-gray-300 resize-none"
              style={{ color: 'var(--foreground)' }}
            />
          </FormGroup>

          {/* 첨부 파일 */}
          <FileUploadSection>
            <FileUploadHeader>
              <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>첨부 파일</Label>
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
                <FileText style={{ width: '16px', height: '16px', color: 'var(--muted-foreground)' }} />
                <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>{attachedFile.name}</span>
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
