"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemeByIdValidation = void 0;
const zod_1 = require("zod");
/**
 * @description Validation schema for fetching a scheme by ID
 */
exports.getSchemeByIdValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Scheme ID format'),
    }),
});
