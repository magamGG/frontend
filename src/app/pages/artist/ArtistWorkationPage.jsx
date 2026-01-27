import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { MapPin, Calendar, CheckCircle2, Circle } from 'lucide-react';

export function ArtistWorkationPage() {
  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar">
      <div className="pb-24 px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">워케이션</h1>
            <p className="text-sm text-muted-foreground mt-1">새로운 환경에서 창의력을 발휘하고 재충전하세요</p>
          </div>

          {/* Current Workcation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">진행 중인 워케이션</h3>
              <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-purple-900 mb-2">제주도 워케이션</h4>
                    <div className="flex items-center gap-4 text-sm text-purple-700">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>제주특별자치도 서귀포시</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>2026.01.20 - 01.27</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-purple-600">진행중</Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">경과 일수</p>
                    <p className="text-2xl font-bold text-foreground">2일</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">남은 일수</p>
                    <p className="text-2xl font-bold text-foreground">5일</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">완료 작업</p>
                    <p className="text-2xl font-bold text-primary">3개</p>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-100">
                    일정 수정
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1">
                    조기 종료
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">숙소 정보</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">숙소명</label>
                  <p className="text-sm text-foreground">중문 리조트</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">주소</label>
                  <p className="text-sm text-foreground">제주특별자치도 서귀포시 중문동 123-45</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">객실</label>
                  <p className="text-sm text-foreground">303호</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">연락처</label>
                  <p className="text-sm text-foreground">064-123-4567</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tasks During Workation */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">워케이션 기간 할 일</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1 line-through">신작 캐릭터 디자인 초안</h4>
                  <p className="text-sm text-muted-foreground">주인공 및 주요 캐릭터 3명 디자인 완료</p>
                  <p className="text-xs text-green-600 mt-1">완료일: 2026.01.21</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1 line-through">스토리 개요 작성</h4>
                  <p className="text-sm text-muted-foreground">전체 스토리 아크 및 주요 에피소드 정리</p>
                  <p className="text-xs text-green-600 mt-1">완료일: 2026.01.22</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                <Circle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground">세계관 설정</h4>
                    <Badge className="bg-blue-600 text-xs">진행중</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">배경 설정, 세계관 상세 기획</p>
                  <p className="text-xs text-blue-600 mt-1">마감: 2026.01.24</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border">
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">에피소드 1-3 스케치</h4>
                  <p className="text-sm text-muted-foreground">첫 3개 에피소드 러프 스케치</p>
                  <p className="text-xs text-muted-foreground mt-1">마감: 2026.01.26</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border">
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">레퍼런스 수집</h4>
                  <p className="text-sm text-muted-foreground">배경 및 소품 레퍼런스 정리</p>
                  <p className="text-xs text-muted-foreground mt-1">마감: 2026.01.27</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
