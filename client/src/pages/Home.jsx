import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ResourceCard from '../components/resources/ResourceCard';
import SearchFilterBar from '../components/resources/SearchFilterBar';
import { getApiUrl } from '../api/config';

const Home = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ search: '', category: 'All', type: 'All' });

    const fetchResources = async () => {
        setLoading(true);
        try {
            let url = `${getApiUrl()}/api/resources`;
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.category && filters.category !== 'All') params.append('category', filters.category);
            if (filters.type && filters.type !== 'All') params.append('type', filters.type);

            const queryString = params.toString();
            if (queryString) url += `?${queryString}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch resources');
            const data = await response.json();
            setResources(data.data);
        } catch (error) {
            console.error('Failed to fetch resources', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [filters]);

    const handleDeleted = (id) => {
        setResources(resources.filter(r => r.id !== id));
    };

    return (
        <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <SearchFilterBar filters={filters} onFilterChange={setFilters} />
            </div>

            {loading ? (
                <div className="flex justify-center p-8 sm:p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : error ? (
                <div className="p-4 sm:p-6 text-center bg-red-50 text-red-600 rounded-lg border border-red-100">
                    Error loading resources: {error}
                </div>
            ) : resources.length === 0 ? (
                <div className="p-8 sm:p-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No resources found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                    {resources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            onDelete={handleDeleted}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
