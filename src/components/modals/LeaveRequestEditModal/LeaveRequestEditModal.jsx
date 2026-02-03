import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { leaveService } from '@/api/services';
import {
  ModalHeader,
  ModalContent,
  TabContainer,
  TabButton,
  FormGroup,
  DateGrid,
  DaysInfo,
  ModalFooter,
} from '@/components/modals/LeaveRequestModal/LeaveRequestModal.styled';

const getCurrentDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const formatDateForInput = (dt) => {
  if (!dt) return getCurrentDate();
  const d = typeof dt === 'string' ? new Date(dt) : dt;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const leaveTypes = ['연차', '반차', '병가', '워케이션', '재택근무', '휴가'];

/**
 * 근태 신청 수정 모달 (대기 중인 신청만 수정 가능)
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {Object} props.request - 수정할 신청 데이터 (raw from API)
 * @param {() => void} props.onSuccess
 */
export function LeaveRequestEditModal({ open, onOpenChange, request, onSuccess }) {
  const [selectedType, setSelectedType] = useState('연차');
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [reason, setReason] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && request) {
      const type = request.attendanceRequestType || '연차';
      setSelectedType(type);
      const start = formatDateForInput(request.attendanceRequestStartDate);
      setStartDate(start);
      setEndDate(type === '반차' ? start : formatDateForInput(request.attendanceRequestEndDate));
      setReason(request.attendanceRequestReason || '');
      setLocation(request.workcationLocation || '');
    }
  }, [open, request]);

  useEffect(() => {
    if (selectedType === '반차') {
      setEndDate(startDate);
    }
  }, [selectedType, startDate]);

  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async () => {
    if (!request?.attendanceRequestNo) return;
    if (!startDate || !endDate || !reason) {
      toast.error('모든 필수 항목을 입력해주세요.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    if (start < today) {
      toast.error('과거 날짜는 선택할 수 없습니다.');
      return;
    }

    if (selectedType === '워케이션' && !location) {
      toast.error('워케이션 장소를 입력해주세요.');
      return;
    }

    const days = selectedType === '반차' ? 1 : calculateDays();
    const requestData = {
      attendanceRequestType: selectedType,
      attendanceRequestStartDate: startDate,
      attendanceRequestEndDate: endDate,
      attendanceRequestUsingDays: days,
      attendanceRequestReason: reason,
      workcationLocation: selectedType === '워케이션' ? (location || '') : '',
      medicalFileUrl: '',
    };

    setIsSubmitting(true);
    try {
      await leaveService.updateAttendanceRequest(request.attendanceRequestNo, requestData);
      toast.success('근태 신청이 수정되었습니다.');
      window.dispatchEvent(new CustomEvent('leaveRequestSuccess'));
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('근태 신청 수정 실패:', error);
      toast.error(error?.message || '수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[960px] bg-white p-0 gap-0" aria-describedby={undefined}>
        <ModalHeader>
          <DialogHeader className="p-0 m-0">
            <DialogTitle className="text-xl font-semibold m-0" style={{ color: 'var(--foreground)' }}>
              근태 신청 수정
            </DialogTitle>
          </DialogHeader>
        </ModalHeader>

        <ModalContent>
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

          <FormGroup>
            <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              신청 기간
            </Label>
            <DateGrid>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={getCurrentDate()}
                className="bg-white border-gray-300"
                style={{ color: 'var(--foreground)' }}
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={selectedType === '반차' ? startDate : getCurrentDate()}
                disabled={selectedType === '반차'}
                className="bg-white border-gray-300"
                style={{ color: 'var(--foreground)' }}
              />
            </DateGrid>
            <DaysInfo>
              총 {selectedType === '반차' ? '1일' : `${calculateDays()}일`} 사용 예정
            </DaysInfo>
          </FormGroup>

          {selectedType === '워케이션' && (
            <FormGroup>
              <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                워케이션 장소
              </Label>
              <Input
                placeholder="예: 제주, 부산, 해외 등"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white border-gray-300"
                style={{ color: 'var(--foreground)' }}
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              사유
            </Label>
            <Textarea
              placeholder="사유를 입력해 주세요."
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-white border-gray-300 resize-none"
              style={{ color: 'var(--foreground)' }}
            />
          </FormGroup>
        </ModalContent>

        <ModalFooter>
          <Button variant="outline" onClick={handleClose} className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50">
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="px-6 bg-blue-600 hover:bg-blue-700 text-white">
            {isSubmitting ? '저장 중...' : '저장'}
          </Button>
        </ModalFooter>
      </DialogContent>
    </Dialog>
  );
}
