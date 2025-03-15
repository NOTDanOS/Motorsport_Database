export default function TableSelect({ selectedTable, onTableChange, tables }) {
  return (
    <div className="mb-6">
      <label htmlFor="table-select" className="block text-sm font-medium mb-2">
        Select Table
      </label>
      <select
        id="table-select"
        value={selectedTable}
        onChange={(e) => onTableChange(e.target.value)}
        className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
      >
        <option value="" disabled>
          Select a table
        </option>
        {tables.map((table) => (
          <option key={table} value={table}>
            {table}
          </option>
        ))}
      </select>
    </div>
  );
}
