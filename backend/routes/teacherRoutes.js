const express = require('express');
const router = express.Router();
const { 
  getStudents, 
  getSubjects, 
  createSubject, 
  deleteSubject,
  markAttendance, 
  getAttendance, 
  addMarks, 
  getMarks,
  updateMarks,
  createAssignment,
  getAssignments
} = require('../controllers/teacherController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Teacher'));

router.get('/students', getStudents);

router.route('/subjects')
  .get(getSubjects)
  .post(createSubject);

router.route('/subjects/:id')
  .delete(deleteSubject);

router.route('/attendance')
  .get(getAttendance)
  .post(markAttendance);

router.route('/marks')
  .get(getMarks)
  .post(addMarks);
  
router.route('/marks/:id')
  .put(updateMarks);

router.route('/assignments')
  .get(getAssignments)
  .post(createAssignment);

module.exports = router;
