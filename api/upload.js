import multer from "multer";
import path from "path";
import { promisify } from "util";
import fs from "fs";

// إعداد تخزين الملفات باستخدام multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    // التأكد من وجود مجلد "uploads"
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir); // حفظ الملفات في مجلد "uploads"
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName); // اسم الملف الفريد
  },
});

// تحديد إعدادات multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // الحد الأقصى لحجم الملف: 10 ميجابايت
}).single("pdf");

// تحويل `upload` إلى طريقة Promise لاستخدام async/await
const uploadMiddleware = promisify(upload);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // استدعاء middleware الخاص برفع الملفات
      await uploadMiddleware(req, res);

      // التحقق من وجود ملف مرفق
      if (!req.file) {
        return res.status(400).json({ message: "لم يتم تقديم أي ملف." });
      }

      // النجاح
      res.status(200).json({
        message: "تم رفع الملف بنجاح.",
        filename: req.file.filename,
      });
    } catch (error) {
      if (error.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({ message: "حجم الملف يتجاوز الحد المسموح به (10 ميجابايت)." });
      } else {
        res.status(500).json({ message: "حدث خطأ أثناء رفع الملف.", error: error.message });
      }
    }
  } else {
    // رفض الطلبات التي ليست POST
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `طريقة الطلب ${req.method} غير مدعومة.` });
  }
}
