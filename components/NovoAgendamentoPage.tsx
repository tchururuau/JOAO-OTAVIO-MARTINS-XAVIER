
import React, { useState, useEffect, useRef } from 'react';
import { Cliente, Agendamento } from '../types';
import { formatarCPF, formatarTelefone, formatarData, calcularProximaLimpeza } from '../utils/formatters';

interface NovoAgendamentoPageProps {
  clientes: Cliente[];
  addAgendamento: (agendamento: Omit<Agendamento, 'id'>) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  onSuccess: () => void;
}

const NovoAgendamentoPage: React.FC<NovoAgendamentoPageProps> = ({ clientes, addAgendamento, showToast, onSuccess }) => {
  const [cpfBusca, setCpfBusca] = useState('');
  const [suggestions, setSuggestions] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [dataServico, setDataServico] = useState('');
  const [notificacao, setNotificacao] = useState<'1h' | '3h' | '1d' | '2d'>('1h');
  
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // @ts-ignore
    if (window.lucide) {
        // @ts-ignore
        window.lucide.createIcons();
    }
  }, [clienteSelecionado]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
            setSuggestions([]);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = formatarCPF(e.target.value);
    setCpfBusca(formattedCpf);
    setClienteSelecionado(null);
    const termo = formattedCpf.replace(/\D/g, '');
    if (termo.length >= 3) {
      const res = clientes.filter(c => c.cpf.startsWith(termo)).slice(0, 5);
      setSuggestions(res);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setCpfBusca(formatarCPF(cliente.cpf));
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSelecionado) {
      showToast('Selecione um cliente da lista!', 'error');
      return;
    }
    if (!dataServico) {
      showToast('Selecione a data e hora do serviço!', 'error');
      return;
    }
    addAgendamento({
      cpfCliente: clienteSelecionado.cpf,
      dataServico,
      notificacao,
      clienteNome: clienteSelecionado.nome,
      clienteTelefone: clienteSelecionado.telefone,
      clienteEndereco: clienteSelecionado.endereco,
      clienteBairro: clienteSelecionado.bairro
    });

    showToast('Serviço agendado com sucesso!', 'success');
    setCpfBusca('');
    setClienteSelecionado(null);
    setDataServico('');
    setNotificacao('1h');
    onSuccess();
  };

  return (
    <div className="page">
      <div className="bg-white p-6 rounded-2xl shadow-sm glass-effect">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Agendar Novo Serviço</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF do Cliente *</label>
            <input type="text" value={cpfBusca} onChange={handleCpfChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Digite o CPF para buscar" maxLength={14} />
            {suggestions.length > 0 && (
              <div ref={suggestionsRef} className="absolute top-full left-0 right-0 bg-white border border-gray-300 border-t-0 rounded-b-lg max-h-60 overflow-y-auto z-10 shadow-lg">
                {suggestions.map(c => (
                  <div key={c.id} onClick={() => handleSuggestionClick(c)} className="p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 text-gray-800">
                    {formatarCPF(c.cpf)} - {c.nome}
                  </div>
                ))}
              </div>
            )}
          </div>
          {clienteSelecionado && (
            <div className="mb-4 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
              <strong className="text-lg text-gray-800">{clienteSelecionado.nome}</strong>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-2 gap-x-4 mt-3 text-sm text-gray-700">
                <div className="flex items-center space-x-1.5"><i data-lucide="phone" className="w-4 h-4 text-gray-500"></i> <span>{formatarTelefone(clienteSelecionado.telefone)}</span></div>
                <div className="flex items-center space-x-1.5"><i data-lucide="home" className="w-4 h-4 text-gray-500"></i> <span>{clienteSelecionado.endereco}</span></div>
                <div className="flex items-center space-x-1.5"><i data-lucide="box" className="w-4 h-4 text-gray-500"></i> <span>{clienteSelecionado.tamanho_caixa}L</span></div>
                <div className="flex items-center space-x-1.5"><i data-lucide="dollar-sign" className="w-4 h-4 text-gray-500"></i> <span>R$ {clienteSelecionado.valor_cobrado.toFixed(2)}</span></div>
                <div className="flex items-center space-x-1.5"><i data-lucide="calendar" className="w-4 h-4 text-gray-500"></i> <span>Próx.: {formatarData(calcularProximaLimpeza(clienteSelecionado.dataCadastro))}</span></div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora do Serviço *</label>
              <input type="datetime-local" value={dataServico} onChange={e => setDataServico(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notificar-me *</label>
              <select value={notificacao} onChange={e => setNotificacao(e.target.value as any)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                <option value="1h">1 hora antes</option>
                <option value="3h">3 horas antes</option>
                <option value="1d">1 dia antes</option>
                <option value="2d">2 dias antes</option>
              </select>
            </div>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition">
            <i data-lucide="calendar-plus" className="w-4 h-4"></i>
            <span>Agendar Serviço</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default NovoAgendamentoPage;
