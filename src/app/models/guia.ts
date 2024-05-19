import { Destinatario } from "./destinatario";
import { DetalleVenta } from "./detalleVenta";
export class Guia {
    constructor(
        public id:number,
        public id_usuario:string,
        public tipo_destinatario:string,
        public destinatario:any,
        public num_documento:any,
        public name_destinatario:string,
        public nro_transportista:string,
        public nombre_transportista:string,
        public nro_placa:string,
        public estado:number,
        public nro_documento:string,
        public nro_guia:string,
        public fechaemision:Date,
        public nro_bultos:number,
        public peso_bruto:number,
        public valor_total:number,
        public detalleVenta:Array<DetalleVenta>,
        public imprimir:boolean,
        public observacion:string,
        public ubigeo_partida:string,
        public partida:string,
        public ubigeo_llegada:string,
        public llegada:string,

        ){}
}