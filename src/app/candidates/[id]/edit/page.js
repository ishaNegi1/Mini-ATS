'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Pencil } from 'lucide-react';
import CandidateForm from '@/components/CandidateForm';
import { FormSkeleton } from '@/components/LoadingSkeleton';

function EditCandidateContent() {
  const params = useParams();
  const id = params?.id;
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/candidates/${id}`);
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || 'Candidate not found');
        }

        setCandidate(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  if (loading) return <FormSkeleton />;

  if (error) {
    return (
      <div className="space-y-6">
        <Link
          href="/candidates"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Candidates
        </Link>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-2xs">
          <p className="text-red-500 font-bold text-base">Candidate not found</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

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
            <Pencil className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          </div>
          <span>Edit Candidate</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Modify hiring stage, contact details, or notes for{' '}
          <span className="font-semibold text-gray-700">{candidate?.name}</span>.
        </p>
      </div>

      <CandidateForm candidate={candidate} isEditing={true} />
    </div>
  );
}

export default function EditCandidatePage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <EditCandidateContent />
    </Suspense>
  );
}
