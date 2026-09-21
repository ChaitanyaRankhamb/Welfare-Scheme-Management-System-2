"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeQuery = void 0;
const appError_1 = require("../../../Error/appError");
const normalizeQuery = (query) => {
    if (!query) {
        throw new appError_1.AppError("query is not found", 400);
    }
    let normalized = query.toLowerCase();
    // remove special chars
    normalized = normalized.replace(/[^\w\s]/gi, "");
    // trim + remove extra spaces
    normalized = normalized.trim().replace(/\s+/g, " ");
    return normalized;
};
exports.normalizeQuery = normalizeQuery;
