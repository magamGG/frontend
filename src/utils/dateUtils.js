/**
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