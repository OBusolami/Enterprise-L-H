import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsSidebarCollapsed(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleToggle = () => {
        if (isMobile) {
            setIsMobileMenuOpen(!isMobileMenuOpen);
        } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Mobile overlay */}
            {isMobile && isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300' : ''} ${isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}`}>
                <Sidebar
                    isCollapsed={isMobile ? false : isSidebarCollapsed}
                    onToggle={handleToggle}
                    isMobile={isMobile}
                    onNavigate={() => isMobile && setIsMobileMenuOpen(false)}
                />
            </div>

            {/* Main content */}
            <div className={`flex-1 overflow-y-auto bg-gray-50 transition-all duration-300 ${!isMobile && (isSidebarCollapsed ? 'ml-16' : 'ml-64')}`}>
                <div className="px-2 sm:px-3 py-2 sm:py-3">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
