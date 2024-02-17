import { Component } from '@angular/core';
import { UsuariosService } from "../../services/usuarios.service";
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  private idUsuario: string|any
  private nombreUsuario: string = '';


  constructor( private usuarioService: UsuariosService,
               private route: Router){}

  ngOnInit(){
    this.getUsuario();
    this.paginaActual();
  }
  

  getUsuario(){
    this.idUsuario = sessionStorage.getItem('idUsuario') || localStorage.getItem('idUsuario');

    this.usuarioService.getUsuario(this.idUsuario)
      .subscribe( res => {
        this.nombreUsuario = res.usuarios.nombre;
        document.getElementById('nombreUsuario')!.innerHTML = 'Hola, ' + this.nombreUsuario;
      })
  }

  logOut(){
    if (sessionStorage.getItem('tokenUsuario') && sessionStorage.getItem('idUsuario')) {
      sessionStorage.clear();
    }
    else{
      localStorage.clear();
    }
    this.route.navigate(['/login']);
  }

  paginaActual(){
    console.log(window.location.pathname);

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
