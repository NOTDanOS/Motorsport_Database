"use client";

import { useState, useEffect } from "react";
import MessageDisplay from "../../components/MessageDisplay";
import ProjectionSelector from "../../components/ProjectionSelector";

export default function ProjectionPage() {
  const [tableName, setTableName] = useState("Engineer_Assignment");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const handleApplyProjection = async (selectedFields) => {
    if (!selectedFields || selectedFields.length === 0) {
      setMessage({
        text: "Please select at least one field for projection",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const endpoint = "/api/engineers/assignment-projection";

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: selectedFields }),
      });

      const result = await response.json();

      if (result.success) {
        setTableData(result.data);
        setMessage({
          text: `Showing projection with ${selectedFields.length} selected fields`,
          type: "success",
        });
      } else {
        throw new Error(result.message || "Projection failed");
      }
    } catch (error) {
      console.error("Error applying projection:", error);
      setMessage({
        text: `Error: ${error.message || "Failed to apply projection"}`,
        type: "error",
      });
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  };
//   https://saurabhnativeblog.medium.com/rendering-a-table-in-react-from-a-json-array-using-object-keys-and-object-values-062046973780

// My flowbite rendering wasnt working properly so using this TODO if I habve time will revert to flowbite
  const renderTableHeaders = () => {
    if (tableData.length === 0) return null;
    const headers = Object.keys(tableData[0]);

    return (
      <thead className="bg-gray-100 dark:bg-gray-700">
        <tr>
          {headers.map((header) => (
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
    if (tableData.length === 0) return null;

    return (
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {tableData.map((row, rowIndex) => (
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
        <h1 className="text-3xl font-bold mb-2">
          Engineer Assignment Projection
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Select fields to include in your query results
        </p>
      </header>

      <main className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <MessageDisplay message={message} />

        <ProjectionSelector
          tableName={tableName}
          onApplyProjection={handleApplyProjection}
        />

        {isLoading && (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
          </div>
        )}

        {tableData.length > 0 && !isLoading && (
          <div className="mt-6 overflow-x-auto">
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
