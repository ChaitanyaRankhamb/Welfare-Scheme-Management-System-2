"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkUsername_controller_1 = require("./checkUsername.controller");
const router = express_1.default.Router();
/**
 * Route to check username availability.
 * Expected query param: ?username=example
 */
router.get("/", checkUsername_controller_1.checkUsernameController);
exports.default = router;
