export class DetalleVenta {
    constructor( 
        public codProducto: string,
        public  unidad: string,
        public  descripcion:string,
        public  cantidad:number,
        public  peso:number,
        public  mtoValorUnitario: number,
        public mtoValorVenta: number,
        public mtoBaseIgv: number,
        public porcentajeIgv: number,
        public codProductob:any,
        public igv: number,
        public tipAfeIgv: number,
        public totalImpuestos: number,
        public mtoPrecioUnitario: number,
        public unidadmedida:string
    ){}
}