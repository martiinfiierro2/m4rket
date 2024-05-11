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


