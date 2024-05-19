export class Factura {
    constructor(
    public xml: string,
    public hash: string,
    public success: string,
    public code: string,
    public zip: string,
    public numero: string,
    public message:string
    ){}
}