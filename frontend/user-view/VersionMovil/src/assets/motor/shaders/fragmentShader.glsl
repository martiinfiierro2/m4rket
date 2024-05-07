varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;

void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
    
    // Aplica iluminación al color RGB de la textura
    highp vec3 finalColor = texelColor.rgb * vLighting;
    
    // Multiplica el valor alfa de la textura por el color final
    gl_FragColor = vec4(finalColor, texelColor.a);
}