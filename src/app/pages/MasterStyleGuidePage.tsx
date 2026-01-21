import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { 
  Home, 
  Printer, 
  User, 
  Settings,
  Calendar,
  Activity,
  AlertTriangle,
  FileText,
  Heart,
  Brain
} from 'lucide-react';

export function MasterStyleGuidePage() {
  // Mock data for monitoring
  const monitoringData = [
    { name: '김민준', mentalScore: 85, physicalScore: 92, risk: '낮음', date: '2026-01-15' },
    { name: '이서연', mentalScore: 72, physicalScore: 78, risk: '중간', date: '2026-01-14' },
    { name: '박지호', mentalScore: 95, physicalScore: 88, risk: '낮음', date: '2026-01-14' },
    { name: '최유나', mentalScore: 68, physicalScore: 71, risk: '중간', date: '2026-01-13' },
  ];

  // Non-participants data
  const nonParticipants = [
    { name: '강호배', team: '영업팀', daysOverdue: 7 },
    { name: '조인혜', team: '개발팀', daysOverdue: 8 },
    { name: '서동혁', team: '경영지원', daysOverdue: 9 },
    { name: '김미영', team: '디자인팀', daysOverdue: 10 },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case '낮음':
        return 'bg-green-500/10 text-green-700';
      case '중간':
        return 'bg-yellow-500/10 text-yellow-700';
      case '높음':
        return 'bg-red-500/10 text-red-700';
      default:
        return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <div className=\"w-full h-full overflow-y-auto hide-scrollbar\" style={{ background: '#F5F7FA' }}>
      <div className=\"pb-24 px-8 py-6\">
        <div className=\"max-w-7xl mx-auto\">
          {/* Header */}
          <div className=\"flex items-center justify-between mb-6\">
            <h1 className=\"text-2xl font-bold\" style={{ color: '#1F2328' }}>마감지기</h1>
            <div className=\"flex items-center gap-4\">
              <span className=\"text-sm\" style={{ color: '#6B7280' }}>전사 건강</span>
              <div className=\"flex items-center gap-2 px-3 py-1.5 rounded-full\" style={{ background: '#E5E7EB' }}>
                <div className=\"w-8 h-8 rounded-full\" style={{ background: '#3F4A5A' }} />
                <span className=\"text-sm font-medium\" style={{ color: '#1F2328' }}>김마기</span>
              </div>
            </div>
          </div>

          {/* Top Row - Schedule Cards */}
          <div className=\"grid grid-cols-2 gap-6 mb-6\">
            {/* 다음 검진 예정일 - 정신 건강 */}
            <Card className=\"p-6\" style={{ borderRadius: '16px', background: '#FFFFFF' }}>
              <div className=\"flex items-start justify-between mb-4\">
                <div>
                  <p className=\"text-sm font-medium\" style={{ color: '#6B7280' }}>다음 검진 예정일</p>
                  <h3 className=\"text-2xl font-bold mt-1\" style={{ color: '#1F2328' }}>정신 건강 심층 검진</h3>
                </div>
                <Brain className=\"w-8 h-8\" style={{ color: '#9C27B0' }} />
              </div>
              <div className=\"flex items-baseline gap-2\">
                <span className=\"text-4xl font-bold\" style={{ color: '#9C27B0' }}>D-7</span>
                <span className=\"text-sm\" style={{ color: '#6B7280' }}>2026년 1월 26일</span>
              </div>
            </Card>

            {/* 다음 검진 예정일 - 신체 건강 */}
            <Card className=\"p-6\" style={{ borderRadius: '16px', background: '#FFFFFF' }}>
              <div className=\"flex items-start justify-between mb-4\">
                <div>
                  <p className=\"text-sm font-medium\" style={{ color: '#6B7280' }}>다음 검진 예정일</p>
                  <h3 className=\"text-2xl font-bold mt-1\" style={{ color: '#1F2328' }}>신체 건강 심층 검진</h3>
                </div>
                <Heart className=\"w-8 h-8\" style={{ color: '#00ACC1' }} />
              </div>
              <div className=\"flex items-baseline gap-2\">
                <span className=\"text-4xl font-bold\" style={{ color: '#00ACC1' }}>D-14</span>
                <span className=\"text-sm\" style={{ color: '#6B7280' }}>2026년 2월 2일</span>
              </div>
            </Card>
          </div>

          {/* Middle Row - Detailed Status */}
          <div className=\"grid grid-cols-2 gap-6 mb-6\">
            {/* 정신 건강 심층 검사 */}
            <Card className=\"p-6\" style={{ borderRadius: '16px', background: '#FFFFFF' }}>
              <div className=\"flex items-center justify-between mb-4\">
                <h3 className=\"text-lg font-bold\" style={{ color: '#1F2328' }}>정신 건강 심층 검사</h3>
                <Badge className=\"px-3 py-1\" style={{ background: '#9C27B0', color: '#FFFFFF' }}>67%</Badge>
              </div>
              <Progress value={67} className=\"mb-4\" style={{ backgroundColor: '#E5E7EB' }} />
              <div className=\"space-y-3\">
                <div className=\"flex items-center justify-between p-3 rounded-lg\" style={{ background: '#F9FAFB' }}>
                  <span className=\"text-sm\" style={{ color: '#1F2328' }}>스트레스 지수 측정</span>
                  <Badge variant=\"outline\" className=\"text-xs\" style={{ borderColor: '#10B981', color: '#10B981' }}>완료</Badge>
                </div>
                <div className=\"flex items-center justify-between p-3 rounded-lg\" style={{ background: '#F9FAFB' }}>
                  <span className=\"text-sm\" style={{ color: '#1F2328' }}>우울증 선별 검사</span>
                  <Badge variant=\"outline\" className=\"text-xs\" style={{ borderColor: '#10B981', color: '#10B981' }}>완료</Badge>
                </div>
                <div className=\"flex items-center justify-between p-3 rounded-lg\" style={{ background: '#F9FAFB' }}>
                  <span className=\"text-sm\" style={{ color: '#1F2328' }}>불안 장애 검사</span>
                  <Badge variant=\"outline\" className=\"text-xs\" style={{ borderColor: '#F59E0B', color: '#F59E0B' }}>진행중</Badge>
                </div>
                <div className=\"flex items-center justify-between p-3 rounded-lg\" style={{ background: '#F9FAFB' }}>
                  <span className=\"text-sm\" style={{ color: '#1F2328' }}>심리 상담 평가</span>
                  <Badge variant=\"outline\" className=\"text-xs\" style={{ borderColor: '#9CA3AF', color: '#9CA3AF' }}>대기</Badge>
                </div>
              </div>
            </Card>

            {/* 신체 건강 심층 검사 */}
            <Card className=\"p-6\" style={{ borderRadius: '16px', background: '#FFFFFF' }}>
              <div className=\"flex items-center justify-between mb-4\">
                <h3 className=\"text-lg font-bold\" style={{ color: '#1F2328' }}>신체 건강 심층 검사</h3>
                <Badge className=\"px-3 py-1\" style={{ background: '#00ACC1', color: '#FFFFFF' }}>83%</Badge>
              </div>
              <Progress value={83} className=\"mb-4\" style={{ backgroundColor: '#E5E7EB' }} />
              <div className=\"space-y-3\">
                <div className=\"flex items-center justify-between p-3 rounded-lg\" style={{ background: '#F9FAFB' }}>
                  <span className=\"text-sm\" style={{ color: '#1F2328' }}>혈압 및 맥박 측정</span>
                  <Badge variant=\"outline\" className=\"text-xs\" style={{ borderColor: '#10B981', color: '#10B981' }}>완료</Badge>
                </div>
                <div className=\"flex items-center justify-between p-3 rounded-lg\" style={{ background: '#F9FAFB' }}>
                  <span className=\"text-sm\" style={{ color: '#1F2328' }}>혈액 검사</span>
                  <Badge variant=\"outline\" className=\"text-xs\" style={{ borderColor: '#10B981', color: '#10B981' }}>완료</Badge>
                </div>
                <div className=\"flex items-center justify-between p-3 rounded-lg\" style={{ background: '#F9FAFB' }}>
                  <span className=\"text-sm\" style={{ color: '#1F2328' }}>신체 계측</span>
                  <Badge variant=\"outline\" className=\"text-xs\" style={{ borderColor: '#10B981', color: '#10B981' }}>완료</Badge>
                </div>
                <div className=\"flex items-center justify-between p-3 rounded-lg\" style={{ background: '#F9FAFB' }}>
                  <span className=\"text-sm\" style={{ color: '#1F2328' }}>시력 및 청력 검사</span>
                  <Badge variant=\"outline\" className=\"text-xs\" style={{ borderColor: '#F59E0B', color: '#F59E0B' }}>진행중</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Bottom Row - Risk & Survey */}
          <div className=\"grid grid-cols-2 gap-6 mb-6\">
            {/* 위험 */}
            <Card className=\"p-6\" style={{ borderRadius: '16px', background: '#FFFFFF' }}>
              <div className=\"flex items-center gap-2 mb-4\">
                <AlertTriangle className=\"w-5 h-5\" style={{ color: '#EF4444' }} />
                <h3 className=\"text-lg font-bold\" style={{ color: '#1F2328' }}>위험</h3>
              </div>
              <div className=\"space-y-3\">
                <div className=\"p-4 rounded-lg\" style={{ background: '#FEE2E2' }}>
                  <div className=\"flex items-start justify-between mb-2\">
                    <span className=\"text-sm font-medium\" style={{ color: '#991B1B' }}>고위험군 관리</span>
                    <Badge style={{ background: '#DC2626', color: '#FFFFFF' }}>긴급</Badge>
                  </div>
                  <p className=\"text-xs\" style={{ color: '#7F1D1D' }}>3명의 직원이 즉각적인 관리가 필요합니다</p>
                </div>
                <div className=\"p-4 rounded-lg\" style={{ background: '#FED7AA' }}>
                  <div className=\"flex items-start justify-between mb-2\">
                    <span className=\"text-sm font-medium\" style={{ color: '#92400E' }}>중위험군 모니터링</span>
                    <Badge style={{ background: '#F59E0B', color: '#FFFFFF' }}>주의</Badge>
                  </div>
                  <p className=\"text-xs\" style={{ color: '#78350F' }}>7명의 직원이 지속적인 관찰이 필요합니다</p>
                </div>
              </div>
            </Card>

            {/* 설문 목록 */}
            <Card className=\"p-6\" style={{ borderRadius: '16px', background: '#FFFFFF' }}>
              <div className=\"flex items-center gap-2 mb-4\">
                <FileText className=\"w-5 h-5\" style={{ color: '#6E8FB3' }} />
                <h3 className=\"text-lg font-bold\" style={{ color: '#1F2328' }}>설문 목록</h3>
              </div>
              <div className=\"space-y-3\">
                <Button 
                  variant=\"outline\" 
                  className=\"w-full justify-start h-auto py-3\"
                  style={{ borderColor: '#DADDE1' }}
                >
                  <div className=\"text-left\">
                    <p className=\"text-sm font-medium\" style={{ color: '#1F2328' }}>번아웃 증후군 자가 진단</p>
                    <p className=\"text-xs\" style={{ color: '#6B7280' }}>소요 시간: 약 5분</p>
                  </div>
                </Button>
                <Button 
                  variant=\"outline\" 
                  className=\"w-full justify-start h-auto py-3\"
                  style={{ borderColor: '#DADDE1' }}
                >
                  <div className=\"text-left\">
                    <p className=\"text-sm font-medium\" style={{ color: '#1F2328' }}>수면의 질 평가</p>
                    <p className=\"text-xs\" style={{ color: '#6B7280' }}>소요 시간: 약 3분</p>
                  </div>
                </Button>
                <Button 
                  variant=\"outline\" 
                  className=\"w-full justify-start h-auto py-3\"
                  style={{ borderColor: '#DADDE1' }}
                >
                  <div className=\"text-left\">
                    <p className=\"text-sm font-medium\" style={{ color: '#1F2328' }}>생활 습관 체크리스트</p>
                    <p className=\"text-xs\" style={{ color: '#6B7280' }}>소요 시간: 약 7분</p>
                  </div>
                </Button>
              </div>
            </Card>
          </div>

          {/* Bottom Section - Monitors & Non-participants */}
          <div className=\"grid grid-cols-2 gap-6\">
            {/* 검진 모니터링 */}
            <Card className=\"p-6\" style={{ borderRadius: '16px', background: '#FFFFFF' }}>
              <div className=\"flex items-center gap-2 mb-4\">
                <Activity className=\"w-5 h-5\" style={{ color: '#6E8FB3' }} />
                <h3 className=\"text-lg font-bold\" style={{ color: '#1F2328' }}>검진 모니터링</h3>
              </div>
              <div className=\"overflow-x-auto\">
                <table className=\"w-full\">
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                      <th className=\"text-left py-3 px-2 text-xs font-semibold\" style={{ color: '#6B7280' }}>이름</th>
                      <th className=\"text-center py-3 px-2 text-xs font-semibold\" style={{ color: '#6B7280' }}>정신</th>
                      <th className=\"text-center py-3 px-2 text-xs font-semibold\" style={{ color: '#6B7280' }}>신체</th>
                      <th className=\"text-center py-3 px-2 text-xs font-semibold\" style={{ color: '#6B7280' }}>위험도</th>
                      <th className=\"text-right py-3 px-2 text-xs font-semibold\" style={{ color: '#6B7280' }}>검진일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monitoringData.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td className=\"py-3 px-2 text-sm font-medium\" style={{ color: '#1F2328' }}>{item.name}</td>
                        <td className=\"text-center py-3 px-2\">
                          <span className=\"text-sm font-semibold\" style={{ color: item.mentalScore >= 80 ? '#10B981' : item.mentalScore >= 70 ? '#F59E0B' : '#EF4444' }}>
                            {item.mentalScore}
                          </span>
                        </td>
                        <td className=\"text-center py-3 px-2\">
                          <span className=\"text-sm font-semibold\" style={{ color: item.physicalScore >= 80 ? '#10B981' : item.physicalScore >= 70 ? '#F59E0B' : '#EF4444' }}>
                            {item.physicalScore}
                          </span>
                        </td>
                        <td className=\"text-center py-3 px-2\">
                          <Badge variant=\"outline\" className=\"text-xs\" style={{ 
                            borderColor: item.risk === '낮음' ? '#10B981' : item.risk === '중간' ? '#F59E0B' : '#EF4444',
                            color: item.risk === '낮음' ? '#10B981' : item.risk === '중간' ? '#F59E0B' : '#EF4444'
                          }}>
                            {item.risk}
                          </Badge>
                        </td>
                        <td className=\"text-right py-3 px-2 text-xs\" style={{ color: '#6B7280' }}>{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* 미검진 인원 집중 관리 */}
            <Card className=\"p-6\" style={{ borderRadius: '16px', background: '#FFFFFF' }}>
              <div className=\"mb-4\">
                <h3 className=\"text-lg font-bold mb-1\" style={{ color: '#1F2328' }}>미검진 인원 집중 관리</h3>
                <p className=\"text-xs\" style={{ color: '#6B7280' }}>직원을 위치하기 전송 위해 미검진 인원을 보내드립니다.</p>
              </div>
              <div className=\"space-y-3\">
                {nonParticipants.map((person, idx) => (
                  <div key={idx} className=\"flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors\">
                    <div className=\"w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0\" style={{ background: '#E5E7EB' }}>
                      <User className=\"w-5 h-5\" style={{ color: '#6B7280' }} />
                    </div>
                    <div className=\"flex-1 min-w-0\">
                      <p className=\"text-sm font-medium\" style={{ color: '#1F2328' }}>{person.name}</p>
                      <p className=\"text-xs\" style={{ color: '#6B7280' }}>{person.team}</p>
                    </div>
                    <Badge style={{ background: '#FEE2E2', color: '#991B1B', flexShrink: 0 }}>
                      +{person.daysOverdue}일 지남
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Floating Action Buttons */}
          <div className=\"fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 p-2 rounded-full shadow-lg\" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
            <Button variant=\"ghost\" size=\"icon\" className=\"rounded-full\">
              <Home className=\"w-5 h-5\" style={{ color: '#3F4A5A' }} />
            </Button>
            <Button variant=\"ghost\" size=\"icon\" className=\"rounded-full\">
              <Calendar className=\"w-5 h-5\" style={{ color: '#3F4A5A' }} />
            </Button>
            <Button variant=\"ghost\" size=\"icon\" className=\"rounded-full\">
              <Printer className=\"w-5 h-5\" style={{ color: '#3F4A5A' }} />
            </Button>
            <Button variant=\"ghost\" size=\"icon\" className=\"rounded-full\">
              <User className=\"w-5 h-5\" style={{ color: '#3F4A5A' }} />
            </Button>
            <Button variant=\"ghost\" size=\"icon\" className=\"rounded-full\">
              <Settings className=\"w-5 h-5\" style={{ color: '#3F4A5A' }} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
