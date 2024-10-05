export class Producto {
    constructor(
        public codigo: string,
        public nombre: string,
        public unidad: string,
        public descripcion: string,
        public familia:string,
        public categoria:string,
        public id_categoria:string,
        public subcategoria:string,
        public id_subcategoria:string,
        public marca:string,
        public costo:string,
        public precio:string,
        public peso:string,
        public ISCTypeDesc:string,
        public FlagICBPER:string,
        public FlagLotSerial:string,
        public usuario:string
    ){}
}

