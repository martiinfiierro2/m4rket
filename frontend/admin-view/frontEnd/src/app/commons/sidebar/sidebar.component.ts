import { Component } from '@angular/core';
import { UsuariosService } from "../../services/usuarios.service";
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {


  private nombreUsuario: string = '';
  superAdmin: Boolean = false;


  constructor( private usuarioService: UsuariosService,
               private route: Router){}

  ngOnInit(){
    this.getUsuario();
    this.paginaActual();

    if (localStorage.getItem('rol') == 'superAdmin') {
      this.superAdmin = true;
    }
  
  }
  

  getUsuario(){ 
    this.usuarioService.getUsuario(localStorage.getItem('idUsuario'))
      .subscribe( res => {
        this.nombreUsuario = res.usuarios.nombre;
        document.getElementById('nombreUsuario')!.innerHTML = 'Hola, ' + this.nombreUsuario;
      })
  }

  logOut(){
    let email;

    if (localStorage.getItem("email")) {
      email = localStorage.getItem("email");
      localStorage.clear();
      localStorage.setItem("email", email);
    }
    else{
      localStorage.clear();
    }
    this.route.navigateByUrl('/login');
  }

  paginaActual(){
   
    if (window.location.pathname.includes('/productos')) {
      document.getElementById('lineaProductos')?.classList.add('actual');
    }
    if (window.location.pathname.includes('/promociones')) {
      document.getElementById('lineaPromociones')?.classList.add('actual');
    }
    if (window.location.pathname.includes('/ubicaciones')) {
      document.getElementById('lineaUbicaciones')?.classList.add('actual');
    }
    if (window.location.pathname.includes('/estadisticas')) {
      document.getElementById('lineaEstadisticas')?.classList.add('actual');
    }

  }

}
