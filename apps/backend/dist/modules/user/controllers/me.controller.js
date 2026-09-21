"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMeController = exports.getMeController = void 0;
const user_repository_1 = require("../../../database/repository/user.repository");
/**
 * Controller to get current user profile
 */
const getMeController = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json({
            success: true,
            data: {
                id: user.id.toString(),
                email: user.getEmail(),
                username: user.getUsername(),
                avatar: user.getAvatar(),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMeController = getMeController;
/**
 * Controller to update current user profile (username or avatar)
 */
const updateMeController = async (req, res, next) => {
    try {
        const user = req.user;
        const body = req.body;
        if (body.username)
            user["username"] = body.username; // update properties
        if (body.avatar)
            user["avatar"] = body.avatar;
        // In actual implementation, we might map properties to the User Domain Entity methods like user.setUsername(body.username)
        // but the repo accepts the domain entity and saves it. For now, a naive update:
        // This calls the userRepository update function
        const updatedUser = await user_repository_1.userRepository.updateUser(user.id.toString(), user);
        if (!updatedUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({
            success: true,
            data: {
                id: updatedUser.id.toString(),
                email: updatedUser.getEmail(),
                username: updatedUser.getUsername(),
                avatar: updatedUser.getAvatar(),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateMeController = updateMeController;
