'use client';

import { useState, useEffect, use } from 'react';
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
  const { id } = use(params);
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
        <Link href="/candidates" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" /> Back to Candidates
        </Link>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-red-500 font-semibold text-lg">Candidate Not Found</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <Link
            href="/candidates"
            className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
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
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Candidates
      </Link>

      {/* Candidate Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-indigo-600">
                {candidate.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{candidate.position}</p>
              <div className="mt-2">
                <StageBadge stage={candidate.stage} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/candidates/${id}/edit`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={() => setShowDelete(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Candidate Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <a href={`mailto:${candidate.email}`} className="text-sm text-indigo-600 hover:underline">
                  {candidate.email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm text-gray-900">{candidate.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Position</p>
                <p className="text-sm text-gray-900">{candidate.position}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Applied On</p>
                <p className="text-sm text-gray-900">
                  {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm text-gray-900">
                  {new Date(candidate.updatedAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {candidate.notes && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            Notes
          </h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{candidate.notes}</p>
        </div>
      )}
    </div>
  );
}
