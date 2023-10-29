export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  username: string;
}

export interface User {
  userName: string
  preferredUserName: string
  discriminator?: string
}
