const express = require("express");

const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employees.controller");

const { protect } = require("../middleware/auth.middleware");
const { validateDetails } = require("../middleware/validation.middleware");

const router = express.Router();



// Get all employees
router.get("/employees", protect, getEmployees);

// Get employee by ID
router.get("/employees/:empID", protect, getEmployeeById);

// Create employee
router.post(
  "/employees",
  protect,
  validateDetails,
  createEmployee
);

// Update employee
router.put(
  "/employees/:empID",
  protect,
  validateDetails,
  updateEmployee
);

// Delete employee
router.delete("/employees/:empID", protect, deleteEmployee);

module.exports = router;