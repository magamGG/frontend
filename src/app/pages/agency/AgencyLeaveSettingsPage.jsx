import { useState, useEffect, useMemo } from 'react';
import theme from '@/styles/theme';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Calendar,
  Edit2,
  Save,
  Search,
  Users,
  AlertCircle,
  Settings,
  TrendingUp,
  Send,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Info,
  AlertTriangle,
  X
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ComposedChart, ReferenceLine, ReferenceArea, Scatter, Line } from 'recharts';
import {
  LeaveManagementBody,
  PageHeader,
  PageTitle,
  PageDescription,
  MainContent,
  
  // 그리드 레이아웃
  TopGridSection,
  MiddleGridSection,
  
  // 리스크 대시보드
  RiskDashboardSection,
  RiskDashboardCard,
  RiskDashboardHeader,
  RiskDashboardTitle,
  RiskDashboardSubtitle,
  TimeWeightedInfo,
  ChartSection,
  ChartCard,
  ChartTitle,
  ChartContainer,
  RiskCategoryCards,
  RiskCategoryCard,
  RiskCategoryCardHeader,
  RiskCategoryCardTitle,
  RiskCategoryCardSubtitle,
  RiskCategoryCardCount,
  RiskCategoryCardDescription,
  RiskCategoryCardAction,
  
  // 연차 정책 및 개별 수정
  PolicySection,
  PolicyCard,
  PolicyCardHeader,
  PolicyCardTitle,
  PolicyCardDescription,
  PolicyForm,
  PolicyFormGroup,
  PolicyFormLabel,
  PolicyFormInput,
  PolicyFormHelperText,
  PolicyFormActions,
  
  EmployeeManagementSection,
  EmployeeManagementCard,
  EmployeeSearchBar,
  EmployeeSearchIcon,
  EmployeeSearchInput,
  EmployeeTable,
  EmployeeTableHeader,
  EmployeeTableHeaderCell,
  EmployeeTableRow,
  EmployeeTableCell,
  
  // 로그 테이블
  LogSection,
  LogCard,
  LogCardHeader,
  LogCardTitle,
  LogCardDescription,
  LogTable,
  LogTableHeader,
  LogTableHeaderCell,
  LogTableRow,
  LogTableCell,
  LogPagination,
  LogPaginationButton,
  
  // 모달
  ModalForm,
  ModalFormGroup,
  ModalFormLabel,
  ModalFormInput,
  ModalFormSelect,
  ModalFormTextarea,
  ModalFormHelperText,
  ModalFormActions,
  DistributionChartSection,
  DistributionChartHeader,
  DistributionChartHeaderLeft,
  DistributionChartHeaderRight,
  DistributionChartHeaderContent,
  DistributionChartTitle,
  DistributionChartDescription,
  DistributionChartLegend,
  LegendItem,
  LegendDot,
  DistributionChartCard,
  DistributionChartContainer,
  ChartBackgroundLayer,
  RiskZone,
  HealthyZone,
  CompleteZone,
  SeasonInfoCard,
  SeasonInfoLabel,
  SeasonInfoTitle,
  SeasonInfoSubtitle,
  StatsGrid,
  StatCard,
  StatCardHeader,
  StatCardIcon,
  StatCardTitle,
  StatCardValue,
  StatCardStats,
  StatCardStatItem,
  StatCardStatLabel,
  StatCardStatValue,
  StatCardDivider,
  EmployeeListModalOverlay,
  EmployeeListModal,
  EmployeeListModalHeader,
  EmployeeListModalHeaderContent,
  EmployeeListModalTitle,
  EmployeeListModalDescription,
  EmployeeListModalCloseButton,
  EmployeeListModalBody,
  EmployeeListGrid,
  EmployeeListItem,
  EmployeeListAvatar,
  EmployeeListInfo,
  EmployeeListName,
  EmployeeListRole,
  EmployeeListEmpty,
  EmployeeListModalFooter,
  EmployeeListModalCloseButtonFooter,
} from './AgencyLeaveSettingsPage.styled';

// TODO: Zustand store mapping - 회사 연차 정책
const getInitialCompanyPolicy = () => {
  const stored = localStorage.getItem('agencyLeavePolicy');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    defaultLeave: 15,
  };
};

// TODO: Zustand store mapping - 직원 목록
const getInitialEmployees = () => {
  const stored = localStorage.getItem('agencyEmployees');
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    {
      id: 1,
      name: '김작가',
      position: '웹툰',
      totalLeave: 18,
      usedLeave: 2,
      remainingLeave: 16,
      startDate: '2024-01-01',
      adjustmentDetails: '우수 사원 포상',
    },
    {
      id: 2,
      name: '이담당',
      position: 'PD',
      totalLeave: 10,
      usedLeave: 8,
      remainingLeave: 2,
      startDate: '2024-01-01',
      adjustmentDetails: '징계 (지각 누적)',
    },
    {
      id: 3,
      name: '박대리',
      position: '어시스트',
      totalLeave: 12,
      usedLeave: 1,
      remainingLeave: 11,
      startDate: '2024-01-01',
      adjustmentDetails: '',
    },
    {
      id: 4,
      name: '최작가',
      position: '웹툰',
      totalLeave: 15,
      usedLeave: 13,
      remainingLeave: 2,
      startDate: '2024-01-01',
      adjustmentDetails: '',
    },
    {
      id: 5,
      name: '정담당',
      position: 'PD',
      totalLeave: 15,
      usedLeave: 0,
      remainingLeave: 15,
      startDate: '2024-01-01',
      adjustmentDetails: '',
    },
  ];
};

