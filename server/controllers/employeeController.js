// controllers/employeeController.js
const { v4: uuidv4 } = require("uuid");
const pool = require("../db");

const addEmployee = async (req, res) => {
  const {
    name, epfNo, address, dob, NICNo,
    createdDate, designation, basicSalary
  } = req.body;

  const employeeID = uuidv4();
  const employeeVersionID = uuidv4();
  const version = 1;
  const isActive = true;

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

module.exports = {
  addEmployee
};
