// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  role?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// Food types
export interface Food {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
  available: boolean;
  preparationTime: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FoodsResponse extends Array<Food> {}

// Generic API response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
