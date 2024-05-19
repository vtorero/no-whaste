export class Inventario {
        constructor(
        public id:number,
        public id_producto:number,
        public granel :number,
        public cantidad:number,
        public peso:number,
        public merma:number,
        public estado:number,
        public ciclo:number,
        public id_usuario:number,
        public presentacion:string,
        public unidad:string,
        public observacion:string,
        public fecha_produccion:any,
        public fecha_vencimiento:any,
        public nombre:string
        ){}
}
