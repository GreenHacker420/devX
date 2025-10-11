# File Uploads & Sending Files

Complete guide for handling file uploads and sending different file types from the server.

## 🔹 File Uploads with Multer

Multer is the most popular middleware for handling `multipart/form-data` (file uploads) in Express.

### Installation

```bash
npm install multer
```

### Basic File Upload

```js
const express = require('express');
const multer = require('multer');
const app = express();

// Simple memory storage
const upload = multer({ dest: 'uploads/' });

// Single file upload
app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file); // File info
  console.log(req.body); // Other form fields
  
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size
  });
});

app.listen(3000);
```

### Disk Storage with Custom Filename

```js
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Upload directory
  },
  filename: function (req, file, cb) {
    // Create unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('avatar'), (req, res) => {
  res.json({
    message: 'File uploaded',
    file: req.file
  });
});
```

### Multiple Files Upload

```js
// Multiple files with same field name
app.post('/upload-multiple', upload.array('photos', 10), (req, res) => {
  console.log(req.files); // Array of files
  
  res.json({
    message: `${req.files.length} files uploaded`,
    files: req.files.map(f => ({
      filename: f.filename,
      size: f.size,
      mimetype: f.mimetype
    }))
  });
});

// Multiple files with different field names
app.post('/upload-mixed', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 8 }
]), (req, res) => {
  console.log(req.files.avatar); // Array with 1 file
  console.log(req.files.gallery); // Array with up to 8 files
  
  res.json({
    message: 'Files uploaded',
    avatar: req.files.avatar[0].filename,
    gallery: req.files.gallery.map(f => f.filename)
  });
});
```

### File Validation

```js
const multer = require('multer');

// File filter for validation
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Handle upload with error handling
app.post('/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer error
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Max 5MB' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Custom error
      return res.status(400).json({ error: err.message });
    }
    
    res.json({ message: 'File uploaded', file: req.file });
  });
});
```

### Complete Upload Example with Validation

```js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|devdocx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, DOC allowed.'));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter
});

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({
    success: true,
    message: 'File uploaded successfully',
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  }
  res.status(500).json({ error: err.message });
});

app.listen(3000);
```

## 🔹 Sending Files from Server

### Send Image Files

```js
const express = require('express');
const path = require('path');
const app = express();

// Method 1: Using res.sendFile()
app.get('/image/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);
  
  res.sendFile(filepath, (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    }
  });
});

// Method 2: Using res.download() (forces download)
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);
  
  res.download(filepath, filename, (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    }
  });
});

// Method 3: Serve static files
app.use('/uploads', express.static('uploads'));
// Access: http://localhost:3000/uploads/image.jpg
```

### Send Different File Types

```js
const fs = require('fs');
const path = require('path');

// Send PDF
app.get('/pdf/:filename', (req, res) => {
  const filepath = path.join(__dirname, 'files', req.params.filename);
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
  
  const fileStream = fs.createReadStream(filepath);
  fileStream.pipe(res);
});

// Send JSON file
app.get('/data/:filename', (req, res) => {
  const filepath = path.join(__dirname, 'data', req.params.filename);
  
  res.setHeader('Content-Type', 'application/json');
  
  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.send(data);
  });
});

// Send CSV file
app.get('/csv/:filename', (req, res) => {
  const filepath = path.join(__dirname, 'exports', req.params.filename);
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
  
  const fileStream = fs.createReadStream(filepath);
  fileStream.pipe(res);
});

// Send video
app.get('/video/:filename', (req, res) => {
  const filepath = path.join(__dirname, 'videos', req.params.filename);
  
  const stat = fs.statSync(filepath);
  const fileSize = stat.size;
  const range = req.headers.range;
  
  if (range) {
    // Support video streaming
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filepath, { start, end });
    
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    });
    
    file.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    });
    fs.createReadStream(filepath).pipe(res);
  }
});
```

### Send Files with Proper MIME Types

```js
const mime = require('mime-types'); // npm install mime-types

app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'files', filename);
  
  // Check if file exists
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // Get MIME type
  const mimeType = mime.lookup(filepath) || 'application/octet-stream';
  
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  
  const fileStream = fs.createReadStream(filepath);
  fileStream.pipe(res);
  
  fileStream.on('error', (err) => {
    res.status(500).json({ error: 'Error reading file' });
  });
});
```

### Send Base64 Encoded Images

```js
// Convert image to base64 and send as JSON
app.get('/image-base64/:filename', (req, res) => {
  const filepath = path.join(__dirname, 'uploads', req.params.filename);
  
  fs.readFile(filepath, (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const base64 = data.toString('base64');
    const mimeType = mime.lookup(filepath);
    
    res.json({
      filename: req.params.filename,
      mimeType: mimeType,
      data: `data:${mimeType};base64,${base64}`
    });
  });
});
```

## 🔹 Complete File Management API

