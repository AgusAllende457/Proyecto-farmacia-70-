import React, { useState } from 'react';
import { Plus, Trash2, User, Package, Save, ArrowLeft } from 'lucide-react';
import { SearchableSelect } from '@components/common/SearchableSelect';
import { useNavigate } from 'react-router-dom';

const OrderFormPage: React.FC = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([{ tempId: Date.now(), productId: '', quantity: 1 }]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full text-gray-600">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Crear Nuevo Pedido</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-blue-600 px-6 py-4">
                        <h2 className="text-white font-semibold flex items-center gap-2"><Plus size={20} /> Datos del Pedido</h2>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* El formulario que ya tenías sin los filtros arriba */}
                        <div className="max-w-md">
                            <SearchableSelect label="Cliente / Paciente" options={[]} onSelect={() => { } } icon={User} placeholder={''} />
                        </div>
                        {/* ... resto del formulario de productos ... */}
                        
                        <div className="pt-6 border-t flex justify-end gap-3">
                            <button onClick={() => navigate(-1)} className="px-6 py-2 text-gray-600 hover:bg-gray-50">Cancelar</button>
                            <button className="bg-blue-600 text-white px-10 py-2 rounded-xl font-bold flex items-center gap-2">
                                <Save size={18} /> Guardar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderFormPage;