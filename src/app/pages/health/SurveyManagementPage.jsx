import { ArrowLeft, FileText, Plus, Trash2, Eye, Edit } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { useState } from 'react';



/**
 * @param {Object} props
 * @param {Function} props.onBack
 */
export function SurveyManagementPage({ onBack }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('mental');

  const surveys = [
    {
      id,
      title: '일일 간편 체크',
      description: '총 5개 문항으로 구성됨',
      status: '진행중',
      statusColor: 'bg-green-50 text-green-700',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#333333]" />
            </button>
            <h1 className="text-3xl font-bold text-[#333333]">설문 관리</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('mental')}
            className={`pb-4 px-2 font-medium transition-colors relative ${
              activeTab === 'mental' ? 'text-[#8E44AD]' : 'text-[#666666] hover:text-[#333333]'
            }`}
          >
            정신 건강 설문
            {activeTab === 'mental' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8E44AD]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('physical')}
            className={`pb-4 px-2 font-medium transition-colors relative ${
              activeTab === 'physical' ? 'text-[#8E44AD]' : 'text-[#666666] hover:text-[#333333]'
            }`}
          >
            신체 건강 설문
            {activeTab === 'physical' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8E44AD]" />
            )}
          </button>
        </div>

        {/* Survey Cards Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Existing Survey Card */}
          {surveys.map((survey) => (
            <div key={survey.id} className="bg-white rounded-2xl p-6 shadow-sm">
              {/* Icon */}
              <div className="w-12 h-12 bg-[#8E44AD] rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-[#333333] mb-1">{survey.title}</h3>
              <p className="text-sm text-[#666666] mb-3">{survey.description}</p>

              {/* Status Badge */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${survey.statusColor}`}>
                  {survey.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-lg text-xs"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  수정
                </Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-lg text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  미리보기
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg text-xs text-red-600 hover:text-red-700">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}

          {/* Add New Template Card */}
          <button className="bg-white rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-[#8E44AD] transition-colors flex flex-col items-center justify-center min-h-[240px]">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-[#666666]" />
            </div>
            <p className="text-sm font-medium text-[#666666]">새 템플릿 추가</p>
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#333333]">설문 수정</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Title Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#333333]">설문 제목</Label>
              <Input
                placeholder="예: 상반기 정기 설문"
                className="rounded-lg border-gray-200"
                defaultValue="일일 간편 체크"
              />
            </div>

            {/* Type and Status Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#333333]">유형</Label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-[#333333]">
                  <option>정신 건강</option>
                  <option>신체 건강</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#333333]">상태</Label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-[#333333]">
                  <option>진행중</option>
                  <option>대기</option>
                  <option>종료</option>
                </select>
              </div>
            </div>

            {/* Question Management */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-[#333333]">문항 관리</Label>
              
              {/* Question Items */}
              <div className="space-y-2">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-[#666666] flex-1">
                      Q{num}. 질문 내용을 입력하세요
                    </span>
                    <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                      <Trash2 className="w-4 h-4 text-[#666666]" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Question Button */}
              <button className="text-sm text-[#2962FF] hover:text-[#2962FF]/80 font-medium flex items-center gap-1">
                <Plus className="w-4 h-4" />
                문항 추가
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-lg"
            >
              취소
            </Button>
            <Button
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-lg bg-[#1F2937] hover:bg-[#1F2937]/90"
            >
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
