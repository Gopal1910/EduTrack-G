const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema(
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
    examType: { type: String, required: true }, // e.g. Midterm, Final
    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
  },
  { timestamps: true }
);

marksSchema.index({ student: 1, subject: 1, examType: 1 }, { unique: true });

const Marks = mongoose.model('Marks', marksSchema);
module.exports = Marks;
