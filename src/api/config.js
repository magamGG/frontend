// API 기본 설정
export const API_BASE_URL = 'http://localhost:8888';
export const API_TIMEOUT = 10000;

// API 엔드포인트
export const API_ENDPOINTS = {
  // 인증 API
  AUTH: {
    LOGIN: `/api/auth/login`,
  },
  
  // 회원 API
  MEMBERS: {
    BASE: `/api/members`,
    DETAIL: (userId) => `/api/members/${userId}`,
    SEARCH: (keyword) => `/api/members?keyword=${keyword}`,
  },
  
  // 게시판 API
  BOARD: {
    BASE: '/api/board',
    DETAIL: (boardId) => `/api/board/${boardId}`,
    LIST: (page = 0, size = 10, sort = 'createDate,desc') => 
      `/api/board?page=${page}&size=${size}&sort=${sort}`,
  },
};

export default {
  API_BASE_URL,
  API_TIMEOUT,
  API_ENDPOINTS,
};
