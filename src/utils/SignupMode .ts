import { ISignupRequest } from 'src/auth/interface/sighup.intertace';

export type SignupMode = 'email' | 'phone' | 'none';

export function getSignupMode(payload: ISignupRequest): SignupMode {
  if (payload.emailSignup) return 'email';
  if (payload.phoneSignup) return 'phone';
  return 'none';
}
