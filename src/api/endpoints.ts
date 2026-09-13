// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
} as const;

// Food endpoints
export const FOOD_ENDPOINTS = {
  GET_FOODS: '/foods',
} as const;

// All endpoints
export const ENDPOINTS = {
  ...AUTH_ENDPOINTS,
  ...FOOD_ENDPOINTS,
} as const;
