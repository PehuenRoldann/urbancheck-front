import { Component, Inject, Input, OnInit } from "@angular/core";
import {
  TICKET_SERVICE_INTERFACE_TOKEN,
  TicketServiceInterface,
} from "src/app/interfaces/ticket.service.interface";
import {
  MAP_SERVICE_INTERFACE_TOKEN,
  MapServiceInterface,
} from "src/app/interfaces/map.service.interface";
import { emptyTicket, Ticket } from "@app/interfaces/ticket.interface";
import { delay } from "rxjs";

@Component({
  selector: "app-ticket-view-modal",
  templateUrl: "./ticket-view-modal.component.html",
  styleUrls: ["./ticket-view-modal.component.css"],
})
export class TicketViewModalComponent implements OnInit {
  @Input({ required: true }) modalId: string = "";
  isTicketLoaded: boolean = false;
  ticket!: Ticket;
  isAddressLoaded: boolean = false;
  address: string = "No encontrado";

  constructor(
    @Inject(TICKET_SERVICE_INTERFACE_TOKEN)
    private ticketDataService: TicketServiceInterface,
    @Inject(MAP_SERVICE_INTERFACE_TOKEN)
    private mapService: MapServiceInterface,
  ) {}

  ngOnInit(): void {
    this.mapService.addressFromCoords$.subscribe((address) => {
      this.address = address;
      delay(2000);
      this.isAddressLoaded = true;
    });

    this.ticketDataService.ticketData$.subscribe((data) => {
      
      if (data == null){
        this.ticket = emptyTicket();
      }
      else {
        this.ticket = data;
      }

      this.mapService.UpdateAddressFromCoords(this.ticket?.latitude!, this.ticket?.longitude!);
      this.isTicketLoaded = true;
    });
  }

  GetTicketWithId(id: string): void {
    this.isTicketLoaded = false;
    this.isAddressLoaded = false;
    this.ticketDataService.UpdateTicketData(id);
  }

  ResetConditions(): void {
    this.isTicketLoaded = false;
    this.isAddressLoaded = false;
  }

  get dateFromTicket(): string {
    let date = new Date(this.ticket!.its!);
    const day = String(date.getDate()).padStart(2, "0"); // Obtiene el día y lo formatea a 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Obtiene el mes (0-11) y lo ajusta a 1-12
    const year = date.getFullYear(); // Obtiene el año
    return `${day}/${month}/${year}`; // Retorna la fecha en formato "DD/MM/YYYY"
  }
}
