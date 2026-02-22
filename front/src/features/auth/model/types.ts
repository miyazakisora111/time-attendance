export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive' | 'suspended';
    department_id?: string;
  };
}

export interface AuthMeResponse {
  user: {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive' | 'suspended';
    department_id?: string;
    email_verified_at?: string;
    last_login_at?: string;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
