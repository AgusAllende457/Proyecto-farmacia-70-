import React from 'react';

// 1. Extendemos los atributos estándar de HTML para un span
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ 
    children, 
    variant = 'default',
    size = 'md',
    className = '', // 2. Recibimos className (con valor por defecto vacío)
    ...props        // 3. Capturamos el resto de props (onClick, id, etc.)
}) => {
    const variantClasses = {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
    };

    return (
        <span 
            // 4. Inyectamos className al final de la lista
            className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props} // 5. Pasamos el resto de propiedades al elemento DOM
        >
            {children}
        </span>
    );
};