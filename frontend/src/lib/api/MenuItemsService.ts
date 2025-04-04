import { ApiClient } from './ApiClient';
import { MenuItem, CreateMenuItemDto, UpdateMenuItemDto } from './types';

/**
 * Service for interacting with the Menu Items API endpoints
 */
export class MenuItemsService {
  private client: ApiClient;
  private basePath = 'menu-items';

  constructor(apiClient?: ApiClient) {
    this.client = apiClient || new ApiClient();
  }

  /**
   * Get all menu items
   */
  async getAll(): Promise<MenuItem[]> {
    return this.client.get<MenuItem[]>(this.basePath);
  }

  /**
   * Get a single menu item by ID
   */
  async getById(id: number): Promise<MenuItem> {
    return this.client.get<MenuItem>(`${this.basePath}/${id}`);
  }

  /**
   * Create a new menu item
   */
  async create(menuItem: CreateMenuItemDto): Promise<MenuItem> {
    return this.client.post<MenuItem>(this.basePath, menuItem);
  }

  /**
   * Update an existing menu item
   */
  async update(id: number, menuItem: UpdateMenuItemDto): Promise<MenuItem> {
    return this.client.patch<MenuItem>(`${this.basePath}/${id}`, menuItem);
  }

  /**
   * Delete a menu item
   */
  async delete(id: number): Promise<void> {
    return this.client.delete<void>(`${this.basePath}/${id}`);
  }
}
