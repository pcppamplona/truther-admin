export interface DataUserWallet {
  id: number;
  address: string;
  deviceId: string | null;
  userId: number;
  usdtBalance: string;
  usdtLockedBalance: string;
  balance: string;
  lockedBalance: string;
  type: string | null;
  salt: string | null;
  protocol: string | null;
  custodian: string | null;
  newWallet: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DataUserFeeLevel {
  id: number;
  name: string;
  label: string;
  value: string;
  type: string;
  isDefault: boolean;
  nrOfTxs: number;
  createdAt: string;
  updatedAt: string;
}

export interface DataUserError {
  code: string | null;
  message: string | null;
}

export interface DataUserUser {
  id: number;
  uuid: string;
  name: string;
  password: string;
  restrict: boolean;
  role: string;
  isVerified: boolean;
  canTransact: boolean;
  status: string;
  providerKyc: string;
  error: DataUserError;
  kyc_approved: boolean;
  register_txid: string;
  called_attempts_guenno: number;
  attemptsKyc: number;
  stage_kyc: number;
  kyc_risk: string;
  comment_kyc: string;
  banking_enable: boolean;
  disinterest: boolean;
  ipCreate: string | null;
  feeLevelId: number;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  lastIpLogin: string | null;
  retryKyc: number;
  regenerateKyc: boolean;
  flags: string | null;
  expoId: string | null;
  override_instant_pay: boolean;
  master_instant_pay: boolean;
  feeLevel: DataUserFeeLevel;
  wallets: DataUserWallet[];
}

export interface DataUserRes {
  id: number;
  uuid: string;
  userId: number;
  name: string;
  document: string;
  documentType: string;
  email: string;
  phone: string;
  nationality: string;
  cep: string;
  city: string;
  state: string;
  neighborhood: string;
  street: string;
  mothersName: string;
  birthday: string;
  location: string;
  houseNumber: string;
  flags: any;
  active: string;
  createdAt: string;
  updatedAt: string;
  user: DataUserUser;
}

export interface DataUserPath {
  type: string;
  path: string;
  id: number;
}

export interface DataUserBalance {
  matic: string;
  usdt: string;
  btc: number;
}

export interface DataUser {
  res: DataUserRes;
  paht: DataUserPath[];
  balance: DataUserBalance;
}
