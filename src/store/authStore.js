import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../api/services';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null, // Access Token (메모리만 저장 - 보안)
      refreshToken: null, // Refresh Token (localStorage 저장)
      isAuthenticated: false,
      isRefreshing: false, // 토큰 갱신 중 플래그 (무한 루프 방지)
      
      // Actions
      login: (loginData) => {
        const { token, accessToken, refreshToken, memberNo, memberName, memberRole, agencyNo } = loginData;
        // accessToken이 있으면 우선 사용, 없으면 token 사용 (하위 호환성)
        const finalAccessToken = accessToken || token;
        
        set({
          token: finalAccessToken, // Access Token은 메모리에만 저장
          refreshToken: refreshToken, // Refresh Token은 localStorage에 저장
          user: { memberNo, memberName, memberRole, agencyNo },
          isAuthenticated: true,
        });
      },
      
      logout: async () => {
        // 백엔드에 로그아웃 요청 (쿠키 기반, Refresh Token 무효화)
        try {
          await authService.logout();
        } catch (error) {
          console.error('로그아웃 요청 실패:', error);
        }
        
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        
        // LocalStorage 클리어
        localStorage.removeItem('auth-storage');
      },
      
      // Access Token 갱신 (쿠키 기반 reissue 사용)
      refreshAccessToken: async () => {
        const { isRefreshing } = get();
        
        // 이미 갱신 중이면 대기
        if (isRefreshing) {
          console.log('⏳ [authStore] 이미 갱신 중...');
          return null;
        }
        
        set({ isRefreshing: true });
        
        try {
          console.log('📡 [authStore] 서버에 reissue 요청 전송 (쿠키 기반)...');
          // 쿠키 기반 reissue 사용 (body 없음)
          const response = await authService.reissue();
          const { accessToken } = response;
          
          if (!accessToken) {
            throw new Error('Access Token이 응답에 없습니다.');
          }
          
          console.log('✅ [authStore] reissue 성공, 새 Access Token 저장');
          
          // 새 Access Token만 저장 (Refresh Token은 쿠키에 있음)
          set({
            token: accessToken,
            isRefreshing: false,
          });
          
          return accessToken;
        } catch (error) {
          // Reissue 실패 시 (401) - Valkey에 토큰이 없거나 만료됨
          console.error('❌ [authStore] reissue 실패:', error);
          
          // 상태 초기화 및 로그인 페이지로 이동
          set({
            isRefreshing: false,
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          
          localStorage.removeItem('auth-storage');
          
          // 로그인 페이지로 리다이렉트
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          
          throw error;
        }
      },
      
      setUser: (user) => {
        set({ user });
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
      
      // Computed
      checkAuth: () => {
        const { token } = get();
        return !!token;
      },
      
      getMemberNo: () => {
        const { user } = get();
        return user?.memberNo || null;
      },
      
      getMemberName: () => {
        const { user } = get();
        return user?.memberName || null;
      },
      
      // 초기화 함수 (페이지 로드 시 호출)
      initializeAuth: async () => {
        const { refreshToken, user, isAuthenticated } = get();
        
        // 사용자 정보가 있으면 Access Token 복원 시도
        // Refresh Token은 쿠키(HttpOnly)에 있을 수 있으므로, localStorage에 없어도 시도
        // 백엔드에서 쿠키를 확인하여 reissue 수행
        if (user && isAuthenticated) {
          try {
            const newAccessToken = await get().refreshAccessToken();
            if (newAccessToken) {
              set({ isAuthenticated: true });
              return true;
            }
          } catch (error) {
            // Refresh Token도 만료된 경우 로그아웃
            console.error('토큰 복원 실패:', error);
            get().logout();
            return false;
          }
        }
        
        // 사용자 정보가 없으면 false
        return false;
      },
    }),
    {
      name: 'auth-storage', // LocalStorage 키
      partialize: (state) => ({
        // Access Token은 localStorage에 저장하지 않음 (보안)
        // Refresh Token만 localStorage에 저장
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
