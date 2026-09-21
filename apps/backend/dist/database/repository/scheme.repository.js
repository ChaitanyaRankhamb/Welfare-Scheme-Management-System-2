"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemeRepository = exports.SchemeModelRepo = void 0;
const schemeId_1 = require("../../entity/schemes/schemeId");
const scheme_model_1 = require("../mongo/models/scheme.model");
const scheme_entity_1 = require("../../entity/schemes/scheme.entity");
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
class SchemeModelRepo {
    // ─── Map DB doc → Domain Entity ─────────────────────────────────────────────
    mapToDomain(doc) {
        return new scheme_entity_1.Scheme(new schemeId_1.SchemeId(doc._id.toString()), doc.title, doc.description, doc.ministry, doc.category, doc.tags ?? [], 
        // Support both old field name (eligibilityCriteria) and new (eligibility)
        doc.eligibility ?? doc.eligibilityCriteria ?? {}, Array.isArray(doc.benefits) ? doc.benefits : [doc.benefits], doc.documentsRequired ?? [], doc.applicationUrl, doc.trackingMeta, doc.status, doc.createdAt, doc.updatedAt);
    }
    // ─── Create ──────────────────────────────────────────────────────────────────
    async createScheme(data) {
        const newDoc = new scheme_model_1.SchemeModel({
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
    async findSchemeById(id) {
        const doc = await scheme_model_1.SchemeModel.findById(id);
        if (!doc)
            return null;
        return this.mapToDomain(doc);
    }
    async findSchemeByName(name) {
        const escapedName = escapeRegex(name); // it will remove special character from scheme to work well with regex
        const doc = await scheme_model_1.SchemeModel.findOne({
            title: { $regex: `^${escapedName}$`, $options: "i" }
        });
        return doc ? this.mapToDomain(doc) : null;
    }
    async findFuzzySchemeByName(name) {
        const escapedName = escapeRegex(name);
        const doc = await scheme_model_1.SchemeModel.findOne({
            title: { $regex: escapedName, $options: "i" }
        });
        return doc ? this.mapToDomain(doc) : null;
    }
    // ─── Find All (admin/paginated) ──────────────────────────────────────────────
    async findAllSchemes(filters = {}, skip = 0, limit = 10) {
        const [docs, total] = await Promise.all([
            scheme_model_1.SchemeModel.find(filters).skip(skip).limit(limit),
            scheme_model_1.SchemeModel.countDocuments(filters),
        ]);
        return {
            schemes: docs.map(doc => this.mapToDomain(doc)),
            total,
        };
    }
    // ─── Find All (no limit, for in-memory rule-based filter) ────────────────────
    async findAllSchemesWithoutLimit() {
        const docs = await scheme_model_1.SchemeModel.find();
        return docs.map(doc => this.mapToDomain(doc));
    }
    async searchSchemes(query, skip = 0, limit = 10) {
        const filters = { $text: { $search: query } };
        const [docs, total] = await Promise.all([
            scheme_model_1.SchemeModel.find(filters).skip(skip).limit(limit),
            scheme_model_1.SchemeModel.countDocuments(filters),
        ]);
        return {
            schemes: docs.map(doc => this.mapToDomain(doc)),
            total,
        };
    }
    async searchByKeywords(keywords) {
        // if no keywords return all schemes
        if (!keywords || keywords.length === 0) {
            return this.findAllSchemesWithoutLimit();
        }
        const query = keywords.join(" ");
        const filters = {
            $or: [
                { $text: { $search: query } },
                { title: { $regex: query, $options: "i" } }
            ]
        };
        const docs = await scheme_model_1.SchemeModel
            .find(filters)
            .sort({ score: { $meta: "textScore" } }) // ranking
            .select({ score: { $meta: "textScore" } });
        return docs.map(doc => this.mapToDomain(doc));
    }
    // ─── Update ──────────────────────────────────────────────────────────────────
    async updateScheme(id, scheme) {
        const updatedDoc = await scheme_model_1.SchemeModel.findByIdAndUpdate(id, {
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
        }, { new: true });
        if (!updatedDoc)
            return null;
        return this.mapToDomain(updatedDoc);
    }
    // ─── Delete ──────────────────────────────────────────────────────────────────
    async deleteScheme(id) {
        const doc = await scheme_model_1.SchemeModel.findByIdAndDelete(id);
        if (!doc)
            return null;
        return this.mapToDomain(doc);
    }
}
exports.SchemeModelRepo = SchemeModelRepo;
exports.schemeRepository = new SchemeModelRepo();
