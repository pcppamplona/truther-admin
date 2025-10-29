/////////////////////// PIX OUT
export interface PixOutTransaction {
  id: number;
  txid: string;
  end2end: string | null;
  sender: string;
  sender_name: string | null;
  sender_document: string | null;
  amount_brl: number | null;
  status_px: string | null;
  status_bk: string | null;
  date_op: string | null;
  receiver_document: string | null;
  receiver_name: string | null;
  pixKey: string | null;
  createdAt?: string | null;
  token_symbol?: string | null;
}
export interface PixOutQueryFilters {
  txid?: string;
  end2end?: string;
  pixKey?: string;
  receiverDocument?: string;
  receiverName?: string;
  wallet?: string;
  status_px?: string;
  status_bk?: string;
  min_amount?: string;
  max_amount?: string;
  created_after?: string;
  created_before?: string;
}


/////////////////////// PIX IN
export interface PixInTransaction {
  id: number;
  wallet_id: number | null;
  txid: string;
  receive_wallet: string;
  receive_name: string | null;
  receive_doc: string | null;
  destinationKey: string | null;
  end2end: string | null;
  payer_name: string | null;
  payer_document: string | null;
  amount: number | null;
  status_bank: string | null;
  status_blockchain: string | null;
  msg_error_blockchain: string | null;
  msg_error_bank: string | null;
  createdAt: string | null;
  typeIn: string | null;
  token_symbol?: string | null;
}
export interface PixInQueryFilters {
  txid?: string;
  status_bank?: string;
  status_blockchain?: string;
  payer_document?: string;
  payer_name?: string;
  created_after?: string;
  created_before?: string;
  min_amount?: string;
  max_amount?: string;
  wallet?: string;
  end2end?: string;
  destinationKey?: string;
  typeIn?: string;
}


/////////////////////// BILLET CASHOUT
export interface BilletCashoutTransaction {
  id: number;
  uuid: string;
  identifier: string;
  movimentCode: string;
  transactionCode: string;
  transactionIdentifier: string;
  aditionalInfor: string;
  receiverName: string;
  receiverDocument: string;
  brcode: string;
  msgError: string;
  tryAgain: number;
  status: string;
  countTimer: number;
  refundMovimentCode: string;
  createdAt: string;
  updateAt: string;
  banksId: number;
  orderId: number;
  feeSymbol: string;
  price: number;
  fee: number;
  amount: number;
  typeBoleto: string;
  module: string;
}
export interface BilletCashoutQueryFilters {
  status?: string;
  receiverName?: string;
  receiverDocument?: string;
  min_amount?: number;
  max_amount?: number;
  banksId?: number;
  orderId?: number;
  created_after?: string;
  created_before?: string;
}
