import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, PlusCircle, Users, Plus, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [isAddingTeam, setIsAddingTeam] = useState(false);

    useEffect(() => {
        fetchTeams();
    }, [user]);

    const fetchTeams = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
            const response = await axios.get(`${apiUrl}/api/teams`);
            setTeams(response.data.data);
        } catch (error) {
            console.error('Failed to fetch teams', error);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;

        try {
            const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
            await axios.post(`${apiUrl}/api/teams`, { name: newTeamName });
            setNewTeamName('');
            setIsAddingTeam(false);
            fetchTeams();
        } catch (error) {
            console.error('Failed to create team', error);
        }
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
                                <span>Share Resource</span>
                            </Link>
                        </li>
                        {!user && (
                            <li>
                                <Link
                                    to="/login"
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-50`}
                                >
                                    <UserIcon className="w-5 h-5" />
                                    <span>Sign In</span>
                                </Link>
                            </li>
                        )}
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
                                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-left group">
                                    <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-medium group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                        {team.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="truncate text-sm">{team.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>


            <div className="p-4 border-t border-slate-100 bg-slate-50">
                {user ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold">
                                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-slate-700 truncate">{user.username}</p>
                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                            className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-indigo-200"
                    >
                        <UserIcon className="w-4 h-4" />
                        Sign In
                    </Link>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
