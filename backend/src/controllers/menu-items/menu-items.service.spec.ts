import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemsService } from './menu-items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MenuItem } from '../../entities/menu-item.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('MenuItemsService', () => {
  let service: MenuItemsService;
  let repository: Repository<MenuItem>;

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

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuItemsService,
        {
          provide: getRepositoryToken(MenuItem),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MenuItemsService>(MenuItemsService);
    repository = module.get<Repository<MenuItem>>(getRepositoryToken(MenuItem));

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of menu items', async () => {
      mockRepository.find.mockResolvedValue(mockMenuItems);

      const result = await service.findAll();

      expect(result).toEqual(mockMenuItems);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a menu item by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockMenuItems[0]);

      const result = await service.findOne(1);

      expect(result).toEqual(mockMenuItems[0]);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if menu item not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        'MenuItem with id 999 not found',
      );
    });
  });

  describe('findByIds', () => {
    it('should return menu items by array of ids', async () => {
      mockRepository.find.mockResolvedValue([
        mockMenuItems[0],
        mockMenuItems[1],
      ]);

      const result = await service.findByIds([1, 2]);

      expect(result).toEqual([mockMenuItems[0], mockMenuItems[1]]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { id: expect.any(Object) },
      });
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

      mockRepository.create.mockReturnValue(newMenuItem);
      mockRepository.save.mockResolvedValue(newMenuItem);

      const result = await service.create(createMenuItemDto);

      expect(result).toEqual(newMenuItem);
      expect(mockRepository.create).toHaveBeenCalledWith(createMenuItemDto);
      expect(mockRepository.save).toHaveBeenCalledWith(newMenuItem);
    });
  });

  describe('remove', () => {
    it('should call repository delete with correct id', async () => {
      await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
