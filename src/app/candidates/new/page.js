'use client';

import { UserPlus } from 'lucide-react';
import CandidateForm from '@/components/CandidateForm';

export default function NewCandidatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <UserPlus className="w-7 h-7 text-indigo-600" />
          Add New Candidate
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below to add a new candidate to the system.
        </p>
      </div>

      <CandidateForm />
    </div>
  );
}
