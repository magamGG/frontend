import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { CheckCircle, Calendar, Clock, FileText, AlertCircle, Activity } from 'lucide-react';
import { toast } from 'sonner';
import {
  ArtistHealthRoot,
  ArtistHealthBody,
  NextCheckupCard,
  NextCheckupHeader,
  NextCheckupTitle,
  NextCheckupGrid,
  NextCheckupItem,
  NextCheckupItemHeader,
  NextCheckupItemContent,
  NextCheckupItemLabel,
  NextCheckupItemDate,
  NextCheckupItemMeta,
  DeepCheckupGrid,
  DeepCheckupCard,
  DeepCheckupHeader,
  DeepCheckupTitle,
  CompletedStatusBox,
  CompletedStatusHeader,
  CompletedStatusText,
  CompletedStatusList,
  CompletedStatusItem,
  CompletedStatusLabel,
  CompletedStatusValue,
  ResultDetailBox,
  ResultDetailTitle,
  ResultDetailText,
  ResultDetailAlert,
  ResultDetailAlertContent,
  ResultDetailAlertText,
  NextCheckupDateBox,
  NextCheckupDateLabel,
  NextCheckupDateValue,
  IncompleteStatusBox,
  IncompleteStatusIcon,
  IncompleteStatusText,
  IncompleteStatusSubtext,
  SurveyModalContent,
  SurveyDescription,
  SurveyDivider,
  SurveyQuestionList,
  SurveyQuestion,
  SurveyQuestionText,
  SurveyQuestionDesc,
  SurveyAnswerButtons,
  SurveyAnswerButton,
  SurveyInfoBox,
  SurveyInfoText,
  SurveyModalActions,
} from './ArtistHealthPage.styled';

// TODO: Zustand store mapping - 다음 검진 예정일 데이터
const initialNextCheckupDate = {
  mentalCheckup: '2026.01.25',
  physicalCheckup: '2026.02.01',
  daysUntilMental: 7,
  daysUntilPhysical: 14,
};

// TODO: Zustand store mapping - 심층 검진 검사 데이터
const initialDeepCheckupData = {
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
};

