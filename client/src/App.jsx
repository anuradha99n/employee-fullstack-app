// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddEmployeeForm from "./AddEmployeeForm.jsx";
import EmployeeList from "./EmployeeList.jsx";

function App() {
  return (
    <Router>
      <div className="p-6">
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/add" element={<AddEmployeeForm />} />
          <Route path="/update/:employeeID" element={<AddEmployeeForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
