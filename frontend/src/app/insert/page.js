"use client";

import { useEffect, useState } from "react";
import FormContainer from "../../components/FormContainer";
import TableSelect from "../../components/TableSelect";
import MessageDisplay from "../../components/MessageDisplay";
import { tableConfigs } from "../../utils/tableConfigs";

export default function InsertPage() {
  const [selectedTable, setSelectedTable] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const initializeSponsorTables = async () => {
      try {
        const response = await fetch("/api/initiate-sponsor-tables", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data.success) {
          console.log("Sponsor tables initialized successfully");
        } else {
          console.error("Failed to initialize sponsor tables:", data.message);
        }
      } catch (error) {
        console.error("Error initializing sponsor tables:", error);
      }
    };

    initializeSponsorTables();
  }, []);

  const handleTableChange = (tableName) => {
    setSelectedTable(tableName);
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      let endpoint = "";
      let payload = {};

      switch (selectedTable) {
        case "Sponsor_Tier":
          endpoint = "/api/sponsors/insert-tier";
          payload = {
            tierLevel: formData.tier_level,
            amountContributed: parseInt(formData.amount_contributed),
          };
          break;

        case "Sponsor":
          endpoint = "/api/sponsors/insert";
          payload = {
            sponsorName: formData.sponsor_name,
            tierLevel: formData.tier_level || null,
            pointOfContact: formData.point_of_contact || null,
          };
          break;

        case "Team_Principal":
          endpoint = "/api/insert-team";
          payload = {
            principalName: formData.team_principal,
            teamName: formData.team_name,
            yearFounded: parseInt(new Date().getFullYear()),
          };
          break;

        case "Engineering_Team":
          endpoint = "/api/engineers/insert-team";
          payload = {
            teamName: formData.team_name,
            dept: formData.department,
            HQ: formData.HQ_address,
          };
          break;

        case "Engineer_Assignment":
          endpoint = "/api/engineers/insert-assignment";
          payload = {
            name: formData.name,
            proficiency: formData.proficiency,
            years_experience: Number(formData.years_experience),
            eng_team_id: formData.team_name,
          };
          break;

        default:
          throw new Error("Unsupported table type");
      }

      console.log("Sending data to:", endpoint);
      console.log("Payload:", payload);

      //  API call to backend
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
          text: `Successfully added new ${selectedTable} record!`,
          type: "success",
        });
      } else {
        throw new Error(result.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({
        text: `Error: ${error.message || "Failed to submit data"}`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <header className="w-full max-w-3xl mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Insert New Data</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Add records to the database
        </p>
      </header>

      <main className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Display messages to user */}
        <MessageDisplay message={message} />

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-300">
              Processing request...
            </p>
          </div>
        )}

        <TableSelect
          selectedTable={selectedTable}
          onTableChange={handleTableChange}
          tables={Object.keys(tableConfigs)}
        />

        {selectedTable && (
          <FormContainer
            tableConfig={tableConfigs[selectedTable]}
            tableName={selectedTable}
            onSubmit={handleSubmit}
          />
        )}
      </main>
    </div>
  );
}
