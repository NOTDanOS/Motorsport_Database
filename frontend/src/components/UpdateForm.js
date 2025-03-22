import { useState } from "react";
import FormField from "./FormField";

export default function UpdateForm({
  tableConfig,
  tableName,
  initialData,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(initialData || {});

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Update {tableName} Record</h2>

      {tableConfig.fields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          value={formData[field.name] || ""}
          onChange={(value) => handleChange(field.name, value)}
          disabled={field.primaryKey && initialData} 
        />
      ))}

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Update Record
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
