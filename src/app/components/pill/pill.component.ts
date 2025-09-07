import { Component, Input } from '@angular/core';
import { Ticket } from '@app/models/ticket';
import { TicketStates } from 'src/app/models/ticketStates';

@Component({
  selector: 'app-pill',
  templateUrl: './pill.component.html',
  styleUrls: ['./pill.component.css']
})
export class PillComponent {

  @Input({required: true}) ticketState!: string;

  removeAccents(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  COLOR_MAP_HEX = new Map<string, string>([
    [TicketStates.Pendiente, '#FFE700'],
    [TicketStates.Valido, '#FF9D3D'],
    [TicketStates.Rechazado, '#CC2B52'],
    [TicketStates.Programada, '#9EDF9C'],
    [TicketStates.Resuleto, '#608BC1'],
    [TicketStates.Finalizado, '#CBDCEB'],
    [TicketStates.Cancelado, '#AF1740'],
    [TicketStates.Derivado, '#D3D3D3'],

  ]);

  COLOR_FONT_MAP = new Map<string, string>([
    [TicketStates.Pendiente, '#030303'],
    [TicketStates.EnRevision, '#EFEFF0'],
    [TicketStates.Rechazado, '#EFEFF0'],
    [TicketStates.Demorado, '#EFEFF0'],
    [TicketStates.Programada, '#EFEFF0'],
    [TicketStates.Reprogramado, '#EFEFF0'],
    [TicketStates.Resuleto, '#EFEFF0'],
    [TicketStates.Finalizado, '#EFEFF0'],
    [TicketStates.Cancelado, '#EFEFF0'],
    [TicketStates.Derivado, '#030303'],
  ])

}
