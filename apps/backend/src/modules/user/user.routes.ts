import express from "express";
import passport from "passport";
import { registerController } from "./controllers/register.controller";
import { loginController } from "./controllers/login.controller";
import { refreshController } from "./controllers/refresh.controller";
import { logoutController } from "./controllers/logout.controller";
import { googleCallbackController } from "./controllers/google.controller";
import { getMeController, updateMeController } from "./controllers/me.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { routeBasedRateLimiter } from "../../middlewares/route-based-rate-limiter.middleware";

const router = express.Router();

// credentials routes
router.post("/register", routeBasedRateLimiter(5), registerController);
router.post("/login", routeBasedRateLimiter(10), loginController);
router.post("/refresh", routeBasedRateLimiter(20), refreshController);

// OAuth google routes
router.get(
  "/google",
  routeBasedRateLimiter(10),
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  routeBasedRateLimiter(10),
  passport.authenticate("google", { session: false }),
  googleCallbackController,
);

// protected routes
router.get("/me", authMiddleware, routeBasedRateLimiter(60), getMeController);
router.put("/me", authMiddleware, routeBasedRateLimiter(15), updateMeController);

// Handles user logout
router.post("/logout", routeBasedRateLimiter(20), logoutController);

export default router;
