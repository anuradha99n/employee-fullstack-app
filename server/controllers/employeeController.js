// controllers/employeeController.js
const { v4: uuidv4 } = require("uuid");
const pool = require("../db");

const addEmployee = async (req, res) => {
  const {
    name, epfNo, address, dob, NICNo,
    designation, basicSalary
  } = req.body;

  const employeeID = uuidv4();
  const employeeVersionID = uuidv4();
  const version = 1;
  const isActive = true;
  const createdDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {
    const conn = await pool.getConnection();

    // Check for existing EPFNo
    const [existing] = await conn.execute(
      "SELECT 1 FROM EmployeeVersion WHERE epfNo = ?",
      [epfNo]
    );

    if (existing.length > 0) {
      conn.release();
      return res.status(400).json({ message: "EPFNo already exists" });
    }

    const sql = `
      INSERT INTO EmployeeVersion (
        employeeVersionID, employeeID, name, epfNo, address, dob, 
        NICNo, createdDate, designation, basicSalary,
        updatedDate, version, isActive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
    `;

    const values = [
      employeeVersionID, employeeID, name, epfNo, address, dob,
      NICNo, createdDate, designation, basicSalary,
      version, isActive
    ];

    await conn.execute(sql, values);
    conn.release();

    res.status(201).json({ message: "Employee inserted successfully" });
  } catch (err) {
    console.error("Insert failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getEmployees = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      `SELECT employeeVersionID, employeeID, name, epfNo, NICNo, 
              designation, basicSalary, createdDate, address, dob 
       FROM EmployeeVersion 
       WHERE isActive = true`
    );
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      `SELECT employeeVersionID, employeeID, name, epfNo, NICNo, 
              designation, basicSalary, createdDate, address, dob 
       FROM EmployeeVersion 
       WHERE employeeID = ? AND isActive = true
       LIMIT 1`,
      [req.params.id]
    );
    conn.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Format dates for frontend
    const employee = rows[0];
    if (employee.dob) {
      employee.dob = new Date(employee.dob).toISOString().split('T')[0];
    }
    if (employee.createdDate) {
      employee.createdDate = new Date(employee.createdDate).toISOString().slice(0, 16);
    }

    res.json(employee);
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const updateEmployee = async (req, res) => {
  const employeeID = req.params.id;
  const {
    name, epfNo, address, dob, NICNo,
    designation, basicSalary
  } = req.body;

  const employeeVersionID = uuidv4();
  const isActive = true;

  try {
    const conn = await pool.getConnection();

    // Get the existing employee to preserve the original createdDate and get current version
    const [existingEmployee] = await conn.execute(
      "SELECT createdDate, version FROM EmployeeVersion WHERE employeeID = ? AND isActive = true",
      [employeeID]
    );

    if (existingEmployee.length === 0) {
      conn.release();
      return res.status(404).json({ error: "Employee not found" });
    }

    // Preserve the original createdDate and increment version
    const { createdDate, version: currentVersion } = existingEmployee[0];
    const newVersion = currentVersion + 1;

    // Deactivate current version
    await conn.execute(
      "UPDATE EmployeeVersion SET isActive = false WHERE employeeID = ? AND isActive = true",
      [employeeID]
    );

    // Insert new version
    const sql = `
      INSERT INTO EmployeeVersion (
        employeeVersionID, employeeID, name, epfNo, address, dob, 
        NICNo, createdDate, designation, basicSalary,
        updatedDate, version, isActive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
    `;

    const values = [
      employeeVersionID, employeeID, name, epfNo, address, dob,
      NICNo, createdDate, designation, basicSalary,
      newVersion, isActive
    ];

    await conn.execute(sql, values);
    conn.release();

    res.json({ 
      message: "Employee updated successfully",
      version: newVersion
    });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee
};
