"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUsernameService = void 0;
const user_repository_1 = require("../../database/repository/user.repository");
/**
 * Service to check if a username is available.
 * @param username - The username to check.
 * @returns boolean - true if available, false if already taken.
 */
const checkUsernameService = async (username) => {
    const user = await user_repository_1.userRepository.findUserByUsername(username);
    // If no user is found, the username is available.
    return !user;
};
exports.checkUsernameService = checkUsernameService;
