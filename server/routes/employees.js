// routes/employees.js
const express = require("express");
const router = express.Router();
const {
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee
} = require("../controllers/employeeController");

router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.post("/", addEmployee);
router.put("/:id", updateEmployee);

module.exports = router;