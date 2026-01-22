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
        const { token, user_id, user_name, role } = loginData;
        set({
          token,
          user: { user_id, user_name, role },
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
      
      getUserId: () => {
        const { user } = get();
        return user?.user_id || null;
      },
      
      getUserName: () => {
        const { user } = get();
        return user?.user_name || null;
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
