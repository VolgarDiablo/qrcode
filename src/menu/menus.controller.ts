import { Controller, Get, Param } from '@nestjs/common';
import { MenusService } from './menus.service';

@Controller('menus')
export class MenusController {
  constructor(private menusService: MenusService) {}

  @Get(':id')
  getMenu(@Param('id') id: number) {
    return this.menusService.getMenu(id);
  }
}
