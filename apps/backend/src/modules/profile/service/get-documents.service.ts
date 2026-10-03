import { documentRepository } from "../../../database/repository/document.repository";
import { AppError } from "../../../reuse-components/AppError";
import {
  cacheDocuments,
  getCachedDocuments,
} from "../../../redis-cache/profile-cache.service";

export const getDocumentsService = async (userId: string) => {
  if (!userId) throw new AppError("Unauthorized", 401);

  // 1. Process Redis cache first
  const cachedDocs = await getCachedDocuments(userId);
  if (cachedDocs) {
    return cachedDocs;
  }

  // 2. Fallback to database query if cache miss
  const documents = await documentRepository.findDocumentsByUserId(userId);

  const formattedDocs = documents.map((document) => ({
    documentId: document.id.value,
    documentType: document.getDocumentType(),
    originalFileName: document.getOriginalFileName(),
    mimeType: document.getMimeType(),
    size: document.getSize(),
    status: document.getStatus(),
    uploadedAt: document.uploadedAt,
  }));

  // 3. Cache document list for future requests
  await cacheDocuments(userId, formattedDocs);

  return formattedDocs;
};
