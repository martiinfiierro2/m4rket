function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) {
        console.error('No se pudo crear el shader.');
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
    const program = gl.createProgram();
    if (!program) {
        console.error('No se pudo crear el programa.');
        return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
}

function main() {
    const canvas = document.querySelector("#modelo") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl");
    if (!gl) {
        console.error('No se pudo obtener el contexto WebGL.');
        return;
    }

    const vertexShaderSource = document.querySelector("#vertex-shader-2d")?.textContent;
    const fragmentShaderSource = document.querySelector("#fragment-shader-2d")?.textContent;

    if (!vertexShaderSource || !fragmentShaderSource) {
        console.error('No se pudo obtener el código fuente de los shaders.');
        return;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
        console.error('No se pudo crear uno o ambos shaders.');
        return;
    }

    const program = createProgram(gl, vertexShader, fragmentShader);

    if (!program) {
        console.error('No se pudo crear el programa.');
        return;
    }

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        0, -0.5,
        0, 0.5,
        0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

main();
