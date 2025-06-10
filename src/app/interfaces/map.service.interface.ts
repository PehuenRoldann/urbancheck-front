import { Observable } from 'rxjs';
import { MarkerData } from '../models/markerData';
import { InjectionToken } from '@angular/core';


export interface MapServiceInterface {
  // Public observable for the component to subscribe to
  lastCoords$: Observable<{ lng: number; lat: number }>;
  mapStatus$: Observable<number>;
  lastMarkerClickedSubject$: Observable<MarkerData>;
  addressFromCoords$: Observable<string>;


  initializeMap(mapElementId: string): Promise<void>;
  removeLastMark(): void;
  updateCoords(newCoords: { lng: number; lat: number }): void;
  DrawMarkers(markersData: MarkerData[]): void;
  updateLastMarkerClicked(markerData: MarkerData): void;
  UpdateAddressFromCoords(latitude: number, longitude: number): void
  // getAddressFromCoordinates(latitude: number, longitude: number): Observable<any> 
}

// Crea el token de inyección
export const MAP_SERVICE_INTERFACE_TOKEN =
  new InjectionToken<MapServiceInterface>('IGeolocationService');
