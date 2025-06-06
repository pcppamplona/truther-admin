import { GroupSuport } from "./ocurrences-data";


export interface AuthData {
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

  //teste pro sistema de tickets
  groupLevel: GroupSuport
}