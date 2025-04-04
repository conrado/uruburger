/**
 * API response types for the Uruburger API
 */

// Clock API responses
export interface ClockResponse {
  time: string;
  timestamp: number;
}

// Menu Item API responses
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface CreateMenuItemDto {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface UpdateMenuItemDto {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
}

// Menu Order API responses
export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface MenuOrder {
  id: number;
  customerName: string;
  items: MenuItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuOrderDto {
  customerName: string;
  itemIds: number[];
}

export interface AddItemsToOrderDto {
  itemIds: number[];
}

export interface CancelItemsFromOrderDto {
  itemIds: number[];
}
