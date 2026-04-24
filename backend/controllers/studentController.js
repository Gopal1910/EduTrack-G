const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const Assignment = require('../models/Assignment');

// @desc    Get student profile
// @route   GET /api/student/my-profile
exports.getMyProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

// @desc    Get my attendance
// @route   GET /api/student/my-attendance
exports.getMyAttendance = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { student: req.user._id };

    const attendances = await Attendance.find(filter)
      .populate('subject', 'name code')
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });
    const total = await Attendance.countDocuments(filter);

    res.json({
      data: attendances,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get my marks
// @route   GET /api/student/my-marks
exports.getMyMarks = async (req, res, next) => {
  try {
    const marks = await Marks.find({ student: req.user._id }).populate('subject', 'name code');
    res.json(marks);
  } catch (err) {
    next(err);
  }
};

// @desc    Get my assignments
// @route   GET /api/student/my-assignments
exports.getMyAssignments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { class: req.user.class };

    const assignments = await Assignment.find(filter)
      .populate('subject', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ dueDate: 1 });
      
    const total = await Assignment.countDocuments(filter);

    res.json({
      data: assignments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};
