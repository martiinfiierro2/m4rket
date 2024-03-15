import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UbicacionesService } from '../../services/ubicaciones.service';

export interface Ubicacion{
  referencia: string,
  posicion: number
}

@Component({
  selector: 'app-edit-ubicacion',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './edit-ubicacion.component.html',
  styleUrl: './edit-ubicacion.component.css'
})
export class EditUbicacionComponent {
  constructor(private fb: FormBuilder,
    private router: Router,
    private ubicacionesService: UbicacionesService){}
  
    private idUbi: string = "";

    public ubicacionEditar: Ubicacion | undefined;
    public ubiForm = this.fb.group({
      referencia: ['', Validators.required],
      posicion: ['', Validators.required]
    })

    ngOnInit(): void {
      this.getUbicaionEditar();
    }

    editarUbi(){
      this.ubicacionesService.putUbicacion(this.idUbi, this.ubiForm.value).subscribe( res => {
        console.log(res);
        this.router.navigate(['/ubicaciones']);
      });
    }

    getUbicaionEditar(){
      for (let i = 4; i < window.location.search.length; i++) {
        this.idUbi = this.idUbi + window.location.search[i];
      }
   
      this.ubicacionesService.getUbicacionId(this.idUbi).subscribe( res => {
        this.ubicacionEditar = res.ubicaciones;
        console.log(this.ubicacionEditar);
      })
    }

    atras(){
      this.router.navigate(['/ubicaciones']);
    }
}
