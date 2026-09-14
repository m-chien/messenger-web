export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  isOnline?: boolean;
  status?: boolean;
  roles?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface UserLoginRequest {
  email: string;
  pass: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user?: User;
}

export interface ApiResponse<T> {
  code?: number;
  message?: string;
  result?: T;
  data?: T;
}
