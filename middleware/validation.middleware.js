const { body, validationResult } = require("express-validator");

const validateDetails = [
  body("NameoftheUPSI")
    .trim()
    .notEmpty()
    .withMessage("Name of the UPSI is required"),

  body("InfoSharedBy")
    .trim()
    .notEmpty()
    .withMessage("Info Shared By is required"),

  body("PANNumber1")
    .trim()
    .notEmpty()
    .withMessage("PAN Number 1 is required"),

  body("NameoftheOrganization")
    .trim()
    .notEmpty()
    .withMessage("Organization Name is required"),

  body("DateofSharing")
    .notEmpty()
    .withMessage("Date of Sharing is required"),

  body("PurposeofSharing")
    .trim()
    .notEmpty()
    .withMessage("Purpose of Sharing is required"),

  body("ModeofSharing")
    .notEmpty()
    .withMessage("Mode of Sharing is required"),

  body("TimeofSharing")
    .notEmpty()
    .withMessage("Time of Sharing is required"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];

module.exports = {
  validateDetails,
};