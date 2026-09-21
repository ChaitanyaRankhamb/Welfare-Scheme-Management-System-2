"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const transcribe_audio_controller_1 = require("./controllers/transcribe-audio.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Configure Multer for in-memory audio file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 25 * 1024 * 1024, // 25 MB max
    },
    fileFilter: (_req, file, cb) => {
        // Accept standard audio formats
        if (file.mimetype.startsWith('audio/') || file.mimetype === 'video/webm' || file.mimetype === 'application/octet-stream') {
            cb(null, true);
        }
        else {
            cb(null, true); // Permissive for browser-recorded audio blobs
        }
    },
});
/**
 * @route POST /api/speech/transcribe
 * @desc Transcribe audio recording into Marathi/English text using Groq Whisper Large v3
 * @access Private (authenticated citizens/admins) or public fallback
 */
router.post('/transcribe', auth_middleware_1.authMiddleware, upload.single('audio'), transcribe_audio_controller_1.TranscribeAudioController);
exports.default = router;
