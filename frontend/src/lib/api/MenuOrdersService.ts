import { ApiClient } from './ApiClient';
import {
  MenuOrder,
  CreateMenuOrderDto,
  AddItemsToOrderDto,
  CancelItemsFromOrderDto,
  OrderStatus,
} from './types';

/**
 * Service for interacting with the Menu Orders API endpoints
 */
export class MenuOrdersService {
  private client: ApiClient;
  private basePath = 'menu-orders';

  constructor(apiClient?: ApiClient) {
    this.client = apiClient || new ApiClient();
  }

  /**
   * Get all orders
   */
  async getAll(): Promise<MenuOrder[]> {
    return this.client.get<MenuOrder[]>(this.basePath);
  }

  /**
   * Get a single order by ID
   */
  async getById(id: number): Promise<MenuOrder> {
    return this.client.get<MenuOrder>(`${this.basePath}/${id}`);
  }

  /**
   * Create a new order
   */
  async create(order: CreateMenuOrderDto): Promise<MenuOrder> {
    return this.client.post<MenuOrder>(this.basePath, order);
  }

  /**
   * Add items to an existing order
   */
  async addItems(
    orderId: number,
    items: AddItemsToOrderDto
  ): Promise<MenuOrder> {
    return this.client.post<MenuOrder>(
      `${this.basePath}/${orderId}/items`,
      items
    );
  }

  /**
   * Cancel items from an order
   */
  async cancelItems(
    orderId: number,
    items: CancelItemsFromOrderDto
  ): Promise<MenuOrder> {
    // Using post with method override instead of delete with body
    // since DELETE requests typically don't support request bodies in fetch API
    return this.client.post<MenuOrder>(
      `${this.basePath}/${orderId}/items/remove`,
      items
    );
  }

  /**
   * Update the status of an order
   */
  async updateStatus(orderId: number, status: OrderStatus): Promise<MenuOrder> {
    return this.client.patch<MenuOrder>(`${this.basePath}/${orderId}/status`, {
      status,
    });
  }
}