export function ArtistHealthPage() {
  const [isMentalSelfCheckOpen, setIsMentalSelfCheckOpen] = useState(false);
  const [isPhysicalSelfCheckOpen, setIsPhysicalSelfCheckOpen] = useState(false);
  const [isMentalDeepCheckOpen, setIsMentalDeepCheckOpen] = useState(false);
  const [isPhysicalDeepCheckOpen, setIsPhysicalDeepCheckOpen] = useState(false);

  const [mentalSelfAnswers, setMentalSelfAnswers] = useState([null, null, null, null]);
  const [physicalSelfAnswers, setPhysicalSelfAnswers] = useState([null, null, null, null]);
  const [mentalDeepAnswers, setMentalDeepAnswers] = useState([null, null, null, null]);
  const [physicalDeepAnswers, setPhysicalDeepAnswers] = useState([null, null, null, null]);

  const [nextCheckupDate] = useState(initialNextCheckupDate);
  const [deepCheckupData, setDeepCheckupData] = useState(initialDeepCheckupData);

  const handleSubmitMentalSelf = () => {
    // 모든 문항이 선택되었는지 확인
    if (mentalSelfAnswers.some(answer => answer === null)) {
      toast.error('모든 문항에 답변해주세요.');
      return;
    }
    toast.success('정신 건강 자가검진이 제출되었습니다.');
    setIsMentalSelfCheckOpen(false);
    setMentalSelfAnswers([null, null, null, null]);
  };

  const handleSubmitPhysicalSelf = () => {
    // 모든 문항이 선택되었는지 확인
    if (physicalSelfAnswers.some(answer => answer === null)) {
      toast.error('모든 문항에 답변해주세요.');
      return;
    }
    toast.success('신체 건강 자가검진이 제출되었습니다.');
    setIsPhysicalSelfCheckOpen(false);
    setPhysicalSelfAnswers([null, null, null, null]);
  };

  const handleSubmitMentalDeep = () => {
    // 모든 문항이 선택되었는지 확인
    if (mentalDeepAnswers.some(answer => answer === null)) {
      toast.error('모든 문항에 답변해주세요.');
      return;
    }
    toast.success('정신 건강 심층 검진이 제출되었습니다.');
    setIsMentalDeepCheckOpen(false);
    setMentalDeepAnswers([null, null, null, null]);
  };

  const handleSubmitPhysicalDeep = () => {
    // 모든 문항이 선택되었는지 확인
    if (physicalDeepAnswers.some(answer => answer === null)) {
      toast.error('모든 문항에 답변해주세요.');
      return;
    }
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
    setPhysicalDeepAnswers([null, null, null, null]);
  };

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
    <ArtistHealthRoot>
      <ArtistHealthBody>
        {/* 다음 검진 예정일 */}
        <NextCheckupCard>
          <NextCheckupHeader>
            <Calendar className="w-5 h-5" style={{ color: '#6E8FB3' }} />
            <NextCheckupTitle>다음 검진 예정일</NextCheckupTitle>
          </NextCheckupHeader>

          <NextCheckupGrid>
            {/* 정신 건강 검진 */}
            <NextCheckupItem
              $bgGradient="linear-gradient(to bottom right, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.05))"
              $borderColor="rgba(168, 85, 247, 0.2)"
            >
              <NextCheckupItemHeader>
                <NextCheckupItemContent>
                  <NextCheckupItemLabel $color="#9333ea">정신 건강 심층 검진</NextCheckupItemLabel>
                  <NextCheckupItemDate>{nextCheckupDate.mentalCheckup}</NextCheckupItemDate>
                </NextCheckupItemContent>
                <Badge className="bg-green-600 text-white text-xs px-2 py-1">완료</Badge>
              </NextCheckupItemHeader>
              <NextCheckupItemMeta>
                <Clock className="w-3.5 h-3.5" />
                <span>다음 검진까지 {nextCheckupDate.daysUntilMental}일 남음</span>
              </NextCheckupItemMeta>
            </NextCheckupItem>

            {/* 신체 건강 검진 */}
            <NextCheckupItem
              $bgGradient="linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))"
              $borderColor="rgba(59, 130, 246, 0.2)"
            >
              <NextCheckupItemHeader>
                <NextCheckupItemContent>
                  <NextCheckupItemLabel $color="#2563eb">신체 건강 심층 검진</NextCheckupItemLabel>
                  <NextCheckupItemDate>{nextCheckupDate.physicalCheckup}</NextCheckupItemDate>
                </NextCheckupItemContent>
                <Badge className="bg-orange-600 text-white text-xs px-2 py-1">D-{nextCheckupDate.daysUntilPhysical}</Badge>
              </NextCheckupItemHeader>
              <NextCheckupItemMeta>
                <Clock className="w-3.5 h-3.5" />
                <span>{nextCheckupDate.physicalCheckup}까지 검사 완료 필요</span>
              </NextCheckupItemMeta>
            </NextCheckupItem>
          </NextCheckupGrid>
        </NextCheckupCard>

        {/* 심층 검진 검사 현황 */}
        <DeepCheckupGrid>
          {/* 정신 건강 심층 검사 */}
          <DeepCheckupCard>
            <DeepCheckupHeader>
              <FileText className="w-5 h-5" style={{ color: '#9333ea' }} />
              <DeepCheckupTitle>정신 건강 심층 검사</DeepCheckupTitle>
            </DeepCheckupHeader>

            {deepCheckupData.mental.isCompleted ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <CompletedStatusBox>
                  <CompletedStatusHeader>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <CompletedStatusText>검사 완료</CompletedStatusText>
                  </CompletedStatusHeader>
                  <CompletedStatusList>
                    <CompletedStatusItem>
                      <CompletedStatusLabel>검사 일자</CompletedStatusLabel>
                      <CompletedStatusValue>{deepCheckupData.mental.lastCheckDate}</CompletedStatusValue>
                    </CompletedStatusItem>
                    <CompletedStatusItem>
                      <CompletedStatusLabel>검사 점수</CompletedStatusLabel>
                      <CompletedStatusValue>{deepCheckupData.mental.score}점</CompletedStatusValue>
                    </CompletedStatusItem>
                    <CompletedStatusItem>
                      <CompletedStatusLabel>상태</CompletedStatusLabel>
                      <Badge className={`${getStatusBadgeClass(deepCheckupData.mental.status)} text-xs px-2 py-0.5`}>
                        {deepCheckupData.mental.status}
                      </Badge>
                    </CompletedStatusItem>
                  </CompletedStatusList>
                </CompletedStatusBox>

                <ResultDetailBox>
                  <ResultDetailTitle>검사 결과</ResultDetailTitle>
                  <ResultDetailText>
                    귀하의 정신 건강 점수는 <strong style={{ color: '#1f2328' }}>{deepCheckupData.mental.score}점</strong>으로{' '}
                    <strong style={{ color: '#ea580c' }}>주의</strong> 단계입니다.
                  </ResultDetailText>
                  <ResultDetailAlert>
                    <ResultDetailAlertContent>
                      <AlertCircle className="w-4 h-4 text-orange-600" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <ResultDetailAlertText>
                        <p>• 스트레스 관리와 충분한 휴식이 필요합니다.</p>
                        <p>• 정기적인 운동과 취미 활동을 권장합니다.</p>
                        <p>• 증상이 지속되면 전문가 상담을 받으시기 바랍니다.</p>
                      </ResultDetailAlertText>
                    </ResultDetailAlertContent>
                  </ResultDetailAlert>
                </ResultDetailBox>

                <NextCheckupDateBox $bgColor="#faf5ff" $borderColor="rgba(168, 85, 247, 0.2)">
                  <NextCheckupDateLabel>
                    <Calendar className="w-4 h-4" style={{ color: '#9333ea' }} />
                    <span>다음 검진일</span>
                  </NextCheckupDateLabel>
                  <NextCheckupDateValue $color="#9333ea">{deepCheckupData.mental.nextCheckDate}</NextCheckupDateValue>
                </NextCheckupDateBox>

                <Button variant="outline" className="w-full" disabled>
                  검사 완료
                </Button>
              </div>
            ) : (
              <IncompleteStatusBox>
                <IncompleteStatusIcon>
                  <Activity className="w-12 h-12" />
                </IncompleteStatusIcon>
                <IncompleteStatusText>아직 검사를 진행하지 않았습니다.</IncompleteStatusText>
                <Button 
                  onClick={() => {
                    setMentalDeepAnswers([null, null, null, null]);
                    setIsMentalDeepCheckOpen(true);
                  }} 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  검사하기
                </Button>
              </IncompleteStatusBox>
            )}
          </DeepCheckupCard>

          {/* 신체 건강 심층 검사 */}
          <DeepCheckupCard>
            <DeepCheckupHeader>
              <FileText className="w-5 h-5" style={{ color: '#2563eb' }} />
              <DeepCheckupTitle>신체 건강 심층 검사</DeepCheckupTitle>
            </DeepCheckupHeader>

            {deepCheckupData.physical.isCompleted ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <CompletedStatusBox>
                  <CompletedStatusHeader>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <CompletedStatusText>검사 완료</CompletedStatusText>
                  </CompletedStatusHeader>
                  <CompletedStatusList>
                    <CompletedStatusItem>
                      <CompletedStatusLabel>검사 일자</CompletedStatusLabel>
                      <CompletedStatusValue>{deepCheckupData.physical.lastCheckDate}</CompletedStatusValue>
                    </CompletedStatusItem>
                    <CompletedStatusItem>
                      <CompletedStatusLabel>검사 점수</CompletedStatusLabel>
                      <CompletedStatusValue>{deepCheckupData.physical.score}점</CompletedStatusValue>
                    </CompletedStatusItem>
                    <CompletedStatusItem>
                      <CompletedStatusLabel>상태</CompletedStatusLabel>
                      <Badge className={`${getStatusBadgeClass(deepCheckupData.physical.status)} text-xs px-2 py-0.5`}>
                        {deepCheckupData.physical.status}
                      </Badge>
                    </CompletedStatusItem>
                  </CompletedStatusList>
                </CompletedStatusBox>

                <ResultDetailBox>
                  <ResultDetailTitle>검사 결과</ResultDetailTitle>
                  <ResultDetailText>
                    귀하의 신체 건강 점수는 <strong style={{ color: '#1f2328' }}>{deepCheckupData.physical.score}점</strong>으로{' '}
                    <strong style={{ color: '#ea580c' }}>주의</strong> 단계입니다.
                  </ResultDetailText>
                  <ResultDetailAlert>
                    <ResultDetailAlertContent>
                      <AlertCircle className="w-4 h-4 text-orange-600" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <ResultDetailAlertText>
                        <p>• 손목/손가락 통증에 주의가 필요합니다.</p>
                        <p>• 정기적인 스트레칭과 바른 자세를 유지하세요.</p>
                        <p>• 증상이 심해지면 의료 전문가와 상담하세요.</p>
                      </ResultDetailAlertText>
                    </ResultDetailAlertContent>
                  </ResultDetailAlert>
                </ResultDetailBox>

                <NextCheckupDateBox $bgColor="#eff6ff" $borderColor="rgba(59, 130, 246, 0.2)">
                  <NextCheckupDateLabel>
                    <Calendar className="w-4 h-4" style={{ color: '#2563eb' }} />
                    <span>다음 검진일</span>
                  </NextCheckupDateLabel>
                  <NextCheckupDateValue $color="#2563eb">{deepCheckupData.physical.nextCheckDate}</NextCheckupDateValue>
                </NextCheckupDateBox>

                <Button variant="outline" className="w-full" disabled>
                  검사 완료
                </Button>
              </div>
            ) : (
              <IncompleteStatusBox $isWarning>
                <IncompleteStatusIcon $isWarning>
                  <AlertCircle className="w-14 h-14" />
                </IncompleteStatusIcon>
                <IncompleteStatusText $isWarning>검사가 아직 완료되지 않았습니다</IncompleteStatusText>
                <IncompleteStatusSubtext>2026.02.01까지 검사를 완료해주세요</IncompleteStatusSubtext>
                <Button 
                  onClick={() => {
                    setPhysicalDeepAnswers([null, null, null, null]);
                    setIsPhysicalDeepCheckOpen(true);
                  }} 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md"
                >
                  검사 시작하기
                </Button>
              </IncompleteStatusBox>
            )}
          </DeepCheckupCard>
        </DeepCheckupGrid>
      </ArtistHealthBody>

      {/* 정신 건강 자가검진 모달 */}
      <Dialog 
        open={isMentalSelfCheckOpen} 
        onOpenChange={(open) => {
          setIsMentalSelfCheckOpen(open);
          if (open) {
            setMentalSelfAnswers([null, null, null, null]);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] bg-white max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">정신 건강 자가검진</DialogTitle>
            <DialogDescription className="text-sm text-[#6E8FB3]">
              일일 정신 건강 상태를 간단히 체크하는 자가 진단 설문입니다.
            </DialogDescription>
          </DialogHeader>

          <SurveyModalContent>
            <SurveyDescription>
              <p className="mb-2">본 설문은 작가·어시스턴트·직업의</p>
              <p className="mb-2">일일 정신 건강상태를 간단히 체크할 기회 자가 체크 설문입니다.</p>
              <p>익명의 질답을 목적으로 하지 않으며, 응답 결과는</p>
              <p>에이전시 운영 감리 인그 자료로만 활용됩니다. ⓘ</p>
            </SurveyDescription>

            <SurveyDivider />

            <p className="text-sm text-[#1F2328] font-medium">최근 하루를 기준으로 응답해주세요.</p>

            <SurveyQuestionList>
              {[
                { q: '1. 오늘 전반적인 기분 상태는 어떠셨나요?', desc: '0 (매우 나쁨) ~ 10 (매우 좋음)' },
                { q: '2. 오늘 불안하거나 초조한 느낌이 있었나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '3. 오늘 스트레스를 강하게 느꼈나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '4. 오늘 직업에 대한 의욕은 어느 정도였나요?', desc: '0 (전혀 없음) ~ 10 (매우 높음)' },
              ].map((item, index) => (
                <SurveyQuestion key={index}>
                  <SurveyQuestionText>{item.q}</SurveyQuestionText>
                  <SurveyQuestionDesc>{item.desc}</SurveyQuestionDesc>
                  <SurveyAnswerButtons>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SurveyAnswerButton
                        key={num}
                        onClick={() => {
                          const newAnswers = [...mentalSelfAnswers];
                          newAnswers[index] = num;
                          setMentalSelfAnswers(newAnswers);
                        }}
                        $isSelected={mentalSelfAnswers[index] === num}
                      >
                        {num}
                      </SurveyAnswerButton>
                    ))}
                  </SurveyAnswerButtons>
                </SurveyQuestion>
              ))}
            </SurveyQuestionList>

            <SurveyInfoBox>
              <SurveyInfoText>
                <p>※ 본 설문은 건강 목적이 아닌 상태 확인을 제공합니다.</p>
                <p className="mt-1">
                  결과는 지인에게 공문으로 제공되며 있으며, 점수는 계속 추적 못할 분석 및 비밀 상태 안내만이 사용됩니다. (사후출납)
                </p>
              </SurveyInfoText>
            </SurveyInfoBox>
          </SurveyModalContent>

          <SurveyModalActions>
            <Button
              variant="outline"
              onClick={() => {
                setIsMentalSelfCheckOpen(false);
                setMentalSelfAnswers([null, null, null, null]);
              }}
            >
              취소
            </Button>
            <Button className="bg-[#3F4A5A] hover:bg-[#3F4A5A]/90" onClick={handleSubmitMentalSelf}>
              제출
            </Button>
          </SurveyModalActions>
        </DialogContent>
      </Dialog>

      {/* 신체 건강 자가검진 모달 */}
      <Dialog 
        open={isPhysicalSelfCheckOpen} 
        onOpenChange={(open) => {
          setIsPhysicalSelfCheckOpen(open);
          if (open) {
            setPhysicalSelfAnswers([null, null, null, null]);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] bg-white max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">신체 건강 자가검진</DialogTitle>
            <DialogDescription className="text-sm text-[#6E8FB3]">
              일일 신체 건강 상태를 간단히 체크하는 자가 진단 설문입니다.
            </DialogDescription>
          </DialogHeader>

          <SurveyModalContent>
            <SurveyDescription>
              <p className="mb-2">본 설문은 번역 직업으로 인한</p>
              <p className="mb-2">신체 건강상 변 피로 상태를 간단히 점검하기 위한 자가 체크 설문입니다.</p>
              <p>익명의 질답이나 치료를 대체하지 않습니다.</p>
            </SurveyDescription>

            <SurveyDivider />

            <p className="text-sm text-[#1F2328] font-medium">최근 하루를 기준으로 응답해주세요.</p>

            <SurveyQuestionList>
              {[
                { q: '1. 오늘 손목 또는 손가락 통증은 어느 정도였나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '2. 오늘 목이나 어깨 결림은 어느 정도였나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '3. 오늘 허리 또는 허리 주변 불편감이 있었나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '4. 전날 수면 시간은 어느 정도였나요?', desc: '시간', time: true },
              ].map((item, index) => (
                <SurveyQuestion key={index}>
                  <SurveyQuestionText>{item.q}</SurveyQuestionText>
                  <SurveyQuestionDesc>{item.desc}</SurveyQuestionDesc>
                  {item.time ? (
                    <input
                      type="number"
                      min="0"
                      max="24"
                      className="w-20 h-10 px-3 border border-[#DADDE1] rounded-md text-sm"
                      placeholder="시간"
                    />
                  ) : (
                    <SurveyAnswerButtons>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SurveyAnswerButton
                          key={num}
                          onClick={() => {
                            const newAnswers = [...physicalSelfAnswers];
                            newAnswers[index] = num;
                            setPhysicalSelfAnswers(newAnswers);
                          }}
                          $isSelected={physicalSelfAnswers[index] === num}
                        >
                          {num}
                        </SurveyAnswerButton>
                      ))}
                    </SurveyAnswerButtons>
                  )}
                </SurveyQuestion>
              ))}
            </SurveyQuestionList>

            <SurveyInfoBox>
              <SurveyInfoText>
                <p>※ 본 설문은 신체 상태 확인을 위한 연구용 제공합니다.</p>
                <p className="mt-1">응답 결과는 건강 관리 목적의 알고 자료로만 활용됩니다.</p>
              </SurveyInfoText>
            </SurveyInfoBox>
          </SurveyModalContent>

          <SurveyModalActions>
            <Button
              variant="outline"
              onClick={() => {
                setIsPhysicalSelfCheckOpen(false);
                setPhysicalSelfAnswers([null, null, null, null]);
              }}
            >
              취소
            </Button>
            <Button className="bg-[#3F4A5A] hover:bg-[#3F4A5A]/90" onClick={handleSubmitPhysicalSelf}>
              제출
            </Button>
          </SurveyModalActions>
        </DialogContent>
      </Dialog>

      {/* 정신 건강 심층 검진 모달 */}
      <Dialog 
        open={isMentalDeepCheckOpen} 
        onOpenChange={(open) => {
          setIsMentalDeepCheckOpen(open);
          if (open) {
            setMentalDeepAnswers([null, null, null, null]);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] bg-white max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">정신 건강 심층 검진</DialogTitle>
            <DialogDescription className="text-sm text-[#6E8FB3]">
              PHQ-9·GAD-7 표준화 도구를 활용한 전문 정신 건강 검진입니다.
            </DialogDescription>
          </DialogHeader>

          <SurveyModalContent>
            <SurveyDescription>
              <p className="mb-2">본 검진은 PHQ-9·GAD-7 표준화된 도구를 활용하여</p>
              <p className="mb-2">직원 본인의 우울·불안 수준을 정기적으로 점검합니다.</p>
              <p>본 검사는 정확한 심층 평가를 위한 도구이며,</p>
              <p>검사 결과는 전문 상담이 필요한 경우 임상 전문가에게 전달됩니다.</p>
            </SurveyDescription>

            <SurveyDivider />

            <p className="text-sm text-[#1F2328] font-medium">지난 2주간을 기준으로 응답해주세요.</p>

            <SurveyQuestionList>
              {[
                { q: '1. 일 또는 여가 활동을 하는 데 흥미나 즐거움을 느끼지 못함', desc: '0 (전혀 없음) ~ 10 (거의 매일)' },
                { q: '2. 기분이 가라앉거나 우울하거나 희망이 없다고 느낌', desc: '0 (전혀 없음) ~ 10 (거의 매일)' },
                { q: '3. 잠들기 어렵거나 자주 깨거나 너무 많이 잠', desc: '0 (전혀 없음) ~ 10 (거의 매일)' },
                { q: '4. 피곤하다고 느끼거나 기력이 거의 없음', desc: '0 (전혀 없음) ~ 10 (거의 매일)' },
              ].map((item, index) => (
                <SurveyQuestion key={index}>
                  <SurveyQuestionText>{item.q}</SurveyQuestionText>
                  <SurveyQuestionDesc>{item.desc}</SurveyQuestionDesc>
                  <SurveyAnswerButtons>
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
                  </SurveyAnswerButtons>
                </SurveyQuestion>
              ))}
            </SurveyQuestionList>

            <SurveyInfoBox>
              <SurveyInfoText>
                <p>※ 본 검사는 전문 검사 도구로, 개인정보로 엄격 관리됩니다.</p>
                <p className="mt-1">15점 이상 시 담당자에게 즉시 알림 발송 및 전문 상담 연계가 권장됩니다.</p>
              </SurveyInfoText>
            </SurveyInfoBox>
          </SurveyModalContent>

          <SurveyModalActions>
            <Button
              variant="outline"
              onClick={() => {
                setIsMentalDeepCheckOpen(false);
                setMentalDeepAnswers([null, null, null, null]);
              }}
            >
              취소
            </Button>
            <Button className="bg-[#3F4A5A] hover:bg-[#3F4A5A]/90" onClick={handleSubmitMentalDeep}>
              제출
            </Button>
          </SurveyModalActions>
        </DialogContent>
      </Dialog>

      {/* 신체 건강 심층 검진 모달 */}
      <Dialog 
        open={isPhysicalDeepCheckOpen} 
        onOpenChange={(open) => {
          setIsPhysicalDeepCheckOpen(open);
          if (open) {
            setPhysicalDeepAnswers([null, null, null, null]);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] bg-white max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">신체 건강 심층 검진</DialogTitle>
            <DialogDescription className="text-sm text-[#6E8FB3]">
              표준화된 신체 건강 도구를 활용한 전문 건강 검진입니다.
            </DialogDescription>
          </DialogHeader>

          <SurveyModalContent>
            <SurveyDescription>
              <p className="mb-2">본 검진은 표준화된 신체 건강 도구를 활용하여</p>
              <p className="mb-2">직원 본인의 신체 상태를 정기적으로 점검합니다.</p>
              <p>본 검사는 정확한 심층 평가를 위한 도구이며,</p>
              <p>검사 결과는 전문 상담이 필요한 경우 의료 전문가에게 전달됩니다.</p>
            </SurveyDescription>

            <SurveyDivider />

            <p className="text-sm text-[#1F2328] font-medium">지난 1개월을 기준으로 응답해주세요.</p>

            <SurveyQuestionList>
              {[
                { q: '1. 손목이나 손가락의 통증 및 불편감이 있었나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '2. 목, 어깨, 등의 통증 및 결림이 있었나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '3. 허리 통증 및 불편감이 있었나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '4. 전반적인 피로도와 무기력함을 느꼈나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
              ].map((item, index) => (
                <SurveyQuestion key={index}>
                  <SurveyQuestionText>{item.q}</SurveyQuestionText>
                  <SurveyQuestionDesc>{item.desc}</SurveyQuestionDesc>
                  <SurveyAnswerButtons>
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
                  </SurveyAnswerButtons>
                </SurveyQuestion>
              ))}
            </SurveyQuestionList>

            <SurveyInfoBox>
              <SurveyInfoText>
                <p>※ 본 검사는 전문 검사 도구로, 개인정보로 엄격 관리됩니다.</p>
                <p className="mt-1">15점 이상 시 담당자에게 즉시 알림 발송 및 전문 상담 연계가 권장됩니다.</p>
              </SurveyInfoText>
            </SurveyInfoBox>
          </SurveyModalContent>

          <SurveyModalActions>
            <Button
              variant="outline"
              onClick={() => {
                setIsPhysicalDeepCheckOpen(false);
                setPhysicalDeepAnswers([null, null, null, null]);
              }}
            >
              취소
            </Button>
            <Button className="bg-[#3F4A5A] hover:bg-[#3F4A5A]/90" onClick={handleSubmitPhysicalDeep}>
              제출
            </Button>
          </SurveyModalActions>
        </DialogContent>
      </Dialog>
    </ArtistHealthRoot>
  );
}
