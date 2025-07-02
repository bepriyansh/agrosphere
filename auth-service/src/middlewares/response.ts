import { Response, Request, NextFunction } from 'express';
import { AuthUser } from '../middlewares/verification';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
  interface Response {
    success: <T>(options: { status?: number; message?: string; data?: T }) => Response;
    error: (status: number, message: string) => Response;
  }
}

export function responseMiddleware(req: Request, res: Response, next: NextFunction) {
  res.success = function <T>({ status = 200, message, data }: { status?: number; message?: string; data?: T }) {
    return res.status(status).json({
      success: true,
      status,
      message,
      data,
    });
  };

  res.error = function (status: number, message: string) {
    return res.status(status).json({
      success: false,
      status,
      message,
      data: null,
    });
  };

  next();
}
