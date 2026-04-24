const express = require('express');
const router = express.Router();
const { getClassAverage, getLowAttendance, getDashboardStats } = require('../controllers/reportController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Teacher'));

router.get('/class-average', getClassAverage);
router.get('/low-attendance', getLowAttendance);
router.get('/dashboard', getDashboardStats);

module.exports = router;
