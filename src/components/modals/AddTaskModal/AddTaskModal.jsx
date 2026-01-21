import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label as UILabel } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { X } from 'lucide-react';
import {
  ModalOverlay,
  ModalCard,
  ModalHeader,
  ModalTitle,
  Form,
  FormGroup,
  Label,
  RequiredMark,
  Select,
  InfoBox,
  InfoTitle,
  InfoList,
  InfoListItem,
  ButtonGroup,
} from './AddTaskModal.styled';

/**
 * @typedef {Object} TaskData
 * @property {string} title
 * @property {string} description
 * @property {string} deadline
 * @property {'in-progress' | 'waiting' | 'urgent' | 'completed'} status
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {(task: TaskData) => void} props.onSave
 */
export function AddTaskModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'waiting',
    priority: 'medium',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // Reset form
    setFormData({
      title: '',
      description: '',
      deadline: '',
      status: 'waiting',
      priority: 'medium',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalCard as={Card}>
        {/* Header */}
        <ModalHeader>
          <ModalTitle>작업 추가</ModalTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X style={{ width: '20px', height: '20px' }} />
          </Button>
        </ModalHeader>

        {/* Form */}
        <Form onSubmit={handleSubmit}>
          {/* 제목 */}
          <FormGroup>
            <Label as={UILabel} htmlFor="title">
              제목 <RequiredMark>*</RequiredMark>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="작업 제목을 입력하세요"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{ width: '100%', borderWidth: '2px', borderColor: 'var(--border)' }}
            />
          </FormGroup>

          {/* 내용 */}
          <FormGroup>
            <Label as={UILabel} htmlFor="description">
              내용
            </Label>
            <Textarea
              id="description"
              placeholder="작업 내용을 입력하세요"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', minHeight: '80px', resize: 'none', borderWidth: '2px', borderColor: 'var(--border)' }}
            />
          </FormGroup>

          {/* 마감일 */}
          <FormGroup>
            <Label as={UILabel} htmlFor="deadline">
              마감일 <RequiredMark>*</RequiredMark>
            </Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
              style={{ width: '100%', borderWidth: '2px', borderColor: 'var(--border)' }}
            />
          </FormGroup>

          {/* 상태 & 우선순위 (2열 그리드) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* 상태 */}
            <FormGroup>
              <Label as={UILabel} htmlFor="status">
                상태 <RequiredMark>*</RequiredMark>
              </Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="waiting">대기</option>
                <option value="in-progress">진행중</option>
                <option value="urgent">긴급</option>
                <option value="completed">완료</option>
              </Select>
            </FormGroup>

            {/* 우선순위 */}
            <FormGroup>
              <Label as={UILabel} htmlFor="priority">
                우선순위 <RequiredMark>*</RequiredMark>
              </Label>
              <Select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                required
              >
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
              </Select>
            </FormGroup>
          </div>

          {/* 상태별 설명 */}
          <InfoBox>
            <InfoTitle>
              <strong>상태 안내:</strong>
            </InfoTitle>
            <InfoList>
              <InfoListItem>• <strong>대기:</strong> 아직 시작하지 않은 작업</InfoListItem>
              <InfoListItem>• <strong>진행중:</strong> 현재 작업 중인 항목</InfoListItem>
              <InfoListItem>• <strong>긴급:</strong> 즉시 처리가 필요한 작업</InfoListItem>
              <InfoListItem>• <strong>완료:</strong> 작업이 완료된 항목</InfoListItem>
            </InfoList>
          </InfoBox>

          {/* 버튼 */}
          <ButtonGroup>
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">
              작업 추가
            </Button>
          </ButtonGroup>
        </Form>
      </ModalCard>
    </ModalOverlay>
  );
}
