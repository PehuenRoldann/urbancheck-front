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

import { Priorities, Statuses, RolesMap } from '@app/utils/consts';
import { findKeyByValue, formatForDateInput } from '@app/utils/utils';
import { StatusHistory } from '@app/interfaces/status_history.interface';
import { IssuesService } from '@app/services/issues.service';
import { Issue } from '@app/interfaces/issue.interface';
@Component({
  selector: 'app-ticket-visualizer-component',
  templateUrl: './ticket-visualizer-component.component.html',
  styleUrls: ['./ticket-visualizer-component.component.css'],
})
export class TicketVisualizerComponentComponent implements OnDestroy {
  @Input() userRoleId: number | null = null;

  private _ticketId: string | null = null;
  selectedStateToUpdate: any;
  selectedPriorityToUpdate: any;
  selectedScheduledDate: any;
  selectedIssue: any;

  statusHistory: StatusHistory[] = [];
  issuesList: Issue[] = [];

  @Input()
  set ticketId(value: string | null) {
    if (this._ticketId === value) return;
    this._ticketId = value;

    if (value) {
      // Arranca el loading y pedí los datos del ticket
      this.isLoading = true;
      this.isAddressLoaded = false;
      this.isHistoryLoaded = false;
      this.ticketData = null;
      this.address = 'No encontrado';
      this.ticketDataService.UpdateTicketData(value);
      this.ticketSatusService.UpdateStatusHistoryByTicketId(value);
    }
  }
  get ticketId() {
    return this._ticketId;
  }

  get rolesMap() {
    return RolesMap;
  }

  get statusList() {
    return Array.from(Statuses.values());
  }

  get priorityList() {
    return Array.from(Priorities.values());
  }

  get currentStatus(): string | undefined {
    return this.ticketData?.current_status?.description === 'V_lido'
      ? 'Válido'
      : this.ticketData?.current_status?.description;
  }

  get currentPriority(): string | undefined {
    return this.ticketData?.current_priority?.description;
  }

  get currentScheduledDate(): string | undefined {
    return (
      formatForDateInput(this.ticketData?.scheduled_resolution_at) ?? undefined
    );
  }

  get currentIssue(): string | undefined {
    return this.ticketData?.issue?.description;
  }

  public ticketData: Ticket | null = null;
  address: string = 'No encontrado';
  isLoading = true;
  isAddressLoaded = false;
  isHistoryLoaded = false;

  private destroy$ = new Subject<void>();

  administrationRoles = [1, 3, 4]; // IDs de roles que tienen permisos de administración

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
    private ticketSatusService: TicketSatusService,
    private issuesService: IssuesService
  ) {
    this.issuesService.issuesList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((issues) => {
        this.issuesList = issues;
      });

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
        this.selectedPriorityToUpdate = this.currentPriority;
        this.selectedScheduledDate = this.currentScheduledDate;
        this.selectedIssue = this.currentIssue;
        this.isAddressLoaded = true;
      });

    this.ticketSatusService.statusHistory$
      .pipe(takeUntil(this.destroy$))
      .subscribe((sh) => {
        this.statusHistory = sh;
        this.isHistoryLoaded = true;
      });

    // Cuando estén cargados los datos y la dirección, apagá el loading
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
    const date =
      this.selectedScheduledDate === this.currentScheduledDate
        ? null
        : new Date(this.selectedScheduledDate + 'T00:00:00');

    const statusId =
      this.selectedStateToUpdate === this.currentStatus
        ? null
        : findKeyByValue(Statuses, this.selectedStateToUpdate);

    const priorityId =
      this.selectedPriorityToUpdate === this.currentPriority
        ? null
        : findKeyByValue(Priorities, this.selectedPriorityToUpdate);

    const issueId =
      this.selectedIssue === this.currentIssue
        ? null
        : this.issuesList.find(
            (issue) => issue.description === this.selectedIssue
          )?.id ?? null;

    console.log('IssueId seleccionado: ', issueId);

    this.ticketDataService.UpdateCurrentTicketWithNewInfo(
      date,
      statusId,
      priorityId,
      issueId
    );
    this.ticketDataService.UpdateTicketData(this.ticketData!.id);
  }
}
