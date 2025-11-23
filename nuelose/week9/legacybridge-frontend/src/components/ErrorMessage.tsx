export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
      <strong>Error:</strong> {message}
    </div>
  );
}
