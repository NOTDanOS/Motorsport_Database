export default function MessageDisplay({ message }) {
  if (!message.text) return null;

  const bgColor =
    message.type === "success"
      ? "bg-green-100 border-green-400 text-green-700"
      : "bg-red-100 border-red-400 text-red-700";

  return (
    <div className={`p-4 mb-6 rounded-md border ${bgColor}`} role="alert">
      <p className="text-sm">{message.text}</p>
    </div>
  );
}
