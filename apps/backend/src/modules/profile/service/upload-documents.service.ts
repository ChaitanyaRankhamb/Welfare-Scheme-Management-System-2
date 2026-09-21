import { GoogleGenAI, Type } from "@google/genai";
import { minioClient, BUCKET_NAME } from "../../../config/minio";
import { ProfileModel } from "../../../database/mongo/models/profile.model";
import { documentRepository } from "../../../database/repository/document.repository";
import { AppError } from "../../../reuse-components/AppError";
import { Types } from "mongoose";
import crypto from "crypto";
import { getDocumentVerificationPrompt } from "../document-prompts";
import { getGeminiDataSchema } from "../document-schemas";
import { validateDocumentExtraction } from "../../../validations/document/document-extraction.validation";

// Initialize Gemini
const geminiApiKey =
  process.env.GEMINI_API_KEY || "AIzaSyDqA5RGR_XnNIHgooGnww0C-yx6SzgVfaU";

const genAI = new GoogleGenAI({
  apiKey: geminiApiKey,
});

export const uploadDocumentService = async (
  userId: string,
  file: Express.Multer.File,
  documentType: string,
  language: string = 'en',
) => {
  console.log("[UploadService] Document processing started.");
  console.log(
    `[UploadService] UserID=${userId}, DocumentType=${documentType}, Language=${language}, FileSize=${file.size}`,
  );

  if (!geminiApiKey) {
    console.error("[UploadService] GEMINI_API_KEY is not configured.");
    throw new AppError("API key is required", 401);
  }

  const prompt = getDocumentVerificationPrompt(documentType, language);
  const dataSchema = getGeminiDataSchema(documentType);

  // ============================================================
  // 4. CALL GEMINI
  // ============================================================

  let extractedData: unknown;
  let aiResult: {
    documentType: string;
    valid: boolean;
    data: unknown;
  };

  try {
    console.log("[UploadService] Calling Gemini API...");

    const response = await genAI.models.generateContent({
      model: "gemini-3.1-flash-lite",

      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
            {
              inlineData: {
                data: file.buffer.toString("base64"),
                mimeType: file.mimetype,
              },
            },
          ],
        },
      ],

      config: {
        temperature: 0.0,
        responseMimeType: "application/json",

        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentType: {
              type: Type.STRING,
              nullable: true,
            },
            valid: {
              type: Type.BOOLEAN,
            },
            data: dataSchema,
          },
          required: ["documentType", "valid", "data"],
        },
      },
    });

    const text = response.text?.trim();

    if (!text) {
      console.error("[UploadService] Gemini returned an empty response.");
      throw new AppError("AI returned an empty response", 502);
    }

    console.log("[UploadService] Gemini response received.");

    // ==========================================================
    // 5. PARSE GEMINI RESPONSE
    // ==========================================================

    try {
      extractedData = JSON.parse(text);
    } catch (parseError) {
      console.error("[UploadService] Failed to parse Gemini response:", text);

      throw new AppError("Invalid response received from AI service", 502);
    }

    // ==========================================================
    // 6. VALIDATE GEMINI RESPONSE & ZOD VALIDATION
    // ==========================================================

    if (
      typeof extractedData !== "object" ||
      extractedData === null ||
      !("valid" in extractedData)
    ) {
      console.error(
        "[UploadService] Gemini returned an invalid response structure.",
      );

      throw new AppError("Invalid response received from AI service", 502);
    }

    aiResult = extractedData as {
      documentType: string;
      valid: boolean;
      data: unknown;
    };

    if (aiResult.valid !== true) {
      console.warn(`[UploadService] Gemini rejected the ${documentType}.`);

      throw new AppError(
        `Invalid document: the uploaded file could not be verified as a ${documentType}`,
        400,
      );
    }

    if (aiResult.data === null || aiResult.data === undefined) {
      console.error(
        "[UploadService] Gemini marked document valid but returned no data.",
      );

      throw new AppError(
        "AI verified the document but failed to extract its data",
        502,
      );
    }

    // Perform Document-Specific Zod Validation
    const zodValidation = validateDocumentExtraction(documentType, aiResult.data);
    if (!zodValidation.success) {
      console.warn("[UploadService] Zod extraction validation warnings:", zodValidation.error?.format());
    } else {
      aiResult.data = zodValidation.data;
    }

    console.log("[UploadService] Gemini & Zod validation successful.");
    console.log("[UploadService] Extracted Data:", aiResult.data);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error("[UploadService] Gemini API error:", error);

    throw new AppError("Failed to analyze document using AI service", 502);
  }

  // ============================================================
  // 7. GENERATE UNIQUE MINIO OBJECT NAME
  // ============================================================

  const fileExtension = file.originalname.includes(".")
    ? file.originalname.substring(file.originalname.lastIndexOf("."))
    : "";

  const documentId = crypto.randomUUID();

  const objectName =
    `users/${userId}/documents/` +
    `${documentType}/${documentId}${fileExtension}`;

  console.log(`[UploadService] Generated MinIO object key: ${objectName}`);

  // ============================================================
  // 8. UPLOAD TO MINIO
  // ============================================================

  let documentUrl: string;

  try {
    console.log(
      `[UploadService] Uploading document to MinIO bucket '${BUCKET_NAME}'...`,
    );

    await minioClient.putObject(
      BUCKET_NAME,
      objectName,
      file.buffer,
      file.size,
      {
        "Content-Type": file.mimetype,
      },
    );

    console.log("[UploadService] MinIO upload successful.");

    /**
     * Prefer storing the object key rather than constructing a
     * public URL manually if your MinIO bucket is private.
     *
     * For now, this follows your existing design of storing a URL.
     */
    const minioEndpoint = process.env.MINIO_ENDPOINT || "localhost";

    const minioPort = process.env.MINIO_PORT || "9000";

    const minioProtocol =
      process.env.MINIO_USE_SSL === "true" ? "https" : "http";

    documentUrl =
      `${minioProtocol}://${minioEndpoint}:${minioPort}` +
      `/${BUCKET_NAME}/${objectName}`;
  } catch (uploadError) {
    console.error("[UploadService] MinIO upload failed:", uploadError);
    throw new AppError("Failed to store document in secure storage", 503);
  }

  let savedDocumentId: string | undefined;

  // ============================================================
  // 9. UPDATE MONGODB
  // ============================================================

  try {
    console.log(
      `[UploadService] Creating document record for user ${userId}...`,
    );

    const newDocument = await documentRepository.createDocument({
      userId: userId,
      documentType: documentType,
      originalFileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      storage: {
        provider: "minio",
        bucket: BUCKET_NAME,
        objectKey: objectName,
      },
      status: "uploaded",
    });

    if (!newDocument) {
      console.error("[UploadService] Document record could not be created.");

      throw new AppError("Document record could not be created", 500);
    }

    savedDocumentId = newDocument.id.value;

    console.log(
      "[UploadService] MongoDB document record created successfully.",
    );
  } catch (dbError) {
    console.error("[UploadService] MongoDB update failed:", dbError);

    // ==========================================================
    // 10. CLEANUP MINIO OBJECT
    // ==========================================================

    try {
      console.log("[UploadService] Attempting MinIO cleanup...");

      await minioClient.removeObject(BUCKET_NAME, objectName);

      console.log("[UploadService] MinIO cleanup successful.");
    } catch (cleanupError) {
      console.error(
        "[UploadService] CRITICAL: Failed to cleanup MinIO object:",
        {
          bucket: BUCKET_NAME,
          objectName,
          cleanupError,
        },
      );
    }

    if (dbError instanceof AppError) {
      throw dbError;
    }

    throw new AppError("Failed to link document to user profile", 500);
  }

  // ============================================================
  // 11. RETURN RESPONSE
  // ============================================================

  console.log("[UploadService] Document processing completed successfully.");

  return {
    message: "Document successfully verified and stored",
    data: {
      documentType: aiResult.documentType || documentType,
      extractedData: aiResult.data,
      documentUrl,
      documentId: savedDocumentId,
    },
  };
};
