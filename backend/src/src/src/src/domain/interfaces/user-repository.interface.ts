import { User } from '../entities/user.entity';

// Datos para crear un usuario (sin m?todos)
export interface CreateUserData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

export interface IUserRepository {
  create(data: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: Partial<CreateUserData>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
