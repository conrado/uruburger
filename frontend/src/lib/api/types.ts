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
  qrCodeLink: string;
  name: string;
  value: number; // Changed from price to value to match backend
  description: string;
  imageLink: string; // Changed from imageUrl to imageLink to match backend
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
  ORDER_CREATED = 'ORDER_CREATED',
  ITEMS_ADDED = 'ITEMS_ADDED',
  ITEMS_CANCELLED = 'ITEMS_CANCELLED',
  PREPARING = 'PREPARING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface MenuOrder {
  id: number;
  qrCodeLink: string;
  customerId: string;
  items: MenuItem[];
  total: number;
  status: OrderStatus; // Added status field
  eventLog: Array<{
    timestamp: Date;
    event: OrderStatus;
    details: any;
  }>;
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
