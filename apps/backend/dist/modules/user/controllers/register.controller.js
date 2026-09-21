"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = void 0;
const register_service_1 = require("../services/register.service");
const user_register_validation_1 = require("../../../validations/user.register.validation");
/**
 * Controller to handle user registration requests
 */
const registerController = async (req, res, next) => {
    try {
        const { email, username } = req.body;
        // validate the incoming fields
        const validatedData = await (0, user_register_validation_1.registerValidation)(username, email);
        // call the register service with validated data
        const user = await (0, register_service_1.registerService)(validatedData.email, validatedData.username);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.registerController = registerController;
