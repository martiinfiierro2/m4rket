//SIMPLE
/*
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
*/



//PHONG PROFESOR
/*
precision mediump float;

// ENTRADA, PROVENIENTE DEL VERTEX SHADER
varying vec3 Position;   // VÉRTICES EN COORDINADAS DE VISTA
varying vec3 Normal;     // NORMAL EN COORDENADAS DE VISTA


// SALIDA PARA COMUNICAR CON EL RESTO DEL PIPELINE
//varying vec4 FragColor; //COLOR DEL FRAGMENTO


// FUNCION QUE CALCULA EL MODELO DE PHONG
vec3 Phong() {


    //VALORES PROVISIONALES
    highp vec4 LightPosition = vec4(40, 40, 40, 1);     
    highp vec3 LightIntensity = vec3(1.0, 0.0, 0.0);   
    highp vec3 Kd = vec3(0.1, 0.1, 0.1);                
    highp vec3 Ka = vec3(0.5, 0.5, 0.5);                
    highp vec3 Ks = vec3(0.5, 0.5,0.5);               
    highp float Shininess = float(200.0);        

    vec3 n = normalize(Normal);
    vec3 l = normalize(vec3(LightPosition) - Position);
    vec3 v = normalize(vec3(-Position));
    vec3 r = reflect(-l, n);
    vec3 light = LightIntensity * (Ka + Kd * max (dot (l, n), 0.0) + Ks * pow (max (dot (r,v), 0.0), Shininess));

    return light;
}

void main () { // CALCULAR EL COLOR DEL FRAGMENTO
    //FragColor = vec4 (Phong(), 1.0);
    gl_FragColor = vec4 (Phong(), 1.0);
} 
*/



//PHONG 2
/*
precision mediump float;

varying vec3 normalInterp;  // Surface normal
varying vec3 vertPos;       // Vertex position


void main() {

    //VALORES PROVISIONALES
    highp float Ka = 0.0;   // Ambient reflection coefficient
    highp float Kd = 0.5;   // Diffuse reflection coefficient
    highp float Ks = 0.0;    // Specular reflection coefficient
    highp float shininessVal = 210.0;    // Shininess

    // Material color
    highp vec3 ambientColor = vec3(250,250,250);
    highp vec3 diffuseColor = vec3(204,0,0);
    highp vec3 specularColor = vec3(204,0,0);
    highp vec3 lightPos = vec3(-1,1,1); // Light position


    vec3 N = normalize(normalInterp);
    vec3 L = normalize(lightPos - vertPos);

    // Lambert's cosine law
    float lambertian = max(dot(N, L), 0.0);
    float specular = 0.0;
    if(lambertian > 0.0) {
        vec3 R = reflect(-L, N);      // Reflected light vector
        vec3 V = normalize(-vertPos); // Vector to viewer
        // Compute the specular term
        float specAngle = max(dot(R, V), 0.0);
        specular = pow(specAngle, shininessVal);
    }
    gl_FragColor = vec4(Ka * ambientColor + Kd * lambertian * diffuseColor + Ks * specular * specularColor, 1.0);

}
*/


//PHONG 3 (CHATGPT)
/*
precision mediump float;

varying vec3 normal; // Normal from vertex shader


void main() {

    //VALORES PROVISIONALES
    highp vec3 uKa = vec3(0.5, 1.0, 1.0);   // Ambient material color
    highp vec3 uKd = vec3(0.5, 0.0, 0.0);   // Diffuse material color
    highp vec3 uKs = vec3(0.5, 0.5, 0.5);    // Specular material color
    highp float uShininess = 60.0;    // Shininess
    highp vec3 uLightPosition = vec3(1,1,1); // Light position
    highp vec3 uLightColor = vec3(0.5,0.0,0.0);



    // Normalize the normal
    vec3 n = normalize(normal);

    // Calculate light direction
    vec3 l = normalize(uLightPosition - gl_FragCoord.xyz);

    // Calculate half vector (for specular reflection)
    vec3 h = normalize(l + normalize(gl_FragCoord.xyz - uLightPosition));

    // Diffuse lighting calculation
    float diffuseFactor = max(dot(n, l), 0.0);
    vec3 diffuseLight = uKd * diffuseFactor * uLightColor;

    // Specular lighting calculation
    float specularFactor = max(dot(n, h), 0.0);
    float specularPower = pow(specularFactor, uShininess);
    vec3 specularLight = uKs * specularPower * uLightColor;

    // Calculate final fragment color
    vec3 finalColor = uKa * uLightColor + diffuseLight + specularLight;

    // Clamp color values to avoid over-brightening
    finalColor = clamp(finalColor, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, 1.0);
}
*/



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
    highp vec3 LightIntensity = vec3(1.0, 1.0, 1.0);   
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


