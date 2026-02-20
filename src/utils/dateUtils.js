/**
 * 백엔드에서 오는 LocalDateTime 배열을 Date 객체로 변환
 * @param {string|Array<number>|Date} dateValue - 날짜 값 (문자열, 배열, 또는 Date 객체)
 * @returns {Date|null} - 파싱된 Date 객체 또는 null
 */
export function parseBackendDate(dateValue) {
  if (!dateValue) {
    return null;
  }
  
  // 이미 Date 객체인 경우
  if (dateValue instanceof Date) {
    return isNaN(dateValue.getTime()) ? null : dateValue;
  }
  
  // 배열 형태인 경우 (LocalDateTime 직렬화: [년, 월(1-based), 일, 시, 분, 초] — Java getMonthValue()는 1~12)
  if (Array.isArray(dateValue)) {
    if (dateValue.length < 3) {
      return null;
    }
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateValue;
    // JS Date는 월이 0-based(0=1월) → 백엔드 1-based 월에서 1 빼기
    const date = new Date(year, month - 1, day, hour, minute, second);
    return isNaN(date.getTime()) ? null : date;
  }
  
  // 문자열인 경우
  if (typeof dateValue === 'string') {
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? null : date;
  }
  
  return null;
}

/**
 * 날짜를 YYYY-MM-DD 형식의 문자열로 변환
 * @param {string|Array<number>|Date} dateValue - 날짜 값
 * @returns {string} - YYYY-MM-DD 형식의 문자열 또는 빈 문자열
 */
export function formatDateToString(dateValue) {
  const date = parseBackendDate(dateValue);
  if (!date) {
    return '';
  }
  return date.toISOString().split('T')[0];
}

/**
 * 날짜가 유효한지 확인 (Invalid Date / NaN 방지)
 * @param {string|Date|*} dateValue
 * @returns {boolean}
 */
export function isValidDate(dateValue) {
  if (dateValue == null) return false;
  const d = dateValue instanceof Date ? dateValue : new Date(dateValue);
  return !isNaN(d.getTime());
}

/**
 * 안전한 날짜 포맷 — 유효하지 않으면 fallback 반환 (NaN.NaN.NaN 방지)
 * 백엔드 LocalDateTime 배열 [년, 월(0-based), 일, ...] 도 parseBackendDate 로 파싱함.
 * @param {string|Date|Array<number>|*} dateValue
 * @param {'hyphen'|'dot'} style - 'hyphen' → YYYY-MM-DD, 'dot' → YYYY.MM.DD
 * @param {string} fallback - 유효하지 않을 때 반환값 (기본 '-')
 * @returns {string}
 */
export function formatDateSafe(dateValue, style = 'hyphen', fallback = '-') {
  if (dateValue == null) return fallback;
  // 배열(백엔드 LocalDateTime) · 문자열 · Date 모두 parseBackendDate 로 처리
  const d = parseBackendDate(dateValue) ?? (dateValue instanceof Date ? dateValue : new Date(dateValue));
  if (!d || isNaN(d.getTime())) return fallback;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return style === 'dot' ? `${year}.${month}.${day}` : `${year}-${month}-${day}`;
}

 * 채팅 시간 관련 유틸리티 함수들
 */

/**
 * 채팅 시간 문자열을 Date 객체로 파싱
 * @param {string} timeStr - "HH:mm" 또는 "M월 d일" 형태의 시간 문자열
 * @returns {Date} 파싱된 Date 객체
 */
export const parseTime = (timeStr) => {
  if (!timeStr) return new Date(0);
  
  // "HH:mm" 형태 (오늘 메시지)
  if (timeStr.match(/^\d{1,2}:\d{2}$/)) {
    const today = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
  }
  
  // "M월 d일" 형태 (다른 날 메시지)
  if (timeStr.includes('월') && timeStr.includes('일')) {
    const match = timeStr.match(/(\d+)월\s*(\d+)일/);
    if (match) {
      const currentYear = new Date().getFullYear();
      const month = parseInt(match[1]) - 1; // 월은 0부터 시작
      const day = parseInt(match[2]);
      return new Date(currentYear, month, day);
    }
  }
  
  // 기본적으로 Date 생성자로 파싱 시도
  return new Date(timeStr);
};

/**
 * 채팅방 목록을 마지막 메시지 시간 기준으로 정렬
 * @param {Array} chatRooms - 채팅방 배열
 * @returns {Array} 정렬된 채팅방 배열
 */
export const sortChatRoomsByTime = (chatRooms) => {
  return [...chatRooms].sort((a, b) => {
    // 마지막 메시지 시간을 기준으로 내림차순 정렬 (최근 메시지가 위로)
    if (!a.lastMessageTime && !b.lastMessageTime) return 0;
    if (!a.lastMessageTime) return 1;
    if (!b.lastMessageTime) return -1;
    
    const timeA = parseTime(a.lastMessageTime);
    const timeB = parseTime(b.lastMessageTime);
    
    return timeB - timeA; // 내림차순 (최근 시간이 위로)
  });
};
