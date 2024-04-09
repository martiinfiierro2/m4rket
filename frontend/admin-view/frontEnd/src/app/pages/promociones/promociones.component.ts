import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PromocionesService } from '../../services/promociones.service';
import { PaginationComponent } from '../../pagination/pagination.component';


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
  }
}

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
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
  public registrosporpagina=4;

  private paginaUsada = 0;


  constructor ( private promocionesService: PromocionesService, 
                private route: Router){}


  ngOnInit(): void {
    this.getPromociones();
  }

  ejecutarAccion(idPromo: number){
    
    let selects = document.querySelectorAll('select');

    for (let i = 0; i < selects.length; i++) {
      if (selects[i].value === 'borrar') {
        this.mostrarModal();
        this.idPromoSelected = ''+idPromo;

      }
      if(selects[i].value === 'editar') {
        this.idPromoSelected = ''+idPromo;

        let url = 'promociones/editPromocion?id='+idPromo;
        window.location.href = url;
      }
    }
  }



  //MODAL
  mostrarModal(){
    for (let i = 0; i < this.modals.length; i++) {
      this.modals[i].style.display = 'block';
    }
  }
  cerrarModal() {
    // Oculta el modal al hacer clic en la 'X'
    for (let i = 0; i < this.modals.length; i++) {
      this.modals[i].style.display = 'none';
    }

    let selects = document.querySelectorAll('select');
    for (let i = 0; i < selects.length; i++) {
      selects[i].value = '';
    }
  } 

  irNuevaPromo(){
    this.route.navigate(['promociones/newPromocion']);
  }

  irNuevoTipoPromo(){
    this.route.navigate(['promociones/newTipoPromocion']);
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
      window.location.reload();
    })
  }



}

