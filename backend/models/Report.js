const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
    reason: { type: String, required: true, enum: ['Inappropriate Content',
                                                    'Harassment or Bullying',
                                                    'Hate Speech',
                                                    'I just don\'t like it',
                                                    'I didn\'t work with this person',
                                                    'Other']},
    details: { type: String },
    status: { type: String,
                enum: ['Pending', 'Under Review', 'Resolved', 'Dismissed'],
                default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;