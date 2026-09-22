import { fetchapi } from "@/lib/refresh-user";
import { handleResponse } from "@/lib/handle-response";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001/api";

export interface ProfileDocument {
  documentId: string;
  documentType: string;
  originalFileName: string;
  mimeType: string;
  size: number;
  status: string;
  uploadedAt?: string;
  updatedAt?: string;
}

export const profileApi = {
  /**
   * Fetches the current user's profile
   */
  getProfile: async () => {
    try {
      const response = await fetchapi(`${API_BASE_URL}/profile`);
      return handleResponse(response, { fallbackMessage: "Failed to fetch profile" });
    } catch (error) {
      console.error("Error in getProfile:", error);
      throw error;
    }
  },

  /**
   * Updates user profile section
   */
  updateSection: async (section: string, data: unknown) => {
    try {
      const response = await fetchapi(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ section, data }),
      });
      return handleResponse(response, { fallbackMessage: "Failed to update profile" });
    } catch (error) {
      console.error("Error in updateProfile:", error);
      throw error;
    }
  },

  uploadDocument: async (file: File, documentType: string, language = "en") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);
    formData.append("language", language);

    const response = await fetchapi(`${API_BASE_URL}/profile/documents`, {
      method: "POST",
      body: formData,
    });
    return handleResponse(response, { fallbackMessage: "Failed to upload document" });
  },

  getDocuments: async (): Promise<{
    success: boolean;
    data?: ProfileDocument[];
    message?: string;
  }> => {
    const response = await fetchapi(`${API_BASE_URL}/profile/documents`);
    return handleResponse(response, { fallbackMessage: "Failed to fetch documents" });
  },

  deleteDocument: async (documentId: string) => {
    const response = await fetchapi(
      `${API_BASE_URL}/profile/documents/${documentId}`,
      { method: "DELETE" },
    );
    return handleResponse(response, { fallbackMessage: "Failed to delete document" });
  },
};
