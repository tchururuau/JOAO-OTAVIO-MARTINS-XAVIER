import React, { useState, useEffect, useRef } from 'react';
import { Cliente } from '../types';
import { formatarCPF, formatarTelefone, formatarData, calcularProximaLimpeza } from '../utils/formatters';
import ConfirmationModal from './ConfirmationModal';

interface ClientesPageProps {
  clientes: Cliente[];
  addCliente: (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => boolean;
  deleteCliente: (id: number) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const ClientesPage: React.FC<ClientesPageProps> = ({ clientes, addCliente, deleteCliente, showToast }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [tamanhoCaixa, setTamanhoCaixa] = useState('');
  const [valorCobrado, setValorCobrado] = useState('');
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(null);

  useEffect(() => {
    // @ts-ignore
    if (window.lucide) {
        // @ts-ignore
        window.lucide.createIcons();
    }
  });

  const resetForm = () => {
    setNome('');
    setTelefone('');
    setCpf('');
    setEndereco('');
    setBairro('');
    setTamanhoCaixa('');
    setValorCobrado('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = addCliente({
      nome: nome.trim(),
      telefone: telefone.trim(),
      cpf: cpf.replace(/\D/g, ''),
      endereco: endereco.trim(),
      bairro: bairro.trim(),
      tamanho_caixa: parseInt(tamanhoCaixa),
      valor_cobrado: parseFloat(valorCobrado)
    });
    
    if (success) {
      showToast('Cliente cadastrado com sucesso!', 'success');
      resetForm();
      setIsFormOpen(false);
    } else {
      showToast('Cliente com este CPF já cadastrado!', 'error');
    }
  };
  
  const handleConfirmDelete = () => {
    if (clienteParaExcluir) {
      deleteCliente(clienteParaExcluir.id);
      setClienteParaExcluir(null);
    }
  };

  return (
    <>
      <div className="page">
        <div className="bg-white p-6 rounded-2xl shadow-sm glass-effect mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Gerenciar Clientes</h3>
            <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition">
              <i data-lucide={isFormOpen ? "minus" : "plus"} className="w-4 h-4"></i>
              <span>{isFormOpen ? 'Ocultar Formulário' : 'Novo Cliente'}</span>
            </button>
          </div>
          <div className={`overflow-hidden transition-all duration-500 ${isFormOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                  <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: João Silva" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                  <input type="tel" value={telefone} onChange={e => setTelefone(formatarTelefone(e.target.value))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="(99) 99999-9999" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                  <input type="text" value={cpf} onChange={e => setCpf(formatarCPF(e.target.value))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="000.000.000-00" required maxLength={14}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço *</label>
                  <input type="text" value={endereco} onChange={e => setEndereco(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Rua, número, complemento" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                  <input type="text" value={bairro} onChange={e => setBairro(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Nome do bairro" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho da Caixa (litros) *</label>
                  <input type="number" value={tamanhoCaixa} onChange={e => setTamanhoCaixa(e.target.value)} min="100" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: 500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Cobrado (R$) *</label>
                  <input type="number" value={valorCobrado} onChange={e => setValorCobrado(e.target.value)} step="0.01" min="0" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: 150.00" required />
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition">
                  <i data-lucide="save" className="w-4 h-4"></i>
                  <span>Salvar Cliente</span>
                </button>
                <button type="button" onClick={() => setIsFormOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition">
                  <i data-lucide="x" className="w-4 h-4"></i>
                  <span>Cancelar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm glass-effect">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Lista de Clientes</h3>
          <div>
            {clientes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <i data-lucide="user-x" className="w-16 h-16 mx-auto text-gray-300"></i>
                <p className="mt-4">Nenhum cliente cadastrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPF</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bairro</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Cadastro</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próxima Limpeza</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor (R$)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {clientes.map(c => {
                          const prox = calcularProximaLimpeza(c.dataCadastro);
                          return (
                              <tr key={c.id}>
                                  <td className="px-4 py-3 font-medium text-gray-900">{c.nome}</td>
                                  <td className="px-4 py-3 text-gray-600">{formatarCPF(c.cpf)}</td>
                                  <td className="px-4 py-3 text-gray-600">{c.bairro}</td>
                                  <td className="px-4 py-3 text-gray-600">{formatarData(c.dataCadastro)}</td>
                                  <td className="px-4 py-3 font-semibold text-gray-800">{formatarData(prox)}</td>
                                  <td className="px-4 py-3 text-gray-600">R$ {c.valor_cobrado.toFixed(2)}</td>
                                  <td className="px-4 py-3 text-gray-600">
                                    <button onClick={() => setClienteParaExcluir(c)} className="text-red-500 hover:text-red-700 transition">
                                      <i data-lucide="trash-2" className="w-5 h-5"></i>
                                    </button>
                                  </td>
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
      <ConfirmationModal
        isOpen={!!clienteParaExcluir}
        onClose={() => setClienteParaExcluir(null)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão de Cliente"
        message={`Tem certeza que deseja excluir o cliente ${clienteParaExcluir?.nome}? Todos os agendamentos associados também serão removidos.`}
      />
    </>
  );
};

export default ClientesPage;