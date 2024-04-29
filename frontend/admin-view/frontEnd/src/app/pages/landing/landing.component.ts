import { CommonModule } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

    constructor (private el: ElementRef, 
                 private deviceDetectorService: DeviceDetectorService) {}

    isMobile: boolean = false;

    menuDesplegado: boolean = false;

    ngOnInit(){
      this.isMobile = this.deviceDetectorService.isMobile();
    }

    abrirMenu(){
      let nav = this.el.nativeElement.querySelector('#menu');      
      nav.classList.add('navVisible');
      this.menuDesplegado = true;
    }

    cerrarMenu(){
      let nav = this.el.nativeElement.querySelector('#menu');      
      nav.classList.remove('navVisible');
      this.menuDesplegado = false;
    }
    
      




    
  
}
