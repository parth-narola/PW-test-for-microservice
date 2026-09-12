#!/usr/bin/env node
/**
 * Real-time Test Viewer Server
 * 
 * Watches the JSON output directory and streams events to a web UI
 * via Server-Sent Events (SSE).
 * 
 * Usage: node server.js [output-dir]
 * Default: ./test-data-output
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { watch } = require('fs');

const OUTPUT_DIR = process.argv[2] || './test-data-output';
const PORT = process.env.PORT || 3456;

// Store all events and connected clients
let events = [];
let clients = [];
let processedFiles = new Set();

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json'
};

/**
 * Load all JSON files from output directory (including summary files)
 */
function loadExistingFiles() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log(`[Server] Output directory not found: ${OUTPUT_DIR}`);
    console.log(`[Server] Will create when tests run...`);
    return;
  }

  const files = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.json'))
    .sort((a, b) => {
      // Sort by sequence number if present in filename
      const aSeq = parseInt(a.match(/^(\d+)_/)?.[1] || '0');
      const bSeq = parseInt(b.match(/^(\d+)_/)?.[1] || '0');
      return aSeq - bSeq;
    });

  for (const file of files) {
    processFile(path.join(OUTPUT_DIR, file));
  }

  console.log(`[Server] Loaded ${events.length} events from ${files.length} files`);
}

/**
 * Process a JSON file and add to events
 */
function processFile(filepath) {
  const filename = path.basename(filepath);
  
  if (processedFiles.has(filename)) return;
  
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(content);
    
    // Extract sequence number for proper ordering
    const sequenceMatch = filename.match(/^(\d+)_/);
    const sequenceNumber = sequenceMatch ? parseInt(sequenceMatch[1]) : 0;
    
    // Add sequence number to data for client-side ordering
    if (data.meta) {
      data.meta.fileSequence = sequenceNumber;
    }
    
    events.push(data);
    processedFiles.add(filename);
    
    // Broadcast to all connected clients
    broadcast(data);
    
    console.log(`[Server] Processed: ${filename} (seq: ${sequenceNumber})`);
  } catch (err) {
    console.error(`[Server] Error processing ${filename}:`, err.message);
  }
}

/**
 * Broadcast event to all SSE clients
 */
function broadcast(data) {
  const message = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach(client => {
    client.write(message);
  });
}

/**
 * Watch output directory for new files
 */
function watchDirectory() {
  // Create directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`[Server] Watching: ${OUTPUT_DIR}`);

  watch(OUTPUT_DIR, (eventType, filename) => {
    if (eventType === 'rename' && filename && filename.endsWith('.json')) {
      const filepath = path.join(OUTPUT_DIR, filename);
      
      // Small delay to ensure file is fully written
      setTimeout(() => {
        if (fs.existsSync(filepath)) {
          processFile(filepath);
        }
      }, 50);
    }
  });
}

/**
 * Handle HTTP requests
 */
function handleRequest(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  
  // SSE endpoint for real-time events
  if (url.pathname === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    // Sort events by sequence number before sending
    const sortedEvents = [...events].sort((a, b) => {
      const aSeq = a.meta?.sequenceNumber || a.meta?.fileSequence || 0;
      const bSeq = b.meta?.sequenceNumber || b.meta?.fileSequence || 0;
      return aSeq - bSeq;
    });

    // Send all existing events in order
    sortedEvents.forEach(event => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    // Add client to list
    clients.push(res);
    console.log(`[Server] Client connected (${clients.length} total)`);

    // Remove client on disconnect
    req.on('close', () => {
      clients = clients.filter(c => c !== res);
      console.log(`[Server] Client disconnected (${clients.length} total)`);
    });

    return;
  }

  // API endpoint to get all events
  if (url.pathname === '/api/events') {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    
    // Sort events by sequence number
    const sortedEvents = [...events].sort((a, b) => {
      const aSeq = a.meta?.sequenceNumber || a.meta?.fileSequence || 0;
      const bSeq = b.meta?.sequenceNumber || b.meta?.fileSequence || 0;
      return aSeq - bSeq;
    });
    
    res.end(JSON.stringify(sortedEvents));
    return;
  }

  // API endpoint to reset/clear events
  if (url.pathname === '/api/reset' && req.method === 'POST') {
    events = [];
    processedFiles.clear();
    broadcast({ type: 'reset' });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // Serve static files
  let filepath = url.pathname === '/' ? '/index.html' : url.pathname;
  filepath = path.join(__dirname, filepath);

  if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
    const ext = path.extname(filepath);
    const contentType = MIME_TYPES[ext] || 'text/plain';
    
    // Add cache control headers to prevent caching during development
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    fs.createReadStream(filepath).pipe(res);
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}

// Create server
const server = http.createServer(handleRequest);

// Start server
server.listen(PORT, () => {
  console.log(`\n🧪 Test Viewer Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📁 Watching: ${path.resolve(OUTPUT_DIR)}`);
  console.log(`🌐 UI: http://localhost:${PORT}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  loadExistingFiles();
  watchDirectory();
});
