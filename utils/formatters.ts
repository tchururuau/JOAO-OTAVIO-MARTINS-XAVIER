
export function formatarCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length > 11) {
    return cleaned.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cleaned
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function formatarTelefone(telefone: string): string {
  const cleaned = telefone.replace(/\D/g, '');
  if (cleaned.length > 11) {
    return cleaned.slice(0,11).replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 11) {
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return cleaned
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function formatarData(dataString?: string | Date): string {
  if (!dataString) return 'N/A';
  const d = new Date(dataString);
  if (isNaN(d.getTime())) return 'Data Inválida';
  return d.toLocaleDateString('pt-BR');
}

export function formatarDataHora(dataString?: string | Date): string {
    if (!dataString) return 'N/A';
    const d = new Date(dataString);
    if (isNaN(d.getTime())) return 'Data Inválida';
    return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}


export function calcularProximaLimpeza(dataCadastroString?: string): string | null {
  if (!dataCadastroString) return null;
  const d = new Date(dataCadastroString);
  if (isNaN(d.getTime())) return null;
  d.setMonth(d.getMonth() + 6);
  return d.toISOString();
}
