const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Create 'uploads' folder if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store in 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Create a unique filename based on the current timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage
});

// Simulate a database with an in-memory array
let resources = [];

// Endpoint to upload a resource (file + description)
app.post('/api/upload-resource', upload.single('file'), (req, res) => {
  const {
    title, description
  } = req.body;
  const {
    filename
  } = req.file;

  if (title && description && filename) {
    const newResource = {
      title,
      description,
      fileName: filename
    };
    resources.push(newResource); // Store resource information in memory
    return res.json({
      message: 'Resource uploaded successfully', success: true
    });
  } else {
    return res.status(400).json({
      message: 'Missing title, description, or file', success: false
    });
  }
});

// Endpoint to get the list of shared resources
app.get('/api/resources', (req, res) => {
  res.json({
    resources
  }); // Return all uploaded resources
});

// Serve static files (uploaded files)
app.use('/uploads', express.static(uploadDir));

// Serve the frontend (assuming HTML files are in 'public' folder)
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});