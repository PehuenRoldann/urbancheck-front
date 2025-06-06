import { Component, OnInit, ViewChild } from "@angular/core";
import { TicketDataService } from "src/app/interfaces/ticket-data-service";
import { GeolocationService } from "src/app/services/geolocation.service";
import { TicketDataJsonService } from "src/app/services/ticket-data-json.service";
/* import mapboxgl from 'mapbox-gl'; */

declare var bootstrap: any;

@Component({
  selector: 'app-map-common',
  templateUrl: './map-common.component.html',
  styleUrls: ['./map-common.component.css'],
})
export class MapCommonComponent implements OnInit {
  public currentCoorsd: { lng: number; lat: number } = { lng: 0, lat: 0 };
  public mapStatus!: number;

  constructor(
    private geoService: GeolocationService,
    private ticketDataService: TicketDataJsonService
  ) {}

  async ngOnInit(): Promise<void> {
    this.geoService.initializeMap('map');

    this.geoService.lastCoords$.subscribe((coords) => {
      if (coords.lng != 0 && coords.lat != 0) {
        this.currentCoorsd = coords;
        this.openModal('newTicketConfModal');
      }
    });

    this.geoService.mapStatus$.subscribe((status) => {
      this.mapStatus = status;
    });

    this.geoService.lastMarkerClickedSubject$.subscribe((markerData) => {
      console.log("Marker data: " + markerData);
      
      this.openModal('ticketViewModal');
    })

    let markersData = await this.ticketDataService.GetMarkers();
    this.geoService.DrawMarkers(markersData);
  }

  /**
   * Available Modals:
   * - newTicketConfModal
   * @param modalID modal's HTML element ID to open
   */
  public openModal(modalID: string) {
    const modalElement = document.getElementById(modalID);

    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement); // Usa el servicio de Bootstrap para abrir el modal
      modal.show();
    }
  }

  public removeLastMark(event?: Event): void {
    this.geoService.removeLastMark();
  }
}
