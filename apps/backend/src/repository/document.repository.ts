import { DocumentEntity } from '../entity/document/document.entity';

export interface CreateDocumentData {
  userId: string;
  documentType: string;
  originalFileName: string;
  mimeType: string;
  size: number;
  storage: {
    provider: string;
    bucket: string;
    objectKey: string;
  };
  status?: string;
}

export interface IDocumentRepository {
  createDocument(data: CreateDocumentData): Promise<DocumentEntity>;
  findDocumentById(id: string): Promise<DocumentEntity | null>;
  findDocumentsByUserId(userId: string): Promise<DocumentEntity[]>;
  findDocumentByIdAndUserId(id: string, userId: string): Promise<DocumentEntity | null>;
  deleteDocumentById(id: string): Promise<boolean>;
}
