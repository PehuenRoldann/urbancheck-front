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
    [TicketStates.Pendiente, '#FFF7C2'], // Amarillo pastel
    [TicketStates.Valido, '#C8E6C9'], // Verde pastel
    [TicketStates.Rechazado, '#FFCDD2'], // Rojo pastel
    [TicketStates.Programada, '#BBDEFB'], // Azul pastel
    [TicketStates.Resuleto, '#C5CAE9'], // Azul oscuro pastel
    [TicketStates.Finalizado, '#E0E0E0'], // Gris claro
    [TicketStates.Cancelado, '#D7CCC8'], // Marrón claro
    [TicketStates.Derivado, '#F5F5F5'], // Gris casi blanco
    [TicketStates.Cuestionada, '#E1BEE7'], // Violeta pastel
  ]);

  COLOR_FONT_MAP = new Map<string, string>([
    [TicketStates.Pendiente, '#FFD93D'], // Amarillo fuerte
    [TicketStates.Valido, '#4CAF50'], // Verde fuerte
    [TicketStates.Rechazado, '#E53935'], // Rojo fuerte
    [TicketStates.Programada, '#2196F3'], // Azul fuerte
    [TicketStates.Resuleto, '#1976D2'], // Azul oscuro fuerte
    [TicketStates.Finalizado, '#424242'], // Gris oscuro para contraste
    [TicketStates.Cancelado, '#6D4C41'], // Marrón fuerte
    [TicketStates.Derivado, '#616161'], // Gris medio
    [TicketStates.Cuestionada, '#5D0A8D'], // Violeta fuerte
  ]);
}
