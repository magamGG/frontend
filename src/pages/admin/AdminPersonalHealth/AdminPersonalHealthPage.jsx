import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { CheckCircle, Calendar, Clock, FileText, AlertCircle, Activity, Shield, Stethoscope, X } from 'lucide-react';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import api from '@/api/axios';
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

// 정신 건강 단계별 메시지
const mentalHealthMessages = {
  정상: {
    color: '#16a34a', // green-600
    text: '정상',
    iconColor: 'text-green-600',
    bgColor: '#dcfce7', // 연한 초록
    borderColor: '#16a34a', // 초록 테두리
    messages: [
      '현재 정신 건강 상태가 양호합니다.',
      '지금처럼 규칙적인 생활 패턴을 유지하세요.',
      '정기적인 검진을 통해 건강을 관리하세요.'
    ]
  },
  주의: {
    color: '#ea580c', // orange-600
    text: '주의',
    iconColor: 'text-orange-600',
    bgColor: '#ffedd5', // 연한 주황
    borderColor: '#ea580c', // 주황 테두리
    messages: [
      '스트레스 관리와 충분한 휴식이 필요합니다.',
      '정기적인 운동과 취미 활동을 권장합니다.',
      '증상이 지속되면 전문가 상담을 받으시기 바랍니다.'
    ]
  },
  경고: {
    color: '#ca8a04', // yellow-600
    text: '경고',
    iconColor: 'text-yellow-600',
    bgColor: '#fef9c3', // 연한 노랑
    borderColor: '#ca8a04', // 노랑 테두리
    messages: [
      '정신 건강 상태에 주의가 필요합니다.',
      '즉시 전문가 상담을 받으시기 바랍니다.',
      '충분한 휴식과 스트레스 해소가 필요합니다.'
    ]
  },
  위험: {
    color: '#dc2626', // red-600
    text: '위험',
    iconColor: 'text-red-600',
    bgColor: '#fee2e2', // 연한 빨강
    borderColor: '#dc2626', // 빨강 테두리
    messages: [
      '즉시 전문가 상담이 필요합니다.',
      '담당자에게 연락하여 전문 상담을 받으시기 바랍니다.',
      '건강 관리를 위해 적극적인 조치가 필요합니다.'
    ]
  }
};

