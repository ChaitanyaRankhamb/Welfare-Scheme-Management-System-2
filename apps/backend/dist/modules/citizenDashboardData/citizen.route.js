"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const citizen_controller_1 = require("./citizen.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const rbac_middleware_1 = require("../../middlewares/rbac.middleware");
const roles_enum_1 = require("../../types/roles.enum");
const router = express_1.default.Router();
router.get("/dashboard", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.authorizeRoles)(roles_enum_1.Role.USER), citizen_controller_1.citizenDataController);
exports.default = router;
