import Dropdown from "./Dropdown";

export default function TableSelect({ selectedTable, onTableChange, tables }) {
  return (
    <div className="mb-6">
      <label htmlFor="table-select" className="block text-sm font-medium mb-2">
        Select Table
      </label>
      <Dropdown
        label="Select a table"
        options={tables}
        value={selectedTable}
        onChange={onTableChange}
      />
    </div>
  );
}
