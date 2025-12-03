import React, { useState, useEffect } from 'react';
import { departmentService, Department } from '@/services/department.service';
import { Loader2 } from 'lucide-react';

interface DepartmentSelectionProps {
  companyId: string;
  onSelectDepartment: (departmentId: string) => void;
  onClose: () => void;
}

export const DepartmentSelection: React.FC<DepartmentSelectionProps> = ({
  companyId,
  onSelectDepartment,
  onClose,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDepartments();
  }, [companyId]);

  const loadDepartments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await departmentService.getPublicDepartments(companyId);
      setDepartments(data.filter(dept => dept.is_active));
    } catch (err: any) {
      console.error('Failed to load departments:', err);
      setError('Failed to load departments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-96 h-[600px] bg-white rounded-lg shadow-2xl overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="px-6 py-4 bg-cyan-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">How can we help?</h3>
            <p className="text-sm opacity-90 mt-1">Choose a department to get started</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 h-[calc(100%-88px)] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading departments...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-2">{error}</p>
            <button
              onClick={loadDepartments}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No departments available</p>
            <p className="text-gray-500 text-sm mt-2">Please contact support directly</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-700 font-medium mb-3">
              Select a department to continue:
            </p>

            {/* Tag-based Department Selection */}
            <div className="flex flex-wrap gap-2">
              {departments
                .sort((a, b) => a.display_order - b.display_order)
                .map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => onSelectDepartment(dept.id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-full hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-200 group"
                    style={{
                      borderColor: dept.color ? `${dept.color}40` : undefined,
                    }}
                  >
                    <span className="text-xl">{dept.icon || '📁'}</span>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-cyan-700">
                      {dept.name}
                    </span>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: dept.color || '#6B7280' }}
                    />
                  </button>
                ))}
            </div>

            {/* Optional: Show descriptions on hover or below */}
            <p className="text-xs text-gray-500 mt-4 text-center">
              Choose the category that best matches your needs
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
