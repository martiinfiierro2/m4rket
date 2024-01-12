import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PromocionesService } from '../../services/promociones.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


export interface tipoPromocion{
  id: number,
  nombre: string,
  descripcion: string,
  modificador: Float32Array
}


@Component({
  selector: 'app-new-tipo-promocion',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './new-tipo-promocion.component.html',
  styleUrl: './new-tipo-promocion.component.css'
})


export class NewTipoPromocionComponent {
  
  public tipoPromocionForm = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    modificador: [null]
  })

  
  constructor( private fb: FormBuilder,
               private promocionService: PromocionesService,
               private router: Router){}


  irAtras(){
    this.router.navigate(['/promociones']);
  }

  newTipoPromocion(){

    console.log(this.tipoPromocionForm.value);
    

    if (!this.tipoPromocionForm.valid) {
      console.warn('errores formulario');
    }
    else{
      this.promocionService.postTipoPromocion(this.tipoPromocionForm.value)
      .subscribe( res =>{
        console.log(res);
        this.irAtras();
      })
    }
  }

}
