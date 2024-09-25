import { Routes } from '@angular/router';

// ui
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { MaterialgroupComponent } from './materialgroup/materialgroup.component';
import { MaterialnameComponent } from './materialname/materialname.component';
import { InventoryComponent } from './inventory/inventory.component';
import { StocksComponent } from './stocks/stocks.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'materialGroup',
        component: MaterialgroupComponent,
      },
      {
        path: 'materialName',
        component: MaterialnameComponent,
      },
      {
        path: 'inventory',
        component: InventoryComponent,
      },
      {
        path: 'stocks',
        component: StocksComponent,
      },
      {
        path: 'tooltips',
        component: AppTooltipsComponent,
      },
    ],
  },
];
