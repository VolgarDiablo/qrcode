import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItemsRepository } from '../repositories/menu-items.repository';

@Injectable()
export class MenuItemsService {
  constructor(private menuItemsRepository: MenuItemsRepository) {}

  getItemsByMenuId(menuId: number) {
    return this.menuItemsRepository.findByMenuId(menuId);
  }

  getAllItems() {
    return this.menuItemsRepository.findAll();
  }

  async getItemById(id: number) {
    const item = await this.menuItemsRepository.findById(id);

    if (!item) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return item;
  }

  async updateMenuItem(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    await this.getItemById(id);

    return this.menuItemsRepository.update(id, updateMenuItemDto);
  }

  async deleteMenuItem(id: number) {
    await this.getItemById(id);

    return this.menuItemsRepository.delete(id);
  }
}
