import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { ArrowLeft, Plus, Edit2, Trash2, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  SurveyListManagementRoot,
  SurveyListManagementBody,
  HeaderSection,
  BackButton,
  HeaderTitle,
  HeaderSubtitle,
  AddButton,
  TabCard,
  TabButtonGroup,
  TabButton,
  SurveyListCard,
  SurveyListHeader,
  SurveyListTitle,
  SurveyListEmpty,
  SurveyItem,
  SurveyItemContent,
  SurveyItemTitle,
  SurveyItemMeta,
  SurveyItemActions,
  ActionButton,
} from './SurveyListManagementPage.styled';

// TODO: Zustand store mapping - 설문 목록 데이터
const initialSurveys = [
  { 
    id: '1', 
    title: '일일 간이 체크', 
    category: '정신건강', 
    status: '사용 중', 
    createdDate: '2025.12.01', 
    questions: [
      '오늘 기분은 어떠신가요?',
      '수면은 충분히 취하셨나요?',
      '스트레스 수준은 어떠신가요?',
      '업무에 집중할 수 있었나요?',
      '다른 사람들과 소통하는 것이 편안했나요?'
    ]
  },
  { 
    id: '2', 
    title: '정기 심층 검사', 
    category: '정신건강', 
    status: '사용 중', 
    createdDate: '2025.11.15', 
    questions: [
      '지난 2주간 우울감을 느낀 적이 있습니까?',
      '지난 2주간 불안감을 느낀 적이 있습니까?',
      '수면 패턴에 변화가 있었습니까?',
      '식욕에 변화가 있었습니까?',
      '일상 활동에 흥미를 잃은 적이 있습니까?'
    ]
  },
  { 
    id: '3', 
    title: 'PHQ-9 우울증 검사', 
    category: '정신건강', 
    status: '사용 중', 
    createdDate: '2025.10.20', 
    questions: [
      '일이나 여가 활동을 하는 데 흥미나 즐거움을 느끼지 못했다',
      '기분이 가라앉거나, 우울하거나, 희망이 없다고 느꼈다',
      '잠들기 어렵거나 자주 깨어났다, 혹은 너무 많이 잤다'
    ]
  },
  { 
    id: '5', 
    title: '일일 간이 체크', 
    category: '신체건강', 
    status: '사용 중', 
    createdDate: '2025.12.01', 
    questions: [
      '오늘 신체적 통증이 있었나요?',
      '규칙적인 식사를 하셨나요?',
      '충분한 수분 섭취를 하셨나요?',
      '눈의 피로를 느끼셨나요?',
      '어깨나 목에 긴장감을 느끼셨나요?'
    ]
  },
  { 
    id: '6', 
    title: '정기 심층 검사', 
    category: '신체건강', 
    status: '사용 중', 
    createdDate: '2025.11.15', 
    questions: [
      '지난 한 달간 두통이 있었습니까?',
      '지난 한 달간 소화 불량이 있었습니까?',
      '지난 한 달간 근육통이 있었습니까?',
      '지난 한 달간 시력 변화가 있었습니까?'
    ]
  },
];

const CATEGORIES = ['정신건강', '신체건강'];
const STATUSES = ['사용 중', '미사용'];

