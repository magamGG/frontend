import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { CheckCircle, Calendar, Clock, FileText, AlertCircle, Activity } from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminPersonalHealthRoot,
  AdminPersonalHealthBody,
  NextCheckupCard,
  NextCheckupHeader,
  NextCheckupTitle,
  NextCheckupGrid,
  CheckupItem,
  CheckupItemHeader,
  CheckupItemInfo,
  CheckupItemLabel,
  CheckupItemDate,
  CheckupItemBadge,
  CheckupItemMeta,
  CheckupItemMetaIcon,
  CheckupItemMetaText,
  DeepCheckupGrid,
  DeepCheckupCard,
  DeepCheckupCardHeader,
  DeepCheckupCardTitle,
  DeepCheckupCardIcon,
  CompletedStatusBox,
  CompletedStatusHeader,
  CompletedStatusTitle,
  CompletedStatusRow,
  CompletedStatusLabel,
  CompletedStatusValue,
  ResultSection,
  ResultTitle,
  ResultDescription,
  ResultAlertBox,
  ResultAlertContent,
  NextCheckupBox,
  NextCheckupBoxContent,
  NextCheckupBoxLabel,
  NextCheckupBoxValue,
  EmptyStateBox,
  EmptyStateIcon,
  EmptyStateText,
  EmptyStateButton,
  SurveyQuestion,
  SurveyQuestionText,
  SurveyQuestionDesc,
  SurveyAnswerGrid,
  SurveyAnswerButton,
  SurveyInfoBox,
} from './AdminPersonalHealthPage.styled';

