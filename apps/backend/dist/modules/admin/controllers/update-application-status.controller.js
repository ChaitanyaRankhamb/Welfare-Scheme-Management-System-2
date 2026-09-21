"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatusController = void 0;
const update_application_status_service_1 = require("../service/update-application-status.service");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
const updateApplicationStatusController = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId)
            throw new AppError_1.AppError('Unauthorized', 401);
        const { id } = req.params;
        const { status } = req.body;
        const result = await (0, update_application_status_service_1.updateApplicationStatusService)(userId, id, status);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Internal Server Error', error.statusCode || 500);
    }
};
exports.updateApplicationStatusController = updateApplicationStatusController;
