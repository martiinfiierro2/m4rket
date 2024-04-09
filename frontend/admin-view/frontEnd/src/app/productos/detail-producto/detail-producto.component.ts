import { Component } from '@angular/core';
import { Producto } from '../../pages/productos/productos.component';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import * as echarts from 'echarts';


@Component({
  selector: 'app-detail-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-producto.component.html',
  styleUrl: './detail-producto.component.css'
})
export class DetailProductoComponent {

  public productoMostrar: Producto;

  //variables para mostrar foto
  tokenUsuario = localStorage.getItem('tokenUsuario');
  urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';

  constructor( private productoService: ProductosService){}

  ngOnInit(){
    this.obtenerProducto();
  }

  obtenerProducto(){

    let idProd = '';
    for (let i = 4; i < window.location.search.length; i++) {
      idProd = idProd + window.location.search[i];
    }

  
    this.productoService.getProductoId(idProd)
      .subscribe( res =>{
        this.productoMostrar = res.productos;
        this.cargaGrafico();
      });


  }


  //cambio de color según el stock
  colorStock(disponibilidad: number): any{
    if (disponibilidad < 50) {
      return { 'color': 'red' };
    } else if (disponibilidad >= 50 && disponibilidad <= 100) {
      return { 'color': 'yellow'  };
    } else {
      return { 'color': 'green'  };
    }
  }

  //Gráfico circular
  cargaGrafico(){

    var dom = document.getElementById('contenedorGrafico');

    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });

    var app = {};
    var option;

    let datosMostrar;

    console.log(this.productoMostrar);
    

    if (this.productoMostrar.valor_energetico != null) {
      datosMostrar = [
        { value: this.productoMostrar.valor_energetico, name: 'Valor energetico' },
        { value: this.productoMostrar.grasas, name: 'Grasas' },
        { value: this.productoMostrar.grasas_saturadas, name: 'Grasas saturadas' },
        { value: this.productoMostrar.hidratos_carbono, name: 'Hidratos de carbono' },
        { value: this.productoMostrar.azucares, name: 'Azúcares' },
        { value: this.productoMostrar.fibra, name: 'Fibra' },
        { value: this.productoMostrar.proteina, name: 'Proteina' },
        { value: this.productoMostrar.sal, name: 'Sal' },
      ]
      console.log(datosMostrar);
    }

    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        left: '20%',
        top: 'center',
        orient: 'vertical'
      },
      series: [
        {
          name: 'Valores nutricionales',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'left'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: datosMostrar
        }
      ]
    };


    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }

    //window.addEventListener('resize', myChart.resize);

  }
  

}
