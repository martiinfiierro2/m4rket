import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import {HttpClient, HttpClientModule, HttpHeaders, HttpErrorResponse} from '@angular/common/http'
import { MensajeChatComponent } from '../mensaje-chat/mensaje-chat.component';
import { MensajeChatModule } from '../mensaje-chat/mensaje-chat.module';

@NgModule({
  imports: [
    IonicModule.forRoot( {mode: 'md'}),
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    MensajeChatModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers:[],
  
  declarations: [Tab2Page,  MensajeChatComponent]
})
export class Tab2PageModule {}