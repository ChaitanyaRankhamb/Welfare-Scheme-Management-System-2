import { Groq } from 'groq-sdk';
import { toFile } from 'groq-sdk';

/**
 * Domain-specific vocabulary prompts for Groq Whisper.
 * Passing language-specific prompts primes the Whisper decoder for high accuracy Devanagari Marathi or English.
 */
const MARATHI_PROMPT =
  'हे संभाषण शुद्ध मराठी भाषेत आहे. सरकारी योजना, शेतकरी, पीएम किसान, पीक विमा, महाडीबीटी, ' +
  'आधार कार्ड, उत्पन्न दाखला, रेशन कार्ड, शिष्यवृत्ती, अर्ज, नोंदणी, पात्रता, अनुदान, आयुष्यमान भारत, ' +
  'संजय गांधी निराधार योजना, घरकुल योजना, कृषी विभाग.';

const ENGLISH_PROMPT =
  'Government welfare schemes, eligibility criteria, PM Kisan, farmer subsidies, scholarship, ' +
  'Ayushman Bharat, MahaDBT, ration card, income certificate, caste certificate, application process.';

const MULTILINGUAL_PROMPT =
  'सरकारी योजना, शेतकरी, पीएम किसान, पीक विमा, Government welfare schemes, PM Kisan, MahaDBT, scholarship, eligibility.';

export interface TranscribeAudioOptions {
  audioBuffer: Buffer;
  mimeType?: string;
  originalName?: string;
  language?: string; // 'mr' for Marathi, 'en' for English, or 'auto' / undefined
  prompt?: string;
}

/**
 * Transcribe audio using Groq Whisper Large v3 with Marathi and English support.
 */
export const audioTranscriptionService = async ({
  audioBuffer,
  mimeType = 'audio/webm',
  originalName = 'audio.webm',
  language,
  prompt,
}: TranscribeAudioOptions): Promise<{ text: string; language: string }> => {
  console.log('⚙️ [Speech Service] audioTranscriptionService initiated');

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.log('❌ [Speech Service] GROQ_API_KEY is not defined in environment');
      throw new Error('GROQ_API_KEY is not defined in the environment variables.');
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      console.log('❌ [Speech Service] Empty audio buffer received');
      throw new Error('No audio data provided for transcription');
    }

    console.log(`📦 [Speech Service] Audio buffer size: ${(audioBuffer.length / 1024).toFixed(2)} KB, mimeType: ${mimeType}`);

    // Convert Buffer to a File object compatible with Groq SDK
    const file = await toFile(audioBuffer, originalName, { type: mimeType });

    // Normalize and determine language configuration
    let targetLanguage: string | undefined = undefined;
    let defaultPrompt = MULTILINGUAL_PROMPT;

    const normalizedLang = (language || '').toLowerCase().trim();

    if (normalizedLang === 'mr' || normalizedLang === 'marathi') {
      targetLanguage = 'mr';
      defaultPrompt = MARATHI_PROMPT;
    } else if (normalizedLang === 'en' || normalizedLang === 'english') {
      targetLanguage = 'en';
      defaultPrompt = ENGLISH_PROMPT;
    } else if (normalizedLang === 'hi' || normalizedLang === 'hindi') {
      targetLanguage = 'hi';
      defaultPrompt = MARATHI_PROMPT;
    }

    console.log(`🌐 [Speech Service] Target Language: ${targetLanguage ? targetLanguage.toUpperCase() : 'AUTO-DETECT'}`);

    const groqClient = new Groq({ apiKey });

    // Call Groq Whisper Large v3
    console.log('🚀 [Speech Service] Sending audio to Groq Whisper Large v3...');
    const transcription = await groqClient.audio.transcriptions.create({
      file: file,
      model: 'whisper-large-v3',
      language: targetLanguage, // 'mr' for Marathi, 'en' for English, undefined for auto-detect
      prompt: prompt || defaultPrompt,
      temperature: 0.0,
      response_format: 'json',
    });

    const transcribedText = transcription.text ? transcription.text.trim() : '';
    console.log('✅ [Speech Service] Transcription successful!');
    console.log(`📝 [Speech Service] Result text: "${transcribedText}"`);

    return {
      text: transcribedText,
      language: targetLanguage || 'auto',
    };
  } catch (error: any) {
    console.log('🔥 [Speech Service] Error occurred:', error);
    throw new Error(error?.message || 'Failed to transcribe audio with Groq');
  }
};
