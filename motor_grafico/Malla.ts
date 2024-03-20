export class Malla {

    private vertices: number[][] = [];
    private normales: number[][] = [];
    private cordTex: number[][] = [];
    private indices: number[][] = [];
    //private texturas: Textura[];

    dibujar(){
        
    }


    setVertices( vecVertices: number[] ){
        console.log(vecVertices);
        this.vertices.push(vecVertices);
    }

    setNormales( vecNormales: number[]){
        this.normales.push(vecNormales);
    }

    setCordTex( vecCordTex: number[] ){
        this.cordTex.push(vecCordTex);
    }

    setIndices( vecIndices: number[] ){
        this.indices.push(vecIndices);
    }

    getVertices(){
        return this.vertices;
    }

    



}