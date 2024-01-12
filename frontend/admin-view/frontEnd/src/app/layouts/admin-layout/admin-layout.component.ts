import { Component } from '@angular/core';
import { SidebarComponent } from "../../commons/sidebar/sidebar.component";
import { Router, RouterOutlet } from '@angular/router';
import { ProductosComponent } from "../../pages/productos/productos.component";
import { ProductosService } from "../../services/productos.service";
import { PromocionesService } from "../../services/promociones.service";
import { UsuariosService } from '../../services/usuarios.service';
import { UbicacionesService } from '../../services/ubicaciones.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, ProductosComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  constructor( private productosService: ProductosService,
               private promocionesService: PromocionesService,
               private usuariosService: UsuariosService,
               private ubicacionesService: UbicacionesService,
               private route: Router){}

  ngOnInit(): void{

    //SOLO SE PUEDE ACCEDER SI EL USUARIO ESTA REGISTRADO
    if (sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario')) {
      this.productosService.cargarCabeceras();
      this.promocionesService.cargarCabeceras();
      this.usuariosService.cargarCabeceras();
      this.ubicacionesService.cargarCabeceras();
    }
    else{
      this.route.navigate(['/login']);
    }
    
  }
}
