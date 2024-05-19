import { DetalleVenta } from "./detalleVenta";
export class NotaCredito {
    constructor(
        public id:number,
        public tipDocAfectado:string,
        public numDocfectado:string,
        public codMotivo:string,
        public desMotivo:string,
        public tipoDoc:string,
        public id_usuario:string,
        public id_vendedor:number,
        public cliente:any,
        public num_documento:any,
        public nro_nota:any,
        public direccion:any,
        public	estado:number,
        public comprobante:string,
        public nro_comprobante:string,
        public fecha:Date,
        public igv:number,
        public monto_igv:number,
        public valor_total:number,
        public detalleVenta:Array<DetalleVenta>,
        public imprimir:boolean,
        public valor_neto:number
        ){}
}