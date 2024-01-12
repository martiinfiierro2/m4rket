import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PromocionesService } from '../../services/promociones.service';
import { tipoPromocion } from '../new-tipo-promocion/new-tipo-promocion.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


export interface EditPromo{
  nombre: string,
  fecha_ini: Date,
  fecha_fin: Date,
  id_tipoPromo: number
}


@Component({
  selector: 'app-edit-promocion',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './edit-promocion.component.html',
  styleUrl: './edit-promocion.component.css'
})

export class EditPromocionComponent {

  constructor( private fb: FormBuilder,
               private router: Router,
               private promocionService: PromocionesService){}


  private idPromo: string = '';
  public promocionEditar: EditPromo | undefined;

  public tipoPromos: tipoPromocion[] = [];


  ngOnInit(): void{
    this.getProductoEditar();
    this.getTipoPromos();
  }

  public promoForm = this.fb.group({
    nombre: ['', Validators.required],
    fecha_ini: ['', Validators.required],
    fecha_fin: ['', Validators.required],
    id_tipoPromo: ['', Validators.required]
  })

  getProductoEditar(){
    for (let i = 4; i < window.location.search.length; i++) {
      this.idPromo = this.idPromo + window.location.search[i];
    }
 
    this.promocionService.getPromocionId(this.idPromo).
    subscribe ( res => {
      this.promocionEditar = res.promociones;    
    });
  }

  editarPromo(){
    this.promocionService.editPromocion(this.idPromo, this.promoForm.value)
      .subscribe( res => {
        console.log(res);
        this.router.navigate(['/promociones']);
      })
    
    
    
  }


  getTipoPromos(){
    this.promocionService.getAllTipoPromociones()
      .subscribe( res => {
        this.tipoPromos = res.tipopromociones;
      })

      console.log();
      
  }

  atras(){
    this.router.navigate(['/promociones']);
  }
}
