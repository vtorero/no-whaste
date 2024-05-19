import { DetalleCompra } from "./detalleCompra";

export class Compra {
    constructor(
        public id:number,
        public comprobante:string,
        public num_comprobante:string,
        public descripcion:string,
        public fecha:string,
        public id_proveedor:string,
        public razon_social :string,
        public id_usuario:string,
        public detalleCompra:Array<DetalleCompra>,
        public total:number
        ){}
}
