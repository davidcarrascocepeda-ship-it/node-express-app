const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

// Ruta de registro (pública)
router.post("/register", authController.register);

// Ruta de login (pública)
router.post("/login", authController.login);

// Ruta de subida de avatar (protegida con token JWT)
router.post(
  "/upload-avatar",
  verifyToken,
  upload.single("avatar"),
  authController.uploadAvatar,
);

module.exports = router;
