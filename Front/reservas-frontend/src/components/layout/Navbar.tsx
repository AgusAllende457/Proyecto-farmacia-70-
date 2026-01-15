import React from 'react';
import { useAuth } from '@context/AuthContext';
import { Menu, Bell, LogOut, User, Pill } from 'lucide-react';

interface NavbarProps {
    onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Left Section */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onMenuClick}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Menu className="w-6 h-6 text-gray-600" />
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Pill className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Farmacia General Paz</h1>
                                <p className="text-xs text-gray-500">Sistema de Gestión</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {/* Notificaciones */}
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <Bell className="w-6 h-6 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Usuario */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                            <div className="bg-blue-600 p-2 rounded-full">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-gray-900">{user?.nombreCompleto}</p>
                                <p className="text-gray-500">{user?.rol}</p>
                            </div>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={logout}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            title="Cerrar Sesión"
                        >
                            <LogOut className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};