'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import { STAGES, POSITIONS } from '@/lib/constants';
import Toast from './Toast';

export default function CandidateForm({ candidate, isEditing = false }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: candidate?.name || '',
    email: candidate?.email || '',
    phone: candidate?.phone || '',
    position: candidate?.position || '',
    stage: candidate?.stage || 'Applied',
    notes: candidate?.notes || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.position) newErrors.position = 'Job position is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const url = isEditing
        ? `/api/candidates/${candidate._id}`
        : '/api/candidates';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        setToast({ message: data.error, type: 'error' });
        return;
      }

      setToast({
        message: isEditing ? 'Candidate updated successfully!' : 'Candidate created successfully!',
        type: 'success',
      });

      setTimeout(() => {
        router.push('/candidates');
        router.refresh();
      }, 1000);
    } catch (error) {
      setToast({ message: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8 max-w-3xl shadow-2xs"
      >
        <div className="space-y-5">
          {/* Row 1: Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.name ? 'border-red-300 bg-red-50/50' : 'border-gray-300'
                }`}
                placeholder="e.g. Aarav Sharma"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-300'
                }`}
                placeholder="e.g. aarav.sharma@example.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Row 2: Phone & Position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="e.g. +91 98201 34567"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Position <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  className={`w-full px-3.5 py-2.5 pr-8 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-colors ${
                    errors.position ? 'border-red-300 bg-red-50/50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a position</option>
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
              {errors.position && <p className="text-xs text-red-500 mt-1">{errors.position}</p>}
            </div>
          </div>

          {/* Row 3: Stage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hiring Stage</label>
            <div className="relative">
              <select
                value={formData.stage}
                onChange={(e) => handleChange('stage', e.target.value)}
                className="w-full px-3.5 py-2.5 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-colors"
              >
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
          </div>

          {/* Row 4: Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Candidate Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-colors"
              placeholder="Notes on skills, interview feedback, current notice period, salary expectations..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{loading
              ? isEditing ? 'Updating...' : 'Creating...'
              : isEditing ? 'Update Candidate' : 'Create Candidate'}
            </span>
          </button>
        </div>
      </form>
    </>
  );
}
