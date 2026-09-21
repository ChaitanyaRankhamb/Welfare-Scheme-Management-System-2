import { DocumentId } from './documentId';
import { UserId } from '../user/userId';

export interface StorageInfo {
  provider: string;
  bucket: string;
  objectKey: string;
}

export interface DocumentSnapshot {
  userId: UserId;
  documentType: string;
  originalFileName: string;
  mimeType: string;
  size: number;
  storage: StorageInfo;
  status: string;
}

export class DocumentEntity {
  constructor(
    public readonly id: DocumentId,
    private snapshot: DocumentSnapshot,
    public readonly uploadedAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  getUserId(): UserId {
    return this.snapshot.userId;
  }

  getSnapshot(): Readonly<DocumentSnapshot> {
    return this.snapshot;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getDocumentType(): string {
    return this.snapshot.documentType;
  }

  getOriginalFileName(): string {
    return this.snapshot.originalFileName;
  }

  getMimeType(): string {
    return this.snapshot.mimeType;
  }

  getSize(): number {
    return this.snapshot.size;
  }

  getStorage(): StorageInfo {
    return this.snapshot.storage;
  }

  getStatus(): string {
    return this.snapshot.status;
  }

  setStatus(status: string): void {
    this.snapshot.status = status;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
