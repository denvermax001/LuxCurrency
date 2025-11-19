import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch'; // Built-in in Node 18+, required for older versions

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- API Routes ---

// Cache store for rates to avoid hitting upstream limits
let rateCache = {
  data: null,
  lastUpdated: 0
};
const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour

app.get('/api/rates', async (req, res) => {
  try {
    // Serve from cache if valid
    if (rateCache.data && (Date.now() - rateCache.lastUpdated < CACHE_DURATION)) {
      return res.json(rateCache.data);
    }

    // Fetch from upstream (using a free reliable provider)
    // We use USD as base.
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    
    if (!response.ok) {
      throw new Error('Failed to fetch rates');
    }

    const data = await response.json();
    
    // Transform for our app needs (We specifically need INR)
    const payload = {
      rates: {
        USD: 1,
        INR: data.rates.INR
      },
      lastUpdated: Date.now()
    };

    // Update Cache
    rateCache = {
      data: payload,
      lastUpdated: Date.now()
    };

    res.json(payload);

  } catch (error) {
    console.error('Rate Fetch Error:', error);
    // Fallback if API fails
    res.json({
      rates: { USD: 1, INR: 83.50 },
      lastUpdated: Date.now(),
      isFallback: true
    });
  }
});

// --- Serve Frontend (Production) ---

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});