const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    class: { type: String, required: true },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

assignmentSchema.index({ class: 1, dueDate: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
