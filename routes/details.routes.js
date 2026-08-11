const express = require('express');
const Details = require('../models/details.models');
const { protect } = require("../middleware/auth.middleware");
const { createAuditLog } = require("../services/auditTrail.service");

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

     await createAuditLog({
      userId: req.user.id,
      action: "CREATE_UPSI",
      module: "UPSI",
      recordId: newdetail._id,
      ipAddress: req.ip,
    });

    res.send("Detail Created Successfully");
    } catch (error) {
        console.error("Create UPSI Error:", error);
        return res.status(400).json(error);
    }

});


module.exports = router;