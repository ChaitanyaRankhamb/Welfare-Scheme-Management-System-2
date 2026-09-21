import { minioClient } from "../../../config/minio";
import { documentRepository } from "../../../database/repository/document.repository";
import { UserModel } from "../../../database/mongo/models/user.model";
import { AppError } from "../../../reuse-components/AppError";

export const deleteDocumentService = async (
  userId: string,
  documentId: string,
) => {
  const document = await documentRepository.findDocumentByIdAndUserId(
    documentId,
    userId,
  );

  if (!document) {
    throw new AppError(
      "Document not found or does not belong to the user",
      404,
    );
  }

  const { bucket, objectKey } = document.getStorage();

  try {
    await minioClient.removeObject(bucket, objectKey);
  } catch (error) {
    console.error("[DeleteDocumentService] MinIO deletion failed", {
      documentId,
      userId,
      bucket,
      objectKey,
      error,
    });

    throw new AppError("Failed to delete document from storage", 500);
  }

  try {
    await documentRepository.deleteDocumentById(documentId);
  } catch (error) {
    console.error("[DeleteDocumentService] Database deletion failed", {
      documentId,
      userId,
      error,
    });

    // Important: MinIO is already deleted.
    // A reconciliation/cleanup mechanism should handle this inconsistency.

    throw new AppError(
      "Document storage was deleted, but database cleanup failed",
      500,
    );
  }

  return {
    message: "Document deleted successfully",
  };
};
