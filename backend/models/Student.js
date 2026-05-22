const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    school: { type: String, required: true },
    major: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    profilePic: { type: String },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;