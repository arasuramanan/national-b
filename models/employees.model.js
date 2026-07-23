const { body, validationResult } = require("express-validator");

const validateEmployee = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),

  body("designation")
    .trim()
    .notEmpty()
    .withMessage("Designation is required"),

  body("mobileNumber")
    .trim()
    .notEmpty()
    .withMessage("Mobile Number is required")
    .isMobilePhone("en-IN")
    .withMessage("Please enter a valid Indian mobile number"),

  body("bloodGroup")
    .optional()
    .isIn([
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
    ])
    .withMessage("Invalid blood group"),

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
  validateEmployee,
};