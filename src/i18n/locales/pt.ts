const pt = {
  common: {
    actions: {
      apply: "Aplicar",
      clear: "Limpar",
      ok: "OK",
      all: "Todos",
      selectDate: "Selecione a data",
      downloadCsv: "Baixar lista em CSV",
    },
    language: "Idioma",
    theme: {
      light: "Claro",
      dark: "Escuro",
    },
  },
  navUser: {
    account: "Conta",
    logout: "Sair",
  },
  sidebar: {
    anonymousUser: "Usuário",
    dashboard: "Dashboard",
    support: {
      title: "Suporte",
      clients: "Clientes",
      sendGas: "Envio de GAS",
      decode: "Decodificar",
      occurrences: {
        title: "Ocorrências",
        ticketReasons: "Motivos",
      },
      reports: "Reportes",
    },
    marketing: {
      title: "Marketing",
      notifications: "Notificações",
    },
    finance: {
      title: "Financeiro",
      refund: "Reembolso",
      cashout: "Saque",
    },
    transactions: {
      title: "Transações",
    },
    users: "Usuários",
    audit: "Auditoria",
  },
  transactions: {
    breadcrumb: "Transações",
    common: {
      minAmount: "Valor mínimo (ex: 9.99)",
      maxAmount: "Valor máximo (ex: 9.99)",
      walletLabel: "Wallet",
      payerDocumentLabel: "Documento do pagador",
      payerNameLabel: "Nome do pagador",
      destinationKeyLabel: "Chave de destino",
      endToEndLabel: "EndToEnd",
      statusBankLabel: "Status Banco",
      statusBlockchainLabel: "Status Blockchain",
      dateStart: "Data início",
      dateEnd: "Data fim",
      typeLabel: "Tipo",
      allOption: "Todos",
      containsPlaceholder: "contém...",
      numbersOnlyPlaceholder: "Somente números",
      pixKeyLabel: "Chave PIX",
      senderWalletLabel: "Wallet do remetente",
      receiverNameLabel: "Nome do beneficiário",
      receiverDocumentLabel: "Documento do beneficiário",
      appliedFilters: "Filtros aplicados:",
      clearAll: "Limpar tudo",
      emptyState: {
        title: "Nenhuma transação encontrada",
        subtitle: "Tente ajustar os filtros ou criar uma nova.",
      },
    },
    pixIn: {
      title: "Transações PIX IN",
      short: "PIX IN",
      table: {
        headers: {
          txid: "TXID",
          wallet: "Wallet",
          name: "Nome",
          payerName: "Nome Pagador",
          statusBank: "Status Banco",
          statusBlockchain: "Status Blockchain",
          createdAt: "Criado Em",
          token: "Token",
        },
      },
      details: {
        id: "Id",
        walletId: "Wallet ID",
        recipientDocument: "Documento Destinatário",
        destinationKey: "Chave de Destino",
        end2end: "End To End",
        payerDocument: "Documento Pagador",
        amount: "Valor",
        errorBlockchain: "Erro Blockchain",
        errorBank: "Erro Banco",
        typeIn: "Tipo de Entrada",
      },
      filters: {
        title: "Filtros PIX IN",
      },
    },
    pixOut: {
      title: "Transações PIX OUT",
      short: "PIX OUT",
      table: {
        headers: {
          txid: "TXID",
          sender: "Remetente",
          senderName: "Nome Remetente",
          receiverName: "Nome Recebedor",
          statusBank: "Status Bank",
          statusBlockchain: "Status Blockchain",
          createdAt: "Criado Em",
          token: "Token",
        },
      },
      details: {
        id: "Id",
        end2end: "End To End",
        senderDocument: "Documento Remetente",
        amountBrl: "Valor (BRL)",
        dateOp: "Data da Operação",
        receiverDocument: "Documento Recebedor",
        pixKey: "Chave Pix",
      },
      filters: {
        title: "Filtros PIX OUT",
      },
    },
  },
  audit: {
    title: "Auditoria Geral",
    breadcrumb: "Auditoria",
    table: {
      headers: {
        id: "ID",
        method: "método",
        date: "data",
        time: "hora",
        action: "ação",
        sender: "remetente",
        target: "destinatário",
      },
    },
    details: {
      id: "Id",
      date: "Data",
      message: "Mensagem",
      description: "Descrição",
    },
    filters: {
      title: "Filtros",
      description: "Filtre os registros de auditoria",
      message: {
        label: "Mensagem",
        placeholder: "Pesquisar mensagem",
      },
      descriptionField: {
        label: "Descrição",
        placeholder: "Pesquisar descrição",
      },
      method: {
        label: "Método Http",
        placeholder: "Selecione um método",
      },
      action: {
        label: "Ação",
        placeholder: "Selecione uma ação",
      },
      createdAt: {
        label: "Data de criação",
        createdAfter: "Criado após",
        createdBefore: "Criado antes",
        ariaAfter: "Selecionar data - Criado depois de",
        ariaBefore: "Selecionar data - Criado antes de",
      },
      calendar: {
        clear: "Limpar",
        ok: "OK",
      },
    },
  },
};

export default pt;
