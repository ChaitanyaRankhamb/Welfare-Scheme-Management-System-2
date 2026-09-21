"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCodeValidation = void 0;
const zod_1 = require("zod");
const appError_1 = require("../Error/appError");
const verifyCodeSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email("Invalid email format")
        .toLowerCase()
        .trim(),
    code: zod_1.z
        .number({ invalid_type_error: "verification code must be a number" })
        .int("Code must be an integer")
        .min(100000, "Code must be 6 digits")
        .max(999999, "Code must be 6 digits"),
});
const verifyCodeValidation = (email, code) => {
    try {
        const data = {
            email,
            code
        };
        // safe & strict parsing
        const validatedData = verifyCodeSchema.parse(data);
        return validatedData;
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            // return first meaningful error
            throw new appError_1.AppError(error.issues[0].message, 400);
        }
        // fallback error
        throw new appError_1.AppError("Validation failed", 500);
    }
};
exports.verifyCodeValidation = verifyCodeValidation;
