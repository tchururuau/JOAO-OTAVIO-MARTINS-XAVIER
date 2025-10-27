
import React, { useMemo, useEffect } from 'react';
import { Cliente } from '../types';
import { formatarTelefone, formatarData, calcularProximaLimpeza } from '../utils/formatters';

interface ManutencaoPageProps {
  clientes: Cliente[];
}

const ManutencaoPage: React.FC<ManutencaoPageProps> = ({ clientes }) => {

    useEffect(() => {
        // @ts-ignore
        if (window.lucide) {
            // @ts-ignore
            window.lucide.createIcons();
        }
    });

    const urgentes = useMemo(() => {
        const hoje = new Date();
        const hojeSemHoras = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        const limite = new Date(hojeSemHoras);
        limite.setDate(limite.getDate() + 30);

        return clientes
            .map(c => ({ 
                ...c, 
                proximaLimpeza: new Date(calcularProximaLimpeza(c.dataCadastro) || 0)
            }))
            .filter(c => c.proximaLimpeza && c.proximaLimpeza >= hojeSemHoras && c.proximaLimpeza < limite)
            .sort((a, b) => a.proximaLimpeza.getTime() - b.proximaLimpeza.getTime());
    }, [clientes]);

  return (
    <div className="page">
      <div className="bg-white p-6 rounded-2xl shadow-sm glass-effect">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Gestão de Manutenção</h3>
          <span className="bg-amber-100 text-amber-700 px-3 py-1 text-sm font-semibold rounded-full">Próximos 30 dias</span>
        </div>
        <div>
          {urgentes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i data-lucide="check-circle" className="w-16 h-16 mx-auto text-gray-300"></i>
              <p className="mt-4">Nenhum cliente precisa de manutenção nos próximos 30 dias</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bairro</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próxima Limpeza</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {urgentes.map(c => {
                    const hoje = new Date();
                    const hojeSemHoras = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
                    const dias = Math.ceil((c.proximaLimpeza.getTime() - hojeSemHoras.getTime()) / (1000 * 60 * 60 * 24));
                    return (
                        <tr key={c.id} className="bg-amber-50 border-l-4 border-amber-400">
                            <td className="px-4 py-3 font-medium text-gray-900">{c.nome}</td>
                            <td className="px-4 py-3 text-gray-600">{c.bairro}</td>
                            <td className="px-4 py-3">
                                <div className="font-semibold text-gray-800">{formatarData(c.proximaLimpeza)}</div>
                                <div className="text-sm text-amber-600">Faltam {dias} dias</div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{formatarTelefone(c.telefone)}</td>
                            <td className="px-4 py-3 text-gray-600">R$ {c.valor_cobrado.toFixed(2)}</td>
                        </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManutencaoPage;
