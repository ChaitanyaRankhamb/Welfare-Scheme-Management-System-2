import { IDocumentRepository, CreateDocumentData } from '../../repository/document.repository';
import { DocumentId } from '../../entity/document/documentId';
import { UserId } from '../../entity/user/userId';
import { DocumentModel } from '../mongo/models/document.model';
import { DocumentEntity, DocumentSnapshot } from '../../entity/document/document.entity';
import { Types } from 'mongoose';

export class DocumentModelRepo implements IDocumentRepository {

  private mapToDomain(doc: any): DocumentEntity {
    const snapshot: DocumentSnapshot = {
      userId: new UserId(doc.userId.toString()),
      documentType: doc.documentType,
      originalFileName: doc.originalFileName,
      mimeType: doc.mimeType,
      size: doc.size,
      storage: {
        provider: doc.storage.provider,
        bucket: doc.storage.bucket,
        objectKey: doc.storage.objectKey
      },
      status: doc.status
    };

    return new DocumentEntity(
      new DocumentId(doc._id.toString()),
      snapshot,
      doc.uploadedAt,
      doc.updatedAt
    );
  }

  async createDocument(data: CreateDocumentData): Promise<DocumentEntity> {
    const newDoc = new DocumentModel({
      userId: new Types.ObjectId(data.userId),
      documentType: data.documentType,
      originalFileName: data.originalFileName,
      mimeType: data.mimeType,
      size: data.size,
      storage: data.storage,
      status: data.status || 'uploaded'
    });

    const savedDoc = await newDoc.save();
    return this.mapToDomain(savedDoc);
  }

  async findDocumentById(id: string): Promise<DocumentEntity | null> {
    const doc = await DocumentModel.findById(id);
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async findDocumentsByUserId(userId: string): Promise<DocumentEntity[]> {
    console.log(`[DocumentRepository] Fetching documents for userId: ${userId}`);
    const docs = await DocumentModel.find({ userId: new Types.ObjectId(userId) });
    return docs.map(doc => this.mapToDomain(doc));
  }

  async findDocumentByIdAndUserId(id: string, userId: string): Promise<DocumentEntity | null> {
    const doc = await DocumentModel.findOne({ _id: id, userId: new Types.ObjectId(userId) });
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async deleteDocumentById(id: string): Promise<boolean> {
    const result = await DocumentModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

export const documentRepository = new DocumentModelRepo();
