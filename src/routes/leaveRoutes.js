import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import {
  createLeaves,
  getMyLeaves,
  getAllLeaves,
  updateLeavesStatus
} from '../controllers/leaveController.js';

const router = express.Router();

router.post('/', verifyToken, createLeaves);
router.get('/', verifyToken, getMyLeaves);
router.get('/all', verifyToken, getAllLeaves);
router.patch('/:id/status', verifyToken, updateLeavesStatus);

export default router;