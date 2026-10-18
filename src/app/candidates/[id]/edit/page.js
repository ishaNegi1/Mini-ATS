'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';
import CandidateForm from '@/components/CandidateForm';
import { FormSkeleton } from '@/components/LoadingSkeleton';

export default function EditCandidatePage({ params }) {
  const { id } = use(params);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    try {
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

  if (loading) return <FormSkeleton />;

  if (error) {
    return (
      <div className="space-y-6">
        <Link href="/candidates" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" /> Back to Candidates
        </Link>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-red-500 font-semibold">Candidate not found</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/candidates/${id}`}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Candidate
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Pencil className="w-7 h-7 text-indigo-600" />
          Edit Candidate
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Update the details for {candidate.name}.
        </p>
      </div>

      <CandidateForm candidate={candidate} isEditing={true} />
    </div>
  );
}
