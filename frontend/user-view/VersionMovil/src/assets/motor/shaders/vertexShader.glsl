attribute vec3 aVertexPosition;    // Vertex position attribute
attribute vec3 aNormal;           // Normal attribute
attribute vec2 aTextureCoord;     //Coordenada de texturas 
attribute vec2 uSampler;


uniform mat4 uModelViewMatrix; // Model-view matrix
uniform mat4 uProjectionMatrix; // Projection matrix

varying vec3 Normal;
varying vec3 Position;
varying vec2 TextureCoord;
varying vec2 Sampler;

void main() {
    // Transform vertex position to clip space
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

    // Pass vertex normal to fragment shader (interpolated)
    Normal = aNormal;
    Position = aVertexPosition;
    TextureCoord = aTextureCoord;
    Sampler = uSampler;

}


