

export class Malla {

    private vertices: number[];
    private normales: number[];
    private cordTex: number[];
    private indices: number[];
    //private texturas: Textura[];

    dibujar(){
        
    }


    setVertices( vecVertices: number[] ){
       this.vertices = vecVertices;
    }

    setNormales( vecNormales: number[]){
        this.normales = vecNormales;
    }

    setCordTex( vecCordTex: number[] ){
        this.cordTex = vecCordTex;
    }

    setIndices( vecIndices: number[] ){
        this.indices = vecIndices;
    }

    



}