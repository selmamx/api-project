import express from 'express'; 
import verifyToken from '../middleware/authMiddleware.js';
import {
  createAnnouncements,
  getAnnouncements,
  deleteAnnouncements
} from '../controllers/announcementsController.js';

const router = express.Router();

router.post('/', verifyToken, createAnnouncements);
router.get('/', verifyToken, getAnnouncements);
router.delete('/:id', verifyToken, deleteAnnouncements);

export default router;