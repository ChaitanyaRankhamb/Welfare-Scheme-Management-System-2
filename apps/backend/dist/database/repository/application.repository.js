"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationRepository = exports.ApplicationModelRepo = void 0;
const applicationId_1 = require("../../entity/application/applicationId");
const userId_1 = require("../../entity/user/userId");
const schemeId_1 = require("../../entity/schemes/schemeId");
const application_model_1 = require("../mongo/models/application.model");
const application_entity_1 = require("../../entity/application/application.entity");
class ApplicationModelRepo {
    mapToDomain(doc) {
        const userIdStr = doc.userId?._id ? doc.userId._id.toString() : doc.userId.toString();
        const schemeIdStr = doc.schemeId?._id ? doc.schemeId._id.toString() : doc.schemeId.toString();
        return new application_entity_1.Application(new applicationId_1.ApplicationId(doc._id.toString()), new userId_1.UserId(userIdStr), new schemeId_1.SchemeId(schemeIdStr), doc.status, doc.isDeleted, doc.createdAt, doc.updatedAt);
    }
    async createApplication(data) {
        const newDoc = new application_model_1.ApplicationModel({
            userId: data.userId,
            schemeId: data.schemeId,
            status: data.status,
            isDeleted: data.isDeleted
        });
        const savedDoc = await newDoc.save();
        return this.mapToDomain(savedDoc);
    }
    async findApplicationById(id) {
        const doc = await application_model_1.ApplicationModel.findById(id);
        if (!doc)
            return null;
        return this.mapToDomain(doc);
    }
    async findApplicationsByUserId(userId, includeDeleted = false, skip = 0, limit = 20) {
        const query = { userId };
        if (!includeDeleted) {
            query.isDeleted = false;
        }
        const [docs, total] = await Promise.all([
            application_model_1.ApplicationModel.find(query).skip(skip).limit(limit),
            application_model_1.ApplicationModel.countDocuments(query)
        ]);
        return {
            applications: docs.map(doc => this.mapToDomain(doc)),
            total
        };
    }
    async findAllApplications(skip = 0, limit = 20) {
        const [docs, total] = await Promise.all([
            application_model_1.ApplicationModel.find({}).skip(skip).limit(limit).populate('userId').populate('schemeId'), // Admin usually needs more info
            application_model_1.ApplicationModel.countDocuments({})
        ]);
        return {
            applications: docs.map(doc => this.mapToDomain(doc)),
            total
        };
    }
    async findApplicationByUserAndScheme(userId, schemeId) {
        const doc = await application_model_1.ApplicationModel.findOne({ userId, schemeId });
        if (!doc)
            return null;
        return this.mapToDomain(doc);
    }
    async updateApplication(id, application) {
        const updatedDoc = await application_model_1.ApplicationModel.findByIdAndUpdate(id, {
            status: application.getStatus(),
            isDeleted: application.getIsDeleted(),
        }, { new: true });
        if (!updatedDoc)
            return null;
        return this.mapToDomain(updatedDoc);
    }
}
exports.ApplicationModelRepo = ApplicationModelRepo;
exports.applicationRepository = new ApplicationModelRepo();
