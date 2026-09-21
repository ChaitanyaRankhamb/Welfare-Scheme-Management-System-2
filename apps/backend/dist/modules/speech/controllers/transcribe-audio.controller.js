"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscribeAudioController = void 0;
const audio_transcription_service_1 = require("../service/audio-transcription.service");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Controller to handle speech audio transcription for Marathi and English
 * @param {AuthRequest} req - Express request with audio file
 * @param {Response} res - Express response
 * @returns {Promise<Response>}
 * @flow
 * 1. Validate audio file presence from Multer
 * 2. Extract language preference ('mr' or 'en' or 'auto')
 * 3. Call audioTranscriptionService
 * 4. Return transcribed text in response
 */
const TranscribeAudioController = async (req, res) => {
    console.log('🎙️ [Speech Controller] TranscribeAudioController called');
    try {
        if (!req.file) {
            console.log('❌ [Speech Controller] No audio file uploaded');
            throw new AppError_1.AppError('No audio file provided in request', 400);
        }
        // Extract language parameter from query or body
        const queryLang = typeof req.query.language === 'string' ? req.query.language : undefined;
        const bodyLang = typeof req.body.language === 'string' ? req.body.language : undefined;
        const language = queryLang || bodyLang || 'mr'; // Default to Marathi ('mr')
        const prompt = (req.body.prompt || req.query.prompt);
        console.log(`🌐 [Speech Controller] Requested language: "${language}"`);
        console.log(`📊 [Speech Controller] File size: ${(req.file.size / 1024).toFixed(2)} KB, mimetype: ${req.file.mimetype}`);
        const result = await (0, audio_transcription_service_1.audioTranscriptionService)({
            audioBuffer: req.file.buffer,
            mimeType: req.file.mimetype || 'audio/webm',
            originalName: req.file.originalname || 'recording.webm',
            language,
            prompt,
        });
        console.log('📤 [Speech Controller] Sending response to client');
        return (0, response_1.successResponse)(res, {
            text: result.text,
            language: result.language,
        }, 'Audio transcribed successfully');
    }
    catch (error) {
        console.log('🔥 [Speech Controller] Error occurred:', error);
        return (0, response_1.errorResponse)(res, error.message || 'Error transcribing audio', error.statusCode || 500);
    }
};
exports.TranscribeAudioController = TranscribeAudioController;
