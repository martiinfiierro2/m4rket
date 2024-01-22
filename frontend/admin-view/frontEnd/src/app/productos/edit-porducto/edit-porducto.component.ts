import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductosService } from "../../services/productos.service";
import { Producto } from '../../pages/productos/productos.component';




@Component({
  selector: 'app-edit-porducto',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './edit-porducto.component.html',
  styleUrl: './edit-porducto.component.css'
})
export class EditPorductoComponent {


  productoEditar: Producto | undefined;
  private idProd: string = '';

  constructor( private router: Router,
               private fb: FormBuilder,
               private productoService: ProductosService){}


  public productoForm = this.fb.group({
    nombre: ['', [Validators.required]],
    marca: ['', [Validators.required]],
    precio: ['', [Validators.required]],
    precio_kg: [''],
    stock: ['', [Validators.required]],
    ingredientes: [''],
    categoria: ['', [Validators.required]],
    valor_energ: [''],
    grasas: [''],
    saturadas: [''],
    hidratos: [''],
    azucares: [''],
    fibra: [''],
    proteinas: [''],
    sal: [''],
    foto: ['']  
  });

  ngOnInit(): void{
    this.getProductoEditar();
  }

  atras(){
    this.router.navigate(['/productos']);
  }

  getProductoEditar(){
    for (let i = 4; i < window.location.search.length; i++) {
      this.idProd = this.idProd + window.location.search[i];
    }

    this.productoService.getProductoId(this.idProd).
    subscribe ( res => {
      this.productoEditar = res.productos;    
    });
  }

  editProducto(){
    console.log(this.productoForm);

    this.productoService.putProducto(this.productoForm.value, this.idProd)
    .subscribe( res => {
      console.log(res);
      this.atras();
    })
    
  }

}
