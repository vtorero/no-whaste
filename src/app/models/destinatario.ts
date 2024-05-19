export class Destinatario {
    constructor(
        public id:number,
        public tipoDoc: string,
        public numDoc: string,
        public rznSocial: string,
        public address: {direccion: string}
        ){}
}
