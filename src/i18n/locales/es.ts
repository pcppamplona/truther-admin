const es = {
  common: {
    actions: {
      apply: "Aplicar",
      clear: "Limpiar",
      ok: "OK",
      all: "Todos",
      selectDate: "Seleccionar fecha",
      downloadCsv: "Descargar lista en CSV",
    },
    language: "Idioma",
    theme: {
      light: "Claro",
      dark: "Oscuro",
    },
  },
  navUser: {
    account: "Cuenta",
    logout: "Salir",
  },
  sidebar: {
    anonymousUser: "Usuario",
    dashboard: "Dashboard",
    support: {
      title: "Soporte",
      clients: "Clientes",
      sendGas: "Enviar GAS",
      decode: "Decodificar",
      occurrences: {
        title: "Ocurrencias",
        ticketReasons: "Motivos",
      },
      reports: "Reportes",
    },
    marketing: {
      title: "Marketing",
      notifications: "Notificaciones",
    },
    finance: {
      title: "Finanzas",
      refund: "Reembolso",
      cashout: "Retiro",
    },
    transactions: {
      title: "Transacciones",
    },
    users: "Usuarios",
    audit: "Auditoría",
  },
  transactions: {
    breadcrumb: "Transacciones",
    pixIn: {
      title: "Transacciones PIX IN",
      description: "Visualice todas las transacciones PIX recibidas, con detalles del pagador, estado bancario y blockchain, además del historial completo de creación y token asociado.",
      short: "PIX IN",
      table: {
        headers: {
          txid: "TXID",
          wallet: "Wallet",
          name: "Nombre",
          payerName: "Nombre del Pagador",
          statusBank: "Estado del Banco",
          statusBlockchain: "Estado de la Blockchain",
          createdAt: "Creado En",
          token: "Token",
        },
      },
      details: {
        id: "Id",
        walletId: "ID de Wallet",
        recipientDocument: "Documento del Destinatario",
        destinationKey: "Clave de Destino",
        end2end: "End To End",
        payerDocument: "Documento del Pagador",
        amount: "Valor",
        errorBlockchain: "Error de Blockchain",
        errorBank: "Error del Banco",
        typeIn: "Tipo de Entrada",
      },
      filters: {
        title: "Filtros PIX IN",
      },
    },
    pixOut: {
      title: "Transacciones PIX OUT",
      description: "Visualice todas las transacciones PIX enviadas, con detalles del remitente y receptor, estado bancario y blockchain, además del historial completo de creación y token asociado.",
      short: "PIX OUT",
      table: {
        headers: {
          txid: "TXID",
          sender: "Remitente",
          senderName: "Nombre del Remitente",
          receiverName: "Nombre del Receptor",
          statusBank: "Estado del Banco",
          statusBlockchain: "Estado de la Blockchain",
          createdAt: "Creado En",
          token: "Token",
        },
      },
      details: {
        id: "Id",
        end2end: "End To End",
        senderDocument: "Documento del Remitente",
        amountBrl: "Valor (BRL)",
        dateOp: "Fecha de la Operación",
        receiverDocument: "Documento del Receptor",
        pixKey: "Clave Pix",
      },
      filters: {
        title: "Filtros PIX OUT",
      },
    },
  },
  audit: {
    title: "Auditoría General",
    description: "Visualize registros detalhados de auditoria, incluindo métodos executados, horários, usuários e eventos do sistema.",
    breadcrumb: "Auditoría",
    table: {
      headers: {
        id: "ID",
        method: "método",
        date: "fecha",
        time: "hora",
        action: "acción",
        sender: "remitente",
        target: "destinatario",
      },
    },
    details: {
      id: "Id",
      date: "Fecha",
      message: "Mensaje",
      description: "Descripción",
    },
    filters: {
      title: "Filtros",
      description: "Filtra los registros de auditoría",
      message: {
        label: "Mensaje",
        placeholder: "Buscar mensaje",
      },
      descriptionField: {
        label: "Descripción",
        placeholder: "Buscar descripción",
      },
      method: {
        label: "Método HTTP",
        placeholder: "Selecciona un método",
      },
      action: {
        label: "Acción",
        placeholder: "Selecciona una acción",
      },
      createdAt: {
        label: "Fecha de creación",
        createdAfter: "Creado después de",
        createdBefore: "Creado antes de",
        ariaAfter: "Seleccionar fecha - Creado después de",
        ariaBefore: "Seleccionar fecha - Creado antes de",
      },
      calendar: {
        clear: "Limpiar",
        ok: "OK",
      },
    },
  },
};

export default es;
