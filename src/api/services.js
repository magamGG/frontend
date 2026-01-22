import api from './axios';
import { API_ENDPOINTS } from './config';

// 인증 서비스
export const authService = {
  // 로그인
  login: (credentials) => {
    return api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },
};

// 회원 서비스
export const memberService = {
  // 회원가입
  register: (memberData) => {
    return api.post(API_ENDPOINTS.MEMBERS.BASE, memberData);
  },
  
  // 회원 목록 조회
  getMembers: () => {
    return api.get(API_ENDPOINTS.MEMBERS.BASE);
  },
  
  // 회원 검색
  searchMembers: (keyword) => {
    return api.get(API_ENDPOINTS.MEMBERS.SEARCH(keyword));
  },
  
  // 회원 단건 조회
  getMember: (userId) => {
    return api.get(API_ENDPOINTS.MEMBERS.DETAIL(userId));
  },
  
  // 회원 정보 수정
  updateMember: (userId, memberData) => {
    return api.put(API_ENDPOINTS.MEMBERS.DETAIL(userId), memberData);
  },
  
  // 회원 삭제
  deleteMember: (userId) => {
    return api.delete(API_ENDPOINTS.MEMBERS.DETAIL(userId));
  },
};

// 게시판 서비스
export const boardService = {
  // 게시글 작성
  createBoard: (formData) => {
    return api.post(API_ENDPOINTS.BOARD.BASE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 게시글 목록 조회 (페이징)
  getBoards: (page = 0, size = 10, sort = 'createDate,desc') => {
    return api.get(API_ENDPOINTS.BOARD.LIST(page, size, sort));
  },
  
  // 게시글 단건 조회
  getBoard: (boardId) => {
    return api.get(API_ENDPOINTS.BOARD.DETAIL(boardId));
  },
  
  // 게시글 수정
  updateBoard: (boardId, formData) => {
    return api.patch(API_ENDPOINTS.BOARD.DETAIL(boardId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 게시글 삭제
  deleteBoard: (boardId) => {
    return api.delete(API_ENDPOINTS.BOARD.DETAIL(boardId));
  },
};

export default {
  authService,
  memberService,
  boardService,
};