// TODO: Zustand store mapping - 연차 변경 로그
const getInitialLeaveLogs = () => {
  const stored = localStorage.getItem('agencyLeaveLogs');
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    {
      id: 1,
      date: '2023-11-15 14:30',
      target: '박대리',
      type: '포상',
      changedDays: 3,
      reason: '우수 사원 포상',
      processor: '최관리자',
    },
    {
      id: 2,
      date: '2023-11-10 08:15',
      target: '김대리',
      type: '징계',
      changedDays: 1,
      reason: '징계 (지각 누적)',
      processor: '최관리자',
    },
  ];
};

// 현재 월 기준 권장 소진율 계산
const getExpectedUsageRate = (currentMonth) => {
  const monthlyExpectedRates = {
    1: 5,    // 1월: 5%
    2: 8,    // 2월: 8%
    3: 10,   // 3월: 10%
    4: 12,   // 4월: 12%
    5: 15,   // 5월: 15%
    6: 20,   // 6월: 20%
    7: 25,   // 7월: 25%
    8: 30,   // 8월: 30%
    9: 40,   // 9월: 40%
    10: 50,  // 10월: 50%
    11: 85,  // 11월: 85%
    12: 95,  // 12월: 95%
  };
  return monthlyExpectedRates[currentMonth] || 0;
};

// 소진율 계산
const calculateUsageRate = (employee) => {
  if (!employee.totalLeave || employee.totalLeave === 0) return 0;
  return (employee.usedLeave / employee.totalLeave) * 100;
};

// 위험군 분류 (시기별 가중치 적용)
const categorizeRiskGroup = (employee, currentMonth) => {
  const usageRate = calculateUsageRate(employee);
  
  if (usageRate < 30) {
    return { 
      group: '위험군', 
      color: '#ef4444', 
      description: '번아웃 위험',
      range: '0~30% 사용'
    };
  } else if (usageRate < 80) {
    return { 
      group: '적정군', 
      color: '#22c55e', 
      description: '안정',
      range: '30~80% 사용'
    };
  } else {
    const isEarlyYear = currentMonth <= 6;
    return { 
      group: '완료군', 
      color: '#f59e0b', 
      description: isEarlyYear ? '퇴사 우려/급격한 소진' : '완료',
      range: '80~100% 사용'
    };
  }
};

// 위험 카테고리 상수 (Dashboard.md에서 변환)
const RiskCategory = {
  BURNOUT_RISK: 'BURNOUT_RISK',
  HEALTHY: 'HEALTHY',
  TURNOVER_RISK: 'TURNOVER_RISK',
};

// 위험 카테고리 색상
const RISK_COLORS = {
  [RiskCategory.BURNOUT_RISK]: '#ef4444',
  [RiskCategory.HEALTHY]: '#22c55e',
  [RiskCategory.TURNOVER_RISK]: '#ef4444',
};

// 위험 카테고리 판단 함수 (Dashboard.md에서 변환)
const getRiskCategory = (percentage, month) => {
  if (percentage < 30 && month > 6) return RiskCategory.BURNOUT_RISK;
  if (percentage < 10 && month > 3) return RiskCategory.BURNOUT_RISK;
  if (percentage > 80 && month < 9) return RiskCategory.TURNOVER_RISK;
  return RiskCategory.HEALTHY;
};

// 커스텀 툴팁 컴포넌트 (Dashboard.md에서 변환)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const pointData = payload.find((p) => p.dataKey === 'y' && p.payload?.employees);
    
    if (pointData) {
      const data = pointData.payload;
      return (
        <div style={{
          background: 'white',
          padding: theme.spacing[4],
          border: '1px solid var(--border)',
          boxShadow: theme.shadows.xl,
          borderRadius: theme.borderRadius.xl,
          zIndex: 50,
          width: '256px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing[3],
            paddingBottom: theme.spacing[2],
            borderBottom: '1px solid var(--card)',
          }}>
            <div>
              <span style={{
                fontSize: theme.fonts.size.xs,
                fontWeight: theme.fonts.weight.bold,
                color: 'var(--muted-foreground)',
                display: 'block',
              }}>소진율 구간</span>
              <span style={{
                fontSize: theme.fonts.size.sm,
                fontWeight: theme.fonts.weight.bold,
                color: 'var(--foreground)',
              }}>{data.rangeLabel}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontSize: theme.fonts.size.xs,
                fontWeight: theme.fonts.weight.bold,
                color: 'var(--muted-foreground)',
                display: 'block',
              }}>인원</span>
              <span style={{
                fontSize: theme.fonts.size.lg,
                fontWeight: theme.fonts.weight.bold,
                color: data.riskCategory === '적정군' ? '#22c55e' : data.riskCategory === '완료군' ? '#f59e0b' : '#ef4444',
              }}>
                {data.y}명
              </span>
            </div>
          </div>
          
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[1],
              fontSize: theme.fonts.size.xs,
              color: 'var(--muted-foreground)',
              marginBottom: theme.spacing[2],
            }}>
              <Users size={12} />
              <span>미리보기 (클릭하여 전체보기)</span>
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: theme.spacing[1],
            }}>
              {data.employees.slice(0, 5).map((emp, i) => (
                <span key={i} style={{
                  padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  fontSize: theme.fonts.size.xs,
                  borderRadius: theme.borderRadius.md,
                  border: '1px solid var(--border)',
                }}>
                  {emp.name}
                </span>
              ))}
              {data.employees.length > 5 && (
                <span style={{
                  padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                  background: 'var(--card)',
                  color: 'var(--muted-foreground)',
                  fontSize: theme.fonts.size.xs,
                  borderRadius: theme.borderRadius.md,
                  border: '1px solid var(--border)',
                }}>
                  +{data.employees.length - 5}명
                </span>
              )}
            </div>
          </div>
          <div style={{
            marginTop: theme.spacing[2],
            fontSize: '10px',
            textAlign: 'center',
            color: '#6366f1',
            fontWeight: theme.fonts.weight.medium,
            background: '#eef2ff',
            padding: theme.spacing[1],
            borderRadius: theme.borderRadius.md,
          }}>
            클릭하여 전체 리스트 확인하기
          </div>
        </div>
      );
    }
  }
  return null;
};

