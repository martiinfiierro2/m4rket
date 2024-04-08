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
let tokenUsuario =
  sessionStorage.getItem('tokenUsuario') ||
  localStorage.getItem('tokenUsuario');
let urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';

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

  cargarPointers(
    scene: THREE.Scene,
    pointerrender: string,
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
    B1: THREE.Object3D[],
    B2: THREE.Object3D[],
    B3: THREE.Object3D[],
    self: any,
    camera: THREE.PerspectiveCamera,
    imagenescarrito: Producto[]
  ) {
    const width = 1;
    const height = 1;
    const depth = 0.1; // Profundidad del objeto 3D
    const borderRadius = 0.1; // Radio de los bordes redondeados
    let texturePath =
      urlFotoProducto + imagenescarrito[0].foto + '?token=' + tokenUsuario;
    let plano3D = this.crearPlano3D(
      width,
      height,
      depth,
      borderRadius,
      texturePath
    );

    const loader = new GLTFLoader();
    loader.load(
      `assets/${pointerrender}/pointer.glb`,
      (glb) => {
        let pointer = glb.scene;
        pointer.position.set(-8.1, 20.6, 22.6);
        pointer.scale.set(0.75, 0.75, 0.75);

        plano3D.position.set(-8.1, 21.3, 22.6);
        plano3D.scale.set(2.5, 2.5, 2.5);
        console.log(imagenescarrito);

        //scene.add(square);

        //scene.add(plano3D);

        pointer = glb.scene;
        pointer.position.set(-8.1, 20.6, 22.6);
        pointer.scale.set(0.75, 0.75, 0.75);
        //! A1
        for (let i = 0; i <= 9; i++) {
          for (let k = 0; k < self.idsauxiliares.length; k++) {
            for(let h = 0; h <imagenescarrito.length; h++){

            
            if (
              self.idsauxiliares[k] == imagenescarrito[h].id &&
              self.ref[k] == 'A1' &&
              self.pos[k] == i
            ) {
              console.log(imagenescarrito[h].nombre);	
              console.log(self.ref[k])
              console.log(self.pos[k])

              texturePath =
                urlFotoProducto +
                imagenescarrito[h].foto +
                '?token=' +
                tokenUsuario;
            }
          }
        }
          A1[i] = this.crearPlano3D(
            width,
            height,
            depth,
            borderRadius,
            texturePath
          );

          A1[i].position.set(-8.1, 21.3, 22.6);
          A1[i].scale.set(2.5, 2.5, 2.5);
          A1[i].position.x =
            i === 0
              ? -9.3
              : i % 2
              ? A1[i - 1].position.x + 4
              : A1[i - 1].position.x + 3;
          for (let j = 0; j < self.pos.length; j++) {
            if (self.ref[j] == 'A1' && self.pos[j] == i) {
              scene.add(A1[i]);
            }
          }
        }

        //! A2
        for (let i = 0; i <= 9; i++) {
          for (let k = 0; k < self.idsauxiliares.length; k++) {
            for(let h = 0; h <imagenescarrito.length; h++){

            
            if (
              self.idsauxiliares[k] == imagenescarrito[h].id &&
              self.ref[k] == 'A2' &&
              self.pos[k] == i
            ) {
              console.log(imagenescarrito[h].nombre);	
              console.log(self.ref[k])
              console.log(self.pos[k])

              texturePath =
                urlFotoProducto +
                imagenescarrito[h].foto +
                '?token=' +
                tokenUsuario;
            }
          }
        }
          A2[i] = this.crearPlano3D(
            width,
            height,
            depth,
            borderRadius,
            texturePath
          );

          A2[i].position.set(-8.1, 21.3, 22.6);
          A2[i].scale.set(2.5, 2.5, 2.5);

          A2[i].position.z = 26.4;
          A2[i].position.x =
            i === 0
              ? -9.3
              : i % 2
              ? A2[i - 1].position.x + 4
              : A2[i - 1].position.x + 3;
          for (let j = 0; j < self.pos.length; j++) {
            if (self.ref[j] == 'A2' && self.pos[j] === i) {
              scene.add(A2[i]);
            }
          }
        }
        //! A3
        for (let i = 0; i <= 5; i++) {
          for (let k = 0; k < self.idsauxiliares.length; k++) {
            for(let h = 0; h <imagenescarrito.length; h++){

            
            if (
              self.idsauxiliares[k] == imagenescarrito[h].id &&
              self.ref[k] == 'A3' &&
              self.pos[k] == i
            ) {
              console.log(imagenescarrito[h].nombre);	
              console.log(self.ref[k])
              console.log(self.pos[k])

              texturePath =
                urlFotoProducto +
                imagenescarrito[h].foto +
                '?token=' +
                tokenUsuario;
            }
          }
        }
          A3[i] = this.crearPlano3D(
            width,
            height,
            depth,
            borderRadius,
            texturePath
          );

          A3[i].position.set(-8.1, 21.3, 22.6);
          A3[i].scale.set(2.5, 2.5, 2.5);

          A3[i].position.z = 12.1;
          A3[i].position.x =
            i === 0
              ? -16.2
              : i % 2 === 0
              ? A3[i - 1].position.x + 3.5
              : A3[i - 1].position.x + 4;
          for (let j = 0; j < self.pos.length; j++) {
            if (self.ref[j] == 'A3' && self.pos[j] == i) {
              scene.add(A3[i]);
            }
          }
        }

        //! A4
        for (let i = 0; i <= 5; i++) {
          for (let k = 0; k < self.idsauxiliares.length; k++) {
            for(let h = 0; h <imagenescarrito.length; h++){

            
            if (
              self.idsauxiliares[k] == imagenescarrito[h].id &&
              self.ref[k] == 'A4' &&
              self.pos[k] == i
            ) {
              console.log(imagenescarrito[h].nombre);	
              console.log(self.ref[k])
              console.log(self.pos[k])

              texturePath =
                urlFotoProducto +
                imagenescarrito[h].foto +
                '?token=' +
                tokenUsuario;
            }
          }
        }
          A4[i] = this.crearPlano3D(
            width,
            height,
            depth,
            borderRadius,
            texturePath
          );

          A4[i].position.set(-8.1, 21.3, 22.6);
          A4[i].scale.set(2.5, 2.5, 2.5);
          A4[i].position.x =
            i === 0
              ? -16.2
              : i % 2 === 0
              ? A4[i - 1].position.x + 3.5
              : A4[i - 1].position.x + 4;
          A4[i].position.z = 9.7;
          for (let j = 0; j < self.pos.length; j++) {
            if (self.ref[j] == 'A4' && self.pos[j] == i) {
              scene.add(A4[i]);
            }
          }
        }
        //! A5
        for (let i = 0; i <= 5; i++) {
          for (let k = 0; k < self.idsauxiliares.length; k++) {
            for(let h = 0; h <imagenescarrito.length; h++){

            
            if (
              self.idsauxiliares[k] == imagenescarrito[h].id &&
              self.ref[k] == 'A5' &&
              self.pos[k] == i
            ) {
              console.log(imagenescarrito[h].nombre);	
              console.log(self.ref[k])
              console.log(self.pos[k])

              texturePath =
                urlFotoProducto +
                imagenescarrito[h].foto +
                '?token=' +
                tokenUsuario;
            }
          }
        }
          A5[i] = this.crearPlano3D(
            width,
            height,
            depth,
            borderRadius,
            texturePath
          );

          A5[i].position.set(-8.1, 21.3, 22.6);
          A5[i].scale.set(2.5, 2.5, 2.5);
          A5[i].position.x =
            i === 0
              ? -16.2
              : i % 2 === 0
              ? A5[i - 1].position.x + 3.5
              : A5[i - 1].position.x + 4;
          A5[i].position.z = 1.3;
          for (let j = 0; j < self.pos.length; j++) {
            if (self.ref[j] == 'A5' && self.pos[j] == i) {
              scene.add(A5[i]);
            }
          }
        }

        //! A6
        for (let i = 0; i <= 5; i++) {
          for (let k = 0; k < self.idsauxiliares.length; k++) {
            for(let h = 0; h <imagenescarrito.length; h++){

            
            if (
              self.idsauxiliares[k] == imagenescarrito[h].id &&
              self.ref[k] == 'A6' &&
              self.pos[k] == i
            ) {
              console.log(imagenescarrito[h].nombre);	
              console.log(self.ref[k])
              console.log(self.pos[k])

              texturePath =
                urlFotoProducto +
                imagenescarrito[h].foto +
                '?token=' +
                tokenUsuario;
            }
          }
        }
          A6[i] = this.crearPlano3D(
            width,
            height,
            depth,
            borderRadius,
            texturePath
          );

          A6[i].position.set(-8.1, 21.3, 22.6);
          A6[i].scale.set(2.5, 2.5, 2.5);
          A6[i].position.x =
            i === 0
              ? -16.2
              : i % 2 === 0
              ? A6[i - 1].position.x + 3.5
              : A6[i - 1].position.x + 4;
          A6[i].position.z = -0.5;
          for (let j = 0; j < self.pos.length; j++) {
            if (self.ref[j] == 'A6' && self.pos[j] == i) {
              scene.add(A6[i]);
            }
          }
        }

        //! A7

        for (let i = 0; i <= 5; i++) {
          for (let k = 0; k < self.idsauxiliares.length; k++) {
            for(let h = 0; h <imagenescarrito.length; h++){

            
            if (
              self.idsauxiliares[k] == imagenescarrito[h].id &&
              self.ref[k] == 'A7' &&
              self.pos[k] == i
            ) {
              console.log(imagenescarrito[h].nombre);	
              console.log(self.ref[k])
              console.log(self.pos[k])

              texturePath =
                urlFotoProducto +
                imagenescarrito[h].foto +
                '?token=' +
                tokenUsuario;
            }
          }
        }
          A7[i] = this.crearPlano3D(
            width,
            height,
            depth,
            borderRadius,
            texturePath
          );

          A7[i].position.set(-8.1, 21.3, 22.6);
          A7[i].scale.set(2.5, 2.5, 2.5);
          A7[i].position.x =
            i === 0
              ? -16.2
              : i % 2 === 0
              ? A7[i - 1].position.x + 3.5
              : A7[i - 1].position.x + 4;
          A7[i].position.z = -9.1;
          for (let j = 0; j < self.pos.length; j++) {
            if (self.ref[j] == 'A7' && self.pos[j] == i) {
              scene.add(A7[i]);
            }
          }
        }

        //! A8
        for (let i = 0; i <= 5; i++) {
          for (let k = 0; k < self.idsauxiliares.length; k++) {
            for(let h = 0; h <imagenescarrito.length; h++){

            
            if (
              self.idsauxiliares[k] == imagenescarrito[h].id &&
              self.ref[k] == 'A8' &&
              self.pos[k] == i
            ) {
              console.log(imagenescarrito[h].nombre);	
              console.log(self.ref[k])
              console.log(self.pos[k])

              texturePath =
                urlFotoProducto +
                imagenescarrito[h].foto +
                '?token=' +
                tokenUsuario;
            }
          }
        }
          A8[i] = this.crearPlano3D(
            width,
            height,
            depth,
            borderRadius,
            texturePath
          );

          A8[i].position.set(-8.1, 21.3, 22.6);
          A8[i].scale.set(2.5, 2.5, 2.5);
          A8[i].position.x =
            i === 0
              ? -16.2
              : i % 2 === 0
              ? A8[i - 1].position.x + 3.5
              : A8[i - 1].position.x + 4;
          A8[i].position.z = -11.1;
          for (let j = 0; j < self.pos.length; j++) {
            if (self.ref[j] == 'A8' && self.pos[j] == i) {
              scene.add(A8[i]);
            }
          }
        }

        //! A9

        for (let i = 0; i <= 3; i++) {
          for (let k = 0; k < self.idsauxiliares.length; k++) {
            for(let h = 0; h <imagenescarrito.length; h++){

            
            if (
              self.idsauxiliares[k] == imagenescarrito[h].id &&
              self.ref[k] == 'A9' &&
              self.pos[k] == i
            ) {
              console.log(imagenescarrito[h].nombre);	
              console.log(self.ref[k])
              console.log(self.pos[k])

              texturePath =
                urlFotoProducto +
                imagenescarrito[h].foto +
                '?token=' +
                tokenUsuario;
            }
          }
        }
          A9[i] = this.crearPlano3D(
            width,
            height,
            depth,
            borderRadius,
            texturePath
          );

          A9[i].position.set(-8.1, 21.3, 22.6);
          A9[i].scale.set(2.5, 2.5, 2.5);
          A9[i].position.x =
            i === 0
              ? 11.2
              : i % 2 === 0
              ? A9[i - 1].position.x + 3.6
              : A9[i - 1].position.x + 3.4;
          A9[i].position.z = 6.6;
          for (let j = 0; j < self.pos.length; j++) {
            if (self.ref[j] == 'A9' && self.pos[j] == i) {
              scene.add(A9[i]);
            }
          }
        }

        // ! A10

        for (let i = 0; i <= 3; i++) {
          for (let k = 0; k < self.idsauxiliares.length; k++) {
            for(let h = 0; h <imagenescarrito.length; h++){

            
            if (
              self.idsauxiliares[k] == imagenescarrito[h].id &&
              self.ref[k] == 'A10' &&
              self.pos[k] == i
            ) {
              console.log(imagenescarrito[h].nombre);	
              console.log(self.ref[k])
              console.log(self.pos[k])

              texturePath =
                urlFotoProducto +
                imagenescarrito[h].foto +
                '?token=' +
                tokenUsuario;
            }
          }
        }
          A10[i] = this.crearPlano3D(
            width,
            height,
            depth,
            borderRadius,
            texturePath
          );

          A10[i].position.set(-8.1, 21.3, 22.6);
          A10[i].scale.set(2.5, 2.5, 2.5);
          A10[i].position.x =
            i === 0
              ? 11.2
              : i % 2 === 0
              ? A10[i - 1].position.x + 3.6
              : A10[i - 1].position.x + 3.4;
          A10[i].position.z = 5.2;
          for (let j = 0; j < self.pos.length; j++) {
            if (self.ref[j] == 'A10' && self.pos[j] == i) {
              scene.add(A10[i]);
            }
          }
        }

        //! A11
        for (let i = 0; i <= 3; i++) {
          for (let k = 0; k < self.idsauxiliares.length; k++) {
            for(let h = 0; h <imagenescarrito.length; h++){

            
            if (
              self.idsauxiliares[k] == imagenescarrito[h].id &&
              self.ref[k] == 'A11' &&
              self.pos[k] == i
            ) {
              console.log(imagenescarrito[h].nombre);	
              console.log(self.ref[k])
              console.log(self.pos[k])

              texturePath =
                urlFotoProducto +
                imagenescarrito[h].foto +
                '?token=' +
                tokenUsuario;
            }
          }
        }
          A11[i] = this.crearPlano3D(
            width,
            height,
            depth,
            borderRadius,
            texturePath
          );

          A11[i].position.set(-8.1, 21.3, 22.6);
          A11[i].scale.set(2.5, 2.5, 2.5);
          A11[i].position.x =
            i === 0
              ? 11.2
              : i % 2 === 0
              ? A11[i - 1].position.x + 3.6
              : A11[i - 1].position.x + 3.4;
          A11[i].position.z = -5.4;
          for (let j = 0; j < self.pos.length; j++) {
            if (self.ref[j] == 'A11' && self.pos[j] == i) {
              scene.add(A11[i]);
            }
          }
        }

        //! A12

        for (let i = 0; i <= 3; i++) {
          for (let k = 0; k < self.idsauxiliares.length; k++) {
            for(let h = 0; h <imagenescarrito.length; h++){

            
            if (
              self.idsauxiliares[k] == imagenescarrito[h].id &&
              self.ref[k] == 'A12' &&
              self.pos[k] == i
            ) {
              console.log(imagenescarrito[h].nombre);	
              console.log(self.ref[k])
              console.log(self.pos[k])

              texturePath =
                urlFotoProducto +
                imagenescarrito[h].foto +
                '?token=' +
                tokenUsuario;
            }
          }
        }
          A12[i] = this.crearPlano3D(
            width,
            height,
            depth,
            borderRadius,
            texturePath
          );

          A12[i].position.set(-8.1, 21.3, 22.6);
          A12[i].scale.set(2.5, 2.5, 2.5);
          A12[i].position.x =
            i === 0
              ? 11.2
              : i % 2 === 0
              ? A12[i - 1].position.x + 3.6
              : A12[i - 1].position.x + 3.4;
          A12[i].position.z = -6.8;
          for (let j = 0; j < self.pos.length; j++) {
            if (self.ref[j] == 'A12' && self.pos[j] == i) {
              scene.add(A12[i]);
            }
          }
        }
//! B1
        for (let i = 0; i <= 3; i++) {
          for (let k = 0; k < self.idsauxiliares.length; k++) {
            for(let h = 0; h <imagenescarrito.length; h++){

            
            if (
              self.idsauxiliares[k] == imagenescarrito[h].id &&
              self.ref[k] == 'B1' &&
              self.pos[k] == i
            ) {
              console.log(imagenescarrito[h].nombre);	
              console.log(self.ref[k])
              console.log(self.pos[k])

              texturePath =
                urlFotoProducto +
                imagenescarrito[h].foto +
                '?token=' +
                tokenUsuario;
            }
          }
        }
          B1[i] = this.crearPlano3D(
            width,
            height,
            depth,
            borderRadius,
            texturePath
          );

          B1[i].position.set(-8.1, 21.3, 22.6);
          B1[i].scale.set(2.5, 2.5, 2.5);

          B1[i].position.z = i === 0 ? 4.2 : B1[i - 1].position.z - 3.1;
          B1[i].position.x = 29.4;
          B1[i].position.y = 25.7;
          for (let j = 0; j < self.pos.length; j++) {
            if (self.ref[j] == 'B1' && self.pos[j] == i) {
              scene.add(B1[i]);
            }
          }
        }
//! B2
        for (let i = 0; i <= 5; i++) {
          for (let k = 0; k < self.idsauxiliares.length; k++) {
            for(let h = 0; h <imagenescarrito.length; h++){

            
            if (
              self.idsauxiliares[k] == imagenescarrito[h].id &&
              self.ref[k] == 'B2' &&
              self.pos[k] == i
            ) {
              console.log(imagenescarrito[h].nombre);	
              console.log(self.ref[k])
              console.log(self.pos[k])

              texturePath =
                urlFotoProducto +
                imagenescarrito[h].foto +
                '?token=' +
                tokenUsuario;
            }
          }
        }
          B2[i] = this.crearPlano3D(
            width,
            height,
            depth,
            borderRadius,
            texturePath
          );

          B2[i].position.set(-8.1, 21.3, 22.6);
          B2[i].scale.set(2.5, 2.5, 2.5);
          B2[i].position.x =
            i === 0
              ? 28
              : i % 2 === 0
              ? B2[i - 1].position.x - 3.6
              : B2[i - 1].position.x - 3.7;
          B2[i].position.z = -22.5;
          B2[i].position.y = 25;
          for (let j = 0; j < self.pos.length; j++) {
            if (self.ref[j] == 'B2' && self.pos[j] == i) {
              scene.add(B2[i]);
            }
          }
        }
//! B3
        for (let i = 0; i <= 2; i++) {
          for (let k = 0; k < self.idsauxiliares.length; k++) {
            for(let h = 0; h <imagenescarrito.length; h++){

            
            if (
              self.idsauxiliares[k] == imagenescarrito[h].id &&
              self.ref[k] == 'B3' &&
              self.pos[k] == i
            ) {
              console.log(imagenescarrito[h].nombre);	
              console.log(self.ref[k])
              console.log(self.pos[k])

              texturePath =
                urlFotoProducto +
                imagenescarrito[h].foto +
                '?token=' +
                tokenUsuario;
            }
          }
        }
          B3[i] = this.crearPlano3D(
            width,
            height,
            depth,
            borderRadius,
            texturePath
          );

          B3[i].position.set(-8.1, 21.3, 22.6);
          B3[i].scale.set(2.5, 2.5, 2.5);

          B3[i].position.x = i === 0 ? -10 : B3[i - 1].position.x + 6.5;
          B3[i].position.z = -22.8;
          B3[i].position.y = 22.5;
          for (let j = 0; j < self.pos.length; j++) {
            if (self.ref[j] == 'B3' && self.pos[j] == i) {
              scene.add(B3[i]);
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
    B1: THREE.Object3D[],
    B2: THREE.Object3D[],
    B3: THREE.Object3D[]
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
          B1,
          B2,
          B3,
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
    B1: THREE.Object3D[],
    B2: THREE.Object3D[],
    B3: THREE.Object3D[],
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
    if (B1.length > 0) {
      this.rotatePointers(B1);
    }
    if (B2.length > 0) {
      this.rotatePointers(B2);
    }
    if (B3.length > 0) {
      this.rotatePointers(B3);
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
    const materialBlanco = new THREE.MeshBasicMaterial({ color: 0xffffff });

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
    B1: THREE.Object3D[],
    B2: THREE.Object3D[],
    B3: THREE.Object3D[]
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
      B1,
      B2,
      B3,
    ].findIndex((arr) => arr === objectArray);

    if (index !== -1) {
      return `A${index + 1}`;
    } else {
      return 'B3'; // En caso de que no se encuentre en la lista, devolvemos un valor predeterminado
    }
  }
}
