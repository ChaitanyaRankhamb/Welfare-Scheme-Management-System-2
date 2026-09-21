"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSchemesValidation = void 0;
const zod_1 = require("zod");
/**
 * @description Validation schema for searching schemes
 */
exports.searchSchemesValidation = zod_1.z.object({
    query: zod_1.z.object({
        keyword: zod_1.z.string().optional(),
        category: zod_1.z.enum([
            'Agriculture',
            'Education',
            'Health',
            'Housing',
            'Finance',
            'Social Welfare',
            'Employment',
            'Other'
        ]).optional(),
        state: zod_1.z.string().optional(),
        page: zod_1.z.coerce.number().int().min(1).default(1),
        limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    }),
});
