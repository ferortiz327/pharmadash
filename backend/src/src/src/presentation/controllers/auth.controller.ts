import { Request, Response } from 'express';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { RegisterUserUseCase } from '../../domain/use-cases/auth/register-user.use-case';
import { LoginUserUseCase } from '../../domain/use-cases/auth/login-user.use-case';
import { RegisterUserDto } from '../../application/dto/auth/register-user.dto';
import { LoginUserDto } from '../../application/dto/auth/login-user.dto';

export class AuthController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(req: Request, res: Response) {
    try {
      const dto: RegisterUserDto = req.body;

      if (!dto.email || !dto.password || !dto.firstName || !dto.lastName) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: email, password, firstName, lastName'
        });
      }

      const useCase = new RegisterUserUseCase(this.userRepository);
      const user = await useCase.execute(dto);

      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        message: 'User registered successfully'
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('already') ? 400 : 500;
      res.status(status).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error registering user'
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const dto: LoginUserDto = req.body;

      if (!dto.email || !dto.password) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: email, password'
        });
      }

      const useCase = new LoginUserUseCase(this.userRepository);
      const result = await useCase.execute(dto);

      res.json({
        success: true,
        data: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role,
          token: result.token
        },
        message: 'Login successful'
      });
    } catch (error) {
      const status = error instanceof Error && error.message.includes('Invalid') ? 401 : 500;
      res.status(status).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error logging in'
      });
    }
  }

  async me(req: Request & { user?: any }, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive
        },
        message: 'User profile retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error retrieving user'
      });
    }
  }
}
