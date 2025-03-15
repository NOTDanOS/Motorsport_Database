export default function FormField({ field, value, onChange }) {
    const getFieldInput = () => {
      switch (field.type.toLowerCase()) {
        case "int":
          return (
            <input
              type="number"
              id={field.name}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              placeholder={`Enter ${field.name}`}
              required={!field.nullable}
            />
          );
  
        case "date":
          return (
            <input
              type="date"
              id={field.name}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              required={!field.nullable}
            />
          );
  
        case "varchar":
        default:
          return (
            <input
              type="text"
              id={field.name}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              placeholder={`Enter ${field.name}`}
              maxLength={field.maxLength || 100}
              required={!field.nullable}
            />
          );
      }
    };
  
    return (
      <div>
        <label htmlFor={field.name} className="block text-sm font-medium mb-1">
          {field.label || field.name} {field.nullable ? "" : "*"}
        </label>
        {getFieldInput()}
        {field.description && (
          <p className="text-xs text-gray-500 mt-1">{field.description}</p>
        )}
      </div>
    );
  }