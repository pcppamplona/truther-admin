export interface UserData {
  id: number;
  uuid: string;
  name: string;
  username: string;
  password: string;
  active: boolean;
  createdAt: string;
  updateAt: string;
  deleteAt: string | null;
  forceResetPwd: boolean;
  typeAuth: string;
  groupLevel: string;
}
