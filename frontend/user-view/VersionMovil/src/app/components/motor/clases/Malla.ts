import { mat4, mat3, vec3, vec4 } from 'gl-matrix';
import * as OBJ from 'webgl-obj-loader';
import { motor } from '../motor.component';
import { glMatrix } from 'gl-matrix';
export class Malla {
    //BUFFERS
    private vertexBuffer: any;
    private normalBuffer: any;
    private indexBuffer: any;
    private textureBuffer: any;

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

    async getProgramInfo(gl: any, program: any, programColor: any){
        const programInfo = {
            program: program,
            programColor: programColor,
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

    async dibujar(textura: any, matTrans: any) {

        this.matTrans = matTrans;
        this.gl = motor.gl;
        const InfoPrograma = await this.getProgramInfo(this.gl, motor.program, motor.programColor);
    
        let mesh = OBJ.initMeshBuffers(this.gl as WebGL2RenderingContext, new OBJ.Mesh(this.OBJfile));

        // Cargar textura
        this.texture = await this.loadTexture(textura);

        const draw = () => {
            // Llamada recursiva para renderizar de forma continua
            this.dibujarBucle(InfoPrograma, mesh);
            requestAnimationFrame(draw);
        };
        draw();
    }

    dibujarBucle(InfoPrograma: any, mesh: any) {
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
        mat4.scale(this.projectionMatrix, this.projectionMatrix, [1, 1, motor.zoomFactor]);

        // Aplica el desplazamiento a la matriz de vista
        mat4.translate(this.viewMatrix, this.viewMatrix, [motor.traslacionX, motor.traslacionY, 0]);

        // Aplicar la rotación en torno al eje Y
        mat4.rotate(this.viewMatrix, this.viewMatrix, motor.rotacion*(Math.PI / 180), [0, 1, 0]);
        
        /*const frustum = this.extractFrustumPlanes(this.projectionMatrix, this.viewMatrix);

        // Definir las coordenadas mínimas y máximas de la caja de contención del objeto (AABB)
        let meshBounding = this.calculateBoundingBox(mesh);
    
        // Verificar si la AABB del objeto está dentro del frustum
        if (!this.isBoxInFrustum(frustum, meshBounding.min, meshBounding.max)) {
            // Si el objeto no está dentro del frustum, no se renderiza
            return;
        }*/

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

    calculateBoundingBox(mesh: any) {
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    
        const vertices = mesh.vertices;
    
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i + 1];
            const z = vertices[i + 2];
    
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (z < minZ) minZ = z;
    
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
            if (z > maxZ) maxZ = z;
        }
    
        return {
            min: [minX, minY, minZ],
            max: [maxX, maxY, maxZ]
        };
    }

    async extractFrustumPlanes(projectionMatrix: any, viewMatrix: any) {
        const frustum = [];
        const clipMatrix = mat4.create();
        mat4.multiply(clipMatrix, projectionMatrix, viewMatrix);
    
        for (let i = 0; i < 6; i++) {
            frustum.push(vec4.create());
        }
    
        // Right plane
        frustum[0][0] = clipMatrix[3] - clipMatrix[0];
        frustum[0][1] = clipMatrix[7] - clipMatrix[4];
        frustum[0][2] = clipMatrix[11] - clipMatrix[8];
        frustum[0][3] = clipMatrix[15] - clipMatrix[12];
    
        // Left plane
        frustum[1][0] = clipMatrix[3] + clipMatrix[0];
        frustum[1][1] = clipMatrix[7] + clipMatrix[4];
        frustum[1][2] = clipMatrix[11] + clipMatrix[8];
        frustum[1][3] = clipMatrix[15] + clipMatrix[12];
    
        // Bottom plane
        frustum[2][0] = clipMatrix[3] + clipMatrix[1];
        frustum[2][1] = clipMatrix[7] + clipMatrix[5];
        frustum[2][2] = clipMatrix[11] + clipMatrix[9];
        frustum[2][3] = clipMatrix[15] + clipMatrix[13];
    
        // Top plane
        frustum[3][0] = clipMatrix[3] - clipMatrix[1];
        frustum[3][1] = clipMatrix[7] - clipMatrix[5];
        frustum[3][2] = clipMatrix[11] - clipMatrix[9];
        frustum[3][3] = clipMatrix[15] - clipMatrix[13];
    
        // Far plane
        frustum[4][0] = clipMatrix[3] - clipMatrix[2];
        frustum[4][1] = clipMatrix[7] - clipMatrix[6];
        frustum[4][2] = clipMatrix[11] - clipMatrix[10];
        frustum[4][3] = clipMatrix[15] - clipMatrix[14];
    
        // Near plane
        frustum[5][0] = clipMatrix[3] + clipMatrix[2];
        frustum[5][1] = clipMatrix[7] + clipMatrix[6];
        frustum[5][2] = clipMatrix[11] + clipMatrix[10];
        frustum[5][3] = clipMatrix[15] + clipMatrix[14];
    
        // Normalize planes
        for (let i = 0; i < 6; i++) {
            const length = Math.sqrt(frustum[i][0] * frustum[i][0] +
                                     frustum[i][1] * frustum[i][1] +
                                     frustum[i][2] * frustum[i][2]);
            for (let j = 0; j < 4; j++) {
                frustum[i][j] /= length;
            }
        }
    
        return frustum;
    }
    

    async isBoxInFrustum(frustum: any, min: any, max: any) {
        for (let i = 0; i < 6; i++) {
            if (frustum[i][0] * min[0] + frustum[i][1] * min[1] + frustum[i][2] * min[2] + frustum[i][3] > 0) continue;
            if (frustum[i][0] * max[0] + frustum[i][1] * max[1] + frustum[i][2] * max[2] + frustum[i][3] > 0) continue;
            if (frustum[i][0] * min[0] + frustum[i][1] * max[1] + frustum[i][2] * min[2] + frustum[i][3] > 0) continue;
            if (frustum[i][0] * max[0] + frustum[i][1] * min[1] + frustum[i][2] * min[2] + frustum[i][3] > 0) continue;
            if (frustum[i][0] * min[0] + frustum[i][1] * min[1] + frustum[i][2] * max[2] + frustum[i][3] > 0) continue;
            if (frustum[i][0] * max[0] + frustum[i][1] * max[1] + frustum[i][2] * max[2] + frustum[i][3] > 0) continue;
            if (frustum[i][0] * min[0] + frustum[i][1] * max[1] + frustum[i][2] * max[2] + frustum[i][3] > 0) continue;
            if (frustum[i][0] * max[0] + frustum[i][1] * min[1] + frustum[i][2] * max[2] + frustum[i][3] > 0) continue;
    
            return false;
        }
        return true;
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