import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ticket-visualizer-component',
  templateUrl: './ticket-visualizer-component.component.html',
  styleUrls: ['./ticket-visualizer-component.component.css']
})
export class TicketVisualizerComponentComponent {

  @Input() ticketId: string | null = null;

}
