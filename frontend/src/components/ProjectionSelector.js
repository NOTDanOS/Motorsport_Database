import { useState, useEffect } from "react";

export default function ProjectionSelector({ tableName, onApplyProjection }) {
  const [availableFields, setAvailableFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  useEffect(() => {

    if (tableName === "Engineering_Team") {
      setAvailableFields(["team_name", "department", "HQ_address"]);
    } else if (tableName === "Engineer_Assignment") {
      setAvailableFields([
        "eng_id",
        "name",
        "team_name",
        "proficiency",
        "years_experience",
        "department",
        "hq_address"
      ]);
    }

    setSelectedFields([]);
  }, [tableName]);

  const handleFieldToggle = (field) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleApply = () => {
    onApplyProjection(selectedFields);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
      <h3 className="text-lg font-medium mb-3">
        Apply Projection
      </h3>
      <div className="space-y-2 mb-4">
        {availableFields.map((field) => (
          <label key={field} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedFields.includes(field)}
              onChange={() => handleFieldToggle(field)}
              className="rounded text-blue-600"
            />
            <span className="text-sm">{field.replace(/_/g, " ")}</span>
          </label>
        ))}
      </div>
      <button
        onClick={handleApply}
        disabled={selectedFields.length === 0}
        className={`text-sm px-3 py-1 rounded ${
          selectedFields.length > 0
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Apply Projection
      </button>
    </div>
  );
}
