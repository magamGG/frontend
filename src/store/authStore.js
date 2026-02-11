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
          return null;
        }
        
        // Refresh Token이 없으면 갱신 불가
        if (!refreshToken) {
          throw new Error('Refresh Token이 없습니다.');
        }
        
        set({ isRefreshing: true });
        
        try {
          const response = await authService.refresh(refreshToken);
          const { accessToken, refreshToken: newRefreshToken } = response;
          
          // 새 토큰 저장
          set({
            token: accessToken,
            refreshToken: newRefreshToken,
            isRefreshing: false,
          });
          
          return accessToken;
        } catch (error) {
          // Refresh Token도 만료된 경우 로그아웃
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
