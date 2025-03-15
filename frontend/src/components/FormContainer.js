import { useState } from "react";
import FormField from "./FormField";

export default function FormContainer({ tableConfig, tableName, onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({});
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Add New {tableName} Record</h2>

      {tableConfig.fields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          value={formData[field.name] || ""}
          onChange={(value) => handleChange(field.name, value)}
        />
      ))}

      <div className="pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Record
        </button>
      </div>
    </form>
  );
}
