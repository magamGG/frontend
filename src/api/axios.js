import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from './config';
import useAuthStore from '../store/authStore';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터 - 토큰 및 회원번호 자동 첨부
api.interceptors.request.use(
  (config) => {
    try {
      // FormData 전송 시 Content-Type 제거 → multipart/form-data + boundary 자동 설정
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
      // Zustand store에서 직접 state 가져오기
      const state = useAuthStore.getState();
      const token = state.token;
      const memberNo = state.user?.memberNo;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('토큰 첨부:', token.substring(0, 20) + '...');
      } else {
        console.log('토큰 없음');
      }

      // 회원번호가 있으면 헤더에 추가
      if (memberNo) {
        config.headers['X-Member-No'] = memberNo.toString();
      }
    } catch (error) {
      console.error('❌ Auth store error:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터 - 응답 통일 및 에러 처리
api.interceptors.response.use(
  (response) => {
    // Blob 응답인 경우 원본 response 반환 (다운로드 등)
    if (response.config.responseType === 'blob') {
      return response;
    }

    // 성공 응답 처리
    // API 문서에 따라 success 필드가 있는 경우 data 추출
    if (response.data && response.data.success !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  async (error) => {
    // 에러 응답 처리
    if (error.response) {
      const { status, data } = error.response;
      const originalRequest = error.config;

      // 401 에러 (인증 실패) - 토큰 갱신 시도
      if (status === 401 && !originalRequest._retry) {
        // 로그인/갱신 API는 제외
        if (originalRequest.url.includes('/login') || originalRequest.url.includes('/refresh')) {
          // 로그인 실패 또는 Refresh Token도 만료된 경우
          try {
            useAuthStore.getState().logout();
            alert('인증이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/login';
          } catch (e) {
            console.error('Logout error:', e);
          }
          return Promise.reject(error);
        }

        // 재시도 플래그 설정 (무한 루프 방지)
        originalRequest._retry = true;

        try {
          // Access Token 갱신 시도
          const newAccessToken = await useAuthStore.getState().refreshAccessToken();

          if (newAccessToken) {
            // 새 Access Token으로 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh Token도 만료된 경우 로그아웃
          console.error('토큰 갱신 실패:', refreshError);
          try {
            useAuthStore.getState().logout();
            alert('인증이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/login';
          } catch (e) {
            console.error('Logout error:', e);
          }
          return Promise.reject(refreshError);
        }
      }

      // 403 에러 (권한 없음)
      if (status === 403) {
        const errorMessage = data?.message || '접근 권한이 없습니다.';
        alert(errorMessage);
        console.error('❌ 403 Forbidden:', errorMessage);

        return Promise.reject({
          status,
          message: errorMessage,
          data,
        });
      }

      // 에러 메시지 표준화
      const errorMessage = data?.message || '오류가 발생했습니다.';

      return Promise.reject({
        status,
        message: errorMessage,
        data,
      });
    }

    // 네트워크 에러 등
    if (error.request) {
      return Promise.reject({
        message: '서버와 통신할 수 없습니다.',
        error,
      });
    }

    return Promise.reject({
      message: '요청 중 오류가 발생했습니다.',
      error,
    });
  }
);


export default api;
