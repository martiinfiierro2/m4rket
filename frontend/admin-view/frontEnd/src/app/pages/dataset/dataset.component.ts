import { Component, ViewChild } from '@angular/core';
import { Producto } from "../productos/productos.component";
import { CommonModule } from '@angular/common';
import { ProductosService } from "../../services/productos.service";
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';



pdfMake.vfs = pdfFonts.pdfMake.vfs;




@Component({
  selector: 'app-dataset',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dataset.component.html',
  styleUrl: './dataset.component.css'
})
export class DatasetComponent {

  public productos: Producto[] = [];
  public urlFotoProducto = environment.base_url + '/uploadsDataset/fotoproducto/';

  public imagen: any;


  constructor( private productoService: ProductosService,
              ){}

  ngOnInit(): void{
    this.getProductos();
  }

  getProductos(){
    this.productoService.getAllProductosDataset()
      .subscribe( res =>{
        this.productos = res.productos;
      })
  }

  redirigirProducto(idProd: string){
    
    window.location.href = '/dataset-producto?id=' + idProd;
    
  }

  formatoDescarga( event: any){
  
    if (event.target.value == 'pdf') {
      this.descargarPdf();
      event.target.value = 'default';
    }
    if (event.target.value == 'xlsx') {
      this.descargaXLSX();
      event.target.value = 'default';
    }
  }


  //DESCARGA PDF
  descargarPdf(){
    const content = [];      

    this.productos.forEach( producto => {
      const productoContent = [
        //{ image: this.urlFotoProducto + producto.foto},
        { text: `${producto.nombre}\n`, style: 'header'},
        { text: `Marca: ${producto.marca}\n` },
        { text: `Precio: ${producto.precio}\n` },
        { text: `Precio/kg: ${producto.precio_kg}\n` },
        { text: `Categoria: ${producto.categoria}\n` },
        { text: `Ingredientes: ${producto.ingredientes}\n` },
        {text: 'Valores nutricionales', style: 'subheader'},
        {
          ul:[
            `Valor energético: ${producto.valor_energetico}`,
            `Grasas: ${producto.grasas}`,
            `Grasas saturadas: ${producto.grasas_saturadas}`,
            `Hidratos de carbono: ${producto.hidratos_carbono}`,
            `Azúcares: ${producto.azucares}`,
            `Fibra: ${producto.fibra}`,
            `Proteina: ${producto.proteina}`,
            `Sal: ${producto.sal}`,
          ]
        },
        { text: '\n\n', pageBreak: 'after'}
      ];
      content.push(productoContent);

    });

    
    const documentDefinition = {
      content,
      styles: { header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] }, subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] } },
    };

    //pdfMake.createPdf(documentDefinition).download('productos.pdf');
    pdfMake.createPdf(documentDefinition).open();
  }



  //DESCARGA CSV
  descargaXLSX(){

    let data: any[] = [];

    data = this.productos.map( producto => ({
      ProductosServiceroducto: producto.nombre, 
      Marca: producto.marca,
      Precio: producto.precio,
      Precio_kg: producto.precio_kg,
      Categoria: producto.categoria,
      Ingredientes: producto.ingredientes,
      Valor_energetico: producto.valor_energetico,
      Grasas: producto.grasas,
      Grasas_saturadas: producto.grasas_saturadas,
      Hidratos_carbono: producto.hidratos_carbono,
      Azucares: producto.azucares,
      Fibra: producto.fibra,
      Proteina: producto.proteina,
      Sal: producto.sal
    }));
  
    console.log(data);
    

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    
    XLSX.writeFile(wb, 'Productos.xlsx');
  }
  



}



