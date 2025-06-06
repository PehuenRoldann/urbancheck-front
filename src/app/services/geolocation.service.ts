import { Injectable } from "@angular/core";
import mapboxgl, { ErrorEvent, Marker } from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { MarkerData } from "../models/markerData";
// import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
// import { MapboxAddressAutofill, MapboxSearchBox, config} from '@mapbox/search-js-web';


// declare var bootstrap: any;

@Injectable({
  providedIn: "root",
})
export class GeolocationService {

  private map!: mapboxgl.Map;

  private lastMark!: mapboxgl.Marker;

  // private lastCoords: {lng: number, lat: number} = {lng: -1, lat: -1};
  // BehaviorSubject to store the coordinates
  private lastCoordsSubject: BehaviorSubject<{ lng: number; lat: number }> =
    new BehaviorSubject<{ lng: number; lat: number }>({ lng: 0, lat: 0 });

  // Public observable for the component to subscribe to
  public lastCoords$: Observable<{ lng: number; lat: number }> =
    this.lastCoordsSubject.asObservable();

  private mapStatusSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  public mapStatus$: Observable<number> = this.mapStatusSubject.asObservable();


  // Observabole que permite saber cual fue el último marcador 
  // clickeado, sin traspasar lógica de mapbox
  private lastMarkerClickedSubject: BehaviorSubject<MarkerData> =
    new BehaviorSubject<MarkerData>({id: -1, lng: 0, lat: 0});
  public lastMarkerClickedSubject$: Observable<MarkerData> = this.lastMarkerClickedSubject.asObservable();

  private ACCESS_TOKEN: string = environment.mapboxApiKey;

  constructor() {}

  private async getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true, // Solicita alta precisión
          timeout: 30000, // Tiempo máximo de espera (10 segundos)
          maximumAge: 0, // Fuerza la obtención de coordenadas actualizadas
        });
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  }

  /**
   * Initialize the map that is going to be displayed.
   * @param mapElementId Html element's ID that is going to contain the map.
   */
  public async initializeMap(mapElementId: string): Promise<void> {
    //var coords = await this.getCurrentLocation();
    // var lat = coords.coords.latitude;
    // var long = coords.coords.longitude;
    var lat = -32.48470779962758;
    var long = -58.232117852366656;
    mapboxgl.accessToken = this.ACCESS_TOKEN;
    console.log("API KEY: " + this.ACCESS_TOKEN);
    try {
      const map = new mapboxgl.Map({
        container: "map", // container ID
        style: "mapbox://styles/mapbox/streets-v12", // style URL
        center: [long, lat], // starting position [lng, lat]
        zoom: 13, // starting zoom
      });


      this.map = map;

      var geocoder = new MapboxGeocoder({
        accessToken: this.ACCESS_TOKEN,
        mapboxgl: mapboxgl,
      });

      geocoder.onAdd(map).classList.add("custom-geocoder");

      map.addControl(geocoder, "top-left");

      // Add geolocate control to the map.
      map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            // When active the map will receive updates to the device's location as it changes.
            trackUserLocation: true,
            // Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: true
        })
      , "top-right");

      // Actualizar las coordenadas solo al hacer clic en el mapa
      map.on("click", (event: mapboxgl.MapMouseEvent) => {
        
        const clickedCoords = event.lngLat;
        this.addMarker(clickedCoords);
        this.updateCoords({ lng: clickedCoords.lng, lat: clickedCoords.lat });
      });

      this.mapStatusSubject.next(1);

    } catch (error) {
      console.log("Error while loading the map: " + error);
      this.mapStatusSubject.next(2);
      alert("There was an error loading the map. Please try again later.");
    }
  }

  // Método para añadir un marcador en la posición clicada
  private addMarker(lngLat: mapboxgl.LngLat): void {
    // Eliminar la última marca si existe
    if (this.lastMark) {
      this.removeLastMark();
    }

    // Crear una nueva marca y añadirla al mapa
    this.lastMark = new mapboxgl.Marker().setLngLat(lngLat).addTo(this.map);
  }

  public removeLastMark(): void {
    this.lastMark.remove();
  }

  // Method to update coordinates
  updateCoords(newCoords: { lng: number; lat: number }): void {
    this.lastCoordsSubject.next(newCoords);
  }



  DrawMarkers(markersData: MarkerData[]): void {

    let markers = new Array<Marker>();
            
    markersData.forEach(marker => {
      let markerMapbox = new Marker();
      markerMapbox.setLngLat(new mapboxgl.LngLat(marker.lng, marker.lat));

      markerMapbox.getElement().addEventListener('click', (event) => {

        event.stopPropagation();
        this.updateLastMarkerClicked(marker);
      })

      markerMapbox.addTo(this.map);
    });

  }


  updateLastMarkerClicked(markerData: MarkerData): void {

    this.lastMarkerClickedSubject.next(markerData);
  }
}
