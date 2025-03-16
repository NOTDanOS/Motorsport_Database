"use client";

import { useState } from "react";
import FormContainer from "../components/FormContainer";
import TableSelect from "../components/TableSelect";
import { tableConfigs } from "../utils/tableConfigs";

export default function Home() {
  const [selectedTable, setSelectedTable] = useState("");

  const handleTableChange = (tableName) => {
    setSelectedTable(tableName);
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    
    try {
      let endpoint = "";
      let payload = {};
      

      switch(selectedTable) {
        case "Sponsor_Tier":
          endpoint = "/api/insert-sponsor-tier";
          payload = {
            tierLevel: formData.tier_level,
            amountContributed: parseInt(formData.amount_contributed)
          };
          break;
        
        case "Sponsor":
          endpoint = "/api/insert-sponsor";
          payload = {
            sponsorName: formData.sponsor_name,
            tierLevel: formData.tier_level || null,
            pointOfContact: formData.point_of_contact || null
          };
          break;
        
        case "Team_Principal":
          endpoint = "/api/insert-team";
          payload = {
            principalName: formData.team_principal,
            teamName: formData.team_name,
            yearFounded: new Date().getFullYear() 
          };
          break;
          
        default:
          throw new Error("Unsupported table type");
      }

      console.log("Sending data to:", endpoint);
      console.log("Payload:", payload);

      //  API call to backend
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage({ 
          text: `Successfully added new ${selectedTable} record!`, 
          type: "success" 
        });
      } else {
        throw new Error(result.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({ 
        text: `Error: ${error.message || "Failed to submit data"}`, 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <header className="w-full max-w-3xl mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Motosport Database Management</h1>
        <p className="text-gray-600 dark:text-gray-300">
         Insert Data
        </p>
      </header>

      <main className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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
