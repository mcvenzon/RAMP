import express from 'express';
import { createMarketplaceListing, placeBid } from '../services/inventoryService.js';

const router = express.Router();

// POST /listings
router.post('/listings', async (req, res) => {
  try {
    const result = await createMarketplaceListing(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /listings
router.get('/listings', async (req, res) => {
  try {
    // In a real app, we'd query Supabase for all active listings
    // For now, returning empty array or mock data to satisfy the frontend
    res.status(200).json([]);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /listings/{id}/bids
router.post('/listings/:id/bids', async (req, res) => {
  try {
    const result = await placeBid({ ...req.body, listing_id: req.params.id });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
