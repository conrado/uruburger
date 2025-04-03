import { Test, TestingModule } from '@nestjs/testing';
import { MenuOrdersController } from './menu-orders.controller';
import { MenuOrdersService } from './menu-orders.service';

describe('MenuOrdersController', () => {
  let controller: MenuOrdersController;
  let service: MenuOrdersService;

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

  const mockMenuOrdersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    updateOrderStatus: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuOrdersController],
      providers: [
        {
          provide: MenuOrdersService,
          useValue: mockMenuOrdersService,
        },
      ],
    }).compile();

    controller = module.get<MenuOrdersController>(MenuOrdersController);
    service = module.get<MenuOrdersService>(MenuOrdersService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of menu orders', async () => {
      mockMenuOrdersService.findAll.mockResolvedValue([mockOrder]);

      const result = await controller.findAll();

      expect(result).toEqual([mockOrder]);
      expect(mockMenuOrdersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single menu order', async () => {
      mockMenuOrdersService.findOne.mockResolvedValue(mockOrder);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockOrder);
      expect(mockMenuOrdersService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a menu order', async () => {
      const createMenuOrderDto = {
        qrCodeLink: 'https://menu.uruburger.com/order/1',
        itemIds: [1, 2],
      };

      mockMenuOrdersService.create.mockResolvedValue(mockOrder);

      const result = await controller.create(createMenuOrderDto);

      expect(result).toEqual(mockOrder);
      expect(mockMenuOrdersService.create).toHaveBeenCalledWith(
        createMenuOrderDto,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update order status and return the updated order', async () => {
      const updatedOrder = {
        ...mockOrder,
        eventLog: [
          ...mockOrder.eventLog,
          {
            timestamp: new Date('2025-04-03T12:30:00Z'),
            event: 'PREPARING',
            details: { chef: 'John' },
          },
        ],
      };

      const statusUpdate = {
        status: 'PREPARING',
        details: { chef: 'John' },
      };

      mockMenuOrdersService.updateOrderStatus.mockResolvedValue(updatedOrder);

      const result = await controller.updateStatus('1', statusUpdate);

      expect(result).toEqual(updatedOrder);
      expect(mockMenuOrdersService.updateOrderStatus).toHaveBeenCalledWith(
        1,
        statusUpdate.status,
        statusUpdate.details,
      );
    });
  });

  describe('remove', () => {
    it('should call service remove method with correct id', async () => {
      mockMenuOrdersService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(mockMenuOrdersService.remove).toHaveBeenCalledWith(1);
    });
  });
});
