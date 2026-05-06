import express from 'express';
import { createLead, getLeads, getLeadById, updateLead, deleteLead } from '../controllers/leadController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect ALL routes in this module
router.use(authMiddleware);

// Lead Routes
router.post('/', createLead);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.patch('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
