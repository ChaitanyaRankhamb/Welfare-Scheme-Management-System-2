"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemesValidation = void 0;
const zod_1 = require("zod");
/**
 * @description Validation schema for fetching all schemes with pagination
 */
exports.getSchemesValidation = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().min(1).default(1),
        limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    }),
});
