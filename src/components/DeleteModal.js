'use client';

import { AlertTriangle, X } from 'lucide-react';

export default function DeleteModal({ candidateName, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-5 sm:p-6 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-11 h-11 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="pr-4">
            <h3 className="text-lg font-bold text-gray-900 leading-snug">Delete Candidate</h3>
            <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
              Are you sure you want to remove <span className="font-semibold text-gray-900">{candidateName}</span>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 mt-6 pt-3 border-t border-gray-100">
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-center"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 shadow-xs text-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              'Delete Candidate'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
