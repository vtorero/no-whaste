import { Transportista } from "./transportista";

export class Envio {
    constructor(
    public modTraslado:string,
    public codTraslado:string,
    public desTraslado:string,
    public fecTraslado:string,
    public codPuerto:string,
    public indTransbordo:string,
    public pesoTotal:number,
    public undPesoTotal:string,
    public numBultos :number,
    public partida:{
            ubigueo:string,
            direccion: string,
    },
    public llegada:{
        ubigueo:string,
        direccion: string,
},
 public transportista:Transportista

    ){}
}