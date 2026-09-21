"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchemeValidation = void 0;
const zod_1 = require("zod");
/**
 * @description Validation schema for deleting a scheme
 */
exports.deleteSchemeValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Scheme ID format'),
    }),
});
