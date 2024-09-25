import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Import Layouts
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

// Vertical Layout
import { SidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { HeaderComponent } from './layouts/full/header/header.component';
import { BrandingComponent } from './layouts/full/sidebar/branding.component';
import { AppNavItemComponent } from './layouts/full/sidebar/nav-item/nav-item.component';
import { MaterialgroupComponent } from './pages/ui-components/materialgroup/materialgroup.component';
import { MaterialnameComponent } from './pages/ui-components/materialname/materialname.component';
import { InventoryComponent } from './pages/ui-components/inventory/inventory.component';
import { StocksComponent } from './pages/ui-components/stocks/stocks.component';
import { ToastrModule } from 'ngx-toastr';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { InwardstockComponent } from './pages/ui-components/inwardstock/inwardstock.component';
import { OutwardstockComponent } from './pages/ui-components/outwardstock/outwardstock.component';

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    BlankComponent,
    SidebarComponent,
    HeaderComponent,
    BrandingComponent,
    AppNavItemComponent,
    MaterialgroupComponent,
    MaterialnameComponent,
    InventoryComponent,
    StocksComponent,
    InwardstockComponent,
    OutwardstockComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      preventDuplicates: true,
    }),
    TablerIconsModule.pick(TablerIcons),
  ],
  exports: [TablerIconsModule],
  bootstrap: [AppComponent],
})
export class AppModule { }
