'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { STAGES, POSITIONS } from '@/lib/constants';

export default function SearchFilter({
  onSearch,
  onFilterStage,
  onFilterPosition,
  currentSearch,
  currentStage,
  currentPosition,
}) {
  const [searchInput, setSearchInput] = useState(currentSearch || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const clearFilters = () => {
    setSearchInput('');
    onSearch('');
    onFilterStage('');
    onFilterPosition('');
  };

  const hasActiveFilters = currentSearch || currentStage || currentPosition;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-2xs">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search candidate name or email..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (e.target.value === '') onSearch('');
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 bg-white transition-shadow"
            />
          </div>
        </form>

        {/* Filter Dropdowns & Clear Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-3">
          {/* Stage Filter */}
          <div className="relative w-full lg:w-44">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={currentStage}
              onChange={(e) => onFilterStage(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-shadow"
              aria-label="Filter by hiring stage"
            >
              <option value="">All Stages</option>
              {STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Position Filter */}
          <div className="relative w-full lg:w-52">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={currentPosition}
              onChange={(e) => onFilterPosition(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-shadow"
              aria-label="Filter by job position"
            >
              <option value="">All Positions</option>
              {POSITIONS.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="col-span-full sm:col-span-2 lg:col-span-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors w-full lg:w-auto"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
