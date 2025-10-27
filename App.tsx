import React, { useState, useCallback, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { Cliente, Agendamento, ToastMessage, Page } from './types';

import Sidebar from './components/Sidebar';
import DashboardPage from './components/DashboardPage';
import ClientesPage from './components/ClientesPage';
import AgendamentosPage from './components/AgendamentosPage';
import NovoAgendamentoPage from './components/NovoAgendamentoPage';
import LogisticaPage from './components/LogisticaPage';
import ManutencaoPage from './components/ManutencaoPage';
import ToastContainer from './components/ToastContainer';

const pageTitles: Record<Page, string> = {
  dashboard: 'Dashboard',
  clientes: 'Gerenciar Clientes',
  agendamentos: 'Agendamentos',
  'novo-agendamento': 'Novo Agendamento',
  logistica: 'Logística de Serviços',
  manutencao: 'Gestão de Manutenção'
};

function App() {
  const [clientes, setClientes] = useLocalStorage<Cliente[]>('clientes', []);
  const [agendamentos, setAgendamentos] = useLocalStorage<Agendamento[]>('agendamentos', []);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    // @ts-ignore
    if (window.lucide) {
      // @ts-ignore
      window.lucide.createIcons();
    }
  }, [currentPage, toasts, isSidebarCollapsed, clientes, agendamentos]);
  
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }]);
  }, []);

  const dismissToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const addCliente = (clienteData: Omit<Cliente, 'id' | 'dataCadastro'>): boolean => {
    if (clientes.some(c => c.cpf === clienteData.cpf)) {
      return false;
    }
    const novoCliente: Cliente = {
      ...clienteData,
      id: Date.now(),
      dataCadastro: new Date().toISOString()
    };
    setClientes(prev => [...prev, novoCliente]);
    return true;
  };

  const addAgendamento = (agendamentoData: Omit<Agendamento, 'id'>) => {
    const novoAgendamento: Agendamento = {
      ...agendamentoData,
      id: Date.now(),
    };
    setAgendamentos(prev => [...prev, novoAgendamento]);
  };

  const deleteCliente = (id: number) => {
    const clienteParaExcluir = clientes.find(c => c.id === id);
    if (!clienteParaExcluir) return;

    // Cascade delete agendamentos
    const cpfClienteExcluido = clienteParaExcluir.cpf;
    setAgendamentos(prev => prev.filter(a => a.cpfCliente !== cpfClienteExcluido));
    
    // Delete cliente
    setClientes(prev => prev.filter(c => c.id !== id));
    showToast('Cliente e seus agendamentos foram excluídos!', 'success');
  };

  const deleteAgendamento = (id: number) => {
    setAgendamentos(prev => prev.filter(a => a.id !== id));
    showToast('Agendamento excluído com sucesso!', 'success');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage clientes={clientes} agendamentos={agendamentos} onNavigate={setCurrentPage} />;
      case 'clientes':
        return <ClientesPage clientes={clientes} addCliente={addCliente} deleteCliente={deleteCliente} showToast={showToast} />;
      case 'agendamentos':
        return <AgendamentosPage agendamentos={agendamentos} deleteAgendamento={deleteAgendamento} />;
      case 'novo-agendamento':
        return <NovoAgendamentoPage clientes={clientes} addAgendamento={addAgendamento} showToast={showToast} onSuccess={() => setCurrentPage('agendamentos')} />;
      case 'logistica':
        return <LogisticaPage clientes={clientes} />;
      case 'manutencao':
        return <ManutencaoPage clientes={clientes} />;
      default:
        return <DashboardPage clientes={clientes} agendamentos={agendamentos} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex">
        <Sidebar 
            currentPage={currentPage}
            isCollapsed={isSidebarCollapsed}
            onNavigate={setCurrentPage}
            onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className={`flex-1 transition-all duration-300 pt-4 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
            <header className="max-w-7xl mx-auto px-6 py-4 bg-white rounded-2xl shadow-sm mb-6">
                <div className="flex justify-between items-center">
                    <h2 id="page-title" className="text-2xl font-bold text-gray-800">{pageTitles[currentPage]}</h2>
                </div>
            </header>
            <div className="max-w-7xl mx-auto px-6 pb-8">
                {renderPage()}
            </div>
        </main>
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
