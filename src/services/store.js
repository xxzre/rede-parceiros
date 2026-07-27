const STORAGE_KEYS = {
  TECNICOS: 'rede_tecnicos',
  VENDAS: 'rede_vendas',
  SOLICITACOES: 'rede_solic'
};

const DEFAULT_TECNICOS = [
  { id: 'tec_1', nome: 'João Silva', email: 'joao.tecnico@email.com', codigo: 'JOAO01', comissaoPorcentagem: 10, whatsapp: '(11) 98888-7777', status: 'ativo' },
  { id: 'tec_2', nome: 'Carlos Oliveira', email: 'carlos.tech@email.com', codigo: 'CARLOS02', comissaoPorcentagem: 12, whatsapp: '(21) 97777-6666', status: 'ativo' },
  { id: 'tec_3', nome: 'Mariana Costa', email: 'mariana.rep@email.com', codigo: 'MARI03', comissaoPorcentagem: 15, whatsapp: '(31) 99999-5555', status: 'ativo' }
];

const DEFAULT_VENDAS = [
  { id: 'venda_1', tecnicoCodigo: 'JOAO01', tecnicoNome: 'João Silva', cliente: 'Assistência FastFix', produto: 'Curso Manutenção Avançada', valor: 1500, comissaoValor: 150, status: 'pago', data: '2026-07-20T14:30:00Z' },
  { id: 'venda_2', tecnicoCodigo: 'JOAO01', tecnicoNome: 'João Silva', cliente: 'Marcos Refrigeração', produto: 'Serviço Inversor Industrial', valor: 2800, comissaoValor: 280, status: 'pendente', data: '2026-07-24T10:15:00Z' },
  { id: 'venda_3', tecnicoCodigo: 'CARLOS02', tecnicoNome: 'Carlos Oliveira', cliente: 'Laboratório Alpha', produto: 'Equipamento Osciloscópio', valor: 4500, comissaoValor: 540, status: 'pago', data: '2026-07-22T16:45:00Z' }
];

function getItem(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyListeners();
  } catch (e) {}
}

const listeners = new Set();
export function subscribeStore(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
function notifyListeners() {
  listeners.forEach(cb => cb());
}

export const storeService = {
  getTecnicos() {
    return getItem(STORAGE_KEYS.TECNICOS, DEFAULT_TECNICOS);
  },
  
  getVendas() {
    return getItem(STORAGE_KEYS.VENDAS, DEFAULT_VENDAS);
  },

  // ZERAR TODAS AS VENDAS (R$ 0,00)
  zerarVendas() {
    setItem(STORAGE_KEYS.VENDAS, []);
  },

  // REMOVER TODOS OS TÉCNICOS
  limparTecnicos() {
    setItem(STORAGE_KEYS.TECNICOS, []);
  },

  // EXCLUIR TÉCNICO INDIVIDUAL
  excluirTecnico(id) {
    const list = this.getTecnicos();
    const filtrado = list.filter(t => t.id !== id);
    setItem(STORAGE_KEYS.TECNICOS, filtrado);
  },

  // EXCLUIR VENDA INDIVIDUAL
  excluirVenda(vendaId) {
    const list = this.getVendas();
    const filtrado = list.filter(v => v.id !== vendaId);
    setItem(STORAGE_KEYS.VENDAS, filtrado);
  }
};
