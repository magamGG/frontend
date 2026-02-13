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
        const { refreshToken } = get();
        
        // 백엔드에 로그아웃 요청 (Refresh Token 무효화)
        if (refreshToken) {
          try {
            await authService.logout(refreshToken);
          } catch (error) {
            console.error('로그아웃 요청 실패:', error);
          }
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
      
      // Access Token 갱신
      refreshAccessToken: async () => {
        const { refreshToken, isRefreshing } = get();
        
        // 이미 갱신 중이면 대기
        if (isRefreshing) {
          console.log('⏳ [authStore] 이미 갱신 중입니다. 대기...');
          // Promise가 완료될 때까지 대기 (최대 5초)
          const startTime = Date.now();
          while (get().isRefreshing && Date.now() - startTime < 5000) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          // 대기 후에도 갱신 중이면 null 반환
          if (get().isRefreshing) {
            return null;
          }
          // 갱신 완료 후 새 토큰 반환
          return get().token;
        }
        
        // Refresh Token이 없으면 갱신 불가
        if (!refreshToken) {
          console.error('❌ [authStore] Refresh Token이 없습니다.');
          throw new Error('Refresh Token이 없습니다.');
        }
        
        console.log('🔄 [authStore] refreshAccessToken() 호출 시작');
        set({ isRefreshing: true });
        
        try {
          console.log('📡 [authStore] 서버에 refresh 요청 전송...');
          const response = await authService.refresh(refreshToken);
          const { accessToken, refreshToken: newRefreshToken } = response;
          
          console.log('✅ [authStore] refresh 성공, 새 토큰 저장');
          
          // 새 토큰 저장
          set({
            token: accessToken,
            refreshToken: newRefreshToken,
            isRefreshing: false,
          });
          
          return accessToken;
        } catch (error) {
          // Refresh Token도 만료된 경우 로그아웃
          console.error('❌ [authStore] refresh 실패:', error);
          set({
            isRefreshing: false,
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          localStorage.removeItem('auth-storage');
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
        
        // Refresh Token과 사용자 정보가 있으면 Access Token 복원 시도
        if (refreshToken && user && isAuthenticated) {
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
        
        // Refresh Token이 없거나 사용자 정보가 없으면 false
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
