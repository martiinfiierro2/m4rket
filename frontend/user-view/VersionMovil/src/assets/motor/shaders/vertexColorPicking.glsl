layout(location = 0) in vec4 VertexPosition;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

void main()
{
    mat4 mvp = uProjectionMatrix * uModelMatrix * uViewMatrix;
    gl_Position = mvp * VertexPosition;
}