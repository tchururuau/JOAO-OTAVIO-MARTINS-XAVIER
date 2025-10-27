import React, { useEffect, useState } from 'react';
import { Agendamento } from '../types';
import { formatarDataHora, formatarTelefone } from '../utils/formatters';
import ConfirmationModal from './ConfirmationModal';

interface AgendamentosPageProps {
  agendamentos: Agendamento[];
  deleteAgendamento: (id: number) => void;
}

const AgendamentosPage: React.FC<AgendamentosPageProps> = ({ agendamentos, deleteAgendamento }) => {
    const [agendamentoParaExcluir, setAgendamentoParaExcluir] = useState<Agendamento | null>(null);

    useEffect(() => {
        // @ts-ignore
        if (window.lucide) {
            // @ts-ignore
            window.lucide.createIcons();
        }
    });
    
    const handleConfirmDelete = () => {
        if (agendamentoParaExcluir) {
          deleteAgendamento(agendamentoParaExcluir.id);
          setAgendamentoParaExcluir(null);
        }
    };

  const sorted = [...agendamentos].sort((a, b) => new Date(b.dataServico).getTime() - new Date(a.dataServico).getTime());
  const notifMap = { '1h': '1h antes', '3h': '3h antes', '1d': '1 dia antes', '2d': '2 dias antes' };

  return (
    <>
      <div className="page">
        <div className="bg-white p-6 rounded-2xl shadow-sm glass-effect">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Todos os Agendamentos</h3>
          <div>
            {agendamentos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <i data-lucide="calendar-off" className="w-16 h-16 mx-auto text-gray-300"></i>
                <p className="mt-4">Nenhum agendamento encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endereço</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notificação</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sorted.map(a => (
                      <tr key={a.id}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{a.clienteNome}</div>
                          <div className="text-sm text-gray-500">{formatarTelefone(a.clienteTelefone)}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{a.clienteEndereco}, {a.clienteBairro}</td>
                        <td className="px-4 py-3 text-gray-600">{formatarDataHora(a.dataServico)}</td>
                        <td className="px-4 py-3 text-gray-600">{notifMap[a.notificacao]}</td>
                        <td className="px-4 py-3 text-gray-600">
                          <button onClick={() => setAgendamentoParaExcluir(a)} className="text-red-500 hover:text-red-700 transition">
                            <i data-lucide="trash-2" className="w-5 h-5"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={!!agendamentoParaExcluir}
        onClose={() => setAgendamentoParaExcluir(null)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão de Agendamento"
        message={`Tem certeza que deseja excluir o agendamento para ${agendamentoParaExcluir?.clienteNome} no dia ${formatarDataHora(agendamentoParaExcluir?.dataServico)}?`}
      />
    </>
  );
};

export default AgendamentosPage;