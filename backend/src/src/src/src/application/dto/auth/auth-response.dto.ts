import { UserRole } from '../../../domain/entities/user-role.enum';

export class AuthResponseDto {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  role!: UserRole;
  token!: string;
}
