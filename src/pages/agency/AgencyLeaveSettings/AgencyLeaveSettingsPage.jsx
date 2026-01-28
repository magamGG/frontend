import { useState, useEffect, useMemo } from 'react';
import theme from '@/styles/theme';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { toast } from 'sonner';
import { leaveService } from '@/api';
import useAuthStore from '@/store/authStore';
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

// 회사 연차 정책 초기값 가져오기
const getInitialCompanyPolicy = () => {
  const stored = localStorage.getItem('agencyLeavePolicy');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    defaultLeave: 15,
  };
};

// 직원 목록 초기값 가져오기
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

// 연차 변경 로그 초기값 가져오기
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
      color: '#DC2626', 
      description: '번아웃 위험',
      range: '0~30% 사용'
    };
  } else if (usageRate < 80) {
    return { 
      group: '적정군', 
      color: '#16A34A', 
      description: '안정',
      range: '30~80% 사용'
    };
  } else {
    const isEarlyYear = currentMonth <= 6;
    return { 
      group: '완료군', 
      color: '#2563EB', 
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
  [RiskCategory.BURNOUT_RISK]: 'var(--destructive)',
  [RiskCategory.HEALTHY]: 'var(--chart-2)',
  [RiskCategory.TURNOVER_RISK]: 'var(--destructive)',
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
                color: data.riskCategory === '적정군' ? '#16A34A' : data.riskCategory === '완료군' ? '#2563EB' : '#DC2626',
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
            color: 'var(--chart-2)',
            fontWeight: theme.fonts.weight.medium,
            background: 'color-mix(in srgb, var(--chart-2) 10%, transparent)',
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
  const [employeeList, setEmployeeList] = useState(getInitialEmployees);
  const [leaveLogList, setLeaveLogList] = useState(getInitialLeaveLogs);
  const [searchQueryInput, setSearchQueryInput] = useState('');
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustFormData, setAdjustFormData] = useState({
    adjustment: 0,
    reason: '',
    note: '',
  });
  const [selectedBinData, setSelectedBinData] = useState(null);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useAuthStore((state) => state.user);

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

  // 초기 데이터 로드
  useEffect(() => {
    const loadLeaveData = async () => {
      setIsLoading(true);
      try {
        // TODO: 실제 API 호출로 변경
        // const leaveSettingsData = await leaveService.getLeaveSettings();
        // const employeeListData = await leaveService.getLeaveStatistics();
        // setCompanyPolicy(leaveSettingsData);
        // setEmployeeList(employeeListData.employees || []);
        
        // 임시: localStorage에서 로드 (API 연동 전까지)
        const storedEmployees = localStorage.getItem('agencyEmployees');
        const storedPolicy = localStorage.getItem('agencyLeavePolicy');
        if (storedEmployees) {
          setEmployeeList(JSON.parse(storedEmployees));
        }
        if (storedPolicy) {
          setCompanyPolicy(JSON.parse(storedPolicy));
        }
      } catch (error) {
        console.error('Failed to load leave data:', error);
        toast.error('연차 데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaveData();
  }, []);

  // 데이터 변경 시 localStorage 저장 (API 연동 전까지 임시)
  useEffect(() => {
    localStorage.setItem('agencyEmployees', JSON.stringify(employeeList));
  }, [employeeList]);

  useEffect(() => {
    localStorage.setItem('agencyLeavePolicy', JSON.stringify(companyPolicy));
  }, [companyPolicy]);

  useEffect(() => {
    localStorage.setItem('agencyLeaveLogs', JSON.stringify(leaveLogList));
  }, [leaveLogList]);

  // 위험군별 통계 계산
  const calculateRiskStats = () => {
    const riskGroupStats = {
      위험군: { count: 0, employees: [] },
      적정군: { count: 0, employees: [] },
      완료군: { count: 0, employees: [] },
    };

    employeeList.forEach((employee) => {
      if (!employee) return;
      const category = categorizeRiskGroup(employee, currentMonth);
      riskGroupStats[category.group].count++;
      riskGroupStats[category.group].employees.push(employee);
    });

    return riskGroupStats;
  };

  const riskStats = calculateRiskStats();

  // 연차 소진 분포도 차트 데이터 (Dashboard.md에서 변환)
  const { distributionChartData, distributionMean, distributionStdDev, maxYValue } = useMemo(() => {
    // 1. 개별 통계 분석
    const analyzedEmployeeList = employeeList.map((employee) => {
      const usagePercentage = calculateUsageRate(employee);
      const category = categorizeRiskGroup(employee, currentMonth);
      return {
        ...employee,
        usagePercentage,
        category: category.group, // 위험군, 적정군, 완료군
        categoryColor: category.color, // 색상
      };
    });

    const sum = analyzedEmployeeList.reduce((acc, curr) => acc + curr.usagePercentage, 0);
    const avg = sum / (analyzedEmployeeList.length || 1);
    const variance = analyzedEmployeeList.reduce((acc, curr) => acc + Math.pow(curr.usagePercentage - avg, 2), 0) / analyzedEmployeeList.length;
    const sd = Math.sqrt(variance);

    // 2. 5% 구간별로 데이터 그룹화
    const binSize = 5;
    const bins = [];

    for (let i = 0; i < 100; i += binSize) {
      const min = i;
      const max = i + binSize;
      const mid = (min + max) / 2;
      
      // 해당 구간의 직원 필터링
      const employeesInBin = analyzedEmployeeList.filter((employee) => employee.usagePercentage >= min && employee.usagePercentage < max);
      
      // 구간의 대표 위험 카테고리 결정 (구간 중간값 기준)
      // 위험군: 0~30% → 빨간색, 적정군: 30~80% → 초록색, 완료군: 80~100% → 파란색
      let fillColor = '#16A34A'; // 기본값: 초록색 (적정군)
      if (mid < 30) {
        fillColor = '#DC2626'; // 빨간색 (위험군 - 연차 소진율 낮음)
      } else if (mid >= 80) {
        fillColor = '#2563EB'; // 파란색 (완료군)
      } else {
        fillColor = '#16A34A'; // 초록색 (적정군 - 안정권)
      }

      bins.push({
        x: mid, // 구간 중간값
        y: employeesInBin.length, // 인원 수
        rangeLabel: `${min}% - ${max}%`,
        employees: employeesInBin.map((employee) => ({ name: employee.name, role: employee.position || '직무 없음' })),
        riskCategory: mid < 30 ? '위험군' : mid >= 80 ? '완료군' : '적정군',
        fill: fillColor,
      });
    }

    const maxBinCount = Math.max(...bins.map((bin) => bin.y), 1); // 최소값 1로 설정

    return { 
      distributionChartData: bins, 
      distributionMean: avg, 
      distributionStdDev: sd,
      maxCount: maxBinCount,
      maxYValue: maxBinCount
    };
  }, [employeeList, currentMonth]);

  // 위험군 통계 계산 (차트와 동일한 로직 사용)
  const distributionStats = useMemo(() => {
    const analyzedEmployeeList = employeeList.map((employee) => {
      const category = categorizeRiskGroup(employee, currentMonth);
      return category.group; // '위험군', '적정군', '완료군'
    });
    const burnoutRiskCount = analyzedEmployeeList.filter((category) => category === '위험군').length;
    const turnoverRiskCount = analyzedEmployeeList.filter((category) => category === '완료군').length;
    return { 
      burnout: burnoutRiskCount, // 번아웃 위험군 (사용 저조) = 위험군
      turnover: turnoverRiskCount // 이탈 위험군 (과다 사용) = 완료군
    };
  }, [employeeList, currentMonth]);

  // 정책 저장
  const handleSavePolicy = async () => {
    if (companyPolicy.defaultLeave < 0) {
      toast.error('기본 연차 수는 0 이상이어야 합니다.');
      return;
    }
    
    try {
      // TODO: 실제 API 호출로 변경
      // await leaveService.updateLeaveSettings(companyPolicy);
      localStorage.setItem('agencyLeavePolicy', JSON.stringify(companyPolicy));
      toast.success('회사 연차 정책이 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save policy:', error);
      toast.error('정책 저장에 실패했습니다.');
    }
  };

  // 연차 조정 모달 열기
  const handleOpenAdjustModal = (employeeData) => {
    setSelectedEmployeeData(employeeData);
    setAdjustFormData({
      adjustment: 0,
      reason: '',
      note: '',
    });
    setIsAdjustModalOpen(true);
  };

  // 연차 조정 저장
  const handleSaveAdjustment = async () => {
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

    const newTotalLeave = selectedEmployeeData.totalLeave + adjustFormData.adjustment;
    if (newTotalLeave < 0) {
      toast.error('총 연차는 0 이상이어야 합니다.');
      return;
    }

    const newRemainingLeave = newTotalLeave - selectedEmployeeData.usedLeave;

    try {
      // TODO: 실제 API 호출로 변경
      // 가이드 문서에 따른 변수명: memberNo 사용
      // await leaveService.adjustLeave(selectedEmployeeData.memberNo, {
      //   adjustment: adjustFormData.adjustment,
      //   reason: adjustFormData.reason,
      //   note: adjustFormData.note,
      // });

      // 직원 데이터 업데이트
      const updatedEmployeeList = employeeList.map((employee) =>
        employee.id === selectedEmployeeData.id
          ? {
              ...employee,
              totalLeave: newTotalLeave,
              remainingLeave: newRemainingLeave >= 0 ? newRemainingLeave : 0,
              adjustmentDetails: adjustFormData.reason,
            }
          : employee
      );
      setEmployeeList(updatedEmployeeList);

      // 로그 추가
      const newLogEntry = {
        id: Date.now(),
        date: new Date().toLocaleString('ko-KR', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        target: selectedEmployeeData.name,
        type: adjustFormData.reason === '포상' ? '포상' : adjustFormData.reason === '징계' ? '징계' : '경력인정',
        changedDays: Math.abs(adjustFormData.adjustment),
        reason: adjustFormData.note || adjustFormData.reason,
        processor: currentUser?.memberName || '관리자',
      };
      setLeaveLogList([newLogEntry, ...leaveLogList]);

      toast.success(`${selectedEmployeeData.name}님의 연차가 조정되었습니다.`);
      setIsAdjustModalOpen(false);
      setSelectedEmployeeData(null);
    } catch (error) {
      console.error('Failed to adjust leave:', error);
      toast.error('연차 조정에 실패했습니다.');
    }
  };

  // 필터링된 직원 목록
  const filteredEmployeeList = employeeList.filter((employee) => {
    if (!employee) return false;
    const employeeName = employee.name || '';
    const employeePosition = employee.position || '';
    const searchQueryLower = searchQueryInput.toLowerCase();
    return employeeName.toLowerCase().includes(searchQueryLower) || employeePosition.toLowerCase().includes(searchQueryLower);
  });

  // 휴가 독려 알림 보내기 (번아웃 위험군에게)
  const handleSendEncouragement = async () => {
    // 가이드 문서에 따른 변수명: memberNos 사용
    const burnoutRiskEmployeeList = riskStats.위험군.employees
      .filter((employee) => employee && employee.name)
      .map((employee) => employee.memberNo || employee.id); // memberNo 우선, 없으면 id 사용
    
    if (burnoutRiskEmployeeList.length === 0) {
      toast.info('번아웃 위험군이 없습니다.');
      return;
    }
    
    try {
      // TODO: 실제 알림 전송 API 호출
      // await leaveService.sendEncouragementNotification(burnoutRiskEmployeeList);
      const employeeNameList = riskStats.위험군.employees
        .filter((employee) => employee && employee.name)
        .map((employee) => employee.name);
      toast.success(`휴가 독려 알림이 ${burnoutRiskEmployeeList.length}명에게 전송되었습니다. (${employeeNameList.join(', ')})`);
    } catch (error) {
      console.error('Failed to send encouragement notification:', error);
      toast.error('알림 전송에 실패했습니다.');
    }
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
              borderColor: 'var(--border)',
              backgroundColor: 'var(--card)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--muted)';
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--card)';
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
                    전체 인원({employeeList.length}명)을 5% 구간별로 그룹화하여 분포를 시각화했습니다.<br/>
                    <span style={{ fontSize: theme.fonts.size.xs, color: 'var(--muted-foreground)' }}>
                      포인트를 클릭하면 해당 구간의 전체 직원 리스트를 확인할 수 있습니다.
                    </span>
                  </DistributionChartDescription>
                </DistributionChartHeaderContent>
                <DistributionChartLegend>
                  <LegendItem $bgColor="#FEE2E2" $borderColor="#FECACA" $textColor="#DC2626">
                    <LegendDot $color="#DC2626" />
                    <span>위험군 (0~30%)</span>
                  </LegendItem>
                  <LegendItem $bgColor="#DCFCE7" $borderColor="#BBF7D0" $textColor="#16A34A">
                    <LegendDot $color="#16A34A" />
                    <span>적정군 (30~80%)</span>
                  </LegendItem>
                  <LegendItem $bgColor="#DBEAFE" $borderColor="#BFDBFE" $textColor="#2563EB">
                    <LegendDot $color="#2563EB" />
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
                      {/* ReferenceArea는 Recharts에서 CSS 변수를 직접 사용할 수 없으므로 하드코딩 유지 */}
                      <ReferenceArea 
                        x1={0} 
                        x2={30} 
                        y1={0} 
                        y2={maxYValue + 1} 
                        fill="#FEE2E2" 
                        fillOpacity={0.5}
                        stroke="none"
                        ifOverflow="visible"
                      />
                      <ReferenceArea 
                        x1={30} 
                        x2={80} 
                        y1={0} 
                        y2={maxYValue + 1} 
                        fill="#DCFCE7" 
                        fillOpacity={0.5}
                        stroke="none"
                        ifOverflow="visible"
                      />
                      <ReferenceArea 
                        x1={80} 
                        x2={100} 
                        y1={0} 
                        y2={maxYValue + 1} 
                        fill="#DBEAFE" 
                        fillOpacity={0.5}
                        stroke="none"
                        ifOverflow="visible"
                      />
                      
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis 
                      dataKey="x" 
                      type="number" 
                      domain={[0, 100]} 
                      tickCount={11}
                      label={{ value: '연차 소진율 (%)', position: 'insideBottom', offset: -10, fontSize: 12, fill: 'var(--muted-foreground)' }} 
                    />
                    <YAxis 
                      dataKey="y"
                      domain={[0, 'dataMax + 1']}
                      allowDecimals={false}
                      tickFormatter={(value) => Math.floor(value)}
                      label={{ value: '인원 수 (명)', angle: -90, position: 'insideLeft', fontSize: 12, fill: 'var(--muted-foreground)' }} 
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    
                    {/* 평균선 */}
                    <ReferenceLine x={distributionMean} stroke="#16A34A" strokeDasharray="3 3" label={{ value: '평균', position: 'top', fill: '#16A34A', fontSize: 12 }} />

                    {/* 연결선 (트렌드 표시) */}
                    <Line 
                      data={distributionChartData} 
                      dataKey="y" 
                      stroke="var(--border)" 
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
                      onClick={(data) => setSelectedBinData(data.payload)}
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
              <StatCard $bgColor="#FEE2E2" $borderColor="#FECACA">
                <StatCardHeader>
                  <StatCardIcon style={{ border: '1px solid #DC2626' }}>
                    <AlertTriangle size={20} color="#DC2626" />
                  </StatCardIcon>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                    <StatCardTitle $textColor="#DC2626">번아웃 위험군 (사용 저조)</StatCardTitle>
                    {distributionStats.burnout > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSendEncouragement}
                        style={{ 
                          backgroundColor: '#FEE2E2',
                          borderColor: '#DC2626',
                          color: '#DC2626',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FECACA';
                          e.currentTarget.style.opacity = '0.9';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FEE2E2';
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

              <StatCard $bgColor="#DBEAFE" $borderColor="#BFDBFE">
                <StatCardHeader>
                  <StatCardIcon style={{ border: '1px solid #2563EB' }}>
                    <TrendingUp size={20} color="#2563EB" />
                  </StatCardIcon>
                  <StatCardTitle $textColor="#1E40AF">이탈 위험군 (과다 사용)</StatCardTitle>
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
                    <StatCardStatValue $color="var(--chart-2)">{distributionMean.toFixed(1)}%</StatCardStatValue>
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
                  value={searchQueryInput}
                  onChange={(e) => setSearchQueryInput(e.target.value)}
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
                  {filteredEmployeeList.map((employee) => {
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
                    <LogTableHeaderCell>사유</LogTableHeaderCell>
                    <LogTableHeaderCell>변동</LogTableHeaderCell>
                    <LogTableHeaderCell>상세 메모</LogTableHeaderCell>
                  </tr>
                </LogTableHeader>
                <tbody>
                  {leaveLogList.map((logEntry) => (
                    <LogTableRow key={logEntry.id}>
                      <LogTableCell>{logEntry.date}</LogTableCell>
                      <LogTableCell style={{ fontWeight: 500 }}>{logEntry.target}</LogTableCell>
                      <LogTableCell>
                        <span style={{ 
                          color: logEntry.type === '포상' ? 'var(--chart-2)' : logEntry.type === '징계' ? 'var(--destructive)' : 'var(--accent)',
                          fontWeight: 500
                        }}>
                          {logEntry.type}
                        </span>
                      </LogTableCell>
                      <LogTableCell>
                        <span style={{ 
                          color: logEntry.changedDays > 0 ? 'var(--chart-2)' : 'var(--destructive)',
                          fontWeight: 600
                        }}>
                          {logEntry.changedDays > 0 ? '+' : ''}{logEntry.changedDays}일
                        </span>
                      </LogTableCell>
                      <LogTableCell>{logEntry.reason}</LogTableCell>
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
                {selectedEmployeeData?.name}님의 연차를 조정하세요. (포상, 징계, 경력 인정)
              </DialogDescription>
            </DialogHeader>

            <ModalForm>
              <ModalFormGroup>
                <ModalFormLabel>
                  조정 일수 <span style={{ color: 'var(--destructive)' }}>*</span>
                </ModalFormLabel>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <ModalFormInput
                    type="number"
                    value={adjustFormData.adjustment}
                    disabled={!adjustFormData.reason}
                    onChange={(e) => {
                      if (!adjustFormData.reason) return;
                      
                      const value = parseInt(e.target.value) || 0;
                      const newTotal = selectedEmployeeData ? selectedEmployeeData.totalLeave + value : 0;
                      
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
                        (selectedEmployeeData && selectedEmployeeData.totalLeave + adjustFormData.adjustment <= 0)
                      }
                      onClick={() => {
                        if (!adjustFormData.reason) return;
                        
                        const newAdjustment = adjustFormData.adjustment - 1;
                        const newTotal = selectedEmployeeData ? selectedEmployeeData.totalLeave + newAdjustment : 0;
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
                  현재 연차: {selectedEmployeeData?.totalLeave}일 → 조정 후: {selectedEmployeeData ? selectedEmployeeData.totalLeave + adjustFormData.adjustment : 0}일
                </ModalFormHelperText>
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalFormLabel>
                  사유 <span style={{ color: 'var(--destructive)' }}>*</span>
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
        {selectedBinData && (
          <EmployeeListModalOverlay onClick={() => setSelectedBinData(null)}>
            <EmployeeListModal onClick={(e) => e.stopPropagation()}>
              <EmployeeListModalHeader>
                <EmployeeListModalHeaderContent>
                  <EmployeeListModalTitle>직원 리스트</EmployeeListModalTitle>
                  <EmployeeListModalDescription>
                    소진율 <span style={{ fontWeight: theme.fonts.weight.bold, color: 'var(--chart-2)' }}>{selectedBinData.rangeLabel}</span> 구간 
                    <span style={{ margin: `0 ${theme.spacing[2]}` }}>•</span> 
                    총 <span style={{ fontWeight: theme.fonts.weight.bold }}>{selectedBinData.employees.length}명</span>
                  </EmployeeListModalDescription>
                </EmployeeListModalHeaderContent>
                <EmployeeListModalCloseButton onClick={() => setSelectedBinData(null)}>
                  <X size={24} />
                </EmployeeListModalCloseButton>
              </EmployeeListModalHeader>
              
              <EmployeeListModalBody>
                {selectedBinData.employees.length > 0 ? (
                  <EmployeeListGrid>
                    {selectedBinData.employees.map((employee, index) => (
                      <EmployeeListItem key={index}>
                        <EmployeeListAvatar>
                          {employee.name.charAt(0)}
                        </EmployeeListAvatar>
                        <EmployeeListInfo>
                          <EmployeeListName>{employee.name}</EmployeeListName>
                          <EmployeeListRole>{employee.role}</EmployeeListRole>
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
                <EmployeeListModalCloseButtonFooter onClick={() => setSelectedBinData(null)}>
                  닫기
                </EmployeeListModalCloseButtonFooter>
              </EmployeeListModalFooter>
            </EmployeeListModal>
          </EmployeeListModalOverlay>
        )}
    </LeaveManagementBody>
  );
}
