import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import inventoryRoutes from './api/inventoryRoutes.js';
import marketplaceRoutes from './api/marketplaceRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/marketplace', marketplaceRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

export default app;
