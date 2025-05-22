import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    epfNo: "",
    address: "",
    dob: "",
    NICNo: "",
    designation: "",
    basicSalary: "",
  });

  useEffect(() => {
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:3001/employees/${id}`);
      const employee = response.data;
      
      // Format dates for input fields
      const formattedEmployee = {
        ...employee,
        dob: employee.dob ? new Date(employee.dob).toISOString().split('T')[0] : '',
      };
      
      setForm(formattedEmployee);
    } catch (err) {
      console.error("Error fetching employee:", err);
      setError("Failed to load employee details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (id) {
        await axios.put(`http://localhost:3001/employees/${id}`, form);
      } else {
        await axios.post("http://localhost:3001/employees", form);
      }
      
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error saving employee.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formFields = [
    { name: "name", type: "text", label: "Name" },
    { name: "epfNo", type: "text", label: "EPF No" },
    { name: "NICNo", type: "text", label: "NIC No" },
    { name: "designation", type: "text", label: "Designation" },
    { name: "dob", type: "date", label: "Date of Birth" },
    { name: "basicSalary", type: "number", label: "Basic Salary" },
    { name: "address", type: "text", label: "Address", fullWidth: true }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-700">
            {id ? "Update Employee" : "Add Employee"}
          </h1>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Back to List
          </button>
        </div>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {formFields.map(({ name, type, label, fullWidth }) => (
              <div key={name} className={fullWidth ? "col-span-2" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-1.5 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {id ? "Update" : "Add"} Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm; 