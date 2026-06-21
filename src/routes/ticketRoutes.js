import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';

import{
  createTicket,
  getMyTickets,
  getTicketById,
  rejectStatusChange,
  approveStatusChange,
  requestStatusChange,
  deleteTicket
} from '../controllers/ticketController.js';

const router = express.Router();

router.post('/', verifyToken, createTicket);
router.get('/', verifyToken, getMyTickets);
router.get('/:id', verifyToken, getTicketById);
router.patch('/:id/requestStatus', verifyToken, requestStatusChange);
router.patch('/:id/approveStatus', verifyToken, approveStatusChange);
router.patch('/:id/rejectStatus', verifyToken, rejectStatusChange);
router.delete('/:id', verifyToken, deleteTicket);

export default router;