"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidation = void 0;
const zod_1 = require("zod");
const appError_1 = require("../Error/appError");
// Define schema
const registerSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must not exceed 20 characters")
        .trim(),
    email: zod_1.z.string().email("Invalid email format").toLowerCase().trim(),
});
// Validation function
const registerValidation = async (username, email) => {
    try {
        const validatedData = registerSchema.parse({
            username,
            email,
        });
        return validatedData; // clean & validated data
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new appError_1.AppError(error.issues[0].message, 400);
        }
        throw error;
    }
};
exports.registerValidation = registerValidation;
