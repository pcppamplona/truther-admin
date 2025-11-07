export interface UserTransaction {
  id: number;
  uuid: string;
  token_id: string | null;
  user_id: number | null;
  from_address: string | null;
  to_address: string | null;
  value: string | null;
  fee_value: string | null;
  status: string | null;
  type: string;
  tx_hash: string | null;
  symbol: string | null;
  flow: string | null;
  created_at: string;
  updated_at: string;
}
