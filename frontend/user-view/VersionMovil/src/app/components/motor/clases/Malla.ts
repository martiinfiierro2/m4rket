import { mat4, mat3, vec3 } from 'gl-matrix';
import * as glMatrix from 'gl-matrix';
import * as OBJ from "webgl-obj-loader";
export class Malla {

    private rotationAngleX: number = 0;
    private rotationAngleY: number = 0;
    private lastTouchX: number = 0;
    private lastTouchY: number = 0;
    private isRightTouchDown: boolean = false;

    private OBJfile: string;
    private texture: WebGLTexture | null = null;

    constructor(private gl: WebGL2RenderingContext, private program: WebGLProgram, malla: string) {
        this.OBJfile = malla;
    }

    getProgramInfo(gl: any, program: any){
        const programInfo = {
            program: program,
            attribLocations: {
                vertexPosition: this.gl!.getAttribLocation(program, "aVertexPosition"),
                textureCoord: this.gl!.getAttribLocation(program, "aTextureCoord"),
                normalCoord: this.gl!.getAttribLocation(program, "aNormalCoord")
            },
            uniformLocations: {
                projectionMatrix: this.gl!.getUniformLocation(
                    program,
                    "uProjectionMatrix"
                ),
                viewMatrix: this.gl!.getUniformLocation(program, "uViewMatrix"),
                modelMatrix: this.gl!.getUniformLocation(program, "uModelMatrix"),
                uSampler: this.gl!.getUniformLocation(program, "uSampler")
            }
        };
        return programInfo;
    }

    async dibujar() {
        const InfoPrograma = this.getProgramInfo(this.gl, this.program);
    
        let mesh = OBJ.initMeshBuffers(this.gl as WebGL2RenderingContext, new OBJ.Mesh(this.OBJfile));

        // Cargar textura
        this.texture = await this.loadTexture(`../../assets/motor/texturas/R.jpg`);

        // Función para manejar el evento de arrastre con clic derecho
        const handleRightDragMobile = (event: TouchEvent) => {
            event.preventDefault();

            const touch = event.touches[0];
            const touchX = touch.clientX;
            const touchY = touch.clientY;

            if (this.isRightTouchDown) {
                const deltaTouchX = touchX - this.lastTouchX;
                const deltaTouchY = touchY - this.lastTouchY;

                const rotationSpeed = 0.005; // Velocidad de rotación

                // Rotación alrededor del eje Y
                this.rotationAngleY += deltaTouchX * rotationSpeed;

                // Rotación alrededor del eje X
                this.rotationAngleX += deltaTouchY * rotationSpeed;

                //this.dibujarMalla(gl, programInfo, buffers);
            }

            this.lastTouchX = touchX;
            this.lastTouchY = touchY;
        };

        // Agregar el evento de clic derecho al canvas
        // Agrega un evento touchstart para detectar cuando se toca la pantalla
        const canvas = this.gl!.canvas as HTMLCanvasElement;
        canvas.addEventListener('touchstart', (event) => {
            // Guarda la posición del primer dedo que toca la pantalla
            const touch = event.touches[0];
            this.lastTouchX = touch.clientX;
            this.lastTouchY = touch.clientY;

            // Marca que se ha tocado la pantalla
            this.isRightTouchDown = true;
        });

        // Agrega un evento touchend para detectar cuando se levanta el dedo de la pantalla
        canvas.addEventListener('touchend', () => {
            // Reinicia las variables y señala que ya no se está tocando la pantalla
            this.lastTouchX = 0;
            this.lastTouchY = 0;
            this.isRightTouchDown = false;
        });

        // Agrega un evento touchmove para detectar cuando se mueve el dedo sobre la pantalla
        canvas.addEventListener('touchmove', handleRightDragMobile);
    
        // Enlazar el buffer de vértices        
        this.gl!.enableVertexAttribArray(InfoPrograma.attribLocations.vertexPosition);
        this.gl!.bindBuffer(this.gl!.ARRAY_BUFFER, mesh.vertexBuffer);
        this.gl!.vertexAttribPointer(InfoPrograma.attribLocations.vertexPosition, mesh.vertexBuffer.itemSize, this.gl!.FLOAT, false, 0, 0);
    
        // Enlazar el buffer de normales
        this.gl!.enableVertexAttribArray(InfoPrograma.attribLocations.normalCoord);
        this.gl!.bindBuffer(this.gl!.ARRAY_BUFFER, mesh.normalBuffer);
        this.gl!.vertexAttribPointer(InfoPrograma.attribLocations.normalCoord, mesh.normalBuffer.itemSize, this.gl!.FLOAT, false, 0, 0);
    
        // Enlazar el buffer de texturas
        this.gl!.enableVertexAttribArray(InfoPrograma.attribLocations.textureCoord);
        this.gl!.bindBuffer(this.gl!.ARRAY_BUFFER, mesh.normalBuffer);
        this.gl!.vertexAttribPointer(InfoPrograma.attribLocations.textureCoord, mesh.textureBuffer.itemSize, this.gl!.FLOAT, false, 0, 0);
    

        const draw = () => {
            this.dibujarBucle(InfoPrograma, mesh);
            requestAnimationFrame(draw); // Llamada recursiva para renderizar de forma continua
        };
        draw();
    }

