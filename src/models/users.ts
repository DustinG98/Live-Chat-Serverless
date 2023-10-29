export const USER_TABLE_NAME = 'USERS_TABLE';

export interface UserTable {
  userId: string
  userName?: string
  sortKey?: string
  createdAt?: string
}

export interface UserConnection extends UserTable {
  connectionId: string
}

export interface User extends UserTable {
  preferredUserName: string
  discriminator?: string
}