export function SurveyListManagementPage({ onBack }) {
  const [selectedTab, setSelectedTab] = useState('정신건강');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [surveys, setSurveys] = useState(initialSurveys);
  
  // 설문 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    category: '정신건강',
    status: '사용 중',
    questions: [],
  });

  // 새 문항 입력 상태
  const [newQuestion, setNewQuestion] = useState('');

  const currentSurveys = surveys.filter(s => s.category === selectedTab);

  const handleAdd = () => {
    setFormData({
      title: '',
      category: selectedTab,
      status: '사용 중',
      questions: [],
    });
    setNewQuestion('');
    setIsAddModalOpen(true);
  };

  const handleEdit = (survey) => {
    setSelectedSurvey(survey);
    setFormData({
      title: survey.title,
      category: survey.category,
      status: survey.status,
      questions: [...survey.questions],
    });
    setNewQuestion('');
    setIsEditModalOpen(true);
  };

  const handleDelete = (survey) => {
    setSelectedSurvey(survey);
    setIsDeleteModalOpen(true);
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion.trim()],
    });
    setNewQuestion('');
  };

  const handleRemoveQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    });
  };

  const handleAddSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('설문 제목을 입력해주세요');
      return;
    }
    if (formData.questions.length === 0) {
      toast.error('최소 1개 이상의 문항을 추가해주세요');
      return;
    }

    const newSurvey = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      status: formData.status,
      createdDate: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      questions: formData.questions,
    };
    setSurveys([...surveys, newSurvey]);
    setIsAddModalOpen(false);
    toast.success('설문이 추가되었습니다');
  };

  const handleEditSubmit = () => {
    if (!selectedSurvey) return;
    if (!formData.title.trim()) {
      toast.error('설문 제목을 입력해주세요');
      return;
    }
    if (formData.questions.length === 0) {
      toast.error('최소 1개 이상의 문항을 추가해주세요');
      return;
    }

    setSurveys(surveys.map(s => 
      s.id === selectedSurvey.id 
        ? { ...s, ...formData }
        : s
    ));
    setIsEditModalOpen(false);
    toast.success('설문이 수정되었습니다');
  };

  const handleDeleteConfirm = () => {
    if (!selectedSurvey) return;
    setSurveys(surveys.filter(s => s.id !== selectedSurvey.id));
    setIsDeleteModalOpen(false);
    toast.success('설문이 삭제되었습니다');
  };

  return (
    <SurveyListManagementRoot>
      <SurveyListManagementBody>
        {/* 헤더 */}
        <HeaderSection>
          <div className="flex items-center gap-3">
            <BackButton
              variant="ghost"
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4" />
            </BackButton>
            <div>
              <HeaderTitle>설문 목록 관리</HeaderTitle>
              <HeaderSubtitle>건강 설문을 추가, 수정, 삭제할 수 있습니다</HeaderSubtitle>
            </div>
          </div>
          <AddButton onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            설문 추가
          </AddButton>
        </HeaderSection>

        {/* 탭 */}
        <TabCard>
          <TabButtonGroup>
            {CATEGORIES.map((category) => (
              <TabButton
                key={category}
                variant={selectedTab === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTab(category)}
              >
                {category}
              </TabButton>
            ))}
          </TabButtonGroup>
        </TabCard>

        {/* 설문 목록 */}
        <SurveyListCard>
          <SurveyListHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#6E8FB3]" />
              <SurveyListTitle>
                {selectedTab} 설문 ({currentSurveys.length}개)
              </SurveyListTitle>
            </div>
          </SurveyListHeader>

          <div className="space-y-2">
            {currentSurveys.length === 0 ? (
              <SurveyListEmpty>
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>등록된 설문이 없습니다</p>
              </SurveyListEmpty>
            ) : (
              currentSurveys.map((survey) => (
                <SurveyItem key={survey.id}>
                  <SurveyItemContent>
                    <div className="flex items-center gap-2 mb-1">
                      <SurveyItemTitle>{survey.title}</SurveyItemTitle>
                      <Badge 
                        className={`text-xs px-2 py-0.5 ${
                          survey.status === '사용 중' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {survey.status}
                      </Badge>
                    </div>
                    <SurveyItemMeta>
                      <span>문항 수: {survey.questions.length}개</span>
                      <span>생성일: {survey.createdDate}</span>
                    </SurveyItemMeta>
                  </SurveyItemContent>
                  <SurveyItemActions>
                    <ActionButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(survey)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </ActionButton>
                    <ActionButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(survey)}
                      $danger
                    >
                      <Trash2 className="w-4 h-4" />
                    </ActionButton>
                  </SurveyItemActions>
                </SurveyItem>
              ))
            )}
          </div>
        </SurveyListCard>
      </SurveyListManagementBody>

      {/* 추가 모달 */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>설문 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#1F2328] mb-2 block">설문 제목</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="설문 제목을 입력하세요"
                className="h-9"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1F2328] mb-2 block">카테고리</label>
              <div className="flex gap-2">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={formData.category === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData({ ...formData, category })}
                    className="h-9"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#1F2328] mb-2 block">문항 수</label>
              <div className="space-y-2">
                <Input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="문항을 입력하세요"
                  className="h-9"
                />
                <Button
                  onClick={handleAddQuestion}
                  className="bg-[#3F4A5A] hover:bg-[#2F3A4A] text-white h-9"
                >
                  문항 추가
                </Button>
              </div>
              <div className="space-y-1 mt-2">
                {formData.questions.map((question, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#FAFAFA] p-2 rounded-lg">
                    <span className="text-sm text-[#6E8FB3]">{question}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveQuestion(index)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#1F2328] mb-2 block">상태</label>
              <div className="flex gap-2">
                {STATUSES.map((status) => (
                  <Button
                    key={status}
                    type="button"
                    variant={formData.status === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData({ ...formData, status })}
                    className="h-9"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="h-9">
              취소
            </Button>
            <Button 
              onClick={handleAddSubmit} 
              className="bg-[#3F4A5A] hover:bg-[#2F3A4A] text-white h-9"
              disabled={!formData.title.trim()}
            >
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 수정 모달 */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>설문 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#1F2328] mb-2 block">설문 제목</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="설문 제목을 입력하세요"
                className="h-9"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1F2328] mb-2 block">카테고리</label>
              <div className="flex gap-2">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={formData.category === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData({ ...formData, category })}
                    className="h-9"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#1F2328] mb-2 block">문항 수</label>
              <div className="space-y-2">
                <Input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="문항을 입력하세요"
                  className="h-9"
                />
                <Button
                  onClick={handleAddQuestion}
                  className="bg-[#3F4A5A] hover:bg-[#2F3A4A] text-white h-9"
                >
                  문항 추가
                </Button>
              </div>
              <div className="space-y-1 mt-2">
                {formData.questions.map((question, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#FAFAFA] p-2 rounded-lg">
                    <span className="text-sm text-[#6E8FB3]">{question}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveQuestion(index)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#1F2328] mb-2 block">상태</label>
              <div className="flex gap-2">
                {STATUSES.map((status) => (
                  <Button
                    key={status}
                    type="button"
                    variant={formData.status === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData({ ...formData, status })}
                    className="h-9"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="h-9">
              취소
            </Button>
            <Button 
              onClick={handleEditSubmit} 
              className="bg-[#3F4A5A] hover:bg-[#2F3A4A] text-white h-9"
              disabled={!formData.title.trim()}
            >
              수정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 모달 */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>설문 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#6E8FB3]">
            <span className="font-medium text-[#1F2328]">"{selectedSurvey?.title}"</span> 설문을 삭제하시겠습니까?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="h-9">
              취소
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              className="bg-red-600 hover:bg-red-700 text-white h-9"
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SurveyListManagementRoot>
  );
}
