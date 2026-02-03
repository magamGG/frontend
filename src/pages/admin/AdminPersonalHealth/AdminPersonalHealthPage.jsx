import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { CheckCircle, Calendar, Clock, FileText, AlertCircle, Activity, Shield, Stethoscope, X } from 'lucide-react';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import {
  AdminPersonalHealthRoot,
  AdminPersonalHealthBody,
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
} from './AdminPersonalHealthPage.styled';

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
    status: '미완료',
    isCompleted: false,
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

export function AdminPersonalHealthPage() {
  const { user } = useAuthStore();
  const memberNo = user?.memberNo;

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

  // 신체 건강 심층 검사 질문 데이터 state
  const [physicalDeepQuestions, setPhysicalDeepQuestions] = useState([]);
  const [isLoadingPhysicalQuestions, setIsLoadingPhysicalQuestions] = useState(false);

  // 정신 건강 심층 검사 질문 데이터 state
  const [mentalDeepQuestions, setMentalDeepQuestions] = useState([]);
  const [isLoadingMentalQuestions, setIsLoadingMentalQuestions] = useState(false);

  // API 호출 함수 - 신체 건강 심층 검사 질문 가져오기
  const fetchPhysicalDeepQuestions = async () => {
    try {
      setIsLoadingPhysicalQuestions(true);
      // 백엔드 API 호출 - "월간 신체" 타입으로 질문 조회
      // 백엔드 처리: HealthSurveyController.getQuestionsBySurveyType() 
      // → HealthSurveyServiceImpl.getQuestionsBySurveyType()
      // → HealthSurveyQuestionRepository.findByHealthSurveyQuestionTypeOrderByHealthSurveyOrderAsc()
      // HEALTH_SURVEY_QUESTION_TYPE 컬럼으로 타입 구분하여 조회
      const response = await fetch('/api/health-surveys/type/월간 신체/questions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('질문을 불러오는데 실패했습니다.');
      }
      
      const questions = await response.json();
      // healthSurveyOrder 순서로 정렬
      const sortedQuestions = questions.sort((a, b) => 
        (a.healthSurveyOrder || 0) - (b.healthSurveyOrder || 0)
      );
      setPhysicalDeepQuestions(sortedQuestions);
      
      // 답변 배열 초기화 (질문 개수에 맞게)
      setPhysicalDeepAnswers(new Array(sortedQuestions.length).fill(null));
    } catch (error) {
      console.error('질문 로드 실패:', error);
      toast.error('질문을 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingPhysicalQuestions(false);
    }
  };

  // API 호출 함수 - 정신 건강 심층 검사 질문 가져오기
  const fetchMentalDeepQuestions = async () => {
    try {
      setIsLoadingMentalQuestions(true);
      // 백엔드 API 호출 - "월간 정신" 타입으로 질문 조회
      // 백엔드 처리: HealthSurveyController.getQuestionsBySurveyType() 
      // → HealthSurveyServiceImpl.getQuestionsBySurveyType()
      // → HealthSurveyQuestionRepository.findByHealthSurveyQuestionTypeOrderByHealthSurveyOrderAsc()
      // HEALTH_SURVEY_QUESTION_TYPE 컬럼으로 타입 구분하여 조회
      const response = await fetch('/api/health-surveys/type/월간 정신/questions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('질문을 불러오는데 실패했습니다.');
      }
      
      const questions = await response.json();
      // healthSurveyOrder 순서로 정렬
      const sortedQuestions = questions.sort((a, b) => 
        (a.healthSurveyOrder || 0) - (b.healthSurveyOrder || 0)
      );
      setMentalDeepQuestions(sortedQuestions);
      
      // 답변 배열 초기화 (질문 개수에 맞게)
      setMentalDeepAnswers(new Array(sortedQuestions.length).fill(null));
    } catch (error) {
      console.error('질문 로드 실패:', error);
      toast.error('질문을 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingMentalQuestions(false);
    }
  };

  // 모달이 열릴 때 질문 로드
  useEffect(() => {
    if (isPhysicalDeepCheckOpen) {
      fetchPhysicalDeepQuestions();
    }
  }, [isPhysicalDeepCheckOpen]);

  // 정신 건강 심층 검진 모달이 열릴 때 질문 로드
  useEffect(() => {
    if (isMentalDeepCheckOpen) {
      fetchMentalDeepQuestions();
    }
  }, [isMentalDeepCheckOpen]);

  // 기본 닫기 버튼 숨기기
  useEffect(() => {
    if (isPhysicalDeepCheckOpen) {
      const hideCloseButton = () => {
        const closeButton = document.querySelector('.physical-deep-check-modal [data-slot="dialog-close"]');
        if (closeButton) {
          (closeButton).style.display = 'none';
          (closeButton).style.visibility = 'hidden';
          (closeButton).style.opacity = '0';
          (closeButton).style.pointerEvents = 'none';
        }
      };
      
      // 여러 번 시도
      const timer1 = setTimeout(hideCloseButton, 0);
      const timer2 = setTimeout(hideCloseButton, 10);
      const timer3 = setTimeout(hideCloseButton, 50);
      const timer4 = setTimeout(hideCloseButton, 100);
      
      // MutationObserver로 DOM 변경 감지
      const observer = new MutationObserver(() => {
        hideCloseButton();
      });
      
      const modalElement = document.querySelector('.physical-deep-check-modal');
      if (modalElement) {
        observer.observe(modalElement, { childList: true, subtree: true });
      }
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        observer.disconnect();
      };
    }
  }, [isPhysicalDeepCheckOpen]);

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

  const handleSubmitMentalDeep = async () => {
    // 모든 문항이 선택되었는지 확인
    if (mentalDeepAnswers.some(answer => answer === null)) {
      toast.error('모든 문항에 답변해주세요.');
      return;
    }

    if (!memberNo) {
      toast.error('회원 정보를 찾을 수 없습니다.');
      return;
    }

    if (mentalDeepQuestions.length === 0) {
      toast.error('질문 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      // healthSurveyNo를 질문 데이터에서 가져오기
      const healthSurveyNo = mentalDeepQuestions[0]?.healthSurveyNo;
      if (!healthSurveyNo) {
        toast.error('설문 정보를 찾을 수 없습니다.');
        return;
      }

      // 각 문항별 점수의 총합 계산 (프론트엔드에서 로직 처리)
      const totalScore = mentalDeepAnswers.reduce((sum, score) => sum + (score || 0), 0);

      // API 호출 (총점만 전송, 백엔드에서 HEALTH_SURVEY_QUESTION_ITEM_ANSWER_SCORE에 저장)
      // 백엔드 처리: HealthSurveyController.submitSurveyResponse()
      // → HealthSurveyServiceImpl.submitSurveyResponse()
      // → HealthSurveyQuestion의 HEALTH_SURVEY_QUESTION_TYPE으로 위험도 평가
      const response = await fetch(`/api/health-surveys/${healthSurveyNo}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberNo: memberNo,
          totalScore: totalScore
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '제출에 실패했습니다.');
      }

      const result = await response.json();
      
      // 완료 상태 업데이트
      const today = new Date();
      const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

      // 백엔드에서 반환하는 riskLevel: "정상", "주의", "경고", "위험"
      let status = result.riskLevel || '정상';

      setDeepCheckupData({
        ...deepCheckupData,
        mental: {
          lastCheckDate: formattedDate,
          score: result.totalScore || 0,
          status: status,
          isCompleted: true,
          nextCheckDate: deepCheckupData.mental.nextCheckDate,
        },
      });

      toast.success('정신 건강 심층 검진이 제출되었습니다.');
      setIsMentalDeepCheckOpen(false);
      setMentalDeepAnswers([]);
      setMentalDeepQuestions([]);
    } catch (error) {
      console.error('제출 실패:', error);
      toast.error(error.message || '제출에 실패했습니다.');
    }
  };

  const handleSubmitPhysicalDeep = async () => {
    // 모든 문항이 선택되었는지 확인
    if (physicalDeepAnswers.some(answer => answer === null)) {
      toast.error('모든 문항에 답변해주세요.');
      return;
    }

    if (!memberNo) {
      toast.error('회원 정보를 찾을 수 없습니다.');
      return;
    }

    if (physicalDeepQuestions.length === 0) {
      toast.error('질문 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      // healthSurveyNo를 질문 데이터에서 가져오기
      const healthSurveyNo = physicalDeepQuestions[0]?.healthSurveyNo;
      if (!healthSurveyNo) {
        toast.error('설문 정보를 찾을 수 없습니다.');
        return;
      }

      // 각 문항별 점수의 총합 계산 (프론트엔드에서 로직 처리)
      const totalScore = physicalDeepAnswers.reduce((sum, score) => sum + (score || 0), 0);

      // API 호출 (총점만 전송, 백엔드에서 HEALTH_SURVEY_QUESTION_ITEM_ANSWER_SCORE에 저장)
      // 백엔드 처리: HealthSurveyController.submitSurveyResponse()
      // → HealthSurveyServiceImpl.submitSurveyResponse()
      // → HealthSurveyQuestion의 HEALTH_SURVEY_QUESTION_TYPE으로 위험도 평가
      const response = await fetch(`/api/health-surveys/${healthSurveyNo}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberNo: memberNo,
          totalScore: totalScore
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '제출에 실패했습니다.');
      }

      const result = await response.json();
      
      // 완료 상태 업데이트
      const today = new Date();
      const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

      // 백엔드에서 반환하는 riskLevel: "정상", "주의", "경고", "위험"
      let status = result.riskLevel || '정상';

      setDeepCheckupData({
        ...deepCheckupData,
        physical: {
          lastCheckDate: formattedDate,
          score: result.totalScore || 0,
          status: status,
          isCompleted: true,
          nextCheckDate: deepCheckupData.physical.nextCheckDate,
        },
      });

      toast.success('신체 건강 심층 검진이 제출되었습니다.');
      setIsPhysicalDeepCheckOpen(false);
      setPhysicalDeepAnswers([]);
      setPhysicalDeepQuestions([]);
    } catch (error) {
      console.error('제출 실패:', error);
      toast.error(error.message || '제출에 실패했습니다.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case '위험':
        return 'bg-red-100 text-red-600';
      case '경고':
        return 'bg-yellow-100 text-yellow-600';
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
              <IncompleteStatusBox $isWarning $isPurple>
                <IncompleteStatusIcon $isWarning $isPurple>
                  <AlertCircle className="w-14 h-14" />
                </IncompleteStatusIcon>
                <IncompleteStatusText $isWarning $isPurple>검사가 아직 완료되지 않았습니다</IncompleteStatusText>
                <IncompleteStatusSubtext>{deepCheckupData.mental.nextCheckDate}까지 검사를 완료해주세요</IncompleteStatusSubtext>
                <Button 
                  onClick={() => {
                    setMentalDeepAnswers([]);
                    setMentalDeepQuestions([]);
                    setIsMentalDeepCheckOpen(true);
                  }} 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md"
                >
                  검사 시작하기
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
                    setPhysicalDeepAnswers([]);
                    setPhysicalDeepQuestions([]);
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
      </AdminPersonalHealthBody>

      {/* 정신 건강 심층 검진 모달 */}
      <Dialog 
        open={isMentalDeepCheckOpen} 
        onOpenChange={(open) => {
          setIsMentalDeepCheckOpen(open);
          if (!open) {
            setMentalDeepAnswers([]);
            setMentalDeepQuestions([]);
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

            {isLoadingMentalQuestions ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-[#6E8FB3]">질문을 불러오는 중...</p>
              </div>
            ) : (
              <SurveyQuestionList>
                {mentalDeepQuestions.map((question, index) => {
                  const minScore = question.healthSurveyQuestionMinScore || 0;
                  const maxScore = question.healthSurveyQuestionMaxScore || 10;
                  const scoreOptions = [];
                  
                  // 최소값부터 최대값까지 배열 생성
                  for (let i = minScore; i <= maxScore; i++) {
                    scoreOptions.push(i);
                  }
                  
                  return (
                    <SurveyQuestion key={question.healthSurveyQuestionNo || index}>
                      <SurveyQuestionText>
                        {question.healthSurveyOrder}. {question.healthSurveyQuestionContent}
                      </SurveyQuestionText>
                      <SurveyQuestionDesc>
                        {minScore} (전혀 없음) ~ {maxScore} (거의 매일)
                      </SurveyQuestionDesc>
                      <SurveyAnswerButtons>
                        {scoreOptions.map((num) => (
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
                  );
                })}
              </SurveyQuestionList>
            )}

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
                setMentalDeepAnswers([]);
                setMentalDeepQuestions([]);
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
          if (!open) {
            setPhysicalDeepAnswers([]);
            setPhysicalDeepQuestions([]);
          }
        }}
      >
        <DialogContent className="sm:max-w-[700px] bg-[#F5F5F5] max-h-[85vh] overflow-y-auto p-0 modal-scrollbar-transparent physical-deep-check-modal">
          {/* 헤더 */}
          <div className="flex items-start justify-between p-6 pb-4 bg-white">
            <div className="flex items-start gap-3 flex-1">
              <div className="relative">
                <Shield className="w-8 h-8 text-blue-600" />
                <Stethoscope className="w-6 h-6 text-blue-600 absolute -top-1 -right-1" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl text-[#1F2328] font-bold mb-1">신체 건강 심층 검진</DialogTitle>
                <DialogDescription className="text-sm text-[#6E8FB3]">
                  표준화된 신체 건강 도구를 활용한 전문 건강 검진입니다.
                </DialogDescription>
              </div>
            </div>
            <button
              onClick={() => setIsPhysicalDeepCheckOpen(false)}
              className="text-[#6E8FB3] hover:text-[#1F2328] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <SurveyModalContent>
            <SurveyDescription>
              <p>본 검진은 표준화된 신체 건강 도구를 활용하여 직원 본인의 신체 상태를 정기적으로 점검합니다. 본 검사는 정확한 심층 평가를 위한 도구이며, 검사 결과는 전문 상담이 필요한 경우 의료 전문가에게 전달됩니다.</p>
            </SurveyDescription>

            <SurveyDivider />

            <p className="text-sm text-[#1F2328] font-medium">지난 1개월을 기준으로 응답해주세요.</p>

            {isLoadingPhysicalQuestions ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-[#6E8FB3]">질문을 불러오는 중...</p>
              </div>
            ) : (
              <SurveyQuestionList>
                {physicalDeepQuestions.map((question, index) => {
                  const minScore = question.healthSurveyQuestionMinScore || 0;
                  const maxScore = question.healthSurveyQuestionMaxScore || 10;
                  const scoreOptions = [];
                  
                  // 최소값부터 최대값까지 배열 생성
                  for (let i = minScore; i <= maxScore; i++) {
                    scoreOptions.push(i);
                  }
                  
                  return (
                    <SurveyQuestion key={question.healthSurveyQuestionNo || index}>
                      <SurveyQuestionText>
                        {question.healthSurveyOrder}. {question.healthSurveyQuestionContent}
                      </SurveyQuestionText>
                      <SurveyQuestionDesc>
                        {minScore} (전혀 없음) ~ {maxScore} (매우 심함)
                      </SurveyQuestionDesc>
                      <SurveyAnswerButtons>
                        {scoreOptions.map((num) => (
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
                  );
                })}
              </SurveyQuestionList>
            )}

            <SurveyInfoBox>
              <SurveyInfoText>
                <p>※ 본 검사는 전문 검사 도구로, 개인정보는 엄격하게 관리됩니다. 15점 이상 시 담당자에게 즉시 알림 발송 및 전문 상담 연계가 권장됩니다.</p>
              </SurveyInfoText>
            </SurveyInfoBox>
          </SurveyModalContent>

          <SurveyModalActions>
            <Button
              variant="outline"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 border-gray-300"
              onClick={() => {
                setIsPhysicalDeepCheckOpen(false);
                setPhysicalDeepAnswers([]);
                setPhysicalDeepQuestions([]);
              }}
            >
              취소
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmitPhysicalDeep}>
              제출
            </Button>
          </SurveyModalActions>
        </DialogContent>
      </Dialog>
    </AdminPersonalHealthRoot>
  );
}
