import { ArrowLeft } from 'lucide-react';
import {
  RiskAnalysisRoot,
  RiskAnalysisBody,
  HeaderSection,
  BackButton,
  HeaderTitle,
  RiskGrid,
  RiskCard,
  RiskCardBorder,
  RiskCardContent,
  RiskCardHeader,
  RiskCardTitle,
  RiskCardCount,
  RiskCardDescription,
  RiskUserList,
  RiskUserItem,
  RiskUserName,
  RiskUserDept,
  RiskUserScore,
} from './RiskAnalysisPage.styled';

// TODO: Zustand store mapping - 위험군 분석 데이터
const highRiskUsers = [
  { name: '송도동', dept: '개발팀', mentalScore: 85, physicalScore: 92 },
  { name: '김태양', dept: '개발팀', mentalScore: 88, physicalScore: 78 },
];

const cautionUsers = [
  { name: '박지훈', dept: '디자인팀', mentalScore: 78, physicalScore: 95 },
  { name: '한소희', dept: '재무팀', mentalScore: 90, physicalScore: 85 },
  { name: '최은영', dept: '마케팅팀', mentalScore: 82, physicalScore: 88 },
];

export function RiskAnalysisPage({ onBack }) {
  return (
    <RiskAnalysisRoot>
      <RiskAnalysisBody>
        {/* Header */}
        <HeaderSection>
          <BackButton onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-[#333333]" />
          </BackButton>
          <HeaderTitle>위험군 상세 분석</HeaderTitle>
        </HeaderSection>

        {/* Two Column Grid */}
        <RiskGrid>
          {/* High Risk Card */}
          <RiskCard>
            <RiskCardBorder $color="red" />
            <RiskCardContent>
              {/* Header */}
              <RiskCardHeader>
                <RiskCardTitle $color="red">고위험군 (High Risk)</RiskCardTitle>
                <RiskCardCount $color="red">{highRiskUsers.length}명</RiskCardCount>
              </RiskCardHeader>
              <RiskCardDescription>Immediate consultation and action required.</RiskCardDescription>

              {/* User List */}
              <RiskUserList>
                {highRiskUsers.map((user, index) => (
                  <RiskUserItem key={index} $variant="high">
                    <div style={{ marginBottom: '8px' }}>
                      <RiskUserName>
                        {user.name} <RiskUserDept>{user.dept}</RiskUserDept>
                      </RiskUserName>
                    </div>
                    <RiskUserScore $color="red">
                      Mental Score: {user.mentalScore} / Physical Score: {user.physicalScore}
                    </RiskUserScore>
                  </RiskUserItem>
                ))}
              </RiskUserList>
            </RiskCardContent>
          </RiskCard>

          {/* Caution Card */}
          <RiskCard>
            <RiskCardBorder $color="orange" />
            <RiskCardContent>
              {/* Header */}
              <RiskCardHeader>
                <RiskCardTitle $color="orange">주의군 (Caution)</RiskCardTitle>
                <RiskCardCount $color="orange">{cautionUsers.length}명</RiskCardCount>
              </RiskCardHeader>
              <RiskCardDescription>Continuous monitoring required.</RiskCardDescription>

              {/* User List */}
              <RiskUserList>
                {cautionUsers.map((user, index) => (
                  <RiskUserItem key={index} $variant="caution">
                    <div style={{ marginBottom: '8px' }}>
                      <RiskUserName>
                        {user.name} <RiskUserDept>{user.dept}</RiskUserDept>
                      </RiskUserName>
                    </div>
                    <RiskUserScore $color="orange">
                      Mental Score: {user.mentalScore} / Physical Score: {user.physicalScore}
                    </RiskUserScore>
                  </RiskUserItem>
                ))}
              </RiskUserList>
            </RiskCardContent>
          </RiskCard>
        </RiskGrid>
      </RiskAnalysisBody>
    </RiskAnalysisRoot>
  );
}
