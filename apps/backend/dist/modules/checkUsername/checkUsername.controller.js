"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUsernameController = void 0;
const checkUsername_service_1 = require("./checkUsername.service");
/**
 * Controller to handle username availability checks.
 */
const checkUsernameController = async (req, res, next) => {
    try {
        const { username } = req.query;
        if (!username || typeof username !== "string") {
            res.status(400).json({
                success: false,
                message: "Username is required as a query parameter.",
            });
            return;
        }
        const isAvailable = await (0, checkUsername_service_1.checkUsernameService)(username);
        res.status(200).json({
            success: true,
            available: isAvailable,
            message: isAvailable ? "Username is available" : "Username is already taken",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.checkUsernameController = checkUsernameController;
