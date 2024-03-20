import { TRecurso } from "./TRecurso";
import { Malla } from "./Malla";
var fs = require('fs');

export class TRecursoMalla extends TRecurso {
    
    private mallas: Malla[] = [];

    constructor(nombre: string) {
        super(nombre);
    }

    cargarFichero(nombreFichero: string) {
        // Hacer una petición HTTP o leer el archivo usando el API de File del lado del cliente
        // Aquí se muestra un ejemplo de cómo hacer una petición HTTP para leer el archivo
        // Suponiendo que el archivo se encuentra en el servidor y se puede acceder a través de una URL
        
        const url = 'URL_DEL_ARCHIVO/' + nombreFichero;
        fetch(url)
            .then(response => response.text())
            .then(fileContent => {
                const lines: string[] = fileContent.split('\n');
                
                let nuevaMalla = new Malla(); // Inicializamos una malla nueva fuera del bucle
                let vertices: number[] = [];
                let texturasCoordinate: number[] = [];
                let normal: number[] = [];
                let indices: number[] = [];
                
                lines.forEach((line: string) => {
                    const parts: string[] = line.trim().split(/\s+/);
                    const type: string = parts[0]; // Cambiado a parts[0]
                    
                    switch (type) {
                        case 'o':
                            if(nuevaMalla.getVertices.length > 0){
                                nuevaMalla.setIndices(indices);
                                nuevaMalla.setNormales(normal);
                                nuevaMalla.setCordTex(texturasCoordinate);
                                nuevaMalla.setVertices(vertices);
                                this.mallas.push(nuevaMalla);
                                nuevaMalla = new Malla();
                            }
                            break;
                
                        case 'v':
                            vertices.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
                            break;
                
                        case 'vt':
                            texturasCoordinate.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
                            break;
                
                        case 'vn':
                            normal.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
                            break;
                
                        case 'f':
                            indices.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
                            break;
                    }
                });
                nuevaMalla.setIndices(indices);
                nuevaMalla.setNormales(normal);
                nuevaMalla.setCordTex(texturasCoordinate);
                nuevaMalla.setVertices(vertices);
                this.mallas.push(nuevaMalla);
            })
            .catch(error => console.error('Error al cargar el archivo:', error));
    }

    draw(): void {
        for (let i = 0; i < this.mallas.length; i++) {
            this.mallas[i].dibujar();
        }
    }
}
