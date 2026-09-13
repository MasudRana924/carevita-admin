import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { authService, foodService } from '../api/services';

import type { LoginRequest, RegisterRequest, VerifyOtpRequest } from '../api/types';

// Query keys
export const queryKeys = {
  foods: ['foods'] as const,
  user: ['user'] as const,
} as const;

// Auth mutations
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: queryKeys.user });
      }
    },
  });
};

export const useRegister = () => useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
  });

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (otpData: VerifyOtpRequest) => authService.verifyOtp(otpData),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: queryKeys.user });
      }
    },
  });
};

// Food queries
export const useFoods = () => useQuery({
    queryKey: queryKeys.foods,
    queryFn: () => foodService.getFoods(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

// Utility hook for logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return () => {
    localStorage.removeItem('authToken');
    // Clear all queries
    queryClient.clear();
  };
};
