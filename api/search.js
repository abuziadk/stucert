const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/', (req, res) => {
    const { studentId } = req.body;
    const files = fs.readdirSync(path.join(__dirname, '../uploads'));

    // البحث في الملفات (يمكنك إضافة كود للتحقق من الرقم داخل ملفات PDF)
    const foundFile = files.find(file => file.includes(studentId));

    if (foundFile) {
        res.send({ filePath: `/uploads/${foundFile}` });
    } else {
        res.status(404).send({ message: 'لم يتم العثور على الشهادة' });
    }
});

module.exports = router;
