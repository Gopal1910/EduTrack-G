const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Teacher', 'Student'], required: true },
    class: { type: String }, // For student
    rollNumber: { type: String }, // For student
    instituteName: { type: String, required: true },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create compound index for querying students by class
userSchema.index({ role: 1, class: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
