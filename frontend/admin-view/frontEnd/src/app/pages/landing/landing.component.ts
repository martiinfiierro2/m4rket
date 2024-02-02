import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

    constructor (private el: ElementRef) {}

    abrirMenu(){
      let nav = this.el.nativeElement.querySelector('#menu');      
      nav.classList.add('navVisible');
    }

    cerrarMenu(){
      let nav = this.el.nativeElement.querySelector('#menu');      
      nav.classList.remove('navVisible');
    }
    
      




    
  
}
