import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { MatIconModule } from '@angular/material/icon';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';




@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    NgxEchartsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: []
})
export class AppModule { }
