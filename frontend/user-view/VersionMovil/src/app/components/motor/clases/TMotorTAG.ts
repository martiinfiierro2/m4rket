import { TNodo } from './TNodo';
import { ECamara } from "./ECamara";
import { ELuz } from "./ELuz";
import { EModelo } from "./EModelo";
import { TGestorRecursos } from "./TGestorRecursos";
import { TRecursoShader } from './TRecrusoShader';
import * as glMatrix from 'gl-matrix';
import { RotacionService } from '../../../services/rotacion.service';
import { vec3 } from 'gl-matrix';
interface Viewport{
    x: number, 
    y: number,
    alto: number,
    ancho: number
}
export class TMotorTAG {

    constructor(){
        this.gestorRecursos = new TGestorRecursos(); 
    }
    public raiz!: TNodo;
    public gestorRecursos!: TGestorRecursos;
    public gl!: WebGL2RenderingContext;
    public program!: WebGLProgram;
    public programColor!: WebGLProgram;
    public nodos: TNodo[] = [];
    
    public gestorCamaras: TNodo[] = [];
    public gestorLuces: TNodo[] = [];
    public gestorViewports: Viewport[] = [];
    public camaraActiva!: TNodo;
    public viewportActivo!: number;
    public lucesActivas: TNodo[] = [];
    public traslacionX: number = 0;
    public traslacionY: number = 0;
    public rotacion: number = 0;
    public zoomFactor: number = 1;

    async setRotacion(rotacion: number){
        this.rotacion = rotacion;
    }

    async setTraslacion(traslacionX: number, traslacionY: number){
        this.traslacionX = traslacionX;
        this.traslacionY = traslacionY;
    }

    async setZoom(zoom: number){
        this.zoomFactor = zoom;
    }

    async registrarCamara(nodoCamara: TNodo) {
        this.gestorCamaras.push(nodoCamara);
    }

    async setCamara(nCamara: TNodo){
        this.camaraActiva = nCamara;
    }

    async registrarLuz(nodoLuz: TNodo){
        this.gestorLuces.push(nodoLuz);
    }

    async setLuz(nLuz: TNodo){
        this.lucesActivas.push(nLuz)
    }

    async removeLuz(nodoLuz: TNodo){
        this.lucesActivas = this.lucesActivas.filter(TNodo => TNodo != nodoLuz);
    }

    async resgistrarViewport(x: number, y: number, alto: number, ancho: number){
        let viewport!: Viewport;
        viewport.x = x;
        viewport.y = y;
        viewport.alto = alto;
        viewport.ancho = ancho;
        this.gestorViewports.push(viewport);
    }

    async setViewport(nViewport: number){
        this.viewportActivo = nViewport;
    }

    async iniciarGL(){
        const canvas = document.querySelector("#mercado") as HTMLCanvasElement;

        let gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
        if (!gl) {
            console.error('No se pudo obtener el contexto Webthis.gl!.');
            return;
        }
        this.gl = gl;

        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        
        // Limpiar canvas
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        // Habilitar el culling
        this.gl.enable(this.gl.CULL_FACE);

        // Especificar qué caras cullar (en este caso, cullar las caras traseras)
        this.gl.cullFace(this.gl.BACK);
        return canvas;
    }

    async iniciarPrograma(vertex: any, fragment: any){
        //Calculamos la matriz de vista como la inversa de la matriz de la cámara activa
        let matrizCamara = this.camaraActiva.getMatrizTransf();
        let viewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.invert(viewMatrix, matrizCamara);

        const auxVertex= await this.gestorRecursos.getRecurso(vertex, "shader");
        let vertexShaderSource: any, fragmentShaderSource: any;

        if (auxVertex instanceof TRecursoShader) {
            vertexShaderSource = auxVertex.valor;
        }

        const auxFragment = await this.gestorRecursos.getRecurso(fragment, "shader");

        if (auxFragment instanceof TRecursoShader) {
            fragmentShaderSource = auxFragment.valor;
        }

        if (!vertexShaderSource || !fragmentShaderSource) {
            console.error('No se pudo obtener el código fuente de los shaders.');
            return;
        }
        else{
            if(fragment == 'fragmentColorPicking.glsl'){
                await this.crearShaders(vertexShaderSource, fragmentShaderSource, 0);
            }else{
                await this.crearShaders(vertexShaderSource, fragmentShaderSource, 1);
            }
        }
    }

