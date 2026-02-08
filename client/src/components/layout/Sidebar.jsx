import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Users, Settings, BookOpen, LogOut, LogIn, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import AddTeamModal from '../teams/AddTeamModal';


const Sidebar = () => {
    const [teams, setTeams] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/teams');
            if (response.ok) {
                const { data } = await response.json();
                setTeams(data);
            }
        } catch (err) {
            console.warn('Failed to fetch teams', err);
        }
    };

    const handleTeamAdded = (newTeam) => {
        setTeams([...teams, newTeam]);
    };

    const handleDeleteTeam = async (e, teamId) => {
        e.preventDefault(); // Prevent navigation to team view
        e.stopPropagation();

        if (!window.confirm('Are you sure you want to delete this team?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/teams/${teamId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTeams(teams.filter(team => team.id !== teamId));
            } else {
                alert('Failed to delete team');
            }
        } catch (err) {
            console.error('Delete team error:', err);
            alert('An error occurred while deleting the team');
        }
    };

    return (
        <>
            <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-10">
                <div className="p-6 flex items-center gap-2 border-b border-gray-100">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-xl text-slate-800">Learning Hub</span>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                    {/* Main Navigation */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu</h3>
                        <nav className="space-y-1">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )
                                }
                            >
                                <Home className="w-4 h-4" />
                                Home
                            </NavLink>
                            <NavLink
                                to="/submit"
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )
                                }
                            >
                                <PlusCircle className="w-4 h-4" />
                                Share Resource
                            </NavLink>

                        </nav>
                    </div>

                    {/* Teams Section */}
                    <div>
                        <div className="flex items-center justify-between px-2 mb-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Teams</h3>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                title="Add Team"
                            >
                                <PlusCircle className="w-4 h-4" />
                            </button>
                        </div>
                        <nav className="space-y-1">
                            {teams.length === 0 ? (
                                <p className="px-3 text-sm text-gray-400 italic">No teams yet</p>
                            ) : (
                                teams.map((team) => (
                                    <div key={team.id} className="group relative flex items-center">
                                        <NavLink
                                            to={`/teams/${team.id}`}
                                            className={({ isActive }) =>
                                                cn(
                                                    "flex-1 flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors pr-10",
                                                    isActive
                                                        ? "bg-blue-50 text-blue-700"
                                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                )
                                            }
                                        >
                                            <Users className="w-4 h-4" />
                                            {team.name}
                                        </NavLink>
                                        <button
                                            onClick={(e) => handleDeleteTeam(e, team.id)}
                                            className="absolute right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1.5 rounded-md hover:bg-red-50 z-20"
                                            title="Delete Team"
                                            type="button"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100">

                </div>
            </div>

            <AddTeamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTeamAdded={handleTeamAdded}
            />
        </>
    );
};

export default Sidebar;

