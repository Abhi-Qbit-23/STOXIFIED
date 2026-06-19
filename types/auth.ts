export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}
