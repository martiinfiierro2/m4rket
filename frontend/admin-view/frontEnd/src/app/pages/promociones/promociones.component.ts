import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PromocionesService } from '../../services/promociones.service';
import { PaginationComponent } from '../../pagination/pagination.component';
import { tipoPromocion } from '../../promociones/new-tipo-promocion/new-tipo-promocion.component';
import Swal from 'sweetalert2';


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
  imports: [CommonModule, FormsModule, PaginationComponent, ReactiveFormsModule],
  templateUrl: './promociones.component.html',
  styleUrl: './promociones.component.css'
})
export class PromocionesComponent {

  promociones: Promocion[] = [];

  promocionSeleccionada: string = '';
  idPromoSelected: string = '';

  modals = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;

  creacionTipoPromo = false;
  creacionPromo = false;

  //Variables paginación
  public totalregistros=98;
  public posicionactual=0;
  public registrosporpagina=10;

  private paginaUsada = 0;

  public tipoPromociones: tipoPromocion[] = [];


  constructor ( private promocionesService: PromocionesService, 
                private router: Router,
                private fb: FormBuilder){}

  public promocionCrearForm = this.fb.group({
    nombre: ['' , [Validators.required]],
    fecha_ini: ['' , [Validators.required]],
    fecha_fin: ['' , [Validators.required]],
    id_tipoPromo: ['' , [Validators.required]]
  });

  public tipoPromoCrearForm = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    modificador: [null]
  });


  ngOnInit(): void {
    this.getPromociones();
    this.getTipoPromos();
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

  desplegarFormulario(form){
    if (form == 'promo') {
      if (this.creacionPromo) {
        this.cerrarFormulario('promo');
      }
      else{
        this.creacionPromo = true;
        this.cerrarFormulario('tipoPromo');
      }
    }
    else{
      if (this.creacionTipoPromo) {
       this.cerrarFormulario('tipoPromo');
      }
      else{
        this.creacionTipoPromo = true;
        this.cerrarFormulario('promo');
      }
    }    
  }

  cerrarFormulario(form){
    if (form == 'promo') {
      this.creacionPromo = false;
      this.promocionCrearForm.reset();
    }
    else{
      this.creacionTipoPromo = false;
      this.tipoPromoCrearForm.reset();
    }
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

  crearPromocion(){

    if (this.promocionCrearForm.invalid) {
      Swal.fire({
        title: 'Error!',
        text: "Hay campos incompletos",
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
    else{
      let idPromo = this.promocionCrearForm.value.id_tipoPromo.split('-')[0][0];

  
      this.promocionesService.postPromociones(this.promocionCrearForm.value)
        .subscribe( res => {
          this.cerrarFormulario('promo');
        });
    }
  }

  crearTipoPromo(){
    
    if (this.tipoPromoCrearForm.invalid) {
      Swal.fire({
        title: 'Error!',
        text: "Hay campos incompletos",
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
    else{

      if (this.tipoPromoCrearForm.value.modificador != null && this.tipoPromoCrearForm.value.modificador != '') {

        let valorModificador = this.tipoPromoCrearForm.value.modificador / 100;
        this.tipoPromoCrearForm.controls.modificador.setValue(valorModificador);
      }

      this.promocionesService.postTipoPromocion(this.tipoPromoCrearForm.value)
      .subscribe( res =>{
        this.getTipoPromos();
        this.cerrarFormulario('tipoPromo');
      })
    }
  }

  getTipoPromos(){
    this.promocionesService.getAllTipoPromociones()
      .subscribe( res => {
        this.tipoPromociones = res.tipopromociones;
      });
  }

  borrarPromo(idPromo){
    this.promocionesService.deletePromociones(idPromo).subscribe(res => {
      console.log(res);
      window.location.reload();
    })
  }



}

