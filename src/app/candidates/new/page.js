'use client';

import Link from 'next/link';
import { UserPlus, ArrowLeft } from 'lucide-react';
import CandidateForm from '@/components/CandidateForm';

export default function NewCandidatePage() {
  return (
    <div className="space-y-6">
      <Link
        href="/candidates"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Candidates</span>
      </Link>

      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2.5 sm:gap-3 tracking-tight">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          </div>
          <span>Add New Candidate</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Complete candidate profile to initiate tracking in the hiring pipeline.
        </p>
      </div>

      <CandidateForm />
    </div>
  );
}
