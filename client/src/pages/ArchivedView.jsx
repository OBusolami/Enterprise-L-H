import React, { useEffect, useState } from 'react';
import { Loader2, Archive, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResourceCard from '../components/resources/ResourceCard';
import { getApiUrl } from '../api/config';

const ArchivedView = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchArchived = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${getApiUrl()}/api/resources?status=archived`);
            if (!response.ok) throw new Error('Failed to fetch archived resources');
            const data = await response.json();
            setResources(data.data);
        } catch (error) {
            console.error('Failed to fetch archived resources', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArchived();
    }, []);

    const handleAction = (id) => {
        setResources(resources.filter(r => r.id !== id));
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Archive className="w-8 h-8 text-amber-500" />
                        Archived Resources
                    </h1>
                    <p className="text-gray-500 mt-1">Resources that have been moved out of the main dashboard.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : error ? (
                <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg border border-red-100">
                    Error loading archived resources: {error}
                </div>
            ) : resources.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                    <Archive className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No archived resources yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            onDelete={handleAction}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArchivedView;
