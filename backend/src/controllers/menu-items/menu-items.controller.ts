import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { MenuItem } from '../../entities/menu-item.entity';
import { CreateMenuItemDto } from '../../dto/create-menu-item.dto';
import { UpdateMenuItemDto } from '../../dto/update-menu-item.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('menu-items')
@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @ApiOperation({ summary: 'Get all menu items' })
  @ApiResponse({
    status: 200,
    description: 'List of all menu items',
    type: [MenuItem],
  })
  @Get()
  findAll(): Promise<MenuItem[]> {
    return this.menuItemsService.findAll();
  }

  @ApiOperation({ summary: 'Get a menu item by ID' })
  @ApiParam({ name: 'id', description: 'Menu item ID' })
  @ApiResponse({
    status: 200,
    description: 'The found menu item',
    type: MenuItem,
  })
  @ApiResponse({
    status: 404,
    description: 'Menu item not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<MenuItem> {
    return this.menuItemsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({
    status: 201,
    description: 'The menu item has been successfully created',
    type: MenuItem,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  @Post()
  create(@Body() createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    return this.menuItemsService.create(createMenuItemDto);
  }

  @ApiOperation({ summary: 'Update a menu item' })
  @ApiParam({ name: 'id', description: 'Menu item ID to update' })
  @ApiResponse({
    status: 200,
    description: 'The menu item has been successfully updated',
    type: MenuItem,
  })
  @ApiResponse({
    status: 404,
    description: 'Menu item not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuItemsService.update(+id, updateMenuItemDto);
  }

  @ApiOperation({ summary: 'Delete a menu item' })
  @ApiParam({ name: 'id', description: 'Menu item ID to delete' })
  @ApiResponse({
    status: 200,
    description: 'The menu item has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu item not found',
  })
  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string): Promise<void> {
    return this.menuItemsService.remove(+id);
  }
}
