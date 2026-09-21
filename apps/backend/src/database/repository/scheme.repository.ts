import { ISchemeRepository, CreateSchemeData, SchemeProfileFilter } from '../../repository/scheme.repository';
import { SchemeId } from '../../entity/schemes/schemeId';
import { SchemeModel } from '../mongo/models/scheme.model';
import { Scheme } from '../../entity/schemes/scheme.entity';

export class SchemeModelRepo implements ISchemeRepository {

  // ─── Map DB doc → Domain Entity ─────────────────────────────────────────────

  private mapToDomain(doc: any): Scheme {
    return new Scheme(
      new SchemeId(doc._id.toString()),
      doc.title,
      doc.description,
      doc.ministry,
      doc.category,
      doc.tags ?? [],
      // Support both old field name (eligibilityCriteria) and new (eligibility)
      doc.eligibility ?? doc.eligibilityCriteria ?? {},
      Array.isArray(doc.benefits) ? doc.benefits : [doc.benefits],
      doc.documentsRequired ?? [],
      doc.applicationUrl,
      doc.trackingMeta,
      doc.status,
      doc.createdAt,
      doc.updatedAt
    );
  }

  // ─── Create ──────────────────────────────────────────────────────────────────

  async createScheme(data: CreateSchemeData): Promise<Scheme> {
    const newDoc = new SchemeModel({
      title: data.title,
      description: data.description,
      ministry: data.ministry,
      category: data.category,
      tags: data.tags,
      eligibility: data.eligibility,
      benefits: data.benefits,
      documentsRequired: data.documentsRequired,
      applicationUrl: data.applicationUrl,
      status: data.status,
    });

    const savedDoc = await newDoc.save();
    return this.mapToDomain(savedDoc);
  }

  // ─── Find by ID ──────────────────────────────────────────────────────────────

  async findSchemeById(id: string): Promise<Scheme | null> {
    const doc = await SchemeModel.findById(id);
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  // ─── Find All (admin/paginated) ──────────────────────────────────────────────

  async findAllSchemes(
    filters: Record<string, unknown> = {},
    skip = 0,
    limit = 10
  ): Promise<{ schemes: Scheme[]; total: number }> {
    const [docs, total] = await Promise.all([
      SchemeModel.find(filters).skip(skip).limit(limit),
      SchemeModel.countDocuments(filters),
    ]);
    return {
      schemes: docs.map(doc => this.mapToDomain(doc)),
      total,
    };
  }

  // ─── Find All (no limit, for in-memory rule-based filter) ────────────────────

  async findAllSchemesWithoutLimit(): Promise<Scheme[]> {
    const docs = await SchemeModel.find();
    return docs.map(doc => this.mapToDomain(doc));
  }

  async searchSchemes(query: string, skip = 0, limit = 10): Promise<{ schemes: Scheme[]; total: number }> {
    const filters = { $text: { $search: query } };
    const [docs, total] = await Promise.all([
      SchemeModel.find(filters).skip(skip).limit(limit),
      SchemeModel.countDocuments(filters),
    ]);
    return {
      schemes: docs.map(doc => this.mapToDomain(doc)),
      total,
    };
  }

  // ─── Update ──────────────────────────────────────────────────────────────────

  async updateScheme(id: string, scheme: Scheme): Promise<Scheme | null> {
    const updatedDoc = await SchemeModel.findByIdAndUpdate(
      id,
      {
        title: scheme.getTitle(),
        description: scheme.getDescription(),
        ministry: scheme.getMinistry(),
        category: scheme.getCategory(),
        tags: scheme.getTags(),
        eligibility: scheme.getEligibility(),
        benefits: scheme.getBenefits(),
        documentsRequired: scheme.getDocumentsRequired(),
        applicationUrl: scheme.getApplicationUrl(),
        trackingMeta: scheme.getTrackingMeta(),
        status: scheme.getStatus(),
      },
      { new: true }
    );

    if (!updatedDoc) return null;
    return this.mapToDomain(updatedDoc);
  }

  // ─── Delete ──────────────────────────────────────────────────────────────────

  async deleteScheme(id: string): Promise<Scheme | null> {
    const doc = await SchemeModel.findByIdAndDelete(id);
    if (!doc) return null;
    return this.mapToDomain(doc);
  }
}

export const schemeRepository = new SchemeModelRepo();
