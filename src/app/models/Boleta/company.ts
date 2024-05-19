export class Company {
    constructor(
        public ruc: string,
        public razonSocial: string,
        public address:{
        ubigueo: string,
        codigoPais: string,
        departamento: string,
        provincia: string,
        distrito: string,
        urbanizacion: string,
        direccion: string}
    ){}
}