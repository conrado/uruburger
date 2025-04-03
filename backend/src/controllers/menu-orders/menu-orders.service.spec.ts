import { Test, TestingModule } from '@nestjs/testing';
import { MenuOrdersService } from './menu-orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MenuOrder } from '../../entities/menu-order.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { MenuItemsService } from '../menu-items/menu-items.service';
import { CreateMenuOrderDto } from '../../dto/create-menu-order.dto';

describe('MenuOrdersService', () => {
  let service: MenuOrdersService;
  let menuOrderRepository: Repository<MenuOrder>;
  let menuItemsService: MenuItemsService;

  const mockMenuItems = [
    {
      id: 1,
      qrCodeLink: 'https://menu.uruburger.com/item/1',
      name: 'Classic Burger',
      value: 12.99,
      description: 'Our signature beef burger with cheese and sauce',
      imageLink: 'https://images.uruburger.com/classic-burger.jpg',
    },
    {
      id: 2,
      qrCodeLink: 'https://menu.uruburger.com/item/2',
      name: 'Veggie Burger',
      value: 11.99,
      description: 'Plant-based patty with fresh vegetables',
      imageLink: 'https://images.uruburger.com/veggie-burger.jpg',
    },
  ];

  const mockOrder = {
    id: 1,
    qrCodeLink: 'https://menu.uruburger.com/order/1',
    items: mockMenuItems,
    total: 24.98,
    eventLog: [
      {
        timestamp: new Date('2025-04-03T12:00:00Z'),
        event: 'ORDER_CREATED',
        details: { itemIds: [1, 2] },
      },
    ],
  };

  const mockOrderRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockMenuItemsService = {
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuOrdersService,
        {
          provide: getRepositoryToken(MenuOrder),
          useValue: mockOrderRepository,
        },
        {
          provide: MenuItemsService,
          useValue: mockMenuItemsService,
        },
      ],
    }).compile();

    service = module.get<MenuOrdersService>(MenuOrdersService);
    menuOrderRepository = module.get<Repository<MenuOrder>>(
      getRepositoryToken(MenuOrder),
    );
    menuItemsService = module.get<MenuItemsService>(MenuItemsService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of menu orders', async () => {
      mockOrderRepository.find.mockResolvedValue([mockOrder]);

      const result = await service.findAll();

      expect(result).toEqual([mockOrder]);
      expect(mockOrderRepository.find).toHaveBeenCalledWith({
        relations: ['items'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a menu order by id', async () => {
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);

      expect(result).toEqual(mockOrder);
      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['items'],
      });
    });

    it('should throw NotFoundException if menu order not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Order with ID 999 not found',
      );
    });
  });

  describe('create', () => {
    it('should create and return a menu order', async () => {
      const createMenuOrderDto: CreateMenuOrderDto = {
        qrCodeLink: 'https://menu.uruburger.com/order/1',
        itemIds: [1, 2],
      };

      const timestamp = new Date();
      jest.useFakeTimers().setSystemTime(timestamp);

      mockMenuItemsService.findByIds.mockResolvedValue(mockMenuItems);
      mockOrderRepository.create.mockReturnValue({
        ...mockOrder,
        eventLog: [
          {
            timestamp,
            event: 'ORDER_CREATED',
            details: { itemIds: [1, 2] },
          },
        ],
      });
      mockOrderRepository.save.mockResolvedValue(mockOrder);

      const result = await service.create(createMenuOrderDto);

      expect(result).toEqual(mockOrder);
      expect(mockMenuItemsService.findByIds).toHaveBeenCalledWith([1, 2]);
      expect(mockOrderRepository.create).toHaveBeenCalledWith({
        qrCodeLink: 'https://menu.uruburger.com/order/1',
        items: mockMenuItems,
        total: 24.98,
        eventLog: [
          {
            timestamp,
            event: 'ORDER_CREATED',
            details: { itemIds: [1, 2] },
          },
        ],
      });

      jest.useRealTimers();
    });

    it('should throw NotFoundException if some menu items not found', async () => {
      const createMenuOrderDto: CreateMenuOrderDto = {
        qrCodeLink: 'https://menu.uruburger.com/order/1',
        itemIds: [1, 2, 3], // Item with ID 3 doesn't exist
      };

      // Return only 2 items when 3 were requested
      mockMenuItemsService.findByIds.mockResolvedValue([
        mockMenuItems[0],
        mockMenuItems[1],
      ]);

      await expect(service.create(createMenuOrderDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createMenuOrderDto)).rejects.toThrow(
        'Some menu items were not found',
      );
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status and return the updated order', async () => {
      // Create a fixed timestamp for testing
      const timestamp = new Date();
      jest.useFakeTimers().setSystemTime(timestamp);

      // Create a deep clone of mockOrder to avoid reference issues
      const orderCopy = JSON.parse(JSON.stringify(mockOrder));
      orderCopy.eventLog[0].timestamp = new Date(
        orderCopy.eventLog[0].timestamp,
      );

      // Define the updated order with exactly one new event
      const mockOrderWithUpdatedStatus = {
        ...orderCopy,
        eventLog: [
          ...orderCopy.eventLog,
          {
            timestamp: timestamp,
            event: 'PREPARING',
            details: { chef: 'John' },
          },
        ],
      };

      // Mock the service to return a deep clone of the prepared order copy
      // to prevent mutation issues while preserving Date types.
      service.findOne = jest.fn().mockResolvedValue({
        ...orderCopy,
        items: [...orderCopy.items], // Shallow clone items array
        eventLog: orderCopy.eventLog.map((event) => ({ ...event })), // Shallow clone eventLog array and its objects
      });
      mockOrderRepository.save.mockResolvedValue(mockOrderWithUpdatedStatus);

      const result = await service.updateOrderStatus(1, 'PREPARING', {
        chef: 'John',
      });

      expect(result).toEqual(mockOrderWithUpdatedStatus);
      expect(service.findOne).toHaveBeenCalledWith(1);

      // Need to match exactly what's passed to save
      const expectedSaveArg = {
        ...orderCopy,
        eventLog: [
          ...orderCopy.eventLog,
          {
            timestamp: timestamp,
            event: 'PREPARING',
            details: { chef: 'John' },
          },
        ],
      };
      expect(mockOrderRepository.save).toHaveBeenCalledWith(expectedSaveArg);

      jest.useRealTimers();
    });
  });

  describe('remove', () => {
    it('should delete an order and return undefined', async () => {
      mockOrderRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockOrderRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if order to delete not found', async () => {
      mockOrderRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
