import { Response, NextFunction } from 'express';
import { AppError } from '../Error/appError';
import { Role } from '../types/roles.enum';
import { AuthRequest } from './auth.middleware';

/**
 * Middleware to check if the authenticated user has the required roles.
 * Must be used AFTER an authentication middleware that sets `req.user`.
 * 
 * @param allowedRoles - An array of roles that are allowed to access the route
 */
export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {

    // Assuming authentication middleware (e.g., passport jwt) populates req.user
    const user = req.user as any;

    if (!user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!user.role || !allowedRoles.includes(user.role)) {
      return next(new AppError(`Role: ${user.role} is not allowed to access this resource`, 403));
    }

    next();
  };
};


