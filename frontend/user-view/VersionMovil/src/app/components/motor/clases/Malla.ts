import * as glMatrix from 'gl-matrix';
import * as OBJ from "webgl-obj-loader";
export class Malla {

    private OBJfile: string;
    private program: any; 
    private gl: any;

    constructor(malla: string) {
        this.OBJfile = malla;
    }

    async dibujar(){
        await this.iniciarCanva();

        const mesh = new OBJ.Mesh(this.OBJfile);
        console.log(mesh);
        const shaderProgram = this.program;

        shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(shaderProgram, "aVertexPosition");
        this.gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        
        shaderProgram.vertexNormalAttribute = this.gl.getAttribLocation(shaderProgram, "aVertexNormal");
        this.gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
        
        shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(shaderProgram, "aTextureCoord");
        this.gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
        
        OBJ.initMeshBuffers(this.gl, mesh);

        /*this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh);
        this.gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh.vertices.length, this.gl.FLOAT, false, 0, 0);
        
        // it's possible that the mesh doesn't contain
        // any texture coordinates (e.g. suzanne.obj in the development branch).
        // in this case, the texture vertexAttribArray will need to be disabled
        // before the call to drawElements
        if(!mesh.textures.length){
            this.gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
        }
        else{
            this.gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.textures);
            this.gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mesh.textures, this.gl.FLOAT, false, 0, 0);
        }
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vertexNormals);
        this.gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mesh.vertexNormals.length, this.gl.FLOAT, false, 0, 0);
        
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.indices);
        this.gl.drawElements(this.gl.TRIANGLES, mesh.indices.length, this.gl.UNSIGNED_SHORT, 0);*/
    }

    async iniciarCanva(){
        const canvas = document.querySelector("#mercado") as HTMLCanvasElement;
            let gl = canvas.getContext("webgl");
            if (!gl) {
                console.error('No se pudo obtener el contexto WebGL.');
                return;
            }
            this.gl = gl;
            const vertexShaderSource = `
                attribute vec4 aVertexPosition;
                attribute vec3 aVertexNormal;
                attribute vec2 aTextureCoord;

                uniform mat4 uModelViewMatrix;
                uniform mat4 uProjectionMatrix;

                varying highp vec2 vTextureCoord;

                void main(void) {
                    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                    vTextureCoord = aTextureCoord;
                }
            `;

            // Fragment shader source code
            const fragmentShaderSource = `
                varying highp vec2 vTextureCoord;

                uniform sampler2D uSampler;

                void main(void) {
                    gl_FragColor = texture2D(uSampler, vTextureCoord);
                }
            `;
            if (!vertexShaderSource || !fragmentShaderSource) {
                console.error('No se pudo obtener el código fuente de los shaders.');
                return;
            }
            else{
                await this.crearShaders(gl, vertexShaderSource, fragmentShaderSource);
            }
    }
    async crearShaders(gl: any, vertexShaderSource: any, fragmentShaderSource: any){
        const vertexShader = await this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = await this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vertexShader || !fragmentShader) {
            console.error('No se pudo crear uno o ambos shaders.');
            return;
        }
        await this.createProgram(gl, vertexShader, fragmentShader);
        if (!this.program) {
            console.error('No se pudo crear el programa WebGL.');
            return;
        }
        return this.program;
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
    
        gl.deleteShader(shader);
        return null;
    }
    
    async createProgram(gl: any, vertexShader: any, fragmentShader: any) {
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
            this.program = program;
        }
    
        return null;
    }    
}