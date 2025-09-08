import { Component, Inject, Input, OnDestroy } from '@angular/core';
import { Subject, EMPTY } from 'rxjs';
import { switchMap, takeUntil, tap, catchError } from 'rxjs/operators';
import {
  TICKET_SERVICE_INTERFACE_TOKEN,
  TicketServiceInterface,
} from '@app/interfaces/ticket.service.interface';
import {
  MAP_SERVICE_INTERFACE_TOKEN,
  MapServiceInterface,
} from '@app/interfaces/map.service.interface';
import { Ticket } from '@app/interfaces/ticket.interface';
import { TicketSatusService } from '@app/services/ticket-satus.service';
import { TicketStatus } from '@app/interfaces/ticket_status.interface';

import { Priorities, Statuses } from '@app/utils/consts';

@Component({
  selector: 'app-ticket-visualizer-component',
  templateUrl: './ticket-visualizer-component.component.html',
  styleUrls: ['./ticket-visualizer-component.component.css'],
})
export class TicketVisualizerComponentComponent implements OnDestroy {
  @Input() userRoleId: number | null = null;

  ticketStates: TicketStatus[] = [];

  private _ticketId: string | null = null;
selectedStateToUpdate: any;
  @Input()
  set ticketId(value: string | null) {
    if (this._ticketId === value) return;
    this._ticketId = value;

    if (value) {
      // Arranca el loading y pedí los datos del ticket
      this.isLoading = true;
      this.ticketData = null;
      this.address = 'No encontrado';
      this.ticketDataService.UpdateTicketData(value);
    }
  }
  get ticketId() {
    return this._ticketId;
  }

  get statusList() {
    return Array.from(Statuses.values());
  }

  get currentStatus (): string | undefined {
    return this.ticketData?.current_status?.description;
  }

  public ticketData: Ticket | null = null;
  address: string = 'No encontrado';
  isLoading = false;

  private destroy$ = new Subject<void>();

  administrationRoles = [1, 3, 4, 2]; // IDs de roles que tienen permisos de administración

  get canAdminister(): boolean {
    return (
      this.userRoleId !== null &&
      this.administrationRoles.includes(this.userRoleId)
    );
  }

  constructor(
    @Inject(TICKET_SERVICE_INTERFACE_TOKEN)
    private ticketDataService: TicketServiceInterface,
    @Inject(MAP_SERVICE_INTERFACE_TOKEN)
    private mapService: MapServiceInterface,
  ) {
    // 1) Escuchá el ticket
    this.ticketDataService.ticketData$
      .pipe(
        tap((td) => {
          this.ticketData = td || null;

          // cuando llega el ticket, si hay coords, pedí dirección
          if (td && td.latitude != null && td.longitude != null) {
            this.mapService.UpdateAddressFromCoords(td.latitude, td.longitude);
          } else {
            this.address = 'No encontrado';
            // si no hay coords, ya podemos apagar el loading
            this.isLoading = false;
          }
        }),
        // 2) Luego esperá la dirección
        switchMap((td) => {
          if (td && td.latitude != null && td.longitude != null) {
            return this.mapService.addressFromCoords$;
          }
          return EMPTY;
        }),
        takeUntil(this.destroy$),
        catchError((err) => {
          console.error('Error obteniendo datos:', err);
          this.isLoading = false;
          return EMPTY;
        })
      )
      .subscribe((addr) => {
        this.address = addr ?? 'No encontrado';
        this.selectedStateToUpdate = this.currentStatus;
        this.isLoading = false; // apagamos cuando ya tenemos dirección
      });

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get dateFromTicket(): string {
    const its = this.ticketData?.its;
    if (!its) return '';
    const date = new Date(its);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  updateTicket() {
    console.log('Update ticket clicked');
  }
}
