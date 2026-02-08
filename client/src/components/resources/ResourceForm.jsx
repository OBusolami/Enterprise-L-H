import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Link as LinkIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const CATEGORIES = [
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
    'Article', 'Video', 'Tutorial', 'Tool', 'Course', 'Newsletter', 'Podcast', 'Research Paper'
];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

const ResourceForm = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]); // State for teams dropdown
    const [formData, setFormData] = useState({
        url: '',
        title: '',
        summary: '',
        category: '',
        type: '',
        difficulty_level: '',
        personal_context: '',
        team_id: '',
        estimated_time: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading-metadata, submitting, success, error
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch teams on mount
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/teams');
                if (response.ok) {
                    const { data } = await response.json();
                    setTeams(data);
                }
            } catch (e) {
                console.error("Failed to fetch teams for dropdown", e);
            }
        };
        fetchTeams();
    }, []);

    const handleUrlBlur = async () => {
        if (!formData.url || !isValidUrl(formData.url)) return;

        setStatus('loading-metadata');
        try {
            const response = await fetch(`http://localhost:5000/api/resources/metadata?url=${encodeURIComponent(formData.url)}`);
            if (response.ok) {
                const { data } = await response.json();
                setFormData(prev => ({
                    ...prev,
                    title: prev.title || data.title,
                    summary: prev.summary || data.description
                }));
            }
        } catch (err) {
            console.warn("Failed to fetch metadata", err);
        } finally {
            setStatus('idle');
        }
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            // Clean up empty team_id before sending
            const payload = { ...formData, team_id: formData.team_id || null };

            const response = await fetch('http://localhost:5000/api/resources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 409) {
                const data = await response.json();
                throw new Error(data.error || 'This resource has already been shared.');
            }
            if (!response.ok) throw new Error('Failed to submit resource');

            setStatus('success');
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setStatus('error');
            setErrorMessage(err.message);
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">Resource Shared!</h3>
                <p className="text-gray-500 mt-2">Thanks for contributing to the hub.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl shadow-sm border border-gray-100">

            {errorMessage && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {errorMessage}
                </div>
            )}

            {/* URL Input */}
            <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                    Resource URL
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="url"
                        id="url"
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="https://..."
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        onBlur={handleUrlBlur}
                    />
                    {status === 'loading-metadata' && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                        </div>
                    )}
                </div>
            </div>

            {/* Team Selection (Optional) */}
            <div>
                <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
                    Team (Optional)
                </label>
                <select
                    id="team"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={formData.team_id}
                    onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                >
                    <option value="">No specific team</option>
                    {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">If selected, this resource will appear in the team's dashboard.</p>
            </div>

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
            </div>

            {/* Category & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        id="category"
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="">Select...</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                        id="type"
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="">Select...</option>
                        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            {/* Summary */}
            <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                    Summary
                </label>
                <textarea
                    id="summary"
                    rows={3}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Briefly describe the content..."
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                />
            </div>

            {/* Personal Context */}
            <div>
                <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">
                    Why is this valuable? (Context)
                </label>
                <textarea
                    id="context"
                    rows={3}
                    className="block w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="I used this to solve..."
                    value={formData.personal_context}
                    onChange={(e) => setFormData({ ...formData, personal_context: e.target.value })}
                />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {status === 'submitting' ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Sharing...
                        </>
                    ) : (
                        'Share Resource'
                    )}
                </button>
            </div>
        </form>
    );
};

export default ResourceForm;
