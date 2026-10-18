'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  FileText,
  Clock,
} from 'lucide-react';
import StageBadge from '@/components/StageBadge';
import DeleteModal from '@/components/DeleteModal';
import Toast from '@/components/Toast';
import { FormSkeleton } from '@/components/LoadingSkeleton';

export default function CandidateDetailPage({ params }) {
  const id = params.id;
  const router = useRouter();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchCandidate();
  }, [id]);

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

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setToast({ message: 'Candidate deleted successfully', type: 'success' });
      setTimeout(() => {
        router.push('/candidates');
        router.refresh();
      }, 1000);
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete', type: 'error' });
    } finally {
      setDeleteLoading(false);
      setShowDelete(false);
    }
  };

  if (loading) return <FormSkeleton />;

  if (error) {
    return (
      <div className="space-y-6">
        <Link
          href="/candidates"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Candidates
        </Link>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-2xs">
          <p className="text-red-500 font-bold text-lg">Candidate Not Found</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <Link
            href="/candidates"
            className="inline-block mt-4 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Go to Candidates
          </Link>
        </div>
      </div>
    );
  }

  if (!candidate) return null;

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showDelete && (
        <DeleteModal
          candidateName={candidate.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          loading={deleteLoading}
        />
      )}

      {/* Back Link */}
      <Link
        href="/candidates"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Candidates</span>
      </Link>

      {/* Candidate Profile Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 shadow-xs">
              <span className="text-xl sm:text-2xl font-bold text-indigo-600">
                {candidate.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight truncate">
                {candidate.name}
              </h1>
              <p className="text-sm font-medium text-gray-600 mt-0.5 truncate">{candidate.position}</p>
              <div className="mt-2">
                <StageBadge stage={candidate.stage} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
            <Link
              href={`/candidates/${id}/edit`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </Link>
            <button
              onClick={() => setShowDelete(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-2xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detail Cards: Contact & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-2xs">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Contact Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</p>
                <a
                  href={`mailto:${candidate.email}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline break-all"
                >
                  {candidate.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Phone className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</p>
                <p className="text-sm font-medium text-gray-900">
                  {candidate.phone || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Briefcase className="w-4 h-4 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Applied Position</p>
                <p className="text-sm font-medium text-gray-900">{candidate.position}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline & Metadata */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-2xs">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Application Timeline
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Application Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Activity</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(candidate.updatedAt).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Notes */}
      {candidate.notes && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-2xs">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            <span>Recruiter Notes</span>
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {candidate.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
