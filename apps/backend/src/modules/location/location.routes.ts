import express from "express";
import {
  getStates,
  getDistricts,
  getTalukas,
  getVillages
} from './controllers/location.controller';
import { authMiddleware } from "../../middlewares/auth.middleware";
import { routeBasedRateLimiter } from "../../middlewares/route-based-rate-limiter.middleware";
import { Request, Response, NextFunction } from "express";

const router = express.Router();

router.use(authMiddleware);

router.get(
  '/states',
  routeBasedRateLimiter(60),
  (req: Request, res: Response, next: NextFunction) => {
    console.log("📍 /states route handler reached");
    next();
  },
  getStates,
);

router.get('/districts', routeBasedRateLimiter(60), getDistricts);
router.get('/talukas', routeBasedRateLimiter(60), getTalukas);
router.get('/villages', routeBasedRateLimiter(60), getVillages);

export default router;
