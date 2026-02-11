import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ResourceCard from '../components/resources/ResourceCard';

const MyCollection = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Using a hardcoded user_id for now as per MVP requirements
    const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

    useEffect(() => {
        fetchCollection();
    }, []);

    const fetchCollection = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
            const response = await fetch(`${apiUrl}/api/resources/collections/${MOCK_USER_ID}`);
            if (!response.ok) throw new Error('Failed to fetch collection');
            const { data } = await response.json();
            setResources(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-600">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">My Collection</h1>
                <p className="text-gray-600">Resources you've saved or interacted with.</p>
            </div>

            {resources.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-gray-500 mb-2">Your collection is empty.</p>
                    <a href="/" className="text-blue-600 font-medium hover:underline">
                        Browse resources to find something interesting!
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCollection;