```js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

const app = express();
app.use(express.json());

// Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf|doc|devdocx|txt/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    ext ? cb(null, true) : cb(new Error('Invalid file type'));
  }
});

// Upload single file
app.post('/api/files/upload', upload.single('file'), async (req, res) => {
  try {
    res.json({
      success: true,
      file: {
        id: req.file.filename,
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        url: `/api/files/${req.file.filename}`
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload multiple files
app.post('/api/files/upload-multiple', upload.array('files', 10), async (req, res) => {
  try {
    const files = req.files.map(file => ({
      id: file.filename,
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
      url: `/api/files/${file.filename}`
    }));
    
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get file
app.get('/api/files/:filename', (req, res) => {
  const filepath = path.join(__dirname, 'uploads', req.params.filename);
  
  if (!fsSync.existsSync(filepath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  res.sendFile(filepath);
});

// Download file
app.get('/api/files/:filename/download', (req, res) => {
  const filepath = path.join(__dirname, 'uploads', req.params.filename);
  
  if (!fsSync.existsSync(filepath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  res.download(filepath);
});

// List all files
app.get('/api/files', async (req, res) => {
  try {
    const files = await fs.readdir('uploads/');
    const fileDetails = await Promise.all(
      files.map(async (filename) => {
        const filepath = path.join('uploads', filename);
        const stats = await fs.stat(filepath);
        return {
          id: filename,
          name: filename,
          size: stats.size,
          created: stats.birthtime,
          url: `/api/files/${filename}`
        };
      })
    );
    
    res.json({ files: fileDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file
app.delete('/api/files/:filename', async (req, res) => {
  try {
    const filepath = path.join(__dirname, 'uploads', req.params.filename);
    await fs.unlink(filepath);
    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

## 🔹 Frontend HTML Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>File Upload</title>
</head>
<body>
  <h1>Upload File</h1>
  
  <!-- Single file upload -->
  <form id="uploadForm" enctype="multipart/form-data">
    <input type="file" name="file" id="fileInput" />
    <button type="submit">Upload</button>
  </form>
  
  <!-- Multiple files upload -->
  <form id="multiUploadForm" enctype="multipart/form-data">
    <input type="file" name="files" multiple id="filesInput" />
    <button type="submit">Upload Multiple</button>
  </form>
  
  <div id="result"></div>

  <script>
    // Single file upload
    document.getElementById('uploadForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData();
      const file = document.getElementById('fileInput').files[0];
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        document.getElementById('result').innerHTML = 
          `<p>Uploaded: ${data.file.name}</p>
           <img src="${data.file.url}" width="200" />`;
      } catch (error) {
        console.error('Error:', error);
      }
    });
    
    // Multiple files upload
    document.getElementById('multiUploadForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData();
      const files = document.getElementById('filesInput').files;
      
      for (let file of files) {
        formData.append('files', file);
      }
      
      try {
        const response = await fetch('/api/files/upload-multiple', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        const html = data.files.map(f => 
          `<div><p>${f.name}</p><img src="${f.url}" width="150" /></div>`
        ).join('');
        
        document.getElementById('result').innerHTML = html;
      } catch (error) {
        console.error('Error:', error);
      }
    });
  </script>
</body>
</html>
```

## 🔹 Common MIME Types

```js
const mimeTypes = {
  // Images
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  
  // Documents
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.devdocx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  
  // Text
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  
  // Video
  '.mp4': 'video/mp4',
  '.avi': 'video/x-msvideo',
  '.mov': 'video/quicktime',
  
  // Audio
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  
  // Archives
  '.zip': 'application/zip',
  '.rar': 'application/x-rar-compressed',
  '.tar': 'application/x-tar',
  '.gz': 'application/gzip'
};
```

## 💡 Best Practices

1. **Always validate file types** - Don't trust client-side validation
2. **Set file size limits** - Prevent large file uploads
3. **Use unique filenames** - Avoid filename collisions
4. **Store files outside web root** - Security best practice
5. **Scan for viruses** - Use antivirus libraries for uploaded files
6. **Use cloud storage** - For production (AWS S3, Cloudinary, etc.)
7. **Handle errors properly** - Provide meaningful error messages
8. **Clean up temp files** - Remove failed uploads
9. **Use streams for large files** - Better memory management
10. **Implement rate limiting** - Prevent abuse
11. **Optimize images on upload** - Use Sharp to resize and compress
12. **Cache processed images** - Avoid re-processing same images
13. **Use memory storage with Sharp** - Process images without disk I/O
14. **Generate multiple sizes** - Create thumbnails for better performance
15. **Convert to modern formats** - Use WebP for better compression

## ⚠️ Security Considerations

```js
// 1. Validate file extensions
const allowedExtensions = ['.jpg', '.png', '.pdf'];
const ext = path.extname(file.originalname).toLowerCase();
if (!allowedExtensions.includes(ext)) {
  throw new Error('Invalid file type');
}

// 2. Sanitize filenames
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

// 3. Check file content (magic numbers)
const fileType = require('file-type'); // npm install file-type

const buffer = await fs.readFile(filepath);
const type = await fileType.fromBuffer(buffer);
if (!type || !['image/jpeg', 'image/png'].includes(type.mime)) {
  throw new Error('Invalid file content');
}

// 4. Store files outside public directory
const uploadPath = path.join(__dirname, '..', 'private', 'uploads');
```

## 🔗 See Also

- [Middleware](./middleware.md)
- [Error Handling](./error-handling.md)
- [Routing](./routing.md)
