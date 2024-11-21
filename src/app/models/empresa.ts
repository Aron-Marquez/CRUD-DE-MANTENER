export class Empresa {
    id: number;
    razon_social: string;
    sector: string;
    ruc: string;
    direccion: string;
    representante_legal: string;
    estado: string;

    constructor(
        id: number = 0,
        razon_social: string = '',
        sector: string = '',
        ruc: string = '',
        direccion: string = '',
        representante_legal: string = '',
        estado: string = ''
    ) {
        this.id = id;
        this.razon_social = razon_social;
        this.sector = sector;
        this.direccion = direccion;
        this.representante_legal = representante_legal;
        this.ruc = ruc;
        this.estado = estado;
    }
}
