/**
 * 프로젝트 연재 상태 공통 상수·유틸
 * Admin / Agency / Artist 프로젝트 목록, ProjectSerialCard 등에서 사용
 */

/** 프로젝트 연재 상태 값 (DB PROJECT_STATUS와 동일) */
export const PROJECT_SERIAL_STATUS = {
  SERIALIZING: '연재',
  ON_BREAK: '휴재',
  COMPLETED: '완결',
};

/** 필터 버튼용 옵션 (전체 + 연재/휴재/완결) */
export const SERIAL_STATUS_FILTER_OPTIONS = [
  '전체',
  PROJECT_SERIAL_STATUS.SERIALIZING,
  PROJECT_SERIAL_STATUS.ON_BREAK,
  PROJECT_SERIAL_STATUS.COMPLETED,
];

/**
 * 연재 상태에 따른 배지 Tailwind 클래스 반환
 * @param {string} status - '연재' | '휴재' | '완결' 등
 * @returns {string} Tailwind class (예: 'bg-green-500 hover:bg-green-600')
 */
export function getProjectStatusBadgeClass(status) {
  switch (status) {
    case PROJECT_SERIAL_STATUS.SERIALIZING:
      return 'bg-green-500 hover:bg-green-600';
    case PROJECT_SERIAL_STATUS.ON_BREAK:
      return 'bg-orange-500 hover:bg-orange-600';
    case PROJECT_SERIAL_STATUS.COMPLETED:
      return 'bg-gray-500 hover:bg-gray-600';
    default:
      return 'bg-blue-500 hover:bg-blue-600';
  }
}
