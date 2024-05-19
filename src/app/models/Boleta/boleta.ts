import { Client } from "./cliente";
import { Company } from "./company";
import { Cuota } from "./cuota";
import { Details } from "./details";
export class Boleta {
    constructor(
        public comprobante:string,
        public tipoOperacion:string,
        public tipoDoc:string,
        public serie:string,
        public correlativo:string,
        public fechaEmision:Date,
        public tipoMoneda:string,
        public client:Client,
        public company:Company,
        public mtoOperGravadas: number,
        public mtoIGV:number,
        public totalImpuestos:number,
        public valorVenta:number,
        public mtoImpVenta:number,
        public subTotal:number,
        public mtoOperExoneradas:number,
        public mtoOperGratuitas:number,
        public mtoIGVGratuitas:number,
        public ublVersion: string,
        public details:Array<Details>,
        public legends:[{
            code: string,
            value: string
            }],
      public formaPago: {
                moneda: string,
                tipo: string,
                monto:number
              },
        public cuotas:Array<Cuota>
        ){}
}

