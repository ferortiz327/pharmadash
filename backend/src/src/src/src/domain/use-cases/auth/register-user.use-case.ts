import { User } from '../../entities/user.entity';
import { UserRole } from '../../entities/user-role.enum';
import { IUserRepository } from '../../interfaces/user-repository.interface';
import * as bcrypt from 'bcryptjs';

export interface RegisterUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: RegisterUserDTO): Promise<User> {
    // Validar email
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Validar password
    if (dto.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Crear usuario - usar un objeto simple, no una instancia de User
    const userData = {
      email: dto.email.toLowerCase(),
      passwordHash: passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role || UserRole.CASHIER,
      isActive: true
    };

    // El repositorio recibe un objeto simple y devuelve un User
    const user = await this.userRepository.create(userData);
    return user;
  }
}
