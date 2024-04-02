import { Component } from '@angular/core';
import { UbicacionesService } from '../../services/ubicaciones.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PaginationComponent } from '../../pagination/pagination.component';

export interface Ubicacion{
  id: number,
  referencia: string,
  posicion: number
}


@Component({
  selector: 'app-ubicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent],
  templateUrl: './ubicaciones.component.html',
  styleUrl: './ubicaciones.component.css'
})
export class UbicacionesComponent {

  ubicaciones: Ubicacion[] = [];

  ubicacionSeleccionada: string = '';
  idUbiSelected: string = '';

  modals = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;


  //Variables de paginación
  public totalregistros=98;
  public posicionactual=0;
  public registrosporpagina=12;

  private paginaUsada = 0;


  constructor ( private ubicacionesService: UbicacionesService,
                private fb:FormBuilder ) {}

  
  public formUbi =this.fb.group({
    referencia: ['', Validators.required],
    posicion: ['', Validators.required]
  })

  ngOnInit(): void {
    this.getUbicaciones();
  }

  //FUNCIONES SELECT
  ejecutarAccion(idUbicacion: number){
    this.mostrarModal();
    this.idUbiSelected = ''+idUbicacion;
  }

  newUbicacion(){
    let url = 'ubicaciones/newUbicacion';
    window.location.href = url;
  }

  editUbi(idUbi){
    let url = 'ubicaciones/editUbicacion?id='+idUbi;
    window.location.href = url;
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

  confirmarBorrado() {
    this.cerrarModal();
    this.borrarUbicacion();
  }



  //PAGINACIÓN
  cambiarPagina( pagina:number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.paginaUsada = pagina;

    this.getUbicaciones();
  }



  //CRUD
  getUbicaciones(){
    this.ubicacionesService.getAllUbicaciones(this.posicionactual)
      .subscribe( res => {
        this.ubicaciones = res.ubicaciones;

        //Paginación
        this.totalregistros = res.page.total;
      })
  }

  borrarUbicacion(){
    this.ubicacionesService.deleteUbicacion(this.idUbiSelected)
      .subscribe( res =>{
        console.log(res);
        window.location.reload();
      });
  }

  anyadirUbicacion(){
    console.log(this.formUbi.value);
    this.ubicacionesService.postUbicacion(this.formUbi.value)
      .subscribe( res => {
        console.log(res);
        window.location.reload();
    })
  }
}
