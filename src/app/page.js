'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, UserCheck, UserX, Briefcase, ArrowRight, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import StatCard from '@/components/StatCard';
import StageBadge from '@/components/StageBadge';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

const CHART_COLORS = ['#6366f1', '#eab308', '#a855f7', '#f97316', '#22c55e', '#ef4444'];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard');
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }

      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Failed to load dashboard</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, stageCounts, recentCandidates, positionCounts } = data;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your hiring pipeline</p>
        </div>
        <Link
          href="/candidates/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Users className="w-4 h-4" />
          Add Candidate
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Candidates"
          value={stats.total}
          icon={Users}
          color="indigo"
          subtitle="All time"
        />
        <StatCard
          title="Active Pipeline"
          value={stats.active}
          icon={TrendingUp}
          color="blue"
          subtitle="In process"
        />
        <StatCard
          title="Hired"
          value={stats.hired}
          icon={UserCheck}
          color="green"
          subtitle="Successfully placed"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={UserX}
          color="red"
          subtitle="Not moving forward"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Stage Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hiring Pipeline</h2>
          {stats.total === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              No candidates yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stageCounts} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={50}>
                  {stageCounts.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Positions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Positions</h2>
          {positionCounts.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              No positions yet
            </div>
          ) : (
            <div className="space-y-4">
              {positionCounts.map((item, index) => (
                <div key={item.position} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-700 truncate">{item.position}</p>
                      <span className="text-sm font-semibold text-gray-900 ml-2">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(item.count / stats.total) * 100}%`,
                          backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Candidates */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Candidates</h2>
          <Link
            href="/candidates"
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentCandidates.length === 0 ? (
          <EmptyState
            title="No candidates yet"
            description="Start by adding your first candidate to the system."
            actionLabel="Add Candidate"
            actionHref="/candidates/new"
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {recentCandidates.map((candidate) => (
              <Link
                key={candidate._id}
                href={`/candidates/${candidate._id}`}
                className="flex items-center gap-4 py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-indigo-600">
                    {candidate.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{candidate.name}</p>
                  <p className="text-xs text-gray-500 truncate">{candidate.position}</p>
                </div>
                <StageBadge stage={candidate.stage} />
                <p className="text-xs text-gray-400 hidden sm:block">
                  {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
