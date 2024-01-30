import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {

  constructor( private route: Router){}


  ngOnInit(): void{
    
    //comprueba si ya hay un usuario en uso
    if (sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario')) {
      this.route.navigate(['/productos']);
    }
  }
}
