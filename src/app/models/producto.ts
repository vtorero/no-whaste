export class Producto {
    constructor(
        public id:number,
        public codigo:string,
        public nombre:string,
        public peso:number,
        public nombrecategoria:string,
        public costo: number,
        public igv : number,
        public precio:number,
        public id_categoria:number,
        public id_subcategoria:number,
        public usuario:string
    ){}
}
