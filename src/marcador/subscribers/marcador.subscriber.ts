import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
  RemoveEvent,
  DataSource,
} from 'typeorm';
import { Marcador } from '../entities/marcador.entity';
import { MarcadorHistorial } from '../entities/marcador-historial.entity';

@EventSubscriber()
export class MarcadorSubscriber implements EntitySubscriberInterface<Marcador> {
  constructor(private dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Marcador;
  }

  async beforeUpdate(event: UpdateEvent<Marcador>) {
    // Solo crear historial si se están actualizando campos básicos del marcador
    // (no cuando se actualizan solo las relaciones)
    if (event.entity && event.entity.id) {
      const marcadorActual = await event.manager.findOne(Marcador, {
        where: { id: event.entity.id },
        relations: [
          'integrantes',
          'integrantes.salud',
          'programas',
          'estudios',
          'ocupaciones',
          'viviendas',
          'servicios',
          'salud',
        ],
      });

      if (marcadorActual) {
        // Solo crear historial si hay cambios en campos básicos
        const camposBasicos = ['nombre', 'apellido', 'direccion', 'telefono', 'dni', 'barrio', 'tiempo_residencia', 'notas', 'latitud', 'longitud', 'icono'];
        const hayCambiosBasicos = camposBasicos.some(campo => 
          event.entity[campo] !== undefined && event.entity[campo] !== marcadorActual[campo]
        );

        if (hayCambiosBasicos) {
          const historial = new MarcadorHistorial(marcadorActual);
          historial.tipo_operacion = 'UPDATE';
          
          await event.manager.save(MarcadorHistorial, historial);
        }
      }
    }
  }

  async beforeRemove(event: RemoveEvent<Marcador>) {
    if (event.entity) {
      // Cargar el marcador completo antes de eliminarlo
      const marcadorCompleto = await event.manager.findOne(Marcador, {
        where: { id: event.entity.id },
        relations: [
          'integrantes',
          'integrantes.salud',
          'programas',
          'estudios',
          'ocupaciones',
          'viviendas',
          'servicios',
          'salud',
        ],
      });

      if (marcadorCompleto) {
        const historial = new MarcadorHistorial(marcadorCompleto);
        historial.tipo_operacion = 'DELETE';
        
        await event.manager.save(MarcadorHistorial, historial);
      }
    }
  }
}