// Data Store com fallback reativo em LocalStorage e suporte a Firebase Firestore
const STORAGE_KEYS = {
  TECNICOS: 'rede_parceiros_tecnicos',
  VENDAS: 'rede_parceiros_vendas',
  SOLICITACOES: 'rede_parceiros_solicitacoes'
};

// Dados Iniciais demonstrativos para o sistema funcionar no 1º acesso com visual incrível!
const DEFAULT_TECNICOS = [
  {
    id: 'tec_1',
    nome: 'João Silva',
    email: 'joao.tecnico@email.com',
    codigo: 'JOAO01',
    comissaoPorcentagem: 10,
    whatsapp: '(11) 98888-7777',
    dataCadastro: '2026-06-10',
    status: 'ativo',
    uid: 'uid_joao_01'
  },
  {
    id: 'tec_2',
    nome: 'Carlos Oliveira',
    email: 'carlos.tech@email.com',
    codigo: 'CARLOS02',
    comissaoPorcentagem: 12,
    whatsapp: '(21) 97777-6666',
    dataCadastro: '2026-06-15',
    status: 'ativo',
    uid: 'uid_carlos_02'
  },
  {
    id: 'tec_3',
    nome: 'Mariana Costa',
    email: 'mariana.rep@email.com',
    codigo: 'MARI03',
    comissaoPorcentagem: 15,
    whatsapp: '(31) 99999-5555',
    dataCadastro: '2026-06-20',
    status: 'ativo',
    uid: 'uid_mariana_03'
  }
];

const DEFAULT_VENDAS = [
  {
    id: 'venda_1',
    tecnicoId: 'tec_1',
    tecnicoCodigo: 'JOAO01',
    tecnicoNome: 'João Silva',
    cliente: 'Assistência Técnica FastFix',
    produto: 'Curso Manutenção Avançada em Placas',
    valor: 1500.00,
    comissaoPorcentagem: 10,
    comissaoValor: 150.00,
    status: 'pago', // 'pendente' | 'pago'
    data: '2026-07-20T14:30:00.000Z'
  },
  {
    id: 'venda_2',
    tecnicoId: 'tec_1',
    tecnicoCodigo: 'JOAO01',
    tecnicoNome: 'João Silva',
    cliente: 'Marcos Refrigeração',
    produto: 'Serviço de Inversor Industrial',
    valor: 2800.00,
    comissaoPorcentagem: 10,
    comissaoValor: 280.00,
    status: 'pendente',
    data: '2026-07-24T10:15:00.000Z'
  },
  {
    id: 'venda_3',
    tecnicoId: 'tec_2',
    tecnicoCodigo: 'CARLOS02',
    tecnicoNome: 'Carlos Oliveira',
    cliente: 'Laboratório Eletrônico Alpha',
    produto: 'Equipamento Osciloscópio Digital',
    valor: 4500.00,
    comissaoPorcentagem: 12,
    comissaoValor: 540.00,
    status: 'pago',
    data: '2026-07-22T16:45:00.000Z'
  },
  {
    id: 'venda_4',
    tecnicoId: 'tec_3',
    tecnicoCodigo: 'MARI03',
    tecnicoNome: 'Mariana Costa',
    cliente: 'EletroTech Soluções',
    produto: 'Combo Treinamento + Ferramentas',
    valor: 3200.00,
    comissaoPorcentagem: 15,
    comissaoValor: 480.00,
    status: 'pendente',
    data: '2026-07-25T09:00:00.000Z'
  }
];

const DEFAULT_SOLICITACOES = [
  {
    id: 'sol_1',
    nome: 'Roberto Santos',
    email: 'roberto.santos@email.com',
    whatsapp: '(41) 98765-4321',
    cidade: 'Curitiba - PR',
    experiencia: 'Técnico há 5 anos em Eletrônica Geral',
    data: '2026-07-26T11:20:00.000Z',
    status: 'pendente'
  }
];

// Helper para ler do LocalStorage
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
  } catch (e) {
    console.error('Erro ao salvar localmente:', e);
  }
}

// Inicia dados se vazio
if (!localStorage.getItem(STORAGE_KEYS.TECNICOS)) {
  localStorage.setItem(STORAGE_KEYS.TECNICOS, JSON.stringify(DEFAULT_TECNICOS));
}
if (!localStorage.getItem(STORAGE_KEYS.VENDAS)) {
  localStorage.setItem(STORAGE_KEYS.VENDAS, JSON.stringify(DEFAULT_VENDAS));
}
if (!localStorage.getItem(STORAGE_KEYS.SOLICITACOES)) {
  localStorage.setItem(STORAGE_KEYS.SOLICITACOES, JSON.stringify(DEFAULT_SOLICITACOES));
}

// Mecanismo de Eventos para Reatividade Instantânea na Interface
const listeners = new Set();

