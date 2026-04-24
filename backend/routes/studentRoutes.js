const express = require('express');
const router = express.Router();
const { 
  getMyProfile, 
  getMyAttendance, 
  getMyMarks, 
  getMyAssignments 
} = require('../controllers/studentController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Student'));

router.get('/my-profile', getMyProfile);
router.get('/my-attendance', getMyAttendance);
router.get('/my-marks', getMyMarks);
router.get('/my-assignments', getMyAssignments);

module.exports = router;
