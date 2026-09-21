"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleQueryController = void 0;
const handle_query_service_1 = require("../service/handle-query.service");
const userId_1 = require("../../../entity/user/userId");
const HandleQueryController = async (req, res, next) => {
    try {
        const { query } = req.body;
        const userId = req.userId;
        if (!query) {
            res.status(400).json({ success: false, message: 'Query string is required' });
            return;
        }
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const response = await (0, handle_query_service_1.handleQueryService)(query, new userId_1.UserId(userId));
        res.status(200).json({ success: true, data: response });
    }
    catch (error) {
        next(error);
    }
};
exports.HandleQueryController = HandleQueryController;
