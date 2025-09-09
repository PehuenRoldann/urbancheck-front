import { Component, Input } from '@angular/core';
import { Ticket } from '@app/models/ticket';
import { TicketStates } from 'src/app/models/ticketStates';

@Component({
  selector: 'app-pill',
  templateUrl: './pill.component.html',
  styleUrls: ['./pill.component.css'],
})
export class PillComponent {
  @Input({ required: true }) ticketState!: string;

  removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  COLOR_MAP_HEX = new Map<string, string>([
    [TicketStates.Pendiente, '#FFD93D'], // Amarillo fuerte
    [TicketStates.Valido, '#4CAF50'], // Verde aprobado
    [TicketStates.Rechazado, '#E53935'], // Rojo error
    [TicketStates.Programada, '#2196F3'], // Azul info
    [TicketStates.Resuleto, '#1976D2'], // Azul oscuro
    [TicketStates.Finalizado, '#9E9E9E'], // Gris medio
    [TicketStates.Cancelado, '#6D4C41'], // Marrón apagado
    [TicketStates.Derivado, '#BDBDBD'], // Gris claro
  ]);

  COLOR_FONT_MAP = new Map<string, string>([
    [TicketStates.Pendiente, '#212121'], // Texto negro sobre amarillo
    [TicketStates.Valido, '#FFFFFF'], // Blanco sobre verde
    [TicketStates.Rechazado, '#FFFFFF'], // Blanco sobre rojo
    [TicketStates.Programada, '#FFFFFF'], // Blanco sobre azul
    [TicketStates.Resuleto, '#FFFFFF'], // Blanco sobre azul oscuro
    [TicketStates.Finalizado, '#212121'], // Negro sobre gris medio
    [TicketStates.Cancelado, '#FFFFFF'], // Blanco sobre marrón
    [TicketStates.Derivado, '#212121'], // Negro sobre gris claro
  ]);
}
