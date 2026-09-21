"use client";

import React, { useState } from "react";
import {
  FileUp,
  FileText,
  CheckCircle,
  UploadCloud,
  X,
  Loader2,
  Trash2,
} from "lucide-react";
import { ProfileSection } from "./profile-section";
import { profileApi } from "../api/profileApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

interface DocumentType {
  id: string;
  name: string;
  description: string;
  status: "pending" | "uploading" | "completed" | "error";
  file?: File;
  errorMessage?: string;
  documentId?: string;
}

interface SmartDocumentUploadProps {
  onDataExtracted?: (extractedData: any) => void;
  initialDocuments?: Array<{
    documentId?: string;
    _id?: string;
    documentType?: string;
    originalFileName?: string;
    status?: string;
  }>;
}

export function SmartDocumentUpload({
  onDataExtracted,
  initialDocuments,
}: SmartDocumentUploadProps) {
  const { language } = useLanguage();
  const [documents, setDocuments] = useState<DocumentType[]>([
    {
      id: "aadhaar",
      name: "Aadhaar Card",
      description: "Used for autofilling Personal & Address details",
      status: "pending",
    },
    {
      id: "bank_passbook",
      name: "Bank Passbook",
      description: "Used for autofilling Bank Account details",
      status: "pending",
    },
    {
      id: "income_certificate",
      name: "Income Certificate",
      description: "Used for autofilling Socio-Economic & Income details",
      status: "pending",
    },
    {
      id: "caste_certificate",
      name: "Caste Certificate",
      description: "Required for category-based welfare schemes",
      status: "pending",
    },
    {
      id: "domicile_certificate",
      name: "Domicile / Resident Certificate",
      description: "Proof of state residency for local schemes",
      status: "pending",
    },
  ]);

  React.useEffect(() => {
    if (!Array.isArray(initialDocuments)) return;

    const normalizeDocumentType = (type: string | undefined) =>
      (type || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    const documentTypeAliases: Record<string, string[]> = {
      aadhaar: ["aadhaar", "aadhar", "aadhaarcard", "aadharcard"],
      bank_passbook: ["bankpassbook", "passbook", "bankaccount"],
      income_certificate: ["incomecertificate", "income"],
      caste_certificate: ["castecertificate", "caste"],
      domicile_certificate: [
        "domicilecertificate",
        "domicile",
        "domicileresidentcertificate",
        "residentcertificate",
        "residencecertificate",
      ],
    };

    setDocuments((prev) =>
      prev.map((doc) => {
        const aliases = documentTypeAliases[doc.id] || [
          normalizeDocumentType(doc.id),
        ];
        const found = initialDocuments.find((document) => {
          const type = normalizeDocumentType(document.documentType);
          return aliases.includes(type);
        });

        if (!found) return doc;

        return {
          ...doc,
          status: "completed",
          documentId: found.documentId || found._id,
          file: { name: found.originalFileName || doc.name } as File,
        };
      }),
    );
  }, [initialDocuments]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docId: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? { ...doc, file, status: "uploading", errorMessage: undefined }
          : doc,
      ),
    );

    try {
      // Call the backend API with language parameter
      const result = await profileApi.uploadDocument(file, docId, language);

      if (result.success && result.data?.extractedData) {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === docId
              ? {
                  ...doc,
                  status: "completed",
                  errorMessage: undefined,
                  documentId: result.data.documentId,
                }
              : doc,
          ),
        );

        // Pass extracted data back to the form
        if (onDataExtracted) {
          onDataExtracted(result.data.extractedData);
          toast.success("Document Uploaded & Data Extracted", {
            description:
              "The document was successfully uploaded and data has been extracted.",
          });
        }
      } else {
        // Backend returned success: false or missing data
        toast.error("Upload Failed", {
          description: result.message || "AI could not verify document type.",
        });
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === docId
              ? {
                  ...doc,
                  file: undefined,
                  status: "pending",
                  errorMessage:
                    result.message || "AI could not verify document type.",
                }
              : doc,
          ),
        );
      }
    } catch (error: any) {
      console.error("Document upload error:", error);
      const errorMsg = error.message || "Network error occurred.";

      // Trigger toast error notification so it disappears automatically
      toast.error("Upload Failed", {
        description: errorMsg,
      });

      // Reset state back to pending so error text does not stick on the card UI
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === docId
            ? {
                ...doc,
                file: undefined,
                status: "pending",
                errorMessage: undefined,
              }
            : doc,
        ),
      );
    }
  };

  const removeFile = async (docId: string, documentId?: string) => {
    if (documentId) {
      try {
        await profileApi.deleteDocument(documentId);
        toast.success("Document deleted successfully");
      } catch (e) {
        console.error("Failed to delete document", e);
        toast.error("Failed to delete document");
      }
    }
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              file: undefined,
              status: "pending",
              documentId: undefined,
            }
          : doc,
      ),
    );
  };

  return (
    <ProfileSection
      id="smart-document-upload"
      title="Smart Document Upload"
      description="Upload your documents to automatically fill in your profile details using AI."
      icon={<FileUp className="h-full w-full" />}
      isOptional={true}
    >
      <div className="col-span-1 md:col-span-2 space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="relative rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4 transition-all hover:border-primary/50"
          >
            <div className="flex items-center gap-4 flex-1">
              <div
                className={cn(
                  "h-12 w-12 rounded-lg flex items-center justify-center shrink-0",
                  doc.status === "completed"
                    ? "bg-primary/10 text-primary"
                    : doc.status === "uploading"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                )}
              >
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{doc.name}</h4>
                  {doc.status === "completed" && (
                    <Badge className="bg-primary/10 text-primary border-none text-xs">
                      Uploaded
                    </Badge>
                  )}
                  {doc.status === "uploading" && (
                    <Badge className="bg-primary/10 text-primary border-none text-xs">
                      Extracting Data...
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {doc.description}
                </p>

                {doc.file && doc.status === "completed" && (
                  <span className="text-xs font-medium text-foreground mt-2 flex items-center gap-1">
                    {doc.file.name}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 flex items-center">
              {doc.status === "pending" || doc.status === "error" ? (
                <div className="relative">
                  <input
                    type="file"
                    id={`file-upload-${doc.id}`}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, doc.id)}
                  />
                  <Button
                    variant="outline"
                    className="pointer-events-none gap-2 rounded-xl"
                    title="Upload Document"
                  >
                    <UploadCloud className="h-4 w-4" /> Upload
                  </Button>
                </div>
              ) : doc.status === "uploading" ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin mr-4" />
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 h-8 w-8 cursor-pointer"
                    onClick={() => removeFile(doc.id, doc.documentId)}
                    title="Remove Document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <CheckCircle className="h-6 w-6 text-primary mr-4" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ProfileSection>
  );
}
