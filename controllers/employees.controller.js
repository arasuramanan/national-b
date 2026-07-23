const employeeService = require("../services/employees.service");
const AppError = require("../utils/AppError");

// Get all employees
const getEmployees = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const result = await employeeService.getEmployees(page, limit);

    res.status(200).json({
      success: true,
      data: result.employees,
      pagination: {
        currentPage: result.currentPage,
        pageSize: result.pageSize,
        totalRecords: result.totalRecords,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrevious: result.hasPrevious,
      },
    });
  } catch (error) {
  next(error);
  }
};

// Get employee by ID
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.empID);

    if (!employee) {
return next(new AppError("Employee not found", 404));
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
   next(error);
  }
};

// Create employee
const createEmployee = async (req, res, next) => {
  try {
    const data = await employeeService.createEmployee(req.body);

    res.status(201).json({
      success: true,
      employeeId: data._id,
      message: "Employee has been added successfully.",
      data,
    });
  } catch (error) {
  next(error);
  }
};

// Update employee
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.updateEmployee(
      req.params.empID,
      req.body
    );

    if (!employee) {
return next(new AppError("Employee not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully.",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Delete employee
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.deleteEmployee(req.params.empID);

    if (!employee) {
return next(new AppError("Employee not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully.",
    });
  } catch (error) {
   next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};