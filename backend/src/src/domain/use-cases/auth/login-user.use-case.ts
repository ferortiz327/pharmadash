import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../interfaces/user-repository.interface';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: LoginUserDTO): Promise<LoginResponse> {
    // Buscar usuario
    const user = await this.userRepository.findByEmail(dto.email.toLowerCase());
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verificar si est? activo
    if (!user.isActive) {
      throw new Error('Account is disabled');
    }

    // Verificar password
    const isValidPassword = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generar JWT
    const token = this.generateToken(user);

    return { user, token };
  }

  private generateToken(user: User): string {
    const secret = process.env.JWT_SECRET || 'default_secret_key_pharmadash';
    
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    // Opciones del token
    const options: jwt.SignOptions = {
      expiresIn: '7d'
    };

    // Firmar el token
    return jwt.sign(payload, secret, options);
  }
}
