import express from 'express';
import { logMaterialEntry, getMaterialBalance, getAllMaterials } from '../services/inventoryService.js';

const router = express.Router();

// POST /log-material
router.post('/log-material', async (req, res) => {
  try {
    const result = await logMaterialEntry(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error logging material:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /balance/:material_id
router.get('/balance/:material_id', async (req, res) => {
  try {
    const balance = await getMaterialBalance(req.params.material_id);
    res.status(200).json(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(404).json({ error: error.message });
  }
});

// GET /materials
router.get('/materials', async (req, res) => {
  try {
    const materials = await getAllMaterials();
    res.status(200).json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