export function subscribeStore(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyListeners() {
  listeners.forEach(cb => cb());
}

// API de Técnicos
export const storeService = {
  getTecnicos() {
    return getItem(STORAGE_KEYS.TECNICOS, DEFAULT_TECNICOS);
  },

  getTecnicoPorCodigo(codigo) {
    if (!codigo) return null;
    const list = this.getTecnicos();
    return list.find(t => t.codigo.toUpperCase() === codigo.trim().toUpperCase()) || null;
  },

  getTecnicoPorId(id) {
    const list = this.getTecnicos();
    return list.find(t => t.id === id) || null;
  },

  cadastrarTecnico({ nome, email, codigo, comissaoPorcentagem, whatsapp }) {
    const list = this.getTecnicos();
    const cleanCodigo = codigo.trim().toUpperCase();

    // Valida se o código já existe
    if (list.some(t => t.codigo === cleanCodigo)) {
      throw new Error(`O código de indicação "${cleanCodigo}" já está em uso por outro técnico.`);
    }

    const novo = {
      id: `tec_${Date.now()}`,
      nome,
      email,
      codigo: cleanCodigo,
      comissaoPorcentagem: Number(comissaoPorcentagem) || 10,
      whatsapp: whatsapp || '',
      dataCadastro: new Date().toISOString().split('T')[0],
      status: 'pendente_ativacao',
      uid: null
    };

    const atualizado = [novo, ...list];
    setItem(STORAGE_KEYS.TECNICOS, atualizado);
    return novo;
  },

  vincularUidTecnico(codigo, uid) {
    const list = this.getTecnicos();
    const index = list.findIndex(t => t.codigo === codigo.toUpperCase());
    if (index !== -1) {
      list[index].uid = uid;
      list[index].status = 'ativo';
      setItem(STORAGE_KEYS.TECNICOS, list);
      return list[index];
    }
    return null;
  },

  // API de Vendas (Apenas Admin pode registrar)
  getVendas() {
    return getItem(STORAGE_KEYS.VENDAS, DEFAULT_VENDAS);
  },

  getVendasDoTecnico(tecnicoCodigo) {
    const vendas = this.getVendas();
    if (!tecnicoCodigo) return [];
    return vendas.filter(v => v.tecnicoCodigo.toUpperCase() === tecnicoCodigo.toUpperCase());
  },

  registrarVenda({ tecnicoCodigo, cliente, produto, valor, status = 'pendente' }) {
    const tecnico = this.getTecnicoPorCodigo(tecnicoCodigo);
    if (!tecnico) {
      throw new Error(`Técnico com o código "${tecnicoCodigo}" não foi encontrado.`);
    }

    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      throw new Error('Informe um valor de venda válido maior que R$ 0,00.');
    }

    const comissaoPorcentagem = tecnico.comissaoPorcentagem || 10;
    const comissaoValor = Number((valorNum * (comissaoPorcentagem / 100)).toFixed(2));

    const novaVenda = {
      id: `venda_${Date.now()}`,
      tecnicoId: tecnico.id,
      tecnicoCodigo: tecnico.codigo,
      tecnicoNome: tecnico.nome,
      cliente: cliente.trim(),
      produto: produto.trim(),
      valor: valorNum,
      comissaoPorcentagem,
      comissaoValor,
      status, // 'pendente' ou 'pago'
      data: new Date().toISOString()
    };

    const list = this.getVendas();
    const atualizado = [novaVenda, ...list];
    setItem(STORAGE_KEYS.VENDAS, atualizado);
    return novaVenda;
  },

  alterarStatusVenda(vendaId, novoStatus) {
    const list = this.getVendas();
    const index = list.findIndex(v => v.id === vendaId);
    if (index !== -1) {
      list[index].status = novoStatus;
      setItem(STORAGE_KEYS.VENDAS, list);
    }
  },

  excluirVenda(vendaId) {
    const list = this.getVendas();
    const filtrado = list.filter(v => v.id !== vendaId);
    setItem(STORAGE_KEYS.VENDAS, filtrado);
  },

  // API de Solicitações Públicas (Inscrições de Parceiros)
  getSolicitacoes() {
    return getItem(STORAGE_KEYS.SOLICITACOES, DEFAULT_SOLICITACOES);
  },

  enviarSolicitacao({ nome, email, whatsapp, cidade, experiencia }) {
    const nova = {
      id: `sol_${Date.now()}`,
      nome: nome.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      cidade: cidade.trim(),
      experiencia: experiencia.trim(),
      data: new Date().toISOString(),
      status: 'pendente'
    };
    const list = this.getSolicitacoes();
    setItem(STORAGE_KEYS.SOLICITACOES, [nova, ...list]);
    return nova;
  },

  marcarSolicitacaoProcessada(id) {
    const list = this.getSolicitacoes();
    const index = list.findIndex(s => s.id === id);
    if (index !== -1) {
      list[index].status = 'aprovada';
      setItem(STORAGE_KEYS.SOLICITACOES, list);
    }
  },

  // API do Ranking (Gamificação)
  getRanking() {
    const tecnicos = this.getTecnicos();
    const vendas = this.getVendas();

    const ranking = tecnicos.map(tec => {
      const vendasTecnico = vendas.filter(v => v.tecnicoCodigo === tec.codigo);
      const totalVendasNum = vendasTecnico.length;
      const totalValorIndicado = vendasTecnico.reduce((acc, v) => acc + v.valor, 0);
      const totalComissaoGanha = vendasTecnico.reduce((acc, v) => acc + v.comissaoValor, 0);
      const comissaoPaga = vendasTecnico.filter(v => v.status === 'pago').reduce((acc, v) => acc + v.comissaoValor, 0);
      const comissaoPendente = vendasTecnico.filter(v => v.status === 'pendente').reduce((acc, v) => acc + v.comissaoValor, 0);

      return {
        ...tec,
        totalVendasNum,
        totalValorIndicado,
        totalComissaoGanha,
        comissaoPaga,
        comissaoPendente
      };
    });

    // Ordena por maior valor de vendas indicadas (R$) e número de indicações
    ranking.sort((a, b) => b.totalValorIndicado - a.totalValorIndicado || b.totalVendasNum - a.totalVendasNum);
    return ranking;
  }
};
