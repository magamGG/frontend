import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from './config';
import useAuthStore from '../store/authStore';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // 쿠키를 포함한 요청 허용 (CORS)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔒 Refresh Token 동시 실행 방지를 위한 전역 Promise
let refreshTokenPromise = null;

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
    // success: false(비즈니스 실패)면 전체 객체 반환해 호출부에서 message 처리
    if (response.data && response.data.success === false) {
      return response.data;
    }
    // API 문서에 따라 success 필드가 있는 경우 data 추출
    if (response.data && response.data.success !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  async (error) => {
    const config = error.config || {};
    const requestUrl = config.url || '';

    // [중단점] reissue 요청 자체가 실패했으면 더 이상 재시도하지 않고 즉시 종료
    if (requestUrl.includes('/reissue')) {
      try {
        const authStore = useAuthStore.getState();
        authStore.logout();
      } catch (e) {
        console.error('❌ [Axios Interceptor] reissue 실패 후 로그아웃 처리 오류:', e);
      }
      return Promise.reject(error);
    }

    // 에러 응답 처리
    if (error.response) {
      const { status, data } = error.response;
      const originalRequest = error.config;

      // 401 또는 403 에러 (인증 실패) - 토큰 갱신 시도
      // 403도 Access Token 만료로 인한 경우가 많으므로 함께 처리
      if ((status === 401 || status === 403) && !originalRequest._retry) {
        // 로그인/갱신/reissue API는 제외 (무한 루프 방지)
        if (
          originalRequest.url.includes('/login') || 
          originalRequest.url.includes('/refresh') ||
          originalRequest.url.includes('/reissue')
        ) {
          // 로그인 실패 또는 Refresh Token도 만료된 경우
          console.error('❌ [Axios Interceptor] 인증 실패 - 로그인 페이지로 이동');
          try {
            const authStore = useAuthStore.getState();
            // 상태 초기화
            authStore.logout();
            // 로그인 페이지로 이동
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          } catch (e) {
            console.error('❌ [Axios Interceptor] Logout error:', e);
          }
          return Promise.reject(error);
        }

        // 재시도 플래그 설정 (무한 루프 방지)
        originalRequest._retry = true;

        try {
          // 🔒 동시 실행 방지: 이미 refresh가 진행 중이면 대기
          if (!refreshTokenPromise) {
            refreshTokenPromise = useAuthStore.getState().refreshAccessToken()
              .then((token) => {
                refreshTokenPromise = null; // 완료 후 초기화
                return token;
              })
              .catch((err) => {
                console.error('❌ [Axios Interceptor] reissue 실패:', err);
                refreshTokenPromise = null; // 실패 후 초기화
                
                // 401 에러 시 상태 초기화 및 로그인 페이지 이동
                const authStore = useAuthStore.getState();
                authStore.logout();
                
                if (window.location.pathname !== '/login') {
                  window.location.href = '/login';
                }
                
                throw err;
              });
          }

          // Access Token 갱신 시도 (동시 실행 방지)
          const newAccessToken = await refreshTokenPromise;

          if (newAccessToken) {
            // 새 Access Token으로 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Reissue 실패 (401) - Valkey에 토큰이 없거나 만료됨
          console.error('❌ [Axios Interceptor] reissue 실패:', refreshError);
          
          // 상태 초기화 및 로그인 페이지로 이동
          try {
            const authStore = useAuthStore.getState();
            authStore.logout();
            
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          } catch (e) {
            console.error('❌ [Axios Interceptor] Logout error:', e);
          }
          
          return Promise.reject(refreshError);
        }
      }

      // 403 에러 (권한 없음) - 토큰 갱신 실패 후 또는 실제 권한 문제
      if (status === 403) {
        const errorMessage = data?.message || '접근 권한이 없습니다.';
        // 토큰 갱신을 시도했지만 실패한 경우가 아니면 알림 표시
        if (!originalRequest._retry) {
          alert(errorMessage);
        }
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
