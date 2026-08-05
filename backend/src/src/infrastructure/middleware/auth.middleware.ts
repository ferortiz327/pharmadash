import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class AuthMiddleware {
  static async authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token format'
        });
      }

      const token = parts[1];
      const secret = process.env.JWT_SECRET || 'default_secret_key_pharmadash';

      const decoded = jwt.verify(token, secret) as any;
      
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  }

  static requireRole(...roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions. Required role: ' + roles.join(', ')
        });
      }

      next();
    };
  }

  static requireAdmin() {
    return this.requireRole('ADMIN');
  }

  static requireCashier() {
    return this.requireRole('ADMIN', 'CASHIER');
  }

  static requirePharmacist() {
    return this.requireRole('ADMIN', 'PHARMACIST');
  }
}
