// Authentication Hook
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuth = () => {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    updateUser,
    clearError,
    setLoading,
  } = useAuthStore();

  // Redirect to login if not authenticated
  const requireAuth = () => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/login');
    }
  };

  // Redirect to dashboard if already authenticated
  const requireGuest = () => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  };

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.role === 'admin';
  };

  // Check if user has any of the specified roles
  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  // Auto-logout on token expiration
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp < currentTime) {
          logout();
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Invalid token format');
        logout();
        router.push('/auth/login');
      }
    }
  }, [token, logout, router]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    updateUser,
    clearError,
    setLoading,
    requireAuth,
    requireGuest,
    hasPermission,
    hasRole,
  };
};