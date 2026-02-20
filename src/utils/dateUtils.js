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
  
  // 배열 형태인 경우 (LocalDateTime 직렬화: [년, 월(0-based), 일, 시, 분, 초])
  if (Array.isArray(dateValue)) {
    if (dateValue.length < 3) {
      return null;
    }
    // 배열: [년, 월(0-based), 일, 시?, 분?, 초?]
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateValue;
    const date = new Date(year, month, day, hour, minute, second);
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

