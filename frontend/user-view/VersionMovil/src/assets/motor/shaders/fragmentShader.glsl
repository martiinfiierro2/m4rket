//SIMPLE + PHONG(PROFESOR)
precision mediump float;

// ENTRADA, PROVENIENTE DEL VERTEX SHADER
varying vec3 Position;   // VÉRTICES EN COORDINADAS DE VISTA
varying vec3 Normal;     // NORMAL EN COORDENADAS DE VISTA
varying vec2 TextureCoord;

uniform sampler2D uSampler;

void main () { 
    //VALORES PROVISIONALES
    highp vec4 LightPosition = vec4(40, 40, 40, 1);     
    highp vec3 LightIntensity = vec3(1.5, 1.5, 1.5);   
    highp vec3 Kd = vec3(0.1, 0.1, 0.1);                
    highp vec3 Ka = vec3(0.5, 0.5, 0.5);                
    highp vec3 Ks = vec3(0.1, 0.1,0.1);               
    highp float Shininess = float(200.0);        

    vec3 n = normalize(Normal);
    vec3 l = normalize(vec3(LightPosition) - Position);
    vec3 v = normalize(vec3(-Position));
    vec3 r = reflect(-l, n);
    vec3 light = LightIntensity * (Ka + Kd * max (dot (l, n), 0.0) + Ks * pow (max (dot (r,v), 0.0), Shininess));

    highp vec4 texelColor = texture2D(uSampler, TextureCoord);

    gl_FragColor = vec4 (light.rgb *  texelColor.rgb, texelColor.a);    
} 


