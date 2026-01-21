import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import {
  FormGroup,
  HelpText,
  ButtonGroup,
} from './HealthCheckModal.styled';

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 */
export function HealthCheckModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>건강 체크</DialogTitle>
        </DialogHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px 0' }}>
          <FormGroup>
            <Label>수면 시간</Label>
            <Input type="number" placeholder="시간 (예: 7.5)" step="0.5" />
          </FormGroup>

          <FormGroup>
            <Label>손목 통증 (0-10)</Label>
            <Slider defaultValue={[3]} max={10} step={1} />
            <HelpText>0: 없음, 10: 매우 심함</HelpText>
          </FormGroup>

          <FormGroup>
            <Label>목/어깨 통증 (0-10)</Label>
            <Slider defaultValue={[4]} max={10} step={1} />
            <HelpText>0: 없음, 10: 매우 심함</HelpText>
          </FormGroup>

          <FormGroup>
            <Label>눈의 피로도 (0-10)</Label>
            <Slider defaultValue={[5]} max={10} step={1} />
            <HelpText>0: 없음, 10: 매우 심함</HelpText>
          </FormGroup>

          <FormGroup>
            <Label>스트레스 수준 (0-10)</Label>
            <Slider defaultValue={[4]} max={10} step={1} />
            <HelpText>0: 없음, 10: 매우 높음</HelpText>
          </FormGroup>

          <ButtonGroup>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              저장하기
            </Button>
          </ButtonGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}
