import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  FormGroup,
  Select,
  DateGrid,
  InfoBox,
  InfoText,
  ButtonGroup,
} from './UniversalHiatusModal.styled';

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 */
export function UniversalHiatusModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>휴재 신청</DialogTitle>
        </DialogHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}>
          <FormGroup>
            <Label>작품 선택</Label>
            <Select>
              <option>로맨스 판타지</option>
              <option>학원물</option>
              <option>액션 판타지</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>휴재 유형</Label>
            <Select>
              <option>단기 휴재 (1-4주)</option>
              <option>장기 휴재 (1개월 이상)</option>
              <option>건강상 휴재</option>
              <option>개인 사정</option>
            </Select>
          </FormGroup>

          <DateGrid>
            <FormGroup>
              <Label>시작일</Label>
              <Input type="date" />
            </FormGroup>
            <FormGroup>
              <Label>종료일 (예정)</Label>
              <Input type="date" />
            </FormGroup>
          </DateGrid>

          <FormGroup>
            <Label>사유</Label>
            <Textarea placeholder="휴재 사유를 입력하세요" rows={4} />
          </FormGroup>

          <InfoBox>
            <InfoText>
              <strong>안내:</strong> 휴재 신청 시 플랫폼과 독자들에게 공지됩니다. 
              건강상의 이유인 경우 증빙 서류가 필요할 수 있습니다.
            </InfoText>
          </InfoBox>

          <ButtonGroup>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              신청하기
            </Button>
          </ButtonGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}
