
import React, { useState, useMemo, useEffect } from 'react';
import { Cliente } from '../types';
import { formatarTelefone, formatarData, calcularProximaLimpeza } from '../utils/formatters';

interface LogisticaPageProps {
  clientes: Cliente[];
}

const LogisticaPage: React.FC<LogisticaPageProps> = ({ clientes }) => {
    const [bairroSelecionado, setBairroSelecionado] = useState<string | null>(null);

    useEffect(() => {
        // @ts-ignore
        if (window.lucide) {
            // @ts-ignore
            window.lucide.createIcons();
        }
    });

    const gruposBairro = useMemo(() => {
        return clientes.reduce((acc, c) => {
            const b = c.bairro.toUpperCase().trim() || 'BAIRRO NÃO INFORMADO';
            if (!acc[b]) acc[b] = [];
            acc[b].push(c);
            return acc;
        }, {} as Record<string, Cliente[]>);
    }, [clientes]);

    const bairros = Object.keys(gruposBairro).sort();

    const clientesDoBairro = bairroSelecionado ? gruposBairro[bairroSelecionado].sort((a,b) => {
        const dataA = new Date(calcularProximaLimpeza(a.dataCadastro) || 0).getTime();
        const dataB = new Date(calcularProximaLimpeza(b.dataCadastro) || 0).getTime();
        return dataA - dataB;
    }) : [];

  return (
    <div className="page">
        <div className="bg-white p-6 rounded-2xl shadow-sm glass-effect mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Clientes por Bairro</h3>
                <span className="bg-amber-100 text-amber-700 px-3 py-1 text-sm font-semibold rounded-full">{bairros.length} Bairros Ativos</span>
            </div>
            {bairros.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <i data-lucide="map-pin" className="w-16 h-16 mx-auto text-gray-300"></i>
                    <p className="mt-4">Nenhum cliente cadastrado para calcular a logística</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bairros.map(b => (
                        <div key={b} onClick={() => setBairroSelecionado(b)} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-400 transition">
                            <div className="font-bold text-lg text-gray-800 mb-1">{b}</div>
                            <div className="text-sm text-gray-600">Total de Clientes: <span className="text-blue-600 font-semibold">{gruposBairro[b].length}</span></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        <div className={`bg-white p-6 rounded-2xl shadow-sm glass-effect overflow-hidden transition-all duration-500 ${bairroSelecionado ? 'max-h-[2000px]' : 'max-h-0 p-0'}`}>
            {bairroSelecionado && (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Detalhes do Bairro: {bairroSelecionado}</h3>
                        <button className="text-gray-500 hover:text-gray-700" onClick={() => setBairroSelecionado(null)}>
                            <i data-lucide="x" className="w-5 h-5"></i>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endereço</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próxima Limpeza</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor (R$)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {clientesDoBairro.map(c => (
                                    <tr key={c.id}>
                                        <td className="px-4 py-3 font-medium text-gray-900">{c.nome}</td>
                                        <td className="px-4 py-3 text-gray-600">{formatarTelefone(c.telefone)}</td>
                                        <td className="px-4 py-3 text-gray-600">{c.endereco}</td>
                                        <td className="px-4 py-3 text-gray-600">{formatarData(calcularProximaLimpeza(c.dataCadastro))}</td>
                                        <td className="px-4 py-3 text-gray-600">R$ {c.valor_cobrado.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    </div>
  );
};

export default LogisticaPage;
