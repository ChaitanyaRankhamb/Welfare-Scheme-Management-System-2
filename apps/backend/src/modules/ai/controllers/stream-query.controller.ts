import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { UserId } from '../../../entity/user/userId';
import { streamQueryService } from '../service/stream-query.service';

export const StreamQueryController = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query.query as string;
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
    const onChunk = (chunk: any) => {
      console.log(`[Stream-Query] ➡️ Sending chunk to frontend:`, chunk);
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    };

    await streamQueryService(query, new UserId(userId), onChunk);

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('SSE Stream Error:', error);
    if (!res.headersSent) {
      next(error);
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      res.end();
    }
  }
};
