import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Users,
  MapPin,
  BarChart3,
  ClipboardList,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user } = useAuth();

  // Menú según rol (RF8)
  const menuItems = {
    Administrador: [
      { path: '/dashboard/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/pedidos', icon: Package, label: 'Gestión de Pedidos' },
      { path: '/asignar-operario', icon: Users, label: 'Asignar Operarios' },
      { path: '/asignar-cadete', icon: MapPin, label: 'Asignar Cadetes' },
      { path: '/seguimiento', icon: ClipboardList, label: 'Seguimiento' },
      { path: '/reportes', icon: BarChart3, label: 'Reportes' },
      { path: '/usuarios', icon: Users, label: 'Usuarios' },
    ],
    Operario: [
      { path: '/dashboard/operario', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/mis-pedidos', icon: Package, label: 'Mis Pedidos' },
      { path: '/seguimiento', icon: ClipboardList, label: 'Seguimiento' },
    ],
    Cadete: [
      { path: '/dashboard/cadete', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/entregas', icon: MapPin, label: 'Mis Entregas' },
      { path: '/seguimiento', icon: ClipboardList, label: 'Seguimiento' },
      { path: '/intentos-fallidos', icon: FileText, label: 'Entregas Fallidas' },
    ],
  };

  const currentMenu = user ? menuItems[user.rol] : [];

  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {currentMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Info de la Sucursal */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <p className="font-medium">Sucursal:</p>
          <p>{user?.nombreSucursal}</p>
        </div>
      </div>
    </aside>
  );
};

