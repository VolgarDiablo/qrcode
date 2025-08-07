export interface ISignupRequest {
  mode: 'email' | 'phone';
  emailSignup?: {
    name: string;
    email: string;
    password: string;
  };
  phoneSignup?: {
    phone: string;
  };
}
