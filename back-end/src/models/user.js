import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare passwords
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;