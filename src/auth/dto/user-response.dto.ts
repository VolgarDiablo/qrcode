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

// export class UserResponseDTO {
//   id: number;
//   email: string | null;
//   name: string | null;
//   phone: string | null;

//   constructor(user: IUserResponse) {
//     this.id = user.id;
//     this.email = user.email;
//     this.name = user.name;
//     this.phone = user.phone;
//   }
// }
