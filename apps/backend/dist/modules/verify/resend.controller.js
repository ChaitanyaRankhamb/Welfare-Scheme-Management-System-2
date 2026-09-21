"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendController = void 0;
const resend_service_1 = require("./resend.service");
const resend_validation_1 = require("../../validations/resend.validation");
/**
 * Controller to handle requests for resending verification codes.
 * Extracts email from request body or query parameters.
 */
const resendController = async (req, res, next) => {
    try {
        // Extract email from body
        const email = req.body.email;
        // 1. Validate request email
        const validation = await (0, resend_validation_1.resendValidation)(email);
        // 2. Call the resend service
        const result = await (0, resend_service_1.resendService)(validation.email);
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
exports.resendController = resendController;
