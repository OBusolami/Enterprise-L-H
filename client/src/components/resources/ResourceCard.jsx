import React, { useState } from 'react';
import { ExternalLink, Trash2, Loader2, Bookmark, MoreVertical } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getApiUrl } from '../../api/config';
import { useEffect, useRef } from 'react';

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
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setContextMenu({ ...contextMenu, visible: false });
            }
        };
        if (contextMenu.visible) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [contextMenu]);

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this resource?')) {
            setContextMenu({ ...contextMenu, visible: false });
            return;
        }
        setIsDeleting(true);
        setContextMenu({ ...contextMenu, visible: false });
        try {
            const response = await fetch(`${getApiUrl()}/api/resources/${id}`, {
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

    const handleContextMenu = (e) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY
        });
    };

    return (
        <div
            onContextMenu={handleContextMenu}
            className={cn(
                "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3 h-fit relative group",
                isDeleting && "opacity-50 pointer-events-none"
            )}
        >
            {/* Context Menu Hint (Visible on hover for new users) */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-1 text-gray-300 hover:text-gray-500 rounded cursor-help" title="Right-click for options">
                    <MoreVertical className="w-4 h-4" />
                </div>
            </div>

            {/* Header: Type/Category */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category}
                    </span>
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

            {/* Resource Context Menu */}
            {contextMenu.visible && (
                <div
                    ref={menuRef}
                    className="fixed z-50 bg-white border border-slate-200 rounded-lg shadow-xl py-1 min-w-[160px] animate-in fade-in zoom-in duration-100"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button
                        onClick={handleDelete}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Resource</span>
                    </button>
                </div>
            )}

        </div>
    );
};

export default ResourceCard;
