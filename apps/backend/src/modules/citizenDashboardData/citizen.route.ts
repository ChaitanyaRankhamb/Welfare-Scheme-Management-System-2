import express from "express";
import { citizenDataController } from "./citizen.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { Role } from "../../types/roles.enum";

const router = express.Router();

router.get("/dashboard", authMiddleware, authorizeRoles(Role.USER), citizenDataController);

export default router;