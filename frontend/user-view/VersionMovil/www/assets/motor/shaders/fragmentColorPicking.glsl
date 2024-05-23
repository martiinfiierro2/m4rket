#version 300 es
precision highp float;

uniform vec4 uColor;
out vec4 fragColor;

void main(void)
{
    fragColor = uColor;
}
