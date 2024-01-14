import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import {  HttpClientModule } from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontEnd';

  ngOnInit(): void{
    this.comprobarUsuario();
  }


  constructor( private routes: Router){}

  
  comprobarUsuario(){
    if (sessionStorage.getItem('tokenUsuario') || localStorage!.getItem('tokenUsuario')) {
      this.routes.navigate(['/productos']);
    }
    else{
      this.routes.navigate(['/login']);
    }
  }
}
