import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  bulkUpdateUsers,
  bulkDeleteUsers,
  getDashboardStats
} from '../controllers/adminController.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo('admin'));

// Dashboard stats
router.get('/dashboard/stats', getDashboardStats);

// User management routes
router.route('/users')
  .get(getAllUsers);

router.route('/users/bulk-update')
  .patch(bulkUpdateUsers);

router.route('/users/bulk-delete')
  .delete(bulkDeleteUsers);

router.route('/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

export default router;
