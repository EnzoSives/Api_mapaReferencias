export class CreateMarcadorSegDto {
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  dni: string;
  notas?: string;
  latitud: number;
  longitud: number;
  icono: string;
  fechaCreacion: Date;
}