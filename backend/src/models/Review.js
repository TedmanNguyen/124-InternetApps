import mongoose from 'mongoose'

export const ATTRIBUTE_OPTIONS = [
  'On Time',
  'Leader',
  'Absent',
  'Strong Coder',
  'Good Communicator',
  'Hard Worker',
]

const reviewSchema = new mongoose.Schema(
  {
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    course: { type: String, required: true, trim: true, uppercase: true },
    instructor: { type: String, default: '', trim: true },
    project: { type: String, default: '', trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', trim: true, maxlength: 2000 },
    attributes: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.every((a) => ATTRIBUTE_OPTIONS.includes(a)),
        message: 'Unknown attribute',
      },
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    isAnonymous: { type: Boolean, default: false },
    wouldWorkWithAgain: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

// Block self-reviews at the schema level.
reviewSchema.pre('validate', function (next) {
  if (this.reviewer && this.reviewee && this.reviewer.equals(this.reviewee)) {
    return next(new Error('You cannot review yourself'))
  }
  next()
})

// Trim what the client sees: hide reviewer when anonymous.
reviewSchema.methods.toPublic = function (currentUserId) {
  const obj = this.toObject({ virtuals: false })
  return {
    id: String(obj._id),
    revieweeId: String(obj.reviewee),
    reviewerId: obj.isAnonymous ? null : String(obj.reviewer),
    course: obj.course,
    instructor: obj.instructor,
    project: obj.project,
    rating: obj.rating,
    comment: obj.comment,
    attributes: obj.attributes,
    upvotes: obj.upvotes.map(String),
    downvotes: obj.downvotes.map(String),
    upvoteCount: obj.upvotes.length,
    downvoteCount: obj.downvotes.length,
    userUpvoted: currentUserId ? obj.upvotes.some((id) => String(id) === String(currentUserId)) : false,
    userDownvoted: currentUserId ? obj.downvotes.some((id) => String(id) === String(currentUserId)) : false,
    isAnonymous: obj.isAnonymous,
    wouldWorkWithAgain: obj.wouldWorkWithAgain,
    isDeleted: obj.isDeleted,
    createdAt: obj.createdAt,
  }
}

export default mongoose.model('Review', reviewSchema)
