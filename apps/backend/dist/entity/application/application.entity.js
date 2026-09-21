"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
class Application {
    id;
    userId;
    schemeId;
    status;
    isDeleted;
    createdAt;
    updatedAt;
    constructor(id, userId, schemeId, status, isDeleted, createdAt, updatedAt) {
        this.id = id;
        this.userId = userId;
        this.schemeId = schemeId;
        this.status = status;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    getUserId() {
        return this.userId;
    }
    getSchemeId() {
        return this.schemeId;
    }
    getStatus() {
        return this.status;
    }
    getIsDeleted() {
        return this.isDeleted;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    markApplied() {
        if (this.isDeleted)
            return;
        this.status = 'APPLIED';
        this.touch();
    }
    remove() {
        this.isDeleted = true;
        this.touch();
    }
    restore() {
        this.isDeleted = false;
        this.touch();
    }
    touch() {
        this.updatedAt = new Date();
    }
}
exports.Application = Application;
