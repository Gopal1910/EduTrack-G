const User = require('../models/User');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const Assignment = require('../models/Assignment');

// Helper for pagination
const getPagination = (req) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// @desc    Get students with pagination
// @route   GET /api/teacher/students
exports.getStudents = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter = { role: 'Student' };
    
    // Optional filters
    if (req.query.class) filter.class = req.query.class;
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }

    const students = await User.find(filter).select('-password').skip(skip).limit(limit);
    const total = await User.countDocuments(filter);

    res.json({
      data: students,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a subject
// @route   POST /api/teacher/subjects
exports.createSubject = async (req, res, next) => {
  try {
    const { name, code, class: className, totalMarks, attendanceWeight } = req.body;
    const subject = await Subject.create({
      name, code, class: className, totalMarks, attendanceWeight, teacher: req.user._id
    });
    res.status(201).json(subject);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a subject
// @route   DELETE /api/teacher/subjects/:id
exports.deleteSubject = async (req, res, next) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get subjects with pagination
// @route   GET /api/teacher/subjects
exports.getSubjects = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter = { teacher: req.user._id };
    
    if (req.query.class) filter.class = req.query.class;

    const subjects = await Subject.find(filter).skip(skip).limit(limit);
    const total = await Subject.countDocuments(filter);

    res.json({
      data: subjects,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark attendance
// @route   POST /api/teacher/attendance
exports.markAttendance = async (req, res, next) => {
  try {
    const { studentId, subjectId, status, date } = req.body;
    
    // Validation would go here...
    const attendance = await Attendance.create({
      student: studentId,
      subject: subjectId,
      status,
      date: date || new Date()
    });

    const student = await User.findById(studentId);

    // Emit live update
    if (req.io && student && student.class) {
      req.io.to(student.class).emit('attendanceUpdated', {
        studentId,
        subjectId,
        status,
        date: attendance.date
      });
    }

    res.status(201).json(attendance);
  } catch (err) {
    next(err);
  }
};

// @desc    Get attendance with pagination
// @route   GET /api/teacher/attendance
exports.getAttendance = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter = {};
    if (req.query.subjectId) filter.subject = req.query.subjectId;
    if (req.query.date) filter.date = new Date(req.query.date);

    const attendances = await Attendance.find(filter).populate('student', 'name rollNumber').skip(skip).limit(limit);
    const total = await Attendance.countDocuments(filter);

    res.json({
      data: attendances,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add marks
// @route   POST /api/teacher/marks
exports.addMarks = async (req, res, next) => {
  try {
    const { studentId, subjectId, examType, marksObtained, totalMarks } = req.body;

    const existingId = await Marks.findOne({student: studentId, subject: subjectId, examType});
    let marks;
    if (existingId) {
       marks = await Marks.findByIdAndUpdate(existingId._id, { marksObtained, totalMarks }, { new: true});
    } else {
       marks = await Marks.create({
         student: studentId,
         subject: subjectId,
         examType,
         marksObtained,
         totalMarks
       });
    }
    
    const student = await User.findById(studentId);
    if (req.io && student && student.class) {
      req.io.to(student.class).emit('marksUpdated', {
        studentId, subjectId, marksObtained, totalMarks, examType
      });
    }

    res.status(201).json(marks);
  } catch (err) {
    next(err);
  }
};

// @desc    Get marks
// @route   GET /api/teacher/marks
exports.getMarks = async (req, res, next) => {
  try {
     const filter = {};
     if (req.query.class) {
        const students = await User.find({ class: req.query.class }).select('_id');
        filter.student = { $in: students.map(s => s._id) };
     }
     const marks = await Marks.find(filter);
     res.json(marks);
  } catch (err) {
     next(err);
  }
};

// @desc    Update marks
// @route   PUT /api/teacher/marks/:id
exports.updateMarks = async (req, res, next) => {
  try {
    const { marksObtained, totalMarks } = req.body;
    const marks = await Marks.findByIdAndUpdate(
      req.params.id,
      { marksObtained, totalMarks },
      { new: true }
    );

    if (marks) {
      const student = await User.findById(marks.student);
      if (req.io && student && student.class) {
        req.io.to(student.class).emit('marksUpdated', {
          studentId: marks.student,
          subjectId: marks.subject,
          marksObtained,
          totalMarks,
          examType: marks.examType
        });
      }
      res.json(marks);
    } else {
      res.status(404);
      throw new Error('Marks record not found');
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Create Assignment
// @route   POST /api/teacher/assignments
exports.createAssignment = async (req, res, next) => {
  try {
    const { title, description, subjectId, class: className, dueDate } = req.body;

    const assignment = await Assignment.create({
      title, description, subject: subjectId, class: className, dueDate
    });

    if (req.io) {
      req.io.to(className).emit('newAssignment', {
        assignmentId: assignment._id,
        title,
        dueDate,
        subjectId
      });
    }

    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
};

// @desc    Get assignments (paginated)
// @route   GET /api/teacher/assignments
exports.getAssignments = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter = {};
    if (req.query.class) filter.class = req.query.class;

    const assignments = await Assignment.find(filter).populate('subject', 'name').skip(skip).limit(limit);
    const total = await Assignment.countDocuments(filter);

    res.json({
      data: assignments,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};
