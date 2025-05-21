// index.js
const express = require("express");
const cors = require("cors");
const employeeRoutes = require("./routes/employees");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/employees", employeeRoutes);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
