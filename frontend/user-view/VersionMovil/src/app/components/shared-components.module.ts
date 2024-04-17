import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerComponent } from './drawer/drawer.component';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

//shared.components.module.ts

@NgModule({
  declarations: [DrawerComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [DrawerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedComponentsModule { }
