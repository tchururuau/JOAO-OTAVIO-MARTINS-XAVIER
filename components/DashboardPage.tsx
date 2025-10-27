
import React, { useEffect } from 'react';
import { Cliente, Agendamento, Page } from '../types';
import { formatarDataHora } from '../utils/formatters';

interface DashboardPageProps {
  clientes: Cliente[];
  agendamentos: Agendamento[];
  onNavigate: (page: Page) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ clientes, agendamentos, onNavigate }) => {
    useEffect(() => {
        // @ts-ignore
        if (window.lucide) {
            // @ts-ignore
            window.lucide.createIcons();
        }
    });

    const servicosManutencao = clientes.filter(c => {
        if (!c.dataCadastro) return false;
        const proximaLimpeza = new Date(c.dataCadastro);
        proximaLimpeza.setMonth(proximaLimpeza.getMonth() + 6);
        const hoje = new Date();
        const limite = new Date();
        limite.setDate(hoje.getDate() + 30);
        return proximaLimpeza >= hoje && proximaLimpeza < limite;
    }).length;

    const proximosAgendamentos = [...agendamentos]
        .filter(a => new Date(a.dataServico) >= new Date())
        .sort((a, b) => new Date(a.dataServico).getTime() - new Date(b.dataServico).getTime())
        .slice(0, 5);

    return (
        <div className="page">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm card-hover glass-effect cursor-pointer" onClick={() => onNavigate('clientes')}>
                    <div className="text-blue-500 mb-2"><i data-lucide="users" className="w-8 h-8"></i></div>
                    <p className="text-gray-500 text-sm font-medium">Total de Clientes</p>
                    <p className="text-3xl font-bold text-gray-800">{clientes.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm card-hover glass-effect cursor-pointer" onClick={() => onNavigate('agendamentos')}>
                    <div className="text-cyan-500 mb-2"><i data-lucide="calendar-check" className="w-8 h-8"></i></div>
                    <p className="text-gray-500 text-sm font-medium">Serviços Agendados</p>
                    <p className="text-3xl font-bold text-gray-800">{agendamentos.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm card-hover glass-effect cursor-pointer" onClick={() => onNavigate('manutencao')}>
                    <div className="text-amber-500 mb-2"><i data-lucide="alert-triangle" className="w-8 h-8"></i></div>
                    <p className="text-gray-500 text-sm font-medium">Manutenção Próxima</p>
                    <p className="text-3xl font-bold text-gray-800">{servicosManutencao}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm glass-effect">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Próximos Agendamentos</h3>
                <div>
                    {proximosAgendamentos.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <i data-lucide="calendar" className="w-16 h-16 mx-auto text-gray-300"></i>
                            <p className="mt-4">Nenhum agendamento futuro encontrado</p>
                        </div>
                    ) : (
                         <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bairro</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {proximosAgendamentos.map(a => (
                                        <tr key={a.id}>
                                            <td className="px-4 py-3 font-medium text-gray-900">{a.clienteNome}</td>
                                            <td className="px-4 py-3 text-gray-600">{a.clienteBairro}</td>
                                            <td className="px-4 py-3 text-gray-600">{formatarDataHora(a.dataServico)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
