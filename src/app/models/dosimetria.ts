export class Dosimetria {
    constructor(
        public id:number,
        public codigo:string,
        public descripcion:string,
        public unidad:string,
        public inventario_inicial:number,
        public fecha_registro:string,
        public usuario:string
        ){}
}