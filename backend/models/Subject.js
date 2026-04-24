const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    class: { type: String, required: true },
    totalMarks: { type: Number, default: 100 },
    attendanceWeight: { type: Number, default: 10 },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

subjectSchema.index({ class: 1 });

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
