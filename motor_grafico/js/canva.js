function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    if (!shader) {
        console.error('No se pudo crear el shader.');
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
}
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    if (!program) {
        console.error('No se pudo crear el programa.');
        return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
}
function main() {
    var _a, _b;
    var canvas = document.querySelector("#modelo");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        console.error('No se pudo obtener el contexto WebGL.');
        return;
    }
    var vertexShaderSource = (_a = document.querySelector("#vertex-shader-2d")) === null || _a === void 0 ? void 0 : _a.textContent;
    var fragmentShaderSource = (_b = document.querySelector("#fragment-shader-2d")) === null || _b === void 0 ? void 0 : _b.textContent;
    if (!vertexShaderSource || !fragmentShaderSource) {
        console.error('No se pudo obtener el código fuente de los shaders.');
        return;
    }
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) {
        console.error('No se pudo crear uno o ambos shaders.');
        return;
    }
    var program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
        console.error('No se pudo crear el programa.');
        return;
    }
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [
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
