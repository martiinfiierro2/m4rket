import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductosService } from "../../services/productos.service";
import Swal from 'sweetalert2'


@Component({
  selector: 'app-new-producto',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './new-producto.component.html',
  styleUrl: './new-producto.component.css'
})
export class NewProductoComponent {

  public productoForm = this.fb.group({
    nombre: ['', [Validators.required]],
    marca: ['', [Validators.required]],
    precio: ['', [Validators.required]],
    precio_kg: [null],
    stock: ['', [Validators.required]],
    ingredientes: [''],
    categoria: ['', [Validators.required]],
    valor_energetico: [null],
    grasas: [null],
    grasas_saturadas: [null],
    hidratos_carbono: [null],
    azucares: [null],
    fibra: [null],
    proteina: [null],
    sal: [null],
    foto: ['', [Validators.required]]  
  });

  public srcImagen: string = '';
  public foto: File | undefined;

  //Campos formularios
  infoBasicaDesplegada = false;
  valoresNutDesplegados = false;
  imagenProducto = false;


  constructor( private router: Router,
                private fb: FormBuilder,
                private productoService: ProductosService){}


  ngOnInit(): void{
    this.productoForm.get('valor_energetico')!.setValue(null);
  }

  cambioImagen( evento: any ): void{
    
    if (evento.target.files.length != 0) {
      let reader = new FileReader();

      this.foto = evento.target.files[0];
      reader.readAsDataURL(evento.target.files[0]);
      reader.onload = (event) =>{
        this.srcImagen = event.target!.result!.toString();
        document.getElementById('previewImagen')!.style.display = 'block';
        console.log(this.foto);
      }
    }
  }

  atras(){
    this.router.navigate(['/productos']);
  }

  redirigirProducto(idProd){
    let urlProducto = '/productos/detailProducto?id=' + idProd;
    this.router.navigateByUrl(urlProducto);
  }

  modalPostCreacion(idProd){
    Swal.fire({
      title: 'Creado correctamente!',
      icon: 'success',
      confirmButtonText: 'Ver producto',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      cancelButtonText: 'Continuar',
      cancelButtonColor: "#3085d6",

    }).then((result) =>{
      if (result.isConfirmed) {
        this.redirigirProducto(idProd);
      }
      else{
        this.atras();
      }
    })
  }

  desplegarCampo( campo ){

    let icono;

    switch (campo) {
      case 'infoBasica':
        icono = document.querySelector('#iconoDesplegableInfo');
        if (this.infoBasicaDesplegada) {
          this.infoBasicaDesplegada = false;
          icono.classList.remove("fa-angle-up");
          icono.classList.add("fa-angle-down");
        }
        else{
          this.infoBasicaDesplegada = true;
          icono.classList.remove("fa-angle-down");
          icono.classList.add("fa-angle-up");
        }
        
        break;
      case 'valoresNut':
        icono = document.querySelector('#iconoDesplegableNutri');
        if (this.valoresNutDesplegados) {
          this.valoresNutDesplegados = false;
          icono.classList.remove("fa-angle-up");
          icono.classList.add("fa-angle-down");
        }
        else{
          this.valoresNutDesplegados = true;
          icono.classList.remove("fa-angle-down");
          icono.classList.add("fa-angle-up");
        }

        break;
      case 'imagenProducto':
        icono = document.querySelector('#iconoDesplegableImagen');
        if (!this.imagenProducto) {
          this.imagenProducto = true;
          icono.classList.remove("fa-angle-down");
          icono.classList.add("fa-angle-up");
        }
      
        break;
    }
  }

  newProducto(){

    let idProducto = '';

    if (!this.productoForm.valid) {
      console.warn('errores en el formulario');
    }
    else{  

      this.productoService.postProducto(this.productoForm.value)
      .subscribe( res => {
        console.log(res);
        idProducto = res.producto.id;
        //subida de la foto
        this.productoService.postFotoProducto(this.foto!, idProducto)
          .subscribe( res =>{
            console.log('Foto añadida: ', res);
            this.modalPostCreacion(idProducto);
          })
      })
    }
  }

}
