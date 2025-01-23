import { NavItem } from './nav-item/nav-item';

export const navItems: any[] = [
  {
    navCap: 'Home',
    new:[
      {
        displayName: 'Dashboard',
        iconName: 'layout-dashboard',
        route: '/dashboard',
      },
    ]
  },

  {
    navCap: 'Masters',
    new:[
      {
        displayName: 'Material Group',
        iconName: 'rosette',
        route: '/ui-components/materialGroup',
      },
      {
        displayName: 'Material Item',
        iconName: 'poker-chip',
        route: '/ui-components/materialName',
      },
      {
        displayName: 'Inventory',
        iconName: 'list',
        route: '/ui-components/inventory',
      },
      {
        displayName: 'Stocks',
        iconName: 'layout-navbar-expand',
        route: '/ui-components/stocks',
      },

    ]
  },
  {
    navCap: 'Inventory',
  },
  {
    navCap: 'Stock',
  }
  // {
  //   displayName: 'Material Group',
  //   iconName: 'rosette',
  //   route: '/ui-components/materialGroup',
  // },
  // {
  //   displayName: 'Material Name',
  //   iconName: 'poker-chip',
  //   route: '/ui-components/materialName',
  // },
  // {
  //   displayName: 'Inventory',
  //   iconName: 'list',
  //   route: '/ui-components/inventory',
  // },
  // {
  //   displayName: 'Stocks',
  //   iconName: 'layout-navbar-expand',
  //   route: '/ui-components/stocks',
  // },
  // {
  //   displayName: 'Tooltips',
  //   iconName: 'tooltip',
  //   route: '/ui-components/tooltips',
  // },
  // {
  //   navCap: 'Auth',
  // },
  // {
  //   displayName: 'Login',
  //   iconName: 'lock',
  //   route: '/authentication/login',
  // },
  // {
  //   displayName: 'Register',
  //   iconName: 'user-plus',
  //   route: '/authentication/register',
  // },
  // {
  //   navCap: 'Extra',
  // },
  // {
  //   displayName: 'Icons',
  //   iconName: 'mood-smile',
  //   route: '/extra/icons',
  // },
  // {
  //   displayName: 'Sample Page',
  //   iconName: 'aperture',
  //   route: '/extra/sample-page',
  // },
];
