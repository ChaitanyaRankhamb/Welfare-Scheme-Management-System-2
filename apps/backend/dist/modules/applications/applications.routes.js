"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const create_application_controller_1 = require("./controllers/create-application.controller");
const get_my_applications_controller_1 = require("./controllers/get-my-applications.controller");
const mark_as_applied_controller_1 = require("./controllers/mark-as-applied.controller");
const remove_application_controller_1 = require("./controllers/remove-application.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
// Basic CRUD for application tracking
router.post('/', create_application_controller_1.createApplicationController);
router.get('/my', get_my_applications_controller_1.getMyApplicationsController);
router.patch('/:id/apply', mark_as_applied_controller_1.markAsAppliedController);
router.delete('/:id', remove_application_controller_1.removeApplicationController);
exports.default = router;
