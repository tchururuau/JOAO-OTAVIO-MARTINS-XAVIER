
export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  cpf: string; // Storing raw digits
  endereco: string;
  bairro: string;
  tamanho_caixa: number;
  valor_cobrado: number;
  dataCadastro: string; // ISO string
}

export interface Agendamento {
  id: number;
  cpfCliente: string;
  dataServico: string; // ISO string for datetime-local
  notificacao: '1h' | '3h' | '1d' | '2d';
  clienteNome: string;
  clienteTelefone: string;
  clienteEndereco: string;
  clienteBairro: string;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export type Page = 'dashboard' | 'clientes' | 'agendamentos' | 'novo-agendamento' | 'logistica' | 'manutencao';
