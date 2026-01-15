import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    children: React.ReactNode;
    onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, title, children, onClose }) => {
    const configs = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-800',
            iconColor: 'text-green-400',
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-800',
            iconColor: 'text-red-400',
        },
        warning: {
            icon: AlertCircle,
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            textColor: 'text-yellow-800',
            iconColor: 'text-yellow-400',
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-400',
        },
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
        <div className={`${config.bgColor} border ${config.borderColor} ${config.textColor} px-4 py-3 rounded-lg relative`}>
            <div className="flex items-start">
                <Icon className={`${config.iconColor} w-5 h-5 mr-3 mt-0.5 flex-shrink-0`} />
                <div className="flex-1">
                    {title && <p className="font-semibold mb-1">{title}</p>}
                    <div className="text-sm">{children}</div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
                    >
                        <XCircle className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};