export function AdminPersonalHealthPage() {
  const [isMentalSelfCheckOpen, setIsMentalSelfCheckOpen] = useState(false);
  const [isPhysicalSelfCheckOpen, setIsPhysicalSelfCheckOpen] = useState(false);
  const [isMentalDeepCheckOpen, setIsMentalDeepCheckOpen] = useState(false);
  const [isPhysicalDeepCheckOpen, setIsPhysicalDeepCheckOpen] = useState(false);

  // 설문 응답 상태
  const [mentalSelfAnswers, setMentalSelfAnswers] = useState([0, 0, 0, 0]);
  const [physicalSelfAnswers, setPhysicalSelfAnswers] = useState([0, 0, 0, 0]);
  const [mentalDeepAnswers, setMentalDeepAnswers] = useState([0, 0, 0, 0]);
  const [physicalDeepAnswers, setPhysicalDeepAnswers] = useState([0, 0, 0, 0]);

  // TODO: Zustand store mapping - 다음 검진 예정일 데이터
  const [nextCheckupDate] = useState({
    mentalCheckup: '2026.01.25',
    physicalCheckup: '2026.02.01',
    daysUntilMental: 7,
    daysUntilPhysical: 14,
  });

  // TODO: Zustand store mapping - 심층 검진 검사 데이터
  const [deepCheckupData, setDeepCheckupData] = useState({
    mental: {
      lastCheckDate: '2026.01.15',
      score: 8,
      status: '주의',
      isCompleted: true,
      nextCheckDate: '2026.01.25',
    },
    physical: {
      lastCheckDate: '',
      score: 0,
      status: '미완료',
      isCompleted: false,
      nextCheckDate: '2026.02.01',
    },
  });

  // 제출 핸들러
  const handleSubmitMentalSelf = () => {
    toast.success('정신 건강 자가검진이 제출되었습니다.');
    setIsMentalSelfCheckOpen(false);
    setMentalSelfAnswers([0, 0, 0, 0]);
  };

  const handleSubmitPhysicalSelf = () => {
    toast.success('신체 건강 자가검진이 제출되었습니다.');
    setIsPhysicalSelfCheckOpen(false);
    setPhysicalSelfAnswers([0, 0, 0, 0]);
  };

  const handleSubmitMentalDeep = () => {
    toast.success('정신 건강 심층 검진이 제출되었습니다.');
    setIsMentalDeepCheckOpen(false);
    setMentalDeepAnswers([0, 0, 0, 0]);
  };

  const handleSubmitPhysicalDeep = () => {
    const totalScore = physicalDeepAnswers.reduce((sum, score) => sum + score, 0);
    const averageScore = Math.round(totalScore / physicalDeepAnswers.length);
    const finalScore = Math.max(7, averageScore);
    
    let status = '정상';
    if (finalScore >= 8) {
      status = '위험';
    } else if (finalScore >= 5) {
      status = '주의';
    }
    
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    
    setDeepCheckupData({
      ...deepCheckupData,
      physical: {
        lastCheckDate: formattedDate,
        score: finalScore,
        status: status,
        isCompleted: true,
        nextCheckDate: deepCheckupData.physical.nextCheckDate,
      },
    });
    
    toast.success('신체 건강 심층 검진이 제출되었습니다.');
    setIsPhysicalDeepCheckOpen(false);
    setPhysicalDeepAnswers([0, 0, 0, 0]);
  };

  // 상태별 배지 색상
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case '위험':
        return 'bg-red-100 text-red-600';
      case '주의':
        return 'bg-orange-100 text-orange-600';
      case '정상':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <AdminPersonalHealthRoot>
      <AdminPersonalHealthBody>
        {/* 다음 검진 예정일 */}
        <NextCheckupCard>
          <NextCheckupHeader>
            <Calendar className="w-5 h-5" style={{ color: '#6E8FB3' }} />
            <NextCheckupTitle>다음 검진 예정일</NextCheckupTitle>
          </NextCheckupHeader>
          
          <NextCheckupGrid>
            {/* 정신 건강 검진 */}
            <CheckupItem $bgColor="from-purple-50 to-purple-100/50" $borderColor="border-purple-200">
              <CheckupItemHeader>
                <CheckupItemInfo>
                  <CheckupItemLabel $color="#9333EA">정신 건강 심층 검진</CheckupItemLabel>
                  <CheckupItemDate>{nextCheckupDate.mentalCheckup}</CheckupItemDate>
                </CheckupItemInfo>
                <CheckupItemBadge $bgColor="#10B981">완료</CheckupItemBadge>
              </CheckupItemHeader>
              <CheckupItemMeta>
                <CheckupItemMetaIcon>
                  <Clock className="w-3.5 h-3.5" />
                </CheckupItemMetaIcon>
                <CheckupItemMetaText>다음 검진까지 {nextCheckupDate.daysUntilMental}일 남음</CheckupItemMetaText>
              </CheckupItemMeta>
            </CheckupItem>

            {/* 신체 건강 검진 */}
            <CheckupItem $bgColor="from-blue-50 to-blue-100/50" $borderColor="border-blue-200">
              <CheckupItemHeader>
                <CheckupItemInfo>
                  <CheckupItemLabel $color="#2563EB">신체 건강 심층 검진</CheckupItemLabel>
                  <CheckupItemDate>{nextCheckupDate.physicalCheckup}</CheckupItemDate>
                </CheckupItemInfo>
                <CheckupItemBadge $bgColor="#F97316">D-{nextCheckupDate.daysUntilPhysical}</CheckupItemBadge>
              </CheckupItemHeader>
              <CheckupItemMeta>
                <CheckupItemMetaIcon>
                  <Clock className="w-3.5 h-3.5" />
                </CheckupItemMetaIcon>
                <CheckupItemMetaText>{nextCheckupDate.physicalCheckup}까지 검사 완료 필요</CheckupItemMetaText>
              </CheckupItemMeta>
            </CheckupItem>
          </NextCheckupGrid>
        </NextCheckupCard>

        {/* 심층 검진 검사 현황 */}
        <DeepCheckupGrid>
          {/* 정신 건강 심층 검사 */}
          <DeepCheckupCard>
            <DeepCheckupCardHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DeepCheckupCardIcon $color="#9333EA">
                  <FileText className="w-5 h-5" />
                </DeepCheckupCardIcon>
                <DeepCheckupCardTitle>정신 건강 심층 검사</DeepCheckupCardTitle>
              </div>
            </DeepCheckupCardHeader>

            {deepCheckupData.mental.isCompleted ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 완료 상태 */}
                <CompletedStatusBox>
                  <CompletedStatusHeader>
                    <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
                    <CompletedStatusTitle>검사 완료</CompletedStatusTitle>
                  </CompletedStatusHeader>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <CompletedStatusRow>
                      <CompletedStatusLabel>검사 일자</CompletedStatusLabel>
                      <CompletedStatusValue>{deepCheckupData.mental.lastCheckDate}</CompletedStatusValue>
                    </CompletedStatusRow>
                    <CompletedStatusRow>
                      <CompletedStatusLabel>검사 점수</CompletedStatusLabel>
                      <CompletedStatusValue>{deepCheckupData.mental.score}점</CompletedStatusValue>
                    </CompletedStatusRow>
                    <CompletedStatusRow>
                      <CompletedStatusLabel>상태</CompletedStatusLabel>
                      <Badge className={`${getStatusBadgeClass(deepCheckupData.mental.status)} text-xs px-2 py-0.5`}>
                        {deepCheckupData.mental.status}
                      </Badge>
                    </CompletedStatusRow>
                  </div>
                </CompletedStatusBox>

                {/* 결과 상세 */}
                <ResultSection>
                  <ResultTitle>검사 결과</ResultTitle>
                  <ResultDescription>
                    귀하의 정신 건강 점수는 <strong style={{ color: '#1F2328' }}>{deepCheckupData.mental.score}점</strong>으로
                    <strong style={{ color: '#F97316' }}> 주의 </strong>단계입니다.
                  </ResultDescription>
                  <ResultAlertBox>
                    <AlertCircle className="w-4 h-4" style={{ color: '#F97316' }} />
                    <ResultAlertContent>
                      <p>• 스트레스 관리와 충분한 휴식이 필요합니다.</p>
                      <p>• 정기적인 운동과 취미 활동을 권장합니다.</p>
                      <p>• 증상이 지속되면 전문가 상담을 받으시기 바랍니다.</p>
                    </ResultAlertContent>
                  </ResultAlertBox>
                </ResultSection>

                {/* 다음 검진 */}
                <NextCheckupBox>
                  <NextCheckupBoxContent>
                    <Calendar className="w-4 h-4" style={{ color: '#9333EA' }} />
                    <NextCheckupBoxLabel>다음 검진일</NextCheckupBoxLabel>
                  </NextCheckupBoxContent>
                  <NextCheckupBoxValue>{deepCheckupData.mental.nextCheckDate}</NextCheckupBoxValue>
                </NextCheckupBox>

                {/* 검사 완료 버튼 (비활성화) */}
                <Button variant="outline" className="w-full" disabled>
                  검사 완료
                </Button>
              </div>
            ) : (
              <EmptyStateBox>
                <EmptyStateIcon>
                  <Activity className="w-12 h-12" style={{ color: '#9CA3AF' }} />
                </EmptyStateIcon>
                <EmptyStateText>아직 검사를 진행하지 않았습니다.</EmptyStateText>
                <EmptyStateButton onClick={() => setIsMentalDeepCheckOpen(true)}>
                  검사하기
                </EmptyStateButton>
              </EmptyStateBox>
            )}
          </DeepCheckupCard>

          {/* 신체 건강 심층 검사 */}
          <DeepCheckupCard>
            <DeepCheckupCardHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DeepCheckupCardIcon $color="#2563EB">
                  <FileText className="w-5 h-5" />
                </DeepCheckupCardIcon>
                <DeepCheckupCardTitle>신체 건강 심층 검사</DeepCheckupCardTitle>
              </div>
            </DeepCheckupCardHeader>

            {deepCheckupData.physical.isCompleted ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 완료 상태 */}
                <CompletedStatusBox>
                  <CompletedStatusHeader>
                    <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
                    <CompletedStatusTitle>검사 완료</CompletedStatusTitle>
                  </CompletedStatusHeader>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <CompletedStatusRow>
                      <CompletedStatusLabel>검사 일자</CompletedStatusLabel>
                      <CompletedStatusValue>{deepCheckupData.physical.lastCheckDate}</CompletedStatusValue>
                    </CompletedStatusRow>
                    <CompletedStatusRow>
                      <CompletedStatusLabel>검사 점수</CompletedStatusLabel>
                      <CompletedStatusValue>{deepCheckupData.physical.score}점</CompletedStatusValue>
                    </CompletedStatusRow>
                    <CompletedStatusRow>
                      <CompletedStatusLabel>상태</CompletedStatusLabel>
                      <Badge className={`${getStatusBadgeClass(deepCheckupData.physical.status)} text-xs px-2 py-0.5`}>
                        {deepCheckupData.physical.status}
                      </Badge>
                    </CompletedStatusRow>
                  </div>
                </CompletedStatusBox>

                {/* 결과 상세 */}
                <ResultSection>
                  <ResultTitle>검사 결과</ResultTitle>
                  <ResultDescription>
                    귀하의 신체 건강 점수는 <strong style={{ color: '#1F2328' }}>{deepCheckupData.physical.score}점</strong>으로
                    <strong style={{ color: '#F97316' }}> 주의 </strong>단계입니다.
                  </ResultDescription>
                  <ResultAlertBox>
                    <AlertCircle className="w-4 h-4" style={{ color: '#F97316' }} />
                    <ResultAlertContent>
                      <p>• 손목/손가락 통증에 주의가 필요합니다.</p>
                      <p>• 정기적인 스트레칭과 바른 자세를 유지하세요.</p>
                      <p>• 증상이 심해지면 의료 전문가와 상담하세요.</p>
                    </ResultAlertContent>
                  </ResultAlertBox>
                </ResultSection>

                {/* 다음 검진 */}
                <NextCheckupBox>
                  <NextCheckupBoxContent>
                    <Calendar className="w-4 h-4" style={{ color: '#2563EB' }} />
                    <NextCheckupBoxLabel>다음 검진일</NextCheckupBoxLabel>
                  </NextCheckupBoxContent>
                  <NextCheckupBoxValue>{deepCheckupData.physical.nextCheckDate}</NextCheckupBoxValue>
                </NextCheckupBox>

                {/* 검사 완료 버튼 (비활성화) */}
                <Button variant="outline" className="w-full" disabled>
                  검사 완료
                </Button>
              </div>
            ) : (
              <EmptyStateBox>
                <EmptyStateIcon>
                  <AlertCircle className="w-14 h-14" style={{ color: '#F97316' }} />
                </EmptyStateIcon>
                <EmptyStateText style={{ fontWeight: 600, color: '#F97316' }}>
                  검사가 아직 완료되지 않았습니다
                </EmptyStateText>
                <p style={{ fontSize: '12px', color: '#6E8FB3', marginBottom: '16px' }}>
                  2026.02.01까지 검사를 완료해주세요
                </p>
                <EmptyStateButton onClick={() => setIsPhysicalDeepCheckOpen(true)} style={{ backgroundColor: '#F97316' }}>
                  검사 시작하기
                </EmptyStateButton>
              </EmptyStateBox>
            )}
          </DeepCheckupCard>
        </DeepCheckupGrid>
      </AdminPersonalHealthBody>

      {/* 정신 건강 심층 검진 모달 */}
      <Dialog open={isMentalDeepCheckOpen} onOpenChange={setIsMentalDeepCheckOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">
              정신 건강 심층 검진
            </DialogTitle>
            <DialogDescription className="text-sm text-[#6E8FB3]">
              PHQ-9·GAD-7 표준화 도구를 활용한 전문 정신 건강 검진입니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-sm text-[#6E8FB3] leading-relaxed">
              <p className="mb-2">본 검진은 PHQ-9·GAD-7 표준화된 도구를 활용하여</p>
              <p className="mb-2">직원 본인의 우울·불안 수준을 정기적으로 점검합니다.</p>
              <p>본 검사는 정확한 심층 평가를 위한 도구이며,</p>
              <p>검사 결과는 전문 상담이 필요한 경우 임상 전문가에게 전달됩니다.</p>
            </div>

            <div className="border-t border-[#DADDE1] my-4"></div>

            <p className="text-sm text-[#1F2328] font-medium">지난 2주간을 기준으로 응답해주세요.</p>

            <div className="space-y-4">
              {[
                { q: '1. 일 또는 여가 활동을 하는 데 흥미나 즐거움을 느끼지 못함', desc: '0 (전혀 없음) ~ 10 (거의 매일)' },
                { q: '2. 기분이 가라앉거나 우울하거나 희망이 없다고 느낌', desc: '0 (전혀 없음) ~ 10 (거의 매일)' },
                { q: '3. 잠들기 어렵거나 자주 깨거나 너무 많이 잠', desc: '0 (전혀 없음) ~ 10 (거의 매일)' },
                { q: '4. 피곤하다고 느끼거나 기력이 거의 없음', desc: '0 (전혀 없음) ~ 10 (거의 매일)' },
              ].map((item, index) => (
                <SurveyQuestion key={index}>
                  <SurveyQuestionText>{item.q}</SurveyQuestionText>
                  <SurveyQuestionDesc>{item.desc}</SurveyQuestionDesc>
                  <SurveyAnswerGrid>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SurveyAnswerButton
                        key={num}
                        onClick={() => {
                          const newAnswers = [...mentalDeepAnswers];
                          newAnswers[index] = num;
                          setMentalDeepAnswers(newAnswers);
                        }}
                        $isSelected={mentalDeepAnswers[index] === num}
                      >
                        {num}
                      </SurveyAnswerButton>
                    ))}
                  </SurveyAnswerGrid>
                </SurveyQuestion>
              ))}
            </div>

            <SurveyInfoBox>
              <p>※ 본 검사는 전문 검사 도구로, 개인정보로 엄격 관리됩니다.</p>
              <p className="mt-1">
                15점 이상 시 담당자에게 즉시 알림 발송 및 전문 상담 연계가 권장됩니다.
              </p>
            </SurveyInfoBox>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-[#DADDE1]">
            <Button
              variant="outline"
              onClick={() => {
                setIsMentalDeepCheckOpen(false);
                setMentalDeepAnswers([0, 0, 0, 0]);
              }}
            >
              취소
            </Button>
            <Button
              className="bg-[#3F4A5A] hover:bg-[#3F4A5A]/90"
              onClick={handleSubmitMentalDeep}
            >
              제출
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 신체 건강 심층 검진 모달 */}
      <Dialog open={isPhysicalDeepCheckOpen} onOpenChange={setIsPhysicalDeepCheckOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">
              신체 건강 심층 검진
            </DialogTitle>
            <DialogDescription className="text-sm text-[#6E8FB3]">
              표준화된 신체 건강 도구를 활용한 전문 건강 검진입니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-sm text-[#6E8FB3] leading-relaxed">
              <p className="mb-2">본 검진은 표준화된 신체 건강 도구를 활용하여</p>
              <p className="mb-2">직원 본인의 신체 상태를 정기적으로 점검합니다.</p>
              <p>본 검사는 정확한 심층 평가를 위한 도구이며,</p>
              <p>검사 결과는 전문 상담이 필요한 경우 의료 전문가에게 전달됩니다.</p>
            </div>

            <div className="border-t border-[#DADDE1] my-4"></div>

            <p className="text-sm text-[#1F2328] font-medium">지난 2주간을 기준으로 응답해주세요.</p>

            <div className="space-y-4">
              {[
                { q: '1. 손목 또는 손가락 통증이 얼마나 자주 있었나요?', desc: '0 (전혀 없음) ~ 10 (거의 매일)' },
                { q: '2. 목이나 어깨 결림이 얼마나 자주 있었나요?', desc: '0 (전혀 없음) ~ 10 (거의 매일)' },
                { q: '3. 허리 또는 허리 주변 불편감이 얼마나 자주 있었나요?', desc: '0 (전혀 없음) ~ 10 (거의 매일)' },
                { q: '4. 수면의 질이 얼마나 좋았나요?', desc: '0 (매우 나쁨) ~ 10 (매우 좋음)' },
              ].map((item, index) => (
                <SurveyQuestion key={index}>
                  <SurveyQuestionText>{item.q}</SurveyQuestionText>
                  <SurveyQuestionDesc>{item.desc}</SurveyQuestionDesc>
                  <SurveyAnswerGrid>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SurveyAnswerButton
                        key={num}
                        onClick={() => {
                          const newAnswers = [...physicalDeepAnswers];
                          newAnswers[index] = num;
                          setPhysicalDeepAnswers(newAnswers);
                        }}
                        $isSelected={physicalDeepAnswers[index] === num}
                      >
                        {num}
                      </SurveyAnswerButton>
                    ))}
                  </SurveyAnswerGrid>
                </SurveyQuestion>
              ))}
            </div>

            <SurveyInfoBox>
              <p>※ 본 검사는 전문 검사 도구로, 개인정보로 엄격 관리됩니다.</p>
              <p className="mt-1">
                검사 결과는 건강 관리 목적으로만 활용되며, 필요시 전문 상담이 연계됩니다.
              </p>
            </SurveyInfoBox>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-[#DADDE1]">
            <Button
              variant="outline"
              onClick={() => {
                setIsPhysicalDeepCheckOpen(false);
                setPhysicalDeepAnswers([0, 0, 0, 0]);
              }}
            >
              취소
            </Button>
            <Button
              className="bg-[#3F4A5A] hover:bg-[#3F4A5A]/90"
              onClick={handleSubmitPhysicalDeep}
            >
              제출
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPersonalHealthRoot>
  );
}
