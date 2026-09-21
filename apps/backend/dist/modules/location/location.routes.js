"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const location_controller_1 = require("./controllers/location.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
// apply middlewares to protect routes
router.use(auth_middleware_1.authMiddleware);
// console.log("state route hit");
router.get('/states', (req, res, next) => {
    console.log("📍 /states route handler reached");
    next();
}, location_controller_1.getStates);
router.get('/districts', location_controller_1.getDistricts);
router.get('/talukas', location_controller_1.getTalukas);
router.get('/villages', location_controller_1.getVillages);
exports.default = router;