export function AgencyLeaveSettingsPage() {
  const [companyPolicy, setCompanyPolicy] = useState(getInitialCompanyPolicy);
  const [employees, setEmployees] = useState(getInitialEmployees);
  const [leaveLogs, setLeaveLogs] = useState(getInitialLeaveLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustFormData, setAdjustFormData] = useState({
    adjustment: 0,
    reason: '',
    note: '',
  });
  const [selectedBin, setSelectedBin] = useState(null);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  const currentMonth = new Date().getMonth() + 1;
  const expectedUsageRate = getExpectedUsageRate(currentMonth);

  // 분기 정보 계산
  const getSeasonInfo = () => {
    const season = Math.ceil(currentMonth / 3);
    
    const monthsUntilYearEnd = 12 - currentMonth;
    let remainingText = '';
    if (monthsUntilYearEnd === 0) {
      remainingText = '연말';
    } else if (monthsUntilYearEnd === 1) {
      remainingText = '연말까지 1개월 남음';
    } else {
      remainingText = `연말까지 ${monthsUntilYearEnd}개월 남음`;
    }
    
    return {
      season: `${season}분기`,
      monthText: `${currentMonth}월`,
      remaining: remainingText,
    };
  };

  const seasonInfo = getSeasonInfo();

  // localStorage 저장
  useEffect(() => {
    localStorage.setItem('agencyEmployees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('agencyLeavePolicy', JSON.stringify(companyPolicy));
  }, [companyPolicy]);

  useEffect(() => {
    localStorage.setItem('agencyLeaveLogs', JSON.stringify(leaveLogs));
  }, [leaveLogs]);

  // 위험군별 통계 계산
  const calculateRiskStats = () => {
    const riskGroups = {
      위험군: { count: 0, employees: [] },
      적정군: { count: 0, employees: [] },
      완료군: { count: 0, employees: [] },
    };

    employees.forEach(emp => {
      if (!emp) return;
      const category = categorizeRiskGroup(emp, currentMonth);
      riskGroups[category.group].count++;
      riskGroups[category.group].employees.push(emp);
    });

    return riskGroups;
  };

  const riskStats = calculateRiskStats();

  // 연차 소진 분포도 차트 데이터 (Dashboard.md에서 변환)
  const { distributionChartData, distributionMean, distributionStdDev, maxYValue } = useMemo(() => {
    // 1. 개별 통계 분석
    const analyzed = employees.map(emp => {
      const percentage = calculateUsageRate(emp);
      const category = categorizeRiskGroup(emp, currentMonth);
      return {
        ...emp,
        usagePercentage: percentage,
        category: category.group, // 위험군, 적정군, 완료군
        categoryColor: category.color, // 색상
      };
    });

    const sum = analyzed.reduce((acc, curr) => acc + curr.usagePercentage, 0);
    const avg = sum / (analyzed.length || 1);
    const variance = analyzed.reduce((acc, curr) => acc + Math.pow(curr.usagePercentage - avg, 2), 0) / analyzed.length;
    const sd = Math.sqrt(variance);

    // 2. 5% 구간별로 데이터 그룹화
    const binSize = 5;
    const bins = [];

    for (let i = 0; i < 100; i += binSize) {
      const min = i;
      const max = i + binSize;
      const mid = (min + max) / 2;
      
      // 해당 구간의 직원 필터링
      const inBin = analyzed.filter(e => e.usagePercentage >= min && e.usagePercentage < max);
      
      // 구간의 대표 위험 카테고리 결정 (구간 중간값 기준)
      // 위험군: 0~30% → 빨간색, 적정군: 30~80% → 초록색, 완료군: 80~100% → 노란색
      let fillColor = '#22c55e'; // 기본값: 초록색 (적정군)
      if (mid < 30) {
        fillColor = '#ef4444'; // 빨간색 (위험군 - 연차 소진율 낮음)
      } else if (mid >= 80) {
        fillColor = '#f59e0b'; // 노란색 (완료군)
      } else {
        fillColor = '#22c55e'; // 초록색 (적정군 - 안정권)
      }

      bins.push({
        x: mid, // 구간 중간값
        y: inBin.length, // 인원 수
        rangeLabel: `${min}% - ${max}%`,
        employees: inBin.map(e => ({ name: e.name, role: e.position || '직무 없음' })),
        riskCategory: mid < 30 ? '위험군' : mid >= 80 ? '완료군' : '적정군',
        fill: fillColor,
      });
    }

    const maxBinCount = Math.max(...bins.map(b => b.y), 1); // 최소값 1로 설정

    return { 
      distributionChartData: bins, 
      distributionMean: avg, 
      distributionStdDev: sd,
      maxCount: maxBinCount,
      maxYValue: maxBinCount
    };
  }, [employees, currentMonth]);

  // 위험군 통계 계산 (차트와 동일한 로직 사용)
  const distributionStats = useMemo(() => {
    const analyzed = employees.map(e => {
      const category = categorizeRiskGroup(e, currentMonth);
      return category.group; // '위험군', '적정군', '완료군'
    });
    const 위험군 = analyzed.filter(c => c === '위험군').length;
    const 완료군 = analyzed.filter(c => c === '완료군').length;
    return { 
      burnout: 위험군, // 번아웃 위험군 (사용 저조) = 위험군
      turnover: 완료군 // 이탈 위험군 (과다 사용) = 완료군
    };
  }, [employees, currentMonth]);

  // 정책 저장
  const handleSavePolicy = () => {
    if (companyPolicy.defaultLeave < 0) {
      toast.error('기본 연차 수는 0 이상이어야 합니다.');
      return;
    }
    localStorage.setItem('agencyLeavePolicy', JSON.stringify(companyPolicy));
    toast.success('회사 연차 정책이 저장되었습니다.');
  };

  // 연차 조정 모달 열기
  const handleOpenAdjustModal = (employee) => {
    setSelectedEmployee(employee);
    setAdjustFormData({
      adjustment: 0,
      reason: '',
      note: '',
    });
    setIsAdjustModalOpen(true);
  };

  // 연차 조정 저장
  const handleSaveAdjustment = () => {
    if (!adjustFormData.reason) {
      toast.error('사유를 선택해주세요.');
      return;
    }

    if (adjustFormData.adjustment === 0) {
      toast.error('조정 일수를 입력해주세요.');
      return;
    }

    // 포상/경력인정: 0 이상만 허용
    if ((adjustFormData.reason === '포상' || adjustFormData.reason === '경력인정') && adjustFormData.adjustment < 0) {
      toast.error('포상/경력인정은 조정 일수가 0 이상이어야 합니다.');
      return;
    }

    // 징계: 0 이하만 허용
    if (adjustFormData.reason === '징계' && adjustFormData.adjustment > 0) {
      toast.error('징계는 조정 일수가 0 이하여야 합니다.');
      return;
    }

    const newTotalLeave = selectedEmployee.totalLeave + adjustFormData.adjustment;
    if (newTotalLeave < 0) {
      toast.error('총 연차는 0 이상이어야 합니다.');
      return;
    }

    const newRemainingLeave = newTotalLeave - selectedEmployee.usedLeave;

    // 직원 데이터 업데이트
    const updatedEmployees = employees.map(emp =>
      emp.id === selectedEmployee.id
        ? {
            ...emp,
            totalLeave: newTotalLeave,
            remainingLeave: newRemainingLeave >= 0 ? newRemainingLeave : 0,
            adjustmentDetails: adjustFormData.reason,
          }
        : emp
    );
    setEmployees(updatedEmployees);

    // 로그 추가
    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleString('ko-KR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      target: selectedEmployee.name,
      type: adjustFormData.reason === '포상' ? '포상' : adjustFormData.reason === '징계' ? '징계' : '경력인정',
      changedDays: Math.abs(adjustFormData.adjustment),
      reason: adjustFormData.note || adjustFormData.reason,
      processor: '최관리자', // TODO: 실제 사용자 정보로 교체
    };
    setLeaveLogs([newLog, ...leaveLogs]);

    toast.success(`${selectedEmployee.name}님의 연차가 조정되었습니다.`);
    setIsAdjustModalOpen(false);
    setSelectedEmployee(null);
  };

  // 필터링된 직원 목록
  const filteredEmployees = employees.filter(emp => {
    if (!emp) return false;
    const name = emp.name || '';
    const position = emp.position || '';
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || position.toLowerCase().includes(query);
  });

  // 휴가 독려 알림 보내기 (번아웃 위험군에게)
  const handleSendEncouragement = () => {
    const riskEmployees = riskStats.위험군.employees
      .filter(emp => emp && emp.name)
      .map(emp => emp.name);
    
    if (riskEmployees.length === 0) {
      toast.info('번아웃 위험군이 없습니다.');
      return;
    }
    
    // TODO: 실제 알림 전송 API 호출
    toast.success(`휴가 독려 알림이 ${riskEmployees.length}명에게 전송되었습니다. (${riskEmployees.join(', ')})`);
  };

  return (
    <LeaveManagementBody>
        {/* 페이지 헤더 */}
        <PageHeader>
          <div>
            <PageTitle>연차 관리</PageTitle>
            <PageDescription>
              Annual Leave Management
            </PageDescription>
          </div>
          {/* 기본 연차 설정 버튼 */}
          <Button 
            variant="outline" 
            size="default" 
            onClick={() => setIsPolicyModalOpen(true)}
            style={{
              borderColor: '#d4d4d4',
              backgroundColor: 'white',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.opacity = '1';
            }}
          >
            <Settings className="w-4 h-4" />
            기본 연차 설정
          </Button>
        </PageHeader>

        <MainContent>
          {/* 연차 소진 분포도 차트 (Dashboard.md에서 변환) */}
          <DistributionChartSection>
            <DistributionChartHeader>
              <DistributionChartHeaderLeft>
                <DistributionChartHeaderContent>
                  <DistributionChartTitle>연차 소진 분포도 (Grouped Scatter)</DistributionChartTitle>
                  <DistributionChartDescription>
                    전체 인원({employees.length}명)을 5% 구간별로 그룹화하여 분포를 시각화했습니다.<br/>
                    <span style={{ fontSize: theme.fonts.size.xs, color: 'var(--muted-foreground)' }}>
                      포인트를 클릭하면 해당 구간의 전체 직원 리스트를 확인할 수 있습니다.
                    </span>
                  </DistributionChartDescription>
                </DistributionChartHeaderContent>
                <DistributionChartLegend>
                  <LegendItem $bgColor="#fee2e2" $borderColor="#fecaca" $textColor="#991b1b">
                    <LegendDot $color="#ef4444" />
                    <span>위험군 (0~30%)</span>
                  </LegendItem>
                  <LegendItem $bgColor="#dcfce7" $borderColor="#bbf7d0" $textColor="#166534">
                    <LegendDot $color="#22c55e" />
                    <span>적정군 (30~80%)</span>
                  </LegendItem>
                  <LegendItem $bgColor="#fef3c7" $borderColor="#fde68a" $textColor="#92400e">
                    <LegendDot $color="#f59e0b" />
                    <span>완료군 (80~100%)</span>
                  </LegendItem>
                </DistributionChartLegend>
              </DistributionChartHeaderLeft>
              <DistributionChartHeaderRight>
                <SeasonInfoCard>
                  <SeasonInfoLabel>현재 시점 ({seasonInfo.monthText})</SeasonInfoLabel>
                  <SeasonInfoTitle>{seasonInfo.season}</SeasonInfoTitle>
                  <SeasonInfoSubtitle>{seasonInfo.remaining}</SeasonInfoSubtitle>
                </SeasonInfoCard>
              </DistributionChartHeaderRight>
            </DistributionChartHeader>

            <DistributionChartCard>
              <DistributionChartContainer>
                <ChartBackgroundLayer>
                  <RiskZone />
                  <HealthyZone />
                  <CompleteZone />
                </ChartBackgroundLayer>
                <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                      {/* 구간별 배경색 - ReferenceArea 사용 */}
                      <ReferenceArea 
                        x1={0} 
                        x2={30} 
                        y1={0} 
                        y2={maxYValue + 1} 
                        fill="#fee2e2" 
                        fillOpacity={0.5}
                        stroke="none"
                        ifOverflow="visible"
                      />
                      <ReferenceArea 
                        x1={30} 
                        x2={80} 
                        y1={0} 
                        y2={maxYValue + 1} 
                        fill="#dcfce7" 
                        fillOpacity={0.5}
                        stroke="none"
                        ifOverflow="visible"
                      />
                      <ReferenceArea 
                        x1={80} 
                        x2={100} 
                        y1={0} 
                        y2={maxYValue + 1} 
                        fill="#fef3c7" 
                        fillOpacity={0.5}
                        stroke="none"
                        ifOverflow="visible"
                      />
                      
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="x" 
                      type="number" 
                      domain={[0, 100]} 
                      tickCount={11}
                      label={{ value: '연차 소진율 (%)', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#64748b' }} 
                    />
                    <YAxis 
                      dataKey="y"
                      domain={[0, 'dataMax + 1']}
                      allowDecimals={false}
                      tickFormatter={(value) => Math.floor(value)}
                      label={{ value: '인원 수 (명)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#64748b' }} 
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    
                    {/* 평균선 */}
                    <ReferenceLine x={distributionMean} stroke="#6366f1" strokeDasharray="3 3" label={{ value: '평균', position: 'top', fill: '#6366f1', fontSize: 12 }} />

                    {/* 연결선 (트렌드 표시) */}
                    <Line 
                      data={distributionChartData} 
                      dataKey="y" 
                      stroke="#cbd5e1" 
                      strokeWidth={1} 
                      dot={false} 
                      activeDot={false}
                      isAnimationActive={false}
                    />

                    {/* 구간별 포인트 */}
                    <Scatter 
                      data={distributionChartData} 
                      dataKey="y"
                      name="직원 그룹"
                      onClick={(data) => setSelectedBin(data.payload)}
                      cursor="pointer"
                      shape={(props) => {
                        const { cx, cy, payload } = props;
                        if (payload.y === 0) return null;
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={14}
                            fill={payload.fill}
                            stroke="#fff"
                            strokeWidth={3}
                            style={{ 
                              cursor: 'pointer', 
                              transition: 'all 0.2s ease',
                              pointerEvents: 'all'
                            }}
                            onMouseEnter={(e) => {
                              e.target.setAttribute('r', '18');
                              e.target.style.opacity = '0.8';
                            }}
                            onMouseLeave={(e) => {
                              e.target.setAttribute('r', '14');
                              e.target.style.opacity = '1';
                            }}
                          />
                        );
                      }}
                    >
                      {distributionChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.fill} 
                        />
                      ))}
                    </Scatter>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </DistributionChartContainer>
            </DistributionChartCard>

            {/* 통계 요약 카드 */}
            <StatsGrid>
              <StatCard $bgColor="#fee2e2" $borderColor="#fecaca">
                <StatCardHeader>
                  <StatCardIcon>
                    <AlertTriangle size={20} color="#dc2626" />
                  </StatCardIcon>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                    <StatCardTitle $textColor="#991b1b">번아웃 위험군 (사용 저조)</StatCardTitle>
                    {distributionStats.burnout > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSendEncouragement}
                        style={{ 
                          backgroundColor: '#fee2e2',
                          borderColor: '#fecaca',
                          color: '#991b1b',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fecaca';
                          e.currentTarget.style.opacity = '0.9';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#fee2e2';
                          e.currentTarget.style.opacity = '1';
                        }}
                      >
                        <Send className="w-4 h-4" />
                        휴가 독려 알림
                      </Button>
                    )}
                  </div>
                </StatCardHeader>
                <StatCardValue>{distributionStats.burnout}명</StatCardValue>
              </StatCard>

              <StatCard $bgColor="#fee2e2" $borderColor="#fecaca">
                <StatCardHeader>
                  <StatCardIcon>
                    <TrendingUp size={20} color="#dc2626" />
                  </StatCardIcon>
                  <StatCardTitle $textColor="#991b1b">이탈 위험군 (과다 사용)</StatCardTitle>
                </StatCardHeader>
                <StatCardValue>{distributionStats.turnover}명</StatCardValue>
              </StatCard>

              <StatCard $bgColor="var(--card)" $borderColor="var(--border)">
                <StatCardHeader>
                  <StatCardIcon>
                    <Info size={20} color="var(--muted-foreground)" />
                  </StatCardIcon>
                  <StatCardTitle>통계 요약</StatCardTitle>
                </StatCardHeader>
                <StatCardStats>
                  <StatCardStatItem>
                    <StatCardStatLabel>평균 사용률</StatCardStatLabel>
                    <StatCardStatValue $color="#6366f1">{distributionMean.toFixed(1)}%</StatCardStatValue>
                  </StatCardStatItem>
                  <StatCardDivider />
                  <StatCardStatItem>
                    <StatCardStatLabel>표준 편차</StatCardStatLabel>
                    <StatCardStatValue>±{distributionStdDev.toFixed(1)}%</StatCardStatValue>
                  </StatCardStatItem>
                </StatCardStats>
              </StatCard>
            </StatsGrid>
          </DistributionChartSection>



          {/* 중앙: 직원 목록 + 변경 로그 */}
          <MiddleGridSection>
            {/* 개별 예외 설정 */}
            <EmployeeManagementCard>
              <PolicyCardHeader>
                <PolicyCardTitle>직원 연차 관리</PolicyCardTitle>
                <PolicyCardDescription>
                  포상, 징계, 경력 인정에 따른 개별 연차 조정
                </PolicyCardDescription>
              </PolicyCardHeader>

              <EmployeeSearchBar>
                <EmployeeSearchIcon>
                  <Search className="w-4 h-4" />
                </EmployeeSearchIcon>
                <EmployeeSearchInput
                  type="text"
                  placeholder="직원 이름 또는 직무로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </EmployeeSearchBar>

              <EmployeeTable>
                <EmployeeTableHeader>
                  <tr>
                    <EmployeeTableHeaderCell>이름</EmployeeTableHeaderCell>
                    <EmployeeTableHeaderCell>직무</EmployeeTableHeaderCell>
                    <EmployeeTableHeaderCell>연차</EmployeeTableHeaderCell>
                    <EmployeeTableHeaderCell>조정</EmployeeTableHeaderCell>
                    <EmployeeTableHeaderCell>관리</EmployeeTableHeaderCell>
                  </tr>
                </EmployeeTableHeader>
                <tbody>
                  {filteredEmployees.map((employee) => {
                    if (!employee) return null;
                    const usageRate = calculateUsageRate(employee);
                    const category = categorizeRiskGroup(employee, currentMonth);
                    return (
                      <EmployeeTableRow key={employee.id}>
                        <EmployeeTableCell>{employee.name || '-'}</EmployeeTableCell>
                        <EmployeeTableCell>{employee.position || '-'}</EmployeeTableCell>
                        <EmployeeTableCell>
                          <div>
                            <div style={{ fontWeight: 500 }}>{employee.totalLeave || 0}일</div>
                            <div style={{ fontSize: '12px', color: category.color, marginTop: '2px' }}>
                              소진율 {usageRate.toFixed(1)}%
                            </div>
                          </div>
                        </EmployeeTableCell>
                        <EmployeeTableCell>{employee.adjustmentDetails || '-'}</EmployeeTableCell>
                        <EmployeeTableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenAdjustModal(employee)}
                          >
                            <Edit2 className="w-3 h-3" />
                            수정
                          </Button>
                        </EmployeeTableCell>
                      </EmployeeTableRow>
                    );
                  })}
                </tbody>
              </EmployeeTable>
            </EmployeeManagementCard>

            {/* 변경 로그 테이블 */}
            <LogCard>
              <LogCardHeader>
                <LogCardTitle>변경 로그</LogCardTitle>
                <LogCardDescription>
                  연차 변동 내역 및 처리 이력
                </LogCardDescription>
              </LogCardHeader>

              <LogTable>
                <LogTableHeader>
                  <tr>
                    <LogTableHeaderCell>일시</LogTableHeaderCell>
                    <LogTableHeaderCell>대상자</LogTableHeaderCell>
                    <LogTableHeaderCell>구분</LogTableHeaderCell>
                    <LogTableHeaderCell>변동</LogTableHeaderCell>
                    <LogTableHeaderCell>사유</LogTableHeaderCell>
                  </tr>
                </LogTableHeader>
                <tbody>
                  {leaveLogs.map((log) => (
                    <LogTableRow key={log.id}>
                      <LogTableCell>{log.date}</LogTableCell>
                      <LogTableCell style={{ fontWeight: 500 }}>{log.target}</LogTableCell>
                      <LogTableCell>
                        <span style={{ 
                          color: log.type === '포상' ? '#22c55e' : log.type === '징계' ? '#ef4444' : '#6E8FB3',
                          fontWeight: 500
                        }}>
                          {log.type}
                        </span>
                      </LogTableCell>
                      <LogTableCell>
                        <span style={{ 
                          color: log.changedDays > 0 ? '#22c55e' : '#ef4444',
                          fontWeight: 600
                        }}>
                          {log.changedDays > 0 ? '+' : ''}{log.changedDays}일
                        </span>
                      </LogTableCell>
                      <LogTableCell>{log.reason}</LogTableCell>
                    </LogTableRow>
                  ))}
                </tbody>
              </LogTable>
            </LogCard>
          </MiddleGridSection>
        </MainContent>

        {/* 연차 조정 모달 */}
        <Dialog open={isAdjustModalOpen} onOpenChange={setIsAdjustModalOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>연차 조정</DialogTitle>
              <DialogDescription>
                {selectedEmployee?.name}님의 연차를 조정하세요. (포상, 징계, 경력 인정)
              </DialogDescription>
            </DialogHeader>

            <ModalForm>
              <ModalFormGroup>
                <ModalFormLabel>
                  조정 일수 <span style={{ color: '#ef4444' }}>*</span>
                </ModalFormLabel>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <ModalFormInput
                    type="number"
                    value={adjustFormData.adjustment}
                    disabled={!adjustFormData.reason}
                    onChange={(e) => {
                      if (!adjustFormData.reason) return;
                      
                      const value = parseInt(e.target.value) || 0;
                      const newTotal = selectedEmployee ? selectedEmployee.totalLeave + value : 0;
                      
                      // 포상/경력인정: 0 이상만 허용
                      if ((adjustFormData.reason === '포상' || adjustFormData.reason === '경력인정') && value < 0) {
                        return;
                      }
                      
                      // 징계: 0 이하만 허용
                      if (adjustFormData.reason === '징계' && value > 0) {
                        return;
                      }
                      
                      // 총 연차가 0일 이하로 내려가지 않도록 제한
                      if (newTotal < 0) {
                        return;
                      }
                      
                      setAdjustFormData({ ...adjustFormData, adjustment: value });
                    }}
                    style={{ textAlign: 'center', flex: 1 }}
                  />
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={
                        !adjustFormData.reason ||
                        // 포상/경력인정: adjustment가 0 이하면 비활성화
                        ((adjustFormData.reason === '포상' || adjustFormData.reason === '경력인정') && adjustFormData.adjustment <= 0) ||
                        // 징계: 항상 활성화 (0 이하에서만 작동)
                        // 총 연차가 0일 이하로 내려가지 않도록 제한
                        (selectedEmployee && selectedEmployee.totalLeave + adjustFormData.adjustment <= 0)
                      }
                      onClick={() => {
                        if (!adjustFormData.reason) return;
                        
                        const newAdjustment = adjustFormData.adjustment - 1;
                        const newTotal = selectedEmployee ? selectedEmployee.totalLeave + newAdjustment : 0;
                        if (newTotal >= 0) {
                          setAdjustFormData({ ...adjustFormData, adjustment: newAdjustment });
                        }
                      }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={
                        !adjustFormData.reason ||
                        // 징계: adjustment가 0 이상이면 비활성화
                        (adjustFormData.reason === '징계' && adjustFormData.adjustment >= 0)
                      }
                      onClick={() => {
                        if (!adjustFormData.reason) return;
                        
                        const newAdjustment = adjustFormData.adjustment + 1;
                        // 징계일 경우 0을 넘지 않도록 제한
                        if (adjustFormData.reason === '징계' && newAdjustment > 0) {
                          return;
                        }
                        setAdjustFormData({ ...adjustFormData, adjustment: newAdjustment });
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <ModalFormHelperText>
                  현재 연차: {selectedEmployee?.totalLeave}일 → 조정 후: {selectedEmployee ? selectedEmployee.totalLeave + adjustFormData.adjustment : 0}일
                </ModalFormHelperText>
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalFormLabel>
                  사유 <span style={{ color: '#ef4444' }}>*</span>
                </ModalFormLabel>
                <ModalFormSelect
                  value={adjustFormData.reason}
                  onChange={(e) => {
                    // 사유 변경 시 조정 값 초기화
                    setAdjustFormData({ ...adjustFormData, reason: e.target.value, adjustment: 0 });
                  }}
                >
                  <option value="">선택하세요</option>
                  <option value="포상">포상</option>
                  <option value="징계">징계</option>
                  <option value="경력인정">경력 인정</option>
                </ModalFormSelect>
                <ModalFormHelperText>
                  연차 조정 사유를 선택하세요.
                </ModalFormHelperText>
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalFormLabel>상세 메모</ModalFormLabel>
                <ModalFormTextarea
                  value={adjustFormData.note}
                  onChange={(e) => setAdjustFormData({ ...adjustFormData, note: e.target.value })}
                  placeholder="상세 내용을 입력하세요... (예: 우수 사원 포상, 지각 누적 징계 등)"
                  rows={3}
                />
                <ModalFormHelperText>
                  포상 및 징계 내용을 상세히 기록하세요.
                </ModalFormHelperText>
              </ModalFormGroup>

              <ModalFormActions>
                <Button variant="outline" onClick={() => setIsAdjustModalOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleSaveAdjustment}>
                  <Save className="w-4 h-4" />
                  수정
                </Button>
              </ModalFormActions>
            </ModalForm>
          </DialogContent>
        </Dialog>

        {/* 기본 연차 설정 모달 */}
        <Dialog open={isPolicyModalOpen} onOpenChange={setIsPolicyModalOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>기본 연차 설정</DialogTitle>
              <DialogDescription>
                회사 전체 기본 연차 일수
              </DialogDescription>
            </DialogHeader>

            <ModalForm>
              <ModalFormGroup>
                <ModalFormLabel>기본 제공 연차 (일)</ModalFormLabel>
                <ModalFormInput
                  type="number"
                  min="0"
                  value={companyPolicy.defaultLeave}
                  onChange={(e) =>
                    setCompanyPolicy({
                      ...companyPolicy,
                      defaultLeave: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </ModalFormGroup>
              <TimeWeightedInfo>
                <Info className="w-4 h-4" />
                <span>{currentMonth}월 권장 소진율: {expectedUsageRate}%</span>
              </TimeWeightedInfo>
              <ModalFormActions>
                <Button variant="outline" onClick={() => setIsPolicyModalOpen(false)}>
                  취소
                </Button>
                <Button onClick={() => {
                  handleSavePolicy();
                  setIsPolicyModalOpen(false);
                }}>
                  <Save className="w-4 h-4" />
                  저장
                </Button>
              </ModalFormActions>
            </ModalForm>
          </DialogContent>
        </Dialog>

        {/* 직원 리스트 모달 (Dashboard.md에서 변환) */}
        {selectedBin && (
          <EmployeeListModalOverlay onClick={() => setSelectedBin(null)}>
            <EmployeeListModal onClick={(e) => e.stopPropagation()}>
              <EmployeeListModalHeader>
                <EmployeeListModalHeaderContent>
                  <EmployeeListModalTitle>직원 리스트</EmployeeListModalTitle>
                  <EmployeeListModalDescription>
                    소진율 <span style={{ fontWeight: theme.fonts.weight.bold, color: '#6366f1' }}>{selectedBin.rangeLabel}</span> 구간 
                    <span style={{ margin: `0 ${theme.spacing[2]}` }}>•</span> 
                    총 <span style={{ fontWeight: theme.fonts.weight.bold }}>{selectedBin.employees.length}명</span>
                  </EmployeeListModalDescription>
                </EmployeeListModalHeaderContent>
                <EmployeeListModalCloseButton onClick={() => setSelectedBin(null)}>
                  <X size={24} />
                </EmployeeListModalCloseButton>
              </EmployeeListModalHeader>
              
              <EmployeeListModalBody>
                {selectedBin.employees.length > 0 ? (
                  <EmployeeListGrid>
                    {selectedBin.employees.map((emp, i) => (
                      <EmployeeListItem key={i}>
                        <EmployeeListAvatar>
                          {emp.name.charAt(0)}
                        </EmployeeListAvatar>
                        <EmployeeListInfo>
                          <EmployeeListName>{emp.name}</EmployeeListName>
                          <EmployeeListRole>{emp.role}</EmployeeListRole>
                        </EmployeeListInfo>
                      </EmployeeListItem>
                    ))}
                  </EmployeeListGrid>
                ) : (
                  <EmployeeListEmpty>
                    해당 구간에 직원이 없습니다.
                  </EmployeeListEmpty>
                )}
              </EmployeeListModalBody>
              
              <EmployeeListModalFooter>
                <EmployeeListModalCloseButtonFooter onClick={() => setSelectedBin(null)}>
                  닫기
                </EmployeeListModalCloseButtonFooter>
              </EmployeeListModalFooter>
            </EmployeeListModal>
          </EmployeeListModalOverlay>
        )}
    </LeaveManagementBody>
  );
}
