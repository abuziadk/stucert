const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const upload = multer({
    dest: path.join(__dirname, '../uploads')
});

router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'لم يتم رفع أي ملف' });
    }
    res.send({ message: 'تم رفع الملف بنجاح' });
});

module.exports = router;
