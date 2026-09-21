"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamQueryController = void 0;
const userId_1 = require("../../../entity/user/userId");
const stream_query_service_1 = require("../service/stream-query.service");
const StreamQueryController = async (req, res, next) => {
    try {
        const query = req.query.query;
        const userId = req.userId;
        if (!query) {
            res.status(400).json({ success: false, message: 'Query string is required' });
            return;
        }
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for Nginx if present
        // Callback to send chunks to the client
        const onChunk = (chunk) => {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        };
        await (0, stream_query_service_1.streamQueryService)(query, new userId_1.UserId(userId), onChunk);
        res.write('data: [DONE]\n\n');
        res.end();
    }
    catch (error) {
        console.error('SSE Stream Error:', error);
        if (!res.headersSent) {
            next(error);
        }
        else {
            res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
            res.end();
        }
    }
};
exports.StreamQueryController = StreamQueryController;
