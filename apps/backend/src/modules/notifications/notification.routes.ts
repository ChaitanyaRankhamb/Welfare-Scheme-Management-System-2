import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getAllMyNotificationsController } from "./controllers/get-all-my-notifications.controller";
import { getUnreadNotificationCountController } from "./controllers/get-unread-count.controller";
import { markNotificationAsReadController } from "./controllers/mark-notification-as-read.controller";
import { markAllNotificationsAsReadController } from "./controllers/mark-all-notifications-as-read.controller";

const router = Router();

router.use(authMiddleware);

router.get("/unread-count", getUnreadNotificationCountController);
router.get("/all", getAllMyNotificationsController);

router.patch("/read-all", markAllNotificationsAsReadController);
router.patch("/:id/read", markNotificationAsReadController);

export default router;
