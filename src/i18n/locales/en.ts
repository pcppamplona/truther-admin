const en = {
  common: {
    actions: {
      apply: "Apply",
      clear: "Clear",
      ok: "OK",
      all: "All",
      selectDate: "Select date",
      downloadCsv: "Download list as CSV",
    },
    language: "Language",
    theme: {
      light: "Light",
      dark: "Dark",
    },
  },
  navUser: {
    account: "Account",
    logout: "Logout",
  },
  sidebar: {
    anonymousUser: "User",
    dashboard: "Dashboard",
    support: {
      title: "Support",
      clients: "Clients",
      sendGas: "Send GAS",
      decode: "Decode",
      occurrences: {
        title: "Occurrences",
        ticketReasons: "Reasons",
      },
      reports: "Reports",
    },
    marketing: {
      title: "Marketing",
      notifications: "Notifications",
    },
    finance: {
      title: "Finance",
      refund: "Refund",
      cashout: "Cashout",
    },
    transactions: {
      title: "Transactions",
    },
    users: "Users",
    audit: "Audit",
  },
  transactions: {
    breadcrumb: "Transactions",
    common: {
      minAmount: "Minimum amount (e.g., 9.99)",
      maxAmount: "Maximum amount (e.g., 9.99)",
      walletLabel: "Wallet",
      payerDocumentLabel: "Payer document",
      payerNameLabel: "Payer name",
      destinationKeyLabel: "Destination key",
      endToEndLabel: "EndToEnd",
      statusBankLabel: "Bank status",
      statusBlockchainLabel: "Blockchain status",
      dateStart: "Start date",
      dateEnd: "End date",
      typeLabel: "Type",
      allOption: "All",
      containsPlaceholder: "contains...",
      numbersOnlyPlaceholder: "Numbers only",
      pixKeyLabel: "Pix Key",
      senderWalletLabel: "Sender wallet",
      receiverNameLabel: "Receiver name",
      receiverDocumentLabel: "Receiver document",
    },
    pixIn: {
      title: "PIX IN Transactions",
      short: "PIX IN",
      table: {
        headers: {
          txid: "TXID",
          wallet: "Wallet",
          name: "Name",
          payerName: "Payer Name",
          statusBank: "Bank Status",
          statusBlockchain: "Blockchain Status",
          createdAt: "Created At",
          token: "Token",
        },
      },
      details: {
        id: "Id",
        walletId: "Wallet ID",
        recipientDocument: "Recipient Document",
        destinationKey: "Destination Key",
        end2end: "End To End",
        payerDocument: "Payer Document",
        amount: "Amount",
        errorBlockchain: "Blockchain Error",
        errorBank: "Bank Error",
        typeIn: "Input Type",
      },
      filters: {
        title: "PIX IN Filters",
      },
    },
    pixOut: {
      title: "PIX OUT Transactions",
      short: "PIX OUT",
      table: {
        headers: {
          txid: "TXID",
          sender: "Sender",
          senderName: "Sender Name",
          receiverName: "Receiver Name",
          statusBank: "Bank Status",
          statusBlockchain: "Blockchain Status",
          createdAt: "Created At",
          token: "Token",
        },
      },
      details: {
        id: "Id",
        end2end: "End To End",
        senderDocument: "Sender Document",
        amountBrl: "Amount (BRL)",
        dateOp: "Operation Date",
        receiverDocument: "Receiver Document",
        pixKey: "Pix Key",
      },
      filters: {
        title: "PIX OUT Filters",
      },
    },
  },
  audit: {
    title: "General Audit",
    breadcrumb: "Audit",
    table: {
      headers: {
        id: "ID",
        method: "method",
        date: "date",
        time: "time",
        action: "action",
        sender: "sender",
        target: "target",
      },
    },
    details: {
      id: "Id",
      date: "Date",
      message: "Message",
      description: "Description",
    },
    filters: {
      title: "Filters",
      description: "Filter the audit records",
      message: {
        label: "Message",
        placeholder: "Search message",
      },
      descriptionField: {
        label: "Description",
        placeholder: "Search description",
      },
      method: {
        label: "HTTP Method",
        placeholder: "Select a method",
      },
      action: {
        label: "Action",
        placeholder: "Select an action",
      },
      createdAt: {
        label: "Creation date",
        createdAfter: "Created after",
        createdBefore: "Created before",
        ariaAfter: "Select date - Created after",
        ariaBefore: "Select date - Created before",
      },
      calendar: {
        clear: "Clear",
        ok: "OK",
      },
    },
  },
};

export default en;
