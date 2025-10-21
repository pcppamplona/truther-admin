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
