const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: String, required: true },
    instructor: { type: String, required: true },
    project: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    comment: { type: String },
    attributes: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    isAnonymous: { type: Boolean, default: false },
    wouldWorkWithAgain: { type: Boolean, default: false }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;