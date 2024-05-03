import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DomElementSchemaRegistry } from '@angular/compiler';
import { json } from 'express';
import { forkJoin } from 'rxjs';
import { Component, ViewChild } from '@angular/core';
import { ProductosService } from '../services/productos.service';
import { DrawerComponent } from '../components/drawer/drawer.component';
import { environment } from '../environments/environment';
import { getLocaleFirstDayOfWeek } from '@angular/common';
import { EstadisticasService } from '../services/estadisticas.service';
import { UbicacionesService } from '../services/ubicaciones.service';

export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  stock: number;
  valor_energetico: Float32Array;
  grasas: Float32Array;
  grasas_saturadas: Float32Array;
  hidratos_carbono: Float32Array;
  azucares: Float32Array;
  fibra: Float32Array;
  proteina: Float32Array;
  sal: Float32Array;
  precio_kg: Float32Array;
  ingerdientes: string;
  foto: string;
  precio: Float32Array;
  //Ubicacions: Ubicaciones[]
  //Promocions: Promociones[]

  cantidad: number;
}

export class ModeloService {
  constructor() {}

  // Luces
  setupLights(scene: THREE.Scene, prefersDarkMode: boolean) {
    let topLightIntensity = prefersDarkMode ? 2 : 1.5;
    let ambientLightIntensity = prefersDarkMode ? 0.5 : 30;

    const topLight = new THREE.DirectionalLight(0xffffff, topLightIntensity); // (color, intensity)
    topLight.position.set(200, 200, 200); //top-left-ish
    const topLight2 = new THREE.DirectionalLight(0xffffff, topLightIntensity); // (color, intensity)
    topLight2.position.set(200, 200, -200); //top-left-ish
    const topLight3 = new THREE.DirectionalLight(0xffffff, topLightIntensity); // (color, intensity)
    topLight3.position.set(-200, 200, 200); //top-left-ish
    topLight.castShadow = true;

    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      ambientLightIntensity
    ); // (color, intensity)

