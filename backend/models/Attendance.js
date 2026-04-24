const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ student: 1, date: -1 });
attendanceSchema.index({ subject: 1, date: -1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
