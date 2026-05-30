import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const eduEmail = {
  validator: (v) => /^[^\s@]+@[^\s@]+\.edu$/i.test(v),
  message: 'Email must be a valid .edu address',
}

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: eduEmail,
    },
    passwordHash: { type: String, default: null }, // null for peer-only profiles created by others
    school: { type: String, default: 'UC Irvine', trim: true },
    major: { type: String, required: true, trim: true },
    graduationYear: { type: Number, default: () => new Date().getFullYear() + 2 },
    profilePic: { type: String, default: null },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
)

studentSchema.index({ firstName: 'text', lastName: 'text', email: 'text' })

studentSchema.methods.setPassword = async function (plain) {
  const salt = await bcrypt.genSalt(10)
  this.passwordHash = await bcrypt.hash(plain, salt)
}

studentSchema.methods.verifyPassword = async function (plain) {
  if (!this.passwordHash) return false
  return bcrypt.compare(plain, this.passwordHash)
}

// Never leak passwordHash to the client.
studentSchema.methods.toPublic = function () {
  const { _id, firstName, lastName, email, school, major, graduationYear, profilePic, isAdmin, createdAt } = this
  return {
    id: String(_id),
    firstName,
    lastName,
    email,
    school,
    major,
    graduationYear,
    profilePic,
    isAdmin,
    createdAt,
  }
}

export default mongoose.model('Student', studentSchema)
