export class Persona {
    id:number;
    nombre:string;
    apellido:string;
    dni:string;
    correo:string;
    telefono:string;
    estado:string;
    constructor(id:number = 0, nombre:string='', apellido:string='', dni:string='', correo:string='', telefono:string='', estado:string=''){
        this.id=id;
        this.nombre=nombre;
        this.apellido=apellido;
        this.dni=dni;
        this.correo=correo;
        this.telefono=telefono;
        this.estado=estado;
    }

}
