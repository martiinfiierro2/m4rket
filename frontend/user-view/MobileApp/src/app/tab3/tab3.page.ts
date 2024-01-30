import { Component } from '@angular/core';
import * as THREE from 'three'; // we need @types/three for this to work (next to three package)
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']

})
export class Tab3Page {
  constructor() { }
  container: any; // any  = ugly

  ngOnInit(): void{
    this.stuff();
  }

  stuff() {
    this.container = document.getElementById('canvas');
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    console.log('inicio stuff');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({alpha:true});
    const loader = new GLTFLoader();

    camera.position.set(4,10,-6);
    //camera.rotation.set(0.2,2*(Math.PI / 2),0);
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    }

    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
  }

    let object;
    let objToRender = 'market';
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(renderer.domElement);
    loader.load(
      `assets/${objToRender}/market.glb`,
      function (glb) {
        object = glb.scene;
        //object.scale.set(2,2,2);
        object.position.set(0,0,-6);
        scene.add(object);
        console.log('se sube');
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function (error) {
        console.error(error);
      }
    );

    //camera.position.set(0, 1, 1);
    
    const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
    topLight.position.set(500, 500, 500) //top-left-ish
    topLight.castShadow = true;
    scene.add(topLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // (color, intensity)
    scene.add(ambientLight);

    
  
    //Render the scene
    function animate() {
      requestAnimationFrame(animate);
      controls.update();

      renderer.render(scene, camera);
    }

/*
    const geometry = new THREE.TubeGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xFF5733 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
*/
    animate();
  }

}
