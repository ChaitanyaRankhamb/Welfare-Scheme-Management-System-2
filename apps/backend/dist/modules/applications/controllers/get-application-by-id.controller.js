"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationByIdController = exports.GetApplicationByIdController = void 0;
const get_application_by_id_service_1 = require("../service/get-application-by-id.service");
class GetApplicationByIdController {
    async getApplicationById(req, res, next) {
        try {
            const userId = req.user._id;
            const { id } = req.params;
            const app = await get_application_by_id_service_1.getApplicationByIdService.getApplicationById(userId, id);
            if (!app) {
                res.status(404).json({ success: false, message: 'Application not found or unauthorized' });
                return;
            }
            res.status(200).json({ success: true, data: app });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.GetApplicationByIdController = GetApplicationByIdController;
exports.getApplicationByIdController = new GetApplicationByIdController();
