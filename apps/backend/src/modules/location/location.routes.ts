import express from "express";
import {
  getStates,
  getDistricts,
  getTalukas,
  getVillages
} from './controllers/location.controller';
import { authMiddleware } from "../../middlewares/auth.middleware";
import { Request, Response, NextFunction } from "express";


const router = express.Router();

// apply middlewares to protect routes

router.use(authMiddleware);

// console.log("state route hit");
router.get('/states', (req: Request, res: Response, next: NextFunction) => {
  console.log("📍 /states route handler reached");
  next();
}, getStates);

router.get('/districts', getDistricts);
router.get('/talukas', getTalukas);
router.get('/villages', getVillages);

export default router;
