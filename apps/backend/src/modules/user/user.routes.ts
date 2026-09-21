import express from "express";
import passport from "passport";
import { registerController } from "./controllers/register.controller";
import { loginController } from "./controllers/login.controller";
import { refreshController } from "./controllers/refresh.controller";
import { logoutController } from "./controllers/logout.controller";
import { googleCallbackController } from "./controllers/google.controller";
import { getMeController, updateMeController } from "./controllers/me.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

// credentials routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh", refreshController);

// OAuth google routes
// Starts the Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Handles the Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallbackController,
);

// protected routes
// Returns current user profile
router.get("/me", authMiddleware, getMeController);

// Updates current user profile (minimal auth properties)
router.put("/me", authMiddleware, updateMeController);


// Handles user logout
router.post("/logout", authMiddleware, logoutController);

export default router;
