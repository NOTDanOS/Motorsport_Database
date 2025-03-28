"use client";

import { useState } from "react";
import MessageDisplay from "../../components/MessageDisplay";

export default function SelectionPage() {
  const [conditions, setConditions] = useState([
    { field: "name", operator: "equals", value: "", connector: "AND" },
  ]);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const fields = [
    { label: "Name", value: "name" },
    { label: "Proficiency", value: "proficiency" },
    { label: "Years Experience", value: "years_experience" },
    { label: "Team Name", value: "team_name" },
  ];

  const operators = [
    { label: "Equals", value: "equals" },
    { label: "Contains", value: "contains" },
  ];

  const connectors = [
    { label: "AND", value: "AND" },
    { label: "OR", value: "OR" },
  ];

  const addCondition = () => {
    setConditions([
      ...conditions,
      { field: "name", operator: "equals", value: "", connector: "AND" },
    ]);
  };

  const removeCondition = (index) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    setConditions(newConditions);
  };

  const updateCondition = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setConditions(newConditions);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (conditions.length === 0) {
      setMessage({
        text: "Please add at least one search condition",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/engineers/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conditions }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
        if (data.data.length === 0) {
          setMessage({
            text: "No results found matching your criteria",
            type: "info",
          });
        } else {
          setMessage({
            text: `Found ${data.data.length} result(s)`,
            type: "success",
          });
        }
      } else {
        throw new Error(data.message || "Failed to perform search");
      }
    } catch (error) {
      console.error("Search error:", error);
      setMessage({
        text: `Error: ${error.message || "Failed to execute search"}`,
        type: "error",
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTableHeaders = () => {
    if (results.length === 0) return null;

    return (
      <thead className="bg-gray-100 dark:bg-gray-700">
        <tr>
          {Object.keys(results[0]).map((header) => (
            <th
              key={header}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              {header.replace(/_/g, " ")}
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderTableRows = () => {
    if (results.length === 0) return null;

    return (
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {results.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {Object.values(row).map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
              >
                {cell || "N/A"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Engineer Search</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Build a query with AND/OR conditions to find specific engineers
        </p>
      </header>

      <main className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <MessageDisplay message={message} />

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-4">
            {conditions.map((condition, index) => (
              <div key={index} className="flex flex-wrap items-center gap-2">
                {index > 0 && (
                  <select
                    value={condition.connector}
                    onChange={(e) =>
                      updateCondition(index, "connector", e.target.value)
                    }
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm"
                  >
                    {connectors.map((connector) => (
                      <option key={connector.value} value={connector.value}>
                        {connector.label}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={condition.field}
                  onChange={(e) =>
                    updateCondition(index, "field", e.target.value)
                  }
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm"
                >
                  {fields.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>

                <select
                  value={condition.operator}
                  onChange={(e) =>
                    updateCondition(index, "operator", e.target.value)
                  }
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm"
                >
                  {operators.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={condition.value}
                  onChange={(e) =>
                    updateCondition(index, "value", e.target.value)
                  }
                  placeholder="Value"
                  className="flex-1 min-w-[150px] bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm"
                />

                <button
                  type="button"
                  onClick={() => removeCondition(index)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={addCondition}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Add Condition
            </button>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {results.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              {renderTableHeaders()}
              {renderTableRows()}
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
