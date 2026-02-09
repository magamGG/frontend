import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      
      // Actions
      login: (loginData) => {
        const { token, memberNo, memberName, memberRole, agencyNo } = loginData;
        set({
          token,
          user: { memberNo, memberName, memberRole, agencyNo },
          isAuthenticated: true,
        });
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        // LocalStorage 클리어
        localStorage.removeItem('auth-storage');
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
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
