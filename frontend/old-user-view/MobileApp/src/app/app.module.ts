// app.module.ts
import { NgModule } from '@angular/core';
import {BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component'; 
import { HttpClientModule } from '@angular/common/http';
import { TabsComponent } from './commons/tabs/tabs.component';
import { ProductoComponent } from './commons/producto/producto.component';



@NgModule({
  declarations: [
    AppComponent/*, 
    AuthLayoutComponent,
    UserLayoutComponent,
    TabsComponent, 
    ProductoComponent/*, ProductoComponent*/
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule {}
