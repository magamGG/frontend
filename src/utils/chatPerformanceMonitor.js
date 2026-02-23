/**
 * 채팅 시스템 성능 모니터링 유틸리티
 * 메모리 사용량, API 응답 시간, WebSocket 연결 상태 등을 모니터링
 */

class ChatPerformanceMonitor {
  constructor() {
    this.metrics = {
      apiCalls: new Map(), // API 호출 통계
      websocketEvents: new Map(), // WebSocket 이벤트 통계
      memoryUsage: [], // 메모리 사용량 히스토리
      renderTimes: [], // 렌더링 시간 히스토리
    };
    
    this.isEnabled = process.env.NODE_ENV === 'development';
    this.maxHistorySize = 100; // 최대 히스토리 크기
  }

  // API 호출 시작 시간 기록
  startApiCall(endpoint, params = {}) {
    if (!this.isEnabled) return null;
    
    const callId = `${endpoint}_${Date.now()}_${Math.random()}`;
    const startTime = performance.now();
    
    this.metrics.apiCalls.set(callId, {
      endpoint,
      params,
      startTime,
      status: 'pending'
    });
    
    return callId;
  }

  // API 호출 완료 시간 기록
  endApiCall(callId, success = true, error = null) {
    if (!this.isEnabled || !callId) return;
    
    const call = this.metrics.apiCalls.get(callId);
    if (!call) return;
    
    const endTime = performance.now();
    const duration = endTime - call.startTime;
    
    call.endTime = endTime;
    call.duration = duration;
    call.status = success ? 'success' : 'error';
    call.error = error;
    
    // 성능 경고 (2초 이상 걸린 API 호출)
    if (duration > 2000) {
      console.warn(`⚠️ [성능] 느린 API 호출 감지: ${call.endpoint} (${duration.toFixed(2)}ms)`);
    }
    
    // 히스토리 크기 제한
    if (this.metrics.apiCalls.size > this.maxHistorySize) {
      const oldestKey = this.metrics.apiCalls.keys().next().value;
      this.metrics.apiCalls.delete(oldestKey);
    }
  }

  // WebSocket 이벤트 기록
  recordWebSocketEvent(eventType, data = {}) {
    if (!this.isEnabled) return;
    
    const timestamp = Date.now();
    const eventId = `${eventType}_${timestamp}_${Math.random()}`;
    
    this.metrics.websocketEvents.set(eventId, {
      eventType,
      timestamp,
      data
    });
    
    // 히스토리 크기 제한
    if (this.metrics.websocketEvents.size > this.maxHistorySize) {
      const oldestKey = this.metrics.websocketEvents.keys().next().value;
      this.metrics.websocketEvents.delete(oldestKey);
    }
  }

  // 메모리 사용량 기록
  recordMemoryUsage() {
    if (!this.isEnabled || !performance.memory) return;
    
    const memoryInfo = {
      timestamp: Date.now(),
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    };
    
    this.metrics.memoryUsage.push(memoryInfo);
    
    // 히스토리 크기 제한
    if (this.metrics.memoryUsage.length > this.maxHistorySize) {
      this.metrics.memoryUsage.shift();
    }
    
    // 메모리 사용량 경고 (80% 이상)
    const usagePercent = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
    if (usagePercent > 80) {
      console.warn(`⚠️ [성능] 높은 메모리 사용량: ${usagePercent.toFixed(1)}%`);
    }
  }

  // 렌더링 시간 기록
  recordRenderTime(componentName, duration) {
    if (!this.isEnabled) return;
    
    this.metrics.renderTimes.push({
      componentName,
      duration,
      timestamp: Date.now()
    });
    
    // 히스토리 크기 제한
    if (this.metrics.renderTimes.length > this.maxHistorySize) {
      this.metrics.renderTimes.shift();
    }
    
    // 렌더링 시간 경고 (100ms 이상)
    if (duration > 100) {
      console.warn(`⚠️ [성능] 느린 렌더링: ${componentName} (${duration.toFixed(2)}ms)`);
    }
  }

