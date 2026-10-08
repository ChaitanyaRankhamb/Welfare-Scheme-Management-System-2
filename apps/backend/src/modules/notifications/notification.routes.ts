import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getAllMyNotificationsController } from "./controllers/get-all-my-notifications.controller";
import { getUnreadNotificationCountController } from "./controllers/get-unread-count.controller";
import { markNotificationAsReadController } from "./controllers/mark-notification-as-read.controller";
import { markAllNotificationsAsReadController } from "./controllers/mark-all-notifications-as-read.controller";
import { routeBasedRateLimiter } from "../../middlewares/route-based-rate-limiter.middleware";

const router = Router();

router.use(authMiddleware);

router.get(
  "/unread-count",
  routeBasedRateLimiter(60),
  getUnreadNotificationCountController,
);
router.get(
  "/all",
  routeBasedRateLimiter(60),
  getAllMyNotificationsController,
);

router.patch(
  "/read-all",
  routeBasedRateLimiter(30),
  markAllNotificationsAsReadController,
);
router.patch(
  "/:id/read",
  routeBasedRateLimiter(30),
  markNotificationAsReadController,
);

export default router;
