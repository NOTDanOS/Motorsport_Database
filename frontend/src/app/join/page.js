"use client";

import { useState } from "react";
import MessageDisplay from "../../components/MessageDisplay";

export default function JoinPage() {
  const [department, setDepartment] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/engineers/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ department }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
        if (data.data.length === 0) {
          setMessage({
            text: `No engineers found in department "${department}"`,
            type: "info",
          });
        } else {
          setMessage({
            text: `Found ${data.data.length} engineer(s) in department "${department}"`,
            type: "success",
          });
        }
      } else {
        throw new Error(data.message || "Failed to fetch joined data");
      }
    } catch (error) {
      console.error("Error fetching joined data:", error);
      setMessage({
        text: `Error: ${error.message || "Failed to fetch data"}`,
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
      <header className="w-full max-w-3xl mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Join Query</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find engineers by department using a join operation
        </p>
      </header>

      <main className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <MessageDisplay message={message} />

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label
              htmlFor="department"
              className="block text-sm font-medium mb-2"
            >
              Department Name
            </label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Enter department name"
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Find Engineers"}
          </button>
        </form>

        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              {renderTableHeaders()}
              {renderTableRows()}
            </table>
          </div>
        ) : null}
      </main>
    </div>
  );
}
