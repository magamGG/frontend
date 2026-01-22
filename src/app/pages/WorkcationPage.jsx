import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Palmtree, MapPin, Calendar, Plus } from 'lucide-react';

/**
 * WorkcationPage component
 */
export function WorkcationPage() {
  return (
    <div className="w-full h-full">
      <div className="pb-24 px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Header */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">워케이션 모드</h2>
                <p className="text-sm text-muted-foreground">
                  새로운 환경에서 창의력을 발휘하고 재충전하세요
                </p>
              </div>
              <Button>
                <Palmtree className="w-4 h-4 mr-2" />
                워케이션 시작하기
              </Button>
            </div>
          </Card>

          {/* Current Workcation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
            <Card className="lg:col-span-2 p-4 overflow-hidden">
              <h3 className="text-base font-semibold text-foreground mb-3">진행 중인 워케이션</h3>
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-foreground mb-1">제주도 워케이션</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>제주시 애월읍</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>2026.01.10 - 01.20</span>
                      </div>
                    </div>
                  </div>
                  <Badge>진행중</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center p-2 bg-card rounded">
                    <p className="text-xs text-muted-foreground mb-0.5">경과 일수</p>
                    <p className="text-xl font-bold text-foreground">3일</p>
                  </div>
                  <div className="text-center p-2 bg-card rounded">
                    <p className="text-xs text-muted-foreground mb-0.5">남은 일수</p>
                    <p className="text-xl font-bold text-foreground">7일</p>
                  </div>
                  <div className="text-center p-2 bg-card rounded">
                    <p className="text-xs text-muted-foreground mb-0.5">작업 완료</p>
                    <p className="text-xl font-bold text-primary">5개</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">일정 수정</Button>
                  <Button variant="destructive" size="sm" className="flex-1">조기 종료</Button>
                </div>
              </div>
            </Card>

            <Card className="p-4 overflow-hidden">
              <h3 className="text-base font-semibold text-foreground mb-3">워케이션 팁</h3>
              <div className="space-y-2">
                <div className="p-3 bg-primary/10 rounded">
                  <h4 className="text-sm font-semibold text-foreground mb-1">🌅 아침 루틴</h4>
                  <p className="text-xs text-muted-foreground">
                    새로운 환경에서 규칙적인 아침 루틴을 유지하세요
                  </p>
                </div>
                <div className="p-3 bg-secondary/10 rounded">
                  <h4 className="text-sm font-semibold text-foreground mb-1">⏰ 업무 시간</h4>
                  <p className="text-xs text-muted-foreground">
                    명확한 업무 시간을 설정하고 지키세요
                  </p>
                </div>
                <div className="p-3 bg-accent/10 rounded">
                  <h4 className="text-sm font-semibold text-foreground mb-1">🎨 로컬 경험</h4>
                  <p className="text-xs text-muted-foreground">
                    지역 문화를 경험하며 창의력을 충전하세요
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Past Workcations */}
          <Card className="p-4 flex-shrink-0">
            <h3 className="text-base font-semibold text-foreground mb-3">지난 워케이션</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-muted/30 rounded border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-3 h-3 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">강릉 워케이션</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-1">2025.12.01 - 12.15</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">생산성: 92%</span>
                  <span className="text-muted-foreground">완료: 12개</span>
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-3 h-3 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">부산 워케이션</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-1">2025.11.10 - 11.20</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">생산성: 88%</span>
                  <span className="text-muted-foreground">완료: 9개</span>
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-3 h-3 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">전주 워케이션</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-1">2025.10.15 - 10.25</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">생산성: 85%</span>
                  <span className="text-muted-foreground">완료: 8개</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}