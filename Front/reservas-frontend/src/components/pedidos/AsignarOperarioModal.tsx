import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { usuariosService } from '../service/usuariosService';
import { pedidosService } from '@services/pedidosService';
import { UserDTO } from '@types/auth.types';
import { OrderSummaryDTO } from '../types/pedido.types.ts';

interface AsignarOperarioModalProps {
    isOpen: boolean;
    onClose: () => void;
    pedido: OrderSummaryDTO;
    onSuccess: () => void;
}

export const AsignarOperarioModal: React.FC<AsignarOperarioModalProps> = ({
    isOpen,
    onClose,
    pedido,
    onSuccess,
}) => {
    const [operarios, setOperarios] = useState<UserDTO[]>([]);
    const [selectedOperario, setSelectedOperario] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            loadOperarios();
        }
    }, [isOpen]);

    const loadOperarios = async () => {
        try {
            const data = await usuariosService.getUsuariosByRol('Operario');
            setOperarios(data);
        } catch (err) {
            setError('Error al cargar la lista de operarios');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!selectedOperario) {
            setError('Por favor seleccione un operario');
            return;
        }

        setLoading(true);

        try {
            // RF18: Asignar Operario (Ingresado -> Preparado)
            await pedidosService.asignarOperario({
                pedidoId: pedido.idPedido,
                operarioId: parseInt(selectedOperario),
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al asignar operario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Asignar Operario" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert type="error">{error}</Alert>}

                {/* Información del Pedido */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Información del Pedido</h4>
                    <div className="space-y-1 text-sm text-blue-800">
                        <p><span className="font-medium">ID:</span> #{pedido.idPedido}</p>
                        <p><span className="font-medium">Cliente:</span> {pedido.clienteNombre}</p>
                        <p><span className="font-medium">Total:</span> ${pedido.total.toFixed(2)}</p>
                        <p><span className="font-medium">Estado Actual:</span> {pedido.estadoNombre}</p>
                    </div>
                </div>

                {/* Selección de Operario */}
                <Select
                    label="Seleccionar Operario"
                    value={selectedOperario}
                    onChange={(e) => setSelectedOperario(e.target.value)}
                    options={operarios.map(op => ({
                        value: op.id.toString(),
                        label: `${op.nombreCompleto} - ${op.nombreSucursal}`,
                    }))}
                    required
                />

                {/* Botones */}
                <div className="flex gap-3 justify-end pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={loading}
                    >
                        Asignar Operario
                    </Button>
                </div>
            </form>
        </Modal>
    );
};