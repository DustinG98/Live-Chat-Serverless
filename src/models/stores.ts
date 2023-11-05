export const STORE_TABLE_NAME = 'STORE_TABLE';

export interface StoreTable {
  storeId: string
  sortKey?: string
  createdAt?: string
}

export interface StoreCreateRequest {
  storeName: string
  storeDescription: string
  storeLocation: string
}

export interface Store extends StoreTable {
  storeName: string
  storeDescription: string
  storeLocation: string
  storeLogo: string
}
