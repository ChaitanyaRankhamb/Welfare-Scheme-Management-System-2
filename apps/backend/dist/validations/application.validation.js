"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationIdSchema = exports.createApplicationSchema = void 0;
const zod_1 = require("zod");
exports.createApplicationSchema = zod_1.z.object({
    body: zod_1.z.object({
        schemeId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Scheme ID format'),
    }),
});
exports.applicationIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Application ID format'),
    }),
});
