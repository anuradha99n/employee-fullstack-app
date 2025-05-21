// routes/employees.js
const express = require("express");
const router = express.Router();
const {
  addEmployee
} = require("../controllers/employeeController");

router.post("/", addEmployee);

module.exports = router;