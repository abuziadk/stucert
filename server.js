const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

// إعداد تخزين الملفات باستخدام multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // حفظ الملفات في مجلد "uploads"
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // اسم الملف + الامتداد
  },
});

// تحديد إعدادات رفع الملفات
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // حد أقصى لحجم الملف: 10 ميجابايت
});

// نقطة النهاية /upload
app.post("/upload", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("لم يتم تقديم أي ملف.");
  }

  // إذا نجح الرفع
  res.status(200).send("تم رفع الملف بنجاح.");
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
