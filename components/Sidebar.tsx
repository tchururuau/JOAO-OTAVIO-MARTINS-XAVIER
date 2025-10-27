
import React, { useEffect } from 'react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  isCollapsed: boolean;
  onNavigate: (page: Page) => void;
  onToggle: () => void;
}

const navItems: { page: Page; label: string; icon: string }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: 'bar-chart-2' },
  { page: 'clientes', label: 'Clientes', icon: 'users' },
  { page: 'agendamentos', label: 'Agendamentos', icon: 'calendar-check' },
  { page: 'novo-agendamento', label: 'Novo Agendamento', icon: 'plus-circle' },
  { page: 'logistica', label: 'Logística', icon: 'route' },
  { page: 'manutencao', label: 'Manutenção', icon: 'wrench' },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, isCollapsed, onNavigate, onToggle }) => {
    useEffect(() => {
        // @ts-ignore
        if (window.lucide) {
            // @ts-ignore
            window.lucide.createIcons();
        }
    });

  return (
    <aside id="sidebar" className={`bg-white shadow-lg h-screen fixed z-40 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="logo flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
            <i data-lucide="droplets" className="w-6 h-6 text-white"></i>
          </div>
          {!isCollapsed && <span className="logo-text text-xl font-bold text-gray-800">Vita Blue</span>}
        </div>
      </div>
      <ul className="p-4 space-y-2 flex-1">
        {navItems.map(item => (
          <li key={item.page}>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate(item.page); }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium ${currentPage === item.page ? 'bg-blue-100 text-blue-700' : ''} ${isCollapsed ? 'justify-center' : ''}`}
            >
              <i data-lucide={item.icon} className="w-5 h-5"></i>
              {!isCollapsed && <span className="sidebar-text">{item.label}</span>}
            </a>
          </li>
        ))}
      </ul>
      <div className="p-4 border-t border-gray-200">
        <button onClick={onToggle} className="w-full flex items-center justify-center space-x-2 py-2.5 text-gray-600 hover:text-gray-900 font-medium rounded-lg transition">
          <i data-lucide={isCollapsed ? 'chevron-right' : 'chevron-left'} className="w-5 h-5"></i>
          {!isCollapsed && <span className="sidebar-text">Recolher</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
