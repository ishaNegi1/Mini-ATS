'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import CandidateTable from '@/components/CandidateTable';
import SearchFilter from '@/components/SearchFilter';
import DeleteModal from '@/components/DeleteModal';
import Toast from '@/components/Toast';
import EmptyState from '@/components/EmptyState';
import { TableSkeleton } from '@/components/LoadingSkeleton';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchCandidates = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (stageFilter) params.set('stage', stageFilter);
      if (positionFilter) params.set('position', positionFilter);
      params.set('page', page.toString());
      params.set('limit', '10');

      const res = await fetch(`/api/candidates?${params.toString()}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch candidates');
      }

      setCandidates(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, stageFilter, positionFilter]);

  useEffect(() => {
    fetchCandidates(1);
  }, [fetchCandidates]);

  const handleDelete = async () => {
    if (!deleteCandidate) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/candidates/${deleteCandidate._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setToast({ message: 'Candidate deleted successfully', type: 'success' });
      setDeleteCandidate(null);
      fetchCandidates(pagination.page);
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete candidate', type: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteCandidate && (
        <DeleteModal
          candidateName={deleteCandidate.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteCandidate(null)}
          loading={deleteLoading}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Candidates</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} candidate{pagination.total !== 1 ? 's' : ''} in total
          </p>
        </div>
        <Link
          href="/candidates/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-xs w-full sm:w-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Candidate</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <SearchFilter
        onSearch={setSearch}
        onFilterStage={setStageFilter}
        onFilterPosition={setPositionFilter}
        currentSearch={search}
        currentStage={stageFilter}
        currentPosition={positionFilter}
      />

      {/* Content */}
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-2xs">
          <p className="text-red-500 font-semibold text-base">Error loading candidates</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <button
            onClick={() => fetchCandidates(pagination.page)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Retry
          </button>
        </div>
      ) : candidates.length === 0 ? (
        <EmptyState
          title="No candidates found"
          description={
            search || stageFilter || positionFilter
              ? 'Try adjusting your search query or removing active filters.'
              : 'Get started by creating your first candidate record.'
          }
          actionLabel={!search && !stageFilter && !positionFilter ? 'Add Candidate' : undefined}
          actionHref={!search && !stageFilter && !positionFilter ? '/candidates/new' : undefined}
        />
      ) : (
        <>
          <CandidateTable
            candidates={candidates}
            onDelete={(candidate) => setDeleteCandidate(candidate)}
          />

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-xl border border-gray-200 px-4 sm:px-6 py-3.5 shadow-2xs">
              <p className="text-xs sm:text-sm text-gray-500">
                Showing{' '}
                <span className="font-semibold text-gray-800">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-gray-800">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-gray-800">
                  {pagination.total}
                </span>{' '}
                candidates
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchCandidates(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>
                <span className="text-xs sm:text-sm font-semibold text-gray-700 px-2 py-1 bg-gray-100 rounded-md">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchCandidates(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
