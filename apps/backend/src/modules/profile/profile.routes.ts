import { Router } from "express";
import { getProfileController } from "./controllers/get-profile.controller";
import { createProfileController } from "./controllers/create-profile.controller";
import { updateProfileController } from "./controllers/update-profile.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { deleteDocumentController } from "./controllers/delete-document.controller";
import { getDocumentsController } from "./controllers/get-documents.controller";
import { uploadDocumentController } from "./controllers/upload-documents.controller";
import multer from "multer";

const router = Router();

const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const acceptedTypes = [
      "application/pdf",
      "application/msword",
      "image/jpeg",
      "image/png",
    ];

    callback(null, acceptedTypes.includes(file.mimetype));
  },
});

// Protect all profile routes
router.use(authMiddleware);

router.get("/", getProfileController);
router.post("/", createProfileController);
router.put("/", updateProfileController);
router.post(
  "/documents",
  documentUpload.single("file"),
  uploadDocumentController,
);
router.get("/documents", getDocumentsController);
router.delete("/documents/:id", deleteDocumentController);

export default router;
