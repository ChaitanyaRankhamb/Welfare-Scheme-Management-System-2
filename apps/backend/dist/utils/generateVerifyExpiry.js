"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerifyExpiry = void 0;
const generateVerifyExpiry = async () => {
    return new Date(Date.now() + 15 * 60 * 1000);
};
exports.generateVerifyExpiry = generateVerifyExpiry;
