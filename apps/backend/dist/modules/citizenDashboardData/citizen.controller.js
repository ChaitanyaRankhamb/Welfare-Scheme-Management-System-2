"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.citizenDataController = void 0;
const userId_1 = require("../../entity/user/userId");
const appError_1 = require("../../Error/appError");
const citizen_service_1 = require("./citizen.service");
const citizenDataController = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new appError_1.AppError("Unauthorized User", 400);
        }
        // call service
        const data = await (0, citizen_service_1.citizenDataService)(new userId_1.UserId(userId.toString()));
        return res.status(200).json({
            success: true,
            message: "Data fetched successfully",
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.citizenDataController = citizenDataController;
