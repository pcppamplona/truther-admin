export interface PermissionData {
  id: number
  key_name: string
  description?: string
}

export interface RolePermissionPayload {
  role_id: number
  permission_id: number
}

export interface UserPermissionPayload {
  user_id: number
  permission_id: number
}
