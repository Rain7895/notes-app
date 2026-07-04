const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'notes.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Read data file failed:', e.message);
  }
  return { notes: [] };
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Get all notes
app.get('/api/notes', (req, res) => {
  const data = readData();
  res.json(data.notes);
});

// Save all notes (full replace)
app.post('/api/notes', (req, res) => {
  const notes = req.body;
  if (!Array.isArray(notes)) {
    return res.status(400).json({ error: 'Invalid data format, expected array' });
  }
  writeData({ notes });
  res.json({ success: true, count: notes.length });
});

// Sync: merge by id
app.put('/api/notes/sync', (req, res) => {
  const { notes: clientNotes } = req.body;
  if (!Array.isArray(clientNotes)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  const data = readData();
  const serverNotes = data.notes;
  const serverMap = new Map(serverNotes.map(n => [n.id, n]));

  for (const clientNote of clientNotes) {
    const existing = serverMap.get(clientNote.id);
    if (!existing || (clientNote.updatedAt || 0) > (existing.updatedAt || 0)) {
      serverMap.set(clientNote.id, clientNote);
    }
  }

  const merged = Array.from(serverMap.values());
  writeData({ notes: merged });

  res.json({ success: true, notes: merged, count: merged.length });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', notesCount: readData().notes.length });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Notes app started: http://localhost:' + PORT);
  console.log('API: http://localhost:' + PORT + '/api/notes');
});
