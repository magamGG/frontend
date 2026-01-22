import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  ChevronRight,
  Clock,
  CheckCircle2,
  Target
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useState } from 'react';

/**
 * AgencyDashboardPage component
 */
export function AgencyDashboardPage() {
  const [selectedSection, setSelectedSection] = useState(null);

  // Mock data for metrics
  const metrics = [
    { 
      id: 1, 
      label: '평균 마감 준수율', 
      value: '87.5%', 
      change: '+5.2%',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconBgColor: 'bg-green-100'
    },
    { 
      id: 2, 
      label: '활동 작가', 
      value: '24명', 
      change: '+3명',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconBgColor: 'bg-blue-100'
    },
    { 
      id: 3, 
      label: '진행 프로젝트', 
      value: '18개', 
      change: '+2개',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconBgColor: 'bg-purple-100'
    },
  ];

  // Mock data for deadline compliance trend (line chart)
  const complianceData = [
    { month: '1월', rate: 78 },
    { month: '2월', rate: 82 },
    { month: '3월', rate: 85 },
    { month: '4월', rate: 83 },
    { month: '5월', rate: 86 },
    { month: '6월', rate: 87.5 },
  ];

  // Mock data for artist distribution by project (bar chart)
  const artistDistributionData = [
    { name: '로맨스 판타지', artists: 5 },
    { name: '액션 웹툰', artists: 4 },
    { name: 'SF 드라마', artists: 3 },
    { name: '일상 코미디', artists: 6 },
    { name: '스릴러', artists: 2 },
  ];

  // Mock data for attendance (pie chart)
  const attendanceData = [
    { name: '출근', value: 18, color: '#00ACC1' }, // 청록색
    { name: '재택근무', value: 3, color: '#FF9800' }, // 오렌지색
    { name: '휴재', value: 2, color: '#757575' }, // 회색
    { name: '워케이션', value: 1, color: '#9C27B0' }, // 보라색
  ];

  // Mock data for approval requests pie chart
  const approvalData = [
    { name: '휴재', value: 2, color: '#757575' }, // 회색
    { name: '계약', value: 2, color: '#9C27B0' }, // 보라색
    { name: '신청', value: 1, color: '#00ACC1' }, // 청록색
  ];

  // Mock data for pending requests
  const pendingRequests = [
    { 
      id: 1, 
      type: '휴가', 
      requester: '김담당자', 
      role: '담당자',
      date: '1월 20일 ~ 1월 22일',
      submitted: '1월 15일',
      reason: '개인 사유'
    },
  ];

  const getRequestTypeColor = (type: string) => {
    switch (type) {
      case '휴가':
        return 'bg-blue-500';
      case '병가':
        return 'bg-red-500';
      case '작품 계약':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatCurrency = (value: number) => {
    return `₩${value}M`;
  };

  const formatViews = (value: number) => {
    return `${(value / 10000).toFixed(0)}만`;
  };

  return (
    <div className="w-full h-full">
      <div className="pb-24 px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 메트릭 카드 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.id} className={`p-5 ${metric.bgColor} border-none`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                      <h3 className="text-2xl font-bold text-foreground mb-1">{metric.value}</h3>
                      <p className={`text-xs ${metric.color} font-medium`}>{metric.change}</p>
                    </div>
                    <div className={`${metric.iconBgColor} p-3 rounded-lg`}>
                      <Icon className={`w-5 h-5 ${metric.color}`} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* 그래프 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 평균 마감 준수율 추이 (선 그래프) */}
            <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedSection('revenue')}>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">평균 마감 준수율 추이</h3>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, '준수율']}
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#6E8FB3" 
                    strokeWidth={3}
                    dot={{ fill: '#6E8FB3', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-900">
                    전월 대비 5.2% 증가했습니다
                  </p>
                </div>
              </div>
            </Card>

            {/* 작품별 아티스트 분포도 (막대 그래프) */}
            <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedSection('distribution')}>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">작품별 아티스트 분포도</h3>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={artistDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                    tickFormatter={(value) => `${value}명`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}명`, '아티스트']}
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="artists" 
                    fill="#6E8FB3" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-blue-900">
                    일상 코미디에 가장 많은 아티스트가 배정되어 있습니다
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* 금일 출석 현황 & 승인 대기 직원 수 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 금일 출석 현황 (원형 그래프) */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">금일 출석 현황</h3>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={attendanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {attendanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  {attendanceData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="text-sm font-medium text-foreground ml-auto">{item.value}명</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">전체 인원</span>
                  <span className="text-lg font-bold text-foreground">
                    {attendanceData.reduce((sum, item) => sum + item.value, 0)}명
                  </span>
                </div>
              </div>
            </Card>

            {/* 승인 대기 중인 직원 수 */}
            <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedSection('approvals')}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">승인 대기 중인 직원 수</h3>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={approvalData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {approvalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  {approvalData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="text-sm font-medium text-foreground ml-auto">{item.value}건</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">전체 대기</span>
                  <span className="text-lg font-bold text-foreground">
                    {approvalData.reduce((sum, item) => sum + item.value, 0)}건
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}