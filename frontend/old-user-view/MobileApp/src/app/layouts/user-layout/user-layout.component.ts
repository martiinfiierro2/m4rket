import { Component, OnInit } from '@angular/core';
import { TabsComponent } from 'src/app/commons/tabs/tabs.component';
import { ProductoComponent } from 'src/app/commons/producto/producto.component';

import { ProductosService } from 'src/app/services/productos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [TabsComponent, ProductoComponent, RouterOutlet],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss'],
})
export class UserLayoutComponent  implements OnInit {

  constructor(
    private productosService: ProductosService,
    private usuariosService: UsuariosService,
    private route: Router

  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario')) {
      this.productosService.cargarCabeceras();
      this.usuariosService.cargarCabeceras();
    }
    else{
      this.route.navigate(['/login']);
    }
    
  }
}
