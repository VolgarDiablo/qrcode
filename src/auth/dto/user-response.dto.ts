import { IUserResponse } from '../interface/user-response.interface';

export class UserResponseDTO implements IUserResponse {
  id: number;
  email: string;
  name: string;
  phone: string;

  constructor(partial: Partial<IUserResponse>) {
    Object.assign(this, partial);
  }
}
