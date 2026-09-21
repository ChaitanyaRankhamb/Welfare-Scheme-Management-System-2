import { fetchapi } from '@/lib/refresh-user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001/api';

export interface TranscribeAudioResponse {
  success: boolean;
  data?: {
    text: string;
    language?: string;
  };
  text?: string;
  language?: string;
  message?: string;
}

export const speechAPI = {
  /**
   * Transcribe a recorded audio blob into text using the backend Groq Whisper pipeline.
   * Supports Marathi ('mr'), English ('en'), or auto-detection ('auto').
   *
   * @param {Blob} audioBlob - Audio Blob recorded from citizen's microphone
   * @param {'mr' | 'en' | 'auto'} [language='mr'] - Target language code ('mr' for Marathi, 'en' for English)
   * @param {string} [prompt] - Optional contextual vocabulary bias prompt
   * @returns {Promise<{ success: boolean; text: string; language: string }>}
   */
  transcribeAudio: async (
    audioBlob: Blob,
    language: 'mr' | 'en' | 'auto' = 'mr',
    prompt?: string
  ): Promise<{ success: boolean; text: string; language: string }> => {
    try {
      const baseUrl = API_BASE_URL.replace(/\/+$/, '');
      const url = new URL(`${baseUrl}/speech/transcribe`);
      
      // Add language query parameter for robust retrieval in backend
      url.searchParams.append('language', language);
      if (prompt) {
        url.searchParams.append('prompt', prompt);
      }

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', language);
      if (prompt) {
        formData.append('prompt', prompt);
      }

      const response = await fetchapi(url.toString(), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to transcribe audio');
      }

      const result: TranscribeAudioResponse = await response.json();
      
      // Handle both { data: { text, language } } and top-level { text, language } formats
      const transcribedText = result.data?.text || result.text || '';
      const detectedLang = result.data?.language || result.language || language;

      return {
        success: true,
        text: transcribedText,
        language: detectedLang,
      };
    } catch (error) {
      console.error('Error transcribing audio in speechAPI:', error);
      throw error;
    }
  },
};
