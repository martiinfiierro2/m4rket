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


