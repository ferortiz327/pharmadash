import { UserRole } from '../../../domain/entities/user-role.enum';

export class RegisterUserDto {
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  role?: UserRole;
}