    if (prefersDarkMode) {
      scene.add(ambientLight);
    }
    scene.add(topLight);
    scene.add(topLight2);
    scene.add(topLight3);
  }

  cargarCasters(
    scene: THREE.Scene,
    A1c: THREE.Object3D[],
    A2c: THREE.Object3D[],
    A3c: THREE.Object3D[],
    A4c: THREE.Object3D[],
    A5c: THREE.Object3D[],
    A6c: THREE.Object3D[],
    A7c: THREE.Object3D[],
    A8c: THREE.Object3D[],
    A9c: THREE.Object3D[],
    A10c: THREE.Object3D[],
    A11c: THREE.Object3D[],
    A12c: THREE.Object3D[],
    A13c: THREE.Object3D[],
    A14c: THREE.Object3D[],
    A15c: THREE.Object3D[],
    self: any,
    camera: THREE.PerspectiveCamera,
    imagenescarrito: Producto[]
  ) {
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ visible: false });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-8.1, 22, 22.6);
    cube.scale.set(2.75, 2.75, 2.75);
    //!A1c
    for (let i = 0; i <= 9; i++) {
      A1c[i] = cube.clone();
      A1c[i].position.x =
        i === 0
          ? -8
          : i % 2
          ? A1c[i - 1].position.x + 4
          : A1c[i - 1].position.x + 3;
      scene.add(A1c[i]);
    }
    //!A2c
    for (let i = 0; i <= 9; i++) {
      A2c[i] = cube.clone();
      A2c[i].position.set(0, 22, 26.4);
      A2c[i].position.x =
        i === 0
          ? -8
          : i % 2
          ? A2c[i - 1].position.x + 4
          : A2c[i - 1].position.x + 3;
      scene.add(A2c[i]);
    }

    //!A3c
    for (let i = 0; i <= 5; i++) {
      A3c[i] = cube.clone();

      A3c[i].position.z = 12.1;
      A3c[i].position.x =
        i === 0
          ? -14.6
          : i % 2 === 0
          ? A3c[i - 1].position.x + 3.5
          : A3c[i - 1].position.x + 4;
      scene.add(A3c[i]);
    }
    //!A4c
    for (let i = 0; i <= 5; i++) {
      A4c[i] = cube.clone();
      A4c[i].position.z = 9.5;
      A4c[i].position.x =
        i === 0
          ? -14.6
          : i % 2 === 0
          ? A4c[i - 1].position.x + 3.5
          : A4c[i - 1].position.x + 4;
      scene.add(A4c[i]);
    }

    //!A5c
    for (let i = 0; i <= 5; i++) {
      A5c[i] = cube.clone();
      A5c[i].position.x =
        i === 0
          ? -14.6
          : i % 2 === 0
          ? A5c[i - 1].position.x + 3.5
          : A5c[i - 1].position.x + 4;
      A5c[i].position.z = 1.5;
      scene.add(A5c[i]);
    }
    //!A6c
    for (let i = 0; i <= 5; i++) {
      A6c[i] = cube.clone();
      A6c[i].position.x =
        i === 0
          ? -14.6
          : i % 2 === 0
          ? A6c[i - 1].position.x + 3.5
          : A6c[i - 1].position.x + 4;
      A6c[i].position.z = -1.3;
      scene.add(A6c[i]);
    }

    //!A7c
    for (let i = 0; i <= 5; i++) {
      A7c[i] = cube.clone();
      A7c[i].position.x =
        i === 0
          ? -14.6
          : i % 2 === 0
          ? A7c[i - 1].position.x + 3.5
          : A7c[i - 1].position.x + 4;
      A7c[i].position.z = -8.8;
      scene.add(A7c[i]);
    }

    //!A8c
    for (let i = 0; i <= 5; i++) {
      A8c[i] = cube.clone();
      A8c[i].position.x =
        i === 0
          ? -14.6
          : i % 2 === 0
          ? A8c[i - 1].position.x + 3.5
          : A8c[i - 1].position.x + 4;
      A8c[i].position.z = -11.4;
      scene.add(A8c[i]);
    }
    //!A9c
    for (let i = 0; i <= 3; i++) {
      A9c[i] = cube.clone();
      A9c[i].position.x =
        i === 0
          ? 12
          : i % 2 === 0
          ? A9c[i - 1].position.x + 3.6
          : A9c[i - 1].position.x + 3.4;
      A9c[i].position.z = 6.6;
      scene.add(A9c[i]);
    }
    //!A10c
    for (let i = 0; i <= 3; i++) {
      A10c[i] = cube.clone();
      A10c[i].position.x =
        i === 0
          ? 12
          : i % 2 === 0
          ? A10c[i - 1].position.x + 3.6
          : A10c[i - 1].position.x + 3.4;
      A10c[i].position.z = 4;
      scene.add(A10c[i]);
    }
    //!A11c
    for (let i = 0; i <= 3; i++) {
      A11c[i] = cube.clone();
      A11c[i].position.x =
        i === 0
          ? 12
          : i % 2 === 0
          ? A11c[i - 1].position.x + 3.6
          : A11c[i - 1].position.x + 3.4;
      A11c[i].position.z = -4.6;
      scene.add(A11c[i]);
    }
    //!A12c
    for (let i = 0; i <= 3; i++) {
      A12c[i] = cube.clone();
      A12c[i].position.x =
        i === 0
          ? 12
          : i % 2 === 0
          ? A12c[i - 1].position.x + 3.6
          : A12c[i - 1].position.x + 3.4;
      A12c[i].position.z = -7.2;
      scene.add(A12c[i]);
    }

    //!A13c
    for (let i = 0; i <= 3; i++) {
      A13c[i] = cube.clone();
      A13c[i].position.z = i === 0 ? 4.5 : A13c[i - 1].position.z - 3.1;
      A13c[i].position.x = 29.4;
      A13c[i].position.y = 26;
      scene.add(A13c[i]);
    }

    //!A14c
    for (let i = 0; i <= 5; i++) {
      A14c[i] = cube.clone();
      A14c[i].position.x =
        i === 0
          ? 29
          : i % 2 === 0
          ? A14c[i - 1].position.x - 3.6
          : A14c[i - 1].position.x - 3.7;
      A14c[i].position.z = -22.5;
      A14c[i].position.y = 26;
      scene.add(A14c[i]);
    }
    //!A15c
    for (let i = 0; i <= 2; i++) {
      A15c[i] = cube.clone();
      A15c[i].position.x = i === 0 ? -8.5 : A15c[i - 1].position.x + 6.5;
      A15c[i].position.z = -22.8;
      A15c[i].position.y = 24.2;
      scene.add(A15c[i]);
    }
  }

  cargarPointers(
    scene: THREE.Scene,
    A1: THREE.Object3D[],
    A2: THREE.Object3D[],
    A3: THREE.Object3D[],
    A4: THREE.Object3D[],
    A5: THREE.Object3D[],
    A6: THREE.Object3D[],
    A7: THREE.Object3D[],
    A8: THREE.Object3D[],
    A9: THREE.Object3D[],
    A10: THREE.Object3D[],
    A11: THREE.Object3D[],
    A12: THREE.Object3D[],
    A13: THREE.Object3D[],
    A14: THREE.Object3D[],
    A15: THREE.Object3D[],
    self: any,
    camera: THREE.PerspectiveCamera,
    imagenescarrito: Producto[],
    primeravez: boolean,
    idsaux: number[],
    ref2: string[],
    pos2: number[],
    comprados: boolean[]
  ) {
    const width = 1;
    const height = 1;
    const depth = 0.1; // Profundidad del objeto 3D
    const borderRadius = 0.1; // Radio de los bordes redondeados
    let tokenUsuario =
      sessionStorage.getItem('tokenUsuario') ||
      localStorage.getItem('tokenUsuario');
    let urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';
    let texturePath = '../../assets/images/4.jpg';
    let plano3D = this.crearPlano3D(
      width,
      height,
      depth,
      borderRadius,
      texturePath
    );
    const loader = new GLTFLoader();
    loader.load(
      `assets/pointer/pointer.glb`,
      (glb) => {
        plano3D.position.set(-8.1, 21.3, 22.6);
        plano3D.scale.set(2.5, 2.5, 2.5);
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshBasicMaterial({ visible: false });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-8.1, 21.3, 22.6);
        if (primeravez == false) {
          for (let i = 0; i < A1.length; i++) {
            scene.remove(A1[i]);
          }
          for (let i = 0; i < A2.length; i++) {
            scene.remove(A2[i]);
          }
          for (let i = 0; i < A3.length; i++) {
            scene.remove(A3[i]);
          }
          for (let i = 0; i < A4.length; i++) {
            scene.remove(A4[i]);
          }
          for (let i = 0; i < A5.length; i++) {
            scene.remove(A5[i]);
          }
          for (let i = 0; i < A6.length; i++) {
            scene.remove(A6[i]);
          }
          for (let i = 0; i < A7.length; i++) {
            scene.remove(A7[i]);
          }
          for (let i = 0; i < A8.length; i++) {
            scene.remove(A8[i]);
          }
          for (let i = 0; i < A9.length; i++) {
            scene.remove(A9[i]);
          }
          for (let i = 0; i < A10.length; i++) {
            scene.remove(A10[i]);
          }
          for (let i = 0; i < A11.length; i++) {
            scene.remove(A11[i]);
          }
          for (let i = 0; i < A12.length; i++) {
            scene.remove(A12[i]);
          }
          for (let i = 0; i < A13.length; i++) {
            scene.remove(A13[i]);
          }
          for (let i = 0; i < A14.length; i++) {
            scene.remove(A14[i]);
          }
          for (let i = 0; i < A15.length; i++) {
            scene.remove(A15[i]);
          }
        }
        console.log(idsaux);
        console.log(ref2);
        console.log(pos2);

        let compradopos: number[] = new Array(15).fill(0);

        //! A1
        for (let i = 0; i <= 9; i++) {
          for (let k = 0; k < idsaux.length; k++) {
            for (let h = 0; h < imagenescarrito.length; h++) {
              if (
                idsaux[k].toString().toString() == imagenescarrito[h].id &&
                ref2[k] == 'A1' &&
                pos2[k] == i
              ) {
                texturePath =
                  urlFotoProducto +
                  imagenescarrito[h].foto +
                  '?token=' +
                  tokenUsuario;
                compradopos[0] = k;
              }
            }
          }

          if (comprados[compradopos[0]] == false) {
            A1[i] = this.crearPlano3D(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          } else {
            A1[i] = this.crearPlano3Dopacidad(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          }

          A1[i].position.set(-8.1, 21.3, 22.6);
          A1[i].scale.set(2.5, 2.5, 2.5);
          A1[i].position.x =
            i === 0
              ? -9.3
              : i % 2
              ? A1[i - 1].position.x + 4
              : A1[i - 1].position.x + 3;
          for (let j = 0; j < pos2.length; j++) {
            if (ref2[j] == 'A1' && pos2[j] == i) {
              scene.add(A1[i]);
            }
          }
        }

        //! A2
        for (let i = 0; i <= 9; i++) {
          for (let k = 0; k < idsaux.length; k++) {
            for (let h = 0; h < imagenescarrito.length; h++) {
              if (
                idsaux[k].toString().toString() == imagenescarrito[h].id &&
                ref2[k] == 'A2' &&
                pos2[k] == i
              ) {
                texturePath =
                  urlFotoProducto +
                  imagenescarrito[h].foto +
                  '?token=' +
                  tokenUsuario;
                compradopos[1] = k;
              }
            }
          }

          if (comprados[compradopos[1]] == false) {
            A2[i] = this.crearPlano3D(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          } else {
            A2[i] = this.crearPlano3Dopacidad(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          }

          A2[i].position.set(-8.1, 21.3, 22.6);
          A2[i].scale.set(2.5, 2.5, 2.5);

          A2[i].position.z = 26.4;
          A2[i].position.x =
            i === 0
              ? -9.3
              : i % 2
              ? A2[i - 1].position.x + 4
              : A2[i - 1].position.x + 3;
          for (let j = 0; j < pos2.length; j++) {
            if (ref2[j] == 'A2' && pos2[j] === i) {
              scene.add(A2[i]);
            }
          }
        }
        //! A3
        for (let i = 0; i <= 5; i++) {
          for (let k = 0; k < idsaux.length; k++) {
            for (let h = 0; h < imagenescarrito.length; h++) {
              if (
                idsaux[k].toString().toString() == imagenescarrito[h].id &&
                ref2[k] == 'A3' &&
                pos2[k] == i
              ) {
                texturePath =
                  urlFotoProducto +
                  imagenescarrito[h].foto +
                  '?token=' +
                  tokenUsuario;
                compradopos[2] = k;
              }
            }
          }

          if (comprados[compradopos[2]] == false) {
            A3[i] = this.crearPlano3D(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          } else {
            A3[i] = this.crearPlano3Dopacidad(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          }

          A3[i].position.set(-8.1, 21.3, 22.6);
          A3[i].scale.set(2.5, 2.5, 2.5);

          A3[i].position.z = 12.1;
          A3[i].position.x =
            i === 0
              ? -16.2
              : i % 2 === 0
              ? A3[i - 1].position.x + 3.5
              : A3[i - 1].position.x + 4;
          for (let j = 0; j < pos2.length; j++) {
            if (ref2[j] == 'A3' && pos2[j] == i) {
              scene.add(A3[i]);
            }
          }
        }

        //! A4
        for (let i = 0; i <= 5; i++) {
          for (let k = 0; k < idsaux.length; k++) {
            for (let h = 0; h < imagenescarrito.length; h++) {
              if (
                idsaux[k].toString().toString() == imagenescarrito[h].id &&
                ref2[k] == 'A4' &&
                pos2[k] == i
              ) {
                texturePath =
                  urlFotoProducto +
                  imagenescarrito[h].foto +
                  '?token=' +
                  tokenUsuario;
                compradopos[3] = k;
              }
            }
          }

          if (comprados[compradopos[3]] == false) {
            A4[i] = this.crearPlano3D(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          } else {
            A4[i] = this.crearPlano3Dopacidad(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          }
          A4[i].position.set(-8.1, 21.3, 22.6);
          A4[i].scale.set(2.5, 2.5, 2.5);
          A4[i].position.x =
            i === 0
              ? -16.2
              : i % 2 === 0
              ? A4[i - 1].position.x + 3.5
              : A4[i - 1].position.x + 4;
          A4[i].position.z = 9.7;
          for (let j = 0; j < pos2.length; j++) {
            if (ref2[j] == 'A4' && pos2[j] == i) {
              scene.add(A4[i]);
            }
          }
        }
        //! A5
        for (let i = 0; i <= 5; i++) {
          for (let k = 0; k < idsaux.length; k++) {
            for (let h = 0; h < imagenescarrito.length; h++) {
              if (
                idsaux[k].toString().toString() == imagenescarrito[h].id &&
                ref2[k] == 'A5' &&
                pos2[k] == i
              ) {
                texturePath =
                  urlFotoProducto +
                  imagenescarrito[h].foto +
                  '?token=' +
                  tokenUsuario;
                compradopos[4] = k;
              }
            }
          }

          if (comprados[compradopos[4]] == false) {
            A5[i] = this.crearPlano3D(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          } else {
            A5[i] = this.crearPlano3Dopacidad(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          }

          A5[i].position.set(-8.1, 21.3, 22.6);
          A5[i].scale.set(2.5, 2.5, 2.5);
          A5[i].position.x =
            i === 0
              ? -16.2
              : i % 2 === 0
              ? A5[i - 1].position.x + 3.5
              : A5[i - 1].position.x + 4;
          A5[i].position.z = 1.3;
          for (let j = 0; j < pos2.length; j++) {
            if (ref2[j] == 'A5' && pos2[j] == i) {
              scene.add(A5[i]);
            }
          }
        }

        //! A6
        for (let i = 0; i <= 5; i++) {
          for (let k = 0; k < idsaux.length; k++) {
            for (let h = 0; h < imagenescarrito.length; h++) {
              if (
                idsaux[k].toString().toString() == imagenescarrito[h].id &&
                ref2[k] == 'A6' &&
                pos2[k] == i
              ) {
                texturePath =
                  urlFotoProducto +
                  imagenescarrito[h].foto +
                  '?token=' +
                  tokenUsuario;
                compradopos[5] = k;
              }
            }
          }

          if (comprados[compradopos[5]] == false) {
            A6[i] = this.crearPlano3D(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          } else {
            A6[i] = this.crearPlano3Dopacidad(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          }

          A6[i].position.set(-8.1, 21.3, 22.6);
          A6[i].scale.set(2.5, 2.5, 2.5);
          A6[i].position.x =
            i === 0
              ? -16.2
              : i % 2 === 0
              ? A6[i - 1].position.x + 3.5
              : A6[i - 1].position.x + 4;
          A6[i].position.z = -0.5;
          for (let j = 0; j < pos2.length; j++) {
            if (ref2[j] == 'A6' && pos2[j] == i) {
              scene.add(A6[i]);
            }
          }
        }

        //! A7

        for (let i = 0; i <= 5; i++) {
          for (let k = 0; k < idsaux.length; k++) {
            for (let h = 0; h < imagenescarrito.length; h++) {
              if (
                idsaux[k].toString().toString() == imagenescarrito[h].id &&
                ref2[k] == 'A7' &&
                pos2[k] == i
              ) {
                texturePath =
                  urlFotoProducto +
                  imagenescarrito[h].foto +
                  '?token=' +
                  tokenUsuario;
                  compradopos[6]=k;
                  
              }
            }
          }

          if(comprados[compradopos[6]]==false){
            A7[i] = this.crearPlano3D(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );

          }else{
            A7[i] = this.crearPlano3Dopacidad(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          }

          A7[i].position.set(-8.1, 21.3, 22.6);
          A7[i].scale.set(2.5, 2.5, 2.5);
          A7[i].position.x =
            i === 0
              ? -16.2
              : i % 2 === 0
              ? A7[i - 1].position.x + 3.5
              : A7[i - 1].position.x + 4;
          A7[i].position.z = -9.1;
          for (let j = 0; j < pos2.length; j++) {
            if (ref2[j] == 'A7' && pos2[j] == i) {
              scene.add(A7[i]);
            }
          }
        }

        //! A8
        for (let i = 0; i <= 5; i++) {
          for (let k = 0; k < idsaux.length; k++) {
            for (let h = 0; h < imagenescarrito.length; h++) {
              if (
                idsaux[k].toString().toString() == imagenescarrito[h].id &&
                ref2[k] == 'A8' &&
                pos2[k] == i
              ) {
                texturePath =
                  urlFotoProducto +
                  imagenescarrito[h].foto +
                  '?token=' +
                  tokenUsuario;
                  compradopos[7]=k;
                  
              }
            }
          }

          if(comprados[compradopos[7]]==false){
            A8[i] = this.crearPlano3D(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );

          }else{
            A8[i] = this.crearPlano3Dopacidad(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          }

          A8[i].position.set(-8.1, 21.3, 22.6);
          A8[i].scale.set(2.5, 2.5, 2.5);
          A8[i].position.x =
            i === 0
              ? -16.2
              : i % 2 === 0
              ? A8[i - 1].position.x + 3.5
              : A8[i - 1].position.x + 4;
          A8[i].position.z = -11.1;
          for (let j = 0; j < pos2.length; j++) {
            if (ref2[j] == 'A8' && pos2[j] == i) {
              scene.add(A8[i]);
            }
          }
        }

        //! A9

        for (let i = 0; i <= 3; i++) {
          for (let k = 0; k < idsaux.length; k++) {
            for (let h = 0; h < imagenescarrito.length; h++) {
              if (
                idsaux[k].toString() == imagenescarrito[h].id &&
                ref2[k] == 'A9' &&
                pos2[k] == i
              ) {
                texturePath =
                  urlFotoProducto +
                  imagenescarrito[h].foto +
                  '?token=' +
                  tokenUsuario;
                  compradopos[8]=k;
                  
              }
            }
          }

          if(comprados[compradopos[8]]==false){
            A9[i] = this.crearPlano3D(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );

          }else{
            A9[i] = this.crearPlano3Dopacidad(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          }

          A9[i].position.set(-8.1, 21.3, 22.6);
          A9[i].scale.set(2.5, 2.5, 2.5);
          A9[i].position.x =
            i === 0
              ? 11.2
              : i % 2 === 0
              ? A9[i - 1].position.x + 3.6
              : A9[i - 1].position.x + 3.4;
          A9[i].position.z = 6.6;
          for (let j = 0; j < pos2.length; j++) {
            if (ref2[j] == 'A9' && pos2[j] == i) {
              scene.add(A9[i]);
            }
          }
        }

        // ! A10

        for (let i = 0; i <= 3; i++) {
          for (let k = 0; k < idsaux.length; k++) {
            for (let h = 0; h < imagenescarrito.length; h++) {
              if (
                idsaux[k].toString() == imagenescarrito[h].id &&
                ref2[k] == 'A10' &&
                pos2[k] == i
              ) {
                texturePath =
                  urlFotoProducto +
                  imagenescarrito[h].foto +
                  '?token=' +
                  tokenUsuario;
                  compradopos[9]=k;
                  
              }
            }
          }

          if(comprados[compradopos[9]]==false){
            A10[i] = this.crearPlano3D(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );

          }else{
            A10[i] = this.crearPlano3Dopacidad(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          }

          A10[i].position.set(-8.1, 21.3, 22.6);
          A10[i].scale.set(2.5, 2.5, 2.5);
          A10[i].position.x =
            i === 0
              ? 11.2
              : i % 2 === 0
              ? A10[i - 1].position.x + 3.6
              : A10[i - 1].position.x + 3.4;
          A10[i].position.z = 5.2;
          for (let j = 0; j < pos2.length; j++) {
            if (ref2[j] == 'A10' && pos2[j] == i) {
              scene.add(A10[i]);
            }
          }
        }

        //! A11
        for (let i = 0; i <= 3; i++) {
          for (let k = 0; k < idsaux.length; k++) {
            for (let h = 0; h < imagenescarrito.length; h++) {
              if (
                idsaux[k].toString() == imagenescarrito[h].id &&
                ref2[k] == 'A11' &&
                pos2[k] == i
              ) {
                texturePath =
                  urlFotoProducto +
                  imagenescarrito[h].foto +
                  '?token=' +
                  tokenUsuario;
                  compradopos[10]=k;
                  
              }
            }
          }

          if(comprados[compradopos[10]]==false){
            A11[i] = this.crearPlano3D(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );

          }else{
            A11[i] = this.crearPlano3Dopacidad(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          }

          A11[i].position.set(-8.1, 21.3, 22.6);
          A11[i].scale.set(2.5, 2.5, 2.5);
          A11[i].position.x =
            i === 0
              ? 11.2
              : i % 2 === 0
              ? A11[i - 1].position.x + 3.6
              : A11[i - 1].position.x + 3.4;
          A11[i].position.z = -5.4;
          for (let j = 0; j < pos2.length; j++) {
            if (ref2[j] == 'A11' && pos2[j] == i) {
              scene.add(A11[i]);
            }
          }
        }

        //! A12

        for (let i = 0; i <= 3; i++) {
          for (let k = 0; k < idsaux.length; k++) {
            for (let h = 0; h < imagenescarrito.length; h++) {
              if (
                idsaux[k].toString() == imagenescarrito[h].id &&
                ref2[k] == 'A12' &&
                pos2[k] == i
              ) {
                texturePath =
                  urlFotoProducto +
                  imagenescarrito[h].foto +
                  '?token=' +
                  tokenUsuario;
                  compradopos[11]=k;
                  
              }
            }
          }

          if(comprados[compradopos[11]]==false){
            A12[i] = this.crearPlano3D(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );

          }else{
            A12[i] = this.crearPlano3Dopacidad(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          }
          A12[i].position.set(-8.1, 21.3, 22.6);
          A12[i].scale.set(2.5, 2.5, 2.5);
          A12[i].position.x =
            i === 0
              ? 11.2
              : i % 2 === 0
              ? A12[i - 1].position.x + 3.6
              : A12[i - 1].position.x + 3.4;
          A12[i].position.z = -6.8;
          for (let j = 0; j < pos2.length; j++) {
            if (ref2[j] == 'A12' && pos2[j] == i) {
              scene.add(A12[i]);
            }
          }
        }
        //! A13
        for (let i = 0; i <= 3; i++) {
          for (let k = 0; k < idsaux.length; k++) {
            for (let h = 0; h < imagenescarrito.length; h++) {
              if (
                idsaux[k].toString() == imagenescarrito[h].id &&
                ref2[k] == 'A13' &&
                pos2[k] == i
              ) {
                texturePath =
                  urlFotoProducto +
                  imagenescarrito[h].foto +
                  '?token=' +
                  tokenUsuario;
                  compradopos[12]=k;
                  
              }
            }
          }

          if(comprados[compradopos[12]]==false){
            A13[i] = this.crearPlano3D(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );

          }else{
            A13[i] = this.crearPlano3Dopacidad(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          }

          A13[i].position.set(-8.1, 21.3, 22.6);
          A13[i].scale.set(2.5, 2.5, 2.5);

          A13[i].position.z = i === 0 ? 4.2 : A13[i - 1].position.z - 3.1;
          A13[i].position.x = 29.4;
          A13[i].position.y = 25.7;
          for (let j = 0; j < pos2.length; j++) {
            if (ref2[j] == 'A13' && pos2[j] == i) {
              scene.add(A13[i]);
            }
          }
        }
        //! A14
        for (let i = 0; i <= 5; i++) {
          for (let k = 0; k < idsaux.length; k++) {
            for (let h = 0; h < imagenescarrito.length; h++) {
              if (
                idsaux[k].toString() == imagenescarrito[h].id &&
                ref2[k] == 'A14' &&
                pos2[k] == i
              ) {
                texturePath =
                  urlFotoProducto +
                  imagenescarrito[h].foto +
                  '?token=' +
                  tokenUsuario;
                  compradopos[13]=k;
                  
              }
            }
          }

          if(comprados[compradopos[13]]==false){
            A14[i] = this.crearPlano3D(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );

          }else{
            A14[i] = this.crearPlano3Dopacidad(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          }


          A14[i].position.set(-8.1, 21.3, 22.6);
          A14[i].scale.set(2.5, 2.5, 2.5);
          A14[i].position.x =
            i === 0
              ? 28
              : i % 2 === 0
              ? A14[i - 1].position.x - 3.6
              : A14[i - 1].position.x - 3.7;
          A14[i].position.z = -22.5;
          A14[i].position.y = 25;
          for (let j = 0; j < pos2.length; j++) {
            if (ref2[j] == 'A14' && pos2[j] == i) {
              scene.add(A14[i]);
            }
          }
        }
        //! A15
        for (let i = 0; i <= 2; i++) {
          for (let k = 0; k < idsaux.length; k++) {
            for (let h = 0; h < imagenescarrito.length; h++) {
              if (
                idsaux[k].toString() == imagenescarrito[h].id &&
                ref2[k] == 'A15' &&
                pos2[k] == i
              ) {
                texturePath =
                  urlFotoProducto +
                  imagenescarrito[h].foto +
                  '?token=' +
                  tokenUsuario;
                  compradopos[14]=k;
                  
              }
            }
          }

          if(comprados[compradopos[14]]==false){
            A15[i] = this.crearPlano3D(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );

          }else{
            A15[i] = this.crearPlano3Dopacidad(
              width,
              height,
              depth,
              borderRadius,
              texturePath
            );
          }


          A15[i].position.set(-8.1, 21.3, 22.6);
          A15[i].scale.set(2.5, 2.5, 2.5);

          A15[i].position.x = i === 0 ? -10 : A15[i - 1].position.x + 6.5;
          A15[i].position.z = -22.8;
          A15[i].position.y = 22.5;
          for (let j = 0; j < pos2.length; j++) {
            if (ref2[j] == 'A15' && pos2[j] == i) {
              scene.add(A15[i]);
            }
          }
        }
      },

      (xhr) => {
        // Progreso de la carga
      },
      (error) => {
        console.error(error);
      }
    );
  }

  cargarMercado(scene: THREE.Scene, objToRender: string) {
    const loader = new GLTFLoader();
    loader.load(
      `assets/${objToRender}/market.glb`,
      function (glb) {
        let object = glb.scene;
        object.position.set(0, 18, -13);
        scene.add(object);
      },
      function (xhr) {
        // Función de progreso (puedes manejar el progreso de carga aquí)
      },
      function (error) {
        console.error(error);
      }
    );
  }

  configurarControles(controls: any) {
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      //RIGHT: THREE.MOUSE.PAN // Comentado según tu solicitud
    };

    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };

    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 3;
  }

  animate(
    controls: any,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    A1: THREE.Object3D[],
    A2: THREE.Object3D[],
    A3: THREE.Object3D[],
    A4: THREE.Object3D[],
    A5: THREE.Object3D[],
    A6: THREE.Object3D[],
    A7: THREE.Object3D[],
    A8: THREE.Object3D[],
    A9: THREE.Object3D[],
    A10: THREE.Object3D[],
    A11: THREE.Object3D[],
    A12: THREE.Object3D[],
    A13: THREE.Object3D[],
    A14: THREE.Object3D[],
    A15: THREE.Object3D[]
  ) {
    this.animateLoop(
      this.animate,
      controls,
      () => {
        this.updateobjects(
          A1,
          A2,
          A3,
          A4,
          A5,
          A6,
          A7,
          A8,
          A9,
          A10,
          A11,
          A12,
          A13,
          A14,
          A15,
          scene,
          camera
        );
      },
      scene,
      camera,
      renderer
    );
  }
  rotatePointers(pointers: THREE.Object3D[]) {
    // Definir la velocidad de rotación y de movimiento vertical
    let rotationSpeed = 0.005; // Puedes ajustar este valor según sea necesario
    let verticalSpeed = 0.005; // Puedes ajustar este valor según sea necesario
    let bounceScale = 0.2; // Factor de escala para reducir la amplitud del rebote

    for (let i = 0; i < pointers.length; i++) {
      // Calcula el centro del objeto
      let boundingBox = new THREE.Box3().setFromObject(pointers[i]);
      let center = new THREE.Vector3();
      boundingBox.getCenter(center);

      // Aplica la rotación en torno al centro del objeto con la velocidad reducida
      pointers[i].rotateY(rotationSpeed);

      // Ajusta la posición vertical para que el objeto permanezca en el mismo lugar y tenga un efecto de rebote
      let currentPosition = pointers[i].position.clone();
      pointers[i].position.sub(center);
      pointers[i].position.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        rotationSpeed
      );
      pointers[i].position.add(center);

      // Calcula el desplazamiento vertical con un efecto de rebote y escala la amplitud del rebote
      let bounce = Math.sin(Date.now() * verticalSpeed) * 0.02 * bounceScale;
      pointers[i].position.y = currentPosition.y + bounce;
    }
  }

  updateobjects(
    A1: THREE.Object3D[],
    A2: THREE.Object3D[],
    A3: THREE.Object3D[],
    A4: THREE.Object3D[],
    A5: THREE.Object3D[],
    A6: THREE.Object3D[],
    A7: THREE.Object3D[],
    A8: THREE.Object3D[],
    A9: THREE.Object3D[],
    A10: THREE.Object3D[],
    A11: THREE.Object3D[],
    A12: THREE.Object3D[],
    A13: THREE.Object3D[],
    A14: THREE.Object3D[],
    A15: THREE.Object3D[],
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera
  ) {
    if (A1.length > 0) {
      this.rotatePointers(A1);
    }
    if (A2.length > 0) {
      this.rotatePointers(A2);
    }
    if (A3.length > 0) {
      this.rotatePointers(A3);
    }
    if (A4.length > 0) {
      this.rotatePointers(A4);
    }
    if (A5.length > 0) {
      this.rotatePointers(A5);
    }
    if (A6.length > 0) {
      this.rotatePointers(A6);
    }
    if (A7.length > 0) {
      this.rotatePointers(A7);
    }
    if (A8.length > 0) {
      this.rotatePointers(A8);
    }
    if (A9.length > 0) {
      this.rotatePointers(A9);
    }
    if (A10.length > 0) {
      this.rotatePointers(A10);
    }
    if (A11.length > 0) {
      this.rotatePointers(A11);
    }
    if (A12.length > 0) {
      this.rotatePointers(A12);
    }
    if (A13.length > 0) {
      this.rotatePointers(A13);
    }
    if (A14.length > 0) {
      this.rotatePointers(A14);
    }
    if (A15.length > 0) {
      this.rotatePointers(A15);
    }
  }

  animateLoop(
    animate: Function,
    controls: any,
    updateObjects: Function,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) {
    function render() {
      requestAnimationFrame(render);
      controls.update();
      updateObjects();
      renderer.render(scene, camera);
    }

    render();
  }

  clearScene(scene: THREE.Scene) {
    //window.location.reload();
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
  }

  crearFormaPlanoConIndicador(
    width: number,
    height: number,
    indicatorHeight: number,
    borderRadius: number,
    indicatorWidth: number = width / 5 // Ancho del indicador (por defecto es 1/5 del ancho del plano)
  ) {
    const shape = new THREE.Shape();

    // Rectángulo superior con bordes redondeados
    shape.moveTo(0, borderRadius);
    shape.lineTo(0, height - borderRadius);
    shape.quadraticCurveTo(0, height, borderRadius, height);
    shape.lineTo(width - borderRadius, height);
    shape.quadraticCurveTo(width, height, width, height - borderRadius);
    shape.lineTo(width, borderRadius);
    shape.quadraticCurveTo(width, 0, width - borderRadius, 0);
    shape.lineTo(borderRadius, 0);
    shape.quadraticCurveTo(0, 0, 0, borderRadius);

    // Indicador apuntando hacia abajo
    const indicatorHalfWidth = indicatorWidth / 2;
    const indicatorPosition = width / 2;

    // Punto de inicio del indicador
    const startX = indicatorPosition - indicatorHalfWidth;
    const startY = 0;

    // Punto medio del indicador
    const midX = indicatorPosition;
    const midY = -indicatorHeight;

    // Punto final del indicador
    const endX = indicatorPosition + indicatorHalfWidth;
    const endY = 0;

    shape.moveTo(startX, startY);
    shape.lineTo(midX, midY);
    shape.lineTo(endX, endY);
    shape.lineTo(startX, startY); // Agregamos otro punto para cerrar la forma del indicador

    return shape;
  }

  crearPlano3D(
    width: number,
    height: number,
    depth: number,
    borderRadius: number,
    texturePath: string,
    arrowHeight: number = height / 5
  ) {
    // Crear la forma del plano con bordes redondeados
    const formaPlano = this.crearFormaPlanoConIndicador(
      width,
      height,
      borderRadius,
      arrowHeight
    );

    // Crear la geometría extruida a partir de la forma
    const extrudeSettings = {
      depth: depth, // Profundidad del objeto 3D
      bevelEnabled: false, // Desactivar biselado para mantener la forma plana
    };
    const geometriaExtruida = new THREE.ExtrudeGeometry(
      formaPlano,
      extrudeSettings
    );

    // Crear el material con textura para las caras grandes del plano
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(texturePath);
    const materialTextura = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide, // Se aplica la textura en ambas caras
    });

    // Crear el material blanco para la flecha y los bordes
    const materialBlanco = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // Crear el plano 3D a partir de la geometría y los materiales
    const plano3D = new THREE.Mesh(geometriaExtruida, [
      materialTextura,
      materialBlanco,
    ]);

    return plano3D;
  }

  crearPlano3Dopacidad(
    width: number,
    height: number,
    depth: number,
    borderRadius: number,
    texturePath: string,
    arrowHeight: number = height / 5,
    opacity: number = 0.4 // Opacidad predeterminada
  ) {
    // Crear la forma del plano con bordes redondeados
    const formaPlano = this.crearFormaPlanoConIndicador(
      width,
      height,
      borderRadius,
      arrowHeight
    );

    // Crear la geometría extruida a partir de la forma
    const extrudeSettings = {
      depth: depth, // Profundidad del objeto 3D
      bevelEnabled: false, // Desactivar biselado para mantener la forma plana
    };
    const geometriaExtruida = new THREE.ExtrudeGeometry(
      formaPlano,
      extrudeSettings
    );

    // Crear el material con textura para las caras grandes del plano
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(texturePath);
    const materialTextura = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide, // Se aplica la textura en ambas caras
      opacity: opacity, // Agregar opacidad
      transparent: true, // Habilitar transparencia
    });

    // Crear el material blanco para la flecha y los bordes
    const materialBlanco = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: opacity,
    });

    // Crear el plano 3D a partir de la geometría y los materiales
    const plano3D = new THREE.Mesh(geometriaExtruida, [
      materialTextura,
      materialBlanco,
    ]);

    return plano3D;
  }

  obtenerNombreArray(
    objectArray: THREE.Object3D[],
    A1: THREE.Object3D[],
    A2: THREE.Object3D[],
    A3: THREE.Object3D[],
    A4: THREE.Object3D[],
    A5: THREE.Object3D[],
    A6: THREE.Object3D[],
    A7: THREE.Object3D[],
    A8: THREE.Object3D[],
    A9: THREE.Object3D[],
    A10: THREE.Object3D[],
    A11: THREE.Object3D[],
    A12: THREE.Object3D[],
    A13: THREE.Object3D[],
    A14: THREE.Object3D[],
    A15: THREE.Object3D[]
  ): string {
    const index = [
      A1,
      A2,
      A3,
      A4,
      A5,
      A6,
      A7,
      A8,
      A9,
      A10,
      A11,
      A12,
      A13,
      A14,
      A15,
    ].findIndex((arr) => arr === objectArray);

    if (index !== -1) {
      return `A${index + 1}`;
    } else {
      return 'A15'; // En caso de que no se encuentre en la lista, devolvemos un valor predeterminado
    }
  }
}
