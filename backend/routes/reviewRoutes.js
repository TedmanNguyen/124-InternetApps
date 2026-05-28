const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews.filter(review => !review.deleted)); // Exclude deleted reviews
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        res.json(review.filter(review => !review.deleted)); // Exclude deleted reviews
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/reviewer/:reviewerId', async (req, res) => {
    try {
        const reviews = await Review.find({ reviewerId: req.params.reviewerId });
        res.json(reviews.filter(review => !review.deleted)); // Exclude deleted reviews
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/reviewee/:revieweeId', async (req, res) => {
    try {
        const reviews = await Review.find({ revieweeId: req.params.revieweeId });
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    console.log("request received");
    try {
        const review = new Review(req.body);
        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
    console.log("request processed");
});

router.put('/:id', async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(review);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
        res.json(review);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;