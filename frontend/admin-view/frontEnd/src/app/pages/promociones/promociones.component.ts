import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PromocionesService } from '../../services/promociones.service';
import { PaginationComponent } from '../../pagination/pagination.component';
import { NewPromocionComponent } from '../../promociones/new-promocion/new-promocion.component';
import { NewTipoPromocionComponent } from '../../promociones/new-tipo-promocion/new-tipo-promocion.component';
import { tipoPromocion } from '../../promociones/new-tipo-promocion/new-tipo-promocion.component';



export interface Promocion{
  id: number,
  nombre: string,
  fecha_ini: Date,
  fecha_fin: Date,
  id_tipoPromo: number,
  tipopromo: {
    id: number,
    nombre: string,
    descripcion: string,
    modificador: number
  },
  isEdit: boolean
}

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, NewPromocionComponent, NewTipoPromocionComponent],
  templateUrl: './promociones.component.html',
  styleUrl: './promociones.component.css'
})
export class PromocionesComponent {

  promociones: Promocion[] = [];

  promocionSeleccionada: string = '';
  idPromoSelected: string = '';

  modals = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;

  //Variables paginación
  public totalregistros=98;
  public posicionactual=0;
  public registrosporpagina=10;

  private paginaUsada = 0;


  visualizacionModalPromo = 'display: none';
  visualizacionModalTipoPromo = 'display: none';

  public tipoPromos: tipoPromocion[] = [];

  constructor ( private promocionesService: PromocionesService, 
                private route: Router){}


  ngOnInit(): void {
    this.getPromociones();
  }

editPromo(promocion) {
  this.getTipoPromos();
  promocion.isEdit = true;
}

savePromo(promocion) {
  this.promocionesService.editPromocion(promocion.id, promocion).subscribe(res => {
    console.log(res);
    promocion.isEdit = false; // salir del modo de edición
    this.getPromociones();
  }, error => {
    console.error('Error al guardar la promoción', error);
    // Manejar el error
  });
}

cancelarEdit(promocion) {
  promocion.isEdit = false;
  this.getPromociones();
}

getTipoPromos(){
  this.promocionesService.getAllTipoPromociones()
    .subscribe( res => {
      this.tipoPromos = res.tipopromociones;
    })

    console.log();
    
}

  //MODALES
  mostrarModal(){

      this.visualizacionModalPromo = 'display: block';

  }

  cerrarModal() {
      this.visualizacionModalPromo = 'display: none';
      this.visualizacionModalTipoPromo = 'display: none';
  } 

  irNuevaPromo(){
    this.route.navigate(['promociones/newPromocion']);
  }

  irNuevoTipoPromo(){
    /*
    this.route.navigate(['promociones/newTipoPromocion']);
    */
    this.visualizacionModalTipoPromo = 'display: block';
  }

  irEditPromo(idPromo){
    let url = 'promociones/editPromocion?id='+idPromo;
    window.location.href = url;
  }


  cambiarPagina( pagina:number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.paginaUsada = pagina;

    this.getPromociones();
  }

  

  //CRUD
  getPromociones(){
    this.promocionesService.getAllPromociones(this.posicionactual)
      .subscribe(res =>{
        this.promociones = res.promociones;

        //Paginacion
        this.totalregistros = res.page.total;
    })

    
  }

  borrarPromo(idPromo){
    this.promocionesService.deletePromociones(idPromo).subscribe(res => {
      console.log(res);
      this.getPromociones();
    })
  }



}

