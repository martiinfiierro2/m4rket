import { mat4, mat3, vec3 } from 'gl-matrix';
import * as OBJ from 'webgl-obj-loader';
import { motor } from '../motor.component';
import { glMatrix } from 'gl-matrix';
export class Malla {
    //BUFFERS
    private vertexBuffer: any;
    private normalBuffer: any;
    private indexBuffer: any;
    private textureBuffer: any;
    
    private rotation: number = 0;
    private lastTouchX: number = 0;
    private lastTouchY: number = 0;
    private isRightTouchDown: boolean = false;

    private translationX: number = 0;
    private translationY: number = 0;
    private translationSpeed!: number;

    private zoomFactor: number = 1;
    private zoomSpeed!: number;
    private distancia: number = 0;
    private lastPinchDistance: number = 0;
    private isPinching: boolean = false;

    private matTrans!: any;
    private gl!: WebGL2RenderingContext;
    private program!: WebGLProgram;
    private OBJfile: string;
    private nombre: string;
    private texture: WebGLTexture | null = null;
    private projectionMatrix!: mat4;
    private viewMatrix!: mat4;

    constructor(malla: string, filename: string) {
        this.OBJfile = malla;
        this.nombre = filename;
    }

    async getProgramInfo(gl: any, program: any){
        const programInfo = {
            program: program,
            attribLocations: {
                vertexPosition: this.gl!.getAttribLocation(program, "aVertexPosition"),
                textureCoord: this.gl!.getAttribLocation(program, "aTextureCoord"),
                normalCoord: this.gl!.getAttribLocation(program, "aVertexNormal")
            },
            uniformLocations: {
                projectionMatrix: this.gl!.getUniformLocation(program,"uProjectionMatrix"),
                viewMatrix: this.gl!.getUniformLocation(program, "uViewMatrix"),
                modelMatrix: this.gl!.getUniformLocation(program, "uModelMatrix"),
                uSampler: this.gl!.getUniformLocation(program, "uSampler"),
                normalMatrix: this.gl!.getUniformLocation(program, "uNormalMatrix"),
                modelViewMatrix: this.gl!.getUniformLocation(program, "uModelViewMatrix")
            }
        };
        return programInfo;
    }

    setRotacion(valor: number){
        console.log(valor);
    }

