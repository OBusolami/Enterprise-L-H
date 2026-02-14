import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Loader2, Bookmark, MoreVertical, Archive, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getApiUrl } from '../../api/config';

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
        estimated_time,
        upvote_count = 0,
        downvote_count = 0
    } = resource;

    const [isDeleting, setIsDeleting] = useState(false);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    const [votes, setVotes] = useState({ up: upvote_count, down: downvote_count });
    const [userVote, setUserVote] = useState(null); // 'up', 'down', or null
    const menuRef = useRef(null);

    useEffect(() => {
        const savedVotes = JSON.parse(localStorage.getItem('user_votes') || '{}');
        if (savedVotes[id]) {
            setUserVote(savedVotes[id]);
        }
    }, [id]);

    const saveVoteToLocal = (vote) => {
        const savedVotes = JSON.parse(localStorage.getItem('user_votes') || '{}');
        if (vote) {
            savedVotes[id] = vote;
        } else {
            delete savedVotes[id];
        }
        localStorage.setItem('user_votes', JSON.stringify(savedVotes));
        setUserVote(vote);
    };

    const handleVote = async (voteType) => {
        const isUpvote = voteType === 'upvote';
        const currentVote = userVote;

        // Determine action
        let action = 'vote';
        if (currentVote === (isUpvote ? 'up' : 'down')) {
            action = 'unvote';
        }

        try {
            // If switching votes, we need to unvote the other one first
            if (currentVote && action === 'vote') {
                const otherType = currentVote === 'up' ? 'upvote' : 'downvote';
                await fetch(`${getApiUrl()}/api/resources/${id}/vote`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ voteType: otherType, action: 'unvote' })
                });
                setVotes(prev => ({
                    ...prev,
                    [currentVote]: Math.max(0, prev[currentVote] - 1)
                }));
            }

            const response = await fetch(`${getApiUrl()}/api/resources/${id}/vote`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ voteType, action })
            });

            if (response.ok) {
                const { data } = await response.json();
                setVotes({
                    up: data.upvote_count,
                    down: data.downvote_count
                });
                saveVoteToLocal(action === 'unvote' ? null : (isUpvote ? 'up' : 'down'));
            }
        } catch (err) {
            console.error('Vote error:', err);
        }
    };

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

    const handleArchive = async (e) => {
        e.stopPropagation();
        if (!window.confirm('Archive this resource? It will be moved to the Archived section.')) {
            setContextMenu({ ...contextMenu, visible: false });
            return;
        }
        setIsDeleting(true);
        setContextMenu({ ...contextMenu, visible: false });
        try {
            const response = await fetch(`${getApiUrl()}/api/resources/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'archived' })
            });
            if (response.ok) {
                if (onDelete) onDelete(id);
            }
        } catch (err) {
            console.error('Archive error:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePermanentDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm('Permanently delete this resource? This cannot be undone.')) {
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
                "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 h-[280px] relative group",
                isDeleting && "opacity-50 pointer-events-none"
            )}
        >
            {/* Context Menu Hint */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-1 text-gray-300 hover:text-gray-500 rounded cursor-help" title="Right-click for options">
                    <MoreVertical className="w-4 h-4" />
                </div>
            </div>

            {/* Header: Type/Category */}
            <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {category}
                </span>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <a href={url} target="_blank" rel="noopener noreferrer" className="group">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 flex items-start gap-2 line-clamp-2">
                        {title}
                        <ExternalLink className="w-4 h-4 text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
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

            {/* Voting UI - Bottom of Card */}
            <div className="flex items-center justify-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 mt-3">
                <button
                    onClick={() => handleVote('upvote')}
                    className={cn(
                        "p-1 rounded transition-colors",
                        userVote === 'up' ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                    )}
                    title="Upvote"
                >
                    <ThumbsUp className={cn("w-4 h-4", userVote === 'up' && "fill-current")} />
                </button>
                <span className={cn(
                    "text-xs font-bold min-w-[20px] text-center",
                    (votes.up - votes.down) > 0 ? "text-green-600" : (votes.up - votes.down) < 0 ? "text-red-600" : "text-slate-500"
                )}>
                    {votes.up - votes.down}
                </span>
                <button
                    onClick={() => handleVote('downvote')}
                    className={cn(
                        "p-1 rounded transition-colors",
                        userVote === 'down' ? "text-red-600 bg-red-50" : "text-slate-400 hover:text-red-600 hover:bg-slate-100"
                    )}
                    title="Downvote"
                >
                    <ThumbsDown className={cn("w-4 h-4", userVote === 'down' && "fill-current")} />
                </button>
            </div>

            {/* Resource Context Menu */}
            {contextMenu.visible && (
                <div
                    ref={menuRef}
                    className="fixed z-50 bg-white border border-slate-200 rounded-lg shadow-xl py-1 min-w-[170px] animate-in fade-in zoom-in duration-100"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    {resource.status !== 'archived' ? (
                        <button
                            onClick={handleArchive}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <Archive className="w-4 h-4" />
                            <span>Archive Resource</span>
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    setIsDeleting(true);
                                    try {
                                        await fetch(`${getApiUrl()}/api/resources/${id}/status`, {
                                            method: 'PATCH',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ status: 'active' })
                                        });
                                        if (onDelete) onDelete(id);
                                    } catch (err) {
                                        console.error('Restore error:', err);
                                    } finally {
                                        setIsDeleting(false);
                                    }
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors"
                            >
                                <Archive className="w-4 h-4" />
                                <span>Restore Resource</span>
                            </button>
                            <button
                                onClick={handlePermanentDelete}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <span>Delete Permanently</span>
                            </button>
                        </>
                    )}
                </div>
            )}

        </div>
    );
};

export default ResourceCard;
