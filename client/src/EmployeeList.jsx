// EmployeeList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/employees")
      .then(res => {
        setEmployees(res.data);
      })
      .catch(err => {
        console.error("Error fetching employees:", err);
      });
  }, []);

  const handleUpdate = (employeeID) => {
    navigate(`/update/${employeeID}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Employee List</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">EPF No</th>
            <th className="border px-4 py-2">NIC No</th>
            <th className="border px-4 py-2">Designation</th>
            <th className="border px-4 py-2">Salary</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.employeeVersionID}>
              <td className="border px-4 py-2">{emp.name}</td>
              <td className="border px-4 py-2">{emp.epfNo}</td>
              <td className="border px-4 py-2">{emp.NICNo}</td>
              <td className="border px-4 py-2">{emp.designation}</td>
              <td className="border px-4 py-2">{emp.basicSalary}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => handleUpdate(emp.employeeID)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
