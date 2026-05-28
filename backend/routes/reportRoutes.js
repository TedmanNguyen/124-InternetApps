const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

router.get('/', async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        res.json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.reporterId || !req.body.reviewId || !req.body.reason) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const report = new Report(req.body);
        const savedReport = await report.save();
        res.status(201).json(savedReport);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const report = await Report.findByIdAndUpdate(req.params.id,
                                             req.body, { new: true });
        res.json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        res.json({ message: 'Report deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;