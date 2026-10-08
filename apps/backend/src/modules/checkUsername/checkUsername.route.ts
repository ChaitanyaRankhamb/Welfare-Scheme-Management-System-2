import express from "express";
import { checkUsernameController } from "./checkUsername.controller";
import { routeBasedRateLimiter } from "../../middlewares/route-based-rate-limiter.middleware";

const router = express.Router();

/**
 * Route to check username availability.
 * Expected query param: ?username=example
 */
router.get("/", routeBasedRateLimiter(30), checkUsernameController);

export default router;
