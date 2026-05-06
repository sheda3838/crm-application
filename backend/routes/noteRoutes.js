import express from 'express';
import { addNote, getLeadNotes, updateNote, deleteNote } from '../controllers/noteController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// Protect all routes
router.use(authMiddleware);

// Routes for /api/leads/:id/notes
router.post('/', addNote);
router.get('/', getLeadNotes);

// Routes for /api/notes/:noteId
router.patch('/:noteId', updateNote);
router.delete('/:noteId', deleteNote);

export default router;
