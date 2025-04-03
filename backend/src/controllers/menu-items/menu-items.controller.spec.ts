import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsService } from './menu-items.service';

describe('MenuItemsController', () => {
  let controller: MenuItemsController;
  let service: MenuItemsService;

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

  const mockMenuItemsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuItemsController],
      providers: [
        {
          provide: MenuItemsService,
          useValue: mockMenuItemsService,
        },
      ],
    }).compile();

    controller = module.get<MenuItemsController>(MenuItemsController);
    service = module.get<MenuItemsService>(MenuItemsService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of menu items', async () => {
      mockMenuItemsService.findAll.mockResolvedValue(mockMenuItems);

      const result = await controller.findAll();

      expect(result).toEqual(mockMenuItems);
      expect(mockMenuItemsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single menu item', async () => {
      mockMenuItemsService.findOne.mockResolvedValue(mockMenuItems[0]);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockMenuItems[0]);
      expect(mockMenuItemsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a menu item', async () => {
      const createMenuItemDto = {
        qrCodeLink: 'https://menu.uruburger.com/item/3',
        name: 'Cheese Burger',
        value: 13.99,
        description: 'Beef burger with extra cheese',
        imageLink: 'https://images.uruburger.com/cheese-burger.jpg',
      };

      const newMenuItem = {
        id: 3,
        ...createMenuItemDto,
      };

      mockMenuItemsService.create.mockResolvedValue(newMenuItem);

      const result = await controller.create(createMenuItemDto);

      expect(result).toEqual(newMenuItem);
      expect(mockMenuItemsService.create).toHaveBeenCalledWith(
        createMenuItemDto,
      );
    });
  });

  describe('remove', () => {
    it('should call service remove method with correct id', async () => {
      mockMenuItemsService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(mockMenuItemsService.remove).toHaveBeenCalledWith(1);
    });
  });
});
