/**
 * 연락처 포맷팅 유틸리티 함수
 */

/**
 * 연락처를 3개 부분으로 분리
 * @param {string} phone - 전체 연락처 (010-1234-5678 또는 01012345678)
 * @returns {Object} - { part1: '010', part2: '1234', part3: '5678' }
 */
export const splitPhoneNumber = (phone) => {
  if (!phone) return { part1: '', part2: '', part3: '' };
  const numbers = phone.replace(/[^\d]/g, '');
  return {
    part1: numbers.slice(0, 3) || '',
    part2: numbers.slice(3, 7) || '',
    part3: numbers.slice(7, 11) || '',
  };
};

/**
 * 3개 부분을 합쳐서 DB 저장 형식으로 변환
 * @param {string} part1 - 첫 번째 부분 (010)
 * @param {string} part2 - 두 번째 부분 (1234)
 * @param {string} part3 - 세 번째 부분 (5678)
 * @returns {string} - DB 저장용 포맷 (010-1234-5678)
 */
export const combinePhoneNumber = (part1, part2, part3) => {
  const numbers = `${part1}${part2}${part3}`.replace(/[^\d]/g, '');
  if (numbers.length === 0) return '';
  if (numbers.length !== 11) {
    // 부분적으로 입력된 경우에도 하이픈 포함하여 반환
    const p1 = numbers.slice(0, 3) || '';
    const p2 = numbers.slice(3, 7) || '';
    const p3 = numbers.slice(7, 11) || '';
    if (p1 && p2 && p3) return `${p1}-${p2}-${p3}`;
    if (p1 && p2) return `${p1}-${p2}${p3 ? `-${p3}` : ''}`;
    if (p1) return `${p1}${p2 ? `-${p2}` : ''}${p3 ? `-${p3}` : ''}`;
    return numbers;
  }
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
};

/**
 * 연락처 포맷팅 함수 (단일 input용 - 기존 코드 호환성)
 * 숫자만 입력해도 자동으로 하이픈을 추가합니다.
 * @param {string} value - 입력된 값
 * @returns {string} - 포맷팅된 연락처 (예: 010-1234-5678)
 */
export const formatPhoneNumber = (value) => {
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, '');
  
  // 11자리 제한 (010-1234-5678)
  const limitedNumbers = numbers.slice(0, 11);
  
  // 길이에 따라 하이픈 추가
  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 7) {
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
  }
};

/**
 * 연락처를 DB 저장 형식으로 변환
 * 이미 포맷팅되어 있어도 숫자만 추출 후 다시 포맷팅하여 일관성 유지
 * @param {string} phone - 입력된 연락처
 * @returns {string} - DB 저장용 포맷 (010-1234-5678)
 */
export const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  const numbers = phone.replace(/[^\d]/g, '');
  if (numbers.length !== 11) return phone; // 유효하지 않은 경우 원본 반환
  return formatPhoneNumber(numbers);
};

