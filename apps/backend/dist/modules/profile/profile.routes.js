"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const get_profile_controller_1 = require("./controllers/get-profile.controller");
const create_profile_controller_1 = require("./controllers/create-profile.controller");
const update_profile_controller_1 = require("./controllers/update-profile.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Protect all profile routes
router.use(auth_middleware_1.authMiddleware);
router.get('/', get_profile_controller_1.getProfileController);
router.post('/', create_profile_controller_1.createProfileController);
router.put('/', update_profile_controller_1.updateProfileController);
exports.default = router;
