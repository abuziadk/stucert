const multer = require("multer");

// إعداد حجم الملف الأقصى (10 ميجابايت)
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 ميجابايت
}).single("pdf");

module.exports = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "حجم الملف يتجاوز الحد المسموح به (10 ميجابايت)." });
      }
      return res.status(500).json({ message: "حدث خطأ أثناء رفع الملف." });
    }

    // تحقق مما إذا كان تم رفع ملف
    if (!req.file) {
      return res.status(400).json({ message: "يرجى رفع ملف صالح." });
    }

    res.status(200).json({ message: "تم رفع الملف بنجاح!" });
  });
};