    async dibujar(textura: any, matTrans: any) {

        this.matTrans = matTrans;
        this.gl = motor.gl;
        this.program = motor.program;
        const InfoPrograma = await this.getProgramInfo(this.gl, this.program);
    
        let mesh = OBJ.initMeshBuffers(this.gl as WebGL2RenderingContext, new OBJ.Mesh(this.OBJfile));

        // Cargar textura
        this.texture = await this.loadTexture(textura);
        
        // Función para manejar el evento de arrastre con clic derecho
        const handleRightDragMobile = (event: TouchEvent) => {
            event.preventDefault();

            const touch = event.touches[0];
            const touchX = touch.clientX;
            const touchY = touch.clientY;

            if (this.isRightTouchDown) {
                const deltaTouchX = touchX - this.lastTouchX;
                const deltaTouchY = touchY - this.lastTouchY;

                this.translationSpeed = 0.1; // Velocidad de rotación

                // Rotación alrededor del eje Y
                this.translationX += deltaTouchX * this.translationSpeed;

                // Rotación alrededor del eje X
                this.translationY += deltaTouchY * this.translationSpeed;

                //this.dibujarMalla(gl, programInfo, buffers);
            }

            this.lastTouchX = touchX;
            this.lastTouchY = touchY;
        };

        const handlePinch = (event: TouchEvent) => {
            event.preventDefault();
    
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
        
            // Calcula la distancia entre los dos puntos de contacto
            const deltaX = touch1.clientX - touch2.clientX;
            const deltaY = touch1.clientY - touch2.clientY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
            // Calcula la diferencia de distancia desde el último pellizco
            const deltaDistance = distance - this.lastPinchDistance;

            // Ajusta el factor de zoom en función de la diferencia de distancia
            this.zoomSpeed = 0.05; // Velocidad de zoom
            this.zoomFactor *= 1 + deltaDistance * this.zoomSpeed;

            // Actualiza la última distancia de pellizco
            this.lastPinchDistance = distance;
        }
    
        // Método para manejar el evento de final de pellizco (pinch)
        const handlePinchEnd = (event: TouchEvent) => {
            event.preventDefault();
    
            this.isPinching = false;
        };

        const handleMouseWheel = (event: WheelEvent) => {
            const delta = event.deltaY;
            if(delta > 0){
                this.zoomFactor += 0.01;
            }
            else if (delta < 0){
                this.zoomFactor += -0.01;
            }
        };
            
        // Agregar el evento de clic derecho al canvas
        // Agrega un evento touchstart para detectar cuando se toca la pantalla
        const canvas = this.gl!.canvas as HTMLCanvasElement;
        canvas.addEventListener('wheel', (event) => {
            // Verificar si el evento es una rueda del ratón y no un toque
            if (event.type === 'wheel') {
                handleMouseWheel(event as WheelEvent);
            }
        });

        canvas.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            this.lastTouchX = touch.clientX;
            this.lastTouchY = touch.clientY;
    
            if (event.touches.length === 2) {
                this.isPinching = true;
            } else {
                this.isRightTouchDown = true;
            }
        });
    
        canvas.addEventListener('touchmove', (event) => {
            //const pinchInterval = setInterval(() => {
                if (event.touches.length === 2) {
                    handlePinch(event);
                } else {
                    handleRightDragMobile(event);
                }
            //}, 100);
        });
    
        canvas.addEventListener('touchend', (event) => {
            if (event.touches.length === 0) {
                this.isRightTouchDown = false;
                handlePinchEnd(event);
            }
        });

        const draw = () => {
            // Llamada recursiva para renderizar de forma continua
            this.dibujarBucle(InfoPrograma, mesh);
            requestAnimationFrame(draw);
        };
        draw();
    }

    dibujarBucle(InfoPrograma: any, mesh: any) {
        const valorRotacion = document.querySelector<HTMLInputElement>('#rotacion');
        if(valorRotacion){
            this.rotation = parseInt(valorRotacion.value);
        }

        this.gl!.viewport(0, 0, this.gl!.canvas.width/2, this.gl!.canvas.height/2)
        const camara = motor.camaraActiva.getEntidad();

        this.projectionMatrix = mat4.create();
        
        mat4.perspective(
            this.projectionMatrix,
            (45 * Math.PI) / 180,
            this.gl!.canvas.width / this.gl!.canvas.height,
            camara.cercano,
            camara.lejano
        );

        // Enlazar el buffer de vértices
        this.gl!.enableVertexAttribArray(InfoPrograma.attribLocations.vertexPosition);
        this.gl!.bindBuffer(this.gl!.ARRAY_BUFFER, mesh.vertexBuffer);
        this.vertexBuffer = mesh.vertexBuffer;
        //this.gl!.bufferData(this.gl!.ARRAY_BUFFER, new Float32Array(mesh.vertices), this.gl!.STATIC_DRAW);
        this.gl!.vertexAttribPointer(InfoPrograma.attribLocations.vertexPosition, mesh.vertexBuffer.itemSize, this.gl!.FLOAT, false, 0, 0);
    
        // Enlazar el buffer de texturas
        this.gl!.enableVertexAttribArray(InfoPrograma.attribLocations.textureCoord);
        this.gl!.bindBuffer(this.gl!.ARRAY_BUFFER, mesh.textureBuffer);
        this.textureBuffer = mesh.textureBuffer;
        //this.gl!.bufferData(this.gl!.ARRAY_BUFFER, new Float32Array(mesh.textures), this.gl!.STATIC_DRAW);
        this.gl!.vertexAttribPointer(InfoPrograma.attribLocations.textureCoord, mesh.textureBuffer.itemSize, this.gl!.FLOAT, false, 0, 0);
        
        // Enlazar el buffer de normales
        this.gl!.enableVertexAttribArray(InfoPrograma.attribLocations.normalCoord);
        this.gl!.bindBuffer(this.gl!.ARRAY_BUFFER, mesh.normalBuffer);
        this.normalBuffer = mesh.normalBuffer;
        //this.gl!.bufferData(this.gl!.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), this.gl!.STATIC_DRAW);
        this.gl!.vertexAttribPointer(InfoPrograma.attribLocations.normalCoord, mesh.normalBuffer.itemSize, this.gl!.FLOAT, false, 0, 0);
    
        // Enlazar el buffer de índices
        this.gl!.bindBuffer(this.gl!.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
        this.indexBuffer = mesh.indexBuffer;
    
        // Crear una nueva matriz de transformación para este objeto
        const modelMatrix = mat4.create();

        // Aplicar la matriz de transformación proporcionada
        mat4.copy(modelMatrix, this.matTrans);
    
        let MatrizCamara = motor.camaraActiva.getMatrizTransf();
    
        // Extraer la posición de la cámara (los primeros tres elementos de la cuarta columna)
        let cameraPosition = vec3.fromValues(
            MatrizCamara[12],
            MatrizCamara[13],
            MatrizCamara[14]
        );
    
        // Extraer el "target" (los primeros tres elementos de la primera fila)
        let target = vec3.fromValues(
            MatrizCamara[12] + MatrizCamara[8],
            MatrizCamara[13] + MatrizCamara[9],
            MatrizCamara[14] + MatrizCamara[10]
        );
    
        // Extraer el vector "up" (los siguientes tres elementos de la primera fila)
        let up = vec3.fromValues(
            MatrizCamara[4],
            MatrizCamara[5],
            MatrizCamara[6]
        );
    
        this.viewMatrix = mat4.create();
    
        mat4.lookAt(this.viewMatrix, cameraPosition, target, up);

        // Aplica el zoom a la matriz de proyección
        if(this.zoomFactor >= 0.1){
            mat4.scale(this.projectionMatrix, this.projectionMatrix, [1, 1, this.zoomFactor]);
        }
        else{
            mat4.scale(this.projectionMatrix, this.projectionMatrix, [1, 1, 0.1]);
        }

        // Aplica el desplazamiento a la matriz de vista
        mat4.translate(this.viewMatrix, this.viewMatrix, [-this.translationX, -this.translationY, 0]);

        // Aplicar la rotación en torno al eje Y
        mat4.rotate(this.viewMatrix, this.viewMatrix, this.rotation*(Math.PI / 180), [0, 1, 0]);

        
        let modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, this.viewMatrix, modelMatrix);

        //Crear matriz normales
        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
   
        // Usar el programa de shaders
        this.gl!.useProgram(InfoPrograma.program);
        this.gl!.uniformMatrix4fv(
            InfoPrograma.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix
        );

        this.gl!.uniformMatrix4fv(
            InfoPrograma.uniformLocations.viewMatrix,
            false,
            this.viewMatrix
        );

        this.gl!.uniformMatrix4fv(
            InfoPrograma.uniformLocations.modelMatrix,
            false,
            modelMatrix
        );

        this.gl!.uniformMatrix4fv(
            InfoPrograma.uniformLocations.normalMatrix,
            false,
            normalMatrix
        );

        this.gl!.uniformMatrix4fv(
            InfoPrograma.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix
        );

        
        // Tell the shader we bound the texture to texture unit 0
        this.gl!.uniform1i(InfoPrograma.uniformLocations.uSampler, 0);
        this.gl!.viewport(0, 0, this.gl!.canvas.width, this.gl!.canvas.height);

        // Bind de la textura
        this.gl!.activeTexture(this.gl!.TEXTURE0);
        this.gl!.bindTexture(this.gl!.TEXTURE_2D, this.texture);
            
        // Dibujar los elementos
        this.gl!.drawElements(
            this.gl!.TRIANGLES,
            mesh.indexBuffer.numItems,
            this.gl!.UNSIGNED_SHORT,
            0
        );
    }

  async loadTexture(nomTextura: any) {
    let textura = await motor.gestorRecursos.getRecurso(nomTextura, 'textura');

        //Cargar textura
        const texture = this.gl!.createTexture();

        // Crear una imagen para la textura
        const image = new Image();
        if(nomTextura != 'gris.jpg' && nomTextura != 'grisclaro.jpeg' && nomTextura != 'blanco.jpeg'){
            await textura.cargarFicheroAPI(nomTextura).then((blob: any) => {
                image.crossOrigin = "anonymous"
                image.onload = () => {
                    // Asignar la imagen a la textura
                    this.gl!.bindTexture(this.gl!.TEXTURE_2D, texture);
                    
                    this.gl!.texImage2D(this.gl!.TEXTURE_2D, 0, this.gl!.RGBA, this.gl!.RGBA, this.gl!.UNSIGNED_BYTE, image);
                    // Configurar parámetros de la textura
                    if (this.isPot2(image.width) && this.isPot2(image.height)) {
                        this.gl!.generateMipmap(this.gl!.TEXTURE_2D);
                    }
                    else{
                        this.gl!.texParameteri(this.gl!.TEXTURE_2D, this.gl!.TEXTURE_WRAP_S, this.gl!.CLAMP_TO_EDGE);
                        this.gl!.texParameteri(this.gl!.TEXTURE_2D, this.gl!.TEXTURE_WRAP_T, this.gl!.CLAMP_TO_EDGE);
                        this.gl!.texParameteri(this.gl!.TEXTURE_2D, this.gl!.TEXTURE_MIN_FILTER, this.gl!.NEAREST);
                    }
                    
                };
                image.src = URL.createObjectURL(blob);
            });
        }
        else{
            await textura.cargarFichero(nomTextura).then((blob: any) => {
                image.crossOrigin = "anonymous"
                image.onload = () => {
                    // Asignar la imagen a la textura
                    this.gl!.bindTexture(this.gl!.TEXTURE_2D, texture);
                    
                    this.gl!.texImage2D(this.gl!.TEXTURE_2D, 0, this.gl!.RGBA, this.gl!.RGBA, this.gl!.UNSIGNED_BYTE, image);
                    // Configurar parámetros de la textura
                    if (this.isPot2(image.width) && this.isPot2(image.height)) {
                        this.gl!.generateMipmap(this.gl!.TEXTURE_2D);
                    }
                    else{
                        this.gl!.texParameteri(this.gl!.TEXTURE_2D, this.gl!.TEXTURE_WRAP_S, this.gl!.CLAMP_TO_EDGE);
                        this.gl!.texParameteri(this.gl!.TEXTURE_2D, this.gl!.TEXTURE_WRAP_T, this.gl!.CLAMP_TO_EDGE);
                        this.gl!.texParameteri(this.gl!.TEXTURE_2D, this.gl!.TEXTURE_MIN_FILTER, this.gl!.LINEAR);
                    }
                    
                };
                image.src = URL.createObjectURL(blob);
            });
        }
        return texture;
    }

  isPot2(valor: any) {
    return (valor & (valor - 1)) === 0;
  }
}