    dibujarBucle(InfoPrograma: any, mesh: any){
        this.gl!.clearColor(1.0, 1.0, 1.0, 1.0);  // Fondo verde
        this.gl!.clearDepth(1.0);                 // Limpiar
        this.gl!.enable(this.gl!.DEPTH_TEST);           // Habilitar Z-Buffer
        this.gl!.depthFunc(this.gl!.LEQUAL);

        // Limpiar canvas
        this.gl!.clear(this.gl!.COLOR_BUFFER_BIT | this.gl!.DEPTH_BUFFER_BIT);

        // Matriz de proyeccion
        // TODO Pasar como parametro a la malla
        const projectionMatrix = mat4.create();
        mat4.perspective(
            projectionMatrix,
            (45 * Math.PI) / 180,
            this.gl!.canvas.width / this.gl!.canvas.height,
            0.1,
            100.0
        );
        // El centro de la escena
        const modelViewMatrix = mat4.create();

        // Aplicar las rotaciones al modelo
        mat4.rotate(modelViewMatrix, modelViewMatrix, this.rotationAngleX, [1, 0, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, this.rotationAngleY, [0, 1, 0]);
    
        // Enlazar el buffer de índices
        this.gl!.bindBuffer(this.gl!.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    
        // Usar el programa de shaders
        this.gl!.useProgram(InfoPrograma.program);
        this.gl!.uniformMatrix4fv(
            InfoPrograma.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        );
        // TODO matriz de vista. Este es solo un ejemplo
        // Definir la posición de la cámara
        let cameraPosition = vec3.fromValues(0, Math.sqrt(2) / 2, -5 * Math.sqrt(2));

        // Definir el punto al que la cámara está mirando
        let target = vec3.fromValues(0, 0, 0);

        // Definir la orientación hacia arriba de la cámara
        let up = vec3.fromValues(0, 1, 0);

        // Crear la matriz de vista
        let viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, cameraPosition, target, up);

        this.gl!.uniformMatrix4fv(
            InfoPrograma.uniformLocations.viewMatrix,
            false,
            viewMatrix
        );

        this.gl!.uniformMatrix4fv(
            InfoPrograma.uniformLocations.modelMatrix,
            false,
            modelViewMatrix
        );

        // Tell the shader we bound the texture to texture unit 0
        this.gl!.uniform1i(InfoPrograma.uniformLocations.uSampler, 0);

        // Bind de la textura
        this.gl!.activeTexture(this.gl!.TEXTURE0);
        this.gl!.bindTexture(this.gl!.TEXTURE_2D, this.texture);
    
        // Dibujar los elementos
        this.gl!.drawElements(this.gl!.TRIANGLES, mesh.indexBuffer.numItems, this.gl!.UNSIGNED_SHORT, 0);
    }

    async loadTexture(texturePath: string): Promise<WebGLTexture | null> {
        const texture = this.gl!.createTexture();
        this.gl!.bindTexture(this.gl!.TEXTURE_2D, texture);

        // Crear una imagen para la textura
        const image = new Image();
        image.onload = () => {
            // Asignar la imagen a la textura
            this.gl!.bindTexture(this.gl!.TEXTURE_2D, texture);
            this.gl!.texImage2D(this.gl!.TEXTURE_2D, 0, this.gl!.RGBA, this.gl!.RGBA, this.gl!.UNSIGNED_BYTE, image);

            // Configurar parámetros de la textura
            this.gl!.generateMipmap(this.gl!.TEXTURE_2D);
            this.gl!.texParameteri(this.gl!.TEXTURE_2D, this.gl!.TEXTURE_MIN_FILTER, this.gl!.LINEAR_MIPMAP_LINEAR);
            this.gl!.texParameteri(this.gl!.TEXTURE_2D, this.gl!.TEXTURE_WRAP_S, this.gl!.REPEAT);
            this.gl!.texParameteri(this.gl!.TEXTURE_2D, this.gl!.TEXTURE_WRAP_T, this.gl!.REPEAT);
        };
        image.src = texturePath;

        return texture;
    }
}
