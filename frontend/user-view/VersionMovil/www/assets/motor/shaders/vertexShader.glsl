attribute vec3 aVertexPosition;    // Vertex position attribute
attribute vec3 aNormalCoord;       // Normal attribute
attribute vec2 aTextureCoord;      // Coordenada de texturas 
attribute vec2 aDifferentName;     // Cambiado de uSampler a aDifferentName para evitar conflicto

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 Normal;
varying vec3 Position;
varying vec2 TextureCoord;

void main() {
    gl_Position = uProjectionMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);

    Normal = aNormalCoord;
    Position = aVertexPosition;
    TextureCoord = aTextureCoord;
}
