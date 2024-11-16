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
