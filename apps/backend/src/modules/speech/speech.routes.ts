import { Router } from 'express';
import multer from 'multer';
import { TranscribeAudioController } from './controllers/transcribe-audio.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Configure Multer for in-memory audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max
  },
  fileFilter: (_req, file, cb) => {
    // Accept standard audio formats
    if (file.mimetype.startsWith('audio/') || file.mimetype === 'video/webm' || file.mimetype === 'application/octet-stream') {
      cb(null, true);
    } else {
      cb(null, true); // Permissive for browser-recorded audio blobs
    }
  },
});

/**
 * @route POST /api/speech/transcribe
 * @desc Transcribe audio recording into Marathi/English text using Groq Whisper Large v3
 * @access Private (authenticated citizens/admins) or public fallback
 */
router.post('/transcribe', authMiddleware, upload.single('audio'), TranscribeAudioController);

export default router;
