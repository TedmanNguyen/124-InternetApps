import mongoose from 'mongoose'

export const REPORT_REASONS = [
  'Inappropriate Content',
  'Harassment or Bullying',
  'Hate Speech',
  "I just don't like it",
  "I didn't work with this person",
  'Other',
]

export const REPORT_STATUSES = ['Pending', 'Under Review', 'Resolved', 'Dismissed']

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true, index: true },
    reason: { type: String, required: true, enum: REPORT_REASONS },
    details: { type: String, default: '', trim: true, maxlength: 2000 },
    status: { type: String, default: 'Pending', enum: REPORT_STATUSES, index: true },
  },
  { timestamps: true },
)

reportSchema.methods.toPublic = function () {
  return {
    id: String(this._id),
    reporterId: String(this.reporter),
    reviewId: String(this.review),
    reason: this.reason,
    details: this.details,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

export default mongoose.model('Report', reportSchema)
