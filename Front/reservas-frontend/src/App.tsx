import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import { ProtectedRoute } from '@components/auth/ProtectedRoute';

// Importación de Páginas
import { Login } from '@pages/Login';
import { DashboardAdmin } from '@pages/DashboardAdmin';
import { DashboardOperario } from '@pages/DashboardOperario';
import { DashboardCadete } from '@pages/DashboardCadete';
import { SeguimientoPedidos } from '@pages/SeguimientoPedidos';
import { AsignarOperarioPage } from '@pages/AsignarOperario';
import { AsignarCadetePage } from '@pages/AsignarCadete';
import OrderFormPage from '@pages/orders/OrderFormPage'; // Importamos la nueva página de pedidos

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* --- RUTA PÚBLICA --- */}
          <Route path="/login" element={<Login />} />

          {/* --- RUTAS EXCLUSIVAS PARA ADMINISTRADOR --- */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['Administrador']}>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/asignar-operario"
            element={
              <ProtectedRoute allowedRoles={['Administrador']}>
                <AsignarOperarioPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/asignar-cadete"
            element={
              <ProtectedRoute allowedRoles={['Administrador']}>
                <AsignarCadetePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seguimiento"
            element={
              <ProtectedRoute allowedRoles={['Administrador']}>
                <SeguimientoPedidos />
              </ProtectedRoute>
            }
          />

          {/* --- RUTAS COMPARTIDAS (ADMIN Y OPERARIO) --- */}
          <Route
            path="/pedidos"
            element={
              <ProtectedRoute allowedRoles={['Administrador', 'Operario']}>
                <OrderFormPage />
              </ProtectedRoute>
            }
          />

          {/* --- RUTA EXCLUSIVA PARA OPERARIO --- */}
          <Route
            path="/dashboard/operario"
            element={
              <ProtectedRoute allowedRoles={['Operario']}>
                <DashboardOperario />
              </ProtectedRoute>
            }
          />

          {/* --- RUTA EXCLUSIVA PARA CADETE --- */}
          <Route
            path="/dashboard/cadete"
            element={
              <ProtectedRoute allowedRoles={['Cadete']}>
                <DashboardCadete />
              </ProtectedRoute>
            }
          />

          {/* --- PÁGINA DE NO AUTORIZADO --- */}
          <Route
            path="/unauthorized"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
                  <p className="text-xl text-gray-600 mb-4">No autorizado</p>
                  <p className="text-gray-500">No tienes permisos para acceder a esta página.</p>
                </div>
              </div>
            }
          />

          {/* --- REDIRECCIONAMIENTOS BÁSICOS --- */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;