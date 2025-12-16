import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  icon?: string;
  color?: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedIds,
  onChange,
  placeholder = 'Select options...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options available',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOptions = options.filter(opt => selectedIds.includes(opt.id));

  const toggleOption = (optionId: string) => {
    if (selectedIds.includes(optionId)) {
      onChange(selectedIds.filter(id => id !== optionId));
    } else {
      onChange([...selectedIds, optionId]);
    }
  };

  const removeOption = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedIds.filter(id => id !== optionId));
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Selected Tags */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 rounded-lg">
          {selectedOptions.map(option => (
            <span
              key={option.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-md text-sm"
            >
              {option.icon && <span>{option.icon}</span>}
              <span>{option.label}</span>
              {option.color && (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: option.color }}
                />
              )}
              <button
                type="button"
                onClick={(e) => removeOption(option.id, e)}
                className="ml-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
      >
        <span className="text-sm text-gray-600">
          {selectedIds.length > 0
            ? `${selectedIds.length} selected`
            : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-gray-500">
                {searchQuery ? 'No results found' : emptyMessage}
              </div>
            ) : (
              <div className="py-1">
                {filteredOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleOption(option.id)}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                      selectedIds.includes(option.id) ? 'bg-primary-50' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedIds.includes(option.id)
                          ? 'bg-primary-600 border-primary-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedIds.includes(option.id) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Icon */}
                    {option.icon && <span className="text-lg">{option.icon}</span>}

                    {/* Label */}
                    <span className="flex-1 text-sm font-medium text-gray-900">
                      {option.label}
                    </span>

                    {/* Color Indicator */}
                    {option.color && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredOptions.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
              {selectedIds.length} of {options.length} selected
            </div>
          )}
        </div>
      )}
    </div>
  );
};
