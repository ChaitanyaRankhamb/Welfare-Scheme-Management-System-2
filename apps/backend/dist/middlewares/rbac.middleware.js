"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const appError_1 = require("../Error/appError");
/**
 * Middleware to check if the authenticated user has the required roles.
 * Must be used AFTER an authentication middleware that sets `req.user`.
 *
 * @param allowedRoles - An array of roles that are allowed to access the route
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Assuming authentication middleware (e.g., passport jwt) populates req.user
        const user = req.user;
        if (!user) {
            return next(new appError_1.AppError('User not authenticated', 401));
        }
        if (!user.role || !allowedRoles.includes(user.role)) {
            return next(new appError_1.AppError(`Role: ${user.role} is not allowed to access this resource`, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
