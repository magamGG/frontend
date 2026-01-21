import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { CheckCircle, Calendar, Clock, FileText, AlertCircle, Activity } from 'lucide-react';
import { toast } from 'sonner';

export function ArtistHealthPage() {
  const [isMentalSelfCheckOpen, setIsMentalSelfCheckOpen] = useState(false);
  const [isPhysicalSelfCheckOpen, setIsPhysicalSelfCheckOpen] = useState(false);
  const [isMentalDeepCheckOpen, setIsMentalDeepCheckOpen] = useState(false);
  const [isPhysicalDeepCheckOpen, setIsPhysicalDeepCheckOpen] = useState(false);

  // 설문 응답 상태
  const [mentalSelfAnswers, setMentalSelfAnswers] = useState<number[]>([0, 0, 0, 0]);
  const [physicalSelfAnswers, setPhysicalSelfAnswers] = useState<number[]>([0, 0, 0, 0]);
  const [mentalDeepAnswers, setMentalDeepAnswers] = useState<number[]>([0, 0, 0, 0]);
  const [physicalDeepAnswers, setPhysicalDeepAnswers] = useState<number[]>([0, 0, 0, 0]);

  // 다음 검진 예정일 데이터
  const [nextCheckupDate] = useState({
    mentalCheckup: '2026.01.25',
    physicalCheckup: '2026.02.01',
    daysUntilMental: 7,
    daysUntilPhysical: 14,
  });

  // 심층 검진 검사 데이터 - 상태로 변경
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
      isCompleted: false,  // 신체 건강 미완료로 변경
      nextCheckDate: '2026.02.01',
    },
  });

  // 최근 검사일
  const lastChecks = {
    mentalSelf: '01.18',
    physicalSelf: '01.18',
    mentalDeep: '2026.01.15',
    physicalDeep: '2026.01.14',
  };

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
    // 점수 계산 (임의로 7점으로 설정 - "주의" 단계)
    const totalScore = physicalDeepAnswers.reduce((sum, score) => sum + score, 0);
    const averageScore = Math.round(totalScore / physicalDeepAnswers.length);
    const finalScore = Math.max(7, averageScore); // 최소 7점 보장
    
    // 상태 판정
    let status = '정상';
    if (finalScore >= 8) {
      status = '위험';
    } else if (finalScore >= 5) {
      status = '주의';
    }
    
    // 현재 날짜 생성
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    
    // deepCheckupData 업데이트
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
  const getStatusBadgeClass = (status: string) => {
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
    <div className="h-full overflow-y-auto bg-[#FAFAFA] p-6">
      <div className="max-w-[1400px] mx-auto space-y-4">
        {/* 다음 검진 예정일 */}
        <Card className="p-5 bg-white border-none shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#6E8FB3]" />
            <h2 className="text-base font-bold text-[#1F2328]">다음 검진 예정일</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* 정신 건강 검진 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs text-purple-600 font-medium mb-1">정신 건강 심층 검진</div>
                  <div className="text-2xl font-bold text-[#1F2328]">{nextCheckupDate.mentalCheckup}</div>
                </div>
                <Badge className="bg-green-600 text-white text-xs px-2 py-1">
                  완료
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6E8FB3]">
                <Clock className="w-3.5 h-3.5" />
                <span>다음 검진까지 {nextCheckupDate.daysUntilMental}일 남음</span>
              </div>
            </div>

            {/* 신체 건강 검진 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs text-blue-600 font-medium mb-1">신체 건강 심층 검진</div>
                  <div className="text-2xl font-bold text-[#1F2328]">{nextCheckupDate.physicalCheckup}</div>
                </div>
                <Badge className="bg-orange-600 text-white text-xs px-2 py-1">
                  D-{nextCheckupDate.daysUntilPhysical}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6E8FB3]">
                <Clock className="w-3.5 h-3.5" />
                <span>{nextCheckupDate.physicalCheckup}까지 검사 완료 필요</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 심층 검진 검사 현황 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 정신 건강 심층 검사 */}
          <Card className="p-5 bg-white border-none shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-[#1F2328]">정신 건강 심층 검사</h2>
            </div>

            {deepCheckupData.mental.isCompleted ? (
              <div className="space-y-4">
                {/* 완료 상태 */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-600">검사 완료</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6E8FB3]">검사 일자</span>
                      <span className="text-sm font-medium text-[#1F2328]">
                        {deepCheckupData.mental.lastCheckDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6E8FB3]">검사 점수</span>
                      <span className="text-sm font-medium text-[#1F2328]">
                        {deepCheckupData.mental.score}점
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6E8FB3]">상태</span>
                      <Badge className={`${getStatusBadgeClass(deepCheckupData.mental.status)} text-xs px-2 py-0.5`}>
                        {deepCheckupData.mental.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* 결과 상세 */}
                <div className="bg-[#FAFAFA] rounded-lg p-4">
                  <h3 className="text-sm font-bold text-[#1F2328] mb-2">검사 결과</h3>
                  <p className="text-xs text-[#6E8FB3] leading-relaxed mb-3">
                    귀하의 정신 건강 점수는 <strong className="text-[#1F2328]">{deepCheckupData.mental.score}점</strong>으로 
                    <strong className="text-orange-600"> 주의 </strong>단계입니다.
                  </p>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-[#6E8FB3]">
                        <p>• 스트레스 관리와 충분한 휴식이 필요합니다.</p>
                        <p>• 정기적인 운동과 취미 활동을 권장합니다.</p>
                        <p>• 증상이 지속되면 전문가 상담을 받으시기 바랍니다.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 다음 검진 */}
                <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-[#1F2328]">다음 검진일</span>
                  </div>
                  <span className="text-sm font-medium text-purple-600">
                    {deepCheckupData.mental.nextCheckDate}
                  </span>
                </div>

                {/* 검사 완료 버튼 (비활성화) */}
                <Button
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  검사 완료
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-[#6E8FB3] mb-4">아직 검사를 진행하지 않았습니다.</p>
                  <Button
                    onClick={() => setIsMentalDeepCheckOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    검사하기
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* 신체 건강 심층 검사 */}
          <Card className="p-5 bg-white border-none shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-[#1F2328]">신체 건강 심층 검사</h2>
            </div>

            {deepCheckupData.physical.isCompleted ? (
              <div className="space-y-4">
                {/* 완료 상태 */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-600">검사 완료</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6E8FB3]">검사 일자</span>
                      <span className="text-sm font-medium text-[#1F2328]">
                        {deepCheckupData.physical.lastCheckDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6E8FB3]">검사 점수</span>
                      <span className="text-sm font-medium text-[#1F2328]">
                        {deepCheckupData.physical.score}점
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6E8FB3]">상태</span>
                      <Badge className={`${getStatusBadgeClass(deepCheckupData.physical.status)} text-xs px-2 py-0.5`}>
                        {deepCheckupData.physical.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* 결과 상세 */}
                <div className="bg-[#FAFAFA] rounded-lg p-4">
                  <h3 className="text-sm font-bold text-[#1F2328] mb-2">검사 결과</h3>
                  <p className="text-xs text-[#6E8FB3] leading-relaxed mb-3">
                    귀하의 신체 건강 점수는 <strong className="text-[#1F2328]">{deepCheckupData.physical.score}점</strong>으로 
                    <strong className="text-orange-600"> 주의 </strong>단계입니다.
                  </p>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-[#6E8FB3]">
                        <p>• 손목/손가락 통증에 주의가 필요합니다.</p>
                        <p>• 정기적인 스트레칭과 바른 자세를 유지하세요.</p>
                        <p>• 증상이 심해지면 의료 전문가와 상담하세요.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 다음 검진 */}
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-[#1F2328]">다음 검진일</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {deepCheckupData.physical.nextCheckDate}
                  </span>
                </div>

                {/* 검사 완료 버튼 (비활성화) */}
                <Button
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  검사 완료
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 미완료 상태 - 주황색 테마로 구분 */}
                <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 text-center">
                  <AlertCircle className="w-14 h-14 text-orange-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-orange-600 mb-2">검사가 아직 완료되지 않았습니다</p>
                  <p className="text-xs text-[#6E8FB3] mb-4">2026.02.01까지 검사를 완료해주세요</p>
                  <Button
                    onClick={() => setIsPhysicalDeepCheckOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md"
                  >
                    검사 시작하기
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* 정신 건강 자가검진 모달 */}
      <Dialog open={isMentalSelfCheckOpen} onOpenChange={setIsMentalSelfCheckOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">
              정신 건강 자가검진
            </DialogTitle>
            <DialogDescription className="text-sm text-[#6E8FB3]">
              일일 정신 건강 상태를 간단히 체크하는 자가 진단 설문입니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 설명 */}
            <div className="text-sm text-[#6E8FB3] leading-relaxed">
              <p className="mb-2">본 설문은 작가·어시스턴트·직업의</p>
              <p className="mb-2">일일 정신 건강상태를 간단히 체크할 기회 자가 체크 설문입니다.</p>
              <p>익명의 질답을 목적으로 하지 않으며, 응답 결과는</p>
              <p>에이전시 운영 감리 인그 자료로만 활용됩니다. ⓘ</p>
            </div>

            <div className="border-t border-[#DADDE1] my-4"></div>

            <p className="text-sm text-[#1F2328] font-medium">최근 하루를 기준으로 응답해주세요.</p>

            {/* 질문들 */}
            <div className="space-y-4">
              {[
                { q: '1. 오늘 전반적인 기분 상태는 어떠셨나요?', desc: '0 (매우 나쁨) ~ 10 (매우 좋음)' },
                { q: '2. 오늘 불안하거나 초조한 느낌이 있었나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '3. 오늘 스트레스를 강하게 느꼈나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '4. 오늘 직업에 대한 의욕은 어느 정도였나요?', desc: '0 (전혀 없음) ~ 10 (매우 높음)' },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-sm text-[#1F2328] font-medium">{item.q}</p>
                  <p className="text-xs text-[#6E8FB3]">{item.desc}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          const newAnswers = [...mentalSelfAnswers];
                          newAnswers[index] = num;
                          setMentalSelfAnswers(newAnswers);
                        }}
                        className={`w-8 h-8 rounded-md border transition-all ${
                          mentalSelfAnswers[index] === num
                            ? 'bg-[#3F4A5A] text-white border-[#3F4A5A]'
                            : 'bg-white text-[#1F2328] border-[#DADDE1] hover:border-[#6E8FB3]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 안내 문구 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-[#6E8FB3]">
              <p>※ 본 설문은 건강 목적이 아닌 상태 확인을 제공합니다.</p>
              <p className="mt-1">
                결과는 지인에게 공문으로 제공되며 있으며, 점수는 계속 추적 못할 분석 및
                비밀 상태 안내만이 사용됩니다. (사후출납)
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-[#DADDE1]">
            <Button
              variant="outline"
              onClick={() => {
                setIsMentalSelfCheckOpen(false);
                setMentalSelfAnswers([0, 0, 0, 0]);
              }}
            >
              취소
            </Button>
            <Button
              className="bg-[#3F4A5A] hover:bg-[#3F4A5A]/90"
              onClick={handleSubmitMentalSelf}
            >
              제출
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 신체 건강 자가검진 모달 */}
      <Dialog open={isPhysicalSelfCheckOpen} onOpenChange={setIsPhysicalSelfCheckOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">
              신체 건강 자가검진
            </DialogTitle>
            <DialogDescription className="text-sm text-[#6E8FB3]">
              일일 신체 건강 상태를 간단히 체크하는 자가 진단 설문입니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 설명 */}
            <div className="text-sm text-[#6E8FB3] leading-relaxed">
              <p className="mb-2">본 설문은 번역 직업으로 인한</p>
              <p className="mb-2">신체 건강상 변 피로 상태를 간단히 점검하기 위한 자가 체크 설문입니다.</p>
              <p>익명의 질답이나 치료를 대체하지 않습니다.</p>
            </div>

            <div className="border-t border-[#DADDE1] my-4"></div>

            <p className="text-sm text-[#1F2328] font-medium">최근 하루를 기준으로 응답해주세요.</p>

            {/* 질문들 */}
            <div className="space-y-4">
              {[
                { q: '1. 오늘 손목 또는 손가락 통증은 어느 정도였나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '2. 오늘 목이나 어깨 결림은 어느 정도였나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '3. 오늘 허리 또는 허리 주변 불편감이 있었나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '4. 전날 수면 시간은 어느 정도였나요?', desc: '시간', time: true },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-sm text-[#1F2328] font-medium">{item.q}</p>
                  <p className="text-xs text-[#6E8FB3]">{item.desc}</p>
                  <div className="flex items-center gap-2">
                    {item.time ? (
                      <input
                        type="number"
                        min="0"
                        max="24"
                        className="w-20 h-10 px-3 border border-[#DADDE1] rounded-md text-sm"
                        placeholder="시간"
                      />
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <button
                            key={num}
                            onClick={() => {
                              const newAnswers = [...physicalSelfAnswers];
                              newAnswers[index] = num;
                              setPhysicalSelfAnswers(newAnswers);
                            }}
                            className={`w-8 h-8 rounded-md border transition-all ${
                              physicalSelfAnswers[index] === num
                                ? 'bg-[#3F4A5A] text-white border-[#3F4A5A]'
                                : 'bg-white text-[#1F2328] border-[#DADDE1] hover:border-[#6E8FB3]'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 안내 문구 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-[#6E8FB3]">
              <p>※ 본 설문은 신체 상태 확인을 위한 연구용 제공합니다.</p>
              <p className="mt-1">
                응답 결과는 건강 관리 목적의 알고 자료로만 활용됩니다.
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-[#DADDE1]">
            <Button
              variant="outline"
              onClick={() => {
                setIsPhysicalSelfCheckOpen(false);
                setPhysicalSelfAnswers([0, 0, 0, 0]);
              }}
            >
              취소
            </Button>
            <Button
              className="bg-[#3F4A5A] hover:bg-[#3F4A5A]/90"
              onClick={handleSubmitPhysicalSelf}
            >
              제출
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
            {/* 설명 */}
            <div className="text-sm text-[#6E8FB3] leading-relaxed">
              <p className="mb-2">본 검진은 PHQ-9·GAD-7 표준화된 도구를 활용하여</p>
              <p className="mb-2">직원 본인의 우울·불안 수준을 정기적으로 점검합니다.</p>
              <p>본 검사는 정확한 심층 평가를 위한 도구이며,</p>
              <p>검사 결과는 전문 상담이 필요한 경우 임상 전문가에게 전달됩니다.</p>
            </div>

            <div className="border-t border-[#DADDE1] my-4"></div>

            <p className="text-sm text-[#1F2328] font-medium">지난 2주간을 기준으로 응답해주세요.</p>

            {/* 질문들 */}
            <div className="space-y-4">
              {[
                { q: '1. 일 또는 여가 활동을 하는 데 흥미나 즐거움을 느끼지 못함', desc: '0 (전혀 없음) ~ 10 (거의 매일)' },
                { q: '2. 기분이 가라앉거나 우울하거나 희망이 없다고 느낌', desc: '0 (전혀 없음) ~ 10 (거의 매일)' },
                { q: '3. 잠들기 어렵거나 자주 깨거나 너무 많이 잠', desc: '0 (전혀 없음) ~ 10 (거의 매일)' },
                { q: '4. 피곤하다고 느끼거나 기력이 거의 없음', desc: '0 (전혀 없음) ~ 10 (거의 매일)' },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-sm text-[#1F2328] font-medium">{item.q}</p>
                  <p className="text-xs text-[#6E8FB3]">{item.desc}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          const newAnswers = [...mentalDeepAnswers];
                          newAnswers[index] = num;
                          setMentalDeepAnswers(newAnswers);
                        }}
                        className={`w-8 h-8 rounded-md border transition-all ${
                          mentalDeepAnswers[index] === num
                            ? 'bg-[#3F4A5A] text-white border-[#3F4A5A]'
                            : 'bg-white text-[#1F2328] border-[#DADDE1] hover:border-[#6E8FB3]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 안내 문구 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-[#6E8FB3]">
              <p>※ 본 검사는 전문 검사 도구로, 개인정보로 엄격 관리됩니다.</p>
              <p className="mt-1">
                15점 이상 시 담당자에게 즉시 알림 발송 및 전문 상담 연계가 권장됩니다.
              </p>
            </div>
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
            {/* 설명 */}
            <div className="text-sm text-[#6E8FB3] leading-relaxed">
              <p className="mb-2">본 검진은 표준화된 신체 건강 도구를 활용하여</p>
              <p className="mb-2">직원 본인의 신체 상태를 정기적으로 점검합니다.</p>
              <p>본 검사는 정확한 심층 평가를 위한 도구이며,</p>
              <p>검사 결과는 전문 상담이 필요한 경우 의료 전문가에게 전달됩니다.</p>
            </div>

            <div className="border-t border-[#DADDE1] my-4"></div>

            <p className="text-sm text-[#1F2328] font-medium">지난 1개월을 기준으로 응답해주세요.</p>

            {/* 질문들 */}
            <div className="space-y-4">
              {[
                { q: '1. 손목이나 손가락의 통증 및 불편감이 있었나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '2. 목, 어깨, 등의 통증 및 결림이 있었나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '3. 허리 통증 및 불편감이 있었나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
                { q: '4. 전반적인 피로도와 무기력함을 느꼈나요?', desc: '0 (전혀 없음) ~ 10 (매우 심함)' },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-sm text-[#1F2328] font-medium">{item.q}</p>
                  <p className="text-xs text-[#6E8FB3]">{item.desc}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          const newAnswers = [...physicalDeepAnswers];
                          newAnswers[index] = num;
                          setPhysicalDeepAnswers(newAnswers);
                        }}
                        className={`w-8 h-8 rounded-md border transition-all ${
                          physicalDeepAnswers[index] === num
                            ? 'bg-[#3F4A5A] text-white border-[#3F4A5A]'
                            : 'bg-white text-[#1F2328] border-[#DADDE1] hover:border-[#6E8FB3]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 안내 문구 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-[#6E8FB3]">
              <p>※ 본 검사는 전문 검사 도구로, 개인정보로 엄격 관리됩니다.</p>
              <p className="mt-1">
                15점 이상 시 담당자에게 즉시 알림 발송 및 전문 상담 연계가 권장됩니다.
              </p>
            </div>
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
    </div>
  );
}