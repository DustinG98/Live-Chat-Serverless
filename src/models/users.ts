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

export interface Friendship extends UserTable {
  channel?: string
  relationship: 'pending' | 'requested' | 'accepted'
}

export interface AllFriendships {
  requests: User[],
  pending: User[],
  friends: User[]
}
