import { ArrowLeft, FileText, Plus, Trash2, Eye, Edit } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { useState } from 'react';
import {
  SurveyManagementRoot,
  SurveyManagementBody,
  HeaderSection,
  BackButton,
  HeaderTitle,
  TabsContainer,
  TabButton,
  TabIndicator,
  SurveyGrid,
  SurveyCard,
  SurveyIcon,
  SurveyCardTitle,
  SurveyCardDescription,
  SurveyStatusBadge,
  SurveyActions,
  SurveyActionButton,
  AddTemplateCard,
  AddTemplateIcon,
  AddTemplateText,
} from './SurveyManagementPage.styled';

// TODO: Zustand store mapping - 설문 관리 데이터
const initialSurveys = [
  {
    id: 1,
    title: '일일 간편 체크',
    description: '총 5개 문항으로 구성됨',
    status: '진행중',
    statusColor: 'bg-green-50 text-green-700',
  },
];

const TABS = [
  { id: 'mental', label: '정신 건강 설문' },
  { id: 'physical', label: '신체 건강 설문' },
];

export function SurveyManagementPage({ onBack }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mental');
  const [surveys] = useState(initialSurveys);

  return (
    <SurveyManagementRoot>
      <SurveyManagementBody>
        {/* Header */}
        <HeaderSection>
          <div className="flex items-center gap-4">
            <BackButton onClick={onBack}>
              <ArrowLeft className="w-6 h-6" style={{ color: 'var(--foreground)' }} />
            </BackButton>
            <HeaderTitle>설문 관리</HeaderTitle>
          </div>
        </HeaderSection>

        {/* Tabs */}
        <TabsContainer>
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              $active={activeTab === tab.id}
            >
              {tab.label}
              {activeTab === tab.id && <TabIndicator />}
            </TabButton>
          ))}
        </TabsContainer>

        {/* Survey Cards Grid */}
        <SurveyGrid>
          {/* Existing Survey Card */}
          {surveys.map((survey) => (
            <SurveyCard key={survey.id}>
              {/* Icon */}
              <SurveyIcon>
                <FileText className="w-6 h-6 text-white" />
              </SurveyIcon>

              {/* Title & Description */}
              <SurveyCardTitle>{survey.title}</SurveyCardTitle>
              <SurveyCardDescription>{survey.description}</SurveyCardDescription>

              {/* Status Badge */}
              <SurveyStatusBadge className={survey.statusColor}>
                {survey.status}
              </SurveyStatusBadge>

              {/* Action Buttons */}
              <SurveyActions>
                <SurveyActionButton
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  수정
                </SurveyActionButton>
                <SurveyActionButton variant="outline" size="sm">
                  <Eye className="w-3 h-3 mr-1" />
                  미리보기
                </SurveyActionButton>
                <SurveyActionButton variant="outline" size="sm" $danger>
                  <Trash2 className="w-3 h-3" />
                </SurveyActionButton>
              </SurveyActions>
            </SurveyCard>
          ))}

          {/* Add New Template Card */}
          <AddTemplateCard>
            <AddTemplateIcon>
              <Plus className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
            </AddTemplateIcon>
            <AddTemplateText>새 템플릿 추가</AddTemplateText>
          </AddTemplateCard>
        </SurveyGrid>
      </SurveyManagementBody>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>설문 수정</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Title Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>설문 제목</Label>
              <Input
                placeholder="예: 상반기 정기 설문"
                className="rounded-lg" style={{ borderColor: 'var(--border)' }}
                defaultValue="일일 간편 체크"
              />
            </div>

            {/* Type and Status Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>유형</Label>
                <select className="w-full px-3 py-2 border rounded-lg bg-white" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  <option>정신 건강</option>
                  <option>신체 건강</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>상태</Label>
                <select className="w-full px-3 py-2 border rounded-lg bg-white" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  <option>진행중</option>
                  <option>대기</option>
                  <option>종료</option>
                </select>
              </div>
            </div>

            {/* Question Management */}
            <div className="space-y-3">
              <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>문항 관리</Label>
              
              {/* Question Items */}
              <div className="space-y-2">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <span className="text-sm flex-1" style={{ color: 'var(--muted-foreground)' }}>
                      Q{num}. 질문 내용을 입력하세요
                    </span>
                    <button className="p-1 rounded transition-colors" style={{ backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <Trash2 className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Question Button */}
              <button className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--chart-2)' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                <Plus className="w-4 h-4" />
                문항 추가
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-lg"
            >
              취소
            </Button>
            <Button
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-lg" style={{ backgroundColor: 'var(--foreground)' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SurveyManagementRoot>
  );
}
