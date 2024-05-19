import { Boleta } from "./Boleta/boleta";
import { DetalleVenta } from "./detalleVenta";
export class Venta {
    constructor(
        public id:number,
        public id_usuario:string,
        public id_vendedor:any,
        public cliente:any,
        public	estado:number,
        public comprobante:string,
        public nro_comprobante:string,
        public fecha:any,
        public fechaPago:any,
        public igv:number,
        public monto_igv:number,
        public valor_total:number,
        public detalleVenta:Array<DetalleVenta>,
        public imprimir:boolean,
        public tipoDoc:string,
        public valor_neto:number,
        public observacion:string,
        public boleta:Boleta,
        public formaPago:string
        ){}
}