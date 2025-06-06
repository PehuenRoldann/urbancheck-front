import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ticket-view-modal',
  templateUrl: './ticket-view-modal.component.html',
  styleUrls: ['./ticket-view-modal.component.css']
})
export class TicketViewModalComponent {

    @Input({required: true}) modalId: string = "";

    isTicketLoaded: boolean = false;

}
