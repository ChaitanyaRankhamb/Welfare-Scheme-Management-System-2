"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserModelRepo = void 0;
const userId_1 = require("../../entity/user/userId");
const user_model_1 = require("../mongo/models/user.model");
const user_entity_1 = require("../../entity/user/user.entity");
class UserModelRepo {
    mapToDomain(userDoc) {
        return new user_entity_1.User(new userId_1.UserId(userDoc._id.toString()), userDoc.email, userDoc.username, userDoc.avatar, userDoc.emailVerified, userDoc.isActive, userDoc.providers, userDoc.verificationCode, userDoc.verificationExpiry, userDoc.createdAt, userDoc.updatedAt, userDoc.passwordHash, userDoc.role, userDoc.profile);
    }
    async createUser(userData) {
        const newUser = new user_model_1.UserModel({
            email: userData.email,
            username: userData.username,
            avatar: userData.avatar,
            emailVerified: userData.emailVerified,
            isActive: userData.isActive,
            providers: userData.providers,
            verificationCode: userData.verificationCode,
            verificationExpiry: userData.verificationExpiry,
            passwordHash: userData.passwordHash,
            role: userData.role,
            profile: userData.profile
        });
        const savedUser = await newUser.save();
        return this.mapToDomain(savedUser);
    }
    async findAllUsers(skip = 0, limit = 20, status) {
        const filters = { role: 'citizen' };
        if (status === 'active') {
            filters.isActive = true;
        }
        else if (status === 'inactive') {
            filters.isActive = false;
        }
        const [docs, total] = await Promise.all([
            user_model_1.UserModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),
            user_model_1.UserModel.countDocuments(filters)
        ]);
        return {
            users: docs.map(doc => this.mapToDomain(doc)),
            total
        };
    }
    async findUserById(id) {
        const userDoc = await user_model_1.UserModel.findById(id);
        if (!userDoc)
            return null;
        return this.mapToDomain(userDoc);
    }
    async findUserByEmail(email) {
        const userDoc = await user_model_1.UserModel.findOne({ email });
        if (!userDoc)
            return null;
        return this.mapToDomain(userDoc);
    }
    async findUserByUsername(username) {
        const userDoc = await user_model_1.UserModel.findOne({ username });
        if (!userDoc)
            return null;
        return this.mapToDomain(userDoc);
    }
    async findByProvider(type, providerId) {
        const userDoc = await user_model_1.UserModel.findOne({ 'providers.type': type, 'providers.providerId': providerId });
        if (!userDoc)
            return null;
        return this.mapToDomain(userDoc);
    }
    async updateUser(id, user) {
        const updatedDoc = await user_model_1.UserModel.findByIdAndUpdate(id, {
            email: user.getEmail(),
            username: user.getUsername(),
            avatar: user.getAvatar(),
            emailVerified: user.isEmailVerified(),
            isActive: user.isUserActive(),
            providers: user.getProviders(),
            verificationCode: user.getVerificationCode(),
            verificationExpiry: user.getVerificationExpiry(),
            passwordHash: user.getPasswordHash(),
            role: user.getRole(),
            profile: user.getProfile()
        }, { new: true });
        if (!updatedDoc)
            return null;
        return this.mapToDomain(updatedDoc);
    }
}
exports.UserModelRepo = UserModelRepo;
exports.userRepository = new UserModelRepo();
