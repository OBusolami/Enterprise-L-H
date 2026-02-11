import React, { useState } from 'react';
import { ExternalLink, Trash2, Loader2, Bookmark } from 'lucide-react';
import { cn } from '../../lib/utils';

const ResourceCard = ({ resource, onDelete }) => {
    const {
        id,
        title,
        summary,
        url,
        category,
        type,
        context_note,
        difficulty_level,
        estimated_time
    } = resource;

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        setIsDeleting(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
            const response = await fetch(`${apiUrl}/api/resources/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                if (onDelete) onDelete(id);
            }
        } catch (err) {
            console.error('Delete error:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className={cn(
            "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3 h-fit",
            isDeleting && "opacity-50 pointer-events-none"
        )}>
            {/* Header: Type/Category & Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete Resource"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div>
                <a href={url} target="_blank" rel="noopener noreferrer" className="group">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 flex items-start gap-2">
                        {title}
                        <ExternalLink className="w-4 h-4 text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                </a>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">{type}</span>
                </div>
                <p className="text-gray-600 mt-2 text-sm line-clamp-2">{summary}</p>
            </div>

            {/* Personal Context Highlight */}
            {context_note && (
                <div className="bg-blue-50 p-3 rounded-md mt-1">
                    <p className="text-xs font-medium text-blue-900 mb-1">💡 Why it's valuable:</p>
                    <p className="text-sm text-blue-800 italic">"{context_note}"</p>
                </div>
            )}

            {/* Footer: Submitter Info */}
            <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase">
                        OE
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;
