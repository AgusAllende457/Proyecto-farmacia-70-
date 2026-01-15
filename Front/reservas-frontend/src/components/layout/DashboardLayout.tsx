import React, { useState } from 'react';
// Ensure the Navbar component is correctly imported
import { Navbar } from '../layout/Navbar.tsx'; // Ensure Navbar.tsx exists in the same directory
// If Navbar.tsx does not exist, create it or correct the import path
// Check if Sidebar.tsx exists in the same directory or adjust the path
import { Sidebar } from '../layout/Sidebar.tsx'; // Ensure Sidebar.tsx exists in the same directory

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex">
                <Sidebar isOpen={sidebarOpen} />
                <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} pt-16`}>
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};