"use client";

import { useState, useEffect } from "react";
import TableSelect from "../../components/TableSelect";
import MessageDisplay from "../../components/MessageDisplay";
import UpdateForm from "../../components/UpdateForm";
import { tableConfigs } from "../../utils/tableConfigs";

export default function ViewPage() {
  const [selectedTable, setSelectedTable] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editingRecord, setEditingRecord] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const availableTables = [
    "Sponsor", 
    "Sponsor_Tier", 
    // "Team_Principal", 
    "Engineering_Team", 
    "Engineer_Assignment"
  ];

  const handleTableChange = async (tableName) => {
    setSelectedTable(tableName);
    setEditingRecord(null);
    setConfirmDelete(null);
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
          endpoint = "/api/sponsors";
          break;
        case "Sponsor_Tier":
          endpoint = "/api/sponsors/tiers";
          break;
        case "Team_Principal":
          endpoint = "/api/get-teams";
          break;
        case "Engineering_Team":
          endpoint="/api/engineers/teams"
          break;
        case "Engineer_Assignment":
          endpoint = "/api/engineers/assignments";
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

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setConfirmDelete(null);
  };

  const handleDeleteClick = (record) => {
    setConfirmDelete(record);
    setEditingRecord(null);
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleUpdateSubmit = async (formData) => {
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      let endpoint;
      let payload = {};

      switch (selectedTable) {
        case "Sponsor_Tier":
          endpoint = "/api/sponsors/update-tier";
          payload = {
            oldName: editingRecord.tier_level,
            newName: formData.tier_level,
            newAmount: parseInt(formData.amount_contributed),
          };
          break;

        case "Sponsor":
          endpoint = "/api/sponsors/update";
          payload = {
            oldSponsorName: editingRecord.sponsor_name,
            newSponsorName: formData.sponsor_name,
            newTierLevel: formData.tier_level,
            newPointOfContact: formData.point_of_contact,
          };
          break;

        case "Team_Principal":
          endpoint = "/api/update-team";
          payload = {
            oldPrincipalName: editingRecord.team_principal,
            newPrincipalName: formData.team_principal,
            newTeamName: formData.team_name,
          };
          break;

        default:
          throw new Error("Unsupported table type for update");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          text: `Successfully updated ${selectedTable} record!`,
          type: "success",
        });
        setEditingRecord(null);
        await fetchTableData(selectedTable);
      } else {
        throw new Error(result.message || "Update operation failed");
      }
    } catch (error) {
      console.error("Error updating record:", error);
      setMessage({
        text: `Error: ${error.message || "Failed to update record"}`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      let endpoint;
      let payload = {};

      switch (selectedTable) {
        case "Sponsor_Tier":
          endpoint = "/api/sponsors/delete-tier";
          payload = {
            tierLevel: confirmDelete.tier_level,
          };
          break;

        case "Sponsor":
          endpoint = "/api/sponsors/delete";
          payload = {
            sponsorName: confirmDelete.sponsor_name,
          };
          break;

        case "Team_Principal":
          endpoint = "/api/delete-team";
          payload = {
            principalName: confirmDelete.team_principal,
          };
          break;

        default:
          throw new Error("Unsupported table type for delete");
      }

      // This is a placeholder for now WAITING FOR DANIEL to give me
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          text: `Successfully deleted ${selectedTable} record!`,
          type: "success",
        });
        setConfirmDelete(null);
        await fetchTableData(selectedTable);
      } else {
        throw new Error(result.message || "Delete operation failed");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      setMessage({
        text: `Error: ${
          error.message ||
          "Failed to delete record. Delete endpoints may not be implemented yet."
        }`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setConfirmDelete(null);
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
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Actions
          </th>
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
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(row)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(row)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </td>
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
          Select a table to view, update, or delete its data
        </p>
      </header>

      <main className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <MessageDisplay message={message} />

        {isLoading && (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
          </div>
        )}

        {!editingRecord && !confirmDelete && (
          <TableSelect
            selectedTable={selectedTable}
            onTableChange={handleTableChange}
            tables={availableTables}
          />
        )}

        {editingRecord && tableConfigs[selectedTable] && (
          <UpdateForm
            tableConfig={tableConfigs[selectedTable]}
            tableName={selectedTable}
            initialData={editingRecord}
            onSubmit={handleUpdateSubmit}
            onCancel={handleCancelEdit}
          />
        )}

        {confirmDelete && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-300 dark:border-red-700 mb-6">
            <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to delete this record? This action cannot be
              undone.
            </p>
            {selectedTable === "Sponsor" && (
              <p className="font-medium mb-3">
                Sponsor Name: {confirmDelete.sponsor_name}
              </p>
            )}
            {selectedTable === "Sponsor_Tier" && (
              <p className="font-medium mb-3">
                Tier Level: {confirmDelete.tier_level}
              </p>
            )}
            {selectedTable === "Team_Principal" && (
              <p className="font-medium mb-3">
                Team Principal: {confirmDelete.team_principal}
              </p>
            )}
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {selectedTable &&
          !isLoading &&
          tableData.length > 0 &&
          !editingRecord &&
          !confirmDelete && (
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
