import { ITokenResponse } from '../interface/token-response.interface.ts.js';

export class TokenResponseDTO implements ITokenResponse {
  constructor(partial: Partial<TokenResponseDTO>) {
    Object.assign(this, partial);
  }
  token: string;
}
