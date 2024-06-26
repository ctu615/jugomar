import path from 'path';
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`;

    cb(null, uniqueSuffix);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', upload.single('image'), async (req, res) => {
  const newFilePath = path.resolve(
    req.file.destination,
    `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`
  );
  await sharp(req.file.path).resize(300, 300).toFile(newFilePath);
  const newFilePathBase = `${req.file.destination}${
    path.parse(newFilePath).base
  }`;
  fs.unlinkSync(req.file.path);

  res.send(`/${newFilePathBase}`);
});

export default router;