// 신체 건강 단계별 메시지
const physicalHealthMessages = {
  정상: {
    color: '#16a34a',
    text: '정상',
    iconColor: 'text-green-600',
    bgColor: '#dcfce7', // 연한 초록
    borderColor: '#16a34a', // 초록 테두리
    messages: [
      '현재 신체 건강 상태가 양호합니다.',
      '지금처럼 올바른 자세와 규칙적인 운동을 유지하세요.',
      '정기적인 검진을 통해 건강을 관리하세요.'
    ]
  },
  주의: {
    color: '#ea580c',
    text: '주의',
    iconColor: 'text-orange-600',
    bgColor: '#ffedd5', // 연한 주황
    borderColor: '#ea580c', // 주황 테두리
    messages: [
      '손목/손가락 통증에 주의가 필요합니다.',
      '정기적인 스트레칭과 바른 자세를 유지하세요.',
      '증상이 심해지면 의료 전문가와 상담하세요.'
    ]
  },
  경고: {
    color: '#ca8a04',
    text: '경고',
    iconColor: 'text-yellow-600',
    bgColor: '#fef9c3', // 연한 노랑
    borderColor: '#ca8a04', // 노랑 테두리
    messages: [
      '신체 건강 상태에 주의가 필요합니다.',
      '즉시 의료 전문가 상담을 받으시기 바랍니다.',
      '무리한 작업을 피하고 충분한 휴식을 취하세요.'
    ]
  },
  위험: {
    color: '#dc2626',
    text: '위험',
    iconColor: 'text-red-600',
    bgColor: '#fee2e2', // 연한 빨강
    borderColor: '#dc2626', // 빨강 테두리
    messages: [
      '즉시 의료 전문가 상담이 필요합니다.',
      '담당자에게 연락하여 전문 상담을 받으시기 바랍니다.',
      '작업 중단 및 치료가 필요할 수 있습니다.'
    ]
  }
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
      
      // 백엔드 API 호출 - 타입으로만 질문 조회 (소속 상관없이 모든 문항 공통 사용)
      // 백엔드 처리: HealthSurveyController.getQuestionsByType() 
      // → HealthSurveyServiceImpl.getQuestionsByType()
      // → HealthSurveyQuestionRepository.findByHealthSurveyQuestionTypeOrderByHealthSurveyOrderAsc()
      const questions = await api.get(`/api/health-surveys/type/월간 신체/questions`);
      
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
      
      // 백엔드 API 호출 - 타입으로만 질문 조회 (소속 상관없이 모든 문항 공통 사용)
      // 백엔드 처리: HealthSurveyController.getQuestionsByType() 
      // → HealthSurveyServiceImpl.getQuestionsByType()
      // → HealthSurveyQuestionRepository.findByHealthSurveyQuestionTypeOrderByHealthSurveyOrderAsc()
      const questions = await api.get(`/api/health-surveys/type/월간 정신/questions`);
      
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

  // 설문 완료 상태 조회 함수 (재사용 가능하도록 분리)
  const fetchSurveyStatus = async () => {
    if (!memberNo) {
      console.log('memberNo가 없어서 설문 상태 조회를 건너뜁니다.');
      return;
    }

    try {
      console.log('설문 상태 조회 시작:', memberNo);
      
      // 정신 건강 설문 상태 조회
      const mentalStatus = await api.get(`/api/health-surveys/member/${memberNo}/responses`, {
        params: { type: '월간 정신' }
      });
      
      console.log('정신 건강 설문 상태:', mentalStatus);
      
      // Jackson이 boolean 필드를 직렬화할 때 isCompleted -> completed로 변환될 수 있음
      const mentalIsCompleted = mentalStatus.isCompleted ?? mentalStatus.completed ?? false;
      
      if (mentalIsCompleted) {
        const checkDate = new Date(mentalStatus.lastCheckDate);
        const formattedDate = `${checkDate.getFullYear()}.${String(checkDate.getMonth() + 1).padStart(2, '0')}.${String(checkDate.getDate()).padStart(2, '0')}`;
        
        // 다음 검진일 포맷팅
        let nextCheckupDateFormatted = '';
        let daysRemaining = null;
        if (mentalStatus.nextCheckupDate) {
          const nextDate = new Date(mentalStatus.nextCheckupDate);
          nextCheckupDateFormatted = `${nextDate.getFullYear()}.${String(nextDate.getMonth() + 1).padStart(2, '0')}.${String(nextDate.getDate()).padStart(2, '0')}`;
          daysRemaining = mentalStatus.daysRemaining ?? null;
        }
        
        console.log('정신 건강 설문 완료 - 날짜:', formattedDate, '점수:', mentalStatus.totalScore, '남은 일수:', daysRemaining);
        
        setDeepCheckupData(prev => ({
          ...prev,
          mental: {
            ...prev.mental,
            lastCheckDate: formattedDate,
            score: mentalStatus.totalScore || 0,
            status: mentalStatus.riskLevel || '정상',
            isCompleted: true,
            nextCheckDate: nextCheckupDateFormatted,
            daysRemaining: daysRemaining,
          },
        }));
      } else {
        // 미완료 상태일 때 마감일과 남은 일수 표시
        let deadlineDateFormatted = '';
        let daysRemaining = null;
        if (mentalStatus.deadlineDate) {
          const deadline = new Date(mentalStatus.deadlineDate);
          deadlineDateFormatted = `${deadline.getFullYear()}.${String(deadline.getMonth() + 1).padStart(2, '0')}.${String(deadline.getDate()).padStart(2, '0')}`;
          daysRemaining = mentalStatus.daysRemaining ?? null;
        }
        
        console.log('정신 건강 설문 미완료 - 마감일:', deadlineDateFormatted, '남은 일수:', daysRemaining);
        
        setDeepCheckupData(prev => ({
          ...prev,
          mental: {
            ...prev.mental,
            isCompleted: false,
            deadlineDate: deadlineDateFormatted,
            daysRemaining: daysRemaining,
          },
        }));
      }

      // 신체 건강 설문 상태 조회
      const physicalStatus = await api.get(`/api/health-surveys/member/${memberNo}/responses`, {
        params: { type: '월간 신체' }
      });
      
      console.log('신체 건강 설문 상태:', physicalStatus);
      
      // Jackson이 boolean 필드를 직렬화할 때 isCompleted -> completed로 변환될 수 있음
      const physicalIsCompleted = physicalStatus.isCompleted ?? physicalStatus.completed ?? false;
      
      if (physicalIsCompleted) {
        const checkDate = new Date(physicalStatus.lastCheckDate);
        const formattedDate = `${checkDate.getFullYear()}.${String(checkDate.getMonth() + 1).padStart(2, '0')}.${String(checkDate.getDate()).padStart(2, '0')}`;
        
        // 다음 검진일 포맷팅
        let nextCheckupDateFormatted = '';
        let daysRemaining = null;
        if (physicalStatus.nextCheckupDate) {
          const nextDate = new Date(physicalStatus.nextCheckupDate);
          nextCheckupDateFormatted = `${nextDate.getFullYear()}.${String(nextDate.getMonth() + 1).padStart(2, '0')}.${String(nextDate.getDate()).padStart(2, '0')}`;
          daysRemaining = physicalStatus.daysRemaining ?? null;
        }
        
        console.log('신체 건강 설문 완료 - 날짜:', formattedDate, '점수:', physicalStatus.totalScore, '남은 일수:', daysRemaining);
        
        setDeepCheckupData(prev => ({
          ...prev,
          physical: {
            ...prev.physical,
            lastCheckDate: formattedDate,
            score: physicalStatus.totalScore || 0,
            status: physicalStatus.riskLevel || '정상',
            isCompleted: true,
            nextCheckDate: nextCheckupDateFormatted,
            daysRemaining: daysRemaining,
          },
        }));
      } else {
        // 미완료 상태일 때 마감일과 남은 일수 표시
        let deadlineDateFormatted = '';
        let daysRemaining = null;
        if (physicalStatus.deadlineDate) {
          const deadline = new Date(physicalStatus.deadlineDate);
          deadlineDateFormatted = `${deadline.getFullYear()}.${String(deadline.getMonth() + 1).padStart(2, '0')}.${String(deadline.getDate()).padStart(2, '0')}`;
          daysRemaining = physicalStatus.daysRemaining ?? null;
        }
        
        console.log('신체 건강 설문 미완료 - 마감일:', deadlineDateFormatted, '남은 일수:', daysRemaining);
        
        setDeepCheckupData(prev => ({
          ...prev,
          physical: {
            ...prev.physical,
            isCompleted: false,
            deadlineDate: deadlineDateFormatted,
            daysRemaining: daysRemaining,
          },
        }));
      }
    } catch (error) {
      console.error('설문 상태 조회 실패:', error);
      console.error('에러 상세:', error.response?.data || error.message);
      // 에러가 발생해도 기본 상태 유지
    }
  };

  // 페이지 로드 시 설문 완료 상태 조회
  useEffect(() => {
    fetchSurveyStatus();
  }, [memberNo]);

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
      // answers 배열 생성 (questionId와 score 매핑)
      const answers = mentalDeepQuestions.map((question, index) => ({
        questionId: question.healthSurveyQuestionNo,
        score: mentalDeepAnswers[index]
      }));

      // API 호출 - 엔드포인트 변경 및 요청 형식 변경
      // 백엔드 처리: HealthSurveyController.submitSurveyResponse()
      // → HealthSurveyServiceImpl.submitSurveyResponse()
      // → HealthSurveyQuestion의 HEALTH_SURVEY_QUESTION_TYPE으로 위험도 평가
      const result = await api.post(`/api/health-surveys/responses`, {
        memberNo: memberNo,
        answers: answers
      });

      // 설문 제출 성공 후 상태 조회 함수 호출하여 최신 상태 가져오기
      await fetchSurveyStatus();

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
      // answers 배열 생성 (questionId와 score 매핑)
      const answers = physicalDeepQuestions.map((question, index) => ({
        questionId: question.healthSurveyQuestionNo,
        score: physicalDeepAnswers[index]
      }));

      // API 호출 - 엔드포인트 변경 및 요청 형식 변경
      // 백엔드 처리: HealthSurveyController.submitSurveyResponse()
      // → HealthSurveyServiceImpl.submitSurveyResponse()
      // → HealthSurveyQuestion의 HEALTH_SURVEY_QUESTION_TYPE으로 위험도 평가
      const result = await api.post(`/api/health-surveys/responses`, {
        memberNo: memberNo,
        answers: answers
      });

      // 설문 제출 성공 후 상태 조회 함수 호출하여 최신 상태 가져오기
      await fetchSurveyStatus();

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
                  <NextCheckupItemDate>
                    {deepCheckupData.mental.nextCheckDate || deepCheckupData.mental.deadlineDate || '미정'}
                  </NextCheckupItemDate>
                </NextCheckupItemContent>
                <Badge className={deepCheckupData.mental.isCompleted ? "bg-green-600 text-white text-xs px-2 py-1" : "bg-orange-600 text-white text-xs px-2 py-1"}>
                  {deepCheckupData.mental.isCompleted ? '완료' : '미완료'}
                </Badge>
              </NextCheckupItemHeader>
              <NextCheckupItemMeta>
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {deepCheckupData.mental.isCompleted 
                    ? `다음 검진까지 ${deepCheckupData.mental.daysRemaining !== null ? deepCheckupData.mental.daysRemaining : '-'}일 남음`
                    : `${deepCheckupData.mental.deadlineDate || deepCheckupData.mental.nextCheckDate || '미정'}까지 검사 완료 필요`
                  }
                </span>
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
                  <NextCheckupItemDate>
                    {deepCheckupData.physical.nextCheckDate || deepCheckupData.physical.deadlineDate || '미정'}
                  </NextCheckupItemDate>
                </NextCheckupItemContent>
                <Badge className={deepCheckupData.physical.isCompleted ? "bg-green-600 text-white text-xs px-2 py-1" : "bg-orange-600 text-white text-xs px-2 py-1"}>
                  {deepCheckupData.physical.isCompleted 
                    ? '완료' 
                    : `D-${deepCheckupData.physical.daysRemaining !== null ? deepCheckupData.physical.daysRemaining : '-'}`
                  }
                </Badge>
              </NextCheckupItemHeader>
              <NextCheckupItemMeta>
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {deepCheckupData.physical.isCompleted 
                    ? `다음 검진까지 ${deepCheckupData.physical.daysRemaining !== null ? deepCheckupData.physical.daysRemaining : '-'}일 남음`
                    : `${deepCheckupData.physical.deadlineDate || deepCheckupData.physical.nextCheckDate || '미정'}까지 검사 완료 필요`
                  }
                </span>
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
                    <strong style={{ color: mentalHealthMessages[deepCheckupData.mental.status]?.color || '#1f2328' }}>
                      {deepCheckupData.mental.status || '미정'}
                    </strong> 단계입니다.
                  </ResultDetailText>
                  {(() => {
                    const statusInfo = mentalHealthMessages[deepCheckupData.mental.status] || mentalHealthMessages['정상'];
                    return (
                      <ResultDetailAlert style={{ backgroundColor: statusInfo.bgColor, borderColor: statusInfo.borderColor, borderWidth: '1px', borderStyle: 'solid' }}>
                        <ResultDetailAlertContent>
                          <AlertCircle className={`w-4 h-4 ${statusInfo.iconColor}`} style={{ marginTop: '2px', flexShrink: 0 }} />
                          <ResultDetailAlertText>
                            {statusInfo.messages.map((message, index) => (
                              <p key={index}>• {message}</p>
                            ))}
                          </ResultDetailAlertText>
                        </ResultDetailAlertContent>
                      </ResultDetailAlert>
                    );
                  })()}
                </ResultDetailBox>

                <NextCheckupDateBox $bgColor="#faf5ff" $borderColor="rgba(168, 85, 247, 0.2)">
                  <NextCheckupDateLabel>
                    <Calendar className="w-4 h-4" style={{ color: '#9333ea' }} />
                    <span>다음 검진일</span>
                  </NextCheckupDateLabel>
                  <NextCheckupDateValue $color="#9333ea">
                    {deepCheckupData.mental.nextCheckDate}
                    {deepCheckupData.mental.daysRemaining !== null && (
                      <span style={{ marginLeft: '8px', fontSize: '0.875rem', fontWeight: '600' }}>
                        (D-{deepCheckupData.mental.daysRemaining})
                      </span>
                    )}
                  </NextCheckupDateValue>
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
                <IncompleteStatusSubtext>
                  {deepCheckupData.mental.deadlineDate || deepCheckupData.mental.nextCheckDate}까지 검사를 완료해주세요
                  {deepCheckupData.mental.daysRemaining !== null && (
                    <span style={{ marginLeft: '8px', fontWeight: '600' }}>
                      (D-{deepCheckupData.mental.daysRemaining})
                    </span>
                  )}
                </IncompleteStatusSubtext>
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
                    <strong style={{ color: physicalHealthMessages[deepCheckupData.physical.status]?.color || '#1f2328' }}>
                      {deepCheckupData.physical.status || '미정'}
                    </strong> 단계입니다.
                  </ResultDetailText>
                  {(() => {
                    const statusInfo = physicalHealthMessages[deepCheckupData.physical.status] || physicalHealthMessages['정상'];
                    return (
                      <ResultDetailAlert style={{ backgroundColor: statusInfo.bgColor, borderColor: statusInfo.borderColor, borderWidth: '1px', borderStyle: 'solid' }}>
                        <ResultDetailAlertContent>
                          <AlertCircle className={`w-4 h-4 ${statusInfo.iconColor}`} style={{ marginTop: '2px', flexShrink: 0 }} />
                          <ResultDetailAlertText>
                            {statusInfo.messages.map((message, index) => (
                              <p key={index}>• {message}</p>
                            ))}
                          </ResultDetailAlertText>
                        </ResultDetailAlertContent>
                      </ResultDetailAlert>
                    );
                  })()}
                </ResultDetailBox>

                <NextCheckupDateBox $bgColor="#eff6ff" $borderColor="rgba(59, 130, 246, 0.2)">
                  <NextCheckupDateLabel>
                    <Calendar className="w-4 h-4" style={{ color: '#2563eb' }} />
                    <span>다음 검진일</span>
                  </NextCheckupDateLabel>
                  <NextCheckupDateValue $color="#2563eb">
                    {deepCheckupData.physical.nextCheckDate}
                    {deepCheckupData.physical.daysRemaining !== null && (
                      <span style={{ marginLeft: '8px', fontSize: '0.875rem', fontWeight: '600' }}>
                        (D-{deepCheckupData.physical.daysRemaining})
                      </span>
                    )}
                  </NextCheckupDateValue>
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
                <IncompleteStatusSubtext>
                  {deepCheckupData.physical.deadlineDate || deepCheckupData.physical.nextCheckDate || '2026.02.01'}까지 검사를 완료해주세요
                  {deepCheckupData.physical.daysRemaining !== null && (
                    <span style={{ marginLeft: '8px', fontWeight: '600' }}>
                      (D-{deepCheckupData.physical.daysRemaining})
                    </span>
                  )}
                </IncompleteStatusSubtext>
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
