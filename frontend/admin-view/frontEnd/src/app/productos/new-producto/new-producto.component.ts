import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductosService } from "../../services/productos.service";



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
            this.atras();
          })
      })
    }
  }

}
