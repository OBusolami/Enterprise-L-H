import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const CATEGORIES = [
    'All',
    'AI & Machine Learning',
    'Data Engineering & Architecture',
    'Data Science & Analytics',
    'Programming & Development',
    'Tools & Platforms',
    'Productivity & Career Development',
    'Research & Papers',
    'Industry News & Trends'
];

const TYPES = [
    'All', 'Article', 'Video', 'Tutorial', 'Tool', 'Course', 'Newsletter', 'Podcast', 'Research Paper'
];

const SearchFilterBar = ({ filters, onFilterChange }) => {
    const handleSearchChange = (value) => {
        onFilterChange(prev => ({ ...prev, search: value }));
    };

    const handleCategoryChange = (cat) => {
        onFilterChange(prev => ({ ...prev, category: cat }));
    };

    const handleTypeChange = (type) => {
        onFilterChange(prev => ({ ...prev, type: type }));
    };

    return (
        <div className="space-y-4 mb-8">
            {/* Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all"
                    placeholder="Search resources by title, summary, or keyword..."
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
                {filters.search && (
                    <button
                        onClick={() => handleSearchChange('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Internal Filters Section */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Category Pills */}
                <div className="flex-1 overflow-x-auto pb-2 scrollbar-none">
                    <div className="flex gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border",
                                    filters.category === cat
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Type Dropdown (Simple select for now to save space) */}
                <div className="min-w-[150px]">
                    <div className="relative">
                        <select
                            value={filters.type}
                            onChange={(e) => handleTypeChange(e.target.value)}
                            className="block w-full pl-3 pr-8 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            {TYPES.map(t => (
                                <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchFilterBar;
