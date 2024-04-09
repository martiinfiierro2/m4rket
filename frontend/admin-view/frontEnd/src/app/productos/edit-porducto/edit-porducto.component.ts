import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductosService } from "../../services/productos.service";
import { Producto } from '../../pages/productos/productos.component';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-edit-porducto',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './edit-porducto.component.html',
  styleUrl: './edit-porducto.component.css'
})
export class EditPorductoComponent {

  productoForm: FormGroup; 



  tokenUsuario = sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario');
  urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';
  fotoProductoEditar;
  iconoBorrado = false;
  fotoBorrada = false;
  public srcImagen;
  public foto: File | undefined;
  


  productoEditar: Producto = null;
  private idProd: string = '';

  constructor( private router: Router,
               private fb: FormBuilder,
               private productoService: ProductosService){}


  ngOnInit(): void{
    this.getProductoEditar();
  }

  atras(){
    this.router.navigate(['/productos']);
  }

  borrarFoto(){
    this.fotoBorrada = true;
  }

  cambioImagen( evento: any ): void{
    
    if (evento.target.files.length != 0) {
      let reader = new FileReader();

      this.foto = evento.target.files[0];
      reader.readAsDataURL(evento.target.files[0]);
      reader.onload = (event) =>{
        this.srcImagen = event.target!.result!.toString();
        this.fotoBorrada = false;
      }
    }
  }


  getProductoEditar(){
    for (let i = 4; i < window.location.search.length; i++) {
      this.idProd = this.idProd + window.location.search[i];
    }

    this.productoService.getProductoId(this.idProd).
      subscribe ( res => {
        this.productoEditar = res.productos;

        this.fotoProductoEditar = res.productos.foto;
        this.srcImagen = this.urlFotoProducto + this.fotoProductoEditar + '?token=' +this.tokenUsuario

        //Carga el formulario con los valores
        this.productoForm = this.fb.group({
          nombre: [ this.productoEditar.nombre, [Validators.required]],
          marca: [ this.productoEditar.marca, [Validators.required]],
          precio: [ this.productoEditar.precio, [Validators.required]],
          precio_kg: [this.productoEditar.precio_kg],
          stock: [ this.productoEditar.stock, [Validators.required]],
          ingredientes: [this.productoEditar.ingredientes],
          categoria: [this.productoEditar.categoria, [Validators.required]],
          valor_energetico: [this.productoEditar.valor_energetico],
          grasas: [this.productoEditar.grasas],
          grasas_saturadas: [this.productoEditar.grasas_saturadas],
          hidratos_carbono: [this.productoEditar.hidratos_carbono],
          azucares: [this.productoEditar.azucares],
          fibra: [this.productoEditar.fibra],
          proteina: [this.productoEditar.proteina],
          sal: [this.productoEditar.sal],
          foto: ['']  
        });    
    });
  }

  editProducto(){
    /*
    if (this.productoForm.value['foto'] == '') {
      this.productoForm.value['foto'] = this.productoEditar.foto;
    }
    */
    
    console.log(this.productoForm.value);

    this.productoService.putProducto(this.productoForm.value, this.idProd)
    .subscribe( res => {
        //subida de la foto
        this.productoService.postFotoProducto(this.foto!, this.idProd)
          .subscribe( res =>{
            this.atras();
          })
    })
    
  }

  

}