  // 성능 리포트 생성
  generateReport() {
    if (!this.isEnabled) return null;
    
    const now = Date.now();
    const last5Minutes = now - 5 * 60 * 1000;
    
    // 최근 5분간의 API 호출 통계
    const recentApiCalls = Array.from(this.metrics.apiCalls.values())
      .filter(call => call.startTime && (call.startTime + performance.timeOrigin) > last5Minutes);
    
    const apiStats = {
      total: recentApiCalls.length,
      success: recentApiCalls.filter(call => call.status === 'success').length,
      error: recentApiCalls.filter(call => call.status === 'error').length,
      avgDuration: recentApiCalls.length > 0 
        ? recentApiCalls.reduce((sum, call) => sum + (call.duration || 0), 0) / recentApiCalls.length 
        : 0
    };
    
    // 최근 5분간의 WebSocket 이벤트 통계
    const recentWsEvents = Array.from(this.metrics.websocketEvents.values())
      .filter(event => event.timestamp > last5Minutes);
    
    const wsStats = {
      total: recentWsEvents.length,
      byType: recentWsEvents.reduce((acc, event) => {
        acc[event.eventType] = (acc[event.eventType] || 0) + 1;
        return acc;
      }, {})
    };
    
    // 최근 메모리 사용량
    const recentMemory = this.metrics.memoryUsage
      .filter(mem => mem.timestamp > last5Minutes);
    
    const memoryStats = recentMemory.length > 0 ? {
      current: recentMemory[recentMemory.length - 1],
      peak: recentMemory.reduce((max, mem) => 
        mem.usedJSHeapSize > max.usedJSHeapSize ? mem : max, recentMemory[0])
    } : null;
    
    // 최근 렌더링 통계
    const recentRenders = this.metrics.renderTimes
      .filter(render => render.timestamp > last5Minutes);
    
    const renderStats = {
      total: recentRenders.length,
      avgDuration: recentRenders.length > 0
        ? recentRenders.reduce((sum, render) => sum + render.duration, 0) / recentRenders.length
        : 0,
      slowRenders: recentRenders.filter(render => render.duration > 100).length
    };
    
    return {
      timestamp: now,
      period: '최근 5분',
      api: apiStats,
      websocket: wsStats,
      memory: memoryStats,
      rendering: renderStats
    };
  }

  // 콘솔에 성능 리포트 출력
  logReport() {
    const report = this.generateReport();
    if (!report) return;
    
    console.group('📊 [성능 리포트] ' + new Date().toLocaleTimeString());
    
    console.log('🌐 API 호출:', {
      '총 호출': report.api.total,
      '성공': report.api.success,
      '실패': report.api.error,
      '평균 응답시간': `${report.api.avgDuration.toFixed(2)}ms`
    });
    
    console.log('🔌 WebSocket:', {
      '총 이벤트': report.websocket.total,
      '이벤트별': report.websocket.byType
    });
    
    if (report.memory) {
      const currentUsage = (report.memory.current.usedJSHeapSize / 1024 / 1024).toFixed(2);
      const peakUsage = (report.memory.peak.usedJSHeapSize / 1024 / 1024).toFixed(2);
      console.log('💾 메모리:', {
        '현재 사용량': `${currentUsage}MB`,
        '최대 사용량': `${peakUsage}MB`
      });
    }
    
    console.log('🎨 렌더링:', {
      '총 렌더링': report.rendering.total,
      '평균 시간': `${report.rendering.avgDuration.toFixed(2)}ms`,
      '느린 렌더링': report.rendering.slowRenders
    });
    
    console.groupEnd();
  }

  // 자동 모니터링 시작
  startAutoMonitoring(interval = 60000) { // 기본 1분 간격
    if (!this.isEnabled) return;
    
    this.monitoringInterval = setInterval(() => {
      this.recordMemoryUsage();
      this.logReport();
    }, interval);
    
    console.log('🚀 [성능 모니터링] 자동 모니터링 시작');
  }

  // 자동 모니터링 중지
  stopAutoMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('⏹️ [성능 모니터링] 자동 모니터링 중지');
    }
  }

  // 모든 메트릭 초기화
  reset() {
    this.metrics.apiCalls.clear();
    this.metrics.websocketEvents.clear();
    this.metrics.memoryUsage = [];
    this.metrics.renderTimes = [];
    console.log('🔄 [성능 모니터링] 메트릭 초기화 완료');
  }
}

// 싱글톤 인스턴스 생성
const chatPerformanceMonitor = new ChatPerformanceMonitor();

export default chatPerformanceMonitor;