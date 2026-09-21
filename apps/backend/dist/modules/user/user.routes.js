"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const register_controller_1 = require("./controllers/register.controller");
const login_controller_1 = require("./controllers/login.controller");
const refresh_controller_1 = require("./controllers/refresh.controller");
const logout_controller_1 = require("./controllers/logout.controller");
const google_controller_1 = require("./controllers/google.controller");
const me_controller_1 = require("./controllers/me.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
// credentials routes
router.post("/register", register_controller_1.registerController);
router.post("/login", login_controller_1.loginController);
router.post("/refresh", refresh_controller_1.refreshController);
// OAuth google routes
// Starts the Google OAuth flow
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
// Handles the Google OAuth callback
router.get("/google/callback", passport_1.default.authenticate("google", { session: false }), google_controller_1.googleCallbackController);
// protected routes
// Returns current user profile
router.get("/me", auth_middleware_1.authMiddleware, me_controller_1.getMeController);
// Updates current user profile (minimal auth properties)
router.put("/me", auth_middleware_1.authMiddleware, me_controller_1.updateMeController);
// Handles user logout
router.post("/logout", auth_middleware_1.authMiddleware, logout_controller_1.logoutController);
exports.default = router;
