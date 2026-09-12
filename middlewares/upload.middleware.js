const multer = require("multer");
const path = require("path");

// 1. Configuración de almacenamiento en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Carpeta donde se guardarán los archivos
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Generamos un nombre único: timestamp + número aleatorio + extensión original
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// 2. Filtro estricto para validar formato y tipo MIME de archivo
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/;
  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Formato no permitido. Solo se admiten imágenes (jpeg, jpg, png, webp)",
      ),
      false,
    );
  }
};

// 3. Configuración final de Multer con límite de tamaño (2 MB)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 Megabytes
  },
  fileFilter: fileFilter,
});

module.exports = upload;
