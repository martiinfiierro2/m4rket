import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DomElementSchemaRegistry } from '@angular/compiler';
import { json } from 'express';
import { forkJoin } from 'rxjs';
import { Component, ViewChild } from '@angular/core';
import { ProductosService } from "../services/productos.service";
import { DrawerComponent } from '../components/drawer/drawer.component';
import { environment } from '../environments/environment';
import { getLocaleFirstDayOfWeek } from '@angular/common';
import { EstadisticasService } from '../services/estadisticas.service';
import { UbicacionesService } from '../services/ubicaciones.service';

export class ModeloService {
    constructor() { }


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

        const ambientLight = new THREE.AmbientLight(0xffffff, ambientLightIntensity); // (color, intensity)

        scene.add(ambientLight);
        scene.add(topLight);
        scene.add(topLight2);
        scene.add(topLight3);

    }


    cargarPointers(scene: THREE.Scene, pointerrender: string, A1: THREE.Object3D[], A2: THREE.Object3D[], A3: THREE.Object3D[], A4: THREE.Object3D[], A5: THREE.Object3D[], A6: THREE.Object3D[], A7: THREE.Object3D[], A8: THREE.Object3D[], A9: THREE.Object3D[], A10: THREE.Object3D[], A11: THREE.Object3D[], A12: THREE.Object3D[], B1: THREE.Object3D[], B2: THREE.Object3D[], B3: THREE.Object3D[], self: any) {
        const loader = new GLTFLoader();
        loader.load(
            `assets/${pointerrender}/pointer.glb`,
            function (glb) {
                let pointer = glb.scene;
                pointer.position.set(-8.1, 20.6, 22.6);
                pointer.scale.set(0.75, 0.75, 0.75);

                pointer = glb.scene;
                pointer.position.set(-8.1, 20.6, 22.6);
                pointer.scale.set(0.75, 0.75, 0.75);
                for (let i = 0; i <= 9; i++) {
                    A1[i] = pointer.clone();
                    A1[i].position.x = i === 0 ? -8.1 : (i % 2) ? A1[i - 1].position.x + 4 : A1[i - 1].position.x + 3;
                    for (let j = 0; j < self.pos.length; j++) {
                        if (self.ref[j] == ('A1') && self.pos[j] == i) {
                            scene.add(A1[i]);
                        }
                    }
                }

                for (let i = 0; i <= 9; i++) {
                    A2[i] = pointer.clone();
                    A2[i].position.z = 26.4;
                    A2[i].position.x = i === 0 ? -8.1 : (i % 2) ? A2[i - 1].position.x + 4 : A2[i - 1].position.x + 3;
                    for (let j = 0; j < self.pos.length; j++) {
                        if (self.ref[j] == ('A2') && self.pos[j] === i) {
                            scene.add(A2[i]);
                        }
                    }
                }

                for (let i = 0; i <= 5; i++) {
                    const pointerClone = pointer.clone();
                    pointerClone.position.z = 12.1;
                    pointerClone.position.x = i === 0 ? -15 : (i % 2 === 0 ? A3[i - 1].position.x + 3.5 : A3[i - 1].position.x + 4);
                    A3[i] = pointerClone;
                    for (let j = 0; j < self.pos.length; j++) {
                        if (self.ref[j] == ('A3') && self.pos[j] == i) {
                            scene.add(A3[i]);
                        }
                    }
                }

                for (let i = 0; i <= 5; i++) {
                    const pointerClone = pointer.clone();
                    pointerClone.position.x = i === 0 ? -15 : (i % 2 === 0 ? A4[i - 1].position.x + 3.5 : A4[i - 1].position.x + 4);
                    pointerClone.position.z = 9.7;
                    A4[i] = pointerClone;
                    for (let j = 0; j < self.pos.length; j++) {
                        if (self.ref[j] == ('A4') && self.pos[j] == i) {
                            scene.add(A4[i]);
                        }
                    }
                }

                for (let i = 0; i <= 5; i++) {
                    const pointerClone = pointer.clone();
                    pointerClone.position.x = i === 0 ? -15 : (i % 2 === 0 ? A5[i - 1].position.x + 3.5 : A5[i - 1].position.x + 4);
                    pointerClone.position.z = 1.3;
                    A5[i] = pointerClone;
                    for (let j = 0; j < self.pos.length; j++) {
                        if (self.ref[j] == ('A5') && self.pos[j] == i) {
                            scene.add(A5[i]);
                        }
                    }
                }

                for (let i = 0; i <= 5; i++) {
                    const pointerClone = pointer.clone();
                    pointerClone.position.x = i === 0 ? -15 : (i % 2 === 0 ? A6[i - 1].position.x + 3.5 : A6[i - 1].position.x + 4);
                    pointerClone.position.z = -0.5;
                    A6[i] = pointerClone;
                    for (let j = 0; j < self.pos.length; j++) {
                        if (self.ref[j] == ('A6') && self.pos[j] == i) {
                            scene.add(A6[i]);
                        }
                    }
                }

                for (let i = 0; i <= 5; i++) {
                    const pointerClone = pointer.clone();
                    pointerClone.position.x = i === 0 ? -15 : (i % 2 === 0 ? A7[i - 1].position.x + 3.5 : A7[i - 1].position.x + 4);
                    pointerClone.position.z = -9.1;
                    A7[i] = pointerClone;
                    for (let j = 0; j < self.pos.length; j++) {
                        if (self.ref[j] == ('A7') && self.pos[j] == i) {
                            scene.add(A7[i]);
                        }
                    }
                }

                for (let i = 0; i <= 5; i++) {
                    const pointerClone = pointer.clone();
                    pointerClone.position.x = i === 0 ? -15 : (i % 2 === 0 ? A8[i - 1].position.x + 3.5 : A8[i - 1].position.x + 4);
                    pointerClone.position.z = -11.1;
                    A8[i] = pointerClone;
                    for (let j = 0; j < self.pos.length; j++) {
                        if (self.ref[j] == ('A8') && self.pos[j] == i) {
                            scene.add(A8[i]);
                        }
                    }
                }

                for (let i = 0; i <= 3; i++) {
                    const pointerClone = pointer.clone();
                    pointerClone.position.x = i === 0 ? 12.4 : (i % 2 === 0 ? A9[i - 1].position.x + 3.6 : A9[i - 1].position.x + 3.4);
                    pointerClone.position.z = 6.6;
                    A9[i] = pointerClone;
                    for (let j = 0; j < self.pos.length; j++) {
                        if (self.ref[j] == ('A9') && self.pos[j] == i) {
                            scene.add(A9[i]);
                        }
                    }
                }
                for (let i = 0; i <= 3; i++) {
                    const pointerClone = pointer.clone();
                    pointerClone.position.x = i === 0 ? 12.4 : (i % 2 === 0 ? A10[i - 1].position.x + 3.6 : A10[i - 1].position.x + 3.4);
                    pointerClone.position.z = 5.2;
                    A10[i] = pointerClone;
                    for (let j = 0; j < self.pos.length; j++) {
                        if (self.ref[j] == ('A10') && self.pos[j] == i) {
                            scene.add(A10[i]);
                        }
                    }
                }
                for (let i = 0; i <= 3; i++) {
                    const pointerClone = pointer.clone();
                    pointerClone.position.x = i === 0 ? 12.4 : (i % 2 === 0 ? A11[i - 1].position.x + 3.6 : A11[i - 1].position.x + 3.4);
                    pointerClone.position.z = -5.4;
                    A11[i] = pointerClone;
                    for (let j = 0; j < self.pos.length; j++) {
                        if (self.ref[j] == ('A11') && self.pos[j] == i) {
                            scene.add(A11[i]);
                        }
                    }
                }

                for (let i = 0; i <= 3; i++) {
                    const pointerClone = pointer.clone();
                    pointerClone.position.x = i === 0 ? 12.4 : (i % 2 === 0 ? A12[i - 1].position.x + 3.6 : A12[i - 1].position.x + 3.4);
                    pointerClone.position.z = -6.8;
                    A12[i] = pointerClone;
                    for (let j = 0; j < self.pos.length; j++) {
                        if (self.ref[j] == ('A12') && self.pos[j] == i) {
                            scene.add(A12[i]);
                        }
                    }
                }


                for (let i = 0; i <= 3; i++) {
                    const pointerClone = pointer.clone();

                    pointerClone.position.z = i === 0 ? 4.5 : B1[i - 1].position.z - 3.1;
                    pointerClone.position.x = 29.4;
                    pointerClone.position.y = 24.5;
                    B1[i] = pointerClone;
                    for (let j = 0; j < self.pos.length; j++) {
                        if (self.ref[j] == ('B1') && self.pos[j] == i) {
                            scene.add(B1[i]);
                        }
                    }
                }

                for (let i = 0; i <= 5; i++) {
                    const pointerClone = pointer.clone();
                    pointerClone.position.x = i === 0 ? 29.1 : (i % 2 === 0 ? B2[i - 1].position.x - 3.6 : B2[i - 1].position.x - 3.7);
                    pointerClone.position.z = -22.5;
                    pointerClone.position.y = 24.5;
                    B2[i] = pointerClone;
                    for (let j = 0; j < self.pos.length; j++) {
                        if (self.ref[j] == ('B2') && self.pos[j] == i) {
                            scene.add(B2[i]);
                        }
                    }
                }

                for (let i = 0; i <= 2; i++) {
                    const pointerClone = pointer.clone();
                    pointerClone.position.x = i === 0 ? -9.2 : (B3[i - 1].position.x + 6.5);
                    pointerClone.position.z = -22.8;
                    pointerClone.position.y = 22.5;
                    B3[i] = pointerClone;
                    for (let j = 0; j < self.pos.length; j++) {
                        if (self.ref[j] == ('B3') && self.pos[j] == i) {
                            scene.add(B3[i]);
                        }
                    }
                }
            },
            function (xhr) {
            },
            function (error) {
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
          TWO: THREE.TOUCH.DOLLY_PAN
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
        function rotatePointers(pointers: THREE.Object3D[]) {
          for (let i = 0; i < pointers.length; i++) {
            pointers[i].rotation.y += 0.025;
          }
        }
    
        function animate() {
          requestAnimationFrame(animate);
          controls.update();
    
          if (A1.length > 0) {
            rotatePointers(A1);
          }
          if (A2.length > 0) {
            rotatePointers(A2);
          }
          if (A3.length > 0) {
            rotatePointers(A3);
          }
          if (A4.length > 0) {
            rotatePointers(A4);
          }
          if (A5.length > 0) {
            rotatePointers(A5);
          }
          if (A6.length > 0) {
            rotatePointers(A6);
          }
          if (A7.length > 0) {
            rotatePointers(A7);
          }
          if (A8.length > 0) {
            rotatePointers(A8);
          }
          if (A9.length > 0) {
            rotatePointers(A9);
          }
          if (A10.length > 0) {
            rotatePointers(A10);
          }
          if (A11.length > 0) {
            rotatePointers(A11);
          }
          if (A12.length > 0) {
            rotatePointers(A12);
          }
          if (B1.length > 0) {
            rotatePointers(B1);
          }
          if (B2.length > 0) {
            rotatePointers(B2);
          }
          if (B3.length > 0) {
            rotatePointers(B3);
          }
          renderer.render(scene, camera);
        }
    
        animate();
      }

      clearScene(scene: THREE.Scene) {
        scene.remove(...scene.children);
      }

}
