import { Injectable } from '@nestjs/common';
import { MenusRepository } from '../repositories/menus.repository';
import { MenuItemsService } from '../menuItems/menu-items.service';

@Injectable()
export class MenusService {
  constructor(
    private menusRepository: MenusRepository,
    private menuItemsService: MenuItemsService,
  ) {}

  async getMenu(id: number) {
    const menu = await this.menusRepository.findById(id);

    const items = await this.menuItemsService.getItemsByMenuId(id);

    return { ...menu, items };
  }
}
