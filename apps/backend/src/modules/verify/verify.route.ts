import express from "express";
import { verifyController } from "./verify.controller";
import { resendController } from "./resend.controller";
import { routeBasedRateLimiter } from "../../middlewares/route-based-rate-limiter.middleware";

const router = express.Router();

// Route to verify user email with a code (5 attempts per min)
router.post("/", routeBasedRateLimiter(5), verifyController);

// Route to resend the verification code (3 resends per min)
router.post(
  "/resend-verification-code",
  routeBasedRateLimiter(3),
  resendController,
);

export default router;
