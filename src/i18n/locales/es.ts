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
    common: {
      minAmount: "Monto mínimo (ej.: 9.99)",
      maxAmount: "Monto máximo (ej.: 9.99)",
      walletLabel: "Wallet",
      payerDocumentLabel: "Documento del pagador",
      payerNameLabel: "Nombre del pagador",
      destinationKeyLabel: "Clave de destino",
      endToEndLabel: "EndToEnd",
      statusBankLabel: "Estado del banco",
      statusBlockchainLabel: "Estado de la blockchain",
      dateStart: "Fecha de inicio",
      dateEnd: "Fecha de fin",
      typeLabel: "Tipo",
      allOption: "Todos",
      containsPlaceholder: "contiene...",
      numbersOnlyPlaceholder: "Solo números",
      pixKeyLabel: "Clave Pix",
      senderWalletLabel: "Wallet del remitente",
      receiverNameLabel: "Nombre del receptor",
      receiverDocumentLabel: "Documento del receptor",
      appliedFilters: "Filtros aplicados:",
      clearAll: "Limpiar todo",
      emptyState: {
        title: "Ninguna transacción encontrada",
        subtitle: "Intenta ajustar los filtros o crear una nueva.",
      },
    },
    pixIn: {
      title: "Transacciones PIX IN",
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
