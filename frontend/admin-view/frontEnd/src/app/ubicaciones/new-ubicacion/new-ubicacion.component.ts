import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UbicacionesService } from '../../services/ubicaciones.service';
import { UbicacionesComponent } from '../../pages/ubicaciones/ubicaciones.component';

export interface Ubicacion{
  referencia: string,
  posicion: number
}

@Component({
  selector: 'app-new-ubicacion',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './new-ubicacion.component.html',
  styleUrl: './new-ubicacion.component.css'
})

export class NewUbicacionComponent {
  constructor(private fb: FormBuilder,
    private router: Router,
    private ubicacionesService: UbicacionesService,
    private ubicacionesComponent: UbicacionesComponent
    ){}
  
    public ubicacion: Ubicacion | undefined;
    public ubiForm = this.fb.group({
      referencia: ['', Validators.required],
      posicion: ['', Validators.required]
    })

    anyadirUbi(){
      console.log(this.ubiForm.value);
      this.ubicacionesService.postUbicacion(this.ubiForm.value).subscribe( res => {
        console.log(res);
      });
      this.atras();
    }

    atras(){
      //this.router.navigate(['/ubicaciones']);
      this.ubicacionesComponent.cerrarModal();
    }

}
