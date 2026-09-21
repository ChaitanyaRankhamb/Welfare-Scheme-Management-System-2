"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchemeStatusController = void 0;
const publish_scheme_service_1 = require("../service/publish-scheme.service");
const archive_scheme_service_1 = require("../service/archive-scheme.service");
const restore_scheme_service_1 = require("../service/restore-scheme.service");
const userId_1 = require("../../../entity/user/userId");
const appError_1 = require("../../../Error/appError");
const response_1 = require("../../../reuse-components/response");
/**
 * @description General controller for updating scheme status (publish, archive, restore)
 */
const updateSchemeStatusController = async (req, res, next) => {
    try {
        const { id, action } = req.params;
        const userId = req.userId;
        if (!userId) {
            throw new appError_1.AppError('User not authenticated', 401);
        }
        let result;
        switch (action) {
            case 'publish':
                result = await (0, publish_scheme_service_1.publishSchemeService)(new userId_1.UserId(userId), id);
                break;
            case 'archive':
                result = await (0, archive_scheme_service_1.archiveSchemeService)(new userId_1.UserId(userId), id);
                break;
            case 'restore':
                result = await (0, restore_scheme_service_1.restoreSchemeService)(new userId_1.UserId(userId), id);
                break;
            default:
                return res.json({
                    success: false,
                    message: "Invalid action",
                    data: null,
                    status: 400
                });
        }
        if (!result) {
            return res.json({
                success: false,
                message: "Failed to update scheme status",
                data: null,
                status: 500
            });
        }
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        next(error);
    }
};
exports.updateSchemeStatusController = updateSchemeStatusController;
