import { Component, Renderer2 } from '@angular/core';
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
  private usuario;
  clase = 'linea';

  isSidebarSmall: boolean = false;
  isNightMode: boolean = false;

  
  constructor( private usuarioService: UsuariosService,
               private route: Router,
               private renderer: Renderer2){}

  ngOnInit(){
    this.getUsuario();
  }
  

  getUsuario(){ 
    this.usuarioService.getUsuario(localStorage['idUsuario'])
      .subscribe( res => {
        this.usuario = res.usuarios;        
        document.getElementById('nombreUsuario')!.innerHTML = 'Hola, ' + this.usuario.nombre;
        this.paginaActual();
      })
  }
  
  toggleNightMode(): void {
    this.isNightMode = true;
    document.body.classList.toggle('dark-theme');
  }

  toggleDayMode(): void {
    this.isNightMode = false;
    document.body.classList.toggle('dark-theme');
  }

  
  toggleSidebarSize(): void {
    this.isSidebarSmall = !this.isSidebarSmall;
    const sidebar = document.getElementById('sidebar_menu');
    if (this.isSidebarSmall) {
      sidebar.classList.remove('expanded');
    } else {
      sidebar.classList.add('expanded');
    }
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

    if (this.usuario.rol == 'superAdmin') {
      this.superAdmin = true;
    }
   
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
    if (window.location.pathname.includes('/usuarios')) {
      this.clase = this.clase + ' actual';
    }
  
  }

}
