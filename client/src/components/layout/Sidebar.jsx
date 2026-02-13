import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, PlusCircle, Users, Plus, LogOut, User as UserIcon, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '../../api/config';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [isAddingTeam, setIsAddingTeam] = useState(false);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, team: null });
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setContextMenu({ ...contextMenu, visible: false });
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setContextMenu({ ...contextMenu, visible: false });
            }
        };

        if (contextMenu.visible) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [contextMenu]);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/api/teams`);
            const processedTeams = response.data.data.map(team => ({
                ...team,
                count: team.resource_count?.[0]?.count || 0
            }));
            setTeams(processedTeams);
        } catch (error) {
            console.error('Failed to fetch teams', error);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;

        try {
            await axios.post(`${getApiUrl()}/api/teams`, { name: newTeamName });
            setNewTeamName('');
            setIsAddingTeam(false);
            fetchTeams();
        } catch (error) {
            console.error('Failed to create team', error);
        }
    };

    const handleDeleteTeam = async () => {
        if (!contextMenu.team) return;

        const confirmDelete = window.confirm(`Are you sure you want to delete "${contextMenu.team.name}"?`);
        if (!confirmDelete) {
            setContextMenu({ ...contextMenu, visible: false });
            return;
        }

        try {
            await axios.delete(`${getApiUrl()}/api/teams/${contextMenu.team.id}`);
            setContextMenu({ ...contextMenu, visible: false });
            fetchTeams();
            // If we were on the team's page, go home
            if (location.pathname === `/teams/${contextMenu.team.id}`) {
                navigate('/');
            }
        } catch (error) {
            console.error('Failed to delete team', error);
            alert('Failed to delete team. Please try again.');
        }
    };

    const handleContextMenu = (e, team) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            team: team
        });
    };

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col">
            <div className="p-6 h-16 flex items-center border-b border-slate-100">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg group-hover:shadow-lg transition-all duration-300">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                        Learning Hub
                    </span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
                        Menu
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive('/')
                                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <BookOpen className="w-5 h-5" />
                                <span>All Resources</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/submit"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive('/submit')
                                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <PlusCircle className="w-5 h-5" />
                                <span>Add Resources</span>
                            </Link>
                        </li>

                    </ul>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Teams
                        </h3>
                        <button
                            onClick={() => setIsAddingTeam(!isAddingTeam)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {isAddingTeam && (
                        <form onSubmit={handleCreateTeam} className="mb-4 px-2">
                            <input
                                type="text"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                placeholder="Team name..."
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                autoFocus
                            />
                        </form>
                    )}

                    <ul className="space-y-1">
                        {teams.map((team) => (
                            <li key={team.id}>
                                <button
                                    onClick={() => navigate(`/teams/${team.id}`)}
                                    onContextMenu={(e) => handleContextMenu(e, team)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left group ${isActive(`/teams/${team.id}`)
                                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${isActive(`/teams/${team.id}`)
                                        ? 'bg-indigo-100 text-indigo-600'
                                        : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                                        }`}>
                                        {team.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="truncate text-sm flex-1">{team.name}</span>
                                    {team.count > 0 && (
                                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                            {team.count}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>


            <div className="p-4 border-t border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-400 text-center">Learning Hub v1.0</p>
            </div>

            {/* Custom Context Menu */}
            {contextMenu.visible && (
                <div
                    ref={menuRef}
                    className="fixed z-50 bg-white border border-slate-200 rounded-lg shadow-xl py-1 min-w-[160px] animate-in fade-in zoom-in duration-100"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button
                        onClick={handleDeleteTeam}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Team</span>
                    </button>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