    async crearShaders(vertexShaderSource: string, fragmentShaderSource: string, number: number){
        const vertexShader = await this.createShader(this.gl!.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = await this.createShader(this.gl!.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vertexShader || !fragmentShader) {
            console.error('No se pudo crear uno o ambos shaders.');
            return;
        }
        await this.createProgram(vertexShader, fragmentShader, number);
        if (!this.program) {
            console.error('No se pudo crear el programa Webthis.gl!.');
            return;
        }
        return this.program;
    }

    async createShader(type: number, source: string){
        const shader = this.gl!.createShader(type);
        if (!shader) {
            console.error('No se pudo crear el shader.');
            return null;
        }
        this.gl!.shaderSource(shader, source);
        this.gl!.compileShader(shader);
        if (!this.gl!.getShaderParameter(shader, this.gl!.COMPILE_STATUS)) {
            console.error('Error de compilación del shader:', this.gl!.getShaderInfoLog(shader));
            return null;
        }
    
        return shader;
    }
    
    async createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader, number: number) {
        const program = this.gl!.createProgram();
        if (!program) {
            console.error('No se pudo crear el programa.');
            return null;
        }
        this.gl!.attachShader(program, vertexShader);
        this.gl!.attachShader(program, fragmentShader);
        this.gl!.linkProgram(program);
        const success = this.gl!.getProgramParameter(program, this.gl!.LINK_STATUS);
        if (!success) {
            console.error('Error al enlazar el programa de shader.');
            const info = this.gl!.getProgramInfoLog(program);
            return null;
        }

        if(number == 1){
            this.program = program;
        }else{
            this.programColor = program;
        }
        return program;
    }

    async crearRaiz(nodoRaiz: TNodo){
        this.raiz = nodoRaiz;
    }

    async setFalse(nodo: TNodo){
        nodo.setDibujar(false);
    }
    
    async eliminarNodo(padre: TNodo, hijo: TNodo){
        await padre.eliminarHijo(hijo);
    }

    async crearNodo( padre: TNodo|null, trasl: glMatrix.vec3, rot: glMatrix.vec3, esc: glMatrix.vec3 ){
        let nodoCreado: any;
        
        nodoCreado = new TNodo();
        if (padre == null) {
            await this.crearRaiz(nodoCreado);
        }
        else{
            await padre.agregarHijo(nodoCreado);
        }

        await nodoCreado.setTraslacion(trasl);
        await nodoCreado.setRotacion(rot);
        await nodoCreado.setEscalado(esc);

        this.nodos.push(nodoCreado);

        return nodoCreado;
    }

    crearCamara( padre: TNodo|null, trasl: glMatrix.vec3, rot: glMatrix.vec3, esc: glMatrix.vec3, perspectiva: Boolean, paralela: Boolean, cercano: number, lejano: number){
        
        let nodoCreado: any, entidadCamara: any;

        nodoCreado = new TNodo();
        if (padre == null) {
            padre = this.raiz;
        }
        padre.agregarHijo(nodoCreado);
        entidadCamara = new ECamara( perspectiva, paralela, cercano, lejano); //falta añadir los atributos pasados por param.

        nodoCreado.setEntidad(entidadCamara);
        nodoCreado.setTraslacion(trasl);
        nodoCreado.setRotacion(rot);
        nodoCreado.setEscalado(esc);
        
        return nodoCreado;
    }

    crearLuz( padre: TNodo|null, trasl: glMatrix.vec3, rot: glMatrix.vec3, esc: glMatrix.vec3, intensidad: glMatrix.vec3, tipoLuz: string, posicionLuz: glMatrix.vec4): TNodo{

        let nodoCreado: any, entidadLuz: any;

        nodoCreado = new TNodo();
        if (padre == null) {
            padre = this.raiz;
        }
        padre.agregarHijo(nodoCreado);

        entidadLuz = new ELuz(intensidad, tipoLuz, posicionLuz); //falta añadir los atributos pasados por param.
        nodoCreado.setEntidad(entidadLuz);
        nodoCreado.setTraslacion(trasl);
        nodoCreado.setRotacion(rot);
        nodoCreado.setEscalado(esc);

        return nodoCreado;
    }

    async crearModelo( padre: TNodo|null, trasl: glMatrix.vec3, rot: glMatrix.vec3, esc: glMatrix.vec3, nombreFichero: string | undefined, tipo: string, textura: any){
        let nodoCreado: any, recursoMalla: any, recursoTextura: any, entidadModelo: any;
        
        nodoCreado = new TNodo();
        if (padre == null) {
            padre = this.raiz;
        }
        await padre.agregarHijo(nodoCreado);
        if(nombreFichero != undefined){
            recursoMalla = await this.gestorRecursos.getRecurso(nombreFichero, tipo);
            if(nombreFichero != 'pin.obj'){
                recursoTextura = await this.gestorRecursos.getRecurso(textura, "textura")
            }else{
                recursoTextura = await this.gestorRecursos.getRecursoAPI(textura, "textura")
            }
        }
        entidadModelo = new EModelo(recursoMalla, recursoTextura);
        await nodoCreado.setEntidad(entidadModelo);
        await nodoCreado.setTraslacion(trasl);
        await nodoCreado.setRotacion(rot);
        await nodoCreado.setEscalado(esc);

        return nodoCreado;
    }
}