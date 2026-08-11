const express = require('express');
const Details = require('../models/details.models');
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get('/details', protect, async (req, res) => {
    try {
        const detail = await Details.find();
        res.send(detail);
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post('/detailsnewform', protect, async (req, res) => {
    try { 
    const newdetail = new Details(req.body);
    await newdetail.save();
    res.send("Detail Created Successfully");
    } catch (error) {
        return res.status(400).json(error);
    }

});


module.exports = router;