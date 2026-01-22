import { ArrowLeft } from 'lucide-react';

const highRiskUsers = [
  { name: '송도동', dept: '개발팀', mentalScore, physicalScore,
  { name: '김태양', dept: '개발팀', mentalScore, physicalScore,
];

const cautionUsers = [
  { name: '박지훈', dept: '디자인팀', mentalScore, physicalScore,
  { name: '한소희', dept: '재무팀', mentalScore, physicalScore,
  { name: '최은영', dept: '마케팅팀', mentalScore, physicalScore,
];



/**
 * @param {Object} props
 * @param {Function} props.onBack
 */
export function RiskAnalysisPage({ onBack }) {
  return (
    <div className="min-h-screen bg-[#F5F7FB] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#333333]" />
          </button>
          <h1 className="text-3xl font-bold text-[#333333]">위험군 상세 분석</h1>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* High Risk Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Red Left Border */}
            <div className="flex">
              <div className="w-1.5 bg-[#FF4D4F]" />
              <div className="flex-1 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-[#FF4D4F]">고위험군 (High Risk)</h2>
                  <span className="text-lg font-semibold text-[#FF4D4F]">{highRiskUsers.length}명</span>
                </div>
                <p className="text-sm text-[#666666] mb-6">Immediate consultation and action required.</p>

                {/* User List */}
                <div className="space-y-3">
                  {highRiskUsers.map((user, index) => (
                    <div key={index} className="bg-[#FFF1F0] rounded-xl p-4">
                      <div className="mb-2">
                        <h3 className="font-bold text-[#333333] text-base">
                          {user.name} <span className="font-normal text-[#666666]">{user.dept}</span>
                        </h3>
                      </div>
                      <div className="text-sm text-[#FF4D4F]">
                        Mental Score: {user.mentalScore} / Physical Score: {user.physicalScore}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Caution Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Orange Left Border */}
            <div className="flex">
              <div className="w-1.5 bg-[#FA8C16]" />
              <div className="flex-1 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-[#FA8C16]">주의군 (Caution)</h2>
                  <span className="text-lg font-semibold text-[#FA8C16]">{cautionUsers.length}명</span>
                </div>
                <p className="text-sm text-[#666666] mb-6">Continuous monitoring required.</p>

                {/* User List */}
                <div className="space-y-3">
                  {cautionUsers.map((user, index) => (
                    <div key={index} className="bg-[#FFF7E6] rounded-xl p-4">
                      <div className="mb-2">
                        <h3 className="font-bold text-[#333333] text-base">
                          {user.name} <span className="font-normal text-[#666666]">{user.dept}</span>
                        </h3>
                      </div>
                      <div className="text-sm text-[#FA8C16]">
                        Mental Score: {user.mentalScore} / Physical Score: {user.physicalScore}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
