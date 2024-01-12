import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PromocionesService } from '../../services/promociones.service';
import { tipoPromocion } from '../new-tipo-promocion/new-tipo-promocion.component';


export interface NewPromocion{
  id: number,
  nombre: number,
  fecha_ini: Date,
  fecha_fin: Date
}


@Component({
  selector: 'app-new-promocion',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './new-promocion.component.html',
  styleUrl: './new-promocion.component.css'
})
export class NewPromocionComponent {

  public promocionForm = this.fb.group({
    nombre: ['', [Validators.required]],
    fecha_ini: ['', [Validators.required]],
    fecha_fin: ['', [Validators.required]],
    id_tipoPromo: ['', [Validators.required]]
  });


  public tipoPromociones: tipoPromocion[] = [];
  

  ngOnInit(): void{
    this.getTipoPromociones();
  }

  
  constructor (private router: Router,
               private fb: FormBuilder,
               private promocionService: PromocionesService){}



  getTipoPromociones(){
    this.promocionService.getAllTipoPromociones()
      .subscribe( res => {
        this.tipoPromociones = res.tipopromociones;
      });
  }

  newPromocion(){
    this.promocionService.postPromociones(this.promocionForm.value)
      .subscribe( res => {
        console.log(res);
        this.router.navigate(['/promociones']);
      });
  }
}
