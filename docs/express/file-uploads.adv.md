# Advanced File Processing

Complete guide for advanced file processing including images, PDFs, videos, documents, archives, and audio.

## 🔹 Image Processing with Sharp

Sharp is a high-performance image processing library for Node.js.

### Installation

```bash
npm install sharp
```

### Dynamic Image Resizing on Request

```js
const express = require('express');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve images with dynamic resizing
app.get('/images/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const { width, height } = req.query;
    const imagePath = path.join(__dirname, 'uploads', filename);
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    let image = sharp(imagePath);
    
    if (width && height) {
      image = image.resize(parseInt(width), parseInt(height));
    }
    
    res.setHeader('Content-Type', 'image/jpeg');
    image.pipe(res);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Random Image Service with Resizing

```js
const express = require('express');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const PHOTOS_DIR = path.join(__dirname, 'src', 'photos');
const IMAGE_COUNT = 5;

function getRandomImage() {
  const randomNum = Math.floor(Math.random() * IMAGE_COUNT) + 1;
  return `img${randomNum}.jpg`;
}

// Root route - Random image with optional resizing
app.get('/', async (req, res) => {
  try {
    const { width, height } = req.query;
    const randomImage = getRandomImage();
    const imagePath = path.join(PHOTOS_DIR, randomImage);
    
    let image = sharp(imagePath);
    
    if (width && height) {
      const w = parseInt(width);
      const h = parseInt(height);
      
      if (!isNaN(w) && !isNaN(h)) {
        image = image.resize(w, h);
      }
    }
    
    res.setHeader('Content-Type', 'image/jpeg');
    image.pipe(res);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Specific image route with optional resizing
app.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { width, height } = req.query;
    
    const match = name.match(/^img(\d+)$/);
    if (!match) {
      return res.status(404).json({ error: 'Invalid image name' });
    }
    
    const imageNum = parseInt(match[1]);
    if (imageNum < 1 || imageNum > IMAGE_COUNT) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const imagePath = path.join(PHOTOS_DIR, `img${imageNum}.jpg`);
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    let image = sharp(imagePath);
    
    if (width && height) {
      const w = parseInt(width);
      const h = parseInt(height);
      
      if (!isNaN(w) && !isNaN(h)) {
        image = image.resize(w, h);
      }
    }
    
    res.setHeader('Content-Type', 'image/jpeg');
    image.pipe(res);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);

// Example requests:
// GET /                          -> Random image
// GET /?width=50&height=50       -> Random image resized to 50x50
// GET /img1                      -> img1.jpg
// GET /img3?width=100&height=100 -> img3.jpg resized to 100x100
```

### Advanced Sharp Operations

```js
const sharp = require('sharp');

// Resize with fit options
await sharp('input.jpg')
  .resize(300, 200, {
    fit: 'cover',      // cover, contain, fill, inside, outside
    position: 'center'
  })
  .toFile('output.jpg');

// Crop image
await sharp('input.jpg')
  .extract({ left: 100, top: 50, width: 200, height: 200 })
  .toFile('cropped.jpg');

// Rotate image
await sharp('input.jpg').rotate(90).toFile('rotated.jpg');

// Convert format
await sharp('input.jpg').png().toFile('output.png');

// Optimize and compress
await sharp('input.jpg')
  .jpeg({ quality: 80, progressive: true })
  .toFile('optimized.jpg');

// Add watermark
await sharp('input.jpg')
  .composite([{ input: 'watermark.png', gravity: 'southeast' }])
  .toFile('watermarked.jpg');

// Blur, grayscale, etc.
await sharp('input.jpg').blur(5).toFile('blurred.jpg');
await sharp('input.jpg').grayscale().toFile('grayscale.jpg');
```

### Image Service with Caching

```js
const express = require('express');
const sharp = require('sharp');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const CACHE_DIR = path.join(__dirname, 'cache');
const IMAGES_DIR = path.join(__dirname, 'images');

function getCacheKey(filename, width, height, format) {
  const key = `${filename}-${width}-${height}-${format}`;
  return crypto.createHash('md5').update(key).digest('hex');
}

app.get('/img/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const { width, height, format = 'jpeg', quality = 80 } = req.query;
    const imagePath = path.join(IMAGES_DIR, filename);
    
    try {
      await fs.access(imagePath);
    } catch {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    if (width && height) {
      const cacheKey = getCacheKey(filename, width, height, format);
      const cachePath = path.join(CACHE_DIR, `${cacheKey}.${format}`);
      
      try {
        await fs.access(cachePath);
        res.setHeader('X-Cache', 'HIT');
        return res.sendFile(cachePath);
      } catch {
        let image = sharp(imagePath).resize(parseInt(width), parseInt(height));
        
        if (format === 'jpeg') {
          image = image.jpeg({ quality: parseInt(quality) });
        } else if (format === 'webp') {
          image = image.webp({ quality: parseInt(quality) });
        }
        
        await image.toFile(cachePath);
        res.setHeader('X-Cache', 'MISS');
        return res.sendFile(cachePath);
      }
    }
    
    res.sendFile(imagePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🔹 PDF Processing

### Installation

```bash
npm install pdf-lib pdfkit
```

### Generate PDF on-the-fly

```js
const PDFDocument = require('pdfkit');

app.get('/generate-pdf', (req, res) => {
  const doc = new PDFDocument();
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
  
  doc.pipe(res);
  
  doc.fontSize(25).text('Generated PDF Document', 100, 100);
  doc.fontSize(12).text('This is dynamically generated content.', 100, 150);
  doc.image('logo.png', 100, 200, { width: 200 });
  doc.addPage().fontSize(20).text('Page 2', 100, 100);
  
  doc.end();
});
```

### Merge Multiple PDFs

```js
const { PDFDocument } = require('pdf-lib');
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'uploads/temp/' });

app.post('/merge-pdfs', upload.array('pdfs', 10), async (req, res) => {
  try {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of req.files) {
      const pdfBytes = await fs.promises.readFile(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
      await fs.promises.unlink(file.path);
    }
    
    const mergedPdfBytes = await mergedPdf.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="merged.pdf"');
    res.send(Buffer.from(mergedPdfBytes));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Add Watermark to PDF

```js
app.post('/watermark-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const pdfBytes = await fs.promises.readFile(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    
    const watermarkText = req.body.watermark || 'CONFIDENTIAL';
    
    pages.forEach(page => {
      const { width, height } = page.getSize();
      page.drawText(watermarkText, {
        x: width / 2 - 100,
        y: height / 2,
        size: 50,
        opacity: 0.3,
        rotate: { angle: 45 }
      });
    });
    
    const watermarkedPdfBytes = await pdfDoc.save();
    await fs.promises.unlink(req.file.path);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(watermarkedPdfBytes));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🔹 Video Processing

### Installation

```bash
npm install fluent-ffmpeg
# System: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)
```

### Generate Video Thumbnail

```js
const ffmpeg = require('fluent-ffmpeg');

app.post('/video-thumbnail', upload.single('video'), async (req, res) => {
  try {
    const outputPath = `uploads/thumbnails/${Date.now()}.jpg`;
    
    ffmpeg(req.file.path)
      .screenshots({
        timestamps: ['00:00:02'],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '320x240'
      })
      .on('end', async () => {
        await fs.promises.unlink(req.file.path);
        res.json({ thumbnail: `/${outputPath}` });
      })
      .on('error', (err) => {
        res.status(500).json({ error: err.message });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Compress Video

```js
app.post('/compress-video', upload.single('video'), async (req, res) => {
  try {
    const outputPath = `uploads/compressed/${Date.now()}.mp4`;
    
    ffmpeg(req.file.path)
      .videoCodec('libx264')
      .size('640x?')
      .videoBitrate('800k')
      .audioBitrate('96k')
      .output(outputPath)
      .on('end', async () => {
        const originalSize = (await fs.promises.stat(req.file.path)).size;
        const compressedSize = (await fs.promises.stat(outputPath)).size;
        const savings = ((1 - compressedSize / originalSize) * 100).toFixed(2);
        
        await fs.promises.unlink(req.file.path);
        
        res.json({
          video: `/${outputPath}`,
          originalSize,
          compressedSize,
          savings: `${savings}%`
        });
      })
      .on('error', (err) => {
        res.status(500).json({ error: err.message });
      })
      .run();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Extract Audio from Video

```js
app.post('/extract-audio', upload.single('video'), async (req, res) => {
  try {
    const outputPath = `uploads/audio/${Date.now()}.mp3`;
    
    ffmpeg(req.file.path)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioBitrate('192k')
      .output(outputPath)
      .on('end', async () => {
        await fs.promises.unlink(req.file.path);
        res.json({ audio: `/${outputPath}` });
      })
      .on('error', (err) => {
        res.status(500).json({ error: err.message });
      })
      .run();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🔹 Document Processing

### Installation

```bash
npm install xlsx csv-parser csv-writer
```

### Parse Excel File

```js
const XLSX = require('xlsx');

app.post('/parse-excel', upload.single('excel'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    await fs.promises.unlink(req.file.path);
    
    res.json({
      sheets: workbook.SheetNames,
      rowCount: data.length,
      data: data.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Convert Excel to CSV

```js
app.post('/excel-to-csv', upload.single('excel'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const csvData = XLSX.utils.sheet_to_csv(worksheet);
    const outputPath = `uploads/csv/${Date.now()}.csv`;
    
    await fs.promises.writeFile(outputPath, csvData);
    await fs.promises.unlink(req.file.path);
    
    res.download(outputPath, 'converted.csv');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Generate Excel from JSON

```js
app.post('/json-to-excel', express.json(), async (req, res) => {
  try {
    const { data, filename = 'export.xlsx' } = req.body;
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    const outputPath = `uploads/excel/${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, outputPath);
    
    res.download(outputPath, filename);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🔹 Archive Processing

### Installation

```bash
npm install archiver unzipper
```

### Create ZIP Archive

```js
const archiver = require('archiver');

app.post('/create-zip', upload.array('files', 20), async (req, res) => {
  try {
    const zipPath = `uploads/archives/${Date.now()}.zip`;
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', async () => {
      for (const file of req.files) {
        await fs.promises.unlink(file.path);
      }
      res.download(zipPath, 'archive.zip');
    });
    
    archive.pipe(output);
    
    for (const file of req.files) {
      archive.file(file.path, { name: file.originalname });
    }
    
    archive.finalize();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Extract ZIP Archive

```js
const unzipper = require('unzipper');

app.post('/extract-zip', upload.single('zip'), async (req, res) => {
  try {
    const extractPath = `uploads/extracted/${Date.now()}`;
    await fs.promises.mkdir(extractPath, { recursive: true });
    
    const files = [];
    
    fs.createReadStream(req.file.path)
      .pipe(unzipper.Parse())
      .on('entry', async (entry) => {
        const fileName = entry.path;
        const filePath = path.join(extractPath, fileName);
        
        if (entry.type === 'File') {
          entry.pipe(fs.createWriteStream(filePath));
          files.push(fileName);
        } else {
          entry.autodrain();
        }
      })
      .on('close', async () => {
        await fs.promises.unlink(req.file.path);
        res.json({ message: 'Archive extracted', files, extractPath });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🔹 Audio Processing

### Installation

```bash
npm install music-metadata
```

### Extract Audio Metadata

```js
const mm = require('music-metadata');

app.post('/audio-info', upload.single('audio'), async (req, res) => {
  try {
    const metadata = await mm.parseFile(req.file.path);
    await fs.promises.unlink(req.file.path);
    
    res.json({
      title: metadata.common.title,
      artist: metadata.common.artist,
      album: metadata.common.album,
      duration: metadata.format.duration,
      bitrate: metadata.format.bitrate,
      codec: metadata.format.codec
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Convert Audio Format

```js
app.post('/convert-audio', upload.single('audio'), async (req, res) => {
  try {
    const { format = 'mp3', bitrate = '192k' } = req.body;
    const outputPath = `uploads/audio/${Date.now()}.${format}`;
    
    ffmpeg(req.file.path)
      .audioBitrate(bitrate)
      .format(format)
      .output(outputPath)
      .on('end', async () => {
        await fs.promises.unlink(req.file.path);
        res.download(outputPath, `converted.${format}`);
      })
      .on('error', (err) => {
        res.status(500).json({ error: err.message });
      })
      .run();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🔗 See Also

- [File Uploads Basics](./file-uploads.md)
- [Middleware](./middleware.md)
- [Error Handling](./error-handling.md)
