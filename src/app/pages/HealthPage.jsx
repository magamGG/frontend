import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Heart, Activity, Moon, TrendingUp, AlertTriangle } from 'lucide-react';

/**
 * HealthPage component
 */
export function HealthPage() {
  return (
    <div className="w-full h-full">
      <div className="pb-24 px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Moon className="w-3 h-3 text-primary" />
                <span className="text-xs text-muted-foreground">수면 시간</span>
              </div>
              <p className="text-2xl font-bold text-foreground">7.2시간</p>
              <p className="text-xs text-muted-foreground mt-0.5">평균</p>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3 h-3 text-primary" />
                <span className="text-xs text-muted-foreground">손목 통증</span>
              </div>
              <p className="text-2xl font-bold text-foreground">3/10</p>
              <p className="text-xs text-muted-foreground mt-0.5">낮음</p>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-3 h-3 text-destructive" />
                <span className="text-xs text-muted-foreground">번아웃 지수</span>
              </div>
              <p className="text-2xl font-bold text-foreground">25%</p>
              <p className="text-xs text-muted-foreground mt-0.5">양호</p>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-3 h-3 text-secondary" />
                <span className="text-xs text-muted-foreground">스트레스</span>
              </div>
              <p className="text-2xl font-bold text-foreground">4/10</p>
              <p className="text-xs text-muted-foreground mt-0.5">보통</p>
            </Card>
          </div>

          {/* Weekly Health Chart */}
          <Card className="p-4 flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-foreground">주간 건강 추이</h3>
              <Button size="sm">건강 데이터 입력</Button>
            </div>

            <div className="space-y-3">
              {['월', '화', '수', '목', '금', '토', '일'].map((day, idx) => (
                <div key={day}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground w-6">{day}</span>
                    <div className="flex-1 mx-3">
                      <Progress value={70 + idx * 5} className="h-2" />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {70 + idx * 5}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Health Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-shrink-0">
            <Card className="p-4">
              <h3 className="text-base font-semibold text-foreground mb-3">건강 권장사항</h3>
              <div className="space-y-2">
                <div className="p-3 bg-primary/10 rounded">
                  <div className="flex items-start gap-2">
                    <Moon className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-0.5">충분한 수면</h4>
                      <p className="text-xs text-muted-foreground">
                        매일 7-8시간의 수면을 취하세요.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-secondary/10 rounded">
                  <div className="flex items-start gap-2">
                    <Activity className="w-4 h-4 text-secondary mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-0.5">스트레칭</h4>
                      <p className="text-xs text-muted-foreground">
                        매시간 10분씩 손목과 어깨 스트레칭을 하세요.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-accent/10 rounded">
                  <div className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-accent mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-0.5">정기 휴식</h4>
                      <p className="text-xs text-muted-foreground">
                        20분마다 20초간 먼 곳을 바라보세요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-base font-semibold text-foreground mb-3">최근 건강 기록</h3>
              <div className="space-y-2">
                {[
                  { date: '2026.01.13', sleep: '7.5시간', pain: '3/10', burnout: '25%' },
                  { date: '2026.01.12', sleep: '6.8시간', pain: '4/10', burnout: '30%' },
                  { date: '2026.01.11', sleep: '7.2시간', pain: '3/10', burnout: '28%' },
                  { date: '2026.01.10', sleep: '8.0시간', pain: '2/10', burnout: '20%' },
                ].map((record, idx) => (
                  <div key={idx} className="p-2 bg-muted/30 rounded border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{record.date}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div>
                        <span className="text-muted-foreground">수면: </span>
                        <span className="font-medium text-foreground">{record.sleep}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">통증: </span>
                        <span className="font-medium text-foreground">{record.pain}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">번아웃: </span>
                        <span className="font-medium text-foreground">{record.burnout}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}