"use client";

import { useState } from "react";
import MessageDisplay from "../../components/MessageDisplay";

export default function AggregatePage() {
  const [queryType, setQueryType] = useState("");
  const [queryResults, setQueryResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // headersss for cols
  const queryColumnHeaders = {
    "engineers-per-team": ["Team Name", "Engineer Count"],
    "teams-with-multiple-engineers": ["Team Name", "Engineer Count"],
  };

  const aggregateQueries = [
    {
      id: "engineers-per-team",
      name: "Engineers Per Team",
      description: "Shows the count of engineers assigned to each team",
    },
    {
      id: "teams-with-multiple-engineers",
      name: "Teams With Multiple Engineers",
      description: "Shows teams that have more than one engineer assigned",
    },
  ];

  const fetchAggregateData = async (queryId) => {
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`/api/aggregate/${queryId}`);
      const result = await response.json();

      if (result.success) {
        setQueryResults(result.data);
        if (result.data.length === 0) {
          setMessage({
            text: "No results found for this query.",
            type: "info",
          });
        }
      } else {
        throw new Error(result.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error(`Error fetching aggregate data:`, error);
      setMessage({
        text: `Error: ${error.message || "Failed to load data"}`,
        type: "error",
      });
      setQueryResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuerySelect = (queryId) => {
    setQueryType(queryId);
    fetchAggregateData(queryId);
  };

  const renderTableHeaders = () => {
    if (queryResults.length === 0) return null;

    // I think the oracle was returning an arrays of arrays which I dont want, found this solution to check
    const firstRow = queryResults[0];
    const isArrayData =
      Array.isArray(firstRow) || Object.keys(firstRow)[0] === "0";

    // Only to display the header name, had manual issues beore
    const headers =
      isArrayData && queryColumnHeaders[queryType]
        ? queryColumnHeaders[queryType]
        : Object.keys(queryResults[0]);

    return (
      <thead className="bg-gray-100 dark:bg-gray-700">
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              {typeof header === "string" ? header.replace(/_/g, " ") : header}
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderTableRows = () => {
    if (queryResults.length === 0) return null;

    const firstRow = queryResults[0];
    const isArrayData = Array.isArray(firstRow);

    return (
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {queryResults.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {isArrayData
              ? row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                  >
                    {cell || "N/A"}
                  </td>
                ))
              : Object.values(row).map((cell, cellIndex) => (
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
        <h1 className="text-3xl font-bold mb-2">Aggregate Queries</h1>
        <p className="text-gray-600 dark:text-gray-300">
          View aggregated data from the database
        </p>
      </header>

      <main className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <MessageDisplay message={message} />

        <div className="mb-6">
          <div className="flex flex-wrap gap-3 mb-6">
            {aggregateQueries.map((query) => (
              <button
                key={query.id}
                onClick={() => handleQuerySelect(query.id)}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  queryType === query.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {query.name}
              </button>
            ))}
          </div>

          {queryType && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {aggregateQueries.find((q) => q.id === queryType)?.description}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
          </div>
        ) : queryResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              {renderTableHeaders()}
              {renderTableRows()}
            </table>
          </div>
        ) : queryType && !message.text ? (
          <p className="text-center py-4 text-gray-600 dark:text-gray-300">
            No data found.
          </p>
        ) : null}
      </main>
    </div>
  );
}
