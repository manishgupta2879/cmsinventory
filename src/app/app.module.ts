import { NgModule, isDevMode } from '@angular/core';
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
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { InwardstockComponent } from './pages/ui-components/inwardstock/inwardstock.component';
import { OutwardstockComponent } from './pages/ui-components/outwardstock/outwardstock.component';
import { InitialStockComponent } from './pages/ui-components/initial-stock/initial-stock.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialgrpConfComponent } from './materialgrp-conf/materialgrp-conf.component';
import { InwardconfComponent } from './inwardconf/inwardconf.component';
import { OutwardconfComponent } from './outwardconf/outwardconf.component';
import { ResetpasswordComponent } from './pages/authentication/resetpassword/resetpassword.component';
import { NgChartsModule } from 'ng2-charts';
import { ServiceWorkerModule } from '@angular/service-worker';





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
    OutwardstockComponent,
    ConfirmationComponent,
    MaterialgrpConfComponent,
    InwardconfComponent,
    OutwardconfComponent,
    InitialStockComponent,
    ResetpasswordComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatDialogModule,    // Import MatDialogModule for dialog components
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatPaginatorModule,
    MatCardModule,
    MaterialModule,
    NgChartsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      preventDuplicates: true,
    }),
    TablerIconsModule.pick(TablerIcons),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode()
    }),
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  exports: [TablerIconsModule],
  bootstrap: [AppComponent],
})
export class AppModule { }
