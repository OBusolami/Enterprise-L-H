import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ListPlus, AlertCircle, CheckCircle, Info } from 'lucide-react';
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

const BulkResourceForm = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [urls, setUrls] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [teamId, setTeamId] = useState('');

    const [status, setStatus] = useState('idle');
    const [report, setReport] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/teams');
                if (response.ok) {
                    const { data } = await response.json();
                    setTeams(data);
                }
            } catch (e) {
                console.error("Failed to fetch teams", e);
            }
        };
        fetchTeams();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!urls.trim()) return;

        setStatus('submitting');
        setErrorMessage('');
        setReport(null);

        try {
            const response = await fetch('http://localhost:5000/api/resources/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    urls,
                    category,
                    type,
                    team_id: teamId || null
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to process batch');

            setReport(data.summary);
            setStatus('success');

            const delay = (data.summary.skipped > 0 || data.summary.failed > 0) ? 4000 : 2000;
            setTimeout(() => navigate('/'), delay);

        } catch (err) {
            setStatus('error');
            setErrorMessage(err.message);
        }
    };

    if (status === 'success' && report) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">Batch Processed!</h3>
                <div className="mt-4 grid grid-cols-3 gap-4 w-full max-w-sm">
                    <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-600 font-medium uppercase">Added</p>
                        <p className="text-2xl font-bold text-green-700">{report.added}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium uppercase">Skipped</p>
                        <p className="text-2xl font-bold text-blue-700">{report.skipped}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-xs text-red-600 font-medium uppercase">Failed</p>
                        <p className="text-2xl font-bold text-red-700">{report.failed}</p>
                    </div>
                </div>
                <p className="text-gray-500 mt-6 italic">Redirecting to home...</p>
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

            <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <p className="text-sm text-blue-700">
                    Paste one or more URLs below. We'll automatically fetch titles and summaries for each one.
                    Duplicate links will be skipped automatically.
                </p>
            </div>

            {/* Bulk URL Input */}
            <div>
                <label htmlFor="urls" className="block text-sm font-medium text-gray-700 mb-1">
                    Resource URLs (one per line)
                </label>
                <textarea
                    id="urls"
                    required
                    rows={8}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="https://youtube.com/watch?v=...&#10;https://medium.com/..."
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                />
            </div>

            {/* Default Category & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Default Category</label>
                    <select
                        id="category"
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select Category...</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Default Type</label>
                    <select
                        id="type"
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">Select Type...</option>
                        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            {/* Team Selection */}
            <div>
                <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
                    Team (Optional)
                </label>
                <select
                    id="team"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                >
                    <option value="">No specific team</option>
                    {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={status === 'submitting' || !urls.trim()}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {status === 'submitting' ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Processing Batch...
                        </>
                    ) : (
                        <span className="flex items-center gap-2">
                            <ListPlus className="w-4 h-4" />
                            Bulk Share Resources
                        </span>
                    )}
                </button>
            </div>
        </form>
    );
};

export default BulkResourceForm;
