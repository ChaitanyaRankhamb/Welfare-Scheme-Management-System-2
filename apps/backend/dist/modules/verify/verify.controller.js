"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyController = void 0;
const verify_service_1 = require("./verify.service");
const verifyCode_validation_1 = require("../../validations/verifyCode.validation");
/**
 * Controller to handle email verification requests.
 * Extracts email and code from request body.
 */
const verifyController = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        // 1. Validate request body
        const validation = (0, verifyCode_validation_1.verifyCodeValidation)(email, code);
        // 2. Call the verify service to perform logic
        const result = await (0, verify_service_1.verifyService)(validation.email, validation.code);
        // 3. Return a successful response
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        // 4. Pass errors to error-handling middleware
        next(error);
    }
};
exports.verifyController = verifyController;
