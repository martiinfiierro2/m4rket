precision mediump float;

// ENTRADA, PROVENIENTE DEL VERTEX SHADER
varying vec3 Position;   // VÉRTICES EN COORDINADAS DE VISTA
varying vec3 Normal;     // NORMAL EN COORDENADAS DE VISTA


// SALIDA PARA COMUNICAR CON EL RESTO DEL PIPELINE
//varying vec4 FragColor; //COLOR DEL FRAGMENTO

// ESTADO DE OPENGL
/*
uniform vec4 LightPosition;     // POSICIÓN DE LA LUZ EN COORDENADAS DE VISTA
uniform vec3 LightIntensity;    // INTENSIDAD DE LA LUZ (MISMA PARA AMB., ESP. Y DIF.)
uniform vec3 Kd;                // COMPONENTE DIFUSA DEL MATERIAL
uniform vec3 Ka;                // COMPONENTE AMBIENTAL DEL MATERIAL
uniform vec3 Ks;                // COMPONENTE ESPECULAR DEL MATERIAL
uniform float Shininess;        // FACTOR DE BRILLO DEL MATERIAL
*/

// FUNCION QUE CALCULA EL MODELO DE PHONG
vec3 Phong() {


    //VALORES PROVISIONALES
    highp vec4 LightPosition = vec4(200, 200, 200, 10);     
    highp vec3 LightIntensity = vec3(1.5, 1.5, 1.5);   
    highp vec3 Kd = vec3(0.5, 0.5, 0.5);                
    highp vec3 Ka = vec3(0.5, 0.5, 0.5);                
    highp vec3 Ks = vec3(0.5, 0.5,0.5);               
    highp float Shininess = float(100.0);        



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


