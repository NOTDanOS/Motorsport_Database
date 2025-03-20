"use client";

import { useState, useEffect } from "react";
import TableSelect from "../../components/TableSelect";
import MessageDisplay from "../../components/MessageDisplay";

export default function ViewPage() {
  const [selectedTable, setSelectedTable] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });


  const availableTables = ["Sponsor", "Sponsor_Tier", "Team_Principal"];

  const handleTableChange = async (tableName) => {
    setSelectedTable(tableName);
    if (tableName) {
      await fetchTableData(tableName);
    }
  };

  const fetchTableData = async (tableName) => {
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    try {
      let endpoint;

      switch (tableName) {
        case "Sponsor":
          endpoint = "/api/get-sponsorsAPI.js";
          break;
        case "Team_Principal":
          endpoint = "/api/get-teams";
          break;
        default:
          throw new Error("No endpoint available for this table");
      }

      const response = await fetch(endpoint);
      const result = await response.json();

      if (result.success) {
        setTableData(result.data);
        if (result.data.length === 0) {
          setMessage({
            text: `No data found in ${tableName} table.`,
            type: "info",
          });
        }
      } else {
        throw new Error(result.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error(`Error fetching ${tableName} data:`, error);
      setMessage({
        text: `Error: ${error.message || "Failed to load data"}`,
        type: "error",
      });
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold mb-2">View Database Tables</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Select a table to view its data
        </p>
      </header>

      <main className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <MessageDisplay message={message} />

        {isLoading && (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
          </div>
        )}

        <TableSelect
          selectedTable={selectedTable}
          onTableChange={handleTableChange}
          tables={availableTables}
        />

        {selectedTable && !isLoading && tableData.length > 0 && (
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
