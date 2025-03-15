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

  const handleSubmit = (formData) => {
    // Daniel/Eddie this would connect to the backend later
    console.log("Form submitted:", formData);
    alert(`Data for ${selectedTable} submitted successfully!`);
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
