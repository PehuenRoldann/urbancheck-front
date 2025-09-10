import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  TicketServiceInterface,
  TICKET_SERVICE_INTERFACE_TOKEN,
} from 'src/app/interfaces/ticket.service.interface';
import {
  MapServiceInterface,
  MAP_SERVICE_INTERFACE_TOKEN,
} from 'src/app/interfaces/map.service.interface';

import { TicketViewModalComponent } from '../ticket-view-modal/ticket-view-modal.component';
import { MarkerData } from 'src/app/models/markerData';
import { User } from '@app/interfaces/user.interface';
import { UserService } from '@app/services/user.service';
import { Router } from '@angular/router';

declare var bootstrap: any;

export const enum ModalIds {
  adminPanel,
  ticketCreationModal,
  ticketViewModal,
  profileModal,
}

@Component({
  selector: 'app-map-common',
  templateUrl: './map-common.component.html',
  styleUrls: ['./map-common.component.css'],
})
export class MapCommonComponent implements OnInit, OnDestroy {
  public currentCoorsd: { lng: number; lat: number } = { lng: 0, lat: 0 };
  public mapStatus!: number;
  @ViewChild(TicketViewModalComponent)
  ticketViewModal!: TicketViewModalComponent;
  public markersData!: MarkerData[];
  public userData: User | null = null;

  private destroy$ = new Subject<void>();

  public modalIds: Record<ModalIds, string> = {
    [ModalIds.adminPanel]: 'adminPanel',
    [ModalIds.ticketCreationModal]: 'ticketCrationModal',
    [ModalIds.ticketViewModal]: 'ticketViewModal',
    [ModalIds.profileModal]: 'profileModal',
  };
  public showSidePanel: boolean = false;
  public selectedTicketId: string | null = null;

  constructor(
    @Inject(TICKET_SERVICE_INTERFACE_TOKEN)
    private ticketDataService: TicketServiceInterface,
    @Inject(MAP_SERVICE_INTERFACE_TOKEN)
    private geoService: MapServiceInterface,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.userData = await this.userService.getUserData();
    this.userData.role!.id = Number(this.userData.role!.id);

    console.log('DEBUG ROLE USER');
    console.log(this.userData.role);

    this.geoService.initializeMap('map');

    this.geoService.lastCoords$
      .pipe(takeUntil(this.destroy$))
      .subscribe((coords) => {
        if (coords.lng != 0 && coords.lat != 0) {
          this.currentCoorsd = coords;
          this.openModal(this.modalIds[1]);
        }
      });

    this.geoService.mapStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.mapStatus = status;
      });

    this.geoService.lastMarkerClickedSubject$
      .pipe(takeUntil(this.destroy$))
      .subscribe((markerData) => {
        if (markerData && markerData.id) {
          this.selectedTicketId = markerData.id;
          this.showSidePanel = true;
        }
      });

    this.ticketDataService.markersData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((markerDataRes) => {
        this.markersData = markerDataRes.length > 0 ? markerDataRes : [];
        this.geoService.DrawMarkers(this.markersData);
      });

    this.ticketDataService.UpdateMarkersData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Available Modals:
   * - newTicketConfModal
   * @param modalID modal's HTML element ID to open
   */
  public openModal(modalID: string) {
    const modalElement = document.getElementById(modalID);

    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  public removeLastMark(event?: Event): void {
    this.geoService.removeLastMark();
  }

  showAlert(message: string, type: string): void {
    const alert = document.createElement('div');
    alert.classList.add(
      'alert',
      `alert-${type}`,
      'alert-dismissible',
      'fade',
      'show'
    );
    alert.setAttribute('role', 'alert');
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 5000);
  }

  onTicketCreated(result: any): void {
    this.ticketDataService.UpdateMarkersData();
  }

  goToAdminPanel() {
    this.router.navigate(['/admin']);
  }

  onTicketUpdated($event: Event) {
    console.log('No se puede actualizar el ticket.');
  }

  closeSidePanel() {
    this.showSidePanel = false;
  }
}
