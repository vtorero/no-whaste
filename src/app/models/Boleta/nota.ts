import { Client } from "./cliente";
import { Company } from "./company";
import { Details } from "./details";
export class Nota {
    constructor(
        public tipDocAfectado:string,
        public numDocfectado: string,
        public codMotivo: string,
        public desMotivo:string,
        public tipoDoc:string,
        public serie:string,
        public correlativo:string,
        public fechaEmision:Date,
        public tipoMoneda:string,
        public cliente:Client,
        public company:Company,
        public mtoOperGravadas: number,
        public mtoIGV:number,
        public totalImpuestos:number,
        public valorVenta:number,
        public mtoImpVenta:number,
        public mtoOperExoneradas:number,
        public ublVersion: string,
        public details:Array<Details>,
        public legends:[{
            code: string,
            value: string
            }]
        ){}
}