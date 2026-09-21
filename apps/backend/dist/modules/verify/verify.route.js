"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_controller_1 = require("./verify.controller");
const resend_controller_1 = require("./resend.controller");
const router = express_1.default.Router();
// Route to verify user email with a code
// Expected body: { email: string, code: number }
router.post("/", verify_controller_1.verifyController);
// Route to resend the verification code
// Expected body or query: { email: string }
router.post("/resend-verification-code", resend_controller_1.resendController);
exports.default = router;
