<<<<<<< HEAD
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(express.json());

// Configure Multer
const upload = multer({ dest: "uploads/" });

// Upload Endpoint
app.post("/upload", upload.single("pdf"), (req, res) => {
    const filePath = req.file.path;
    const newFileName = `uploads/${req.file.originalname}`;
    fs.rename(filePath, newFileName, (err) => {
        if (err) return res.status(500).send("Error saving file.");
        res.send("File uploaded successfully.");
    });
});

// Search Endpoint
app.get("/search/:id", async (req, res) => {
    const studentId = req.params.id;
    const files = fs.readdirSync("uploads/");
    
    for (const file of files) {
        const dataBuffer = fs.readFileSync(path.join("uploads", file));
        const data = await pdfParse(dataBuffer);

        if (data.text.includes(studentId)) {
            return res.json({ success: true, file });
        }
    }

    res.json({ success: false, message: "Certificate not found." });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
=======
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
>>>>>>> 915f504df07f8070627104472c51d712d639b3c2
