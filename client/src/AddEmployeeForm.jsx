
import { useState } from "react";
import axios from "axios";

function AddEmployeeForm() {
  const [form, setForm] = useState({
    name: "",
    epfNo: "",
    address: "",
    dob: "",
    NICNo: "",
    createdDate: "",
    designation: "",
    basicSalary: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/employees", form);
      alert("Employee saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving employee.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-center text-blue-700">
          Employee Form
        </h1>
        <form onSubmit={handleSubmit} className="space-y-2">
          {[
            ["name", "text"],
            ["epfNo", "text"],
            ["address", "text"],
            ["dob", "date"],
            ["NICNo", "text"],
            ["createdDate", "datetime-local"],
            ["designation", "text"],
            ["basicSalary", "number"]
          ].map(([field, type]) => (
            <div key={field}>
              <label className="block font-semibold">{field}</label>
              <input
                name={field}
                type={type}
                value={form[field]}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
            </div>
          ))}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      </div>  
    </div>
  );
}

export default AddEmployeeForm;
