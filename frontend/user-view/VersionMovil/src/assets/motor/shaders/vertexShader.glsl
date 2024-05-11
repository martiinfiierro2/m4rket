//SIMPLE
/*
attribute vec3 aVertexPosition;
attribute vec3 aNormalCoord;
attribute vec2 aTextureCoord;
                                    
uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uNormalMatrix;
                                    
varying vec3 vNormal;
varying vec2 vTextureCoord;
varying highp vec3 vLighting;
                                    
void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;

    // Apply lighting effect

    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1.0, 1.0, 0.0); //Color verde
    highp vec3 directionalVector = normalize(vec3(0, 0, 1));  //Apunta desde en frente

    highp vec4 transformedNormal = uNormalMatrix * vec4(aNormalCoord, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
    //vLighting = (directionalLightColor * directional);

}
*/



//PHONG PROFESOR
/*
// ATRIBUTOS
attribute vec4 aVertexPosition;   // VÉRTICE EN SIT. COORD. LOCAL
attribute vec3 aNormalCoord;     // NORMAL EN SIT. COORD. LOCAL


// ESTADO DE OPENGL
uniform mat4 uModelMatrix;       //M. DE MODELO
uniform mat4 uViewMatrix;        // M. DE VISTA
uniform mat3 uNormalMatrix;      // M. DE NORMALES
uniform mat4 uProjectionMatrix;  // MATRIZ DE PROYECCIÓN
//uniform mat4 uModelViewMatrix;    //M. MODELO-VISTA


// SALIDA PARA COMUNICAR CON EL FRAGMENT
varying vec3 Position;   // VÉRTICE EN COORDINADAS DE VISTA
varying vec3 Normal;     // NORMAL EN COORDENADAS DE VISTA


void main() {

    //CÁLCULO MATRIZ MODELO-VISTA
    highp mat4 ModelViewMatrix = uModelMatrix * uViewMatrix;

    //CÁLCULO MATRIZ MODELO-VISTA-PROYECCIÓN
    highp mat4 MVP = ModelViewMatrix * uProjectionMatrix;

    // TRANSFORMAR EL VÉRTICE Y LA NORMAL A COORDENADAS DE VISTA (calculo variables)
    highp vec3 vertexToClip = vec3(ModelViewMatrix * aVertexPosition);
    highp vec3 worldNormal = normalize(uNormalMatrix * aNormalCoord);
    
    // TRANSFORMAR EL VÉRTICE Y LA NORMAL A COORDENADAS DE VISTA (asingacion variables)
    Position = vertexToClip;
    Normal = worldNormal;

    // TRANSFORMACIÓN COMPLETA DEL VÉRTICE
    gl_Position = MVP * aVertexPosition;
}
*/


//PHONG 2
/*
attribute vec3 aVertexPosition;
attribute vec3 aNormalCoord;

uniform mat4 uProjectionMatrix, uNormalMatrix, uModelMatrix, uViewMatrix;

varying vec3 normalInterp;
varying vec3 vertPos;

void main(){

    highp mat4 ModelViewMatrix = uModelMatrix * uViewMatrix;

    vec4 vertPos4 = ModelViewMatrix * vec4(aVertexPosition, 1.0);
    vertPos = vec3(vertPos4) / vertPos4.w;
    normalInterp = vec3(uNormalMatrix * vec4(aNormalCoord, 0.0));
    gl_Position = uProjectionMatrix * vertPos4;
}
*/


//PHONG 3 (CHATGPT)

attribute vec3 aVertexPosition; // Vertex position attribute
attribute vec3 aNormal;           // Normal attribute

uniform mat4 uModelViewMatrix; // Model-view matrix
uniform mat4 uProjectionMatrix; // Projection matrix

varying vec3 normal;

void main() {
    // Transform vertex position to clip space
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

    // Pass vertex normal to fragment shader (interpolated)
    normal = aNormal;
}




