'use client';

import Link from 'next/link';
import { Eye, Pencil, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import StageBadge from './StageBadge';

export default function CandidateTable({ candidates, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
      {/* Desktop Table (Visible on md and above) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th scope="col" className="px-6 py-3.5">Candidate</th>
              <th scope="col" className="px-6 py-3.5">Position</th>
              <th scope="col" className="px-6 py-3.5">Stage</th>
              <th scope="col" className="px-6 py-3.5">Applied Date</th>
              <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <tr key={candidate._id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-indigo-600">
                        {candidate.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <Link
                        href={`/candidates/${candidate._id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                      >
                        {candidate.name}
                      </Link>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {candidate.email}
                        </span>
                        {candidate.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {candidate.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700 font-medium">{candidate.position}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StageBadge stage={candidate.stage} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/candidates/${candidate._id}`}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View Candidate Profile"
                      aria-label={`View ${candidate.name}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/candidates/${candidate._id}/edit`}
                      className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit Candidate"
                      aria-label={`Edit ${candidate.name}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(candidate)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Candidate"
                      aria-label={`Delete ${candidate.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Visible below md) */}
      <div className="md:hidden divide-y divide-gray-200">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="p-4 space-y-3 hover:bg-gray-50/50 transition-colors">
            {/* Header: Avatar, Name, Email, Stage Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-base font-bold text-indigo-600">
                    {candidate.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/candidates/${candidate._id}`}
                    className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors truncate block"
                  >
                    {candidate.name}
                  </Link>
                  <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="truncate">{candidate.email}</span>
                  </p>
                  {candidate.phone && (
                    <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                      <span>{candidate.phone}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="shrink-0 pt-0.5">
                <StageBadge stage={candidate.stage} />
              </div>
            </div>

            {/* Position & Application Date */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span className="font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                {candidate.position}
              </span>
              <span className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-3 h-3" />
                {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <Link
                href={`/candidates/${candidate._id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg border border-gray-200 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </Link>
              <Link
                href={`/candidates/${candidate._id}/edit`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-amber-50 hover:text-amber-600 rounded-lg border border-gray-200 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
              <button
                onClick={() => onDelete(candidate)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
