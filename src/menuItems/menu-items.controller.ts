import { Controller, Get, Param, Patch, Delete } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private menuItemsService: MenuItemsService) {}

  @Get(':id')
  getMenuItem(@Param('id') id: number) {
    return this.menuItemsService.getItemById(id);
  }

  @Patch(':id')
  updateMenuItem(
    @Param('id') id: number,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuItemsService.updateMenuItem(id, updateMenuItemDto);
  }

  @Delete(':id')
  deleteMenuItem(@Param('id') id: number) {
    return this.menuItemsService.deleteMenuItem(id);
  }
}
