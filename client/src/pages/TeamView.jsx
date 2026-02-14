import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ResourceCard from '../components/resources/ResourceCard';
import { getApiUrl } from '../api/config';

const TeamView = () => {
    const { teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch team details
                const teamRes = await fetch(`${getApiUrl()}/api/teams/${teamId}`);
                if (!teamRes.ok) throw new Error('Failed to fetch team details');
                const teamData = await teamRes.json();
                setTeam(teamData.data);

                // Fetch team resources
                const resourcesRes = await fetch(`${getApiUrl()}/api/resources?team_id=${teamId}`);
                if (!resourcesRes.ok) throw new Error('Failed to fetch team resources');
                const resourcesData = await resourcesRes.json();
                setResources(resourcesData.data);

            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (teamId) {
            fetchData();
        }
    }, [teamId]);

    const handleDeleted = (id) => {
        setResources(resources.filter(r => r.id !== id));
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
    if (error) return <div className="text-red-600 p-8">Error: {error}</div>;
    if (!team) return <div className="p-8">Team not found</div>;

    return (
        <div>
            <div className="mb-4 sm:mb-6 border-b border-gray-100 pb-4 sm:pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{team.name}</h1>
                {team.description && <p className="text-gray-600">{team.description}</p>}

                <div className="mt-4 flex gap-4 text-sm text-gray-500">
                    <span>{resources.length} Resources</span>
                    <span>•</span>
                    <span>Created {new Date(team.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Resources</h2>

                {resources.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg border border-gray-100">
                        <p className="text-gray-500">No resources shared with this team yet.</p>
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
        </div>
    );
};

export default TeamView;
