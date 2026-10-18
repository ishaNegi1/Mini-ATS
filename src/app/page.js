'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, UserCheck, UserX, Briefcase, ArrowRight, TrendingUp, UserPlus } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-red-500 text-center max-w-md">
          <p className="text-lg font-bold">Failed to load dashboard</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-4 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Recruitment Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time overview of your hiring pipeline</p>
        </div>
        <Link
          href="/candidates/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-xs sm:w-auto w-full"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Candidate</span>
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Candidates"
          value={stats.total}
          icon={Users}
          color="indigo"
          subtitle="All-time registered"
        />
        <StatCard
          title="Active Pipeline"
          value={stats.active}
          icon={TrendingUp}
          color="blue"
          subtitle="In screening / interview / offer"
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

      {/* Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Stage Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Hiring Pipeline by Stage</h2>
              <p className="text-xs text-gray-500 mt-0.5">Distribution across candidate lifecycle</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md">
              {stats.total} total
            </span>
          </div>

          {stats.total === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              No candidates in pipeline yet
            </div>
          ) : (
            <div className="w-full h-72 sm:h-80 -ml-2 sm:ml-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageCounts} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="stage"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [`${value} candidate(s)`, 'Count']}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={45}>
                    {stageCounts.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Top Positions by Demand */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Top Job Roles</h2>
              <p className="text-xs text-gray-500 mt-0.5">Positions with most applicants</p>
            </div>
          </div>

          {positionCounts.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              No positions recorded yet
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {positionCounts.map((item, index) => {
                const percentage = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
                return (
                  <div key={item.position} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 bg-indigo-50 rounded-md flex items-center justify-center shrink-0">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        <span className="font-medium text-gray-800 truncate">{item.position}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-xs font-semibold text-gray-500">{percentage}%</span>
                        <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">
                          {item.count}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Candidates List */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Applications</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest candidates added to the database</p>
          </div>
          <Link
            href="/candidates"
            className="flex items-center gap-1 text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
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
                className="flex items-center justify-between gap-3 py-3 px-2 sm:px-3 hover:bg-gray-50 -mx-2 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 group-hover:bg-indigo-200 transition-colors">
                    <span className="text-sm font-bold text-indigo-600">
                      {candidate.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                      {candidate.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{candidate.position}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StageBadge stage={candidate.stage} />
                  <span className="text-xs text-gray-400 hidden sm:inline-block">
                    {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
