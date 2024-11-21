import { Persona } from "./persona";

export class Estudiante {
    id: number;
  codigo: string;
  persona: Persona;

  constructor(
    id: number = 0,
    codigo: string = '',
    persona: Persona = new Persona()
  ) {
    this.id = id;
    this.codigo = codigo;
    this.persona = persona;
  }
}
