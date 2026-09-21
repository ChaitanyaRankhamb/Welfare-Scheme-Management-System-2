"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerifyCode = void 0;
const generateVerifyCode = async () => {
    return Math.floor(100000 + Math.random() * 900000);
};
exports.generateVerifyCode = generateVerifyCode;
