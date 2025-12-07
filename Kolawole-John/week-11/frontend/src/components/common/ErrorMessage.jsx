import { XCircleIcon } from '@heroicons/react/24/solid';

export const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 animate-fadeIn">
      <div className="flex items-start">
        <XCircleIcon className="h-5 w-5 text-red-600 mt-0.5" />
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800"
          >
            <XCircleIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};