import { TRecurso } from "./TRecurso";
export class TRecursoShader extends TRecurso{
    
    private id!: number;
    private vertexShader!: any;
    private fragmentShader!: any;
    private program!: any;

    constructor(){
        super("Shaders")
    }

    async cargarFichero(nombre: string): Promise<void> {

        //Formato GL/SL (texto)
    }

    async crearShaders(gl: any, vertexShaderSource: any, fragmentShaderSource: any){
        this.vertexShader = await this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        this.fragmentShader = await this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!this.vertexShader || !this.fragmentShader) {
            console.error('No se pudo crear uno o ambos shaders.');
            return;
        }
        this.program = await this.createProgram(gl, this.vertexShader, this.fragmentShader);
        if (!this.program) {
            console.error('No se pudo crear el programa WebGL.');
            return;
        }
    }

    async createShader(gl: WebGLRenderingContext, type: number, source: string){
        const shader = gl.createShader(type);
        if (!shader) {
            console.error('No se pudo crear el shader.');
            return null;
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }
    
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    
    async createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader){
        const program = gl.createProgram();
        if (!program) {
            console.error('No se pudo crear el programa.');
            return null;
        }
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }
    
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
}