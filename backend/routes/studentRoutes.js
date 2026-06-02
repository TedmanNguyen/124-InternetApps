const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
})

router.get('/name/:name', async (req, res) => {
    console.log('get by name called with name:', req.params.name);
    const firstName = req.params.name.split(' ')[0];
    const lastName = req.params.name.split(' ')[1];
    try {
        const students = await Student.find({
            $or: [
                { firstName: { $regex: firstName, $options: 'i' } },
                { lastName: { $regex: lastName, $options: 'i' } }
            ]
        });
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
    console.log('get by name finished processing');
});

router.get('/email/:email', async (req, res) => {
    console.log('get by email called with email:', req.params.email);
    try {
        const student = await Student.findOne({ email: req.params.email });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
    console.log('get by email finished processing');
});

router.post('/', async (req, res) => {
    console.log(req.body);
    try {
        if (!req.body.firstName || !req.body.lastName || !req.body.email) {
            return res.status(400).json({ message: 'First name, last name, and email are required' });
        }
        const newStudent = new Student(req.body);
        const student = await newStudent.save();
        res.status(201).json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;