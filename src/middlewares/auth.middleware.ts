import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'src/libraries/jwt-payload.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Production: Nginx ตรวจ JWT แล้ว set x-consumer headers มาให้
    if (req.headers['x-consumer-id']) {
      res.locals.user = {
        id:       req.headers['x-consumer-id'],
        email:    req.headers['x-consumer-email'],
        fullName: req.headers['x-consumer-name'],
        roleId:   req.headers['x-consumer-role-id'],
        roleCode: req.headers['x-consumer-role-code'],
      };
      return next();
    }

    // Development: ไม่มี Nginx ตรวจ JWT เอง
    if (process.env.NODE_ENV !== 'production') {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedException('No token provided');
      }
      const token = authHeader.split(' ')[1];
      try {
        const payload = this.jwtService.verify<JwtPayload>(token);
        res.locals.user = payload;
        return next();
      } catch {
        throw new UnauthorizedException('Invalid token');
      }
    }

    throw new UnauthorizedException('Unauthorized');
  }
}
